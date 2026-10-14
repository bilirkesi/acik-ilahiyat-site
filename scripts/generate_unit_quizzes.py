#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Çıkmış soru kaynaklarından ünite bazlı 10-15 soruluk quiz üret ve indir.

Çıktı: data/<slug>/unit_quizzes/unit-N.json
Kaynak: assets/<slug>/aof/*Çıkmış* ve *Kitap* PDF'leri (NotebookLM source list)
"""
from __future__ import annotations

import json
import re
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
CLI = r"C:\Users\Selahattin\AppData\Local\Python\pythoncore-3.14-64\Scripts\notebooklm.exe"

COURSES = {
    "turk-dili-1": {
        "nb": "c702ed26-fe17-463d-b217-202acd0c3d26",
        "units": 8,
        "titles": {
            1: "Dil ve Kültür",
            2: "Türk Dilinin Gelişimi ve Tarihsel Dönemleri",
            3: "Ses Bilgisi",
            4: "Biçim Bilgisi",
            5: "Cümle Bilgisi",
            6: "Türkçenin Söz Varlığı",
            7: "Diller Arası Etkileşim ve Türkçe",
            8: "Türkçenin Güncel Sorunları",
        },
    },
    "ataturk-ilkeleri-1": {
        "nb": "436f4e9d-25d4-4441-98f1-ed97d01b9b7f",
        "units": 8,
        "titles": {
            1: "Türk İnkılabını Hazırlayan Sebepler",
            2: "Yeni Bir İktidar, Yıkıcı ve Yıpratıcı Savaşlar Dönemi",
            3: "Millî Mücadele Başlıyor",
            4: "Yeni Türk Devleti'nin Kuruluşu",
            5: "Türk İstiklal Harbi",
            6: "Lozan Barış Antlaşması",
            7: "Atatürk Dönemi İç Politika",
            8: "Atatürk Dönemi Türk Dış Politikası",
        },
    },
    "islam-mezhepleri-tarihi": {
        "nb": "ad4a99c9-cc96-4f29-92f5-ca8638bc42c2",
        "units": 6,
        "titles": {
            1: "Din, Mezhep İlişkisi ve Mezhepleşme Süreci",
            2: "Mezheplerin Ortaya Çıkış Nedenleri",
            3: "İlk Mezhepler (Haricilik, Şia, Maturidilik vb.)",
            4: "Ehl-i Sünnet ve Sonraki Mezhepler",
            5: "Şîa Tarihi ve Çağdaş Akımlar",
            6: "Günümüz İslâm Mezhepleri",
        },
    },
}

LIMIT_HINTS = re.compile(r"limit|quota|rate.?limit|too many|429|usage", re.I)


def run(args, timeout=1500, stdin_close=True):
    p = subprocess.run(
        [CLI, *args],
        stdin=subprocess.DEVNULL if stdin_close else None,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        timeout=timeout,
    )
    return p.returncode, p.stdout or "", p.stderr or ""


def list_sources(nb):
    code, out, err = run(["source", "list", "-n", nb, "--json"], timeout=180)
    if code != 0:
        raise RuntimeError(err or out)
    return json.loads(out).get("sources") or []


def past_exam_source_ids(nb):
    """Çıkmış sınav PDF'leri (+ Kitap) source id'leri."""
    srcs = list_sources(nb)
    ids = []
    for s in srcs:
        t = (s.get("title") or "")
        typ = s.get("type") or ""
        if typ not in ("file", "pdf", "unknown") and not t.endswith(".pdf"):
            # youtube vs atla; pdf başlıklı dosyaları al
            if "nav Sorular" not in t and "Kitap" not in t and "Snav" not in t:
                continue
        if "nav Sorular" in t or "Kitap" in t or "Snav" in t or t.endswith(".pdf"):
            if s.get("status") == "ready":
                ids.append(s["id"])
    # çıkmış soruları öne al
    def rank(sid):
        title = next((x.get("title") or "" for x in srcs if x["id"] == sid), "")
        if "nav Sorular" in title or "Snav" in title:
            return (0, title)
        return (1, title)
    ids = sorted(set(ids), key=rank)
    return ids, {s["id"]: s.get("title") or s["id"] for s in srcs}


def generate_unit_quiz(nb, unit, unit_title, source_ids, max_tries=3):
    desc = (
        f"Ünite {unit}: {unit_title}. "
        "Yalnızca çıkmış vize soruları ve AÖF ders kitabındaki ilgili ünite konularından "
        "10-15 çoktan seçmeli soru üret. "
        "Her soruda 4 seçenek, tek doğru, kısa gerekçe ve ipucu olsun. "
        "Sorular ünite kapsamı dışına çıkmasın. Türkçe yaz."
    )
    last_err = ""
    for attempt in range(1, max_tries + 1):
        args = [
            "generate", "quiz", desc,
            "-n", nb,
            "--quantity", "more",
            "--difficulty", "medium",
            "--wait", "--timeout", "900", "--retry", "1",
            "--json",
        ]
        for sid in source_ids:
            args.extend(["-s", sid])
        print(f"    gen try {attempt} sources={len(source_ids)}", flush=True)
        code, out, err = run(args, timeout=1200)
        data = None
        decoder = json.JSONDecoder()
        for i, ch in enumerate(out):
            if ch != "{":
                continue
            try:
                obj, _ = decoder.raw_decode(out[i:])
            except json.JSONDecodeError:
                continue
            if isinstance(obj, dict):
                data = obj
                break
        if data:
            aid = data.get("artifact_id") or data.get("task_id") or (data.get("artifact") or {}).get("id")
            status = data.get("status") or ""
            if aid and status not in ("failed", "error"):
                return aid, status
            last_err = f"status={status} {json.dumps(data)[:200]}"
        else:
            last_err = (err or out)[-400:]
        if LIMIT_HINTS.search(last_err):
            print("    usage limit?", last_err[:200])
            time.sleep(420)
        elif attempt < max_tries:
            time.sleep(20 * attempt)
    raise RuntimeError(f"generate failed unit {unit}: {last_err}")


def download_quiz(nb, aid, dest: Path):
    dest.parent.mkdir(parents=True, exist_ok=True)
    code, out, err = run(
        ["download", "quiz", str(dest), "-n", nb, "-a", aid, "--format", "json", "--force", "--json"],
        timeout=300,
    )
    if not dest.exists() or dest.stat().st_size < 50:
        # json olmayan çıktı olabilir; yine de varsa tut
        if code != 0:
            raise RuntimeError(f"download failed: {(err or out)[-300:]}")
    return dest


def normalize_quiz(path: Path, unit: int, unit_title: str) -> dict:
    raw = path.read_text(encoding="utf-8-sig")
    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        # bazı indirmeler markdown olabilir
        return {
            "unit": unit,
            "unitTitle": unit_title,
            "title": f"Ünite {unit} Quiz",
            "questions": [],
            "raw_preview": raw[:200],
            "error": "not-json",
        }
    if isinstance(data, list):
        questions = data
        title = f"Ünite {unit} Quiz"
    else:
        questions = data.get("questions") or data.get("quiz") or []
        if isinstance(questions, dict):
            questions = questions.get("questions") or []
        title = data.get("title") or f"Ünite {unit}: {unit_title}"
    # site şemasına yaklaştır
    out_qs = []
    for q in questions:
        if not isinstance(q, dict):
            continue
        opts = q.get("answerOptions") or q.get("options") or []
        norm_opts = []
        for o in opts:
            if isinstance(o, str):
                norm_opts.append({"text": o, "isCorrect": False, "rationale": ""})
            elif isinstance(o, dict):
                norm_opts.append(
                    {
                        "text": o.get("text") or "",
                        "isCorrect": bool(o.get("isCorrect") or o.get("correct")),
                        "rationale": o.get("rationale") or o.get("explanation") or "",
                    }
                )
        # correct letter map
        correct = q.get("correct") or q.get("answer")
        if correct and not any(x["isCorrect"] for x in norm_opts) and isinstance(correct, str):
            letter = correct.strip().upper()[:1]
            idx = ord(letter) - ord("A")
            if 0 <= idx < len(norm_opts):
                norm_opts[idx]["isCorrect"] = True
        out_qs.append(
            {
                "question": q.get("question") or q.get("stem") or q.get("prompt") or "",
                "answerOptions": norm_opts,
                "hint": q.get("hint") or "",
                "type": "multiple_choice",
            }
        )
    return {
        "unit": unit,
        "unitTitle": unit_title,
        "title": title,
        "questions": out_qs,
    }


def main():
    only = sys.argv[1] if len(sys.argv) > 1 else None
    only_unit = int(sys.argv[2]) if len(sys.argv) > 2 else None
    for slug, meta in COURSES.items():
        if only and slug != only:
            continue
        nb = meta["nb"]
        out_dir = DATA / slug / "unit_quizzes"
        print(f"=== {slug}", flush=True)
        src_ids, id_titles = past_exam_source_ids(nb)
        print(f"  aof kaynak: {len(src_ids)}")
        for sid in src_ids:
            print(f"    - {id_titles.get(sid, sid)[:80]}")
        # yalnızca çıkmış sınav kaynakları; yoksa kitap; o da yoksa tümü
        past_ids = [
            sid for sid in src_ids
            if "nav Sorular" in id_titles.get(sid, "") or "Snav" in id_titles.get(sid, "")
        ]
        if not past_ids:
            past_ids = [sid for sid in src_ids if "Kitap" in id_titles.get(sid, "")]
        use_ids = past_ids or src_ids
        print(f"  üretim kaynağı: {len(use_ids)} (çıkmış odaklı)")
        for unit in range(1, meta["units"] + 1):
            if only_unit and unit != only_unit:
                continue
            dest = out_dir / f"unit-{unit}.json"
            # normalize edilmişse atla
            if dest.exists():
                try:
                    prev = json.loads(dest.read_text(encoding="utf-8-sig"))
                    if prev.get("questions"):
                        print(f"  unit {unit}: skip ({len(prev['questions'])} soru)")
                        continue
                except Exception:
                    pass
            title = meta["titles"].get(unit, f"Ünite {unit}")
            print(f"  unit {unit}: {title}", flush=True)
            try:
                aid, status = generate_unit_quiz(nb, unit, title, use_ids)
                print(f"    artifact {aid} ({status})", flush=True)
                download_quiz(nb, aid, dest)
                norm = normalize_quiz(dest, unit, title)
                dest.write_text(json.dumps(norm, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
                print(f"    -> {len(norm['questions'])} soru yazıldı")
            except Exception as e:
                print(f"    HATA unit {unit}: {e}")
            time.sleep(2)
    return 0


if __name__ == "__main__":
    sys.exit(main())
