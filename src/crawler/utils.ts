/**
 * 爬虫工具函数
 */

/**
 * 检测是否为文档网站
 */
export function isDocumentationSite(url: string): boolean {
  const patterns = [
    'docs.',
    '/docs/',
    '/guide/',
    '/api/',
    '/documentation/',
    '/reference/',
    'readthedocs.io',
    'gitbook.io',
    '/manual/',
    '/tutorial/'
  ];

  const lowerUrl = url.toLowerCase();
  return patterns.some(pattern => lowerUrl.includes(pattern));
}

/**
 * 清理文件名
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[<>:"/\\|?*]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 200);
}

/**
 * 预估爬取时间
 */
export function estimateDuration(
  pageCount: number,
  rateLimit: number = 500,
  concurrency: number = 5
): number {
  // 单页平均时间 = 请求时间 + 速率限制
  const avgTimePerPage = 1000 + rateLimit; // 毫秒
  
  // 总时间 = (总页数 / 并发数) * 单页时间
  const totalTime = (pageCount / concurrency) * avgTimePerPage;
  
  return totalTime;
}

/**
 * 格式化字节大小
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

/**
 * 延迟函数
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 重试函数
 */
export async function retry<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    
    console.log(`⚠️  失败，${delay}ms 后重试... (剩余 ${retries} 次)`);
    await sleep(delay);
    return retry(fn, retries - 1, delay * 2);
  }
}

/**
 * 检查 URL 是否有效
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * 获取域名
 */
export function getDomain(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname;
  } catch {
    return '';
  }
}

/**
 * 规范化 URL（移除 hash 和某些 query 参数）
 */
export function normalizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    parsed.hash = '';
    
    // 移除常见的追踪参数
    const trackingParams = ['utm_source', 'utm_medium', 'utm_campaign', 'ref', 'source'];
    trackingParams.forEach(param => {
      parsed.searchParams.delete(param);
    });
    
    return parsed.href;
  } catch {
    return url;
  }
}

/**
 * 检测文本语言
 */
export function detectLanguage(text: string): 'zh' | 'en' | 'unknown' {
  const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  const englishChars = (text.match(/[a-zA-Z]/g) || []).length;
  
  if (chineseChars > englishChars) return 'zh';
  if (englishChars > chineseChars) return 'en';
  return 'unknown';
}

