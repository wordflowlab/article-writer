#!/usr/bin/env bash
#
# format-wechat.sh
# 将 Markdown 文章格式化为微信公众号富文本 HTML
#
# 使用方法:
#   bash format-wechat.sh <input-md-file> [output-html-file]
#
# 示例:
#   bash format-wechat.sh draft.md wechat.html
#

set -e  # 遇到错误立即退出

# 检查参数
if [ $# -lt 1 ]; then
  echo "错误: 缺少输入文件参数"
  echo "使用方法: bash format-wechat.sh <input-md-file> [output-html-file]"
  exit 1
fi

INPUT_FILE="$1"
OUTPUT_FILE="${2:-wechat.html}"

# 检查输入文件是否存在
if [ ! -f "$INPUT_FILE" ]; then
  echo "错误: 输入文件不存在: $INPUT_FILE"
  exit 1
fi

# 获取项目根目录(查找 .content 目录)
PROJECT_ROOT=""
CURRENT_DIR="$(pwd)"

while [ "$CURRENT_DIR" != "/" ]; do
  if [ -d "$CURRENT_DIR/.content" ]; then
    PROJECT_ROOT="$CURRENT_DIR"
    break
  fi
  CURRENT_DIR="$(dirname "$CURRENT_DIR")"
done

if [ -z "$PROJECT_ROOT" ]; then
  echo "错误: 无法找到项目根目录(.content目录)"
  exit 1
fi

CONFIG_FILE="$PROJECT_ROOT/.content/config.json"

# 检查配置文件
if [ ! -f "$CONFIG_FILE" ]; then
  echo "警告: 配置文件不存在,使用默认配置"
  THEME="default"
  PRIMARY_COLOR="#3f51b5"
  FONT_SIZE="16px"
else
  # 读取配置(使用 node 解析 JSON)
  THEME=$(node -p "try { const c = require('$CONFIG_FILE'); c.formatting?.theme || 'default' } catch(e) { 'default' }" 2>/dev/null || echo "default")
  PRIMARY_COLOR=$(node -p "try { const c = require('$CONFIG_FILE'); c.formatting?.primaryColor || '#3f51b5' } catch(e) { '#3f51b5' }" 2>/dev/null || echo "#3f51b5")
  FONT_SIZE=$(node -p "try { const c = require('$CONFIG_FILE'); c.formatting?.fontSize || '16px' } catch(e) { '16px' }" 2>/dev/null || echo "16px")
fi

# 使用 Node.js 调用格式化器
node -e "
const fs = require('fs');
const path = require('path');

// 动态加载格式化器
const formatterPath = path.join('$PROJECT_ROOT', 'node_modules', 'article-writer-cn', 'dist', 'formatters', 'wechat-formatter.js');

let formatMarkdown;
try {
  if (fs.existsSync(formatterPath)) {
    const formatter = require(formatterPath);
    formatMarkdown = formatter.exportWechatHtml;
  } else {
    // 开发模式:直接从 src 加载(需要 tsx)
    const { exportWechatHtml } = require('$PROJECT_ROOT/src/formatters/wechat-formatter.ts');
    formatMarkdown = exportWechatHtml;
  }
} catch (err) {
  console.error('错误: 无法加载格式化器');
  console.error(err.message);
  process.exit(1);
}

// 读取 Markdown
const markdown = fs.readFileSync('$INPUT_FILE', 'utf-8');

// 获取文章标题(从第一个一级标题提取)
const titleMatch = markdown.match(/^#\s+(.+)$/m);
const title = titleMatch ? titleMatch[1] : '微信文章';

// 格式化选项
const options = {
  theme: '$THEME',
  primaryColor: '$PRIMARY_COLOR',
  fontSize: '$FONT_SIZE',
  isUseIndent: false,
  isUseJustify: false,
  isShowLineNumber: false,
  citeStatus: true
};

// 格式化并导出
formatMarkdown(markdown, title, options).then(html => {
  fs.writeFileSync('$OUTPUT_FILE', html, 'utf-8');
  console.log('✅ 微信格式化成功!');
  console.log('📄 输出文件:', '$OUTPUT_FILE');
  console.log('🎨 使用主题:', options.theme);
  console.log('🎨 主题色:', options.primaryColor);
  console.log('');
  console.log('💡 下一步:');
  console.log('   1. 在浏览器中打开 $OUTPUT_FILE 预览效果');
  console.log('   2. 复制富文本内容');
  console.log('   3. 粘贴到微信公众号编辑器');
}).catch(err => {
  console.error('错误: 格式化失败');
  console.error(err.message);
  process.exit(1);
});
"

# 检查是否设置了自动预览
if [ -f "$CONFIG_FILE" ]; then
  AUTO_PREVIEW=$(node -p "try { const c = require('$CONFIG_FILE'); c.formatting?.autoPreview || false } catch(e) { false }" 2>/dev/null || echo "false")

  if [ "$AUTO_PREVIEW" = "true" ] && [ -f "$OUTPUT_FILE" ]; then
    echo ""
    echo "🌐 正在打开浏览器预览..."

    # 跨平台打开浏览器
    if command -v open >/dev/null 2>&1; then
      # macOS
      open "$OUTPUT_FILE"
    elif command -v xdg-open >/dev/null 2>&1; then
      # Linux
      xdg-open "$OUTPUT_FILE"
    elif command -v start >/dev/null 2>&1; then
      # Windows (Git Bash)
      start "$OUTPUT_FILE"
    else
      echo "⚠️  无法自动打开浏览器,请手动打开: $OUTPUT_FILE"
    fi
  fi
fi

exit 0
