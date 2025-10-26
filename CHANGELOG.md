# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
