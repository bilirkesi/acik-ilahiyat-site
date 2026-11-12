#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Bir dersin notlarından soru-cevap korpusu üretir (NotebookLM chat ile).

Site statiktir; tarayıcıdan NotebookLM'e canlı sorulamaz. Bu yüzden cevaplar burada,
defterin kendi kaynaklarına dayanarak üretilir ve `data/<slug>/chat.json` olarak yazılır.
Site sonra bu korpustan getirme yapar.

Her bölüm için tek bir `notebooklm ask` çağrısı yapılır; model bölümün öğrenme hedeflerinden
türeyen N soruyu ve kaynaklara dayalı cevaplarını JSON olarak döndürür.

Kullanım (depo kökü):
    py -3 scripts/generate_chat.py <slug>              # hepsi
    py -3 scripts/generate_chat.py <slug> --only 3     # sadece 3. bölüm
    py -3 scripts/generate_chat.py <slug> --force      # var olanı yeniden üret
    py -3 scripts/generate_chat.py <slug> --count 12   # bölüm başına soru sayısı
"""
from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "generator" / "scripts"))

from common import cli_language, find_cli, language_code, load_university, require_cli  # noqa: E402
from pipeline import fix_json_escapes  # noqa: E402

# Sitede gösterilecek metin dili: dersin kendi dili.
PROMPT = {
    "en": (
        "A student is reading this chapter: \"{title}\".\n"
        "Write {count} questions that a student would actually ask about this chapter, with a "
        "complete answer for each, grounded only in the sources.\n"
        "Rules: every question stands on its own; the answer is two to four sentences; keep the "
        "terminology of the sources and name the version a fact belongs to; mention what the "
        "sources do not cover instead of guessing; cite the sources in the answer with their "
        "number in square brackets, like [1] or [1, 2]; write in {lang}.\n"
        "Return ONLY a JSON object, no prose, no markdown fences, in this exact shape:\n"
        '{{"questions": [{{"q": "...", "a": "..."}}]}}'
    ),
    "tr": (
        "Öğrenci şu bölümü okuyor: \"{title}\".\n"
        "Bu bölüm hakkında bir öğrencinin gerçekten sorabileceği {count} soruyu ve her biri için "
        "kaynaklara dayalı eksiksiz cevabı yaz.\n"
        "Kurallar: her soru tek başına anlaşılır; cevap iki ila dört cümledir; kaynakların "
        "terminolojisini kullan ve bir olgun hangi sürüme aitse sürümü belirt; kaynakların "
        "kapsamadığını tahmin etme, açıkça belirt; cevapta kaynakları köşeli parantez içinde "
        "numaralarıyla göster, örneğin [1] ya da [1, 2]; {lang} dilinde yaz.\n"
        "Yalnızca JSON nesnesi döndür, düz metin ya da markdown çiti yok, tam olarak şu biçimde:\n"
        '{{"questions": [{{"q": "...", "a": "..."}}]}}'
    ),
}


def run(args, timeout=1200):
    p = subprocess.run(args, capture_output=True, text=True, encoding="utf-8",
                       errors="replace", timeout=timeout)
    return p.returncode, p.stdout or "", p.stderr or ""


def _word_in(word, title):
    """Anahtar kelime basligin icinde geciyor mu? "kitap" -> "kitap" ya da "kitab"."""
    if word in title:
        return True
    return word == "kitap" and "kitab" in title


def match_local_id(sid, sources):
    """Yerel bir kaynak id'sini defterdeki kaynaga baglar.

    Bazi planlar state.json'da olmayan yerel id'ler kullanir (orn. "osm1-kitap-1",
    "osm1-video-3"). Boyle id'ler once anahtar kelimeye ("kitap", "video"), sonra bolum
    numarasina gore cozulur. Defterde olmayan kaynaklar (nlm_id'si olmayanlar) elenir.
    """
    parts = [p for p in re.split(r"[^a-z0-9]+", str(sid).lower()) if p]
    num = next((p for p in reversed(parts) if p.isdigit()), "")
    for start in (0, 1):  # 0: tum kelimeler, 1: on ekini at (orn. "osm1-kitap-1")
        words = parts[start:-1] if num else parts[start:]
        if not words:
            continue
        hits = []
        for s in sources:
            if not s.get("nlm_id"):
                continue
            title = str(s.get("title") or "").lower()
            if not all(_word_in(w, title) for w in words):
                continue
            if num and not re.search(r"(?<!\d)" + re.escape(num) + r"(?!\d)", title):
                continue
            hits.append(s)
        if len(hits) == 1:
            return hits[0]
    return None


def resolve_chapter_sources(chapter, sources):
    """Bolumun kaynaklarini state.json kaynaklariyla eslestirir."""
    by_id = {s.get("id"): s for s in sources}
    out = []
    for sid in chapter.get("source_ids", []):
        hit = by_id.get(sid) or match_local_id(sid, sources)
        if hit and hit not in out:
            out.append(hit)
    return out


def parse_json(text):
    """Metindeki JSON nesnesini bulur; gecersiz kacislari duzeltir."""
    i = text.find("{")
    j = text.rfind("}")
    if i < 0 or j < i:
        return None
    snippet = text[i:j + 1]
    for candidate in (snippet, fix_json_escapes(snippet)):
        try:
            obj = json.loads(candidate)
        except json.JSONDecodeError:
            continue
        if isinstance(obj, dict) and isinstance(obj.get("questions"), list):
            return obj
    return None


CITE = re.compile(r"\[(\d+(?:\s*(?:,|-)\s*\d+)*)\]")


def cite_numbers(text):
    """Atif parantezinin icindeki numaralar: "[1, 2]" -> [1, 2], "[3-5]" -> [3, 4, 5]."""
    out = []
    for part in re.split(r"\s*,\s*", str(text)):
        part = part.strip()
        if "-" in part:
            lo, _, hi = part.partition("-")
            if lo.strip().isdigit() and hi.strip().isdigit():
                a, b = int(lo), int(hi)
                if a <= b and b - a <= 50:
                    out.extend(range(a, b + 1))
                    continue
            out.append(None)
        else:
            out.append(int(part) if part.isdigit() else None)
    return out


def source_key(source):
    """Kaynagi tanimlayan anahtar: ayni kaynak bir kez listelensin."""
    return (str(source.get("title") or ""), str(source.get("url") or ""))


def renumber_citations(answer, sources, fallback=None):
    """Atif isaretlerini kaynak listesine gore yeniden numaralandirir.

    NotebookLM bazen numarayi defterin tamamindaki bir kaynaga dayandirir (orn. "[28]"), oysa
    cevabin dayandigi kaynaklar listesinde o numara yoktur. Boyle isaretler kaldirilir; kalan
    isaretler 1'den baslar ve kaynak listesi yalnizca atif yapilan kaynaklari icerir (ayni kaynak
    bir kez). Hicbir isaret kaynak listesine oturmuyorsa (ya da isaret yoksa) `fallback`
    kullanilir: cevabin dayandigi bolumun kaynaklari.
    """
    answer = str(answer or "")
    sources = list(sources or [])
    fallback = list(fallback if fallback is not None else sources)
    if not CITE.search(answer):
        return answer, (sources or fallback)
    # Atif yapilan kaynaklar sirayla, her biri bir kez: numara 1'den baslar.
    order = []
    for m in CITE.finditer(answer):
        for n in cite_numbers(m.group(1)):
            if n is None or not (1 <= n <= len(sources)) or not sources[n - 1]:
                continue
            key = source_key(sources[n - 1])
            if key not in order:
                order.append(key)
    if not order:
        text = CITE.sub("", answer)
        text = re.sub(r"[ \t]+([.,;:!?])", r"\1", text)
        return text, fallback
    pos = {key: i + 1 for i, key in enumerate(order)}
    cited = [next(s for s in sources if source_key(s) == key) for key in order]

    def repl(m):
        keep = []
        for n in cite_numbers(m.group(1)):
            if n is None or not (1 <= n <= len(sources)) or not sources[n - 1]:
                continue
            p = pos[source_key(sources[n - 1])]
            if p not in keep:
                keep.append(p)
        return "[" + ", ".join(str(x) for x in keep) + "]" if keep else ""

    text = CITE.sub(repl, answer)
    # Kaldirilan isaretten sonra bosluk kalmasin: "ayarlanir [28]." -> "ayarlanir."
    text = re.sub(r"[ \t]+([.,;:!?])", r"\1", text)
    return text, cited


def chapter_sources(plan, state):
    """Bolum basina kaynak listesi: {bolum: [{title, url}, ...]}."""
    sources = list(state.get("sources", {}).values())
    out = {}
    for i, ch in enumerate(plan.get("chapters", []), 1):
        out[i] = [{"title": s["title"], "url": s.get("url") or ""}
                  for s in resolve_chapter_sources(ch, sources)]
    return out


def normalize_corpus(corpus, chapters=None):
    """Korpusun butun kayitlarinda atif numaralarini duzeltir.

    `chapters` bolum basina kaynak listesi verir; kaynagi kalmayan cevaplara bolumun
    kaynaklari geri yazilir.
    """
    chapters = chapters or {}
    for it in corpus.get("items", []):
        fallback = chapters.get(int(it.get("chapter") or 0))
        it["a"], it["sources"] = renumber_citations(it.get("a"), it.get("sources"), fallback)
    return corpus


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("slug")
    ap.add_argument("--only", type=int, help="only this chapter")
    ap.add_argument("--force", action="store_true", help="regenerate what already exists")
    ap.add_argument("--count", type=int, default=10, help="questions per chapter")
    ap.add_argument("--attempts", type=int, default=3)
    ap.add_argument("--normalize", action="store_true",
                    help="only fix the citation numbers of the existing corpus")
    args = ap.parse_args()

    d = ROOT / "data" / args.slug
    out_path = d / "chat.json"
    if args.normalize:
        if not out_path.exists():
            sys.exit(f"{args.slug}: chat.json yok")
        plan = json.loads((d / "study_plan.json").read_text(encoding="utf-8-sig"))
        state = json.loads((d / "state.json").read_text(encoding="utf-8-sig"))
        corpus = normalize_corpus(json.loads(out_path.read_text(encoding="utf-8-sig")),
                                  chapter_sources(plan, state))
        out_path.write_text(json.dumps(corpus, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"normalized {out_path.relative_to(ROOT)}: {len(corpus['items'])} questions")
        return 0

    plan = json.loads((d / "study_plan.json").read_text(encoding="utf-8-sig"))
    state = json.loads((d / "state.json").read_text(encoding="utf-8-sig"))
    uni = load_university(ROOT, args.slug)
    lang = language_code(uni)
    nb = state.get("notebook_id")
    if not nb:
        sys.exit(f"{args.slug}: state.json has no notebook_id")
    cli = find_cli() or require_cli()
    sources = [s for s in state["sources"].values() if s.get("status") == "ready"]

    out_path = d / "chat.json"
    corpus = {"slug": args.slug, "language": lang, "items": []}
    if out_path.exists() and not args.force:
        corpus = json.loads(out_path.read_text(encoding="utf-8-sig"))
    done = {it["key"] for it in corpus.get("items", []) if it.get("key")}

    template = PROMPT.get(lang, PROMPT["en"])
    wanted = range(1, len(plan["chapters"]) + 1)
    if args.only:
        wanted = [args.only]

    failed = []
    for n in wanted:
        ch = plan["chapters"][n - 1]
        key = "ch%d" % n
        if key in done and not args.force:
            print(f"  chapter {n}: exists, skipped", flush=True)
            continue
        srcs = resolve_chapter_sources(ch, sources)
        if not srcs:
            print(f"  chapter {n}: no sources, skipped", flush=True)
            continue
        prompt = template.format(title=ch["title"], count=args.count, lang=lang)
        cmd = [cli, "ask", prompt, "-n", nb, "--json", "--timeout", "600"]
        for s in srcs:
            cmd += ["-s", s["nlm_id"]]
        obj = None
        for attempt in range(1, args.attempts + 1):
            code, out, err = run(cmd, timeout=900)
            if code != 0:
                print(f"  chapter {n}: ask failed ({attempt}/{args.attempts}): "
                      f"{(err or out).strip()[-140:]}", flush=True)
                time.sleep(20 * attempt)
                continue
            try:
                data = json.loads(out[out.index("{"):])
            except (ValueError, json.JSONDecodeError):
                print(f"  chapter {n}: ask returned no json ({attempt}/{args.attempts})", flush=True)
                time.sleep(20 * attempt)
                continue
            obj = parse_json(data.get("answer", ""))
            if obj:
                break
            print(f"  chapter {n}: no questions parsed ({attempt}/{args.attempts})", flush=True)
            time.sleep(20 * attempt)
        if not obj:
            failed.append(n)
            print(f"  chapter {n}: FAILED", flush=True)
            continue
        items = []
        # Atiflar: ask cevabindaki "references" kaynak id + atif numarasi verir. Liste atif
        # numarasina gore siralanir (bos yerler birakilir), boylece "[3]" dogru kaynaga gider.
        by_nlm = {s["nlm_id"]: s for s in srcs if s.get("nlm_id")}
        refs = {}
        for ref in (data.get("references") or []):
            sid = ref.get("source_id")
            num = ref.get("citation_number")
            if sid and num and sid in by_nlm:
                refs[int(num)] = {"title": by_nlm[sid]["title"], "url": by_nlm[sid].get("url") or ""}
        chapter_srcs = [{"title": s["title"], "url": s.get("url") or ""} for s in srcs]
        listed = [refs.get(n, {}) for n in range(1, max(refs) + 1)] if refs else chapter_srcs
        for q in obj["questions"]:
            question = str(q.get("q") or "").strip()
            answer = str(q.get("a") or "").strip()
            if not question or not answer:
                continue
            # Atif numaralari kaynak listesine gore yeniden numaralandirilir.
            answer, cited = renumber_citations(answer, listed, chapter_srcs)
            items.append({
                "key": key,
                "chapter": n,
                "chapterTitle": ch["title"],
                "q": question,
                "a": answer,
                "sources": cited,
            })
        corpus["items"] = [it for it in corpus["items"] if it.get("key") != key] + items
        out_path.write_text(json.dumps(corpus, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"  chapter {n}: {len(items)} questions -> {out_path.name}", flush=True)

    corpus["items"].sort(key=lambda it: (it["chapter"], it["q"]))
    out_path.write_text(json.dumps(corpus, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"wrote {out_path.relative_to(ROOT)}: {len(corpus['items'])} questions")
    if failed:
        print(f"failed chapters: {failed}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    os.chdir(ROOT)
    sys.exit(main())
