/**
 * 图片下载工具模块
 *
 * 功能:
 * - 下载单个/批量图片
 * - 图片格式验证
 * - 并发控制和进度显示
 * - 错误重试机制
 */

import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';
import ora from 'ora';
import pLimit from 'p-limit';

/**
 * 下载选项
 */
export interface DownloadOptions {
  /** 图片URL */
  url: string;
  /** 保存路径(绝对路径) */
  savePath: string;
  /** 最大重试次数 */
  maxRetries?: number;
  /** 超时时间(毫秒) */
  timeout?: number;
  /** 用户代理 */
  userAgent?: string;
}

/**
 * 下载结果
 */
export interface DownloadResult {
  /** 图片URL */
  url: string;
  /** 保存路径 */
  savePath: string;
  /** 是否成功 */
  success: boolean;
  /** 文件大小(字节) */
  size?: number;
  /** 图片格式 */
  format?: string;
  /** 错误信息 */
  error?: string;
}

/**
 * 图片元数据
 */
export interface ImageInfo {
  /** 图片格式(png/jpg/webp/svg等) */
  format: string;
  /** 文件大小(字节) */
  size: number;
  /** Content-Type */
  contentType?: string;
}

/**
 * 验证文件是否为有效图片
 * 通过检查文件签名(Magic Bytes)
 */
export function validateImage(buffer: Buffer): { valid: boolean; format?: string } {
  if (buffer.length < 8) {
    return { valid: false };
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4E &&
    buffer[3] === 0x47
  ) {
    return { valid: true, format: 'png' };
  }

  // JPG/JPEG: FF D8 FF
  if (
    buffer[0] === 0xFF &&
    buffer[1] === 0xD8 &&
    buffer[2] === 0xFF
  ) {
    return { valid: true, format: 'jpg' };
  }

  // WebP: 52 49 46 46 (RIFF) ... 57 45 42 50 (WEBP)
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return { valid: true, format: 'webp' };
  }

  // GIF: 47 49 46 38 (GIF8)
  if (
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x38
  ) {
    return { valid: true, format: 'gif' };
  }

  // SVG: 通常以 < 开头 (3C), 检查是否包含 svg 关键字
  const text = buffer.toString('utf8', 0, Math.min(buffer.length, 1000));
  if (text.includes('<svg') || text.includes('<?xml')) {
    return { valid: true, format: 'svg' };
  }

  return { valid: false };
}

/**
 * 获取图片信息(不下载完整文件)
 */
export async function getImageInfo(url: string): Promise<ImageInfo | null> {
  try {
    const response = await axios.head(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ArticleWriter/1.0)'
      }
    });

    const contentType = response.headers['content-type'] || '';
    const contentLength = parseInt(response.headers['content-length'] || '0', 10);

    // 检查是否为图片类型
    if (!contentType.startsWith('image/')) {
      return null;
    }

    // 从 Content-Type 推断格式
    let format = 'unknown';
    if (contentType.includes('png')) format = 'png';
    else if (contentType.includes('jpeg') || contentType.includes('jpg')) format = 'jpg';
    else if (contentType.includes('webp')) format = 'webp';
    else if (contentType.includes('gif')) format = 'gif';
    else if (contentType.includes('svg')) format = 'svg';

    return {
      format,
      size: contentLength,
      contentType
    };
  } catch (error) {
    return null;
  }
}

/**
 * 下载单个图片
 *
 * 下载策略:
 * 1. 首先尝试 axios 直接下载 (快速)
 * 2. 如果失败且检测到 Playwright MCP, 使用浏览器下载 (处理反爬虫)
 * 3. 都失败则返回错误
 */
export async function downloadImage(
  options: DownloadOptions,
  usePlaywright: boolean = false
): Promise<DownloadResult> {
  const {
    url,
    savePath,
    maxRetries = 3,
    timeout = 30000,
    userAgent = 'Mozilla/5.0 (compatible; ArticleWriter/1.0)'
  } = options;

  let lastError: any;

  // 策略1: axios 直接下载 (优先)
  if (!usePlaywright) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // 下载图片
        const response = await axios.get(url, {
          responseType: 'arraybuffer',
          timeout,
          headers: {
            'User-Agent': userAgent
          },
          maxRedirects: 5
        });

        const buffer = Buffer.from(response.data);

        // 验证图片
        const validation = validateImage(buffer);
        if (!validation.valid) {
          return {
            url,
            savePath,
            success: false,
            error: 'Downloaded file is not a valid image'
          };
        }

        // 确保目标目录存在
        await fs.ensureDir(path.dirname(savePath));

        // 保存图片
        await fs.writeFile(savePath, buffer);

        return {
          url,
          savePath,
          success: true,
          size: buffer.length,
          format: validation.format
        };
      } catch (error: any) {
        lastError = error;

        // 如果是权限错误(403/401), 不再重试,尝试 Playwright
        if (error.response?.status === 403 || error.response?.status === 401) {
          break;
        }

        // 如果是最后一次尝试,跳出
        if (attempt === maxRetries) {
          break;
        }

        // 等待后重试(指数退避)
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }

  // 策略2: 如果 axios 失败,且启用 Playwright, 返回特殊标记
  // (实际的 Playwright 下载由调用方处理,因为需要 MCP 工具)
  if (lastError?.response?.status === 403 || lastError?.response?.status === 401 || usePlaywright) {
    return {
      url,
      savePath,
      success: false,
      error: lastError?.message || 'Download failed after retries',
      // @ts-ignore - 添加特殊标记
      needsPlaywright: true
    };
  }

  // 所有重试都失败
  return {
    url,
    savePath,
    success: false,
    error: lastError?.message || 'Download failed after retries'
  };
}

/**
 * 批量下载图片
 */
export async function downloadImages(
  tasks: DownloadOptions[],
  concurrency: number = 5,
  showProgress: boolean = true
): Promise<DownloadResult[]> {
  const limit = pLimit(concurrency);
  const results: DownloadResult[] = [];

  let spinner: any;
  if (showProgress) {
    spinner = ora('准备下载图片...').start();
  }

  const promises = tasks.map((task, index) =>
    limit(async () => {
      if (spinner) {
        spinner.text = `下载图片 ${index + 1}/${tasks.length}: ${path.basename(task.savePath)}`;
      }

      const result = await downloadImage(task);
      results.push(result);

      if (spinner) {
        const status = result.success ? '✓' : '✗';
        const size = result.size ? `(${(result.size / 1024).toFixed(1)}KB)` : '';
        spinner.text = `[${status}] ${path.basename(task.savePath)} ${size}`;
      }

      return result;
    })
  );

  await Promise.all(promises);

  if (spinner) {
    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;

    if (successCount === totalCount) {
      spinner.succeed(`图片下载完成: ${successCount}/${totalCount} 成功`);
    } else {
      spinner.warn(`图片下载完成: ${successCount}/${totalCount} 成功, ${totalCount - successCount} 失败`);
    }
  }

  return results;
}

/**
 * 从URL推断文件扩展名
 */
export function inferFileExtension(url: string, contentType?: string): string {
  // 优先从 URL 推断
  const urlExt = path.extname(new URL(url).pathname).toLowerCase();
  if (urlExt && ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'].includes(urlExt)) {
    return urlExt;
  }

  // 从 Content-Type 推断
  if (contentType) {
    if (contentType.includes('png')) return '.png';
    if (contentType.includes('jpeg') || contentType.includes('jpg')) return '.jpg';
    if (contentType.includes('webp')) return '.webp';
    if (contentType.includes('gif')) return '.gif';
    if (contentType.includes('svg')) return '.svg';
  }

  // 默认 .png
  return '.png';
}

/**
 * 生成下载日志
 */
export async function saveDownloadLog(
  results: DownloadResult[],
  logPath: string
): Promise<void> {
  const log = {
    timestamp: new Date().toISOString(),
    total: results.length,
    success: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    results: results.map(r => ({
      url: r.url,
      fileName: path.basename(r.savePath),
      success: r.success,
      size: r.size,
      format: r.format,
      error: r.error
    }))
  };

  await fs.writeJson(logPath, log, { spaces: 2 });
}
