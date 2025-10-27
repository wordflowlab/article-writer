# Article Writer - AI 驱动的智能写作系统

[![npm version](https://badge.fury.io/js/article-writer-cn.svg)](https://www.npmjs.com/package/article-writer-cn)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> 🚀 专注公众号/自媒体文章创作的 AI 智能写作助手
>
> 在 Claude、Cursor、Gemini 等 AI 助手中直接使用斜杠命令，系统化创作高质量文章

## ✨ 核心特性

### 🎯 核心理念（v0.7.0 规划中）⭐

> **AI不是代笔，而是教练**
> 
> **核心洞察**：无论AI生成多少字，本质都是冰冷、套话、假细节。真实的内容只能来自人的亲身经历。
>
> **AI的5个致命伤**：缺温度、缺个性、缺地域性、缺真实细节、缺思想
> 
> 我们的目标：**帮用户写出AI永远写不出的真实**

**真实驱动工作流**（v0.7.0）：
- 📝 **AI作为教练** - 提问、引导、检查，但不写内容
- 💎 **真实经历为核心** - 80%内容来自个人素材库
- 🏗️ **人必须自己写** - AI只提供思路，不生成可用内容
- 📈 **真实细节检查** - 5个维度检查（温度、个性、地域、细节、思想）
- 🎯 **防止AI越界** - 强制人工确认，禁止AI直接生成

**关键引用**：
> "编辑只要稍微过一下细，一眼就能分辨出来。" - 来自《AI写作的致命伤》

[查看完整设计 →](docs/prd/prd-07-authentic-writing-workflow.md)

### 💻 现有功能

- 📚 **斜杠命令** - 在 Claude、Gemini、Cursor、Windsurf 等 13 个 AI 助手中直接使用
- 🎯 **九步写作流程** - 从选题到发布的完整创作流程
- 🤖 **智能审校** - 三遍审校机制，降低 AI 味至 30% 以下
- 📁 **工作区管理** - 公众号/视频/通用三种工作区，自动适配规则
- 💎 **素材库系统** - 导入个人动态(即刻/微博)，融入真实素材
- 🕷️ **文档爬虫** - 自动爬取技术文档建立知识库，支持网页/PDF/动态页面(v0.5.0)
- 🎨 **微信格式化** - 基于 doocs/md，一键格式化为微信公众号样式(v0.4.0)
- ⚙️ **交互式配置器** - 可视化样式定制，预设管理，三种配置方式(v0.4.1)
- 🔄 **跨平台** - 支持 13 个 AI 工具，Windows/Mac/Linux 全平台
- 🔌 **插件系统** - AI 检测、素材导入等可扩展功能

## 🚀 快速开始

### 1. 安装

```bash
npm install -g article-writer-cn
```

### 2. 初始化项目

```bash
# 基本用法
content init my-article

# 指定工作区类型
content init my-article --workspace wechat    # 公众号
content init my-article --workspace video     # 视频脚本
content init my-article --workspace general   # 通用内容

# 指定 AI 平台
content init my-article --ai claude    # Claude Code
content init my-article --ai gemini    # Gemini CLI
content init my-article --ai cursor    # Cursor
```

### 3. 开始创作

在 AI 助手中使用斜杠命令：

```
# 命令格式因平台而异
/specify           # 大多数平台
/content.specify   # Claude Code
/content:specify   # Gemini CLI
/content-specify   # Codex CLI
```

**完整写作流程**（11步）：

```
阶段1: 准备
1. /specify        → 定义创作需求
2. /topic          → 选题讨论（只给框架，不含内容）

阶段2: 收集
3. /research       → 信息搜索与调研 🕷️ 支持文档爬取
4. /collect        → 搜索个人素材库
5. /extract        → 提取真实经历 ⭐（AI提问引导）

阶段3: 写作
6. /write          → AI教练指导写作 ⭐（逻辑重写）

阶段4: 检查
7. /authentic      → 5维真实性检查 ⭐（温度/个性/细节/思想）
8. /review         → 三遍审校（内容/风格/细节）

阶段5: 发布
9. /images         → 配图建议
10. /check         → 发布前检查
11. /publish       → 发布指南

辅助命令（随时可用）：
- /hint            → 表达思路提示
- /expand          → 快速扩展素材
```

**核心特点**：
- ⭐ `/write` 教练模式：AI提问，人写，AI检查（不生成内容）
- ⭐ `/extract` 强制真实经历：从一句话扩展到完整经历
- ⭐ `/authentic` 5维检查：识别AI的5个致命伤
- 📊 AI检测率 < 25%，编辑无法识别

> 📊 **[完整架构流程图](docs/article-writer-architecture-flow.svg)** - 查看九步写作流程、素材库系统、三遍审校机制、工作区管理等完整架构

### 🕷️ 文档爬虫增强 (v0.5.0 新增)

`/research` 命令现在支持自动爬取完整文档站：

```bash
# 在 AI 助手中直接使用
/research "Vue 3 官方文档" --url https://vuejs.org/guide/
```

**自动完成:**
- 🔄 爬取 200+ 页文档
- 📂 智能分类（入门/API/示例等）
- 🔍 建立全文搜索索引
- 💾 永久保存到知识库

**写作时自动引用:**  
AI 会从知识库中查找准确的技术信息，大幅减少错误和编造。

详见：[文档爬虫指南](docs/crawler-guide.md) | [使用示例](docs/crawler-examples.md)

## 📚 斜杠命令

### 命名空间说明

| AI 平台 | 命令格式 | 示例 |
|---------|----------|------|
| **Claude Code** | `/content.命令名` | `/content.write` |
| **Gemini CLI** | `/content:命令名` | `/content:write` |
| **Codex CLI** | `/content-命令名` | `/content-write` |
| **其他平台** | `/命令名` | `/write` |

> 💡 下表使用通用格式，实际使用时请根据您的 AI 平台添加相应前缀

### 核心命令列表

| 命令 | 描述 | 何时使用 |
|------|------|----------|
| `/specify` | 定义需求 | 项目开始，记录创作目标 |
| `/topic` | 选题讨论 | 需要确定文章方向 |
| `/research` | 信息搜索 | 需要调研资料 |
| `/collect` | 素材收集 | 需要个人真实案例 |
| `/write` | 撰写初稿 | 开始正式写作 |
| `/review` | 三遍审校 | 初稿完成后降 AI 味 |
| `/images` | 配图建议 | 需要文章配图 |
| `/check` | 发布检查 | 发布前最后检查 |
| `/publish` | 发布指南 | 准备发布到平台 |

### 工作区系统

| 工作区 | 特点 | 适用场景 |
|--------|------|----------|
| **wechat** | AI味<30%，段落<150字，敏感词检测 | 公众号文章 |
| **video** | AI味<20%，高度口语化，分镜标注 | 视频脚本/短视频 |
| **general** | 灵活配置，SEO优化 | 博客/知乎/Medium |

<details>
<summary>📁 项目结构（点击展开）</summary>

```
my-article/
├── .content/              # 配置与脚本
│   ├── memory/            # 写作记忆
│   ├── scripts/           # 支持脚本
│   └── templates/         # 命令模板
├── .claude/commands/      # Claude 命令
├── .cursor/commands/      # Cursor 命令
│   ... (支持 13 个平台)
├── workspaces/            # 工作区
│   ├── wechat/            # 公众号工作区
│   │   └── articles/      # 文章输出
│   ├── video/             # 视频工作区
│   └── general/           # 通用工作区
├── materials/             # 个人素材库
│   ├── raw/               # 原始数据(即刻/微博导出)
│   ├── indexed/           # 主题索引
│   └── archive/           # 历史文章
├── _briefs/               # 需求文档
└── _knowledge_base/       # 调研结果
```

</details>

## 🔌 插件系统

### 已实现插件

#### 1. AI 味自检插件 (`ai-detector/`)
- **功能**: 利用 AI 自身能力检测文章的 AI 生成痕迹
- **命令**: `/ai-check [文件路径]`
- **检测维度**: 词汇(30分)、结构(30分)、情感(20分)、口语化(20分)
- **集成**: `/audit style` 自动调用

#### 2. 素材导入插件 (`materials-import/`)
- **功能**: 导入社交媒体数据(即刻/微博/Twitter)
- **命令**: `/import-materials <source> <file>`
- **支持格式**: CSV, JSON, Markdown
- **输出**: 自动分类索引到 `materials/indexed/`

## 🤖 支持的 AI 助手

| AI 工具 | 说明 | 状态 |
|---------|------|------|
| **Claude Code** | Anthropic 的 AI 助手 | ✅ 推荐 |
| **Cursor** | AI 代码编辑器 | ✅ 完整支持 |
| **Gemini CLI** | Google 的 AI 助手 | ✅ 完整支持 |
| **Windsurf** | Codeium 的 AI 编辑器 | ✅ 完整支持 |
| **Roo Code** | AI 编程助手 | ✅ 完整支持 |
| **GitHub Copilot** | GitHub 的 AI 编程助手 | ✅ 完整支持 |
| **Qwen Code** | 阿里通义千问代码助手 | ✅ 完整支持 |
| **OpenCode** | 开源 AI 编程工具 | ✅ 完整支持 |
| **Codex CLI** | AI 编程助手 | ✅ 完整支持 |
| **Kilo Code** | AI 编程工具 | ✅ 完整支持 |
| **Auggie CLI** | AI 开发助手 | ✅ 完整支持 |
| **CodeBuddy** | AI 编程伙伴 | ✅ 完整支持 |
| **Amazon Q Developer** | AWS 的 AI 开发助手 | ✅ 完整支持 |

> 💡 使用 `content init --all` 可以同时为所有 AI 工具生成配置

## 🛠️ CLI 命令

### `content init [name]`

```bash
content init my-article [选项]
```

**常用选项**：
- `--here` - 在当前目录初始化
- `--workspace <type>` - 选择工作区类型(wechat/video/general)
- `--ai <type>` - 选择 AI 平台(claude/gemini/cursor等)
- `--all` - 生成所有 AI 平台配置

### 示例用法

```bash
# 在当前目录初始化公众号项目
content init --here --workspace wechat

# 为 Claude Code 用户初始化
content init my-article --ai claude

# 同时支持所有平台
content init my-article --all
```

## 💡 使用场景

### 公众号文章 (wechat 工作区)
```bash
content init my-wechat-article --workspace wechat
```
- ✅ 段落自动控制在 150 字以内
- ✅ AI 味目标 < 30%
- ✅ 自动敏感词检测
- ✅ 配图建议(900×500px)
- ✅ 一键格式化为微信样式(v0.4.0)

### 视频脚本 (video 工作区)
```bash
content init my-video-script --workspace video
```
- ✅ 高度口语化(AI 味 < 20%)
- ✅ 时长计算(1分钟≈150-180字)
- ✅ Hook 设计(前 3 秒抓人)
- ✅ 分镜标注格式

### 通用内容 (general 工作区)
```bash
content init my-blog --workspace general
```
- ✅ 灵活配置
- ✅ SEO 优化选项
- ✅ 多平台适配

## 🎯 核心创新

### 1. 真实驱动工作流（v0.7.0 规划）⭐

**核心理念**：AI是教练和参考书，不是代笔

**关键洞察**：
> 就像从100个塑料苹果里挑"最好的"，挑出来的还是塑料。
> 
> 无论AI生成多少字，本质都是：冰冷、套话、假细节。

**工作流**：
```
真实经历（素材库）→ AI教练（提问/引导）→ 人自己写 → AI检查 → 真实文章
                                     ↑
                           AI只给思路，不写内容
```

**核心机制**：
- 📝 **AI作为教练** - 提问引导，不生成可用内容
- 💎 **强制真实经历** - 80%内容必须来自个人素材库
- 🔍 **5维真实检查** - 温度、个性、地域性、真实细节、思想深度
- 🚫 **防止AI越界** - 严格禁止AI生成可直接使用的段落

**预期效果**：
- AI检测率：50%+ → <25%（↓50%）
- 真实性：来自亲身经历，编辑无法识别
- 用户认同："这是我写的"（不是"AI帮我写的"）

[详细设计文档 →](docs/prd/prd-07-authentic-writing-workflow.md)

### 2. 个人素材库系统
不同于传统 AI 写作"完全生成"，通过搜索用户的真实经历(即刻动态、历史文章)并融入新文章：
- **真实性** - 案例、观点都是真实的
- **个性化** - 文风、态度符合本人
- **降 AI 味** - 真实细节替代 AI 编造

### 3. 选题讨论机制
AI 不直接生成文章，而是先提供 3-4 个选题方向：
- 每个方向含标题、角度、大纲、工作量评估
- 用户选择后再执行，避免方向错误
- 增强协作感和掌控感

### 4. 三遍审校机制
系统化降低 AI 检测率(目标<30%)：
- **第一遍(内容)**: 事实、逻辑、结构
- **第二遍(风格)**: 删套话、拆 AI 句式、加真实细节
- **第三遍(细节)**: 标点、排版、节奏

## 📖 与 Novel Writer 的关系

Article Writer 基于 [Novel Writer](https://github.com/wordflowlab/novel-writer) 的成熟架构开发，保留其核心优势：
- ✅ 斜杠命令系统
- ✅ 跨平台支持(13 个 AI 工具)
- ✅ 插件系统
- ✅ 反 AI 检测规范

但将核心流程从"小说创作"改造为"文章写作"，特别针对公众号、视频脚本等短内容创作场景。

## 📈 版本历史

**v0.9.0** (最新) 🎯 真实驱动完整实现
- ✅ 完整的11步真实驱动写作流程
- ✅ 3个核心新命令：`/extract`、`/authentic`、`/hint`
- ✅ `/write` 改为教练模式（逻辑完全重写）
- ✅ 13个命令全部实现并测试通过
- 详见 [PRD-08](docs/prd/prd-08-complete-workflow-redesign.md) | [CHANGELOG](CHANGELOG.md)

**更多历史版本** → 查看 [完整更新日志](CHANGELOG.md)

## 🌐 项目矩阵

WordFlowLab 围绕 AI 辅助写作展开多维度探索，采用不同方法论和技术栈的开源项目组合：

### 内容创作系列

| 项目 | 内容类型 | 核心流程 | 适用场景 |
|------|---------|----------|----------|
| **[Article-Writer](https://github.com/wordflowlab/article-writer)** 🆕 | 文章/脚本 | 九步写作流程，工作区管理 | 公众号/视频脚本/自媒体，降低 AI 味 |
| **[Novel-Writer](https://github.com/wordflowlab/novel-writer)** ⭐ | 小说创作 | 七步方法论，追踪系统 | 长篇小说创作，跨 13 个 AI 工具 |
| **[Novel-Writer-OpenSpec](https://github.com/wordflowlab/novel-writer-openspec)** | 小说创作 | OpenSpec 规格分离 | 需要规格化管理和团队协作 |
| **[Novel-Writer-Skills](https://github.com/wordflowlab/novel-writer-skills)** | 小说创作 | Agent Skills 集成 | 专为 Claude Code 深度优化 |

### 工具实现系列

| 项目 | 类型 | 技术基础 | 说明 |
|------|------|----------|------|
| **[WriteFlow](https://github.com/wordflowlab/writeflow)** | CLI 工具 | 模仿 Claude Code 架构 | 独立 CLI，为技术型作家设计 |
| **[NovelWeave](https://github.com/wordflowlab/novelweave)** | VSCode 扩展 | Fork: Cline → Roo Code → Kilo Code | 可视化编辑器，星尘织梦 |

### 技术演进路径

```
内容创作分支:
  Novel-Writer (小说主线) ──┬─→ Novel-Writer-Skills (Claude Code 专版)
                          ├─→ Novel-Writer-OpenSpec (OpenSpec 探索版)
                          └─→ Article-Writer (文章/脚本分支) 🆕

独立工具分支:
  WriteFlow (CLI 独立版)
  NovelWeave (VSCode 扩展版)
```

### 选择建议

根据您的创作需求选择合适的工具：

| 创作需求 | 推荐项目 | 理由 |
|---------|---------|------|
| 📱 **公众号文章** | [Article-Writer](https://github.com/wordflowlab/article-writer) | 九步流程，段落控制，敏感词检测 |
| 🎬 **视频脚本** | [Article-Writer](https://github.com/wordflowlab/article-writer) | 口语化优化，时长计算，Hook 设计 |
| 📖 **长篇小说** | [Novel-Writer](https://github.com/wordflowlab/novel-writer) | 七步方法论，多线索追踪 |
| 🌟 **新手入门** | [NovelWeave](https://github.com/wordflowlab/novelweave) | 可视化编辑器，VSCode 扩展 |
| 💻 **Claude Code 用户** | [Novel-Writer-Skills](https://github.com/wordflowlab/novel-writer-skills) | Agent Skills 深度集成 |
| 📋 **规格化管理** | [Novel-Writer-OpenSpec](https://github.com/wordflowlab/novel-writer-openspec) | OpenSpec 方法论 |
| 🚀 **技术探索** | [WriteFlow](https://github.com/wordflowlab/writeflow) | CLI 工具开发 |

**快速决策**：
- **写公众号/自媒体** → Article-Writer（降低 AI 味，段落控制）
- **拍视频/写脚本** → Article-Writer（口语化，分镜标注）
- **写长篇小说** → Novel-Writer（情节追踪，角色管理）
- **用 Claude Code** → Novel-Writer-Skills（深度集成）
- **完全新手** → NovelWeave（可视化最友好）

> 💡 **多矩阵、多方法论组合开源**：探索 AI 写作的不同可能性，欢迎根据需求选择合适的工具！

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

项目地址：[https://github.com/wordflowlab/article-writer](https://github.com/wordflowlab/article-writer)

## 📄 许可证

MIT License

## 🙏 致谢

本项目基于 [Novel Writer](https://github.com/wordflowlab/novel-writer) 和 [Spec Kit](https://github.com/sublayerapp/spec-kit) 架构设计，特此感谢！

---

**Article Writer** - 让 AI 成为你的写作伙伴！ ✨📝
