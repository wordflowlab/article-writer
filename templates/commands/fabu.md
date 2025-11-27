---
description: 使用内置脚本发布文章 (微信公众号/视频脚本/通用格式)
argument-hint: 无需参数,自动识别工作区类型
allowed-tools: Read(//workspaces/**/draft.md, //.content/config.json), Bash, Write
---

# 发布准备

## 功能说明

根据 `.content/config.json` 中的 `workspace` 类型，统一调用内置脚本或复制命令，生成最终可发布版本。

## ⚠️ 重要提醒

- **必须先读取 `.content/config.json`**，禁止猜测工作区类型。
- **禁止手动拼接 HTML**，所有公众号排版一律通过提供的脚本完成。
- **非公众号工作区** 不得调用公众号脚本。

---

## 支持平台

| workspace | 目标平台 | 输出文件 |
|-----------|----------|----------|
| `wechat`  | 微信公众号 | `publish/wechat.md` |
| `video`   | 视频脚本   | `publish/video-script.md` |
| `general` | 通用 Markdown | `publish/article.md` |

---

## 发布总流程

1. 读取 `.content/config.json` → 确认 `workspace`、格式化配置。
2. 找到文章目录 `workspaces/<type>/articles/<slug>/`，检查 `draft.md`。
3. 在文章目录执行 `/fabu`，生成 `publish/` 目录及目标稿件。
4. 根据工作区类型执行自动化处理（公众号需运行脚本，其他类型仅复制文件）。
5. 在 `publish/` 目录编写 `metadata.json`，补齐标题、日期等信息。

> `/fabu` 只会生成当前工作区需要的文件，不会跨类型输出。

---

## 微信公众号发布流程（仅当 `workspace = "wechat"`）

### 1. 读取配置

```bash
cat .content/config.json
```

- 确认 `workspace` 为 `wechat`。
- 记录 `formatting` 中的主题/高亮，以便脚本自动读取。

### 2. 准备稿件

`wechat.md` 必须以 frontmatter 开头，并至少包括 `title`、`cover` 字段：

```
---
title: 示例标题
cover: /Users/me/Pictures/cover.jpg
---

正文...
```

- `title`：公众号标题；
- `cover`：正文无首图时必填，可用 http(s) 链接或本地绝对路径；
- frontmatter 会被 `/publish` 保留在 `publish/wechat.md` 中。

### 3. 执行 `/fabu`

在文章目录运行：

```bash
/fabu
```

目录结构示例：

```
workspaces/wechat/articles/<slug>/
└── publish/
    ├── wechat.md
    ├── images/
    └── metadata.json (需补充)
```

### 4. 调用自动化脚本

> 所有公众号排版仅允许调用以下路径：`/Users/YanHaidao/Sites/SPEC/my-article/.content/scripts/bash/format-wechat-haidao.sh`

执行示例：

```bash
WECHAT_APP_ID="<AppID>" \
WECHAT_APP_SECRET="<AppSecret>" \
bash .content/scripts/bash/format-wechat-haidao.sh \
  workspaces/wechat/articles/<slug>/publish/wechat.md
```

说明：
- 使用绝对路径调用脚本，禁止改为相对路径或其他脚本；
- 仅传入 `wechat.md` 路径一个参数；
- 主题/高亮等样式由脚本自动读取，不需额外参数；
- **脚本输出即可作为发布结果，不需要单独保存 HTML 渲染内容**。

若脚本报错，请根据提示修正 frontmatter 或图片路径后重试。

### 5. 维护 `metadata.json`

在 `publish/` 目录写入：

```json
{
  "title": "文章标题",
  "date": "YYYY-MM-DD",
  "platform": "wechat",
  "tool": "auto-script"
}
```

可根据需要补充标签、摘要、作者等字段。

---

## 非 WeChat 工作区

这些工作区只需复制 `draft.md` 成目标文件，再维护 `metadata.json`，不需要运行脚本。

### video

```bash
mkdir -p workspaces/video/articles/<slug>/publish
cp workspaces/video/articles/<slug>/draft.md \
   workspaces/video/articles/<slug>/publish/video-script.md
```

### general

```bash
mkdir -p workspaces/general/articles/<slug>/publish
cp workspaces/general/articles/<slug>/draft.md \
   workspaces/general/articles/<slug>/publish/article.md
```

---

## metadata.json 参考结构

```json
{
  "title": "Claude Code vs Cursor: 5个真实场景深度对比",
  "subtitle": "用数据说话,帮你选对AI编程助手",
  "author": "用户名",
  "date": "2025-01-15",
  "tags": ["AI编程", "Claude Code", "Cursor", "工具评测"],
  "summary": "通过5个真实开发场景的深度测试...",
  "platforms": {
    "wechat": {
      "category": "科技",
      "原创": true
    }
  }
}
```

---

## 输出反馈模板（wechat）

```
✅ 公众号稿件生成完成！

📄 发布文件: workspaces/wechat/articles/<slug>/publish/wechat.md
⚙️ 调用脚本: /Users/YanHaidao/Sites/SPEC/my-article/.content/scripts/bash/format-wechat-haidao.sh
📝 元信息: publish/metadata.json

💡 下一步:
1. 复制脚本输出内容。
2. 登录公众号后台粘贴并检查排版。
3. 根据需要调整封面/标签。
```

---

## 常见问题

- **Q:** `command not found`?  
  **A:** 请确认上述脚本路径存在且具备执行权限。

- **Q:** 图片或封面地址报错？  
  **A:** 使用绝对路径或可访问的 http(s) 链接，并确保文件可读。

- **Q:** 需要修改主题或高亮？  
  **A:** 更新 `.content/config.json` 中的 `formatting` 字段，脚本会自动读取。

```json
{
  "workspace": "wechat",
  "formatting": {
    "theme": "lapis",
    "highlight": "solarized-light"
  }
}
```
