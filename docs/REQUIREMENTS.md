# AgentAtlas —— 需求规格说明书

**版本**:v0.1 (draft,待享总确认)
**日期**:2026-06-07
**作者**:Hermes (酥酥)
**状态**:⏳ 等待享总 review

---

## 0. 写在前面

本文档是 **AgentAtlas** 的需求规格说明书(SRS),所有后续编码、UI 设计、数据采集、自动化脚本均以此为准。
**在享总书面确认本文档前,不会写一行代码。** 修改需求请直接改本文档并重走确认流程。

---

## 1. 项目定位

### 1.1 一句话

**AgentAtlas** 是一个**面向开发者的国内外 AI Agent 产品/框架目录站**,精选 30-50 个主流 Agent 项目,展示**详细介绍、官网、GitHub、文档**等关键入口,帮助技术人快速对比与选型。

### 1.2 目标用户

| 用户类型 | 占比(估) | 核心诉求 |
|----------|----------|----------|
| **AI 应用开发者** | 50% | 找框架做选型、对比 star/活跃度/许可 |
| **Agent 玩家/极客** | 30% | 找新出的有意思的 Agent 体验 |
| **行业研究者/媒体** | 15% | 摸清 Agent 赛道全景、找一手资料 |
| **投资人/产品经理** | 5% | 看公司、产品热度,看 license/商业模式 |

### 1.3 不是什么

- ❌ **不是 LLM 排行榜**(不收纯聊天大模型,如 GPT-4/Claude/Gemini 等)
- ❌ **不是 Prompt 库 / Awesome List 镜像**(虽然数据组织上类似)
- ❌ **不是 Agent 教程站**(不写入门教程,但每个 Agent 详情页有官方文档入口)
- ✅ **是 Agent 选型决策辅助站**:让你 5 分钟决定"用哪个 / 试哪个"

---

## 2. 范围与边界

### 2.1 收录范围(scope)

**只收 Agent 类 AI 产品/框架**,分两大类:

| 大类 | 定义 | 示例 |
|------|------|------|
| **A. Agent 框架/工具**(开源为主) | 让开发者构建 Agent 的 SDK/框架/Runtime | LangChain / AutoGen / CrewAI / Dify / Coze Studio / Agno / Smolagents / Letta |
| **B. Agent 产品**(成品/闭源) | 直接可用的 Agent 应用/服务 | Devin / Manus / Cursor / Claude Code / Replit Agent / Genspark / Perplexity Comet / 扣子(Coze)/ 智谱清言 AutoGLM |

### 2.2 排除范围(out of scope)

- 纯 LLM(无 Agent 能力的对话模型)
- 单纯 LLM API 平台(无 Agent runtime,如 OpenRouter)
- 垂直行业 Agent(医疗 Agent / 法律 Agent)——除非有标志性意义
- 已停更 > 1 年的项目(列入"归档"区,不在主列表)
- 国内套壳/二开但无原创性的

### 2.3 国内外比例

**目标比例 1:1**(国内 50% / 国外 50%),不刻意平衡,按"有代表性"原则。

---

## 3. 功能需求(Functional Requirements)

### 3.1 P0 —— 必须有(launch 必备)

#### F1. 列表页(Home)

- 卡片网格布局,每张卡片显示:
  - 项目名 + Logo(emoji 占位即可,不上真 logo 图)
  - 一句话定位
  - 公司 / 作者
  - ⭐ GitHub star 数(如适用,GitHub 仓库缺失则隐藏)
  - 分类标签(框架/产品/多 Agent/编码/通用 等)
  - 国别 🇨🇳 / 🇺🇸 等
- 顶部搜索框:**前端模糊搜索**(匹配名称、描述、标签)
- 顶部筛选条:按**分类**、**国别**、**开源/闭源**过滤
- 排序:默认按 star 降序,可切"按收录时间 / 按字母"

#### F2. 详情页(Detail)

- 路径:`/agent.html?id=<slug>`(纯静态,query 参数)
- 字段(每个 Agent 一条):
  - 名称 / 公司 / 作者
  - 一句话定位
  - **详细介绍**(中文,150-300 字,人工撰写)
  - **核心特性**(3-5 个 bullet,人工)
  - **官网**(可点击)
  - **GitHub 仓库**(可点击,带 ⭐ 实时数)
  - **官方文档**(可点击)
  - **最近版本 / 最近 commit 时间**(GitHub API)
  - **License**(如开源)
  - **分类标签**
  - **收录时间**
  - **编辑备注**(可选,如"fork 自 X,有 Y 改进")

#### F3. 数据源

- **手工 seed** 一个 `agents.json`(30-50 条,中英字段)
- **GitHub API 自动补全**:用 `https://api.github.com/repos/owner/repo` 拉
  - `stargazers_count` → star 数
  - `pushed_at` → 最近活跃时间
  - `license.spdx_id` → 协议
  - `default_branch` → 最新 commit 哈希可从 `commits?per_page=1` 拉
- **首次启动时调一次 API**,结果缓存到 `localStorage`,24h 内不重拉
- **GitHub 限流兜底**:anonymous 60 次/h,超限降级为静态数据 + UI 提示"star 数稍后更新"

#### F4. 关于页(About)

- 一段话说明站点目的
- 数据来源声明(手工 + GitHub API)
- 编辑署名(享总)
- 开源协议(MIT)

### 3.2 P1 —— 应该有(launch 后补)

- **对比功能**:勾选 2-3 个 Agent 并排对比(字段差分)
- **暗色模式**:跟随系统
- **响应式**:桌面 4 列 / 平板 2 列 / 手机 1 列
- **RSS / Atom feed**(可选,放 P1 末尾)

### 3.3 P2 —— 锦上添花

- 用户提交新 Agent 的表单(纯静态 → 提交到 mailto 或 GitHub Issue)
- 收藏/书签(用 localStorage)
- "本月新增"高亮

---

## 4. 非功能需求(Non-Functional)

| 维度 | 指标 |
|------|------|
| **性能** | 首屏 < 1.5s,搜索响应 < 100ms(纯前端) |
| **可访问性** | 键盘可导航,基本 ARIA |
| **可维护性** | 改 `agents.json` 即可增删条目,无需改代码 |
| **可移植性** | 纯静态,双击 `index.html` 可开;也可挂 GitHub Pages |
| **数据准确性** | 手工字段 100% 准确;GitHub 字段 24h 内同步 |
| **隐私** | 零追踪、零 cookie(只用 localStorage 缓存) |
| **依赖** | 零运行时依赖(不用 React/Vue/jQuery),可选用 `marked.js` 渲染 markdown |

---

## 5. 数据模型(Schema)

`agents.json` 单文件,数组,每条结构:

```json
{
  "id": "langchain",
  "name": "LangChain",
  "name_zh": "LangChain",
  "company": "LangChain Inc.",
  "country": "US",
  "category": ["framework", "llm-orchestration"],
  "type": "framework",
  "license": "MIT",
  "tagline": "构建 LLM 应用的编排框架",
  "tagline_en": "Orchestration framework for LLM applications",
  "description": "LangChain 是一个用于构建 LLM 驱动应用的框架,提供 Chain / Agent / Retriever / Memory 等模块,支持 Python 和 JS 双语言。...",
  "features": [
    "模块化设计:PromptTemplate / LLM / Chain / Agent / Tool 解耦",
    "多模型适配:OpenAI / Anthropic / 本地模型统一接口",
    "RAG 一等公民:文档加载、Embedding、向量检索开箱即用"
  ],
  "website": "https://www.langchain.com",
  "github": "https://github.com/langchain-ai/langchain",
  "docs": "https://python.langchain.com/docs/introduction/",
  "added_at": "2026-06-07",
  "editor_note": ""
}
```

**字段约束**:
- `id`:小写短横线,URL 友好,唯一
- `category`:枚举,见 §6
- `country`:ISO 3166-1 alpha-2 或 `CN`/`US` 等
- `type`:枚举 `framework` / `product` / `platform`
- `github`:可空(纯闭源产品填 null)
- `description`:中文 150-300 字

---

## 6. 分类体系(Taxonomy)

| category | 含义 | 示例 |
|----------|------|------|
| `framework` | 通用 Agent/LLM 编排框架 | LangChain, LlamaIndex, Haystack |
| `multi-agent` | 多 Agent 协作框架 | AutoGen, CrewAI, MetaGPT, AG2 |
| `coding` | 编码 / 软件工程 Agent | Cursor, Claude Code, Devin, Cline, Continue |
| `general-assistant` | 通用 AI 助手/产品 | Manus, Genspark, Perplexity Comet, AutoGLM |
| `low-code` | 低代码 Agent 搭建平台 | Dify, Coze, n8n, FastGPT |
| `computer-use` | 操作电脑/浏览器 Agent | OpenAI Operator, Skywork, Anthropic Computer Use |
| `research` | 研究/论文类 Agent | Elicit, Consensus, STORM |
| `vertical` | 垂直行业 Agent | (空缺,P2 阶段考虑) |

---

## 7. 技术架构

### 7.1 文件结构

```
ai_dome/
├── index.html              # 列表页(Home)
├── agent.html              # 详情页(同源,通过 ?id= 切换)
├── about.html              # 关于页
├── assets/
│   ├── css/
│   │   └── style.css       # 唯一样式表
│   ├── js/
│   │   ├── data.js         # 引入 agents.json(前端 fetch)
│   │   ├── list.js         # 列表页渲染 + 搜索 + 过滤
│   │   ├── detail.js       # 详情页渲染
│   │   └── github.js       # GitHub API 拉取 + 缓存逻辑
│   └── img/                # 静态图(目前空,后续 logo)
├── data/
│   └── agents.json         # 数据源(单一真相)
├── docs/
│   └── REQUIREMENTS.md     # 本文档
└── README.md               # 仓库说明
```

### 7.2 技术选型

- **HTML5 + CSS3 + 原生 ES2022 JavaScript**(无构建、无依赖)
- **数据加载**:`fetch('data/agents.json')` 一次,内存存
- **搜索**:`Array.prototype.filter` + 小写 contains,30-50 条数据无需索引
- **GitHub API**:`fetch('https://api.github.com/repos/owner/repo')`,带 `If-None-Match` ETags 节省配额
- **渲染**:模板字符串 + `innerHTML`(数据自控,无 XSS 风险)

### 7.3 部署

- **本地预览**:`cd ai_dome && python3 -m http.server 8000` → http://localhost:8000
- **GitHub Pages**:推 GitHub 仓库,Settings → Pages → 选 `main` 分支根目录
- **不部署到任何商业平台**(享总明确要求纯本地为主)

---

## 8. 验收标准(Definition of Done)

### 8.1 Phase 1 —— 数据 seed(M1)

- [ ] `data/agents.json` 至少 30 条
- [ ] 每条字段完整、id 唯一、无重复
- [ ] 国内外各 ≥ 12 条
- [ ] 8 个分类每个 ≥ 2 条(vertical 可空)

### 8.2 Phase 2 —— 静态页(M2)

- [ ] `index.html` 打开能列出全部 Agent
- [ ] 搜索框可用(输入"lang"能过滤出 LangChain)
- [ ] 分类 / 国别筛选可用
- [ ] 点击卡片跳到详情页
- [ ] 详情页字段全显示
- [ ] 关于页可达

### 8.3 Phase 3 —— GitHub API(M3)

- [ ] 列表页卡片显示 ⭐ 实时数
- [ ] 限流降级提示可见
- [ ] 24h 内不重复拉同一仓库

### 8.4 Phase 4 —— 打磨(M4)

- [ ] 暗色模式跟随系统
- [ ] 响应式(375 / 768 / 1280 三个断点)
- [ ] Lighthouse 性能 ≥ 90
- [ ] README 写完
- [ ] 整体可发布到 GitHub Pages

---

## 9. 风险与开放问题

### 9.1 风险

| 风险 | 概率 | 影响 | 缓解 |
|------|------|------|------|
| GitHub API 限流 | 中 | 列表 star 数显示不全 | localStorage 缓存 + 降级提示 |
| 部分 Agent 详情资料难找(尤其国内新出的) | 高 | 描述字段空 | 启动时只收"有公开资料"的,空位宁可先不收 |
| Agent 更新迭代快,数据很快过期 | 高 | star/版本陈旧 | M3 接入 GitHub API;人工字段每季度 review |
| 收录标准主观 | 中 | 被质疑"为什么不收 X" | 在 README 写明标准,接受 PR 补充 |

### 9.2 待享总确认的开放问题

1. **项目名**:**AgentAtlas** 是不是 ok?备选:AgentVerse / AgentHub / AI Agent 索引
2. **域名**:本地 + GitHub Pages 就行,要不要绑独立域名?
3. **Logo/视觉**:**不用真 logo 图,用 emoji 占位**(如 🦜 LangChain / 🤖 Manus),接受吗?
4. **GitHub 仓库归属**:**享总个人 GitHub 账号**还是新建 org?
5. **首版收录数量**:**30-50 条**够吗?首版 30,后续每两周 +5?
6. **许可证**:**MIT**?
7. **是否需要英文版**:**中文为主,英文仅 tagline/description 留双语字段**?

---

## 10. 下一步(确认后)

**享总确认本文档后**,我按以下顺序交付:

1. **M1(数据 seed)**:先出 `agents.json` 30 条 → 发飞书 review
2. **M2(静态页)**:出 `index.html` + `agent.html` + `about.html` + CSS/JS,双击可看
3. **M3(GitHub API)**:接 API + 缓存
4. **M4(打磨)**:暗色 / 响应式 / README

每完成一个 M,发飞书 + 截图给你 review,**中途有调整随时说**。

---

**审批栏**

```
享总 review 结论:
□ 同意,按此开发
□ 同意,但有调整(请批注)
□ 不同意,需返工(请说明)
```

> ✏️ 享总请在 review 后回飞书 / 本对话告诉我结论。
> 修改建议请直接说"§3.1 F2 字段 X 改成 Y"这种格式,我直接改本文档。
