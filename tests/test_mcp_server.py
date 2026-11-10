"""coursegraph MCP sunucusu (stdio JSON-RPC) testleri.

Sunucu stdlib-only: `py -3 -m coursegraph.server` dış bağımlılık olmadan açılır ve
stdout'ta yalnızca protokol mesajları taşır.
"""
from __future__ import annotations

import json
import subprocess
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def _rpc(messages: list[dict]) -> list[dict]:
    """Sunucuyu bir kez başlatıp birkaç JSON-RPC mesajı gönderir, yanıtları döndürür."""
    stdin = "\n".join(json.dumps(m, ensure_ascii=False) for m in messages) + "\n"
    p = subprocess.run(
        [sys.executable, "-m", "coursegraph.server"],
        input=stdin,
        capture_output=True,
        text=True,
        encoding="utf-8",
        cwd=ROOT,
        timeout=300,
    )
    out = []
    for line in p.stdout.splitlines():
        if line.strip():
            out.append(json.loads(line))
    return out


class TestMcpServer(unittest.TestCase):
    def test_initialize_and_tool_list(self) -> None:
        res = _rpc([
            {"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {"protocolVersion": "2025-06-18"}},
            {"jsonrpc": "2.0", "id": 2, "method": "tools/list"},
        ])
        self.assertEqual(len(res), 2)
        self.assertEqual(res[0]["result"]["serverInfo"]["name"], "coursegraph")
        names = [t["name"] for t in res[1]["result"]["tools"]]
        for expected in ("coursegraph_stats", "course_explore", "course_search", "course_impact",
                         "course_overview", "chapter_detail"):
            self.assertIn(expected, names)

    def test_tool_call_returns_text_content(self) -> None:
        res = _rpc([
            {"jsonrpc": "2.0", "id": 1, "method": "tools/call",
             "params": {"name": "coursegraph_stats", "arguments": {}}},
        ])
        self.assertEqual(len(res), 1)
        content = res[0]["result"]["content"]
        self.assertEqual(content[0]["type"], "text")
        self.assertIn("nodes", json.loads(content[0]["text"]))

    def test_unknown_tool_is_invalid_params(self) -> None:
        res = _rpc([
            {"jsonrpc": "2.0", "id": 1, "method": "tools/call",
             "params": {"name": "bilinmeyen_arac", "arguments": {}}},
        ])
        self.assertEqual(res[0]["error"]["code"], -32602)

    def test_notification_has_no_answer(self) -> None:
        res = _rpc([
            {"jsonrpc": "2.0", "method": "notifications/initialized"},
            {"jsonrpc": "2.0", "id": 1, "method": "ping"},
        ])
        self.assertEqual(len(res), 1)
        self.assertEqual(res[0]["id"], 1)

    def test_malformed_json_is_reported(self) -> None:
        p = subprocess.run(
            [sys.executable, "-m", "coursegraph.server"],
            input="{ bozuk json\n",
            capture_output=True,
            text=True,
            encoding="utf-8",
            cwd=ROOT,
            timeout=300,
        )
        self.assertEqual(json.loads(p.stdout.strip())["error"]["code"], -32700)


if __name__ == "__main__":
    unittest.main()
