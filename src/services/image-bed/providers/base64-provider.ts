/**
 * Base64 图床提供者
 * 将本地图片转换为 Base64 Data URI,无需上传到云端
 * 适用于微信公众号一键复制功能
 */

import { imageToBase64, getImageInfo } from '../../../utils/image-downloader.js';
import type {
  ImageBedProvider,
  ImageBedType,
  UploadResult,
  Base64Config,
} from '../types.js';

export class Base64Provider implements ImageBedProvider {
  readonly type = 'base64' as ImageBedType;
  private config: Base64Config;

  constructor(config: Base64Config) {
    this.config = {
      compressLargeImages: false,
      compressionQuality: 80,
      ...config,
    };
  }

  /**
   * 上传单张图片(转换为 Base64)
   */
  async upload(imagePath: string, _remotePath?: string): Promise<UploadResult> {
    try {
      // 获取图片信息
      const imageInfo = await getImageInfo(imagePath);
      if (!imageInfo) {
        return {
          success: false,
          url: '',
          originalPath: imagePath,
          error: '无法读取图片文件',
          provider: this.type,
        };
      }

      // 检查是否需要压缩大图
      const shouldCompress =
        this.config.compressLargeImages &&
        imageInfo.size > 200 * 1024; // 200KB

      if (shouldCompress) {
        // TODO: 实现图片压缩功能(使用 sharp 库)
        // 目前先直接转换,后续版本添加压缩
        console.warn(`图片 ${imagePath} 大小为 ${Math.round(imageInfo.size / 1024)}KB,建议压缩`);
      }

      // 转换为 Base64
      const dataUri = await imageToBase64(imagePath);

      return {
        success: true,
        url: dataUri,
        originalPath: imagePath,
        size: imageInfo.size,
        provider: this.type,
      };
    } catch (error) {
      return {
        success: false,
        url: '',
        originalPath: imagePath,
        error: error instanceof Error ? error.message : '未知错误',
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
   * 验证配置(Base64 无需配置,始终有效)
   */
  async validateConfig(): Promise<boolean> {
    return true;
  }
}
