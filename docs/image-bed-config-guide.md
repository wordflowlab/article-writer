# 图床配置指南

本指南详细说明如何配置和使用 Article Writer 的图床系统。

## 📋 目录

- [快速开始](#快速开始)
- [配置格式](#配置格式)
- [图床提供者配置](#图床提供者配置)
- [环境变量配置](#环境变量配置)
- [最佳实践](#最佳实践)
- [故障排查](#故障排查)

## 🚀 快速开始

### 方案1: Base64(推荐新手)

无需任何配置,适合个人用户和微信公众号一键复制:

```json
{
  "name": "my-article",
  "workspace": "wechat",
  "formatting": {
    "theme": "default",
    "primaryColor": "#3f51b5",
    "imageBed": {
      "enabled": true,
      "defaultProvider": "base64"
    }
  }
}
```

### 方案2: Cloudflare R2(推荐小团队)

10GB 免费额度,国际访问快:

```json
{
  "formatting": {
    "imageBed": {
      "enabled": true,
      "defaultProvider": "cloudflare-r2",
      "fallbackProviders": ["base64"],
      "providers": {
        "cloudflare-r2": {
          "accountId": "${R2_ACCOUNT_ID}",
          "accessKeyId": "${R2_ACCESS_KEY_ID}",
          "secretAccessKey": "${R2_SECRET_ACCESS_KEY}",
          "bucket": "my-images",
          "publicDomain": "cdn.example.com"
        }
      }
    }
  }
}
```

然后设置环境变量:

```bash
export R2_ACCOUNT_ID=your-account-id
export R2_ACCESS_KEY_ID=your-access-key-id
export R2_SECRET_ACCESS_KEY=your-secret-access-key
```

## ⚙️ 配置格式

### 完整配置示例

```json
{
  "name": "my-article",
  "workspace": "wechat",
  "formatting": {
    "theme": "default",
    "primaryColor": "#3f51b5",
    "fontSize": "16px",

    // 图床配置
    "imageBed": {
      // 是否启用图床功能
      "enabled": true,

      // 默认使用的图床
      "defaultProvider": "qiniu",

      // 降级方案(按顺序尝试)
      "fallbackProviders": ["cloudflare-r2", "base64"],

      // 各图床的具体配置
      "providers": {
        "base64": {
          "compressLargeImages": true,
          "compressionQuality": 80
        },
        "cloudflare-r2": {
          "accountId": "${R2_ACCOUNT_ID}",
          "accessKeyId": "${R2_ACCESS_KEY_ID}",
          "secretAccessKey": "${R2_SECRET_ACCESS_KEY}",
          "bucket": "my-bucket",
          "publicDomain": "cdn.example.com"
        },
        "qiniu": {
          "accessKey": "${QINIU_ACCESS_KEY}",
          "secretKey": "${QINIU_SECRET_KEY}",
          "bucket": "my-bucket",
          "domain": "cdn.qiniu.com",
          "zone": "z0"
        },
        "aliyun-oss": {
          "accessKeyId": "${OSS_ACCESS_KEY_ID}",
          "accessKeySecret": "${OSS_ACCESS_KEY_SECRET}",
          "bucket": "my-bucket",
          "region": "oss-cn-hangzhou",
          "customDomain": "cdn.aliyun.com"
        },
        "tencent-cos": {
          "secretId": "${COS_SECRET_ID}",
          "secretKey": "${COS_SECRET_KEY}",
          "bucket": "mybucket-1250000000",
          "region": "ap-guangzhou"
        }
      }
    }
  }
}
```

### 配置项说明

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `enabled` | boolean | 否 | false | 是否启用图床功能 |
| `defaultProvider` | string | 是 | base64 | 默认图床类型 |
| `fallbackProviders` | string[] | 否 | [] | 降级图床列表 |
| `providers` | object | 否 | {} | 各图床的配置 |

## 📦 图床提供者配置

### 1. Base64 (本地内嵌)

**优点**: 零配置,100%成功率,适合微信一键复制
**缺点**: 文件体积增大 33%,不适合大图

```json
{
  "base64": {
    "compressLargeImages": true,  // 是否压缩 >200KB 的图片
    "compressionQuality": 80      // 压缩质量 (0-100)
  }
}
```

### 2. Cloudflare R2

**优点**: 10GB 免费,兼容 S3,全球 CDN
**缺点**: 需要信用卡验证

```json
{
  "cloudflare-r2": {
    "accountId": "your-account-id",           // 账户 ID
    "accessKeyId": "your-access-key-id",     // Access Key ID
    "secretAccessKey": "your-secret-key",    // Secret Access Key
    "bucket": "my-bucket",                   // Bucket 名称
    "publicDomain": "cdn.example.com"        // 自定义域名(可选)
  }
}
```

**获取步骤**:
1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 R2 → 创建 Bucket
3. 生成 API Token (R2 → Overview → API Tokens)
4. 绑定自定义域名(可选)

### 3. 七牛云 Kodo

**优点**: 10GB 免费,国内速度快,简单易用
**缺点**: 需要实名认证

```json
{
  "qiniu": {
    "accessKey": "your-access-key",     // Access Key
    "secretKey": "your-secret-key",     // Secret Key
    "bucket": "my-bucket",              // 空间名称
    "domain": "cdn.example.com",        // 访问域名
    "zone": "z0"                        // 区域代码
  }
}
```

**区域代码**:
- `z0`: 华东-浙江
- `z1`: 华北-河北
- `z2`: 华南-广东
- `na0`: 北美-洛杉矶
- `as0`: 东南亚-新加坡

**获取步骤**:
1. 登录 [七牛云控制台](https://portal.qiniu.com)
2. 密钥管理 → 查看 AK/SK
3. 对象存储 → 新建空间
4. 绑定域名

### 4. 阿里云 OSS

**优点**: 稳定可靠,功能强大,企业首选
**缺点**: 按量付费,配置复杂

```json
{
  "aliyun-oss": {
    "accessKeyId": "your-access-key-id",           // AccessKey ID
    "accessKeySecret": "your-access-key-secret",   // AccessKey Secret
    "bucket": "my-bucket",                         // Bucket 名称
    "region": "oss-cn-hangzhou",                   // 区域
    "customDomain": "cdn.example.com"              // 自定义域名(可选)
  }
}
```

**常用区域**:
- `oss-cn-hangzhou`: 华东1(杭州)
- `oss-cn-shanghai`: 华东2(上海)
- `oss-cn-beijing`: 华北2(北京)
- `oss-cn-shenzhen`: 华南1(深圳)

### 5. 腾讯云 COS

**优点**: 与微信生态集成好,适合公众号
**缺点**: 按量付费

```json
{
  "tencent-cos": {
    "secretId": "your-secret-id",           // SecretId
    "secretKey": "your-secret-key",         // SecretKey
    "bucket": "mybucket-1250000000",        // Bucket(格式: name-appid)
    "region": "ap-guangzhou"                // 区域
  }
}
```

**常用区域**:
- `ap-guangzhou`: 广州
- `ap-shanghai`: 上海
- `ap-beijing`: 北京
- `ap-chengdu`: 成都

## 🔐 环境变量配置

### 方式1: `.env` 文件(推荐)

在项目根目录创建 `.env` 文件:

```bash
# Cloudflare R2
R2_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-access-key-id
R2_SECRET_ACCESS_KEY=your-secret-access-key

# 七牛云
QINIU_ACCESS_KEY=your-access-key
QINIU_SECRET_KEY=your-secret-key

# 阿里云 OSS
OSS_ACCESS_KEY_ID=your-access-key-id
OSS_ACCESS_KEY_SECRET=your-access-key-secret

# 腾讯云 COS
COS_SECRET_ID=your-secret-id
COS_SECRET_KEY=your-secret-key
```

### 方式2: Shell 导出

```bash
export R2_ACCOUNT_ID=your-account-id
export R2_ACCESS_KEY_ID=your-access-key-id
# ...
```

### 方式3: 配置文件引用

```json
{
  "cloudflare-r2": {
    "accountId": "${R2_ACCOUNT_ID}",
    "accessKeyId": "${R2_ACCESS_KEY_ID}",
    "secretAccessKey": "${R2_SECRET_ACCESS_KEY}"
  }
}
```

## 💡 最佳实践

### 1. 个人用户

```json
{
  "imageBed": {
    "enabled": true,
    "defaultProvider": "base64"
  }
}
```

- ✅ 零配置,开箱即用
- ✅ 100% 成功率
- ✅ 完美支持微信公众号一键复制

### 2. 小团队

```json
{
  "imageBed": {
    "enabled": true,
    "defaultProvider": "cloudflare-r2",
    "fallbackProviders": ["base64"],
    "providers": {
      "cloudflare-r2": { /* ... */ }
    }
  }
}
```

- ✅ 10GB 免费额度充足
- ✅ 全球 CDN 加速
- ✅ 失败自动降级到 Base64

### 3. 企业用户

```json
{
  "imageBed": {
    "enabled": true,
    "defaultProvider": "aliyun-oss",
    "fallbackProviders": ["qiniu", "base64"],
    "providers": {
      "aliyun-oss": { /* ... */ },
      "qiniu": { /* ... */ }
    }
  }
}
```

- ✅ 多图床备份
- ✅ 自动降级机制
- ✅ 稳定可靠

## 🔧 故障排查

### 问题1: 图片上传失败

**症状**: 所有图片都上传失败

**解决方案**:
1. 检查配置是否正确(区域、Bucket名称等)
2. 验证密钥是否有效
3. 检查网络连接
4. 查看控制台错误日志

```bash
# 测试配置
npm run test:image-bed
```

### 问题2: Base64 图片过大

**症状**: HTML 文件体积超过 10MB

**解决方案**:
1. 启用图片压缩:
```json
{
  "base64": {
    "compressLargeImages": true,
    "compressionQuality": 70
  }
}
```

2. 或使用云图床

### 问题3: 降级不生效

**症状**: 主图床失败后没有自动降级

**解决方案**:
检查降级图床是否配置正确:

```json
{
  "fallbackProviders": ["base64"],  // 确保包含 base64
  "providers": {
    "base64": {}  // base64 必须在 providers 中
  }
}
```

### 问题4: 环境变量未生效

**症状**: 配置中的 `${VAR}` 没有被替换

**解决方案**:
1. 确保 `.env` 文件在项目根目录
2. 重启应用
3. 或直接在配置中填写明文(不推荐)

## 📚 相关文档

- [图床系统 README](../src/services/image-bed/README.md)
- [微信格式化文档](./wechat-formatting.md)
- [使用示例](../examples/test-image-bed.ts)

## 🆘 获取帮助

遇到问题?

1. 查看 [常见问题](./FAQ.md)
2. 提交 [Issue](https://github.com/wordflowlab/article-writer/issues)
3. 加入讨论群(见 README)
