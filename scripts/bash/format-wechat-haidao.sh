#!/usr/bin/env bash
#
# format-wechat-haidao.sh
# 校验 wechat frontmatter, 上传本地资源并调用 HAIDAO HTTP 服务发布
#
# 使用方法:
#   bash format-wechat-haidao.sh <publish/wechat.md>
#

set -euo pipefail

INPUT_FILE=""
REWRITE_SOURCE="${HAIDAO_REWRITE_SOURCE:-false}"
THEME_OVERRIDE="${HAIDAO_THEME:-}"
HIGHLIGHT_OVERRIDE="${HAIDAO_HIGHLIGHT:-}"

THEME_CHOICES="default orangeheart rainbow lapis pie maize purple phycat haidao"
HIGHLIGHT_CHOICES="atom-one-dark atom-one-light dracula github-dark github monokai solarized-dark solarized-light xcode"

mask_secret() {
  local value="${1:-}"
  local length=${#value}
  if [ "$length" -le 4 ]; then
    printf '%s' "$value"
    return
  fi
  local prefix="${value:0:4}"
  local suffix="${value:length-4:4}"
  local middle_length=$((length - 8))
  local middle=""
  if [ $middle_length -gt 0 ]; then
    middle=$(printf '%*s' "$middle_length" '' | tr ' ' '*')
  fi
  printf '%s%s%s' "$prefix" "$middle" "$suffix"
}

validate_choice() {
  local value="$1"; shift
  local choices=("$@")
  for item in "${choices[@]}"; do
    if [ "$item" = "$value" ]; then
      return 0
    fi
  done
  return 1
}

print_help() {
  cat <<'EOF'
使用方法: bash format-wechat-haidao.sh [options] <publish/wechat.md>

功能:
  1. 校验 Markdown Frontmatter 是否包含 title 和 cover 字段
  2. 自动上传 Markdown 中的本地资源并替换为远程 URL
  3. 通过 HTTP Publish 服务提交内容

可选参数:
  -t <theme_id>          指定主题(default/orangeheart/rainbow/lapis/pie/maize/purple/phycat，或设 HAIDAO_THEME)
-h <highlight_id>      指定代码高亮(atom-one-dark/atom-one-light/dracula/github-dark/github/monokai/solarized-dark/solarized-light/xcode，或设 HAIDAO_HIGHLIGHT)
  --rewrite-source       上传后覆盖原 Markdown（等同设置 HAIDAO_REWRITE_SOURCE=true）
  --no-rewrite-source    显式关闭覆盖，保持默认行为

依赖:
  - 环境变量 WECHAT_APP_ID / WECHAT_APP_SECRET
  - 可访问的 HAIDAO HTTP 服务 (默认 http://localhost:3333)
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --help)
      print_help
      exit 0
      ;;
    -t|--theme)
      if [ $# -lt 2 ]; then
        echo "错误: -t/--theme 需要主题 ID" >&2
        exit 1
      fi
      THEME_OVERRIDE="$2"
      shift 2
      continue
      ;;
    -h|--highlight)
      if [ $# -lt 2 ]; then
        echo "错误: -h/--highlight 需要代码高亮 ID" >&2
        exit 1
      fi
      HIGHLIGHT_OVERRIDE="$2"
      shift 2
      continue
      ;;
    --rewrite-source)
      REWRITE_SOURCE="true"
      shift
      ;;
    --no-rewrite-source)
      REWRITE_SOURCE="false"
      shift
      ;;
    *)
      if [ -z "$INPUT_FILE" ]; then
        INPUT_FILE="$1"
      else
        echo "错误: 只能指定一个 Markdown 文件" >&2
        exit 1
      fi
      shift
      ;;
  esac
done

if [ -z "$INPUT_FILE" ]; then
  echo "错误: 缺少输入文件参数" >&2
  print_help
  exit 1
fi

if [ ! -f "$INPUT_FILE" ]; then
  echo "错误: 输入文件不存在: $INPUT_FILE" >&2
  exit 1
fi

INPUT_ABS="$(cd "$(dirname "$INPUT_FILE")" && pwd)/$(basename "$INPUT_FILE")"
INPUT_DIR="$(dirname "$INPUT_ABS")"

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
  echo "错误: 无法找到项目根目录(.content目录)" >&2
  exit 1
fi

CONFIG_FILE="$PROJECT_ROOT/.content/config.json"

THEME=$(node -p "try { const c = require('$CONFIG_FILE'); c.formatting?.theme || 'default' } catch(e) { 'default' }" 2>/dev/null || echo "default")
HIGHLIGHT=$(node -p "try { const c = require('$CONFIG_FILE'); c.formatting?.highlight || 'dracula' } catch(e) { 'dracula' }" 2>/dev/null || echo "dracula")

if [ -n "$THEME_OVERRIDE" ]; then
  if validate_choice "$THEME_OVERRIDE" $THEME_CHOICES; then
    THEME="$THEME_OVERRIDE"
  else
    echo "错误: 不支持的主题: $THEME_OVERRIDE" >&2
    echo "可选值: $THEME_CHOICES" >&2
    exit 1
  fi
fi

if [ -n "$HIGHLIGHT_OVERRIDE" ]; then
  if validate_choice "$HIGHLIGHT_OVERRIDE" $HIGHLIGHT_CHOICES; then
    HIGHLIGHT="$HIGHLIGHT_OVERRIDE"
  else
    echo "错误: 不支持的代码高亮: $HIGHLIGHT_OVERRIDE" >&2
    echo "可选值: $HIGHLIGHT_CHOICES" >&2
    exit 1
  fi
fi

if [ -z "${WECHAT_APP_ID:-}" ] || [ -z "${WECHAT_APP_SECRET:-}" ]; then
  echo "错误: 需要设置 WECHAT_APP_ID 和 WECHAT_APP_SECRET 环境变量以发布" >&2
  exit 1
fi

echo "🔐 Debug: 当前将使用以下 Header 值"
echo "   • WECHAT_APP_ID: $(mask_secret "$WECHAT_APP_ID")"
echo "   • WECHAT_APP_SECRET: $(mask_secret "$WECHAT_APP_SECRET")"
echo ""

# 使用 Node 校验 frontmatter 并输出 title/cover
FRONTMATTER_INFO="$(
  node - <<'NODE' "$INPUT_ABS"
const fs = require('fs');
const file = process.argv[2];
const content = fs.readFileSync(file, 'utf-8');
const match = content.match(/^---\s*\n([\s\S]*?)\n---/);
if (!match) {
  console.error(`错误: ${file} 缺少 frontmatter, 需要以 --- 包裹的 YAML 区块`);
  process.exit(1);
}
const lines = match[1].split(/\r?\n/);
const data = {};
for (const rawLine of lines) {
  const line = rawLine.trim();
  if (!line || line.startsWith('#')) continue;
  if (/^[-]/.test(line)) continue; // 忽略简单列表
  if (rawLine.startsWith(' ') || rawLine.startsWith('\t')) continue; // 忽略缩进行
  const idx = line.indexOf(':');
  if (idx === -1) continue;
  const key = line.slice(0, idx).trim();
  let value = line.slice(idx + 1).trim();
  if (!value) continue;
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  }
  data[key] = value;
}
if (!data.title) {
  console.error('错误: frontmatter 中缺少 title 字段');
  process.exit(1);
}
if (!data.cover) {
  console.error('错误: frontmatter 中缺少 cover 字段');
  process.exit(1);
}
console.log(`TITLE=${data.title}`);
console.log(`COVER=${data.cover}`);
NODE
)"

if [ -z "$FRONTMATTER_INFO" ]; then
  echo "错误: frontmatter 解析失败" >&2
  exit 1
fi

TITLE=$(echo "$FRONTMATTER_INFO" | sed -n 's/^TITLE=//p' | head -n 1)
COVER_RAW=$(echo "$FRONTMATTER_INFO" | sed -n 's/^COVER=//p' | head -n 1)

if [ -z "$TITLE" ]; then
  echo "错误: 未能解析到 frontmatter.title" >&2
  exit 1
fi

if [ -z "$COVER_RAW" ]; then
  echo "错误: 未能解析到 frontmatter.cover" >&2
  exit 1
fi

VALID_COVER="false"
if [[ "$COVER_RAW" =~ ^https?:// ]]; then
  VALID_COVER="true"
else
  LOCAL_COVER=""
  case "$COVER_RAW" in
    /*)
      LOCAL_COVER="$COVER_RAW"
      ;;
    "~/"*)
      LOCAL_COVER="${HOME}${COVER_RAW:1}"
      ;;
    *)
      LOCAL_COVER=$(node -p "require('path').resolve('$INPUT_DIR', '$COVER_RAW')" 2>/dev/null || echo "")
      ;;
  esac

  if [ -n "${LOCAL_COVER:-}" ]; then
    if [ -f "$LOCAL_COVER" ]; then
      VALID_COVER="true"
      COVER_RAW="$LOCAL_COVER"
    else
      echo "错误: cover 指向的本地图片不存在: $LOCAL_COVER (由 cover: $COVER_RAW 推导)" >&2
      exit 1
    fi
  fi
fi

if [ "$VALID_COVER" != "true" ]; then
  echo "错误: cover 必须为 http(s) 图片 URL 或本地绝对路径, 当前值: $COVER_RAW" >&2
  exit 1
fi

API_BASE="${HAIDAO_API_BASE:-http://wechat.aisleep.yosuai.com}"
UPLOAD_ENDPOINT="${HAIDAO_UPLOAD_ENDPOINT:-$API_BASE/upload}"
PUBLISH_ENDPOINT="${HAIDAO_PUBLISH_ENDPOINT:-$API_BASE/publish}"

echo "✅ Frontmatter 校验通过"
echo "   • 标题: $TITLE"
echo "   • 封面: $COVER_RAW"
echo "   • HAIDAO 主题: $THEME"
echo "   • Highlight: $HIGHLIGHT"
echo "   • API 基址: $API_BASE"
echo "   • 覆盖源文件: $REWRITE_SOURCE"
echo ""

TMP_MD="$(mktemp)"
cleanup() {
  rm -f "$TMP_MD"
}
trap cleanup EXIT

COVER_LOCAL_PATH=""
if [[ "$COVER_RAW" =~ ^https?:// ]]; then
  COVER_IS_REMOTE="true"
else
  COVER_IS_REMOTE="false"
  COVER_LOCAL_PATH="$COVER_RAW"
fi

echo "🖼️  检查 Markdown 中的本地资源..."

HAIDAO_API_BASE="$API_BASE" \
HAIDAO_UPLOAD_ENDPOINT="$UPLOAD_ENDPOINT" \
COVER_LOCAL_PATH="$COVER_LOCAL_PATH" \
COVER_IS_REMOTE="$COVER_IS_REMOTE" \
REWRITE_SOURCE="$REWRITE_SOURCE" \
node - "$INPUT_ABS" "$TMP_MD" <<'NODE'
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const { Blob } = require('buffer');

if (typeof fetch !== 'function') {
  console.error('错误: 当前 Node 版本不支持 fetch API, 无法上传资源');
  process.exit(1);
}

const inputPath = process.argv[2];
const outputPath = process.argv[3];
const inputDir = path.dirname(inputPath);
const apiBase = process.env.HAIDAO_API_BASE || 'http://localhost:3333';
const uploadEndpoint = process.env.HAIDAO_UPLOAD_ENDPOINT || `${apiBase.replace(/\/$/, '')}/upload`;
const coverLocalPath = process.env.COVER_LOCAL_PATH || '';
const isCoverRemote = process.env.COVER_IS_REMOTE === 'true';
const rewriteSource = process.env.REWRITE_SOURCE === 'true';
const appId = process.env.WECHAT_APP_ID;
const appSecret = process.env.WECHAT_APP_SECRET;

const content = fs.readFileSync(inputPath, 'utf-8');
const fmMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
if (!fmMatch) {
  console.error('错误: Markdown 缺少 frontmatter, 无法继续');
  process.exit(1);
}

const fmBody = fmMatch[1];
const fmLines = fmBody.split(/\r?\n/);
let coverLineIndex = -1;
let coverOriginalValue = '';

for (let i = 0; i < fmLines.length; i++) {
  const line = fmLines[i];
  if (/^\s*cover\s*:/i.test(line)) {
    coverLineIndex = i;
    coverOriginalValue = line.replace(/^\s*cover\s*:/i, '').trim();
    if ((coverOriginalValue.startsWith('"') && coverOriginalValue.endsWith('"')) || (coverOriginalValue.startsWith("'") && coverOriginalValue.endsWith("'"))) {
      coverOriginalValue = coverOriginalValue.slice(1, -1);
    }
    break;
  }
}

if (coverLineIndex === -1) {
  console.error('错误: 未能在 frontmatter 中定位 cover 字段');
  process.exit(1);
}

const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
const titlePattern = /\s+("[^"]*"|'[^']*'|\([^)]+\))$/;
const isRemote = (t) => /^(?:[a-zA-Z][a-zA-Z\d+\-.]*:)?\/\//.test(t) || t.startsWith('data:');

const uploadCache = new Map();

const guessMime = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  const mapping = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.bmp': 'image/bmp',
    '.mp4': 'video/mp4',
    '.mov': 'video/quicktime',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.pdf': 'application/pdf'
  };
  return mapping[ext] || 'application/octet-stream';
};

let headersLogged = false;

const maskSecret = (value = '') => {
  if (!value) return '';
  if (value.length <= 4) return value;
  const prefix = value.slice(0, 4);
  const suffix = value.slice(-4);
  return `${prefix}${'*'.repeat(Math.max(0, value.length - 8))}${suffix}`;
};

const logHeadersOnce = (headers) => {
  if (headersLogged) return;
  headersLogged = true;
  const printable = {};
  for (const [key, val] of Object.entries(headers)) {
    printable[key] = maskSecret(val);
  }
  console.error(`   • Debug Headers: ${JSON.stringify(printable)}`);
};

const uploadFile = async (localPath) => {
  const absolutePath = path.resolve(localPath);
  if (uploadCache.has(absolutePath)) {
    return uploadCache.get(absolutePath);
  }

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`本地资源不存在: ${absolutePath}`);
  }

  const promise = (async () => {
    const mime = guessMime(absolutePath);
    const buffer = await fsp.readFile(absolutePath);
    const blob = new Blob([buffer], { type: mime });
    const form = new FormData();
    form.append('file', blob, path.basename(absolutePath));
    form.append('content_type', mime);

    const headers = {};
    if (appId) {
      headers['WECHAT_APP_ID'] = appId;
    }
    if (appSecret) {
      headers['WECHAT_APP_SECRET'] = appSecret;
    }

    console.error(`   • 正在上传本地文件: ${absolutePath}`);

    const requestInit = {
      method: 'POST',
      headers,
      body: form
    };

    logHeadersOnce(headers);

    const response = await fetch(uploadEndpoint, requestInit);

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`上传失败(${response.status}) - 文件: ${absolutePath}: ${text}`);
    }

    const data = await response.json();
    if (!data || !data.url) {
      throw new Error(`上传响应缺少 url 字段: ${JSON.stringify(data)}`);
    }

    console.error(`   • 已上传 ${absolutePath} -> ${data.url}`);
    return data.url;
  })();

  uploadCache.set(absolutePath, promise);
  return promise;
};

const sanitizeValue = (value) => {
  if (value === undefined || value === null) return '';
  if (/\s/.test(value)) {
    return `"${value.replace(/"/g, '\"')}"`;
  }
  return value;
};

const resolveLocal = (target) => {
  if (path.isAbsolute(target)) return target;
  if (target.startsWith('~/')) {
    return path.join(process.env.HOME || '', target.slice(2));
  }
  return path.resolve(inputDir, target);
};

const stripAngles = (value) => {
  if (value.startsWith('<') && value.endsWith('>')) {
    return value.slice(1, -1).trim();
  }
  return value;
};

const processTarget = async (rawTarget) => {
  const trimmed = rawTarget.trim();
  let titleSuffix = '';
  let urlPart = trimmed;

  const titleMatch = trimmed.match(titlePattern);
  if (titleMatch) {
    titleSuffix = titleMatch[1];
    urlPart = trimmed.slice(0, trimmed.length - titleMatch[0].length).trim();
  }

  urlPart = stripAngles(urlPart);

  if (isRemote(urlPart)) {
    return { url: urlPart, titleSuffix };
  }

  const resolvedPath = resolveLocal(urlPart);
  const uploadedUrl = await uploadFile(resolvedPath);
  return { url: uploadedUrl, titleSuffix };
};

const transformBody = async (body) => {
  imageRegex.lastIndex = 0;
  let lastIndex = 0;
  let result = '';
  let match;

  while ((match = imageRegex.exec(body)) !== null) {
    const [full, alt = '', targetRaw] = match;
    result += body.slice(lastIndex, match.index);
    const { url, titleSuffix } = await processTarget(targetRaw);
    const titlePart = titleSuffix ? ` ${titleSuffix}` : '';
    result += `![${alt}](${url}${titlePart})`;
    lastIndex = match.index + full.length;
  }

  result += body.slice(lastIndex);
  return result;
};

(async () => {
  try {
    let coverValue = coverOriginalValue;
    if (!isCoverRemote && coverLocalPath) {
      coverValue = await uploadFile(coverLocalPath);
      console.error(`   • 封面替换为远程链接: ${coverValue}`);
    }

    const updatedFmLines = [...fmLines];
    updatedFmLines[coverLineIndex] = `cover: ${sanitizeValue(coverValue)}`;
    const newFrontmatter = `---\n${updatedFmLines.join('\n')}\n---`;
    const prefix = content.slice(0, fmMatch.index ?? 0);
    const body = content.slice((fmMatch.index ?? 0) + fmMatch[0].length);
    const newBody = await transformBody(body);
    const finalContent = `${prefix}${newFrontmatter}${newBody}`;
    fs.writeFileSync(outputPath, finalContent, 'utf-8');
    if (rewriteSource) {
      fs.writeFileSync(inputPath, finalContent, 'utf-8');
      console.error(`   • 已覆盖原 Markdown: ${inputPath}`);
    }
  } catch (err) {
    console.error(`错误: ${err.message}`);
    process.exit(1);
  }
})();
NODE

echo "📄 已生成替换资源后的临时 Markdown: $TMP_MD"

PUBLISH_PAYLOAD=$(node - "$TMP_MD" "$THEME" "$HIGHLIGHT" <<'NODE'
const fs = require('fs');
const content = fs.readFileSync(process.argv[2], 'utf-8');
const theme = process.argv[3] || 'default';
const highlight = process.argv[4] || '';
const payload = {
  content,
  theme_id: theme
};
if (highlight) {
  payload.highlight_id = highlight;
}
process.stdout.write(JSON.stringify(payload));
NODE
)

echo "🚀 正在调用发布接口: $PUBLISH_ENDPOINT"
echo "   • Header WECHAT_APP_ID: $(mask_secret "$WECHAT_APP_ID")"
echo "   • Header WECHAT_APP_SECRET: $(mask_secret "$WECHAT_APP_SECRET")"
echo ""

set +e
HTTP_RESPONSE=$(curl --silent --show-error --write-out "\n%{http_code}" \
  -X POST "$PUBLISH_ENDPOINT" \
  -H "Content-Type: application/json" \
  -H "WECHAT_APP_ID: $WECHAT_APP_ID" \
  -H "WECHAT_APP_SECRET: $WECHAT_APP_SECRET" \
  -d "$PUBLISH_PAYLOAD")
STATUS=$?
set -e

if [ $STATUS -ne 0 ]; then
  echo "❌ 发布请求失败" >&2
  exit $STATUS
fi

HTTP_STATUS=$(printf '%s' "$HTTP_RESPONSE" | tail -n 1)
HTTP_BODY="${HTTP_RESPONSE%$'\n'$HTTP_STATUS}"

if [[ "$HTTP_STATUS" -lt 200 || "$HTTP_STATUS" -ge 300 ]]; then
  echo "❌ 发布接口返回错误 ($HTTP_STATUS):" >&2
  echo "$HTTP_BODY" >&2
  exit 1
fi

echo "🎉 发布成功"
echo "$HTTP_BODY"
exit 0
