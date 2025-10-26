# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.5.0] - 2025-10-26

### Added - 文档爬虫系统 🚀

- **完整的文档爬取系统**
  - 静态页面爬取 (cheerio + axios)
  - 动态页面支持 (Puppeteer)
  - PDF 文档提取 (pdf-parse)
  - 智能内容分类（6个预设分类）
  - 代码语言自动检测（10+语言）
  - 全文搜索索引 (SQLite FTS5)
  - 实时进度显示和ETA预估

- **核心爬虫模块** (~1,970行代码)
  - `src/crawler/types.ts` - 完整类型定义
  - `src/crawler/doc-crawler.ts` - 主爬虫引擎
  - `src/crawler/dynamic-crawler.ts` - 动态页面支持
  - `src/crawler/pdf-extractor.ts` - PDF提取器
  - `src/crawler/knowledge-converter.ts` - 知识库转换
  - `src/crawler/search-indexer.ts` - 搜索索引
  - `src/crawler/progress-bar.ts` - 进度显示
  - `src/crawler/crawler-manager.ts` - 统一管理器
  - `src/crawler/utils.ts` - 工具函数
  - `src/crawler/config.ts` - 预设配置（Vue/React/TypeScript等）

- **CLI 和脚本支持**
  - `src/commands/research-docs.ts` - TypeScript CLI 接口
  - `scripts/bash/research-docs.sh` - Bash脚本入口

- **集成到 /research 命令**
  - 自动检测文档网站URL
  - 支持三种模式：网页爬取 / PDF提取 / 常规搜索
  - 无缝集成到现有写作流程

- **知识库系统**
  - `_knowledge_base/raw/` - 原始JSON数据
  - `_knowledge_base/indexed/` - Markdown知识库
  - `_knowledge_base/cache/` - SQLite搜索索引
  - 支持全文搜索和分类查询

- **新增依赖** (7个生产依赖)
  - `axios@^1.6.0` - HTTP请求
  - `better-sqlite3@^9.2.2` - 搜索索引
  - `cheerio@^1.0.0-rc.12` - HTML解析
  - `p-limit@^5.0.0` - 并发控制
  - `pdf-parse@^1.1.1` - PDF提取
  - `puppeteer@^21.6.1` - 动态页面
  - `turndown@^7.1.2` - HTML转Markdown

- **完整文档**
  - `docs/crawler-guide.md` - 详细使用指南
  - `docs/crawler-implementation-summary.md` - 实施总结
  - `docs/crawler-quick-test.md` - 快速测试指南
  - `_knowledge_base/README.md` - 知识库说明

### Changed

- 增强 `templates/commands/research.md` - 添加文档爬取模式
- 更新 `.gitignore` - 排除知识库生成数据
- 更新 `README.md` - 添加爬虫系统说明

### Technical

- 支持并发爬取（可配置并发数）
- 智能错误重试和降级策略
- URL去重和规范化
- 进度缓存和断点续传准备
- 跨平台支持（macOS/Linux/Windows）

### Usage

```bash
# 爬取网页文档
bash scripts/bash/research-docs.sh \
  --name "vue" \
  --url "https://vuejs.org/guide/" \
  --max-pages 200

# 提取 PDF
bash scripts/bash/research-docs.sh \
  --name "manual" \
  --pdf "~/Downloads/manual.pdf"

# 在 AI 命令中使用
/research "Vue 3 官方文档" --url https://vuejs.org/guide/
```

## [0.4.0] - 2025-10-26

### Added

- **微信公众号 Markdown 自动格式化功能**
  - 基于 [doocs/md](https://github.com/doocs/md) 的核心渲染引擎
  - 支持三大主题系统: `default`(经典)、`grace`(优雅)、`simple`(简洁)
  - 交互式主题选择: 在 `content init` 时可选择主题和颜色
  - 完整配置驱动: 通过 `.content/config.json` 自定义样式
  - 零命令增加: 集成到现有 `/publish` 命令中
  - HTML 预览生成: 自动生成 `publish/wechat.html` 预览文件
  - 支持 12+ 编程语言的代码高亮
  - 链接自动转脚注功能
  - 详细文档: `docs/wechat-formatting.md`

- **核心文件**
  - `src/formatters/wechat-formatter.ts` - 微信格式化核心引擎
  - `scripts/bash/format-wechat.sh` - 格式化脚本
  - `examples/test-formatter.ts` - 测试示例
  - `docs/wechat-formatting.md` - 完整使用文档
  - `INTEGRATION_SUMMARY.md` - 集成技术总结

- **新增依赖**
  - `marked@^16.4.1` - Markdown 解析器
  - `highlight.js@^11.11.1` - 代码语法高亮
  - `juice@^11.0.3` - CSS 内联处理

### Changed

- 更新 `src/cli.ts`: 集成主题选择到初始化流程
- 更新 `src/utils/interactive.ts`: 新增 `selectFormattingTheme()` 函数
- 更新 `templates/commands/publish.md`: 添加微信格式化执行流程
- 更新 `.content/config.json` 模板: 添加 `formatting` 配置节

### Documentation

- 新增微信格式化完整使用文档
- 更新 README.md 添加 v0.4.0 特性说明
- 新增集成技术总结文档

## [0.2.0] - 2025-10-26

### Added

- 交互式启动界面（箭头键选择）
- 改用 `.content/` 配置目录
- 改进用户体验和文档

## [0.1.0] - 2025-10-26

### Added

- 九步写作流程完整实现
- 工作区系统(wechat/video/general)
- AI 味自检插件
- 素材导入插件
- 支持 13 个 AI 平台

[0.4.0]: https://github.com/wordflowlab/article-writer/compare/v0.2.0...v0.4.0
[0.2.0]: https://github.com/wordflowlab/article-writer/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/wordflowlab/article-writer/releases/tag/v0.1.0
