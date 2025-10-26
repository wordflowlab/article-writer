# Release Notes - v0.5.0

> 发布日期: 2025-10-26
> 
> **重大更新**: 集成完整的文档爬虫系统 🚀

## 🎉 重大特性

### 文档爬虫系统

article-writer 现在可以自动爬取技术文档网站，建立结构化知识库，大幅提升 `/research` 命令的能力！

**主要能力:**
- ✅ 静态页面爬取 (cheerio + axios)
- ✅ 动态页面支持 (Puppeteer)
- ✅ PDF 文档提取 (pdf-parse)
- ✅ 智能内容分类（6个预设分类）
- ✅ 代码语言自动检测（10+语言）
- ✅ 全文搜索索引 (SQLite FTS5)
- ✅ 实时进度显示和ETA预估

---

## 📖 使用示例

### 1. 爬取技术文档

```bash
bash scripts/bash/research-docs.sh \
  --name "vue" \
  --url "https://vuejs.org/guide/" \
  --max-pages 200
```

**输出:**
```
📚 文档爬取完成:
  - 总页数: 186 页
  - 分类: 5 个(入门指南/API参考/示例代码等)
  - 存储: _knowledge_base/raw/vue/
  - 知识库: _knowledge_base/indexed/vue-index.md
```

### 2. 在 AI 命令中使用

```
/research "Vue 3 官方文档" --url https://vuejs.org/guide/
```

AI 会自动：
1. 检测到是文档网站
2. 调用爬虫系统
3. 显示实时进度
4. 保存到知识库
5. 建立搜索索引

### 3. 提取 PDF 文档

```bash
bash scripts/bash/research-docs.sh \
  --name "manual" \
  --pdf "~/Downloads/product-manual.pdf"
```

---

## 🔧 技术实现

### 新增模块 (~1,970 行代码)

#### 核心爬虫
- `src/crawler/types.ts` - 类型定义
- `src/crawler/doc-crawler.ts` - 主爬虫引擎
- `src/crawler/dynamic-crawler.ts` - 动态页面支持
- `src/crawler/pdf-extractor.ts` - PDF 提取器

#### 知识库系统
- `src/crawler/knowledge-converter.ts` - 知识库转换
- `src/crawler/search-indexer.ts` - 搜索索引 (SQLite)

#### 辅助模块
- `src/crawler/progress-bar.ts` - 进度显示
- `src/crawler/crawler-manager.ts` - 统一管理器
- `src/crawler/utils.ts` - 工具函数
- `src/crawler/config.ts` - 预设配置

#### CLI 和脚本
- `src/commands/research-docs.ts` - TypeScript CLI
- `scripts/bash/research-docs.sh` - Bash 脚本

---

## 📦 新增依赖

### 生产依赖 (7个)
```json
{
  "axios": "^1.6.0",           // HTTP 请求
  "better-sqlite3": "^9.2.2",  // 搜索索引
  "cheerio": "^1.0.0-rc.12",   // HTML 解析
  "p-limit": "^5.0.0",         // 并发控制
  "pdf-parse": "^1.1.1",       // PDF 提取
  "puppeteer": "^21.6.1",      // 动态页面
  "turndown": "^7.1.2"         // HTML → Markdown
}
```

### 开发依赖 (4个)
```json
{
  "@types/cheerio": "^0.22.35",
  "@types/turndown": "^5.0.4",
  "@types/better-sqlite3": "^7.6.8",
  "@types/pdf-parse": "^1.1.4"
}
```

---

## 🗂️ 知识库目录结构

```
_knowledge_base/
├── raw/              # 爬取的原始 JSON 数据
│   └── {topic}/
│       ├── pages/
│       └── summary.json
├── indexed/          # 转换后的 Markdown 知识库
│   ├── {topic}-index.md
│   ├── {topic}-getting-started.md
│   ├── {topic}-api.md
│   └── ...
└── cache/            # SQLite 全文搜索索引
    └── search-index.db
```

---

## 📚 文档

### 新增文档
- **[docs/crawler-guide.md](docs/crawler-guide.md)** - 详细使用指南
- **[docs/crawler-quick-test.md](docs/crawler-quick-test.md)** - 快速测试指南
- **[docs/crawler-implementation-summary.md](docs/crawler-implementation-summary.md)** - 实施总结
- **[_knowledge_base/README.md](_knowledge_base/README.md)** - 知识库说明

### 更新文档
- **templates/commands/research.md** - 增强了三种调研模式
- **README.md** - 添加爬虫系统说明
- **CHANGELOG.md** - 完整的更新日志

---

## 🎯 预设配置

内置了 5 个常用框架的预设配置：

1. **Vue.js** - `https://vuejs.org/guide/`
2. **React** - `https://react.dev/learn`
3. **TypeScript** - `https://www.typescriptlang.org/docs/`
4. **Next.js** - `https://nextjs.org/docs`
5. **Python** - `https://docs.python.org/3/`

查看: `src/crawler/config.ts`

---

## ⚡ 性能指标

| 页数 | 并发数 | 预计时间 |
|------|--------|----------|
| 50 | 5 | 2-3 分钟 |
| 100 | 5 | 5-8 分钟 |
| 200 | 5 | 10-15 分钟 |
| 500 | 10 | 15-25 分钟 |

---

## 🔄 升级指南

### 从 v0.4.x 升级

```bash
# 1. 更新包
npm install -g article-writer-cn@0.5.0

# 2. 无需额外配置
# 新功能通过 /research 命令自动可用

# 3. 测试爬虫功能（可选）
bash scripts/bash/research-docs.sh \
  --name "test" \
  --url "https://vuejs.org/guide/" \
  --max-pages 5
```

**兼容性**: 完全向后兼容，所有现有功能正常工作。

---

## ⚠️ 注意事项

### Puppeteer 安装
- 首次使用动态爬虫时，Puppeteer 会下载 Chromium (~200MB)
- 如果不需要动态页面支持，可以只使用静态爬虫

### 磁盘空间
- 大型文档站可能占用 50-100MB 空间
- 建议定期清理 `_knowledge_base/raw/` 目录

### 速率限制
- 默认设置尊重网站服务器（500ms/页）
- 请勿过度增加并发数，避免被封禁

---

## 🐛 已知问题

暂无已知问题。如遇到问题，请在 [GitHub Issues](https://github.com/wordflowlab/article-writer/issues) 报告。

---

## 🙏 致谢

本次更新的爬虫系统借鉴了 [Skill_Seekers](https://github.com/yusufkaraaslan/Skill_Seekers) 项目的文档爬取思路，但使用纯 TypeScript 重新实现，更好地集成到 article-writer 的技术栈中。

---

## 📦 安装

```bash
# NPM
npm install -g article-writer-cn@0.5.0

# 验证安装
content --version
# 应该输出: 0.5.0
```

---

## 🔗 相关链接

- **NPM Package**: https://www.npmjs.com/package/article-writer-cn
- **GitHub Repository**: https://github.com/wordflowlab/article-writer
- **使用文档**: [docs/crawler-guide.md](docs/crawler-guide.md)
- **快速测试**: [docs/crawler-quick-test.md](docs/crawler-quick-test.md)

---

**Happy Crawling! 🕷️📚**

