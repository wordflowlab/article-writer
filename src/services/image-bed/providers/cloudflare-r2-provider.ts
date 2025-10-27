/**
 * Cloudflare R2 图床提供者
 * 使用 S3 兼容 API 上传图片到 Cloudflare R2
 *
 * 参考文档: https://developers.cloudflare.com/r2/api/s3/api/
 */

import { S3Client, PutObjectCommand, HeadBucketCommand } from '@aws-sdk/client-s3';
import fs from 'fs-extra';
import path from 'path';
import crypto from 'crypto';
import type {
  ImageBedProvider,
  ImageBedType,
  UploadResult,
  CloudflareR2Config,
} from '../types.js';

export class CloudflareR2Provider implements ImageBedProvider {
  readonly type = 'cloudflare-r2' as ImageBedType;
  private config: CloudflareR2Config;
  private s3Client: S3Client;

  constructor(config: CloudflareR2Config) {
    this.config = config;

    // 初始化 S3 客户端
    // R2 端点格式: https://<accountId>.r2.cloudflarestorage.com
    const endpoint = `https://${config.accountId}.r2.cloudflarestorage.com`;

    this.s3Client = new S3Client({
      region: 'auto', // R2 使用 'auto' 作为 region
      endpoint,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  }

  /**
   * 上传单张图片到 R2
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

      // 读取文件
      const fileBuffer = await fs.readFile(imagePath);
      const fileStat = await fs.stat(imagePath);

      // 生成远程路径
      const key = remotePath || this.generateRemotePath(imagePath);

      // 确定 Content-Type
      const contentType = this.getContentType(imagePath);

      // 上传到 R2
      const command = new PutObjectCommand({
        Bucket: this.config.bucket,
        Key: key,
        Body: fileBuffer,
        ContentType: contentType,
      });

      await this.s3Client.send(command);

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
      // 尝试访问 bucket
      const command = new HeadBucketCommand({
        Bucket: this.config.bucket,
      });
      await this.s3Client.send(command);
      return true;
    } catch (error) {
      console.error('Cloudflare R2 配置验证失败:', error);
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
    if (this.config.publicDomain) {
      // 使用自定义域名
      return `https://${this.config.publicDomain}/${key}`;
    } else {
      // 使用 R2.dev 子域名(需要在 R2 控制台启用)
      // 格式: https://<bucket>.r2.dev/<key>
      return `https://${this.config.bucket}.r2.dev/${key}`;
    }
  }
}
