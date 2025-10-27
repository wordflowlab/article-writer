/**
 * 七牛云 Kodo 图床提供者
 *
 * 参考文档: https://developer.qiniu.com/kodo/1289/nodejs
 */

import qiniu from 'qiniu';
import fs from 'fs-extra';
import path from 'path';
import crypto from 'crypto';
import type {
  ImageBedProvider,
  ImageBedType,
  UploadResult,
  QiniuConfig,
} from '../types.js';

export class QiniuProvider implements ImageBedProvider {
  readonly type = 'qiniu' as ImageBedType;
  private config: QiniuConfig;
  private mac: qiniu.auth.digest.Mac;
  private bucketManager: qiniu.rs.BucketManager;

  constructor(config: QiniuConfig) {
    this.config = {
      zone: 'z0', // 默认华东
      ...config,
    };

    // 初始化 MAC 认证
    this.mac = new qiniu.auth.digest.Mac(
      this.config.accessKey,
      this.config.secretKey
    );

    // 初始化配置
    const qiniuConfig = new qiniu.conf.Config({
      zone: this.getZone(this.config.zone),
    });

    // 初始化 BucketManager
    this.bucketManager = new qiniu.rs.BucketManager(this.mac, qiniuConfig);
  }

  /**
   * 上传单张图片到七牛云
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

      // 生成上传凭证
      const uploadToken = this.generateUploadToken(key);

      // 配置上传选项
      const qiniuConfig = new qiniu.conf.Config({
        zone: this.getZone(this.config.zone),
      });
      const formUploader = new qiniu.form_up.FormUploader(qiniuConfig);
      const putExtra = new qiniu.form_up.PutExtra();

      // 执行上传
      const result = await new Promise<any>((resolve, reject) => {
        formUploader.putFile(
          uploadToken,
          key,
          imagePath,
          putExtra,
          (err: Error | null, respBody: any, respInfo: any) => {
            if (err) {
              reject(err);
            } else if (respInfo.statusCode === 200) {
              resolve(respBody);
            } else {
              reject(new Error(`上传失败: ${respInfo.statusCode}`));
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
      // 尝试获取空间信息
      return new Promise((resolve) => {
        this.bucketManager.stat(
          this.config.bucket,
          'test-validation-file',
          (err: Error | null, respBody: any, respInfo: any) => {
            // 只要能连接到 API 就认为配置有效
            // 404 也是正常的(文件不存在)
            resolve(respInfo.statusCode === 404 || respInfo.statusCode === 200);
          }
        );
      });
    } catch (error) {
      console.error('七牛云配置验证失败:', error);
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
   * 生成上传凭证
   */
  private generateUploadToken(key: string): string {
    const options = {
      scope: `${this.config.bucket}:${key}`,
      expires: 3600, // 1小时
    };
    const putPolicy = new qiniu.rs.PutPolicy(options);
    return putPolicy.uploadToken(this.mac);
  }

  /**
   * 获取七牛云 Zone 配置
   */
  private getZone(zoneStr?: string): any {
    const zones: Record<string, any> = {
      'z0': qiniu.zone.Zone_z0, // 华东-浙江
      'z1': qiniu.zone.Zone_z1, // 华北-河北
      'z2': qiniu.zone.Zone_z2, // 华南-广东
      'na0': qiniu.zone.Zone_na0, // 北美-洛杉矶
      'as0': qiniu.zone.Zone_as0, // 东南亚-新加坡
    };
    return zones[zoneStr || 'z0'] || qiniu.zone.Zone_z0;
  }

  /**
   * 构建公开访问 URL
   */
  private buildPublicUrl(key: string): string {
    // 确保 domain 以 http:// 或 https:// 开头
    let domain = this.config.domain;
    if (!domain.startsWith('http://') && !domain.startsWith('https://')) {
      domain = `https://${domain}`;
    }

    // 移除末尾的斜杠
    domain = domain.replace(/\/$/, '');

    return `${domain}/${key}`;
  }
}
