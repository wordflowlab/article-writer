# 知识库目录

这个目录用于存储通过文档爬虫系统获取的文档资料。

## 目录结构

```
_knowledge_base/
├── raw/              # 爬取的原始数据
│   └── {topic}/
│       ├── pages/    # 每个页面的 JSON 文件
│       └── summary.json  # 爬取摘要
├── indexed/          # 转换后的 Markdown 知识库
│   ├── {topic}-index.md  # 总索引
│   ├── {topic}-getting-started.md  # 入门指南
│   ├── {topic}-api.md  # API 参考
│   └── ...           # 其他分类
└── cache/            # 搜索索引
    └── search-index.db  # SQLite 全文搜索数据库
```

## 使用方式

### 爬取网页文档

```bash
bash scripts/bash/research-docs.sh \
  --name "vue3-docs" \
  --url "https://vuejs.org/guide/" \
  --max-pages 200
```

### 提取 PDF 文档

```bash
bash scripts/bash/research-docs.sh \
  --name "manual" \
  --pdf "~/Downloads/manual.pdf"
```

### 在 AI 命令中使用

在使用 `/research` 命令时，如果提供了文档网站 URL，AI 会自动调用爬虫系统。

爬取完成后，AI 在写作时会自动搜索这个知识库。

## 注意事项

- `raw/` 目录包含原始数据，请勿手动修改
- `indexed/` 目录的 Markdown 文件可以手动查看和编辑
- `cache/` 目录包含搜索索引，可以删除并重新生成
- 大型文档站可能占用数百 MB 空间

## 维护

### 清理旧数据

```bash
# 删除特定主题
rm -rf _knowledge_base/raw/vue3-docs
rm -f _knowledge_base/indexed/vue3-docs-*.md

# 清空搜索索引
rm -f _knowledge_base/cache/search-index.db
```

### 更新文档

重新运行爬取命令即可覆盖旧数据。

