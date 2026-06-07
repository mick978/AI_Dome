#!/usr/bin/env python3
"""
AgentAtlas — 数据刷新脚本
- 从 GitHub API 拉每个 agent 的 star 数 / 最后更新
- 输出 data/agents.refreshed.json（前端可选择性加载）
- 限流处理:每请求 sleep 0.5s
- 容错:某个失败不阻塞整体
"""

import json
import time
import urllib.request
import urllib.error
from pathlib import Path
from datetime import datetime, timezone

ROOT = Path(__file__).parent.parent
DATA_FILE = ROOT / "data" / "agents.json"
OUT_FILE = ROOT / "data" / "agents.refreshed.json"

API = "https://api.github.com/repos/{path}"
TIMEOUT = 10
SLEEP = 0.6  # 限流保护


def fetch_repo(path):
    """返回 (stars, pushed_at) 或 None"""
    url = API.format(path=path)
    req = urllib.request.Request(url, headers={
        "Accept": "application/vnd.github+json",
        "User-Agent": "AgentAtlas-Refresher"
    })
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT) as resp:
            data = json.loads(resp.read())
            return (data.get("stargazers_count"), data.get("pushed_at"))
    except urllib.error.HTTPError as e:
        print(f"  ❌ HTTP {e.code} for {path}")
        return None
    except (urllib.error.URLError, json.JSONDecodeError, TimeoutError) as e:
        print(f"  ❌ {type(e).__name__} for {path}: {e}")
        return None


def main():
    with open(DATA_FILE, encoding="utf-8") as f:
        data = json.load(f)

    agents = data["agents"]
    print(f"开始刷新 {len(agents)} 个 agent 的 GitHub 数据…\n")

    refreshed = 0
    skipped = 0

    for i, a in enumerate(agents, 1):
        if not a.get("github"):
            print(f"[{i:2d}] ⏭️  {a['name']} - 无 GitHub 仓库,跳过")
            skipped += 1
            continue

        result = fetch_repo(a["github"])
        if result is None:
            print(f"[{i:2d}] ⚠️  {a['name']} ({a['github']}) - 拉取失败,保留原数据")
            continue

        stars, pushed = result
        old_stars = a.get("stars")
        delta = (stars - old_stars) if (stars is not None and old_stars is not None) else 0
        arrow = f" (+{delta:,})" if delta > 0 else (f" ({delta:,})" if delta < 0 else "")

        a["stars"] = stars
        a["pushed_at"] = pushed
        a["last_refreshed"] = datetime.now(timezone.utc).isoformat()

        print(f"[{i:2d}] ✅ {a['name']:25s} ⭐ {stars:>7,}{arrow}")
        refreshed += 1
        time.sleep(SLEEP)

    data["updated"] = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    data["total"] = len(agents)

    with open(OUT_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"\n✅ 完成:刷新 {refreshed} 个,跳过 {skipped} 个")
    print(f"📄 输出: {OUT_FILE}")


if __name__ == "__main__":
    main()
