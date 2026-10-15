#!/usr/bin/env python3
"""Resumable NotebookLM course pipeline for a Personal University project.

Usage:
  pipeline.py PROJECT <slug|all> <stage> [--chapters 1,3] [--backoff 420] [--attempts 3]

Stages, in order:
  create        make the notebook (skipped for own notebooks)
  sources       lectures mode: add videos/urls and wait. own mode: read the source list, change nothing
  plan          3 to 5 chapters via ask (JSON, no citations)
  ground        one cited ask per chapter, limited with -s to that chapter's sources
  quiz          one NotebookLM quiz per course (uses AI usage)
  infographics  one infographic per chapter (uses AI usage)
  manifest      marks the course as ready for the site
  all           every stage above in order

State lives in data/<slug>/state.json, so any stage can be re-run and resumes where it stopped.
Only one runner per project is allowed (lock file). Notebooks are never deleted or shared.
"""
import argparse, json, re, sys, time
from common import Lock, Project, grounding_rules, require_cli, run_cli, run_cli_json, source_tier, with_authority

LIMIT_HINTS = re.compile(r"rate.?limit|quota|429|resource.?exhausted|too many|usage limit|limit reached", re.I)


class LimitHit(Exception):
    pass


class State:
    def __init__(self, proj, slug):
        self.path = proj.data(slug) / "state.json"
        self.d = json.loads(self.path.read_text()) if self.path.exists() else {}

    def save(self):
        self.path.write_text(json.dumps(self.d, indent=2, ensure_ascii=False))


class Runner:
    def __init__(self, proj, slug, args):
        self.p, self.slug, self.args = proj, slug, args
        self.c = proj.courses[slug]
        self.st = State(proj, slug)
        self.cli = require_cli()
        self.u = proj.uni
        self.lang = self.u.get("language") or "English"
        self.rules = grounding_rules(self.u)
        self.tiers = (self.u.get("grounding") or {}).get("tiers") or []
        if self.c.get("mode") == "own" and self.c.get("notebook_id"):
            self.st.d.setdefault("notebook_id", self.c["notebook_id"])
            self.st.save()

    # ---- helpers ------------------------------------------------------------
    def log(self, msg):
        self.p.log(self.slug, msg)

    @property
    def nb(self):
        nb = self.st.d.get("notebook_id")
        if not nb:
            sys.exit(f"{self.slug}: no notebook yet. Run the create stage first.")
        return nb

    @property
    def noun(self):
        return "lecture" if self.c.get("mode", "lectures") == "lectures" else "source"

    def ready_sources(self):
        return [s for s in self.st.d.get("sources", {}).values() if s.get("status") == "ready"]

    def chapter_sources(self, ch):
        """The chapter's own sources plus the top-tier ones (textbook) when it has none of its own."""
        return with_authority(ch["source_ids"], self.ready_sources(), self.tiers)

    def note_generation(self, key, ok, detail=""):
        with open(self.p.root / "logs" / "generations.jsonl", "a") as f:
            f.write(json.dumps({"at": time.strftime("%Y-%m-%d %H:%M:%S"), "course": self.slug, "key": key,
                                "ok": ok, "detail": detail[-200:]}) + "\n")

    # ---- stages -------------------------------------------------------------
    def create(self):
        if self.st.d.get("notebook_id"):
            self.log(f"notebook {self.st.d['notebook_id']} already set")
            return
        c = self.c
        title = f"{c['subject']}: {c['course']}" + (f" ({c['professor']})" if c.get("professor") else "")
        code, data, out, err = run_cli_json(self.cli, ["create", title])
        if code != 0 or not data:
            self.log(f"create failed: {(err or out)[-300:]}")
            sys.exit(1)
        self.st.d["notebook_id"] = data["notebook"]["id"]
        self.st.save()
        self.log(f"created notebook {self.st.d['notebook_id']} '{title}'")

    def sources(self):
        if self.c.get("mode") == "own":
            return self.sources_own()
        nb, src = self.nb, self.st.d.setdefault("sources", {})
        items = [(vid, f"https://www.youtube.com/watch?v={vid}", title) for vid, title in self.c.get("videos", [])]
        items += [(u, u, u) for u in self.c.get("urls", [])]
        if len(items) > 50:
            self.log(f"WARNING {len(items)} sources; free NotebookLM notebooks hold 50. Extra adds may fail.")
        for key, url, title in items:
            if src.get(key, {}).get("status") in ("ready", "added"):
                continue
            code, data, out, err = run_cli_json(self.cli, ["source", "add", url, "-n", nb])
            if code == 0 and data:
                s = data["source"]
                src[key] = {"id": s["id"], "title": s.get("title") or title, "url": url, "type": s.get("type", ""),
                            "status": "added"}
                self.log(f"added {key} -> {s['id']}")
            else:
                src[key] = {"status": "add_failed", "title": title, "url": url, "error": (err or out)[-500:]}
                self.log(f"ADD FAILED {key}: {(err or out)[-200:]}")
            self.st.save()
        for key, s in src.items():
            if s.get("status") != "added":
                continue
            code, out, err = run_cli(self.cli, ["source", "wait", s["id"], "-n", nb, "--timeout", "600", "--interval", "5"],
                                     timeout=700)
            s["status"] = "ready" if code == 0 else ("timeout" if code == 2 else "error")
            if code != 0:
                s["error"] = (err or out)[-500:]
            self.log(f"wait {key}: {s['status']}")
            self.st.save()
        self.st.d["order"] = [k for k, _, _ in items]
        self.st.save()
        self._report_failed(len(items))

    def sources_own(self):
        """Own notebooks: read what is there. Never add or remove a source."""
        code, data, out, err = run_cli_json(self.cli, ["source", "list", "-n", self.nb], timeout=180)
        if code != 0 or not data:
            self.log(f"source list failed: {(err or out)[-300:]}")
            sys.exit(1)
        listed = data.get("sources", [])
        listed.sort(key=lambda s: s.get("created_at") or "")  # oldest first = the order the owner built it
        self.st.d["sources"] = {s["id"]: {"id": s["id"], "title": s.get("title") or "Untitled source",
                                          "url": s.get("url") or "", "type": s.get("type", ""),
                                          "status": "ready" if s.get("status") == "ready" else s.get("status", "unknown")}
                                for s in listed}
        self.st.d["order"] = [s["id"] for s in listed]
        if data.get("notebook_title"):
            self.st.d["notebook_title"] = data["notebook_title"]
        self.st.save()
        types = sorted({s.get("type", "?") for s in listed})
        self.log(f"own notebook '{data.get('notebook_title')}': {len(listed)} sources, types {types}")
        self._report_failed(len(listed))

    def _report_failed(self, total):
        failed = [{"key": k, **s} for k, s in self.st.d["sources"].items() if s.get("status") != "ready"]
        (self.p.data(self.slug) / "failed_sources.json").write_text(json.dumps(failed, indent=2, ensure_ascii=False))
        self.log(f"sources ready {total - len(failed)}/{total}, not ready {len(failed)}")
        if total - len(failed) == 0:
            self.log("No ready sources. Stop here and fix the sources before planning.")
            sys.exit(1)

    def plan(self):
        order = self.st.d.get("order") or list(self.st.d["sources"])
        srcs = [self.st.d["sources"][k] for k in order if self.st.d["sources"].get(k, {}).get("status") == "ready"]
        lo, hi, n = self.u["chapters"]["min"], self.u["chapters"]["max"], len(srcs)
        count = f"exactly {lo}" if lo == hi else f"{lo} to {hi}"
        noun = self.noun
        coverage = (f"Every {noun} appears in exactly one chapter." if n >= lo else
                    f"There are fewer {noun}s than chapters, so split the material into topics. A {noun} may appear in several chapters.")
        listing = "\n".join(f"{i}. {s['title']}" for i, s in enumerate(srcs, 1))
        prompt = (f"Group this course's {noun}s into {count} chapters that follow the order below.\n"
                  "Return ONLY a JSON object, no prose, no markdown fences, in this exact shape:\n"
                  '{"chapters": [{"title": "...", "summary": "2 to 3 sentences", "objectives": ["...", "...", "..."], '
                  '"lectures": [1, 2]}]}\n'
                  f'Rules: "lectures" holds the numbers of the {noun}s from the list below. {coverage} '
                  "Exactly 3 objectives per chapter. Base everything only on the sources. "
                  "The lectures field MUST be a JSON array of integers, e.g. [1, 2, 3], never a range like [1-3]. "
                  f"Write for {self.u['audience']}. Write every title, summary and objective in {self.lang}. Do not use em dashes.\n"
                  f"{noun.title()}s in order:\n{listing}")
        code, data, out, err = run_cli_json(self.cli, ["ask", prompt, "-n", self.nb], timeout=600)
        if code != 0 or not data:
            self.log(f"plan ask failed: {(err or out)[-300:]}")
            sys.exit(1)
        (self.p.data(self.slug) / "study_plan_raw.json").write_text(json.dumps(data, indent=2, ensure_ascii=False))
        text = data.get("answer", "")
        snippet = text[text.find("{"): text.rfind("}") + 1]
        # NotebookLM sometimes returns ranges like [1-3] instead of [1, 2, 3]
        snippet = re.sub(r"\[(\d+)\s*-\s*(\d+)\]", lambda m: "[" + ", ".join(str(i) for i in range(int(m.group(1)), int(m.group(2)) + 1)) + "]", snippet)
        try:
            plan = json.loads(snippet)
        except json.JSONDecodeError as e:
            self.log(f"plan JSON parse failed: {e}; snippet around error: {snippet[max(0, e.pos-80):e.pos+80]!r}")
            sys.exit(1)
        by_title = {s["title"].strip().lower(): s for s in srcs}
        missing = []
        for ch in plan["chapters"]:
            ch["source_ids"], ch["lectures_raw"] = [], ch.get("lectures", [])
            for ref in ch["lectures_raw"]:
                s = None
                m = re.match(r"^\s*(\d+)", str(ref))
                if isinstance(ref, int) or m:
                    i = int(ref if isinstance(ref, int) else m.group(1))
                    s = srcs[i - 1] if 1 <= i <= n else None
                if s is None:
                    s = by_title.get(str(ref).strip().lower())
                if s and s["id"] not in ch["source_ids"]:
                    ch["source_ids"].append(s["id"])
                elif not s:
                    missing.append(ref)
            ch["lectures"] = [self.st.d["sources"][k]["title"] for k in order
                              if self.st.d["sources"].get(k, {}).get("id") in ch["source_ids"]]
        assigned = [sid for ch in plan["chapters"] for sid in ch["source_ids"]]
        plan["references"] = data.get("references", [])
        plan["validation"] = {
            "unmatched": missing,
            "unassigned": [s["title"] for s in srcs if s["id"] not in assigned],
            "empty_chapters": [ch["title"] for ch in plan["chapters"] if not ch["source_ids"]],
            "duplicates": sorted({s["title"] for s in srcs if assigned.count(s["id"]) > 1}) if n >= lo else [],
        }
        (self.p.data(self.slug) / "study_plan.json").write_text(json.dumps(plan, indent=2, ensure_ascii=False))
        self.log(f"plan: {len(plan['chapters'])} chapters, validation {plan['validation']}")

    def _plan(self):
        path = self.p.data(self.slug) / "study_plan.json"
        if not path.exists():
            sys.exit(f"{self.slug}: no study plan yet. Run the plan stage first.")
        return path, json.loads(path.read_text())

    def ground(self):
        """Pure-JSON asks return 0 citations, so re-ask each chapter against only its own sources."""
        path, plan = self._plan()
        for i, ch in enumerate(plan["chapters"], 1):
            if ch.get("grounding"):
                continue
            q = (f"Using only these {self.noun}s, explain in plain sentences what the student learns for each objective below. "
                 f"Cite the {self.noun}s. Write for {self.u['audience']}. Write the whole answer in {self.lang}. No em dashes. "
                 f"{self.rules}\n"
                 + "\n".join(f"- {o}" for o in ch["objectives"]))
            args = ["ask", q, "-n", self.nb]
            for sid in self.chapter_sources(ch):
                args += ["-s", sid]
            code, data, out, err = run_cli_json(self.cli, args, timeout=600)
            if code != 0 or not data:
                self.log(f"ground ch{i} failed: {(err or out)[-200:]}")
                continue
            refs = data.get("references", [])
            outside = {r.get("source_id") for r in refs} - set(self.chapter_sources(ch))
            by_id = {s.get("id"): s for s in self.ready_sources()}
            top = sum(1 for r in refs if self.tiers and source_tier(by_id.get(r.get("source_id"), {}), self.tiers) == 0)
            ch["grounding"] = {"answer": data["answer"], "references": refs}
            self.log(f"ground ch{i}: {len(refs)} citations, {top} from top-tier sources, {len(outside)} outside chapter")
            path.write_text(json.dumps(plan, indent=2, ensure_ascii=False))

    def generate(self, key, args):
        """One generate call at a time. On failure back off, then retry. Stops the run if the usage limit is hit."""
        tries = self.st.d.setdefault("tries", {})
        limit_errors = 0
        while tries.get(key, 0) < self.args.attempts:
            tries[key] = tries.get(key, 0) + 1
            self.st.save()
            t0 = time.time()
            code, data, out, err = run_cli_json(self.cli, [*args, "--wait", "--timeout", "1200", "--retry", "3"], timeout=1500)
            aid = None
            if data:
                aid = data.get("artifact_id") or data.get("task_id") or (data.get("artifact") or {}).get("id")
            status = (data or {}).get("status", "")
            ok = code == 0 and aid and status not in ("failed", "error")
            self.note_generation(key, bool(ok), "" if ok else (err or out))
            self.log(f"{key} try {tries[key]}: code {code} status {status} id {aid} in {int(time.time() - t0)}s")
            if ok:
                return aid
            msg = (err or out)[-400:]
            self.log(f"{key} error: {msg}")
            self.st.d.setdefault("errors", []).append({"key": key, "at": time.strftime("%Y-%m-%d %H:%M:%S"), "msg": msg})
            self.st.save()
            if LIMIT_HINTS.search(msg):
                limit_errors += 1
                if limit_errors >= 2:
                    raise LimitHit(key)
            if tries[key] < self.args.attempts:
                self.log(f"{key}: backing off {self.args.backoff // 60} min before retry")
                time.sleep(self.args.backoff)
        return None

    def quiz(self):
        out_path = self.p.data(self.slug) / "quiz.json"
        if out_path.exists():
            self.log("quiz exists, skipping")
            return
        q = self.c.get("quiz") or {}
        diff = q.get("difficulty") or self.u["quiz"]["difficulty"]
        qty = q.get("quantity") or self.u["quiz"]["quantity"]
        aid = self.st.d.get("quiz_artifact") or self.generate(
            "quiz", ["generate", "quiz", f"Cover the core concepts of every {self.noun}. Write for {self.u['audience']}. "
                     f"Write the entire quiz (questions, options, explanations, hints) in {self.lang}. {self.rules}",
                     "-n", self.nb, "--difficulty", diff, "--quantity", qty])
        if not aid:
            self.log("quiz failed after all tries. Rerun the quiz stage later.")
            return
        self.st.d["quiz_artifact"] = aid
        self.st.save()
        code, out, err = run_cli(self.cli, ["download", "quiz", str(out_path), "-n", self.nb, "-a", aid, "--format", "json", "--force"])
        self.log(f"quiz download code {code}: {(err or out).strip()[-160:]}")

    def infographics(self):
        _, plan = self._plan()
        done = self.st.d.setdefault("infographics", {})
        only = {int(x) for x in self.args.chapters.split(",")} if self.args.chapters else None
        for i, ch in enumerate(plan["chapters"], 1):
            if only and i not in only:
                continue
            dest = self.p.assets(self.slug) / f"chapter-{i}.png"
            if dest.exists():
                continue
            key = f"infographic-{i}"
            aid = done.get(key)
            if not aid:
                header = f"Chapter {i}: {ch['title']}"
                prompt = (f"Study infographic for {header}. Summarize the key ideas, models and takeaways of these {self.noun}s "
                          f"for {self.u['audience']}. Locked house style, follow exactly: {self.u['figureStyle']}, "
                          f"one header band at the top reading '{header}', shown once only. "
                          f"Write every word on the infographic in {self.lang}. "
                          "No university names, logos, seals or crests. No photos. No em dashes. "
                          f"Keep every label short so no text is cut off. "
                          f"Check every word for correct {self.lang} spelling before rendering. {self.rules}")
                args = ["generate", "infographic", prompt, "-n", self.nb, "--orientation", "landscape",
                        "--style", "professional", "--detail", "standard"]
                for sid in self.chapter_sources(ch):
                    args += ["-s", sid]
                aid = self.generate(key, args)
                if not aid:
                    self.log(f"{key} failed after all tries")
                    continue
                done[key] = aid
                self.st.save()
            code, out, err = run_cli(self.cli, ["download", "infographic", str(dest), "-n", self.nb, "-a", aid, "--force"])
            self.log(f"{key} download code {code}")

    def manifest(self):
        d = self.p.data(self.slug)
        _, plan = self._plan()
        quiz = json.loads((d / "quiz.json").read_text()) if (d / "quiz.json").exists() else {}
        qs = quiz.get("questions", quiz if isinstance(quiz, list) else [])
        imgs = sorted(p.name for p in self.p.assets(self.slug).glob("chapter-*.png"))
        m = {"slug": self.slug, "subject": self.c["subject"], "course": self.c["course"], "mode": self.c.get("mode", "lectures"),
             "notebook_id": self.nb, "notebook_url": f"https://notebooklm.google.com/notebook/{self.nb}",
             "source_count": len(self.ready_sources()), "source_total": len(self.st.d.get("sources", {})),
             "chapter_count": len(plan["chapters"]), "quiz_question_count": len(qs), "infographics": imgs}
        (d / "manifest.json").write_text(json.dumps(m, indent=2, ensure_ascii=False))
        gaps = []
        if not qs:
            gaps.append("no quiz")
        if len(imgs) < len(plan["chapters"]):
            gaps.append(f"{len(plan['chapters']) - len(imgs)} infographics missing")
        if any(not ch.get("grounding") for ch in plan["chapters"]):
            gaps.append("some chapters not grounded")
        self.log(f"manifest: {m['chapter_count']} chapters, {m['source_count']} sources, {len(qs)} questions"
                 + (f". GAPS: {', '.join(gaps)}" if gaps else ". Complete."))


STAGES = ["create", "sources", "plan", "ground", "quiz", "infographics", "manifest"]

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("project")
    ap.add_argument("slug")
    ap.add_argument("stage", choices=STAGES + ["all"])
    ap.add_argument("--chapters", help="infographics only: comma list of chapter numbers")
    ap.add_argument("--backoff", type=int, default=420, help="seconds to wait after a failed generation (default 7 min)")
    ap.add_argument("--attempts", type=int, default=3)
    a = ap.parse_args()
    proj = Project(a.project)
    slugs = list(proj.courses) if a.slug == "all" else [a.slug]
    for s in slugs:
        if s not in proj.courses:
            sys.exit(f"Unknown course '{s}'. Known: {', '.join(proj.courses) or 'none'}")
    with Lock(proj.root):
        try:
            for s in slugs:
                r = Runner(proj, s, a)
                for name in (STAGES if a.stage == "all" else [a.stage]):
                    r.log(f"== stage {name}")
                    getattr(r, name)()
        except LimitHit as e:
            print(f"\nSTOPPED: NotebookLM looks rate limited ({e}). The state is saved. "
                  "Wait an hour or more, then rerun the same command and it resumes.", file=sys.stderr)
            sys.exit(3)
    gl = proj.root / "logs" / "generations.jsonl"
    if gl.exists():
        today = time.strftime("%Y-%m-%d")
        n = sum(1 for line in gl.read_text().splitlines() if line.startswith('{"at": "' + today))
        print(f"NotebookLM generations (quiz + infographic calls) logged today for this project: {n}")
