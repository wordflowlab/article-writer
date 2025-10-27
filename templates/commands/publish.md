---
description: 准备发布(根据工作区类型自动生成对应平台格式)
argument-hint: 无需参数,自动识别工作区类型
allowed-tools: Read(//workspaces/**/draft.md, //.content/config.json), Write(//workspaces/**/publish/**), Bash
scripts:
  sh: scripts/bash/format-wechat.sh
---

# 发布准备

## 功能说明

根据工作区配置生成对应平台格式。

## ⚠️ 重要提醒

**在执行任何操作前，必须先完成以下步骤：**

1. **读取 `.content/config.json`**
2. **检查 `workspace` 字段的值**
3. **只生成该工作区对应的平台文件**

**禁止行为:**
- ❌ 不要猜测工作区类型
- ❌ 不要生成多个平台的文件
- ❌ 不要为 wechat 工作区生成 zhihu.md
- ❌ 不要为 video 工作区生成 wechat.html
- ❌ 不要为 general 工作区生成 wechat.html

**正确做法:**
- ✅ 先读配置
- ✅ 根据 `workspace` 字段决定
- ✅ 只生成对应平台的文件

---

## 支持平台

⚠️ **重要**: 根据工作区类型自动生成对应平台格式

### 1. wechat 工作区 → 微信公众号 ⭐️

**自动生成:**
- ✅ 微信富文本 HTML (可直接复制到公众号后台)
- ✅ **一键复制按钮** - 自动打开浏览器,点击即可复制
- ✅ 应用配置的主题样式
- ✅ 代码高亮
- ✅ 图片样式优化
- ✅ 交互式 HTML 预览文件
- ✅ **快捷键支持** (Ctrl/Cmd+Shift+C)

**输出文件**:
- `publish/wechat.html` - 交互式 HTML,带一键复制功能
- `publish/wechat.md` - Markdown 原文(备份)

### 2. video 工作区 → 视频脚本

**格式特点:**
- 口语化表达(AI味<20%)
- 分镜标注
- 时长计算(1分钟≈150-180字)
- Hook设计(前3秒抓人)

**输出文件**: `publish/video-script.md`

### 3. general 工作区 → 通用格式

**格式特点:**
- 标准Markdown
- 灵活配置
- SEO优化选项
- 多平台适配

**输出文件**: `publish/article.md`

**可用于:**
- 知乎、简书、Medium
- 个人博客
- 技术文档站

---

## 使用方式

### 自动识别工作区类型

```bash
/publish
```

**系统会自动:**
1. 检查当前工作区类型（wechat/video/general）
2. 生成对应平台的格式
3. 不会生成其他平台的格式

**示例:**
- 在 `workspaces/wechat/` 中执行 → 只生成微信格式
- 在 `workspaces/video/` 中执行 → 只生成视频脚本格式
- 在 `workspaces/general/` 中执行 → 只生成通用格式

---

## 输出结构

### wechat 工作区

```
workspaces/wechat/articles/001-claude-code-评测/
└── publish/
    ├── wechat.html        # 微信富文本预览(带一键复制)
    ├── wechat.md          # Markdown原文备份
    ├── images/            # 复制的图片
    │   ├── cover.png
    │   └── screenshot-1.png
    └── metadata.json      # 元信息(标题/标签/摘要)
```

### general 工作区

```
workspaces/general/articles/001-my-article/
└── publish/
    ├── article.md         # 通用Markdown格式
    ├── images/            # 复制的图片
    └── metadata.json      # 元信息
```

### video 工作区

```
workspaces/video/articles/001-my-video/
└── publish/
    ├── video-script.md    # 视频脚本
    ├── images/            # 脚本配图
    └── metadata.json      # 元信息
```

---

## metadata.json 示例

```json
{
  "title": "Claude Code vs Cursor: 5个真实场景深度对比",
  "subtitle": "用数据说话,帮你选对AI编程助手",
  "author": "用户名",
  "date": "2025-01-15",
  "tags": ["AI编程", "Claude Code", "Cursor", "工具评测"],
  "summary": "通过5个真实开发场景的深度测试,对比Claude Code和Cursor...",
  "wordCount": 3005,
  "readTime": "8分钟",
  "platforms": {
    "wechat": {
      "category": "科技",
      "原创": true
    },
    "zhihu": {
      "topic": "编程工具",
      "tags": ["人工智能", "编程", "工具"]
    }
  }
}
```

---

## 执行流程

### 第 1 步: 读取工作区配置 ⚠️ 必须

**在生成任何文件前，必须先读取配置！**

```bash
# 读取 .content/config.json
cat .content/config.json
```

**检查 `workspace` 字段:**
```json
{
  "workspace": "wechat"  // 或 "video" 或 "general"
}
```

**根据配置决定生成哪些文件:**
- `"workspace": "wechat"` → 只生成 `wechat.html` 和 `wechat.md`
- `"workspace": "video"` → 只生成 `video-script.md`
- `"workspace": "general"` → 只生成 `article.md`

### 第 2 步: 定位文章文件

1. 在当前工作区目录下查找 `draft.md` 或最新的文章文件
2. 确认文章路径,例如: `workspaces/wechat/articles/my-article/draft.md`

### 第 3 步: 创建发布目录

```bash
mkdir -p workspaces/wechat/articles/my-article/publish
```

### 第 4 步: 根据工作区类型生成对应格式

**⚠️ 必须根据第1步读取的 `workspace` 配置来决定！**

#### 情况A: workspace = "wechat"

生成微信公众号格式：

**根据操作系统选择合适的脚本:**

- **macOS/Linux:**
  ```bash
  bash .content/scripts/bash/format-wechat.sh \
    workspaces/wechat/articles/my-article/draft.md \
    workspaces/wechat/articles/my-article/publish/wechat.html
  ```

- **Windows PowerShell:**
  ```powershell
  pwsh .content/scripts/bash/format-wechat.ps1 \
    workspaces/wechat/articles/my-article/draft.md \
    workspaces/wechat/articles/my-article/publish/wechat.html
  ```

- **跨平台 (Node.js):**
  ```bash
  node .content/scripts/format-wechat.js \
    workspaces/wechat/articles/my-article/draft.md \
    workspaces/wechat/articles/my-article/publish/wechat.html
  ```

**生成文件:**
- ✅ `publish/wechat.html` (交互式 HTML，带一键复制)
- ✅ `publish/wechat.md` (Markdown 备份)
- ❌ 不生成 zhihu.md 或其他平台文件

**脚本会自动:**
1. 读取 `.content/config.json` 中的 `formatting` 配置
2. 生成交互式 HTML 文件(带一键复制按钮)
3. 在默认浏览器中打开预览

#### 情况B: workspace = "video"

生成视频脚本格式：

```bash
# 复制 draft.md 到 publish/video-script.md
cp draft.md publish/video-script.md
```

**生成文件:**
- ✅ `publish/video-script.md` (视频脚本)
- ❌ 不生成 wechat.html 或其他平台文件

#### 情况C: workspace = "general"

生成通用Markdown格式：

```bash
# 复制 draft.md 到 publish/article.md
cp draft.md publish/article.md
```

**生成文件:**
- ✅ `publish/article.md` (通用格式)
- ❌ 不生成 wechat.html 或其他平台文件

### 第 5 步: 生成元信息

创建 `metadata.json`:

```json
{
  "title": "文章标题(从draft.md提取)",
  "author": "用户名",
  "date": "2025-01-26",
  "wordCount": 3005,
  "readTime": "8分钟",
  "platforms": ["wechat", "zhihu"]
}
```

---

## 输出示例

### wechat 工作区输出

```
✅ 发布文件已生成！

📦 输出目录: workspaces/wechat/articles/my-article/publish/

📄 生成文件:
- wechat.html (微信富文本预览, 可在浏览器打开)
- wechat.md (Markdown原文备份)
- metadata.json (元信息)

🎨 格式化配置:
- 主题: default
- 主题色: #3f51b5
- 字体: 16px

📋 元信息:
- 标题: Claude Code vs Cursor: 5个真实场景深度对比
- 字数: 3005字
- 预计阅读时间: 8分钟

💡 下一步:

**微信公众号发布** (一键复制):
1. 浏览器会自动打开 `publish/wechat.html` 预览页面
2. 点击页面顶部的 **"一键复制到微信"** 按钮
   - 或使用快捷键: Ctrl/Cmd + Shift + C
3. 打开微信公众号后台编辑器
4. 按 Ctrl+V (Mac: Cmd+V) 粘贴
5. 检查格式和图片
6. 发布!

🎉 恭喜完成整个写作流程！
```

### general 工作区输出

```
✅ 发布文件已生成！

📦 输出目录: workspaces/general/articles/my-article/publish/

📄 生成文件:
- article.md (通用Markdown格式)
- metadata.json (元信息)

💡 下一步:
1. 根据目标平台调整格式
2. 上传图片到对应平台
3. 发布!
```

### video 工作区输出

```
✅ 发布文件已生成！

📦 输出目录: workspaces/video/articles/my-video/publish/

📄 生成文件:
- video-script.md (视频脚本格式)
- metadata.json (元信息)

💡 下一步:
1. 根据脚本拍摄视频
2. 上传到视频平台
3. 发布!
```

---

## 注意事项

1. **图片路径**: 各平台需手动上传图片,替换为实际URL
2. **格式微调**: 复制到平台后,检查格式是否正常
3. **链接测试**: 确保所有外链可访问
4. **版权声明**: 如需,添加原创/转载声明

---

## 9步流程回顾

```
✅ 1. /specify      - 理解需求保存brief
✅ 2. /research        - 信息调研
✅ 3. /topic   - 讨论选题(用户选择)
✅ 4. /collect - 搜索真实素材
✅ 5. /write     - 撰写初稿
✅ 6. /review content   - 内容审校
✅ 7. /review style     - 风格审校(降AI味)
✅ 8. /review detail    - 细节审校
✅ 9. /images          - 配图建议
✅ 10. /check    - 最终检查(可选)
✅ 11. /publish        - 发布准备

🎉 全流程完成！
```
