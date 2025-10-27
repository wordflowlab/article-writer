/**
 * 图床服务工厂
 * 负责创建和管理各种图床提供者
 */

import {
  ImageBedType,
  type ImageBedProvider,
  type ImageBedFactoryConfig,
  type AnyImageBedConfig,
  type UploadResult,
} from './types.js';

import { Base64Provider } from './providers/base64-provider.js';
import { CloudflareR2Provider } from './providers/cloudflare-r2-provider.js';
import { QiniuProvider } from './providers/qiniu-provider.js';
import { AliyunOSSProvider } from './providers/aliyun-oss-provider.js';
import { TencentCOSProvider } from './providers/tencent-cos-provider.js';

export class ImageBedFactory {
  private config: ImageBedFactoryConfig;
  private providers: Map<ImageBedType, ImageBedProvider> = new Map();

  constructor(config: ImageBedFactoryConfig) {
    this.config = config;
    this.initializeProviders();
  }

  /**
   * 初始化所有配置的图床提供者
   */
  private initializeProviders(): void {
    for (const [type, providerConfig] of Object.entries(this.config.providers)) {
      if (!providerConfig || providerConfig.enabled === false) {
        continue;
      }

      try {
        const provider = this.createProvider(providerConfig);
        if (provider) {
          this.providers.set(type as ImageBedType, provider);
        }
      } catch (error) {
        console.error(`初始化图床提供者 ${type} 失败:`, error);
      }
    }
  }

  /**
   * 根据配置创建图床提供者实例
   */
  private createProvider(config: AnyImageBedConfig): ImageBedProvider | null {
    switch (config.type) {
      case 'base64':
        return new Base64Provider(config);
      case 'cloudflare-r2':
        return new CloudflareR2Provider(config);
      case 'qiniu':
        return new QiniuProvider(config);
      case 'aliyun-oss':
        return new AliyunOSSProvider(config);
      case 'tencent-cos':
        return new TencentCOSProvider(config);
      default:
        console.warn(`未知的图床类型: ${(config as any).type}`);
        return null;
    }
  }

  /**
   * 获取默认图床提供者
   */
  getDefaultProvider(): ImageBedProvider | null {
    return this.providers.get(this.config.defaultProvider) || null;
  }

  /**
   * 获取指定类型的图床提供者
   */
  getProvider(type: ImageBedType): ImageBedProvider | null {
    return this.providers.get(type) || null;
  }

  /**
   * 获取所有可用的图床提供者
   */
  getAllProviders(): ImageBedProvider[] {
    return Array.from(this.providers.values());
  }

  /**
   * 上传单张图片(使用默认图床)
   */
  async upload(imagePath: string, remotePath?: string): Promise<UploadResult> {
    const provider = this.getDefaultProvider();
    if (!provider) {
      throw new Error('没有可用的图床提供者');
    }

    return provider.upload(imagePath, remotePath);
  }

  /**
   * 上传单张图片(使用指定图床,支持降级)
   */
  async uploadWithFallback(
    imagePath: string,
    remotePath?: string
  ): Promise<UploadResult> {
    // 尝试使用默认图床
    const defaultProvider = this.getDefaultProvider();
    if (defaultProvider) {
      const result = await defaultProvider.upload(imagePath, remotePath);
      if (result.success) {
        return result;
      }
      console.warn(`默认图床 ${this.config.defaultProvider} 上传失败,尝试降级方案`);
    }

    // 尝试降级方案
    if (this.config.fallbackProviders) {
      for (const fallbackType of this.config.fallbackProviders) {
        const fallbackProvider = this.getProvider(fallbackType);
        if (!fallbackProvider) {
          continue;
        }

        try {
          const result = await fallbackProvider.upload(imagePath, remotePath);
          if (result.success) {
            console.log(`使用降级方案 ${fallbackType} 上传成功`);
            return result;
          }
        } catch (error) {
          console.warn(`降级方案 ${fallbackType} 失败:`, error);
        }
      }
    }

    // 所有方案都失败
    return {
      success: false,
      url: '',
      originalPath: imagePath,
      error: '所有图床上传均失败',
      provider: this.config.defaultProvider,
    };
  }

  /**
   * 批量上传图片(使用默认图床)
   */
  async uploadBatch(imagePaths: string[]): Promise<UploadResult[]> {
    const provider = this.getDefaultProvider();
    if (!provider) {
      throw new Error('没有可用的图床提供者');
    }

    return provider.uploadBatch(imagePaths);
  }

  /**
   * 批量上传图片(支持降级,每张图片独立尝试降级)
   */
  async uploadBatchWithFallback(imagePaths: string[]): Promise<UploadResult[]> {
    return Promise.all(
      imagePaths.map(path => this.uploadWithFallback(path))
    );
  }

  /**
   * 验证所有图床配置
   */
  async validateAllConfigs(): Promise<Record<ImageBedType, boolean>> {
    const results: Partial<Record<ImageBedType, boolean>> = {};

    const validations = Array.from(this.providers.entries()).map(
      async ([type, provider]) => {
        const isValid = await provider.validateConfig();
        results[type] = isValid;
        return { type, isValid };
      }
    );

    await Promise.all(validations);

    return results as Record<ImageBedType, boolean>;
  }

  /**
   * 获取配置摘要
   */
  getConfigSummary(): {
    defaultProvider: ImageBedType;
    fallbackProviders: ImageBedType[];
    availableProviders: ImageBedType[];
  } {
    return {
      defaultProvider: this.config.defaultProvider,
      fallbackProviders: this.config.fallbackProviders || [],
      availableProviders: Array.from(this.providers.keys()),
    };
  }
}

/**
 * 创建默认图床工厂(仅使用 Base64)
 */
export function createDefaultImageBedFactory(): ImageBedFactory {
  return new ImageBedFactory({
    defaultProvider: ImageBedType.BASE64,
    providers: {
      [ImageBedType.BASE64]: {},
    },
  });
}

/**
 * 从配置文件加载图床工厂
 */
export function createImageBedFactoryFromConfig(
  config: Partial<ImageBedFactoryConfig>
): ImageBedFactory {
  // 合并默认配置
  const fullConfig: ImageBedFactoryConfig = {
    defaultProvider: config.defaultProvider || ImageBedType.BASE64,
    fallbackProviders: config.fallbackProviders || [ImageBedType.BASE64],
    providers: {
      [ImageBedType.BASE64]: {},
      ...config.providers,
    },
  };

  return new ImageBedFactory(fullConfig);
}
