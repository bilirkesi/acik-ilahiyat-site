"""Ders kaynaklarından bilgi grafiği üretir.

Kaynaklar: courses.json, universities.json, data/*/study_plan|quiz|exams,
site/interactive.js, artifacts/catalog.json
Çıktı: coursegraph/index/graph.json (+ inverted index)
"""
from __future__ import annotations

import json
import re
import subprocess
import tempfile
import unicodedata
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
INDEX_DIR = Path(__file__).resolve().parent / "index"

SEMESTER_TR = {"guz": "Güz", "bahar": "Bahar", "yaz": "Yaz"}


def fold(s: str) -> str:
    s = str(s)
    tr = str.maketrans(
        "ıİşŞğĞüÜöÖçÇâîû",
        "iissgguuoocciiu",
    )
    s = s.translate(tr).lower()
    s = unicodedata.normalize("NFD", s)
    s = "".join(c for c in s if not unicodedata.combining(c))
    return s


def tokenize(s: str) -> list[str]:
    return [t for t in re.split(r"[^a-z0-9]+", fold(s)) if t]


def load_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8-sig"))


def dump_interactive() -> dict:
    js = r"""
global.window = {};
require(process.argv[2]);
process.stdout.write(JSON.stringify(global.window.INTERACTIVE));
"""
    with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False, encoding="utf-8") as f:
        f.write(js)
        tmp = f.name
    ip = str(ROOT / "site" / "interactive.js").replace("\\", "/")
    try:
        out = subprocess.check_output(["node", tmp, ip], text=True, encoding="utf-8")
    finally:
        Path(tmp).unlink(missing_ok=True)
    return json.loads(out)


class GraphBuilder:
    def __init__(self) -> None:
        self.nodes: dict[str, dict] = {}
        self.edges: list[dict] = []
        self._edge_set: set[tuple] = set()

    def node(self, nid: str, ntype: str, title: str, **props) -> str:
        if nid not in self.nodes:
            self.nodes[nid] = {"id": nid, "type": ntype, "title": title}
        self.nodes[nid].update(props)
        return nid

    def edge(self, src: str, dst: str, rel: str, **props) -> None:
        key = (src, dst, rel)
        if key in self._edge_set:
            return
        self._edge_set.add(key)
        e = {"src": src, "dst": dst, "rel": rel}
        e.update(props)
        self.edges.append(e)

    def to_dict(self) -> dict:
        return {
            "version": 1,
            "generated_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
            "nodes": list(self.nodes.values()),
            "edges": self.edges,
        }


def _add_units(g: GraphBuilder, slug: str, cid: str) -> None:
    """Dersin AÖF ünite düğümleri (kapsam boş olsa bile hepsi)."""
    from .past_exams import COURSE_UNIT_CONFIGS, unit_titles, unit_to_chapters

    if slug not in COURSE_UNIT_CONFIGS:
        return
    UNIT_TO_CHAPTERS = unit_to_chapters(slug)
    for u, title in unit_titles(slug).items():
        uid = f"unit:{slug}:{u}"
        g.node(
            uid,
            "unit",
            f"Ünite {u}: {title}",
            course=slug,
            unit=u,
            unit_title=title,
            chapters=UNIT_TO_CHAPTERS.get(u, []),
            text=f"{title} ünite {u}",
        )
        g.edge(cid, uid, "has_unit")
        for ch in UNIT_TO_CHAPTERS.get(u, []):
            g.edge(uid, f"chapter:{slug}:{ch:02d}", "unit_chapter", chapter=ch)


def _add_past_exams(g: GraphBuilder, slug: str, cid: str) -> dict[tuple[str, int], str]:
    """data/<slug>/past_exams.json → çıkmış vize, soru, anahtar kelime düğümleri.

    Dönüş: (exam_id, soru no) → düğüm id (bölüm notlarındaki atıflar için).
    """
    from .past_exams import annotate_questions, unit_to_chapters

    UNIT_TO_CHAPTERS = unit_to_chapters(slug)
    by_num: dict[tuple[str, int], str] = {}
    exams = annotate_questions(slug)
    if not exams:
        return by_num

    for exam in exams:
        exam_id = exam.get("exam_id") or f"{exam.get('year', 'x')}-vize"
        eroot = f"pastexam:{slug}:{exam_id}"
        g.node(
            eroot,
            "past_exam",
            f"Çıkmış Vize {exam.get('year', exam_id)}" + (f" · {exam['group']} grup" if exam.get("group") else ""),
            course=slug,
            exam_id=exam_id,
            year=exam.get("year", ""),
            term=exam.get("term", "guz"),
            source_file=exam.get("file", ""),
            question_count=len(exam.get("questions") or []),
            text=f"çıkmış sınav vize {exam.get('year', '')} {exam.get('file', '')}",
        )
        g.edge(cid, eroot, "has_past_exam")

        units_in_exam: set[int] = set()
        for q in exam.get("questions") or []:
            qi = q.get("index") or 1
            qid = f"pastq:{slug}:{exam_id}:{qi:02d}"
            unit = q.get("unit")
            stem = q.get("stem") or ""
            kws = q.get("keywords") or []
            g.node(
                qid,
                "past_question",
                stem[:80],
                course=slug,
                exam_id=exam_id,
                year=exam.get("year", ""),
                num=q.get("n") or qi,
                unit=unit,
                keywords=kws,
                question=stem,
                options=q.get("options") or [],
                text=f"{stem} {' '.join(kws)}",
            )
            g.edge(eroot, qid, "has_question")
            by_num[(exam_id, int(q.get("n") or qi))] = qid
            if unit:
                units_in_exam.add(unit)
                uid = f"unit:{slug}:{unit}"
                g.edge(qid, uid, "in_unit", unit=unit)
                for ch in UNIT_TO_CHAPTERS.get(unit, []):
                    g.edge(qid, f"chapter:{slug}:{ch:02d}", "in_chapter", chapter=ch)
                for kw in kws[:6]:
                    kid = f"kw:{slug}:{fold(kw)[:40]}"
                    g.node(
                        kid,
                        "keyword",
                        kw,
                        course=slug,
                        text=kw,
                    )
                    g.edge(qid, kid, "has_keyword")

        for u in sorted(units_in_exam):
            g.edge(eroot, f"unit:{slug}:{u}", "covers_unit", unit=u)
            for ch in UNIT_TO_CHAPTERS.get(u, []):
                g.edge(eroot, f"chapter:{slug}:{ch:02d}", "covers_chapter", chapter=ch)
    return by_num


def _add_unit_quizzes(g: GraphBuilder, slug: str, cid: str) -> None:
    """data/<slug>/unit_quizzes/unit-N.json → ünite quiz'i ve soru düğümleri."""
    from .past_exams import COURSE_UNIT_CONFIGS, unit_to_chapters

    qdir = ROOT / "data" / slug / "unit_quizzes"
    if not qdir.is_dir():
        return
    u2c = unit_to_chapters(slug) if slug in COURSE_UNIT_CONFIGS else {}
    files = sorted(qdir.glob("unit-*.json"), key=lambda p: int(re.sub(r"\D", "", p.stem) or 0))
    for path in files:
        data = load_json(path)
        u = int(data.get("unit") or re.sub(r"\D", "", path.stem))
        utitle = data.get("unitTitle") or ""
        root = f"uquiz:{slug}:{u}"
        questions = data.get("questions") or []
        g.node(
            root,
            "unit_quiz",
            f"Ünite {u} quiz'i" + (f": {utitle}" if utitle else ""),
            course=slug,
            unit=u,
            unit_title=utitle,
            question_count=len(questions),
            text=f"ünite {u} quiz {utitle}",
        )
        g.edge(cid, root, "has_unit_quiz")
        if f"unit:{slug}:{u}" in g.nodes:
            g.edge(root, f"unit:{slug}:{u}", "in_unit", unit=u)
        for ch in u2c.get(u, []):
            g.edge(root, f"chapter:{slug}:{ch:02d}", "in_chapter", chapter=ch)
        for qi, q in enumerate(questions, 1):
            qid = f"uquizq:{slug}:{u}:{qi:03d}"
            correct = next(
                (o.get("text", "") for o in q.get("answerOptions", []) if o.get("isCorrect")),
                "",
            )
            g.node(
                qid,
                "unit_quiz_question",
                q.get("question", "")[:80],
                course=slug,
                unit=u,
                question=q.get("question", ""),
                answer=correct,
                options=q.get("answerOptions", []),
                text=q.get("question", ""),
            )
            g.edge(root, qid, "has_question")


def _previous_artifacts() -> list[dict]:
    """artifacts/catalog.json yalnızca yerel makinede (git dışı). Yoksa önceki indeksteki
    artifact düğümlerini koru ki bulutta yeniden kurulum onları silmesin."""
    path = INDEX_DIR / "graph.json"
    if not path.exists():
        return []
    try:
        old = load_json(path)
    except (OSError, ValueError):
        return []
    return [n for n in old.get("nodes", []) if n.get("type") == "artifact"]


def build() -> dict:
    g = GraphBuilder()
    courses = load_json(ROOT / "courses.json")
    unis = load_json(ROOT / "universities.json") if (ROOT / "universities.json").exists() else {}
    interactive = dump_interactive()
    catalog_path = ROOT / "artifacts" / "catalog.json"
    catalog = load_json(catalog_path) if catalog_path.exists() else None
    old_artifacts = _previous_artifacts() if catalog is None else []

    # universities
    for uid, u in unis.items():
        if u.get("is_platform"):
            continue
        g.node(f"uni:{uid}", "university", u.get("name", uid), short=u.get("short", uid), faculty=u.get("faculty", ""))

    # terms
    terms_seen: set[tuple] = set()

    for slug, c in courses.items():
        uid = c.get("university_id") or "aof"
        year = c.get("academic_year") or "bilinmiyor"
        sem = c.get("semester") or "guz"
        term_id = f"term:{year}:{sem}"
        if (year, sem) not in terms_seen:
            terms_seen.add((year, sem))
            g.node(
                term_id,
                "term",
                f"{year} {SEMESTER_TR.get(sem, sem)}",
                academic_year=year,
                semester=sem,
            )
        cid = f"course:{slug}"
        g.node(
            cid,
            "course",
            c.get("subject", slug),
            slug=slug,
            course=slug,
            course_code=c.get("course_code", ""),
            course_name=c.get("course_name", c.get("subject", slug)),
            university=uid,
            academic_year=year,
            semester=sem,
            level=c.get("level"),
            ects=c.get("ects_credits"),
            professor=c.get("professor", ""),
            school=c.get("school", ""),
            notebook_id=c.get("notebook_id", ""),
            playlist=c.get("playlist", ""),
            note=c.get("note", ""),
        )
        g.edge(f"uni:{uid}", cid, "has_course")
        g.edge(term_id, cid, "contains_course")

        # study plan chapters
        plan_path = ROOT / "data" / slug / "study_plan.json"
        chapters = []
        if plan_path.exists():
            chapters = load_json(plan_path).get("chapters", [])
        for i, ch in enumerate(chapters, 1):
            title = ch.get("title", f"Bölüm {i}")
            chid = f"chapter:{slug}:{i:02d}"
            text = " ".join(
                [
                    title,
                    ch.get("summary", ""),
                    " ".join(ch.get("objectives", [])),
                    " ".join(ch.get("lectures", [])),
                    (ch.get("grounding") or {}).get("answer", ""),
                ]
            )
            g.node(
                chid,
                "chapter",
                title,
                course=slug,
                chapter=i,
                summary=ch.get("summary", ""),
                objectives=ch.get("objectives", []),
                lectures=ch.get("lectures", []),
                source_ids=ch.get("source_ids", []),
                text=text,
            )
            g.edge(cid, chid, "has_chapter")
            for sid in ch.get("source_ids", []):
                sidn = f"source:{sid}"
                g.node(sidn, "source", f"NotebookLM {sid[:8]}", source_id=sid, course=slug)
                g.edge(chid, sidn, "cites_source")

        # interactive concepts / timeline
        panel = interactive.get(slug, {})
        concept_ids: list[str] = []
        for j, con in enumerate(panel.get("concepts", []), 1):
            term = con.get("term", "")
            kid = f"concept:{slug}:{fold(term)[:40]}"
            g.node(
                kid,
                "concept",
                term,
                course=slug,
                definition=con.get("def", ""),
                text=f"{term} {con.get('def', '')}",
            )
            g.edge(cid, kid, "defines_concept")
            concept_ids.append((kid, term))
            # terim bölüm metninde geçiyorsa chapter'a da kenar
            ft = fold(term)
            if len(ft) >= 3:
                for i, ch in enumerate(chapters, 1):
                    ch_text = fold(
                        ch.get("title", "")
                        + " "
                        + ch.get("summary", "")
                        + " "
                        + (ch.get("grounding") or {}).get("answer", "")
                    )
                    if ft in ch_text:
                        g.edge(f"chapter:{slug}:{i:02d}", kid, "mentions_concept")

        for j, ev in enumerate(panel.get("timeline", []), 1):
            eid = f"event:{slug}:{j:02d}"
            name = ev.get("name", "")
            g.node(
                eid,
                "event",
                name,
                course=slug,
                year=str(ev.get("year", "")),
                description=ev.get("desc", ""),
                text=f"{ev.get('year','')} {name} {ev.get('desc','')}",
            )
            g.edge(cid, eid, "has_timeline_event")
            ft = fold(name)
            if len(ft) >= 3:
                for i, ch in enumerate(chapters, 1):
                    ch_text = fold(
                        ch.get("title", "")
                        + " "
                        + ch.get("summary", "")
                        + " "
                        + (ch.get("grounding") or {}).get("answer", "")
                    )
                    if ft in ch_text:
                        g.edge(f"chapter:{slug}:{i:02d}", eid, "mentions_event")

        # quiz
        quiz_path = ROOT / "data" / slug / "quiz.json"
        if quiz_path.exists():
            quiz = load_json(quiz_path)
            qid_root = f"quiz:{slug}"
            g.node(qid_root, "quiz", quiz.get("title", "Quiz"), course=slug)
            g.edge(cid, qid_root, "has_quiz")
            for qi, q in enumerate(quiz.get("questions", []), 1):
                qid = f"quizq:{slug}:{qi:03d}"
                correct = next(
                    (o.get("text", "") for o in q.get("answerOptions", []) if o.get("isCorrect")),
                    "",
                )
                g.node(
                    qid,
                    "quiz_question",
                    q.get("question", "")[:80],
                    course=slug,
                    question=q.get("question", ""),
                    answer=correct,
                    options=q.get("answerOptions", []),
                    text=q.get("question", ""),
                )
                g.edge(qid_root, qid, "has_question")

        # exams
        exam_dir = ROOT / "data" / slug / "exams"
        for eid_name in ("vize", "final", "yaz-kursu"):
            epath = exam_dir / f"{eid_name}.json"
            if not epath.exists():
                continue
            edata = load_json(epath)
            eroot = f"exam:{slug}:{eid_name}"
            g.node(
                eroot,
                "exam",
                edata.get("title", eid_name),
                course=slug,
                exam_id=eid_name,
                exam_window=edata.get("exam_window", ""),
                question_count=len(edata.get("questions", [])),
            )
            g.edge(cid, eroot, "has_exam")
            for qi, q in enumerate(edata.get("questions", []), 1):
                qid = f"examq:{slug}:{eid_name}:{qi:03d}"
                correct = next(
                    (o.get("text", "") for o in q.get("answerOptions", []) if o.get("isCorrect")),
                    "",
                )
                g.node(
                    qid,
                    "exam_question",
                    q.get("question", "")[:80],
                    course=slug,
                    exam_id=eid_name,
                    question=q.get("question", ""),
                    answer=correct,
                    solution=q.get("solution", ""),
                    tags=q.get("tags", []),
                    text=q.get("question", ""),
                )
                g.edge(eroot, qid, "has_question")

        # AÖF üniteleri, çıkmış vize (AÖF PDF) + anahtar kelime, ünite quiz'leri
        _add_units(g, slug, cid)
        past_by_num = _add_past_exams(g, slug, cid)
        _add_unit_quizzes(g, slug, cid)

        # bölüm notlarındaki çıkmış soru atıfları (study_plan chapters[].cites)
        for i, ch in enumerate(chapters, 1):
            for cite in ch.get("cites") or []:
                qid = past_by_num.get((cite.get("exam_id", ""), int(cite.get("num") or 0)))
                if qid:
                    g.edge(f"chapter:{slug}:{i:02d}", qid, "cites_past_question")

        # artifacts
        for n in old_artifacts:
            if n.get("course") == slug:
                g.node(n["id"], "artifact", n.get("title", ""), **{k: v for k, v in n.items() if k not in ("id", "type", "title")})
                g.edge(cid, n["id"], "has_artifact")
        for art in catalog or []:
            if art.get("course") != slug:
                continue
            aid = f"artifact:{slug}:{art['filename']}"
            g.node(
                aid,
                "artifact",
                art["filename"].split("__", 1)[-1],
                course=slug,
                category=art.get("category", ""),
                art_type=art.get("type", ""),
                size=art.get("size", 0),
            )
            g.edge(cid, aid, "has_artifact")

    # concept co-occurrence: same term across courses (via fold title match not needed;
    # link concepts that share tokens in definition with other concepts in same course - skip for simplicity)

    # inverted index: token -> node ids
    inv: dict[str, list[str]] = defaultdict(list)
    for n in g.nodes.values():
        blob = n.get("text") or ""
        title = n.get("title") or ""
        extra = " ".join(
            str(n.get(k, ""))
            for k in ("definition", "summary", "question", "answer", "description", "note", "course_code")
        )
        for tok in set(tokenize(f"{title} {blob} {extra}")):
            inv[tok].append(n["id"])
        # also store folded title as phrase key
        ft = fold(title)
        if ft:
            inv[f"__phr__{ft}"].append(n["id"])

    graph = g.to_dict()
    graph["inverted"] = {k: v for k, v in sorted(inv.items())}
    return graph


def write_index(graph: dict | None = None) -> Path:
    INDEX_DIR.mkdir(parents=True, exist_ok=True)
    if graph is None:
        graph = build()
    out = INDEX_DIR / "graph.json"
    out.write_text(json.dumps(graph, ensure_ascii=False), encoding="utf-8")
    meta = {
        "generated_at": graph["generated_at"],
        "node_count": len(graph["nodes"]),
        "edge_count": len(graph["edges"]),
        "token_count": len(graph.get("inverted", {})),
    }
    (INDEX_DIR / "meta.json").write_text(json.dumps(meta, indent=2), encoding="utf-8")
    return out


if __name__ == "__main__":
    path = write_index()
    print(f"graph written: {path}")
    meta = json.loads((INDEX_DIR / "meta.json").read_text(encoding="utf-8"))
    print(meta)
