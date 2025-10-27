# Codex 平台问题排查和修复指南

## 问题描述

用户报告在 Codex 平台无法识别 slash commands，显示错误：

```
Unrecognized command '/content-specify'
```

## 问题分析

### 1. 平台识别混淆

经过调查发现存在**两个不同的 "Codex"**：

#### A. OpenAI Codex CLI (官方产品)
- **官方网站**: https://developers.openai.com/codex/
- **类型**: 命令行工具 (Terminal-based coding agent)
- **Slash Commands**: 使用 `/model`, `/resume` 等命令
- **配置目录**: 使用 `~/.codex/` 配置
- **特点**: 在终端运行，类似 Aider、Cursor CLI

#### B. 未知的 "Codex" AI 编辑器
- **类型**: 可能是某个 AI 代码编辑器或插件
- **Slash Commands 目录**: `.codex/prompts/`
- **命令格式**: `/content-specify`, `/content-research` 等
- **特点**: 集成在编辑器中，类似 Cursor、Windsurf

### 2. Article Writer 的 Codex 支持

Article Writer 项目中的 "Codex" 配置指向的是 **方案 B**（某个AI编辑器），但该平台的官方文档和信息非常有限。

#### 当前配置

```bash
# scripts/build/generate-commands.sh:272
codex)
  mkdir -p "$base_dir/.codex/prompts"
  generate_commands codex md "\$ARGUMENTS" "$base_dir/.codex/prompts" "$script" "content-" "none"
  ;;
```

**生成的命令**:
- 目录: `.codex/prompts/`
- 命名格式: `content-{命令名}.md`
- 示例: `content-specify.md`, `content-research.md`, `content-write.md`
- Frontmatter: `none` (不包含 YAML frontmatter)

---

## 可能的原因

### 原因 1: Codex 平台不支持自定义 prompts

如果用户使用的 "Codex" 是基于某个特定编辑器的扩展，可能该平台：
- ❌ 不支持 `.codex/prompts/` 目录
- ❌ 不支持自定义 slash commands
- ❌ 有不同的命令格式要求

### 原因 2: 命令格式不正确

Codex 可能要求：
- 不同的命令前缀（如 `/`、`/codex-`、不需要前缀等）
- 不同的文件格式（JSON、YAML、纯文本等）
- 特定的 frontmatter 结构

### 原因 3: 配置未生效

用户可能：
- 未重启编辑器
- 未安装 article-writer-cn 到正确位置
- 配置文件路径不正确

---

## 测试步骤

### 步骤 1: 确认 Codex 平台类型

**请用户提供以下信息**:

1. 你使用的 "Codex" 是什么?
   - [ ] OpenAI Codex CLI (命令行工具)
   - [ ] 某个 AI 代码编辑器（请提供名称和版本）
   - [ ] VSCode 扩展（请提供扩展名称）
   - [ ] 其他（请描述）

2. 如何访问 slash commands?
   - [ ] 在终端输入
   - [ ] 在编辑器命令面板输入
   - [ ] 在聊天窗口输入
   - [ ] 其他方式

3. Codex 是否支持自定义 prompts/commands?
   - [ ] 是（请提供文档链接）
   - [ ] 否
   - [ ] 不确定

### 步骤 2: 检查配置文件

```bash
# 检查是否正确安装
cd /path/to/your/project
ls -la .codex/prompts/

# 应该看到:
# content-specify.md
# content-research.md
# content-write.md
# ... 等 14 个文件
```

### 步骤 3: 检查命令内容

```bash
# 查看命令文件内容
cat .codex/prompts/content-specify.md | head -20

# 检查是否:
# - 文件存在
# - 内容完整
# - 格式正确（纯 Markdown，无 frontmatter）
```

### 步骤 4: 测试简单命令

尝试在 Codex 中执行:

```
# 测试 1: 使用完整前缀
/content-specify 帮我写一篇文章

# 测试 2: 不使用前缀
/specify 帮我写一篇文章

# 测试 3: 查看可用命令
/help
/
```

---

## 修复方案

### 方案 A: 确认 Codex 不支持自定义 prompts

**如果 Codex 平台不支持自定义 slash commands**，则需要：

1. **从 Article Writer 移除 Codex 支持**
   ```bash
   # 更新 scripts/build/generate-commands.sh
   # 注释掉或删除 Codex 相关配置
   ```

2. **在文档中说明**
   ```markdown
   ## 不支持的平台

   以下平台由于技术限制，暂不支持 Article Writer:
   - Codex (不支持自定义 slash commands)
   ```

3. **建议用户使用其他平台**
   - Claude Code (完全支持)
   - Cursor (支持)
   - Windsurf (支持)
   - Gemini (支持)

### 方案 B: 修复命令格式

**如果 Codex 支持但格式不对**，需要根据官方文档调整：

1. **调整命令前缀**
   ```bash
   # 可能需要改为:
   # - 无前缀: specify.md
   # - 不同前缀: codex-specify.md
   ```

2. **调整文件格式**
   ```bash
   # 可能需要:
   # - 添加 frontmatter
   # - 转换为 JSON
   # - 使用特定的 metadata
   ```

3. **调整目录结构**
   ```bash
   # 可能需要:
   # - .codex/commands/ 而不是 .codex/prompts/
   # - 其他目录名称
   ```

### 方案 C: 提供降级方案

**如果 Codex 不支持 slash commands**，提供手动使用方式：

```markdown
## Codex 平台使用指南

由于 Codex 不支持自定义 slash commands，请使用以下方式:

### 方式 1: 手动复制 prompt

1. 打开 `.codex/prompts/content-specify.md`
2. 复制全部内容
3. 粘贴到 Codex 聊天窗口
4. 添加你的需求

### 方式 2: 使用 bash 脚本

```bash
# 创建快捷脚本
echo '#!/bin/bash' > codex-specify.sh
echo 'cat .codex/prompts/content-specify.md' >> codex-specify.sh
chmod +x codex-specify.sh

# 使用
./codex-specify.sh | pbcopy  # macOS
./codex-specify.sh | xclip    # Linux
```

### 方式 3: 切换到支持的平台

推荐使用以下平台以获得完整的 slash commands 体验:
- **Claude Code** (推荐) - 完全支持 WebSearch、MCP 工具
- **Cursor** - 支持基础功能
- **Windsurf** - 支持基础功能
```

---

## 需要用户提供的信息

为了准确诊断问题，请用户提供:

### 1. 截图

- [ ] Codex 的主界面截图
- [ ] 输入 slash command 时的截图
- [ ] 错误消息的完整截图

### 2. 环境信息

```bash
# 请运行并提供输出:
pwd
ls -la .codex/
cat .codex/prompts/content-specify.md | head -5
```

### 3. Codex 版本信息

- Codex 版本号: ___________
- 安装方式: ( ) npm ( ) brew ( ) 其他: ___________
- 操作系统: ( ) macOS ( ) Linux ( ) Windows

### 4. Article Writer 版本

```bash
npm list -g article-writer-cn
# 或
content --version
```

---

## 临时解决方案

在问题修复前，用户可以:

### 1. 使用支持的平台

**最快的解决方案**: 切换到 Claude Code

```bash
# 安装 Claude Code
# https://claude.com/claude-code

# 使用 Article Writer
cd your-project
content init --workspace wechat

# 在 Claude Code 中使用 slash commands
/content.specify 帮我写一篇文章
```

### 2. 手动使用 prompts

将 `.codex/prompts/content-*.md` 的内容手动复制到 Codex 中使用。

### 3. 使用 bash 脚本

```bash
# 创建快捷命令
alias codex-specify='cat .codex/prompts/content-specify.md'
alias codex-research='cat .codex/prompts/content-research.md'
alias codex-write='cat .codex/prompts/content-write.md'

# 使用
codex-specify | pbcopy
# 然后粘贴到 Codex
```

---

## 下一步

1. **等待用户反馈** - 确认使用的是哪个 "Codex"
2. **查找官方文档** - 如果有官方文档，根据文档调整格式
3. **决定是否继续支持** - 如果技术上不可行，从支持列表中移除
4. **更新文档** - 明确说明支持的平台和限制

---

## 相关链接

- [OpenAI Codex CLI 官方文档](https://developers.openai.com/codex/)
- [Article Writer MCP 工具集成指南](../advanced/mcp-tools-integration.md)
- [支持的 AI 平台列表](../../README.md#支持的ai平台)

---

## 更新日志

- **2025-10-28**: 创建问题排查文档
- **待定**: 等待用户反馈后更新修复方案
