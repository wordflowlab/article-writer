/**
 * 阿里云 OSS 图床提供者
 *
 * 参考文档: https://help.aliyun.com/document_detail/111265.html
 */

import OSS from 'ali-oss';
import fs from 'fs-extra';
import path from 'path';
import crypto from 'crypto';
import type {
  ImageBedProvider,
  ImageBedType,
  UploadResult,
  AliyunOSSConfig,
} from '../types.js';

export class AliyunOSSProvider implements ImageBedProvider {
  readonly type = 'aliyun-oss' as ImageBedType;
  private config: AliyunOSSConfig;
  private client: OSS;

  constructor(config: AliyunOSSConfig) {
    this.config = config;

    // 初始化 OSS 客户端
    this.client = new OSS({
      region: config.region,
      accessKeyId: config.accessKeyId,
      accessKeySecret: config.accessKeySecret,
      bucket: config.bucket,
    });
  }

  /**
   * 上传单张图片到阿里云 OSS
   */
  async upload(imagePath: string, remotePath?: string): Promise<UploadResult> {
    try {
      // 检查文件是否存在
      if (!await fs.pathExists(imagePath)) {
        return {
          success: false,
          url: '',
          originalPath: imagePath,
          error: '文件不存在',
          provider: this.type,
        };
      }

      // 获取文件大小
      const fileStat = await fs.stat(imagePath);

      // 生成远程路径
      const key = remotePath || this.generateRemotePath(imagePath);

      // 上传文件
      const result = await this.client.put(key, imagePath, {
        headers: {
          'Content-Type': this.getContentType(imagePath),
        },
      });

      // 生成访问 URL
      const url = this.buildPublicUrl(key);

      return {
        success: true,
        url,
        originalPath: imagePath,
        size: fileStat.size,
        provider: this.type,
      };
    } catch (error) {
      return {
        success: false,
        url: '',
        originalPath: imagePath,
        error: error instanceof Error ? error.message : '上传失败',
        provider: this.type,
      };
    }
  }

  /**
   * 批量上传图片
   */
  async uploadBatch(imagePaths: string[]): Promise<UploadResult[]> {
    return Promise.all(imagePaths.map(path => this.upload(path)));
  }

  /**
   * 验证配置是否有效
   */
  async validateConfig(): Promise<boolean> {
    try {
      // 尝试列出 bucket 内容(只列出1个对象即可)
      await this.client.list({
        'max-keys': 1,
      });
      return true;
    } catch (error) {
      console.error('阿里云 OSS 配置验证失败:', error);
      return false;
    }
  }

  /**
   * 生成远程文件路径
   * 格式: images/{year}/{month}/{hash}-{filename}
   */
  private generateRemotePath(localPath: string): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const fileName = path.basename(localPath);
    const ext = path.extname(fileName);
    const nameWithoutExt = path.basename(fileName, ext);

    // 生成 8 位哈希
    const hash = crypto
      .createHash('md5')
      .update(localPath + Date.now())
      .digest('hex')
      .slice(0, 8);

    return `images/${year}/${month}/${nameWithoutExt}-${hash}${ext}`;
  }

  /**
   * 根据文件扩展名确定 Content-Type
   */
  private getContentType(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    const contentTypes: Record<string, string> = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
    };
    return contentTypes[ext] || 'application/octet-stream';
  }

  /**
   * 构建公开访问 URL
   */
  private buildPublicUrl(key: string): string {
    if (this.config.customDomain) {
      // 使用自定义域名
      let domain = this.config.customDomain;
      if (!domain.startsWith('http://') && !domain.startsWith('https://')) {
        domain = `https://${domain}`;
      }
      domain = domain.replace(/\/$/, '');
      return `${domain}/${key}`;
    } else {
      // 使用默认域名
      // 格式: https://{bucket}.{region}.aliyuncs.com/{key}
      return `https://${this.config.bucket}.${this.config.region}.aliyuncs.com/${key}`;
    }
  }
}
