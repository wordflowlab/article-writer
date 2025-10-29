/**
 * 微信公众号 Markdown 格式化器
 * 基于 doocs/md 的核心渲染引擎
 * 将 Markdown 转换为微信公众号可用的富文本 HTML
 */

import { marked, Renderer } from 'marked';
import type { Tokens } from 'marked';
import hljs from 'highlight.js/lib/core';
import juice from 'juice';

// 注册常用编程语言
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';
import java from 'highlight.js/lib/languages/java';
import go from 'highlight.js/lib/languages/go';
import rust from 'highlight.js/lib/languages/rust';
import cpp from 'highlight.js/lib/languages/cpp';
import bash from 'highlight.js/lib/languages/bash';
import json from 'highlight.js/lib/languages/json';
import yaml from 'highlight.js/lib/languages/yaml';
import markdown from 'highlight.js/lib/languages/markdown';
import sql from 'highlight.js/lib/languages/sql';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('java', java);
hljs.registerLanguage('go', go);
hljs.registerLanguage('rust', rust);
hljs.registerLanguage('cpp', cpp);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('json', json);
hljs.registerLanguage('yaml', yaml);
hljs.registerLanguage('markdown', markdown);
hljs.registerLanguage('sql', sql);

// 主题类型定义
export interface WechatTheme {
  base: Record<string, string>;
  block: Record<string, Record<string, string>>;
  inline: Record<string, Record<string, string>>;
}

// 格式化选项
export interface FormatOptions {
  theme?: 'default' | 'grace' | 'simple';
  fontSize?: string;
  primaryColor?: string;
  fontFamily?: string;
  isUseIndent?: boolean; // 首行缩进
  isUseJustify?: boolean; // 两端对齐
  isShowLineNumber?: boolean; // 代码行号
  citeStatus?: boolean; // 脚注
  // 图床配置
  imageBedFactory?: any; // ImageBedFactory 实例(可选)
  convertLocalImages?: boolean; // 是否转换本地图片(默认true)
}

/**
 * 将 CSS 对象转换为样式字符串
 */
function getStyleString(styleObj: Record<string, string>): string {
  return Object.entries(styleObj)
    .map(([key, value]) => {
      // 转义双引号为单引号,避免破坏 HTML 属性
      const escapedValue = value.replace(/"/g, "'");
      return `${key}:${escapedValue}`;
    })
    .join(';');
}

/**
 * 转义 HTML 特殊字符
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/`/g, '&#96;');
}

/**
 * 构建主题样式
 */
function buildTheme(options: FormatOptions): WechatTheme {
  const primaryColor = options.primaryColor || '#000000';
  const fontSize = options.fontSize || '16px';
  const fontFamily = options.fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

  const base = {
    'font-family': fontFamily,
    'font-size': fontSize,
    'line-height': '1.75',
    'text-align': 'left',
    '--md-primary-color': primaryColor,
  };

  // 默认主题
  const theme: WechatTheme = {
    base,
    block: {
      container: {},
      h1: {
        'display': 'table',
        'padding': '0 1em',
        'border-bottom': `2px solid ${primaryColor}`,
        'margin': '2em auto 1em',
        'font-size': '1.4em',
        'font-weight': 'bold',
        'text-align': 'center',
      },
      h2: {
        'display': 'table',
        'padding': '0.3em 1em',
        'margin': '2em auto 1em',
        'color': '#fff',
        'background': primaryColor,
        'font-size': '1.3em',
        'font-weight': 'bold',
        'text-align': 'center',
        'border-radius': '4px',
      },
      h3: {
        'padding-left': '12px',
        'border-left': `4px solid ${primaryColor}`,
        'margin': '2em 0 0.75em',
        'font-size': '1.2em',
        'font-weight': 'bold',
      },
      h4: {
        'margin': '2em 0 0.5em',
        'color': primaryColor,
        'font-size': '1.1em',
        'font-weight': 'bold',
      },
      p: {
        'margin': '1.5em 8px',
        'letter-spacing': '0.1em',
      },
      blockquote: {
        'padding': '1em',
        'border-left': `4px solid ${primaryColor}`,
        'border-radius': '4px',
        'color': 'rgba(0,0,0,0.6)',
        'background': '#f5f5f5',
        'margin': '1em 0',
      },
      code_pre: {
        'font-size': '90%',
        'overflow-x': 'auto',
        'border-radius': '8px',
        'padding': '1em',
        'line-height': '1.5',
        'margin': '10px 8px',
        'background': '#f6f8fa',
      },
      image: {
        'display': 'block',
        'max-width': '100%',
        'margin': '1em auto',
        'border-radius': '4px',
      },
      ol: {
        'padding-left': '1.5em',
        'margin-left': '0',
      },
      ul: {
        'list-style': 'circle',
        'padding-left': '1.5em',
        'margin-left': '0',
      },
      hr: {
        'border-style': 'solid',
        'border-width': '1px 0 0',
        'border-color': 'rgba(0,0,0,0.1)',
        'margin': '2em 0',
      },
      table: {
        'border-collapse': 'collapse',
        'margin': '1em 8px',
        'width': '100%',
      },
      th: {
        'border': '1px solid #ddd',
        'padding': '8px 12px',
        'background': '#f5f5f5',
        'font-weight': 'bold',
      },
      td: {
        'border': '1px solid #ddd',
        'padding': '8px 12px',
      },
    },
    inline: {
      listitem: {
        'margin': '0.5em 0',
      },
      codespan: {
        'font-size': '90%',
        'color': '#d14',
        'background': 'rgba(27,31,35,.05)',
        'padding': '3px 5px',
        'border-radius': '4px',
        'font-family': 'Menlo, Monaco, Consolas, monospace',
      },
      strong: {
        'color': primaryColor,
        'font-weight': 'bold',
      },
      em: {
        'font-style': 'italic',
      },
      link: {
        'color': '#576b95',
      },
    },
  };

  // 首行缩进
  if (options.isUseIndent) {
    theme.block.p = { ...theme.block.p, 'text-indent': '2em' };
  }

  // 两端对齐
  if (options.isUseJustify) {
    theme.block.p = { ...theme.block.p, 'text-align': 'justify' };
  }

  return theme;
}

/**
 * Wechat Formatter 类
 */
export class WechatFormatter {
  private options: FormatOptions;
  private theme: WechatTheme;
  private footnotes: Array<[number, string, string]> = [];
  private footnoteIndex: number = 0;
  private imageBedFactory: any; // ImageBedFactory 实例
  private localImages: Array<{ originalSrc: string; placeholder: string }> = [];

  constructor(options: FormatOptions = {}) {
    this.options = {
      theme: 'default',
      fontSize: '16px',
      primaryColor: '#3f51b5',
      isUseIndent: false,
      isUseJustify: false,
      isShowLineNumber: false,
      citeStatus: true,
      convertLocalImages: true, // 默认转换本地图片
      ...options,
    };

    this.imageBedFactory = options.imageBedFactory;
    this.theme = buildTheme(this.options);

    // 配置 marked
    marked.setOptions({
      breaks: true,
      gfm: true,
    });
  }

  /**
   * 获取元素样式字符串
   */
  private getStyles(tag: string): string {
    const blockStyles = this.theme.block[tag];
    const inlineStyles = this.theme.inline[tag];
    const styles = blockStyles || inlineStyles;

    if (!styles) return '';

    const mergedStyles = { ...this.theme.base, ...styles };
    return `style="${getStyleString(mergedStyles)}"`;
  }

  /**
   * 创建带样式的元素
   */
  private styledContent(tag: string, content: string, customTag?: string): string {
    const actualTag = customTag || tag;
    return `<${actualTag} ${this.getStyles(tag)}>${content}</${actualTag}>`;
  }

  /**
   * 添加脚注
   */
  private addFootnote(title: string, link: string): number {
    const existing = this.footnotes.find(([, , l]) => l === link);
    if (existing) return existing[0];

    this.footnotes.push([++this.footnoteIndex, title, link]);
    return this.footnoteIndex;
  }

  /**
   * 构建脚注列表
   */
  private buildFootnotes(): string {
    if (!this.footnotes.length) return '';

    const footnoteList = this.footnotes
      .map(([index, title, link]) =>
        link === title
          ? `<code style="font-size: 90%; opacity: 0.6;">[${index}]</code>: <i style="word-break: break-all">${link}</i><br/>`
          : `<code style="font-size: 90%; opacity: 0.6;">[${index}]</code> ${title}: <i style="word-break: break-all">${link}</i><br/>`
      )
      .join('\n');

    return this.styledContent('h4', '引用链接') + `<p ${this.getStyles('p')}>${footnoteList}</p>`;
  }

  /**
   * 判断是否为本地图片路径
   */
  private isLocalImagePath(src: string): boolean {
    // 不是 http/https URL 就认为是本地路径
    return !src.startsWith('http://') && !src.startsWith('https://') && !src.startsWith('data:');
  }

  /**
   * 处理本地图片上传
   */
  private async processLocalImages(html: string): Promise<string> {
    if (!this.imageBedFactory || this.localImages.length === 0) {
      return html;
    }

    let processedHtml = html;

    // 批量上传所有本地图片
    for (let i = 0; i < this.localImages.length; i++) {
      const { originalSrc, placeholder } = this.localImages[i];

      try {
        // 使用图床工厂上传图片
        const result = await this.imageBedFactory.uploadWithFallback(originalSrc);

        if (result.success) {
          // 替换占位符为实际 URL
          processedHtml = processedHtml.replace(
            new RegExp(placeholder, 'g'),
            result.url
          );
        } else {
          console.error(`图片上传失败: ${originalSrc}`, result.error);
          // 保留原路径
          processedHtml = processedHtml.replace(
            new RegExp(placeholder, 'g'),
            originalSrc
          );
        }
      } catch (error) {
        console.error(`图片处理异常: ${originalSrc}`, error);
        processedHtml = processedHtml.replace(
          new RegExp(placeholder, 'g'),
          originalSrc
        );
      }
    }

    return processedHtml;
  }

  /**
   * 格式化 Markdown 为微信 HTML
   */
  public async format(markdown: string): Promise<string> {
    // 重置状态
    this.footnotes = [];
    this.footnoteIndex = 0;
    this.localImages = [];

    const self = this;

    // 扩展 marked 的 Renderer
    class WechatRenderer extends Renderer {
      heading(token: Tokens.Heading): string {
        const text = this.parser.parseInline(token.tokens);
        // 跳过一级标题,避免与微信公众号标题冲突
        if (token.depth === 1) {
          return '';
        }
        const tag = `h${token.depth}`;
        return self.styledContent(tag, text);
      }

      paragraph(token: Tokens.Paragraph): string {
        const text = this.parser.parseInline(token.tokens);
        if (text.trim() === '' || text.includes('<figure') || text.includes('<img')) {
          return text;
        }
        return self.styledContent('p', text);
      }

      blockquote(token: Tokens.Blockquote): string {
        const body = this.parser.parse(token.tokens);
        return self.styledContent('blockquote', body);
      }

      code(token: Tokens.Code): string {
        const language = token.lang || 'plaintext';
        const isRegistered = hljs.getLanguage(language);
        const actualLang = isRegistered ? language : 'plaintext';

        let highlighted: string;
        try {
          highlighted = hljs.highlight(token.text, { language: actualLang }).value;
        } catch {
          highlighted = escapeHtml(token.text);
        }

        const code = `<code ${self.getStyles('codespan')} class="language-${actualLang}">${highlighted}</code>`;
        return `<pre ${self.getStyles('code_pre')}>${code}</pre>`;
      }

      codespan(token: Tokens.Codespan): string {
        return self.styledContent('codespan', escapeHtml(token.text), 'code');
      }

      list(token: Tokens.List): string {
        const body = token.items.map(item => this.listitem(item)).join('\n');
        const tag = token.ordered ? 'ol' : 'ul';
        return self.styledContent(tag, body);
      }

      listitem(item: Tokens.ListItem): string {
        let text = this.parser.parse(item.tokens);
        // 移除内部的 <p> 标签
        text = text.replace(/^<p[^>]*>(.*?)<\/p>$/s, '$1');
        return `<li ${self.getStyles('listitem')}>${text}</li>`;
      }

      image(token: Tokens.Image): string {
        const caption = token.title || token.text || '';
        const captionHtml = caption
          ? `<figcaption style="text-align:center;color:#888;font-size:0.9em;margin-top:0.5em">${caption}</figcaption>`
          : '';

        // 图片 URL 处理:支持本地图片转换
        let imageSrc = token.href;

        // 如果配置了图床工厂且需要转换本地图片
        if (self.imageBedFactory && self.options.convertLocalImages !== false) {
          // 标记需要处理的本地图片
          // 实际转换将在 format() 方法中异步处理
          if (self.isLocalImagePath(imageSrc)) {
            self.localImages.push({
              originalSrc: imageSrc,
              placeholder: `__LOCAL_IMAGE_${self.localImages.length}__`,
            });
            imageSrc = `__LOCAL_IMAGE_${self.localImages.length - 1}__`;
          }
        }

        return `<figure ${self.getStyles('image')}><img src="${imageSrc}" alt="${token.text || ''}" style="width:100%;height:auto;display:block;"/>${captionHtml}</figure>`;
      }

      link(token: Tokens.Link): string {
        const text = this.parser.parseInline(token.tokens);
        const href = token.href;
        const title = token.title || text;

        if (/^https?:\/\/mp\.weixin\.qq\.com/.test(href)) {
          return `<a href="${href}" title="${title}" ${self.getStyles('link')}>${text}</a>`;
        }

        if (self.options.citeStatus) {
          const ref = self.addFootnote(title, href);
          return `<span ${self.getStyles('link')}>${text}<sup>[${ref}]</sup></span>`;
        }

        return self.styledContent('link', text, 'span');
      }

      strong(token: Tokens.Strong): string {
        const text = this.parser.parseInline(token.tokens);
        return self.styledContent('strong', text);
      }

      em(token: Tokens.Em): string {
        const text = this.parser.parseInline(token.tokens);
        return self.styledContent('em', text, 'span');
      }

      hr(_token: Tokens.Hr): string {
        return `<hr ${self.getStyles('hr')}/>`;
      }

      table(token: Tokens.Table): string {
        const header = token.header.map(cell => {
          const content = this.parser.parseInline(cell.tokens);
          return `<th ${self.getStyles('th')}>${content}</th>`;
        }).join('');

        const body = token.rows.map(row => {
          const cells = row.map(cell => {
            const content = this.parser.parseInline(cell.tokens);
            return `<td ${self.getStyles('td')}>${content}</td>`;
          }).join('');
          return `<tr>${cells}</tr>`;
        }).join('\n');

        return `<table ${self.getStyles('table')}><thead><tr>${header}</tr></thead><tbody>${body}</tbody></table>`;
      }
    }

    const renderer = new WechatRenderer();

    // 使用自定义渲染器
    let content = await marked.parse(markdown, {
      renderer,
      breaks: true,
      gfm: true
    });

    // 添加脚注
    content += this.buildFootnotes();

    // 包裹容器
    let container = `<section ${this.getStyles('container')}>${content}</section>`;

    // 处理本地图片上传(如果配置了图床)
    container = await this.processLocalImages(container);

    return container;
  }

  /**
   * 导出为完整 HTML 文件(带一键复制功能)
   */
  public async exportHtml(markdown: string, title: string = '微信文章'): Promise<string> {
    const content = await this.format(markdown);

    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - 微信公众号预览</title>
  <style>
    * {
      box-sizing: border-box;
    }
    body {
      max-width: 900px;
      margin: 0 auto;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: #f5f5f5;
    }
    .toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.15);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 15px;
    }
    .toolbar h1 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: white;
      flex: 1;
    }
    .copy-btn {
      background: white;
      color: #667eea;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .copy-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0,0,0,0.15);
    }
    .copy-btn:active {
      transform: translateY(0);
    }
    .copy-btn.success {
      background: #10b981;
      color: white;
    }
    .status {
      color: white;
      font-size: 14px;
      padding: 8px 16px;
      border-radius: 6px;
      background: rgba(255,255,255,0.2);
      display: none;
    }
    .status.show {
      display: block;
    }
    .preview-container {
      background: white;
      margin: 20px;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.08);
    }
    pre {
      overflow-x: auto;
    }
    .instructions {
      background: #fff9e6;
      border-left: 4px solid #fbbf24;
      padding: 16px 20px;
      margin: 20px;
      border-radius: 8px;
      color: #92400e;
      line-height: 1.6;
    }
    .instructions h3 {
      margin: 0 0 12px 0;
      font-size: 16px;
      color: #78350f;
    }
    .instructions ol {
      margin: 8px 0;
      padding-left: 20px;
    }
    .instructions li {
      margin: 6px 0;
    }
    .instructions code {
      background: rgba(251, 191, 36, 0.2);
      padding: 2px 6px;
      border-radius: 4px;
      font-family: 'Monaco', 'Menlo', monospace;
      font-size: 13px;
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <h1>📱 ${title}</h1>
    <button class="copy-btn" id="copy-btn" onclick="copyToWechat()">
      <span id="btn-icon">📋</span>
      <span id="btn-text">一键复制到微信</span>
    </button>
    <div class="status" id="status"></div>
  </div>

  <div class="instructions">
    <h3>💡 使用说明</h3>
    <ol>
      <li>点击上方 <strong>"一键复制到微信"</strong> 按钮</li>
      <li>打开 <strong>微信公众号后台</strong> 编辑器</li>
      <li>在编辑器中按 <code>Ctrl+V</code> (Mac: <code>Cmd+V</code>) 粘贴</li>
      <li>检查格式,完成发布!</li>
    </ol>
  </div>

  <div class="preview-container" id="article-content">
    ${content}
  </div>

  <script>
    async function copyToWechat() {
      const btn = document.getElementById('copy-btn');
      const btnIcon = document.getElementById('btn-icon');
      const btnText = document.getElementById('btn-text');
      const status = document.getElementById('status');
      const content = document.getElementById('article-content');

      try {
        // 获取格式化后的 HTML
        const html = content.innerHTML;
        const text = content.innerText;

        // 使用 Clipboard API 复制带格式的内容
        if (navigator.clipboard && window.ClipboardItem) {
          const blob = new Blob([html], { type: 'text/html' });
          const textBlob = new Blob([text], { type: 'text/plain' });
          const item = new ClipboardItem({
            'text/html': blob,
            'text/plain': textBlob
          });

          await navigator.clipboard.write([item]);
        } else {
          // 降级方案:仅复制纯文本
          await navigator.clipboard.writeText(text);
        }

        // 成功提示
        btn.classList.add('success');
        btnIcon.textContent = '✅';
        btnText.textContent = '复制成功!';
        status.textContent = '已复制到剪贴板,请打开微信公众号后台粘贴';
        status.classList.add('show');

        // 3秒后恢复
        setTimeout(() => {
          btn.classList.remove('success');
          btnIcon.textContent = '📋';
          btnText.textContent = '一键复制到微信';
          status.classList.remove('show');
        }, 3000);

      } catch (err) {
        console.error('复制失败:', err);
        btnIcon.textContent = '❌';
        btnText.textContent = '复制失败';
        status.textContent = '复制失败,请手动选择内容复制';
        status.style.background = 'rgba(239, 68, 68, 0.9)';
        status.classList.add('show');

        setTimeout(() => {
          btnIcon.textContent = '📋';
          btnText.textContent = '一键复制到微信';
          status.classList.remove('show');
          status.style.background = 'rgba(255,255,255,0.2)';
        }, 3000);
      }
    }

    // 键盘快捷键: Ctrl/Cmd + Shift + C
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        copyToWechat();
      }
    });

    // 页面加载完成提示
    window.addEventListener('load', () => {
      console.log('✅ 微信公众号预览已加载');
      console.log('💡 快捷键: Ctrl/Cmd + Shift + C 快速复制');
    });
  </script>
</body>
</html>`;
  }
}

/**
 * 便捷函数:格式化 Markdown 为微信 HTML
 */
export async function formatMarkdownForWechat(
  markdown: string,
  options?: FormatOptions
): Promise<string> {
  const formatter = new WechatFormatter(options);
  return formatter.format(markdown);
}

/**
 * 便捷函数:导出为完整 HTML 文件
 */
export async function exportWechatHtml(
  markdown: string,
  title?: string,
  options?: FormatOptions
): Promise<string> {
  const formatter = new WechatFormatter(options);
  return formatter.exportHtml(markdown, title);
}
