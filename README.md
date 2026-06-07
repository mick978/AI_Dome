# AgentAtlas 🗺️

> 精选 AI Agent 目录 — 收录国内外主流 Agent 框架、平台与工具

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Static Site](https://img.shields.io/badge/static-site-blue)]()
[![Zero Dependencies](https://img.shields.io/badge/dependencies-zero-green)]()

## ✨ 特性

- 🌍 **国内外兼顾** — 国际/国内项目 1:1 比例
- 🎨 **暗色主题** — 护眼 + 优雅
- 📱 **响应式设计** — 手机/平板/桌面完美适配
- ⚡ **零依赖** — 纯 HTML + CSS + JS,无需构建
- 🖱️ **即开即用** — 双击 `index.html` 直接打开
- 🔄 **GitHub Star 实时刷新** — 一键拉取最新数据

## 📂 目录结构

```
ai_dome/
├── index.html              # 首页（agent 列表）
├── agent.html              # 详情页
├── about.html              # 关于页
├── css/
│   └── styles.css          # 暗色主题
├── js/
│   └── main.js             # 过滤 + 渲染逻辑
├── data/
│   ├── agents.json         # 手工 seed 数据（30 条）
│   └── agents.refreshed.json  # GitHub API 刷新后（脚本生成）
├── scripts/
│   └── refresh.py          # GitHub API 数据刷新脚本
├── docs/
│   └── REQUIREMENTS.md     # 需求文档
├── .gitignore
├── CNAME                   # 自定义域名（可选）
└── README.md
```

## 🚀 快速开始

### 本地预览

```bash
# 直接双击打开
open index.html

# 或起一个本地 HTTP 服务（推荐，避免 fetch 跨域问题）
python3 -m http.server 8000
# 然后访问 http://localhost:8000
```

### 部署到 GitHub Pages

```bash
# 1. 创建 GitHub 仓库
gh repo create agentatlas --public --source=. --remote=origin

# 2. 推送
git add . && git commit -m "feat: initial AgentAtlas v0.1.0"
git push -u origin main

# 3. GitHub 仓库 Settings → Pages → Source: main → Save
# 4. 访问 https://<username>.github.io/agentatlas/
```

## 🔄 刷新 GitHub Star 数据

```bash
cd ai_dome
python3 scripts/refresh.py
```

输出 `data/agents.refreshed.json`,前端会优先加载此文件(若有)。

**建议**:
- 每两周跑一次
- 配置 cron 自动跑
- 配合 git push 自动更新 Pages

## 📊 当前收录

| 维度 | 数据 |
|------|------|
| 总数 | 30 |
| 国际 | 16 |
| 国内 | 14 |
| 框架 | 15 |
| 平台 | 5 |
| 工具 | 3 |
| 协议 | 1 |
| 基础设施 | 1 |
| 产品 | 1 |

## 🏷️ 收录标准

✅ 收录:
- GitHub Stars > 1k 的活跃开源 Agent 框架/工具
- 有清晰文档的成熟商业产品
- 国内外兼顾
- 持续维护中(最近一年内有更新)

❌ 不收录:
- 纯 LLM(如 GPT、Claude API)
- 临时项目 / 玩具 demo
- 长期不维护的项目

## 🤝 贡献

欢迎推荐新的 Agent 项目,可通过 GitHub Issues 提交。

格式:
```yaml
名称: <Agent 名称>
GitHub: <owner/repo>
官网: <URL>
分类: framework / platform / tool / infrastructure / protocol / product
来源: china / international
简介: <一句话>
```

## 📜 协议

本项目代码采用 **MIT 协议**。收录的 Agent 项目各自保留原始协议。

---

Built with ❤️ for the AI Agent community
