# 图床服务系统

统一的图床服务管理系统,支持多种图床提供者,适用于微信公众号图片上传等场景。

## 🎯 支持的图床

| 图床类型 | 配置难度 | 费用 | 推荐场景 |
|---------|---------|------|---------|
| **Base64** | ⭐ 无需配置 | 免费 | 个人用户,小文件,微信一键复制 |
| **Cloudflare R2** | ⭐⭐ 简单 | 10GB免费 | 个人/小团队,国际访问 |
| **七牛云 Kodo** | ⭐⭐ 简单 | 10GB免费 | 国内用户,快速访问 |
| **阿里云 OSS** | ⭐⭐⭐ 中等 | 按量付费 | 企业用户,稳定可靠 |
| **腾讯云 COS** | ⭐⭐⭐ 中等 | 按量付费 | 微信生态,企业用户 |

## 📦 快速开始

### 1. 基础用法 - Base64(推荐)

无需任何配置,适合微信公众号一键复制功能:

```typescript
import { createDefaultImageBedFactory } from './services/image-bed';

// 创建默认工厂(使用 Base64)
const factory = createDefaultImageBedFactory();

// 上传图片
const result = await factory.upload('/path/to/image.png');

console.log(result.url); // data:image/png;base64,...
```

### 2. 使用云图床

```typescript
import { createImageBedFactoryFromConfig } from './services/image-bed';

// 创建工厂(使用云图床)
const factory = createImageBedFactoryFromConfig({
  defaultProvider: 'cloudflare-r2',
  fallbackProviders: ['base64'], // 降级方案
  providers: {
    'cloudflare-r2': {
      type: 'cloudflare-r2',
      enabled: true,
      accountId: 'your-account-id',
      accessKeyId: 'your-access-key-id',
      secretAccessKey: 'your-secret-access-key',
      bucket: 'your-bucket',
      publicDomain: 'your-domain.com', // 可选
    },
    'base64': {
      type: 'base64',
      enabled: true,
    },
  },
});

// 上传图片(支持自动降级)
const result = await factory.uploadWithFallback('/path/to/image.png');

console.log(result.url); // https://your-domain.com/images/2025/10/...
```

## ⚙️ 配置说明

### Base64 配置

```typescript
{
  type: 'base64',
  enabled: true,
  compressLargeImages: true,  // 是否压缩大图(>200KB)
  compressionQuality: 80,     // 压缩质量 0-100
}
```

### Cloudflare R2 配置

```typescript
{
  type: 'cloudflare-r2',
  enabled: true,
  accountId: 'your-account-id',        // 账户 ID
  accessKeyId: 'your-access-key-id',   // Access Key ID
  secretAccessKey: 'your-secret-key',  // Secret Access Key
  bucket: 'your-bucket',               // Bucket 名称
  publicDomain: 'cdn.example.com',     // 自定义域名(可选)
}
```

**获取方式**:
1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 R2 页面
3. 创建 Bucket 和 API Token

### 七牛云 Kodo 配置

```typescript
{
  type: 'qiniu',
  enabled: true,
  accessKey: 'your-access-key',      // Access Key
  secretKey: 'your-secret-key',      // Secret Key
  bucket: 'your-bucket',             // 存储空间名称
  domain: 'cdn.example.com',         // 访问域名
  zone: 'z0',                        // 区域(z0=华东,z1=华北,z2=华南)
}
```

**获取方式**:
1. 登录 [七牛云控制台](https://portal.qiniu.com)
2. 进入密钥管理获取 AK/SK
3. 创建存储空间并绑定域名

### 阿里云 OSS 配置

```typescript
{
  type: 'aliyun-oss',
  enabled: true,
  accessKeyId: 'your-access-key-id',       // AccessKey ID
  accessKeySecret: 'your-access-key-secret', // AccessKey Secret
  bucket: 'your-bucket',                   // Bucket 名称
  region: 'oss-cn-hangzhou',               // 区域
  customDomain: 'cdn.example.com',         // 自定义域名(可选)
}
```

### 腾讯云 COS 配置

```typescript
{
  type: 'tencent-cos',
  enabled: true,
  secretId: 'your-secret-id',      // SecretId
  secretKey: 'your-secret-key',    // SecretKey
  bucket: 'bucket-appid',          // Bucket(格式: bucket-appid)
  region: 'ap-guangzhou',          // 区域
}
```

## 🔥 高级用法

### 多图床配置 + 自动降级

```typescript
const factory = createImageBedFactoryFromConfig({
  defaultProvider: 'qiniu',
  fallbackProviders: ['cloudflare-r2', 'base64'], // 依次降级
  providers: {
    'qiniu': { /* 七牛云配置 */ },
    'cloudflare-r2': { /* R2配置 */ },
    'base64': { type: 'base64', enabled: true },
  },
});

// 上传会自动尝试降级
const result = await factory.uploadWithFallback('/path/to/image.png');
```

### 批量上传

```typescript
const imagePaths = [
  '/path/to/image1.png',
  '/path/to/image2.jpg',
  '/path/to/image3.webp',
];

// 批量上传(支持降级)
const results = await factory.uploadBatchWithFallback(imagePaths);

results.forEach(result => {
  if (result.success) {
    console.log(`✅ ${result.originalPath} -> ${result.url}`);
  } else {
    console.error(`❌ ${result.originalPath}: ${result.error}`);
  }
});
```

### 验证配置

```typescript
// 验证所有图床配置是否有效
const validations = await factory.validateAllConfigs();

console.log(validations);
// {
//   'qiniu': true,
//   'cloudflare-r2': false,
//   'base64': true
// }
```

### 获取配置摘要

```typescript
const summary = factory.getConfigSummary();

console.log(summary);
// {
//   defaultProvider: 'qiniu',
//   fallbackProviders: ['cloudflare-r2', 'base64'],
//   availableProviders: ['qiniu', 'base64']
// }
```

## 🎨 与 wechat-formatter 集成

```typescript
import { WechatFormatter } from '../formatters/wechat-formatter';
import { createImageBedFactoryFromConfig } from '../services/image-bed';

// 创建图床工厂
const imageBedFactory = createImageBedFactoryFromConfig({
  defaultProvider: 'base64',
  providers: {
    'base64': { type: 'base64', enabled: true },
  },
});

// 创建格式化器并传入图床工厂
const formatter = new WechatFormatter({
  theme: 'default',
  primaryColor: '#3f51b5',
  imageBedFactory, // 传入图床工厂
});

// 格式化时会自动处理图片上传
const html = await formatter.exportHtml(markdown, title);
```

## 📖 文件结构

```
src/services/image-bed/
├── types.ts                           # 类型定义
├── image-bed-factory.ts               # 工厂类
├── providers/
│   ├── base64-provider.ts             # Base64 提供者
│   ├── cloudflare-r2-provider.ts      # Cloudflare R2
│   ├── qiniu-provider.ts              # 七牛云
│   ├── aliyun-oss-provider.ts         # 阿里云 OSS
│   └── tencent-cos-provider.ts        # 腾讯云 COS
├── index.ts                           # 统一导出
└── README.md                          # 本文档
```

## ⚠️ 注意事项

### Base64 方案

- ✅ **优势**: 零配置,100%成功率,适合微信公众号一键复制
- ⚠️ **限制**: 文件大小会增加约 33%,不适合超大图片
- 💡 **建议**: 图片 < 500KB 时使用

### 云图床方案

- ✅ **优势**: 小文件,永久链接,CDN 加速
- ⚠️ **限制**: 需要配置,可能产生费用
- 💡 **建议**: 企业用户,大量图片,需要永久存储

### 降级策略建议

```typescript
// 推荐配置:个人用户
defaultProvider: 'base64'
fallbackProviders: []  // 无需降级

// 推荐配置:小团队
defaultProvider: 'cloudflare-r2'
fallbackProviders: ['base64']  // R2失败则用Base64

// 推荐配置:企业用户
defaultProvider: 'aliyun-oss'
fallbackProviders: ['qiniu', 'base64']  // OSS -> 七牛 -> Base64
```

## 🔐 安全建议

1. **不要将密钥硬编码在代码中**,使用环境变量:

```typescript
accessKeyId: process.env.R2_ACCESS_KEY_ID,
secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
```

2. **使用最小权限原则**,只授予图床所需的权限(如仅上传权限)

3. **定期轮换密钥**,避免长期使用同一密钥

## 📚 相关文档

- [Cloudflare R2 文档](https://developers.cloudflare.com/r2/)
- [七牛云 Kodo 文档](https://developer.qiniu.com/kodo)
- [阿里云 OSS 文档](https://help.aliyun.com/product/31815.html)
- [腾讯云 COS 文档](https://cloud.tencent.com/document/product/436)
