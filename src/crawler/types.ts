/**
 * 文档爬虫相关类型定义
 */

export interface CrawlerConfig {
  name: string;
  baseUrl: string;
  maxPages?: number;
  concurrency?: number;
  selectors?: {
    mainContent?: string;
    title?: string;
    codeBlocks?: string;
  };
  urlPatterns?: {
    include?: string[];
    exclude?: string[];
  };
  rateLimit?: number; // 请求间隔（毫秒）
  timeout?: number; // 请求超时（毫秒）
}

export interface CodeExample {
  language: string;
  content: string;
  lineCount: number;
}

export interface CrawledPage {
  url: string;
  title: string;
  content: string;
  htmlContent: string;
  codeExamples: CodeExample[];
  category: string;
  scrapedAt: string;
  links: string[];
}

export interface CrawlProgress {
  current: number;
  total: number;
  queue: number;
  elapsed: number;
  speed?: number; // 页/秒
}

export interface CrawlResult {
  pages: CrawledPage[];
  totalPages: number;
  duration: number;
  categories: Record<string, CrawledPage[]>;
}

export interface CrawlSummary {
  name: string;
  baseUrl: string;
  totalPages: number;
  categories: Record<string, number>;
  crawledAt: string;
}

export interface PDFExtractionOptions {
  withOCR?: boolean;
  extractTables?: boolean;
  extractImages?: boolean;
}

export interface PDFExtractionResult {
  text: string;
  pages: number;
  metadata?: Record<string, any>;
  tables?: any[];
  images?: any[];
}

