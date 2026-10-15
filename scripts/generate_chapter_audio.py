"""Generate a NotebookLM audio overview per chapter and publish it as a small MP3 for the site.

For each chapter of a course this asks NotebookLM (via the `notebooklm` CLI from notebooklm-py) for an
audio overview limited to that chapter's sources (`study_plan.json` -> `source_ids`), downloads it to
`assets/audio/<slug>/chapter-N.mp4` (git-ignored), re-encodes it with ffmpeg to a mono speech MP3 at
`site/audio/<slug>/chapter-N.mp3`, and records it in `data/<slug>/audio.json`. `build.py` then shows a
player on the chapter page and offers the files as an optional offline pack.

Usage (repo root, on the machine where `notebooklm login` was done):
    py -3 scripts/generate_chapter_audio.py islam-mezhepleri-tarihi
    py -3 scripts/generate_chapter_audio.py islam-mezhepleri-tarihi --chapters 1,2 --force
    py -3 scripts/generate_chapter_audio.py islam-mezhepleri-tarihi --transcode-only

Chapters whose MP3 already exists are skipped unless --force. Needs ffmpeg/ffprobe on PATH (or --ffmpeg).
"""
import argparse
import datetime
import json
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BITRATE = "64k"
PROMPT = ("Türkçe konuş. Dinleyiciler Anadolu Üniversitesi Açıköğretim İlahiyat ön lisans öğrencileri ve "
          "sınava hazırlanıyorlar. Yalnızca bu bölümün konusunu anlat: \"{title}\". Temel kavramları, kişi ve "
          "fırka adlarını, tarihleri ve sınavda sorulabilecek ayrımları açık ve doğru biçimde vurgula; "
          "kaynaklarda olmayan bilgi ekleme.")


def run(cmd, **kw):
    print("$", " ".join(str(c) for c in cmd), flush=True)
    return subprocess.run([str(c) for c in cmd], check=True, text=True, encoding="utf-8", **kw)


def tool(name, override):
    exe = override or shutil.which(name)
    if not exe:
        sys.exit(f"{name} bulunamadı; PATH'e ekleyin ya da --{name} ile yolunu verin.")
    return exe


def generate(nb, chapter, out_raw, args):
    """Ask NotebookLM for the chapter's audio overview and download it to out_raw."""
    cmd = [args.notebooklm, "generate", "audio", PROMPT.format(title=chapter["title"]), "-n", nb,
           "--format", args.format, "--length", args.length, "--language", args.language, "--wait", "--retry", "2", "--json"]
    for sid in chapter.get("source_ids", []):
        cmd += ["-s", sid]
    res = run(cmd, capture_output=True)
    print(res.stdout.strip())
    artifact = ""
    try:
        info = json.loads(res.stdout)
        artifact = info.get("artifact_id") or info.get("task_id") or info.get("id") or ""
    except ValueError:
        pass
    out_raw.parent.mkdir(parents=True, exist_ok=True)
    dl = [args.notebooklm, "download", "audio", out_raw, "-n", nb, "--force"]
    dl += ["-a", artifact] if artifact else ["--latest"]
    run(dl)


def transcode(src, dst, args):
    dst.parent.mkdir(parents=True, exist_ok=True)
    run([args.ffmpeg, "-y", "-loglevel", "error", "-i", src, "-vn", "-ac", "1", "-ar", "24000",
         "-c:a", "libmp3lame", "-b:a", BITRATE, dst])
    if not args.ffprobe:  # no ffprobe: read "Duration: HH:MM:SS.xx" from ffmpeg's banner instead
        err = subprocess.run([args.ffmpeg, "-hide_banner", "-i", str(dst)], capture_output=True, text=True,
                             encoding="utf-8", errors="replace").stderr
        m = re.search(r"Duration: (\d+):(\d+):([\d.]+)", err)
        return round(int(m[1]) * 3600 + int(m[2]) * 60 + float(m[3]), 1) if m else 0.0
    out = run([args.ffprobe, "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", dst],
              capture_output=True).stdout
    return round(float(out.strip() or 0), 1)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("slug")
    ap.add_argument("--chapters", help="comma list, e.g. 1,2,5 (default: all)")
    ap.add_argument("--format", default="deep-dive", choices=["deep-dive", "brief", "critique", "debate"])
    ap.add_argument("--length", default="short", choices=["short", "default", "long"])
    ap.add_argument("--language", default="tr")
    ap.add_argument("--force", action="store_true", help="regenerate even if the MP3 exists")
    ap.add_argument("--transcode-only", action="store_true", help="skip NotebookLM; re-encode downloaded files")
    ap.add_argument("--notebooklm", default=None)
    ap.add_argument("--ffmpeg", default=None)
    ap.add_argument("--ffprobe", default=None)
    args = ap.parse_args()
    args.ffmpeg = tool("ffmpeg", args.ffmpeg)
    args.ffprobe = args.ffprobe or shutil.which("ffprobe")  # optional; durations fall back to ffmpeg
    if not args.transcode_only:
        args.notebooklm = tool("notebooklm", args.notebooklm)

    d = ROOT / "data" / args.slug
    manifest = json.loads((d / "manifest.json").read_text(encoding="utf-8-sig"))
    plan = json.loads((d / "study_plan.json").read_text(encoding="utf-8-sig"))
    spec_path = d / "audio.json"
    spec = json.loads(spec_path.read_text(encoding="utf-8-sig")) if spec_path.exists() else {}
    done = {a["chapter"]: a for a in spec.get("chapters", [])}
    wanted = [int(x) for x in args.chapters.split(",")] if args.chapters else range(1, len(plan["chapters"]) + 1)

    for n in wanted:
        ch = plan["chapters"][n - 1]
        raw = ROOT / "assets" / "audio" / args.slug / f"chapter-{n}.mp4"
        mp3 = ROOT / "site" / "audio" / args.slug / f"chapter-{n}.mp3"
        if mp3.exists() and not args.force and not args.transcode_only:
            print(f"chapter {n}: exists, skipped")
            continue
        if not args.transcode_only:
            generate(manifest["notebook_id"], ch, raw, args)
        if not raw.exists():
            print(f"chapter {n}: no downloaded file at {raw}", file=sys.stderr)
            continue
        dur = transcode(raw, mp3, args)
        done[n] = {"chapter": n, "file": mp3.name, "duration": dur, "bytes": mp3.stat().st_size,
                   "generated": datetime.date.today().isoformat()}
        print(f"chapter {n}: {dur:.0f} s, {mp3.stat().st_size / 1048576:.1f} MB")
        spec = {"format": args.format, "length": args.length, "language": args.language, "bitrate": BITRATE,
                "chapters": [done[k] for k in sorted(done)]}
        spec_path.write_text(json.dumps(spec, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"wrote {spec_path.relative_to(ROOT)}; now run: py -3 generator/scripts/build.py .")


if __name__ == "__main__":
    os.chdir(ROOT)
    main()
