"""CourseGraph MCP sunucusu (stdio).

opencode / Claude / Cursor gibi ajanlar için ders bilgi grafiği araçları.
Çalıştırma: python -m coursegraph.server
"""
from __future__ import annotations

import json
from pathlib import Path

from fastmcp import FastMCP

from .graph import load
from .indexer import write_index

mcp = FastMCP(
    "coursegraph",
    instructions=(
        "CourseGraph: Açık İlahiyat ders bilgi grafiği. "
        "Ders, bölüm, kavram, quiz ve vize/final/yaz sınavlarını sorgula. "
        "Araçları doğrudan kullan; dosya dosya tarama yerine graf kullan."
    ),
)


def _fmt(obj) -> str:
    return json.dumps(obj, ensure_ascii=False, indent=2)


@mcp.tool
def coursegraph_stats() -> str:
    """Graf boyutu ve tip dağılımı (hızlı genel bakış)."""
    return _fmt(load().stats())


@mcp.tool
def course_explore(query: str) -> str:
    """Sorguya göre surgical context: en iyi bölüm/kavram/quiz eşleşmeleri ve komşuları.

    Kullanım: "mezhep nedir", "Lozan", "ünlu uyumu", "Cemel" gibi sorular.
    """
    return _fmt(load().explore(query))


@mcp.tool
def course_search(query: str, limit: int = 15) -> str:
    """Ders metinlerinde hızlı arama (bölüm, kavram, quiz, sınav, artifact)."""
    return _fmt(load().search(query, limit=limit))


@mcp.tool
def course_impact(term: str) -> str:
    """Bir terim/kavram hangi bölümleri, quiz ve sınav sorularını etkiliyor?"""
    return _fmt(load().impact(term))


@mcp.tool
def course_overview(slug: str) -> str:
    """Ders genel görünümü: üniversite, dönem, bölümler, quiz, sınavlar.

    slug: ataturk-ilkeleri-1 | turk-dili-1 | islam-mezhepleri-tarihi
    """
    return _fmt(load().course_overview(slug))


@mcp.tool
def chapter_detail(course: str, chapter: int) -> str:
    """Bölüm detayı: özet, hedefler, kavramlar, timeline, kaynaklar.

    course: ders slug'ı; chapter: 1-based bölüm numarası.
    """
    return _fmt(load().chapter_detail(course, chapter))


@mcp.tool
def coursegraph_rebuild() -> str:
    """Grafiği ve zihin haritalarını kaynaklardan yeniden oluştur."""
    from .watch import rebuild_all

    import coursegraph.graph as gg

    gg._cache = None
    return _fmt(rebuild_all())


@mcp.tool
def course_mindmap(course: str, mindmap_id: str | None = None) -> str:
    """Ders zihin haritası (JSON): panel ağacı, bölüm ağacı, NotebookLM haritaları, graf türevi.

    course: ataturk-ilkeleri-1 | turk-dili-1 | islam-mezhepleri-tarihi
    mindmap_id: opsiyonel (panel-tree | panel-chapters | nl-01... | graph-derived)
    HTML: coursegraph/index/mindmaps/<course>.html
    """
    path = Path(__file__).resolve().parent / "index" / "mindmaps" / f"{course}.json"
    if not path.exists():
        # dene: rebuild
        from .mindmap import build_mindmaps

        build_mindmaps(load())
    if not path.exists():
        return _fmt({"error": "mindmap yok", "course": course})
    data = json.loads(path.read_text(encoding="utf-8"))
    if mindmap_id:
        maps = [m for m in data.get("mindmaps", []) if m.get("id") == mindmap_id]
        if not maps:
            return _fmt({"error": "mindmap_id bulunamadı", "available": [m["id"] for m in data.get("mindmaps", [])]})
        data = {**data, "mindmaps": maps}
    return _fmt(data)


@mcp.tool
def course_mindmap_index() -> str:
    """Tüm ders zihin haritalarının listesi."""
    path = Path(__file__).resolve().parent / "index" / "mindmaps" / "index.json"
    if not path.exists():
        from .mindmap import build_mindmaps

        build_mindmaps(load())
    return _fmt(json.loads(path.read_text(encoding="utf-8")))


@mcp.tool
def past_exam_coverage(course: str = "islam-mezhepleri-tarihi") -> str:
    """Çıkmış vize sorularının ünite/anahtar kelime dağılımı (hangi üniteye kadar sorumlu).

    AÖF İslâm Mezhepleri Tarihi için: ünite başına soru sayısı, yıllar, örnekler, site bölümleri.
    """
    from .past_exams import unit_coverage

    cov = unit_coverage(course)
    out = {
        "course": course,
        "exam_type": "vize (ara sınav)",
        "units": [cov[u] for u in sorted(cov)],
        "scope_hint": "Çoğu yıl U1-U5 (Şiîlik I); U6'ya temas sınırlı; U7-10 çıkmadı.",
    }
    return _fmt(out)


def main() -> None:
    # ilk açılışta index yoksa üret
    idx = Path(__file__).resolve().parent / "index" / "graph.json"
    if not idx.exists():
        write_index()
    mcp.run()


if __name__ == "__main__":
    main()
