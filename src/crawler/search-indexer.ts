/**
 * 搜索索引器 - 使用 SQLite FTS5 全文搜索
 */

import Database from 'better-sqlite3';
import fs from 'fs-extra';
import path from 'path';
import type { CrawledPage } from './types.js';

export interface SearchResult {
  url: string;
  title: string;
  snippet: string;
  category: string;
  relevance: number;
}

export class SearchIndexer {
  private db: Database.Database;

  constructor(dbPath: string) {
    // 确保目录存在
    fs.ensureDirSync(path.dirname(dbPath));
    
    this.db = new Database(dbPath);
    this.createIndex();
  }

  /**
   * 创建 FTS5 索引
   */
  private createIndex(): void {
    // 创建 FTS5 虚拟表
    this.db.exec(`
      CREATE VIRTUAL TABLE IF NOT EXISTS pages_fts USING fts5(
        url,
        title,
        content,
        category,
        tags,
        tokenize = 'porter unicode61'
      );
    `);

    // 创建元数据表
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS pages_meta (
        url TEXT PRIMARY KEY,
        scraped_at TEXT,
        code_examples INTEGER
      );
    `);
  }

  /**
   * 索引页面
   */
  async indexPages(pages: CrawledPage[]): Promise<void> {
    console.log(`📇 开始建立搜索索引... (${pages.length} 页)`);

    const insertFts = this.db.prepare(`
      INSERT OR REPLACE INTO pages_fts (url, title, content, category, tags)
      VALUES (?, ?, ?, ?, ?)
    `);

    const insertMeta = this.db.prepare(`
      INSERT OR REPLACE INTO pages_meta (url, scraped_at, code_examples)
      VALUES (?, ?, ?)
    `);

    const transaction = this.db.transaction((pages: CrawledPage[]) => {
      for (const page of pages) {
        // 生成标签
        const tags = this.generateTags(page);

        // 插入 FTS 索引
        insertFts.run(
          page.url,
          page.title,
          page.content,
          page.category,
          tags
        );

        // 插入元数据
        insertMeta.run(
          page.url,
          page.scrapedAt,
          page.codeExamples.length
        );
      }
    });

    transaction(pages);

    console.log(`✅ 搜索索引建立完成`);
  }

  /**
   * 生成标签
   */
  private generateTags(page: CrawledPage): string {
    const tags = new Set<string>();

    // 从标题提取关键词
    const titleWords = page.title.toLowerCase().split(/\s+/);
    titleWords.forEach(word => {
      if (word.length > 3) tags.add(word);
    });

    // 添加分类
    tags.add(page.category);

    // 从代码示例提取语言
    page.codeExamples.forEach(ex => {
      if (ex.language) tags.add(ex.language);
    });

    return Array.from(tags).join(' ');
  }

  /**
   * 搜索
   */
  search(query: string, limit = 20): SearchResult[] {
    const stmt = this.db.prepare(`
      SELECT 
        url,
        title,
        snippet(pages_fts, 2, '<mark>', '</mark>', '...', 30) as snippet,
        category,
        rank as relevance
      FROM pages_fts
      WHERE pages_fts MATCH ?
      ORDER BY rank
      LIMIT ?
    `);

    const results = stmt.all(query, limit) as SearchResult[];
    return results;
  }

  /**
   * 按分类搜索
   */
  searchByCategory(category: string, limit = 20): SearchResult[] {
    const stmt = this.db.prepare(`
      SELECT 
        url,
        title,
        substr(content, 1, 200) as snippet,
        category,
        1.0 as relevance
      FROM pages_fts
      WHERE category = ?
      LIMIT ?
    `);

    const results = stmt.all(category, limit) as SearchResult[];
    return results;
  }

  /**
   * 获取统计信息
   */
  getStats(): {
    totalPages: number;
    categories: Record<string, number>;
  } {
    // 总页数
    const totalStmt = this.db.prepare('SELECT COUNT(*) as count FROM pages_fts');
    const { count: totalPages } = totalStmt.get() as { count: number };

    // 分类统计
    const categoryStmt = this.db.prepare(`
      SELECT category, COUNT(*) as count
      FROM pages_fts
      GROUP BY category
    `);
    const categoryRows = categoryStmt.all() as Array<{ category: string; count: number }>;
    
    const categories: Record<string, number> = {};
    for (const row of categoryRows) {
      categories[row.category] = row.count;
    }

    return { totalPages, categories };
  }

  /**
   * 清空索引
   */
  clear(): void {
    this.db.exec('DELETE FROM pages_fts');
    this.db.exec('DELETE FROM pages_meta');
  }

  /**
   * 关闭数据库
   */
  close(): void {
    this.db.close();
  }
}

