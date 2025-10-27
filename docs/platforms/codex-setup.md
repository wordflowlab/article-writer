# Codex (OpenAI Codex CLI) 平台配置指南

## 平台信息

- **名称**: OpenAI Codex CLI
- **类型**: Terminal-based coding agent
- **官方网站**: https://developers.openai.com/codex/
- **GitHub**: https://github.com/openai/codex
- **支持状态**: ✅ 完全支持

## 重要发现

OpenAI Codex CLI 支持从 **用户主目录** 加载自定义 prompts:

```bash
~/.codex/prompts/      # ✅ 正确路径
./.codex/prompts/      # ❌ 项目路径不生效
```

## 问题说明

Article Writer 默认将 commands 生成到 **项目目录**（`.codex/prompts/`），但 Codex CLI 只会加载 **用户主目录**（`~/.codex/prompts/`）中的 prompts。

### 错误症状

```
Unrecognized command '/content-specify'
```

### 根本原因

Prompts 安装位置错误。

---

## 解决方案

### 方案 A: 全局安装 (推荐)

将 Article Writer 的 commands 安装到用户主目录：

```bash
# 1. 安装 article-writer-cn
npm install -g article-writer-cn

# 2. 复制 commands 到 Codex 全局目录
mkdir -p ~/.codex/prompts
cp -r /usr/local/lib/node_modules/article-writer-cn/dist/codex/.codex/prompts/* ~/.codex/prompts/

# 或使用符号链接
ln -s /usr/local/lib/node_modules/article-writer-cn/dist/codex/.codex/prompts ~/.codex/prompts

# 3. 验证安装
ls -la ~/.codex/prompts/
# 应该看到: content-specify.md, content-research.md, 等
```

### 方案 B: 项目级安装

如果需要在特定项目中使用：

```bash
# 1. 进入项目目录
cd /path/to/your/project

# 2. 安装 article-writer-cn
npm install article-writer-cn

# 3. 复制 commands 到用户目录
mkdir -p ~/.codex/prompts
cp -r node_modules/article-writer-cn/dist/codex/.codex/prompts/* ~/.codex/prompts/
```

### 方案 C: 自动安装脚本

创建自动化安装脚本（我们将在下一步提供）。

---

## 使用方式

安装完成后，在 Codex CLI 中使用:

### 1. 查看可用 prompts

```bash
codex

# 在 Codex TUI 中输入:
/prompts:
```

应该看到:
- `/prompts:content-specify`
- `/prompts:content-research`
- `/prompts:content-write`
- ... 等 14 个命令

### 2. 使用 slash commands

```bash
# 方式 1: 在 Codex TUI 中
codex
/prompts:content-specify 帮我写一篇关于AI的文章

# 方式 2: 直接执行
codex "/prompts:content-specify 帮我写一篇关于AI的文章"

# 方式 3: 使用 exec 模式
codex exec "/prompts:content-specify 帮我写一篇关于AI的文章"
```

---

## 配置示例

### Codex 配置文件位置

```bash
~/.codex/config.toml
```

### 推荐配置

```toml
# ~/.codex/config.toml

# 审批策略
approval_policy = "ask"  # 或 "auto", "never"

# 默认模型
model = "gpt-5-codex"

# 推理等级
reasoning_effort = "medium"  # 或 "low", "high"

# 启用 MCP 工具
[mcpServers]
# 可选: 添加其他 MCP servers
```

---

## 工作流示例

### 完整的写作流程

```bash
# 1. 启动 Codex
codex

# 2. 创建项目
/prompts:content-init --workspace wechat

# 3. 理解需求
/prompts:content-specify 写一篇关于Claude Code的文章

# 4. 信息调研
/prompts:content-research

# 5. 讨论选题
/prompts:content-topic

# 6. 搜集素材
/prompts:content-collect

# 7. 撰写初稿
/prompts:content-write

# 8. 三遍审校
/prompts:content-review content
/prompts:content-review style
/prompts:content-review detail

# 9. 配图建议
/prompts:content-images

# 10. 发布准备
/prompts:content-publish
```

---

## 常见问题

### Q1: 为什么找不到 commands?

**A**: Prompts 必须安装在 `~/.codex/prompts/`，而不是项目目录。

```bash
# 检查安装位置
ls -la ~/.codex/prompts/

# 如果为空，重新安装
cp -r /path/to/article-writer-cn/dist/codex/.codex/prompts/* ~/.codex/prompts/
```

### Q2: 命令名称太长怎么办?

**A**: 可以创建短别名:

```bash
# 在 ~/.codex/prompts/ 创建符号链接
cd ~/.codex/prompts/
ln -s content-specify.md specify.md
ln -s content-research.md research.md
ln -s content-write.md write.md

# 然后使用
/prompts:specify
/prompts:research
/prompts:write
```

### Q3: 支持哪些工具?

**A**: Codex CLI 支持:
- ✅ WebSearch (通过 MCP)
- ✅ Playwright (通过 MCP)
- ✅ Context7 (通过 MCP)
- ✅ Bash 脚本
- ✅ 文件读写

详见 [MCP 工具集成指南](../advanced/mcp-tools-integration.md)

### Q4: 如何更新 commands?

**A**: 重新安装即可:

```bash
# 更新 article-writer-cn
npm update -g article-writer-cn

# 重新复制 commands
cp -r /usr/local/lib/node_modules/article-writer-cn/dist/codex/.codex/prompts/* ~/.codex/prompts/
```

---

## 与其他平台对比

| 特性 | Codex CLI | Claude Code | Cursor |
|------|-----------|-------------|---------|
| 命令安装位置 | `~/.codex/prompts/` | `.claude/commands/` | `.cursor/commands/` |
| 命令前缀 | `/prompts:content-` | `/content.` | `/content-` |
| MCP 工具 | ✅ 支持 | ✅ 支持 | ❌ 不支持 |
| 运行模式 | 终端 | 编辑器 | 编辑器 |
| 全局安装 | ✅ 必须 | ❌ 项目级 | ❌ 项目级 |

---

## 下一步

1. ✅ 安装 prompts 到 `~/.codex/prompts/`
2. ✅ 验证命令可用
3. ✅ 配置 MCP 工具（可选）
4. ✅ 开始写作！

---

## 参考链接

- [OpenAI Codex CLI 官方文档](https://developers.openai.com/codex/cli)
- [Codex 自定义 Prompts 指南](https://github.com/openai/codex/blob/main/docs/advanced.md)
- [Article Writer MCP 工具集成](../advanced/mcp-tools-integration.md)
- [问题排查指南](../troubleshooting/codex-platform-issues.md)
