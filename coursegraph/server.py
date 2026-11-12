"""CourseGraph MCP sunucusu (stdio, stdlib-only).

opencode / Claude / Cursor gibi ajanlar için ders bilgi grafiği araçları.
Çalıştırma: python -m coursegraph.server

MCP stdio taşıması satır başına bir JSON-RPC 2.0 iletisidir; dış bağımlılık yoktur.
"""
from __future__ import annotations

import json
import sys
import traceback
from pathlib import Path

from .graph import load
from .indexer import write_index

PROTOCOL_VERSION = "2025-06-18"
SERVER_INFO = {"name": "coursegraph", "version": "1.0.0"}
INSTRUCTIONS = (
    "CourseGraph: Açık İlahiyat ders bilgi grafiği. "
    "Ders, bölüm, kavram, quiz ve vize/final/yaz sınavlarını sorgula. "
    "Araçları doğrudan kullan; dosya dosya tarama yerine graf kullan."
)

_TOOLS: list[dict] = []


def tool(name: str, description: str, schema: dict | None = None):
    """Aracı kaydeder; inputSchema fonksiyonun beklediği argümanları anlatır."""

    def register(fn):
        _TOOLS.append({
            "name": name,
            "description": description,
            "inputSchema": schema or {"type": "object", "properties": {}},
            "_fn": fn,
        })
        return fn

    return register


def _fmt(obj) -> str:
    return json.dumps(obj, ensure_ascii=False, indent=2)


def _str(desc: str) -> dict:
    return {"type": "string", "description": desc}


@tool("coursegraph_stats", "Graf boyutu ve tip dağılımı (hızlı genel bakış).")
def coursegraph_stats() -> str:
    return _fmt(load().stats())


@tool(
    "course_explore",
    "Sorguya göre surgical context: en iyi bölüm/kavram/quiz eşleşmeleri ve komşuları.\n\n"
    'Kullanım: "mezhep nedir", "Lozan", "ünlu uyumu", "Cemel" gibi sorular.',
    {
        "type": "object",
        "properties": {"query": _str("Aranacak konu, terim ya da soru")},
        "required": ["query"],
    },
)
def course_explore(query: str) -> str:
    return _fmt(load().explore(query))


@tool(
    "course_search",
    "Ders metinlerinde hızlı arama (bölüm, kavram, quiz, sınav, artifact).",
    {
        "type": "object",
        "properties": {
            "query": _str("Aranacak metin"),
            "limit": {"type": "integer", "description": "En fazla sonuç sayısı", "default": 15},
        },
        "required": ["query"],
    },
)
def course_search(query: str, limit: int = 15) -> str:
    return _fmt(load().search(query, limit=limit))


@tool(
    "course_impact",
    "Bir terim/kavram hangi bölümleri, quiz ve sınav sorularını etkiliyor?",
    {
        "type": "object",
        "properties": {"term": _str("Terim ya da kavram")},
        "required": ["term"],
    },
)
def course_impact(term: str) -> str:
    return _fmt(load().impact(term))


@tool(
    "course_overview",
    "Ders genel görünümü: üniversite, dönem, bölümler, quiz, sınavlar.\n\n"
    "slug: ataturk-ilkeleri-1 | turk-dili-1 | islam-mezhepleri-tarihi | osmanlica-1",
    {
        "type": "object",
        "properties": {"slug": _str("Ders slug'ı")},
        "required": ["slug"],
    },
)
def course_overview(slug: str) -> str:
    return _fmt(load().course_overview(slug))


@tool(
    "chapter_detail",
    "Bölüm detayı: özet, hedefler, kavramlar, timeline, kaynaklar.\n\n"
    "course: ders slug'ı; chapter: 1-based bölüm numarası.",
    {
        "type": "object",
        "properties": {
            "course": _str("Ders slug'ı"),
            "chapter": {"type": "integer", "description": "1-based bölüm numarası"},
        },
        "required": ["course", "chapter"],
    },
)
def chapter_detail(course: str, chapter: int) -> str:
    return _fmt(load().chapter_detail(course, int(chapter)))


@tool("coursegraph_rebuild", "Grafiği ve zihin haritalarını kaynaklardan yeniden oluştur.")
def coursegraph_rebuild() -> str:
    from .watch import rebuild_all

    import coursegraph.graph as gg

    gg._cache = None
    return _fmt(rebuild_all())


@tool(
    "course_mindmap",
    "Ders zihin haritası (JSON): panel ağacı, bölüm ağacı, NotebookLM haritaları, graf türevi.\n\n"
    "course: ataturk-ilkeleri-1 | turk-dili-1 | islam-mezhepleri-tarihi | osmanlica-1\n"
    "mindmap_id: opsiyonel (panel-tree | panel-chapters | nl-01... | graph-derived)\n"
    "HTML: coursegraph/index/mindmaps/<course>.html",
    {
        "type": "object",
        "properties": {
            "course": _str("Ders slug'ı"),
            "mindmap_id": _str("Opsiyonel zihin haritası kimliği"),
        },
        "required": ["course"],
    },
)
def course_mindmap(course: str, mindmap_id: str | None = None) -> str:
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


@tool("course_mindmap_index", "Tüm ders zihin haritalarının listesi.")
def course_mindmap_index() -> str:
    path = Path(__file__).resolve().parent / "index" / "mindmaps" / "index.json"
    if not path.exists():
        from .mindmap import build_mindmaps

        build_mindmaps(load())
    return _fmt(json.loads(path.read_text(encoding="utf-8")))


@tool(
    "past_exam_coverage",
    "Çıkmış vize sorularının ünite/anahtar kelime dağılımı (hangi üniteye kadar sorumlu).\n\n"
    "AÖF İslâm Mezhepleri Tarihi için: ünite başına soru sayısı, yıllar, örnekler, site bölümleri.",
    {
        "type": "object",
        "properties": {
            "course": {
                "type": "string",
                "description": "Ders slug'ı",
                "default": "islam-mezhepleri-tarihi",
            }
        },
    },
)
def past_exam_coverage(course: str = "islam-mezhepleri-tarihi") -> str:
    from .past_exams import unit_coverage

    cov = unit_coverage(course)
    out = {
        "course": course,
        "exam_type": "vize (ara sınav)",
        "units": [cov[u] for u in sorted(cov)],
        "scope_hint": "Çoğu yıl U1-U5 (Şiîlik I); U6'ya temas sınırlı; U7-10 çıkmadı.",
    }
    return _fmt(out)


_BY_NAME = {t["name"]: t for t in _TOOLS}


# ---- JSON-RPC / MCP stdio --------------------------------------------------------------


def _text_result(text: str) -> dict:
    return {"content": [{"type": "text", "text": text}]}


def _error(msg_id, code: int, message: str, data=None) -> dict:
    err = {"code": code, "message": message}
    if data is not None:
        err["data"] = data
    return {"jsonrpc": "2.0", "id": msg_id, "error": err}


def _handle(msg: dict) -> dict | None:
    method = msg.get("method")
    msg_id = msg.get("id")
    params = msg.get("params") or {}
    is_notification = "id" not in msg

    if method == "initialize":
        result = {
            "protocolVersion": params.get("protocolVersion") or PROTOCOL_VERSION,
            "capabilities": {"tools": {"listChanged": False}},
            "serverInfo": SERVER_INFO,
            "instructions": INSTRUCTIONS,
        }
    elif method in ("notifications/initialized", "notifications/cancelled"):
        return None
    elif method == "ping":
        result = {}
    elif method == "tools/list":
        result = {
            "tools": [
                {k: t[k] for k in ("name", "description", "inputSchema")} for t in _TOOLS
            ]
        }
    elif method == "tools/call":
        name = params.get("name")
        args = params.get("arguments") or {}
        entry = _BY_NAME.get(name)
        if entry is None:
            return _error(msg_id, -32602, f"Bilinmeyen araç: {name}")
        try:
            result = _text_result(entry["_fn"](**args))
        except TypeError as exc:
            return _error(msg_id, -32602, "Geçersiz araç argümanları", str(exc))
        except Exception as exc:  # araç hatası istemciye metin olarak döner
            traceback.print_exc(file=sys.stderr)
            result = {
                "content": [{"type": "text", "text": f"{type(exc).__name__}: {exc}"}],
                "isError": True,
            }
    else:
        return None if is_notification else _error(msg_id, -32601, f"Desteklenmeyen yöntem: {method}")

    if is_notification:
        return None
    return {"jsonrpc": "2.0", "id": msg_id, "result": result}


def main() -> None:
    # ilk açılışta index yoksa üret
    idx = Path(__file__).resolve().parent / "index" / "graph.json"
    if not idx.exists():
        write_index()
    for stream in (sys.stdin, sys.stdout, sys.stderr):
        try:
            stream.reconfigure(encoding="utf-8")
        except (AttributeError, ValueError):
            pass
    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
        try:
            msg = json.loads(line)
        except ValueError as exc:
            resp = _error(None, -32700, "Ayrıştırılamayan JSON", str(exc))
        else:
            resp = _handle(msg) if isinstance(msg, dict) else _error(None, -32600, "Geçersiz istek")
        if resp is None:
            continue
        sys.stdout.write(json.dumps(resp, ensure_ascii=False) + "\n")
        sys.stdout.flush()


if __name__ == "__main__":
    main()
