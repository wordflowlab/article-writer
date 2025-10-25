# Article Writer 插件系统

## 插件列表

### 已实现插件

#### 1. AI味自检插件 (`ai-detector/`)
- **功能**: 利用AI自身能力检测文章的AI生成痕迹
- **命令**: `/ai-check [文件路径]`
- **检测维度**: 词汇(30分)、结构(30分)、情感(20分)、口语化(20分)
- **集成**: `/audit style` 自动调用

#### 2. 素材导入插件 (`materials-import/`)
- **功能**: 导入社交媒体数据(即刻/微博/Twitter)
- **命令**: `/import-materials <source> <file>`
- **支持格式**: CSV, JSON, Markdown
- **输出**: 自动分类索引到 `materials/indexed/`

---

### 规划中的插件

#### 3. 敏感词检测插件 (`sensitive-words/`)
- **功能**: 检测公众号/视频平台敏感词
- **词库**: 本地维护,可自定义更新
- **命令**: `/check-sensitive [文件]`
- **工作区**: 主要用于wechat和video工作区

#### 4. 格式转换插件 (`format-converter/`)
- **功能**: Markdown → HTML/公众号格式/纯文本
- **命令**: `/convert <target-format> [file]`
- **支持格式**: html, wechat, zhihu, plain
- **集成**: `/publish` 自动调用

#### 5. 字数统计插件 (`word-counter/`)
- **功能**: 实时统计字数、段落数、句子数
- **命令**: `/count [file]`
- **输出**: 详细统计报告 + 字数分布图

---

## 插件开发指南

### 插件结构

```
plugins/
└── plugin-name/
    ├── README.md          # 插件文档
    ├── command.md         # Slash command定义
    ├── config.json        # 配置文件(可选)
    └── assets/            # 资源文件(可选)
```

### Slash Command格式

```markdown
---
description: 插件简短描述
argument-hint: [参数提示]
allowed-tools: Read(//*), Write(//*), Grep(//**)
---

# 命令标题

## 功能说明
...

## 使用方式
...

## 处理流程
...
```

### 集成方式

**方式1: 独立命令**
- 在 `templates/commands/` 创建命令文件
- 构建时自动生成到各平台

**方式2: 被其他命令调用**
- 在主命令中引用插件逻辑
- 例如: `/audit` 调用 `/ai-check`

---

## 使用建议

1. **AI检测**: 初稿完成后立即检测,及早优化
2. **素材导入**: 开始写作前导入,确保有足够素材
3. **敏感词**: wechat工作区发布前必检
4. **格式转换**: 发布时根据平台自动转换
5. **字数统计**: 写作过程中随时查看进度

---

## 插件更新日志

### v0.1.0 (2025-01-15)
- ✅ AI味自检插件
- ✅ 素材导入插件
- 🚧 敏感词检测插件 (开发中)
- 🚧 格式转换插件 (规划中)
- 🚧 字数统计插件 (规划中)
