# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.10.3] - 2025-01-29

### Fixed - 再次优化：移除 29MB 的 pdf-parse

**问题**：pdf-parse (29MB) 是最大的依赖包，但只用于 PDF 文档爬取（很少使用）。

**解决方案**：
- ✅ **pdf-parse (29MB)** 改为可选依赖
- ✅ PDF 提取器支持懒加载，用时才安装
- ✅ 不影响网页爬虫功能

**效果**：
- ✅ 安装大小再减少 **29MB**
- ✅ 基础安装从 ~50MB 降至 **~21MB**

**按需安装**：
```bash
# 如需 PDF 文档爬取
npm install -g pdf-parse
```

## [0.10.2] - 2025-01-29

### Fixed - 优化可选依赖，大幅加快安装速度

**问题**：安装时卡在下载 Puppeteer (~200MB Chromium) 和多个云存储 SDK，即使用户不需要这些功能。

**解决方案**：
- ✅ **Puppeteer** 改为可选依赖（仅动态爬虫需要）
- ✅ **@aws-sdk/client-s3** 改为可选依赖（仅 AWS S3 图床需要）
- ✅ **ali-oss** 改为可选依赖（仅阿里云 OSS 图床需要）
- ✅ **cos-nodejs-sdk-v5** 改为可选依赖（仅腾讯云 COS 图床需要）
- ✅ **qiniu** 改为可选依赖（仅七牛云图床需要）
- ✅ 动态爬虫支持懒加载，用时才安装

**效果**：
- ✅ 安装速度从 ~3 分钟降至 **~30 秒**
- ✅ 安装包大小减少 **~200MB**
- ✅ 功能不变，需要时按需安装

**按需安装**：
```bash
# 需要动态爬虫时
npm install puppeteer

# 需要 AWS S3 图床时
npm install @aws-sdk/client-s3

# 需要阿里云 OSS 图床时
npm install ali-oss
```

## [0.10.1] - 2025-01-29

### Fixed - 移除 better-sqlite3 依赖，解决 Windows 安装问题

**问题**：Windows 用户在安装时需要 Visual Studio Build Tools (~6GB)，安装成本极高。

**解决方案**：
- ✅ 完全移除 `better-sqlite3` 依赖（从未被使用的搜索索引功能）
- ✅ 删除 `SearchIndexer` 类和相关代码
- ✅ AI 直接读取 Markdown 文件，无需数据库索引
- ✅ 简化安装流程，零 C++ 依赖

**影响**：
- ✅ Windows 用户无需安装 Visual Studio Build Tools
- ✅ 安装速度更快，跨平台体验一致
- ✅ 代码更简洁，删除 200+ 行无用代码

## [0.10.0] - 2025-01-26

### Added - 多模式写作系统 🎯

**核心理念：AI是你的写作伙伴，提供多种协作模式**

基于 [PRD-09](docs/prd/prd-09-multi-mode-writing.md) 实现多模式写作系统，完全保留 PRD-08 教练模式的同时，新增快速模式和混合模式。

#### 3种写作模式

1. **🎓 教练模式（完全保留 PRD-08）**
   - AI 角色：教练（提问引导）
   - AI 生成：0%（不生成内容）
   - 用户工作：100%（全写）
   - 时间投入：3-4 小时
   - AI 检测率：< 15%
   - 质量评级：⭐⭐⭐⭐⭐
   - 适用场景：产品评测、使用体验、深度观点
   - 工作原理：AI 提问 → 用户回答 → AI 引导写作 → AI 检查

2. **⚡ 快速模式（PRD-09 新增）**
   - AI 角色：助手（生成初稿）
   - AI 生成：100%（完整初稿）
   - 用户工作：20%（审校修改）
   - 时间投入：1-2 小时
   - AI 检测率：25-40%
   - 质量评级：⭐⭐⭐
   - 适用场景：论文解读、技术总结、知识科普
   - 工作原理：AI 生成完整初稿 → 用户审阅修改 → 迭代优化

3. **🔄 混合模式（PRD-09 新增）**
   - AI 角色：协作者（写框架）
   - AI 生成：40%（框架部分）
   - 用户工作：60%（核心内容）
   - 时间投入：2-3 小时
   - AI 检测率：18-25%
   - 质量评级：⭐⭐⭐⭐
   - 适用场景：技术教程、案例分析、实战方案
   - 工作原理：AI 写框架 → 用户填核心 → 整合成文

#### 核心功能

**智能推荐系统**
- `/specify` 自动识别文章类型（个人经历型/信息整理型/混合型）
- 根据主题关键词推荐最合适的写作模式
- 提供三种模式对比表，帮助用户决策

**文章类型判断逻辑**
```
IF 主题包含 [评测、体验、使用感受、对比实测、我的看法、深度观点]
  THEN 类型 = 个人经历型, 推荐模式 = 教练模式

ELSE IF 主题包含 [论文解读、技术总结、知识科普、XX介绍、资料整理]
  THEN 类型 = 信息整理型, 推荐模式 = 快速模式

ELSE IF 主题包含 [教程、案例分析、技术方案、实战指南、XX 实现]
  THEN 类型 = 混合型, 推荐模式 = 混合模式
```

**模式选择界面**
- 学习 Claude Code 的交互设计
- 清晰的视觉层次（emoji + 标题 + 描述）
- 关键指标透明（时间、AI 检测率、质量）
- 适用场景明确
- 简单的数字选择（1/2/3）

#### 修改的命令

1. **`/specify` - 定义需求**
   - ✅ 新增"文章类型分析"章节
   - ✅ 自动判断文章类型（个人经历型/信息整理型/混合型）
   - ✅ 推荐最合适的写作模式
   - ✅ 添加三种模式对比表
   - 文件：`templates/commands/specify.md`

2. **`/write` - 多模式写作（重大改造）**
   - ✅ 标题改为"多模式写作系统"
   - ✅ 添加模式选择界面（1/2/3 选择）
   - ✅ **完全保留**教练模式逻辑（PRD-08 原版，无任何改动）
   - ✅ 新增快速模式完整工作流
   - ✅ 新增混合模式完整工作流
   - ✅ 添加使用指南和 FAQ
   - 文件：`templates/commands/write.md`

3. **`/topic` - 选题讨论**
   - ✅ 添加"写作模式建议"章节
   - ✅ 显示推荐模式和三种模式对比
   - ✅ 提醒用户可在 `/write` 时自由选择
   - 文件：`templates/commands/topic.md`

#### 设计文档

1. **PRD-09 设计文档**
   - 完整的多模式写作系统设计
   - 三种模式详细规格说明
   - 用户场景和对比分析
   - 实施优先级和风险评估
   - 文件：`docs/prd/prd-09-multi-mode-writing.md`

2. **PRD-08 更新**
   - 添加 PRD-09 扩展说明章节
   - PRD-08 vs PRD-09 对比表
   - 强调教练模式完全保留
   - 文件：`docs/prd/prd-08-complete-workflow-redesign.md`

3. **实施总结文档**
   - 完整的实施过程记录
   - 文件修改清单
   - 设计亮点和预期效果
   - 后续建议
   - 文件：`IMPLEMENTATION_SUMMARY.md`

#### 工作流程变化

**原流程（PRD-08）：**
```
/specify → /topic → /research → /collect → /extract → /write(教练) → /authentic → /review → /publish
```

**新流程（PRD-09）：**
```
/specify  → 自动检测文章类型，推荐模式
   ↓
/topic    → 显示模式推荐
   ↓
/write    → 用户选择模式 (1/2/3)
   ↓
   ├─ 教练模式: /collect → /extract → AI 提问 → 用户写 → AI 检查
   ├─ 快速模式: AI 生成初稿 → 用户审校修改
   └─ 混合模式: AI 写框架 → 用户补充核心 → 整合
```

#### 用户价值

**灵活性 ⬆️**
- 根据文章类型选择合适模式
- 根据时间预算调整投入
- 根据质量要求选择模式

**效率 ⬆️**
- 快速模式：1-2 小时出稿
- 混合模式：2-3 小时出稿
- 教练模式：3-4 小时高质量（保持不变）

**体验 ⬆️**
- 不再被"道德绑架"
- 明确的模式预期
- 清晰的时间和质量权衡

### Changed

- README.md 更新，添加多模式系统说明
- 核心理念从"AI是教练"扩展为"AI是写作伙伴"
- 版本号更新为 0.10.0

### Technical Details

- 教练模式代码完全保留（一行未改）
- 快速模式和混合模式为新增功能
- 所有修改向后兼容
- 无破坏性变更

---

## [0.9.3] - 2025-01-xx

### Added - 图床系统 + 跨平台支持

**图床系统**
- ✅ 支持多云厂商图床（阿里云 OSS/腾讯云 COS/七牛云/AWS S3）
- ✅ 支持 Base64 内嵌图片
- ✅ 配置文件系统（`.content/image-hosting.json`）
- ✅ 图片上传命令

**跨平台增强**
- ✅ Codex CLI 自动安装支持
- ✅ PowerShell 格式化脚本支持
- ✅ Windows 平台兼容性改进

---

## [0.9.0] - 2025-10-27

### Added - 真实驱动完整实现 ⭐

**核心理念：AI不是代笔,而是教练**

基于 [PRD-08](docs/prd/prd-08-complete-workflow-redesign.md) 完整实现真实驱动工作流：

#### 3个核心新命令

1. **`/extract` - 提取真实经历**
   - AI提问引导（5-10个深度问题）
   - 用户详细回答并自己写完整经历
   - 保存结构化经历记录
   - 从一句话素材扩展到完整段落
   - 文件：`templates/commands/extract.md`

2. **`/authentic` - 5维真实性检查**
   - 温度检查（是否有真实情感）
   - 个性检查（是否是"你的"经历）
   - 地域性检查（如适用）
   - 真实细节检查（识别假细节，如"蜡笔在手心滚"）
   - 思想深度检查（是否有洞察）
   - 预估AI检测率，目标 < 25%
   - 文件：`templates/commands/authentic.md`

3. **`/hint` - 表达思路提示**
   - 提供4种表达思路框架（对比法/数据化/故事化/问题-解决）
   - AI只给结构，不给具体内容
   - 强调用户基于真实经历填充
   - 文件：`templates/commands/hint.md`

#### 1个核心改造

**`/write` - 教练模式（逻辑完全重写）**
   - ❌ 移除所有AI直接生成内容的逻辑
   - ✅ AI提问 → 用户写 → AI检查 循环
   - ✅ 逐段完成，每段实时检查AI味
   - ✅ 引用`/extract`中扩展的真实经历
   - ✅ 强制人工确认机制
   - 文件：`templates/commands/write.md`（大幅改造）

#### 命令增强

**`/specify` - 定义需求**
   - 新增"真实经历需求"字段
   - 素材库检查清单
   - ⚠️ 提醒：80%内容必须来自真实经历
   - 文件：`templates/commands/specify.md`

**`/topic` - 选题讨论**
   - AI只提供框架和角度，不生成具体标题
   - 标注"你需要填充"的内容
   - 强调素材库检查
   - 文件：`templates/commands/topic.md`

**`/check` - 发布前检查**
   - 新增真实性检查清单
   - 素材来源检查（80%来自素材库）
   - 细节真实性检查（无假细节）
   - AI检测指标（< 25%）
   - 编辑视角检查
   - 文件：`templates/commands/check.md`

**`/expand` - 快速扩展素材**
   - 添加缺失的shell脚本配置
   - 轻量级版本的`/extract`
   - 文件：`templates/commands/expand.md`

**其他命令**
   - 所有命令模板添加缺失的shell脚本配置
   - 修复构建警告

#### 构建系统

**修复TOML生成**
   - 修复中文字符解析问题
   - 使用单引号字符串（literal strings）
   - 所有13个平台成功构建
   - 文件：`scripts/build/generate-commands.sh`

#### 完整命令列表（13个）

**主流程（11步）：**
1. `/specify` - 定义需求 ⚠️
2. `/topic` - 选题讨论 ⚠️
3. `/research` - 信息搜索 ✅
4. `/collect` - 搜索素材 ✅
5. `/extract` - 提取经历 ⭐ 新增
6. `/write` - AI教练写作 ⭐ 改造
7. `/authentic` - 真实性检查 ⭐ 新增
8. `/review` - 三遍审校 ✅
9. `/images` - 配图建议 ✅
10. `/check` - 发布检查 ⚠️
11. `/publish` - 发布指南 ✅

**辅助命令（2个）：**
- `/hint` - 表达思路 ⭐ 新增
- `/expand` - 快速扩展 ✅

#### 核心指标

- ✅ AI不越界：无法生成可直接使用的段落
- ✅ 真实性达标：80%来自个人素材库
- ✅ AI检测率 < 25%
- ✅ 5维检查通过
- ✅ 编辑无法识别AI痕迹

### Technical

- 支持13个AI平台（Claude、Gemini、Cursor、Windsurf等）
- 命令命名保持简短易记（≤8字符）
- 向后不兼容的破坏性变更（`/write`逻辑完全重写）
- 完整的AI边界控制机制

### Documentation

- 新增 [PRD-08](docs/prd/prd-08-complete-workflow-redesign.md) - 完整流程设计
- 更新 README.md - 反映v0.9.0特性
- 完整的命令模板文档

## [0.8.0] - 2025-10-27

### Added - 图床系统 🖼️

**多云厂商支持 + Base64内嵌**

- 支持阿里云OSS、腾讯云COS、七牛云Kodo
- 支持Base64内嵌（无需云服务）
- 自动检测并转换Markdown中的本地图片
- 支持图片压缩和格式转换
- 详见相关提交日志

### Fixed

- 修复图床系统TypeScript编译错误
- 修复类型定义问题

## [0.7.0] - 2025-10-27

### Added - 微信公众号一键复制

- 基于doocs/md的微信格式化
- 一键复制到公众号编辑器
- 支持多种主题和样式

## [0.6.0] - 2025-10-27

### Changed - 命令重命名 🔄

**参考 [spec-kit](https://github.com/sublayerapp/spec-kit) 设计理念,优化命令名称:**

| 旧命令 | 新命令 | 说明 |
|--------|--------|------|
| `/brief-save` | `/specify` | 定义创作需求 |
| `/topic-discuss` | `/topic` | 选题讨论 |
| `/materials-search` | `/collect` | 素材收集 |
| `/write-draft` | `/write` | 撰写初稿 |
| `/audit` | `/review` | 内容审校 |
| `/final-check` | `/check` | 发布前检查 |

**保持不变:**
- `/research` - 信息调研
- `/images` - 配图建议
- `/publish` - 发布指南

**新工作流程:**
```
/specify → /topic → /research → /collect → /write → /review → /images → /check → /publish
```

**设计理念:**
- ✅ 命令简洁统一(都是简短英文单词)
- ✅ 与 spec-kit 保持一致(`/specify` 作为第一步)
- ✅ 更符合国际化习惯
- ✅ 易于记忆和输入

### Removed

- ❌ **不再支持旧命令别名** - 旧命令名已完全移除

**迁移指南:**
如果您有自定义脚本或文档引用了旧命令,请更新为新命令名。

## [0.5.2] - 2025-10-26

### Fixed

- 修复 `/brief-save` 命令的选项标注问题
- 添加明确的 (a) (b) (c) (d) 选项标注，提升用户体验
- 强调动态生成选项，避免使用固定模板
- 要求选项内容与用户需求高度匹配
- 添加上下文相关的选项生成指导原则

## [0.5.1] - 2025-10-26

### Fixed

- 修复 `content init` 命令后显示的命令提示（从 novel-writer 命令改为 article-writer 命令）
- 修复 `content --help` 输出的示例命令
- 更新提示信息从"小说项目"改为"文章项目"
- 更新推荐流程提示

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
