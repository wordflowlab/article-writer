# 文档爬虫系统 - 实用示例

> 真实使用场景和示例命令

## 🎯 常见使用场景

### 场景 1: 创作 Vue 3 技术文章

**需求**: 写一篇"Vue 3 Composition API 实战"的技术文章

**步骤:**

```bash
# 1. 初始化项目
content init vue3-article --workspace wechat

# 2. 进入项目目录
cd vue3-article
```

在 AI 助手中：

```
# 3. 保存写作需求
/brief-save

我想写一篇关于 Vue 3 Composition API 的实战文章，
目标读者是前端开发者，字数 3000-4000 字。

# 4. 爬取官方文档（AI 会自动调用爬虫）
/research "Vue 3 官方文档" --url https://vuejs.org/guide/

# 等待爬取完成（约 10-15 分钟，爬取 200+ 页）
# AI 会显示进度: [████████░░] 80% (160/200)

# 5. 基于完整知识库讨论选题
/topic-discuss

# 6. 写作初稿（AI 会自动从知识库引用准确信息）
/write-draft

# 7. 审校
/audit style
```

**优势:**
- ✅ 有完整的 Vue 3 官方文档作为参考
- ✅ 代码示例准确（直接来自官方）
- ✅ API 说明无误
- ✅ 大幅减少 AI 编造内容

---

### 场景 2: 对比评测（Claude Code vs Cursor）

**需求**: 写一篇 AI 编程工具的对比评测

**步骤:**

```bash
content init ai-tools-comparison --workspace wechat
cd ai-tools-comparison
```

在 AI 助手中：

```
# 1. 爬取两个产品的文档
/research "Claude Code 文档" --url https://claude.ai/docs
/research "Cursor 文档" --url https://cursor.sh/docs

# 2. 查看知识库
请列出 _knowledge_base/indexed/ 中的所有文件

# 3. 基于两份完整文档创作对比文章
/write-draft

请基于爬取的两份文档，创作一篇对比评测。
重点对比：功能、性能、易用性、定价。
```

**优势:**
- ✅ 双方信息都来自官方
- ✅ 对比更公正、准确
- ✅ 细节更丰富

---

### 场景 3: 产品说明书改写

**需求**: 将产品 PDF 说明书改写为公众号文章

**步骤:**

```bash
content init product-intro --workspace wechat
cd product-intro

# 提取 PDF 内容
bash .content/scripts/bash/research-docs.sh \
  --name "product-manual" \
  --pdf "~/Downloads/产品说明书.pdf"
```

在 AI 助手中：

```
# 查看提取的内容
请读取 _knowledge_base/indexed/product-manual.md 并总结

# 基于 PDF 内容创作
/write-draft

请基于产品说明书的内容，改写为一篇通俗易懂的公众号介绍文章。
去掉技术术语，增加使用场景和案例。
```

---

### 场景 4: 框架学习笔记

**需求**: 学习 TypeScript，并写学习笔记

**步骤:**

```bash
content init typescript-notes --workspace general
cd typescript-notes
```

在 AI 助手中：

```
# 1. 爬取官方文档
/research "TypeScript 官方文档" --url https://www.typescriptlang.org/docs/

# 2. 选择感兴趣的主题
请列出 _knowledge_base/indexed/ 中 typescript 相关的所有分类

# 3. 基于特定章节创作学习笔记
/write-draft

请基于 TypeScript 文档中的"泛型"章节，
写一篇学习笔记，包含原理、使用场景和实战案例。
```

---

## 💡 实用技巧

### 技巧 1: 小规模测试

第一次使用时，先爬取少量页面测试：

```bash
bash .content/scripts/bash/research-docs.sh \
  --name "test" \
  --url "https://vuejs.org/guide/" \
  --max-pages 10  # 先爬 10 页测试
```

验证内容质量后，再增加 `--max-pages`。

### 技巧 2: 使用预设配置

系统内置了常用框架的配置，可以直接使用：

```typescript
// 查看预设
import { PRESET_CONFIGS } from './src/crawler/config.js';
console.log(Object.keys(PRESET_CONFIGS));
// ['vue', 'react', 'typescript', 'nextjs', 'python']
```

### 技巧 3: 组合使用多个知识库

可以爬取多个相关文档站：

```bash
# 爬取 Vue 核心
bash scripts/bash/research-docs.sh \
  --name "vue-core" \
  --url "https://vuejs.org/guide/" \
  --max-pages 150

# 爬取 Vue Router
bash scripts/bash/research-docs.sh \
  --name "vue-router" \
  --url "https://router.vuejs.org/guide/" \
  --max-pages 50

# 爬取 Pinia (状态管理)
bash scripts/bash/research-docs.sh \
  --name "pinia" \
  --url "https://pinia.vuejs.org/introduction.html" \
  --max-pages 30
```

AI 写作时会同时搜索所有知识库！

### 技巧 4: 查看爬取统计

```bash
# 查看索引
cat _knowledge_base/indexed/vue-index.md

# 查看某个分类
cat _knowledge_base/indexed/vue-api.md

# 统计知识库大小
du -sh _knowledge_base/
```

### 技巧 5: 清理旧数据

```bash
# 删除特定主题
rm -rf _knowledge_base/raw/old-topic
rm -f _knowledge_base/indexed/old-topic-*.md

# 重建搜索索引
rm -f _knowledge_base/cache/search-index.db
# 下次使用时会自动重建
```

---

## 🔍 高级用法

### 动态网站爬取

对于 React/Vue 构建的文档站（SPA），使用动态爬虫：

```bash
bash scripts/bash/research-docs.sh \
  --name "nextjs" \
  --url "https://nextjs.org/docs" \
  --dynamic \
  --max-pages 200
```

**注意**: 首次使用会下载 Chromium (~200MB)

### 自定义选择器

如果默认选择器无法提取内容，可以自定义：

```typescript
// 创建自定义配置
import { DocumentationCrawler } from './src/crawler/doc-crawler.js';

const crawler = new DocumentationCrawler({
  name: 'custom-docs',
  baseUrl: 'https://example.com/docs',
  maxPages: 100,
  selectors: {
    mainContent: '.documentation-body',  // 自定义选择器
    title: 'h1.doc-title',
    codeBlocks: 'pre.code-block code'
  }
});
```

### 程序化调用

```typescript
import { CrawlerManager } from './src/crawler/crawler-manager.js';

const manager = new CrawlerManager();

await manager.executeCrawl({
  name: 'my-docs',
  url: 'https://example.com/docs',
  outputDir: './_knowledge_base',
  maxPages: 200,
  useDynamic: false
});
```

---

## ⚡ 性能建议

### 优化爬取速度

```bash
# 增加并发数（谨慎使用）
# 修改 src/crawler/config.ts:
{
  concurrency: 10,  // 默认 5
  rateLimit: 300    // 默认 500ms
}
```

### 节省磁盘空间

爬取完成后，可以删除原始数据，只保留知识库：

```bash
# 保留知识库，删除原始数据
rm -rf _knowledge_base/raw/vue/
# 知识库仍可正常使用: _knowledge_base/indexed/vue-*.md
```

---

## 📞 故障排查

### 问题: 无法提取内容

```bash
# 解决: 检查选择器是否正确
# 打开目标网站 → DevTools → 找到正确的选择器
```

### 问题: 爬取太慢

```bash
# 解决: 减少最大页数或增加并发
--max-pages 50 --concurrency 10
```

### 问题: 动态页面失败

```bash
# 解决: 回退到静态爬虫
# 移除 --dynamic 参数
```

---

## 🎊 总结

文档爬虫系统让 article-writer 的信息调研能力提升到新的层次：

- **传统方式**: 手动搜索 → 零散信息 → 重复劳动
- **爬虫系统**: 一次爬取 → 结构化知识库 → 永久可用

**适用场景:**
- ✅ 技术文章创作
- ✅ 产品评测对比
- ✅ 学习笔记整理
- ✅ PDF 文档改写

**立即开始使用吧！** 🚀

---

更多信息请查看 [完整使用指南](crawler-guide.md)

