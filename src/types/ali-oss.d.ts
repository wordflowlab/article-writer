/**
 * 阿里云 OSS SDK 类型声明
 * ali-oss 包没有官方类型定义,这里提供基本的类型支持
 */

declare module 'ali-oss' {
  interface OSSOptions {
    region: string;
    accessKeyId: string;
    accessKeySecret: string;
    bucket: string;
    endpoint?: string;
    cname?: boolean;
    secure?: boolean;
    timeout?: number;
  }

  interface PutObjectOptions {
    headers?: Record<string, string>;
    timeout?: number;
    [key: string]: any;
  }

  interface PutObjectResult {
    name: string;
    url: string;
    res: {
      status: number;
      headers: Record<string, string>;
      [key: string]: any;
    };
  }

  class OSS {
    constructor(options: OSSOptions);

    put(
      name: string,
      file: string | Buffer,
      options?: PutObjectOptions
    ): Promise<PutObjectResult>;

    getBucketInfo(bucket?: string): Promise<any>;

    [key: string]: any;
  }

  export = OSS;
}
