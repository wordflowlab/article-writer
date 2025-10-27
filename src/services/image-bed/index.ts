/**
 * 图床服务统一导出
 */

// 类型定义
export type {
  ImageBedType,
  UploadResult,
  ImageBedConfig,
  Base64Config,
  CloudflareR2Config,
  QiniuConfig,
  AliyunOSSConfig,
  TencentCOSConfig,
  AnyImageBedConfig,
  ImageBedProvider,
  ImageBedFactoryConfig,
} from './types.js';

// 图床提供者
export { Base64Provider } from './providers/base64-provider.js';
export { CloudflareR2Provider } from './providers/cloudflare-r2-provider.js';
export { QiniuProvider } from './providers/qiniu-provider.js';
export { AliyunOSSProvider } from './providers/aliyun-oss-provider.js';
export { TencentCOSProvider } from './providers/tencent-cos-provider.js';

// 工厂类
export {
  ImageBedFactory,
  createDefaultImageBedFactory,
  createImageBedFactoryFromConfig,
} from './image-bed-factory.js';

// 枚举
export { ImageBedType as ImageBedTypeEnum } from './types.js';
