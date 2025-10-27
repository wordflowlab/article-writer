---
description: 准备发布(生成各平台格式,自动生成微信富文本)
argument-hint: [平台] [项目路径] - 平台: wechat|zhihu|all
allowed-tools: Read(//workspaces/**/draft.md, //.content/config.json), Write(//workspaces/**/publish/**), Bash
scripts:
  sh: scripts/bash/format-wechat.sh
---

# 发布准备

## 功能说明

将文章转换为各平台所需格式,自动生成微信公众号富文本 HTML。

---

## 支持平台

### 1. 公众号 (WeChat) ⭐️ 自动格式化 + 一键复制

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

### 2. 知乎 (Zhihu)

**格式要求:**
- Markdown格式(知乎支持基础Markdown)
- 图片需上传知乎图床或使用外链
- 代码块使用```标记

**输出文件**: `publish/zhihu.md`

### 3. 其他平台

- 简书: Markdown
- Medium: Markdown
- 个人博客: HTML或Markdown

---

## 使用方式

### 生成所有平台格式
```bash
/publish all
```

### 生成指定平台
```bash
/publish wechat
/publish zhihu
```

---

## 输出结构

```
workspaces/wechat/articles/001-claude-code-评测/
└── publish/
    ├── wechat.md          # 公众号格式
    ├── zhihu.md           # 知乎格式
    ├── images/            # 复制的图片
    │   ├── cover.png
    │   └── screenshot-1.png
    └── metadata.json      # 元信息(标题/标签/摘要)
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

## 平台特殊处理

### 公众号

**样式处理:**
- 标题居中
- 引用块特殊样式
- 代码块语法高亮

**图片处理:**
- 建议先上传到微信公众平台,获取图片URL
- 或使用图床(如图壳、SM.MS)

### 知乎

**限制:**
- 标题不能过长(建议<30字)
- 不支持部分Markdown语法(如表格嵌套)

**优化:**
- 添加知乎话题标签
- 首段总结(提升推荐率)

---

## 执行流程

### 第 1 步: 定位文章文件

1. 在当前工作区目录下查找 `draft.md` 或最新的文章文件
2. 确认文章路径,例如: `workspaces/wechat/articles/my-article/draft.md`

### 第 2 步: 创建发布目录

```bash
mkdir -p workspaces/wechat/articles/my-article/publish
```

### 第 3 步: 生成微信格式化 HTML (自动打开浏览器)

调用格式化脚本:

```bash
bash .content/scripts/bash/format-wechat.sh \
  workspaces/wechat/articles/my-article/draft.md \
  workspaces/wechat/articles/my-article/publish/wechat.html
```

**脚本会自动:**
1. 生成交互式 HTML 文件(带一键复制按钮)
2. 在默认浏览器中打开预览
3. 显示使用说明

**配置说明**:

格式化会自动读取 `.content/config.json` 中的 `formatting` 配置:

```json
{
  "formatting": {
    "theme": "default",              // 主题: default | grace | simple
    "primaryColor": "#3f51b5",       // 主题色
    "fontSize": "16px",              // 字体大小
    "isUseIndent": false,            // 首行缩进
    "isUseJustify": false,           // 两端对齐
    "isShowLineNumber": false,       // 代码行号
    "citeStatus": true               // 脚注
  }
}
```

### 第 4 步: 生成其他平台格式(可选)

- 知乎格式: 直接复制 Markdown 原文
- 其他平台: 根据需要调整

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

```
✅ 发布文件已生成！

📦 输出目录: workspaces/wechat/articles/my-article/publish/

📄 生成文件:
- wechat.html (微信富文本预览, 可在浏览器打开)
- wechat.md (Markdown原文备份)
- zhihu.md (知乎格式)
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

**知乎发布**:
1. 复制 `publish/zhihu.md` 内容
2. 粘贴到知乎编辑器
3. 上传图片
4. 发布!

🎉 恭喜完成整个写作流程！
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
