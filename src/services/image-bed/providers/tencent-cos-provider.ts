/**
 * 腾讯云 COS 图床提供者
 *
 * 参考文档: https://cloud.tencent.com/document/product/436/8629
 */

import COS from 'cos-nodejs-sdk-v5';
import fs from 'fs-extra';
import path from 'path';
import crypto from 'crypto';
import type {
  ImageBedProvider,
  ImageBedType,
  UploadResult,
  TencentCOSConfig,
} from '../types.js';

export class TencentCOSProvider implements ImageBedProvider {
  readonly type = 'tencent-cos' as ImageBedType;
  private config: TencentCOSConfig;
  private cosClient: COS;

  constructor(config: TencentCOSConfig) {
    this.config = config;

    // 初始化 COS 客户端
    this.cosClient = new COS({
      SecretId: config.secretId,
      SecretKey: config.secretKey,
    });
  }

  /**
   * 上传单张图片到腾讯云 COS
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

      // 生成远程路径(Key)
      const key = remotePath || this.generateRemotePath(imagePath);

      // 使用高级上传接口(支持自动分片上传)
      const result = await new Promise<any>((resolve, reject) => {
        this.cosClient.uploadFile(
          {
            Bucket: this.config.bucket,
            Region: this.config.region,
            Key: key,
            FilePath: imagePath,
            SliceSize: 1024 * 1024 * 5, // 超过 5MB 使用分片上传
          },
          (err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          }
        );
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
      // 尝试获取 bucket 信息
      return new Promise((resolve) => {
        this.cosClient.headBucket(
          {
            Bucket: this.config.bucket,
            Region: this.config.region,
          },
          (err, data) => {
            resolve(!err && data.statusCode === 200);
          }
        );
      });
    } catch (error) {
      console.error('腾讯云 COS 配置验证失败:', error);
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
   * 构建公开访问 URL
   */
  private buildPublicUrl(key: string): string {
    // 腾讯云 COS 默认域名格式:
    // https://{bucket}.cos.{region}.myqcloud.com/{key}
    return `https://${this.config.bucket}.cos.${this.config.region}.myqcloud.com/${key}`;
  }
}
