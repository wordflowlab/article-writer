/**
 * 爬虫预设配置
 */

import type { CrawlerConfig } from './types.js';

/**
 * 预设配置
 */
export const PRESET_CONFIGS: Record<string, Partial<CrawlerConfig>> = {
  // Vue.js 官方文档
  vue: {
    name: 'vue',
    baseUrl: 'https://vuejs.org/guide/',
    maxPages: 200,
    selectors: {
      mainContent: '.vt-doc, article',
      title: 'h1',
      codeBlocks: 'pre code'
    },
    urlPatterns: {
      include: ['/guide/', '/api/', '/examples/'],
      exclude: ['/blog/', '/about/']
    }
  },

  // React 官方文档
  react: {
    name: 'react',
    baseUrl: 'https://react.dev/learn',
    maxPages: 200,
    selectors: {
      mainContent: 'article, .content',
      title: 'h1',
      codeBlocks: 'pre code'
    },
    urlPatterns: {
      include: ['/learn/', '/reference/'],
      exclude: ['/blog/', '/community/']
    }
  },

  // TypeScript 官方文档
  typescript: {
    name: 'typescript',
    baseUrl: 'https://www.typescriptlang.org/docs/',
    maxPages: 150,
    selectors: {
      mainContent: '.markdown, article',
      title: 'h1',
      codeBlocks: 'pre code'
    }
  },

  // Next.js 官方文档
  nextjs: {
    name: 'nextjs',
    baseUrl: 'https://nextjs.org/docs',
    maxPages: 200,
    selectors: {
      mainContent: 'article, .docs-content',
      title: 'h1',
      codeBlocks: 'pre code'
    }
  },

  // Python 官方文档
  python: {
    name: 'python',
    baseUrl: 'https://docs.python.org/3/',
    maxPages: 300,
    selectors: {
      mainContent: '.body, article',
      title: 'h1',
      codeBlocks: 'pre'
    }
  }
};

/**
 * 获取预设配置
 */
export function getPresetConfig(name: string): Partial<CrawlerConfig> | null {
  return PRESET_CONFIGS[name.toLowerCase()] || null;
}

/**
 * 合并配置
 */
export function mergeConfig(
  base: Partial<CrawlerConfig>,
  override: Partial<CrawlerConfig>
): CrawlerConfig {
  return {
    name: override.name || base.name || 'unnamed',
    baseUrl: override.baseUrl || base.baseUrl || '',
    maxPages: override.maxPages || base.maxPages || 100,
    concurrency: override.concurrency || base.concurrency || 5,
    rateLimit: override.rateLimit || base.rateLimit || 500,
    timeout: override.timeout || base.timeout || 10000,
    selectors: {
      ...base.selectors,
      ...override.selectors
    },
    urlPatterns: {
      include: override.urlPatterns?.include || base.urlPatterns?.include,
      exclude: override.urlPatterns?.exclude || base.urlPatterns?.exclude
    }
  };
}

/**
 * 验证配置
 */
export function validateConfig(config: Partial<CrawlerConfig>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!config.name) {
    errors.push('缺少 name 字段');
  }

  if (!config.baseUrl) {
    errors.push('缺少 baseUrl 字段');
  } else {
    try {
      new URL(config.baseUrl);
    } catch {
      errors.push('baseUrl 不是有效的 URL');
    }
  }

  if (config.maxPages && config.maxPages < 1) {
    errors.push('maxPages 必须大于 0');
  }

  if (config.concurrency && config.concurrency < 1) {
    errors.push('concurrency 必须大于 0');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

