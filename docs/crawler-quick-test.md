# 爬虫系统快速测试指南

> 验证文档爬虫系统是否正常工作

## 测试前准备

确保已经安装所有依赖：

```bash
cd /Users/coso/Documents/dev/ai/wordflowlab/article-writer
npm install
```

## 测试 1: 静态页面爬取（小规模测试）

爬取少量页面，快速验证基本功能：

```bash
bash scripts/bash/research-docs.sh \
  --name "test-static" \
  --url "https://vuejs.org/guide/introduction.html" \
  --max-pages 5
```

**预期结果:**
- ✅ 成功爬取 5 页左右
- ✅ 创建 `_knowledge_base/raw/test-static/` 目录
- ✅ 创建 `_knowledge_base/indexed/test-static-*.md` 文件
- ✅ 创建搜索索引 `_knowledge_base/cache/search-index.db`

**验证:**
```bash
# 查看原始数据
ls _knowledge_base/raw/test-static/pages/

# 查看知识库索引
cat _knowledge_base/indexed/test-static-index.md

# 检查文件大小
du -sh _knowledge_base/
```

---

## 测试 2: 程序化调用（TypeScript）

直接使用 TypeScript API：

```typescript
// test-crawler.ts
import { CrawlerManager } from './src/crawler/crawler-manager.js';

async function testCrawler() {
  const manager = new CrawlerManager();
  
  const result = await manager.executeCrawl({
    name: 'test-api',
    url: 'https://vuejs.org/guide/',
    outputDir: './_knowledge_base',
    maxPages: 10
  });
  
  console.log('✅ 爬取完成:', result.totalPages, '页');
}

testCrawler();
```

运行：
```bash
tsx test-crawler.ts
```

---

## 测试 3: 搜索功能

测试 SQLite 全文搜索：

```typescript
// test-search.ts
import { SearchIndexer } from './src/crawler/search-indexer.js';

const indexer = new SearchIndexer('./_knowledge_base/cache/search-index.db');

// 搜索
const results = indexer.search('vue component', 10);
console.log('搜索结果:', results.length);

results.forEach(r => {
  console.log(`- ${r.title} (${r.category})`);
  console.log(`  ${r.snippet}\n`);
});

// 统计信息
const stats = indexer.getStats();
console.log('总页数:', stats.totalPages);
console.log('分类:', stats.categories);

indexer.close();
```

运行：
```bash
tsx test-search.ts
```

---

## 测试 4: 动态页面（可选）

**注意**: 首次运行会下载 Chromium (~200MB)，需要较长时间。

```bash
bash scripts/bash/research-docs.sh \
  --name "test-dynamic" \
  --url "https://react.dev/learn" \
  --dynamic \
  --max-pages 5
```

**预期结果:**
- ✅ Puppeteer 成功启动
- ✅ JavaScript 页面正确渲染
- ✅ 提取到完整内容

---

## 测试 5: PDF 提取（可选）

准备一个测试 PDF 文件，然后：

```bash
bash scripts/bash/research-docs.sh \
  --name "test-pdf" \
  --pdf ~/Downloads/sample.pdf
```

**预期结果:**
- ✅ PDF 文本成功提取
- ✅ 转换为 Markdown 格式
- ✅ 保存到知识库

---

## 测试 6: 在 AI 命令中使用

### 6.1 初始化项目

```bash
cd /path/to/your/project
content init test-article --here --workspace wechat
```

### 6.2 使用 /research 命令

在 AI 助手（Claude/Cursor等）中：

```
/research "Vue 3 官方文档" --url https://vuejs.org/guide/
```

AI 应该：
1. 检测到文档网站 URL
2. 调用爬虫系统
3. 显示进度
4. 保存到 `_knowledge_base/`
5. 生成报告

### 6.3 验证知识库

在 AI 助手中查看结果：

```
请读取 _knowledge_base/indexed/ 目录下的索引文件，列出爬取到的内容分类
```

---

## 常见问题排查

### 问题 1: 编译错误

```bash
npm run build
```

如果有错误，检查：
- TypeScript 版本
- 依赖是否完整安装

### 问题 2: 爬取失败

检查网络连接：
```bash
curl -I https://vuejs.org/guide/
```

检查脚本权限：
```bash
chmod +x scripts/bash/research-docs.sh
```

### 问题 3: Puppeteer 安装失败

跳过 Puppeteer 安装，只使用静态爬虫：
```bash
npm install --ignore-scripts
```

或手动安装：
```bash
npx puppeteer browsers install chrome
```

### 问题 4: SQLite 编译错误

如果 better-sqlite3 编译失败：

```bash
# macOS
brew install python

# 重新编译
npm rebuild better-sqlite3
```

---

## 性能基准测试

### 小规模 (10-20 页)
- 时间: 30-60 秒
- 内存: < 100MB
- 磁盘: < 5MB

### 中等规模 (50-100 页)
- 时间: 3-5 分钟
- 内存: 100-200MB
- 磁盘: 10-30MB

### 大规模 (200+ 页)
- 时间: 10-20 分钟
- 内存: 200-500MB
- 磁盘: 50-100MB

---

## 清理测试数据

测试完成后清理：

```bash
# 删除测试数据
rm -rf _knowledge_base/raw/test-*
rm -rf _knowledge_base/indexed/test-*
rm -f _knowledge_base/cache/search-index.db

# 重新创建空目录
mkdir -p _knowledge_base/raw _knowledge_base/indexed _knowledge_base/cache
```

---

## 成功标准

系统正常工作应该满足：

- ✅ 能成功爬取至少 5 页
- ✅ 生成正确的目录结构
- ✅ Markdown 文件格式正确
- ✅ 搜索索引可用
- ✅ 代码示例正确提取
- ✅ 分类功能正常
- ✅ 进度显示正常

---

## 下一步

测试通过后，可以：

1. 爬取真实的文档站（Vue, React, TypeScript 等）
2. 在写作时使用知识库
3. 定制自己的预设配置
4. 集成到 CI/CD 流程

---

**测试完成后，系统即可投入实际使用！** ✅

