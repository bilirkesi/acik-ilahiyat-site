#!/usr/bin/env python3
"""Check the tools Personal University needs. Never prints auth files or cookie values.

Usage: preflight.py [--lectures]   (--lectures also requires yt-dlp for the find-lectures mode)
"""
import shutil, sys
from common import INSTALL_HELP, find_cli, run_cli

need_lectures = "--lectures" in sys.argv
ok = True

if sys.version_info < (3, 8):
    print("FAIL python 3.8+ needed"); ok = False
else:
    print(f"ok   python {sys.version.split()[0]}")

cli = find_cli()
if not cli:
    print("FAIL notebooklm CLI not found\n")
    print(INSTALL_HELP)
    sys.exit(1)
code, out, err = run_cli(cli, ["--version"], timeout=60)
print(f"ok   notebooklm at {cli} ({out.strip() or err.strip()})")

code, out, err = run_cli(cli, ["auth", "check", "--test"], timeout=120)
if code == 0:
    print("ok   NotebookLM auth check passed")
else:
    ok = False
    tail = [l for l in (out + err).splitlines() if l.strip()][-1:] or ["(no output)"]
    print(f"FAIL NotebookLM auth check failed: {tail[0][:160]}")
    print("     Fix: run `notebooklm login` yourself in a terminal (it opens a browser), then rerun preflight.")

ytdlp = shutil.which("yt-dlp")
if ytdlp:
    print(f"ok   yt-dlp at {ytdlp}")
elif need_lectures:
    ok = False
    print("FAIL yt-dlp missing (needed to verify playlists). Install: brew install yt-dlp  or  pipx install yt-dlp")
else:
    print("info yt-dlp missing (only needed for find-lectures mode)")

try:
    import PIL  # noqa: F401
    print("ok   Pillow available (contact sheets, image compression)")
except ImportError:
    sips = shutil.which("sips")
    print("info Pillow missing. " + ("sips will compress images. " if sips else "Images stay PNG. ")
          + "Contact sheets need Pillow: python3 -m pip install pillow")

sys.exit(0 if ok else 1)
