/**
 * 图床服务类型定义
 *
 * 支持多种图床服务的统一接口抽象
 */

/**
 * 图床服务类型枚举
 */
export enum ImageBedType {
  /** Base64 内嵌(无需配置) */
  BASE64 = 'base64',
  /** Cloudflare R2 (兼容 S3 API) */
  CLOUDFLARE_R2 = 'cloudflare-r2',
  /** 七牛云 Kodo */
  QINIU = 'qiniu',
  /** 阿里云 OSS */
  ALIYUN_OSS = 'aliyun-oss',
  /** 腾讯云 COS */
  TENCENT_COS = 'tencent-cos',
}

/**
 * 图片上传结果
 */
export interface UploadResult {
  /** 是否成功 */
  success: boolean;
  /** 图片 URL (可能是 http URL 或 data URI) */
  url: string;
  /** 原始文件路径 */
  originalPath: string;
  /** 文件大小(字节) */
  size?: number;
  /** 错误信息 */
  error?: string;
  /** 图床类型 */
  provider: ImageBedType;
}

/**
 * 图床配置基础接口
 */
export interface ImageBedConfig {
  /** 图床类型 */
  type: ImageBedType;
  /** 是否启用 */
  enabled?: boolean;
}

/**
 * Base64 配置(无需额外配置)
 */
export interface Base64Config extends ImageBedConfig {
  type: ImageBedType.BASE64;
  /** 是否压缩大图(> 200KB) */
  compressLargeImages?: boolean;
  /** 压缩质量 0-100 */
  compressionQuality?: number;
}

/**
 * Cloudflare R2 配置
 */
export interface CloudflareR2Config extends ImageBedConfig {
  type: ImageBedType.CLOUDFLARE_R2;
  /** 账户 ID */
  accountId: string;
  /** Access Key ID */
  accessKeyId: string;
  /** Secret Access Key */
  secretAccessKey: string;
  /** Bucket 名称 */
  bucket: string;
  /** 自定义域名(可选,用于返回公开URL) */
  publicDomain?: string;
}

/**
 * 七牛云配置
 */
export interface QiniuConfig extends ImageBedConfig {
  type: ImageBedType.QINIU;
  /** Access Key */
  accessKey: string;
  /** Secret Key */
  secretKey: string;
  /** 存储空间名称 */
  bucket: string;
  /** 访问域名 */
  domain: string;
  /** 区域(z0=华东, z1=华北, z2=华南, na0=北美, as0=东南亚) */
  zone?: string;
}

/**
 * 阿里云 OSS 配置
 */
export interface AliyunOSSConfig extends ImageBedConfig {
  type: ImageBedType.ALIYUN_OSS;
  /** AccessKey ID */
  accessKeyId: string;
  /** AccessKey Secret */
  accessKeySecret: string;
  /** Bucket 名称 */
  bucket: string;
  /** 区域(如: oss-cn-hangzhou) */
  region: string;
  /** 自定义域名(可选) */
  customDomain?: string;
}

/**
 * 腾讯云 COS 配置
 */
export interface TencentCOSConfig extends ImageBedConfig {
  type: ImageBedType.TENCENT_COS;
  /** SecretId */
  secretId: string;
  /** SecretKey */
  secretKey: string;
  /** Bucket 名称(格式: bucket-appid) */
  bucket: string;
  /** 区域(如: ap-guangzhou) */
  region: string;
}

/**
 * 统一图床配置类型
 */
export type AnyImageBedConfig =
  | Base64Config
  | CloudflareR2Config
  | QiniuConfig
  | AliyunOSSConfig
  | TencentCOSConfig;

/**
 * 图床提供者接口
 * 所有图床服务必须实现此接口
 */
export interface ImageBedProvider {
  /** 图床类型 */
  readonly type: ImageBedType;

  /**
   * 上传单张图片
   * @param imagePath - 本地图片路径
   * @param remotePath - 远程保存路径(可选)
   */
  upload(imagePath: string, remotePath?: string): Promise<UploadResult>;

  /**
   * 批量上传图片
   * @param imagePaths - 本地图片路径数组
   */
  uploadBatch(imagePaths: string[]): Promise<UploadResult[]>;

  /**
   * 验证配置是否有效
   */
  validateConfig(): Promise<boolean>;
}

/**
 * 图床服务工厂配置
 */
export interface ImageBedFactoryConfig {
  /** 默认使用的图床类型 */
  defaultProvider: ImageBedType;
  /** 降级方案(按优先级排序) */
  fallbackProviders?: ImageBedType[];
  /** 各图床服务的配置 */
  providers: {
    [ImageBedType.BASE64]?: Base64Config;
    [ImageBedType.CLOUDFLARE_R2]?: CloudflareR2Config;
    [ImageBedType.QINIU]?: QiniuConfig;
    [ImageBedType.ALIYUN_OSS]?: AliyunOSSConfig;
    [ImageBedType.TENCENT_COS]?: TencentCOSConfig;
  };
}
