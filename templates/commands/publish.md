---
description: 准备发布(生成各平台格式)
argument-hint: [平台] [项目路径] - 平台: wechat|zhihu|all
allowed-tools: Read(//workspaces/**/draft.md), Write(//workspaces/**/publish/**)
---

# 发布准备

## 功能说明

将文章转换为各平台所需格式,生成发布文件。

---

## 支持平台

### 1. 公众号 (WeChat)

**格式要求:**
- Markdown格式(135编辑器/秀米转换)
- 图片外链或本地上传
- 特殊样式代码

**输出文件**: `publish/wechat.md`

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

## 输出示例

```
✅ 发布文件已生成！

📦 输出目录: workspaces/wechat/articles/001-*/publish/

📄 生成文件:
- wechat.md (公众号格式, 3005字)
- zhihu.md (知乎格式, 3005字)
- metadata.json (元信息)
- images/ (4张图片)

📋 元信息:
- 标题: Claude Code vs Cursor: 5个真实场景深度对比
- 标签: AI编程, Claude Code, Cursor, 工具评测
- 预计阅读时间: 8分钟

💡 下一步:
1. 复制对应平台的.md文件内容
2. 在平台编辑器中粘贴
3. 上传图片(如需)
4. 预览检查
5. 发布!

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
✅ 1. /brief-save      - 理解需求保存brief
✅ 2. /research        - 信息调研
✅ 3. /topic-discuss   - 讨论选题(用户选择)
✅ 4. /materials-search - 搜索真实素材
✅ 5. /write-draft     - 撰写初稿
✅ 6. /audit content   - 内容审校
✅ 7. /audit style     - 风格审校(降AI味)
✅ 8. /audit detail    - 细节审校
✅ 9. /images          - 配图建议
✅ 10. /final-check    - 最终检查(可选)
✅ 11. /publish        - 发布准备

🎉 全流程完成！
```
