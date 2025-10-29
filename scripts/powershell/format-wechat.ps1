# format-wechat.ps1
# 将 Markdown 文章格式化为微信公众号富文本 HTML (PowerShell 版本)
#
# 使用方法:
#   pwsh format-wechat.ps1 <input-md-file> [output-html-file]
#   或
#   powershell -File format-wechat.ps1 <input-md-file> [output-html-file]
#
# 示例:
#   pwsh format-wechat.ps1 draft.md wechat.html
#

param(
    [Parameter(Mandatory=$true, Position=0)]
    [string]$InputFile,

    [Parameter(Position=1)]
    [string]$OutputFile = "wechat.html"
)

# 错误处理
$ErrorActionPreference = "Stop"

# 检查输入文件是否存在
if (-not (Test-Path $InputFile)) {
    Write-Host "错误: 输入文件不存在: $InputFile" -ForegroundColor Red
    exit 1
}

# 查找项目根目录(查找 .content 目录)
function Find-ProjectRoot {
    $currentDir = Get-Location

    while ($currentDir.Path -ne [System.IO.Path]::GetPathRoot($currentDir.Path)) {
        $contentDir = Join-Path $currentDir.Path ".content"
        if (Test-Path $contentDir -PathType Container) {
            return $currentDir.Path
        }
        $currentDir = Split-Path $currentDir.Path -Parent
        if (-not $currentDir) { break }
    }

    return $null
}

$PROJECT_ROOT = Find-ProjectRoot

if (-not $PROJECT_ROOT) {
    Write-Host "错误: 无法找到项目根目录(.content目录)" -ForegroundColor Red
    exit 1
}

$CONFIG_FILE = Join-Path $PROJECT_ROOT ".content/config.json"

# 读取配置(默认值)
$THEME = "default"
$PRIMARY_COLOR = "#3f51b5"
$FONT_SIZE = "16px"
$FONT_FAMILY = "-apple-system, BlinkMacSystemFont, `"Segoe UI`", Roboto, sans-serif"
$IS_USE_INDENT = "false"
$IS_USE_JUSTIFY = "false"
$IS_SHOW_LINE_NUMBER = "false"
$CITE_STATUS = "true"

# 检查并读取配置文件
if (Test-Path $CONFIG_FILE) {
    try {
        $config = Get-Content $CONFIG_FILE -Raw | ConvertFrom-Json

        if ($config.formatting) {
            if ($config.formatting.theme) { $THEME = $config.formatting.theme }
            if ($config.formatting.primaryColor) { $PRIMARY_COLOR = $config.formatting.primaryColor }
            if ($config.formatting.fontSize) { $FONT_SIZE = $config.formatting.fontSize }
            if ($config.formatting.fontFamily) { $FONT_FAMILY = $config.formatting.fontFamily }
            if ($null -ne $config.formatting.isUseIndent) { $IS_USE_INDENT = $config.formatting.isUseIndent.ToString().ToLower() }
            if ($null -ne $config.formatting.isUseJustify) { $IS_USE_JUSTIFY = $config.formatting.isUseJustify.ToString().ToLower() }
            if ($null -ne $config.formatting.isShowLineNumber) { $IS_SHOW_LINE_NUMBER = $config.formatting.isShowLineNumber.ToString().ToLower() }
            if ($null -ne $config.formatting.citeStatus) { $CITE_STATUS = $config.formatting.citeStatus.ToString().ToLower() }
        }
    } catch {
        Write-Host "警告: 配置文件读取失败,使用默认配置" -ForegroundColor Yellow
    }
} else {
    Write-Host "警告: 配置文件不存在,使用默认配置" -ForegroundColor Yellow
}

# 读取 Markdown 内容
$markdownContent = Get-Content $InputFile -Raw -Encoding UTF8

# 转义特殊字符用于 JavaScript
$markdownEscaped = $markdownContent -replace '\\', '\\' -replace '`', '\`' -replace '\$', '\$' -replace '"', '\"' -replace "`r`n", "`n" -replace "`n", '\n'

# 转义配置值
$FONT_FAMILY_ESCAPED = $FONT_FAMILY -replace '"', '\"'

# 获取脚本文件路径
$scriptPath = if ($PSCommandPath) { $PSCommandPath } else { $MyInvocation.MyCommand.Path }
$scriptDir = Split-Path -Parent $scriptPath
$devProjectRoot = Split-Path -Parent (Split-Path -Parent $scriptDir)

# 获取全局 node_modules 路径
try {
    $globalNodeModules = (npm root -g 2>$null) -replace '\\', '\\\\'
} catch {
    $globalNodeModules = ""
}

# 使用 Node.js 执行格式化
$nodeScript = @"
const fs = require('fs');
const path = require('path');

let formatMarkdown;
let loadedFrom = '';

// 尝试多种方式加载格式化器
const loadStrategies = [
  // 策略1: 从全局 node_modules 加载（最常用）
  () => {
    const globalNodeModules = '$globalNodeModules';
    if (globalNodeModules && fs.existsSync(globalNodeModules)) {
      const formatterPath = path.join(globalNodeModules, 'article-writer-cn', 'dist', 'formatters', 'wechat-formatter.js');
      if (fs.existsSync(formatterPath)) {
        const formatter = require(formatterPath);
        return formatter.exportWechatHtml;
      }
    }
    throw new Error('Formatter not found in global node_modules');
  },
  // 策略2: 从用户项目的 node_modules 加载
  () => {
    const formatterPath = path.join('$PROJECT_ROOT', 'node_modules', 'article-writer-cn', 'dist', 'formatters', 'wechat-formatter.js');
    if (fs.existsSync(formatterPath)) {
      const formatter = require(formatterPath);
      return formatter.exportWechatHtml;
    }
    throw new Error('Formatter not found in local node_modules');
  },
  // 策略3: 从开发环境加载（article-writer 项目本身）
  () => {
    const formatterPath = path.join('$($devProjectRoot -replace '\\', '\\\\')', 'dist', 'formatters', 'wechat-formatter.js');
    if (fs.existsSync(formatterPath)) {
      const formatter = require(formatterPath);
      return formatter.exportWechatHtml;
    }
    throw new Error('Formatter not found in development path');
  },
  // 策略4: 通过 require.resolve 查找（兜底）
  () => {
    const pkgPath = require.resolve('article-writer-cn');
    const formatterPath = path.join(path.dirname(pkgPath), 'formatters', 'wechat-formatter.js');
    const formatter = require(formatterPath);
    return formatter.exportWechatHtml;
  }
];

for (let i = 0; i < loadStrategies.length; i++) {
  try {
    formatMarkdown = loadStrategies[i]();
    loadedFrom = 'strategy-' + (i + 1);
    break;
  } catch (err) {
    // 继续尝试下一个策略
    if (i === loadStrategies.length - 1) {
      // 所有策略都失败了
      console.error('错误: 无法加载格式化器');
      console.error('');
      console.error('可能的原因:');
      console.error('  1. article-writer-cn 未安装');
      console.error('  2. 版本不兼容');
      console.error('');
      console.error('解决方案:');
      console.error('  运行: npm install -g article-writer-cn@latest');
      console.error('  或者: npm install article-writer-cn@latest');
      console.error('');
      console.error('详细错误:', err.message);
      process.exit(1);
    }
  }
}

// 读取 Markdown
const markdown = "$markdownEscaped";

// 获取文章标题(从第一个一级标题提取)
const titleMatch = markdown.match(/^#\s+(.+)$/m);
const title = titleMatch ? titleMatch[1] : '微信文章';

// 格式化选项
const options = {
  theme: '$THEME',
  primaryColor: '$PRIMARY_COLOR',
  fontSize: '$FONT_SIZE',
  fontFamily: '$FONT_FAMILY_ESCAPED',
  isUseIndent: '$IS_USE_INDENT' === 'true',
  isUseJustify: '$IS_USE_JUSTIFY' === 'true',
  isShowLineNumber: '$IS_SHOW_LINE_NUMBER' === 'true',
  citeStatus: '$CITE_STATUS' === 'true'
};

// 格式化并导出
formatMarkdown(markdown, title, options).then(html => {
  fs.writeFileSync('$OutputFile', html, 'utf-8');
  console.log('✅ 微信格式化成功!');
  console.log('📄 输出文件:', '$OutputFile');
  console.log('🎨 使用主题:', options.theme);
  console.log('🎨 主题色:', options.primaryColor);
}).catch(err => {
  console.error('错误: 格式化失败');
  console.error(err.message);
  process.exit(1);
});
"@

# 执行 Node.js 脚本
try {
    $nodeScript | node

    # 等待文件写入完成
    Start-Sleep -Milliseconds 500

    # 检查输出文件是否生成
    if (Test-Path $OutputFile) {
        Write-Host ""
        Write-Host "🌐 正在打开浏览器..." -ForegroundColor Cyan

        # 获取输出文件的绝对路径
        $absolutePath = Resolve-Path $OutputFile

        # 在 Windows 上打开默认浏览器
        Start-Process $absolutePath

        Write-Host "✅ 浏览器已打开" -ForegroundColor Green
    } else {
        Write-Host "错误: 输出文件未生成" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "错误: 格式化过程失败" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "🎉 格式化完成!" -ForegroundColor Green
Write-Host ""
Write-Host "💡 提示:" -ForegroundColor Yellow
Write-Host "  1. 在浏览器中点击「一键复制」按钮" -ForegroundColor White
Write-Host "  2. 打开微信公众号后台" -ForegroundColor White
Write-Host "  3. 粘贴到编辑器中" -ForegroundColor White
Write-Host "  4. 所有格式都会保留!" -ForegroundColor White
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
