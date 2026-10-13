"""CourseGraph sorgu katmanı: explore / impact / search."""
from __future__ import annotations

import json
import re
from collections import defaultdict
from pathlib import Path

from .indexer import fold, tokenize

INDEX = Path(__file__).resolve().parent / "index" / "graph.json"


class CourseGraph:
    def __init__(self, path: Path | None = None) -> None:
        p = path or INDEX
        if not p.exists():
            raise FileNotFoundError(
                f"graph.json yok. Önce: python -m coursegraph.indexer"
            )
        data = json.loads(p.read_text(encoding="utf-8"))
        self.generated_at = data.get("generated_at", "")
        self.nodes: dict[str, dict] = {n["id"]: n for n in data["nodes"]}
        self.edges: list[dict] = data["edges"]
        self.inverted: dict[str, list[str]] = data.get("inverted", {})
        self.out: dict[str, list[dict]] = defaultdict(list)
        self.inc: dict[str, list[dict]] = defaultdict(list)
        for e in self.edges:
            self.out[e["src"]].append(e)
            self.inc[e["dst"]].append(e)

    # ---- helpers ----
    def get(self, nid: str) -> dict | None:
        return self.nodes.get(nid)

    def neighbors(self, nid: str, rel: str | None = None, direction: str = "out") -> list[dict]:
        edges = self.out[nid] if direction == "out" else self.inc[nid]
        if rel:
            edges = [e for e in edges if e["rel"] == rel]
        return edges

    def related_nodes(self, nid: str, rel: str | None = None, limit: int = 20) -> list[dict]:
        ids = []
        for e in self.out[nid]:
            if rel is None or e["rel"] == rel:
                ids.append(e["dst"])
        for e in self.inc[nid]:
            if rel is None or e["rel"] == rel:
                ids.append(e["src"])
        out = []
        for i in ids[:limit]:
            if i in self.nodes:
                out.append(self.nodes[i])
        return out

    def stats(self) -> dict:
        by_type: dict[str, int] = defaultdict(int)
        for n in self.nodes.values():
            by_type[n["type"]] += 1
        by_rel: dict[str, int] = defaultdict(int)
        for e in self.edges:
            by_rel[e["rel"]] += 1
        return {
            "generated_at": self.generated_at,
            "nodes": len(self.nodes),
            "edges": len(self.edges),
            "by_type": dict(sorted(by_type.items())),
            "by_rel": dict(sorted(by_rel.items())),
        }

    # ---- search ----
    def search(self, query: str, limit: int = 20) -> list[dict]:
        q = query.strip()
        if not q:
            return []
        # phrase boost
        results: dict[str, float] = defaultdict(float)
        toks = tokenize(q)
        phr = fold(q)
        for nid in self.inverted.get(f"__phr__{phr}", []):
            results[nid] += 10.0
        # substring on titles
        fq = fold(q)
        for n in self.nodes.values():
            if fq and fq in fold(n.get("title", "")):
                results[n["id"]] += 3.0
        for t in toks:
            for nid in self.inverted.get(t, []):
                results[nid] += 1.0
        ranked = sorted(results.items(), key=lambda x: -x[1])[: limit * 2]
        out = []
        for nid, score in ranked:
            n = self.nodes.get(nid)
            if not n:
                continue
            out.append(
                {
                    "id": n["id"],
                    "type": n["type"],
                    "title": n.get("title", ""),
                    "course": n.get("course", ""),
                    "score": round(score, 2),
                    "snippet": (n.get("summary") or n.get("definition") or n.get("question") or "")[:160],
                }
            )
            if len(out) >= limit:
                break
        return out

    def impact(self, term: str) -> dict:
        """Bir terimin etkilediği düğümler (bölüm, quiz, sınav, artifact)."""
        hits = self.search(term, limit=50)
        focus_types = {"chapter", "concept", "quiz_question", "exam_question", "artifact", "event", "course"}
        primary = [h for h in hits if h["type"] in focus_types]
        # expand: for each chapter/concept hit, pull quiz and exams of same course
        courses = sorted({h["course"] for h in primary if h.get("course")})
        related: dict[str, list] = defaultdict(list)
        for h in primary:
            related[h["type"]].append(h)
        # chapters that mention term in text
        chapters = [h for h in primary if h["type"] == "chapter"]
        quizzes = [h for h in primary if h["type"] == "quiz_question"]
        exams = [h for h in primary if h["type"] == "exam_question"]
        concepts = [h for h in primary if h["type"] == "concept"]
        artifacts = [h for h in primary if h["type"] == "artifact"]
        return {
            "term": term,
            "courses": courses,
            "chapters": chapters[:15],
            "concepts": concepts[:15],
            "quiz_questions": quizzes[:15],
            "exam_questions": exams[:15],
            "artifacts": artifacts[:10],
            "counts": {
                "chapters": len(chapters),
                "concepts": len(concepts),
                "quiz_questions": len(quizzes),
                "exam_questions": len(exams),
                "artifacts": len(artifacts),
            },
        }

    def explore(self, query: str) -> dict:
        """Surgical context: en iyi eşleşmeler + komşular (bölüm/terim/quiz)."""
        hits = self.search(query, limit=12)
        if not hits:
            return {"query": query, "hits": [], "context": [], "message": "Eşleşme yok."}
        context = []
        seen = set()
        for h in hits[:5]:
            nid = h["id"]
            if nid in seen:
                continue
            seen.add(nid)
            node = self.nodes[nid]
            entry = {
                "id": nid,
                "type": node["type"],
                "title": node.get("title", ""),
                "course": node.get("course", ""),
                "snippet": h.get("snippet", ""),
            }
            # related chapters / concepts / questions
            rel_ch = [n for n in self.related_nodes(nid, limit=10) if n["type"] == "chapter"]
            rel_con = [n for n in self.related_nodes(nid, limit=10) if n["type"] == "concept"]
            rel_q = [
                n
                for n in self.related_nodes(nid, limit=10)
                if n["type"] in ("quiz_question", "exam_question")
            ]
            if rel_ch:
                entry["related_chapters"] = [
                    {"id": n["id"], "title": n.get("title", ""), "course": n.get("course", "")}
                    for n in rel_ch[:5]
                ]
            if rel_con:
                entry["related_concepts"] = [
                    {"id": n["id"], "title": n.get("title", "")} for n in rel_con[:5]
                ]
            if rel_q:
                entry["related_questions"] = [
                    {
                        "id": n["id"],
                        "title": n.get("title", ""),
                        "answer": (n.get("answer") or "")[:120],
                    }
                    for n in rel_q[:5]
                ]
            # full text for chapters/concepts
            if node["type"] in ("chapter", "concept"):
                entry["text"] = (node.get("text") or node.get("summary") or node.get("definition") or "")[:1200]
            if node["type"] == "quiz_question":
                entry["question"] = node.get("question", "")
                entry["answer"] = node.get("answer", "")
            if node["type"] == "exam_question":
                entry["question"] = node.get("question", "")
                entry["answer"] = node.get("answer", "")
                entry["solution"] = (node.get("solution") or "")[:800]
            context.append(entry)
        return {
            "query": query,
            "generated_at": self.generated_at,
            "hits": hits,
            "context": context,
        }

    def course_overview(self, slug: str) -> dict:
        nid = f"course:{slug}"
        n = self.nodes.get(nid)
        if not n:
            return {"error": f"course bulunamadı: {slug}"}
        chapters = [
            self.nodes[e["dst"]]
            for e in self.out[nid]
            if e["rel"] == "has_chapter" and e["dst"] in self.nodes
        ]
        exams = [
            self.nodes[e["dst"]]
            for e in self.out[nid]
            if e["rel"] == "has_exam" and e["dst"] in self.nodes
        ]
        quiz = next(
            (self.nodes[e["dst"]] for e in self.out[nid] if e["rel"] == "has_quiz" and e["dst"] in self.nodes),
            None,
        )
        return {
            "course": n,
            "chapters": [
                {"id": c["id"], "chapter": c.get("chapter"), "title": c.get("title")}
                for c in sorted(chapters, key=lambda x: x.get("chapter") or 0)
            ],
            "quiz": quiz,
            "exams": exams,
            "term": next(
                (
                    self.nodes[e["src"]]
                    for e in self.inc[nid]
                    if e["rel"] == "contains_course" and e["src"] in self.nodes
                ),
                None,
            ),
            "university": next(
                (
                    self.nodes[e["src"]]
                    for e in self.inc[nid]
                    if e["rel"] == "has_course" and e["src"] in self.nodes
                ),
                None,
            ),
        }

    def chapter_detail(self, course: str, chapter: int) -> dict:
        nid = f"chapter:{course}:{int(chapter):02d}"
        n = self.nodes.get(nid)
        if not n:
            return {"error": f"bölüm bulunamadı: {course} #{chapter}"}
        concepts = [
            self.nodes[e["dst"]]
            for e in self.out[nid]
            if e["rel"] in ("defines_concept", "mentions_concept") and e["dst"] in self.nodes
        ]
        events = [
            self.nodes[e["dst"]]
            for e in self.out[nid]
            if e["rel"] in ("has_timeline_event", "mentions_event") and e["dst"] in self.nodes
        ]
        sources = [self.nodes[e["dst"]] for e in self.out[nid] if e["rel"] == "cites_source"]
        return {
            "chapter": n,
            "concepts": [
                {"id": c["id"], "term": c.get("title"), "definition": c.get("definition", "")}
                for c in concepts
            ],
            "timeline": [
                {"id": e["id"], "year": e.get("year"), "name": e.get("title"), "desc": e.get("description", "")}
                for e in events
            ],
            "sources": sources,
            "course": n.get("course"),
        }


_cache: CourseGraph | None = None


def load() -> CourseGraph:
    global _cache
    if _cache is None:
        _cache = CourseGraph()
    return _cache
