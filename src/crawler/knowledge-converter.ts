/**
 * 知识库转换器 - 将爬取结果转换为知识库格式
 */

import fs from 'fs-extra';
import path from 'path';
import type { CrawledPage, CrawlSummary } from './types.js';

export class KnowledgeConverter {
  /**
   * 将爬取结果转换为知识库格式
   */
  async convertToKnowledgeBase(
    rawDir: string,
    outputDir: string
  ): Promise<void> {
    console.log('🔄 开始转换知识库...');

    const summary = await fs.readJSON(path.join(rawDir, 'summary.json')) as CrawlSummary;
    const pages = await this.loadPages(path.join(rawDir, 'pages'));

    // 按分类生成 Markdown 文件
    const categorized = this.categorizePages(pages);

    for (const [category, categoryPages] of Object.entries(categorized)) {
      const markdown = this.generateCategoryMarkdown(
        summary.name,
        category,
        categoryPages
      );

      const filename = `${summary.name}-${category}.md`;
      await fs.writeFile(path.join(outputDir, filename), markdown);
    }

    // 生成总索引
    const indexMarkdown = this.generateIndexMarkdown(summary, categorized);
    await fs.writeFile(path.join(outputDir, `${summary.name}-index.md`), indexMarkdown);

    console.log(`✅ 知识库转换完成: ${outputDir}`);
    console.log(`📚 生成文件数: ${Object.keys(categorized).length + 1}`);
  }

  /**
   * 加载所有页面
   */
  private async loadPages(pagesDir: string): Promise<CrawledPage[]> {
    const files = await fs.readdir(pagesDir);
    const pages: CrawledPage[] = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        const page = await fs.readJSON(path.join(pagesDir, file));
        pages.push(page);
      }
    }

    return pages;
  }

  /**
   * 分类页面
   */
  private categorizePages(pages: CrawledPage[]): Record<string, CrawledPage[]> {
    const categories: Record<string, CrawledPage[]> = {};

    for (const page of pages) {
      if (!categories[page.category]) {
        categories[page.category] = [];
      }
      categories[page.category].push(page);
    }

    return categories;
  }

  /**
   * 生成分类 Markdown 文档
   */
  private generateCategoryMarkdown(
    name: string,
    category: string,
    pages: CrawledPage[]
  ): string {
    const categoryTitle = this.formatCategoryName(category);

    let markdown = `# ${name} - ${categoryTitle}\n\n`;
    markdown += `> 本文档包含 ${pages.length} 个页面\n`;
    markdown += `> 最后更新: ${new Date().toLocaleDateString('zh-CN')}\n\n`;

    // 目录
    markdown += `## 目录\n\n`;
    for (const page of pages) {
      const anchor = this.slugify(page.title);
      markdown += `- [${page.title}](#${anchor})\n`;
    }
    markdown += `\n---\n\n`;

    // 内容
    for (const page of pages) {
      markdown += `## ${page.title}\n\n`;
      markdown += `**来源**: [${page.url}](${page.url})\n\n`;
      
      // 添加内容
      if (page.content) {
        markdown += page.content + '\n\n';
      }

      // 代码示例
      if (page.codeExamples && page.codeExamples.length > 0) {
        markdown += `### 代码示例\n\n`;
        
        // 限制显示前5个代码示例
        const examplestoShow = page.codeExamples.slice(0, 5);
        for (const example of examplestoShow) {
          markdown += '```' + example.language + '\n';
          markdown += example.content + '\n';
          markdown += '```\n\n';
        }
        
        if (page.codeExamples.length > 5) {
          markdown += `_... 还有 ${page.codeExamples.length - 5} 个代码示例_\n\n`;
        }
      }

      markdown += `---\n\n`;
    }

    return markdown;
  }

  /**
   * 生成索引 Markdown
   */
  private generateIndexMarkdown(
    summary: CrawlSummary,
    categorized: Record<string, CrawledPage[]>
  ): string {
    let markdown = `# ${summary.name} - 知识库索引\n\n`;
    markdown += `**来源**: ${summary.baseUrl}\n`;
    markdown += `**爬取时间**: ${new Date(summary.crawledAt).toLocaleDateString('zh-CN')}\n`;
    markdown += `**总页数**: ${summary.totalPages}\n\n`;

    markdown += `## 📚 分类目录\n\n`;

    for (const [category, pages] of Object.entries(categorized)) {
      const categoryName = this.formatCategoryName(category);
      markdown += `### ${categoryName} (${pages.length} 页)\n\n`;
      
      // 显示前10个页面
      const pagesToShow = pages.slice(0, 10);
      for (const page of pagesToShow) {
        const anchor = this.slugify(page.title);
        markdown += `- [${page.title}](${summary.name}-${category}.md#${anchor})\n`;
      }
      
      if (pages.length > 10) {
        markdown += `- ... 还有 ${pages.length - 10} 页\n`;
      }
      
      markdown += `\n`;
    }

    // 统计信息
    markdown += `## 📊 统计信息\n\n`;
    markdown += `| 分类 | 页数 |\n`;
    markdown += `|------|------|\n`;
    for (const [category, pages] of Object.entries(categorized)) {
      const categoryName = this.formatCategoryName(category);
      markdown += `| ${categoryName} | ${pages.length} |\n`;
    }
    markdown += `\n`;

    // 使用说明
    markdown += `## 💡 使用说明\n\n`;
    markdown += `1. 点击上方分类查看具体内容\n`;
    markdown += `2. 每个分类页面包含该类别的所有文档\n`;
    markdown += `3. 文档中包含代码示例和完整说明\n`;
    markdown += `4. 可以使用搜索功能查找特定内容\n\n`;

    return markdown;
  }

  /**
   * 格式化分类名称
   */
  private formatCategoryName(category: string): string {
    const names: Record<string, string> = {
      'getting-started': '入门指南',
      'guide': '使用指南',
      'api': 'API 参考',
      'examples': '示例代码',
      'advanced': '进阶内容',
      'migration': '迁移指南',
      'pdf-document': 'PDF 文档',
      'other': '其他'
    };

    return names[category] || category;
  }

  /**
   * 生成 slug
   */
  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}

