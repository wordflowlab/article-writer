# Article Writer - AI 驱动的智能写作系统

[![npm version](https://badge.fury.io/js/article-writer-cn.svg)](https://www.npmjs.com/package/article-writer-cn)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> 🚀 专注公众号/自媒体文章创作的 AI 智能写作助手
>
> 在 Claude、Cursor、Gemini 等 AI 助手中直接使用斜杠命令，系统化创作高质量文章

## ✨ 核心特性

- 📚 **斜杠命令** - 在 Claude、Gemini、Cursor、Windsurf 等 13 个 AI 助手中直接使用
- 🎯 **九步写作流程** - 从选题到发布的完整创作流程
- 🤖 **智能审校** - 三遍审校机制，降低 AI 味至 30% 以下
- 📁 **工作区管理** - 公众号/视频/通用三种工作区，自动适配规则
- 💎 **素材库系统** - 导入个人动态(即刻/微博)，融入真实素材
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
/brief-save           # 大多数平台
/content.brief-save   # Claude Code
/content:brief-save   # Gemini CLI
/content-brief-save   # Codex CLI
```

**九步写作流程**：

```
1. /brief-save        → 保存写作需求
2. /topic-discuss     → 选题讨论(提供3-4个方向)
3. /research          → 信息搜索与调研
4. /materials-search  → 搜索个人素材库
5. /write-draft       → 创作初稿
6. /audit             → 三遍审校(内容/风格/细节)
7. /images            → 配图建议
8. /final-check       → 发布前检查
9. /publish           → 发布指南
```

## 📚 斜杠命令

### 命名空间说明

| AI 平台 | 命令格式 | 示例 |
|---------|----------|------|
| **Claude Code** | `/content.命令名` | `/content.write-draft` |
| **Gemini CLI** | `/content:命令名` | `/content:write-draft` |
| **Codex CLI** | `/content-命令名` | `/content-write-draft` |
| **其他平台** | `/命令名` | `/write-draft` |

> 💡 下表使用通用格式，实际使用时请根据您的 AI 平台添加相应前缀

### 核心命令列表

| 命令 | 描述 | 何时使用 |
|------|------|----------|
| `/brief-save` | 保存需求 | 项目开始，记录写作目标 |
| `/topic-discuss` | 选题讨论 | 需要确定文章方向 |
| `/research` | 信息搜索 | 需要调研资料 |
| `/materials-search` | 素材搜索 | 需要个人真实案例 |
| `/write-draft` | 撰写初稿 | 开始正式写作 |
| `/audit` | 三遍审校 | 初稿完成后降 AI 味 |
| `/images` | 配图建议 | 需要文章配图 |
| `/final-check` | 发布检查 | 发布前最后检查 |
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
├── .specify/              # 配置与脚本
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

### 1. 个人素材库系统
不同于传统 AI 写作"完全生成"，通过搜索用户的真实经历(即刻动态、历史文章)并融入新文章：
- **真实性** - 案例、观点都是真实的
- **个性化** - 文风、态度符合本人
- **降 AI 味** - 真实细节替代 AI 编造

### 2. 选题讨论机制
AI 不直接生成文章，而是先提供 3-4 个选题方向：
- 每个方向含标题、角度、大纲、工作量评估
- 用户选择后再执行，避免方向错误
- 增强协作感和掌控感

### 3. 三遍审校机制
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

**v0.1.0** (2025-10-26)
- ✅ 九步写作流程完整实现
- ✅ 工作区系统(wechat/video/general)
- ✅ AI 味自检插件
- ✅ 素材导入插件
- ✅ 支持 13 个 AI 平台

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

项目地址：[https://github.com/wordflowlab/article-writer](https://github.com/wordflowlab/article-writer)

## 📄 许可证

MIT License

## 🙏 致谢

本项目基于 [Novel Writer](https://github.com/wordflowlab/novel-writer) 和 [Spec Kit](https://github.com/sublayerapp/spec-kit) 架构设计，特此感谢！

---

**Article Writer** - 让 AI 成为你的写作伙伴！ ✨📝
