# 选题讨论 - 基于 brief 提供选题方向
param(
    [string]$BriefFile = ""
)

# 导入通用函数
. "$PSScriptRoot/common.ps1"

$ProjectRoot = Get-ProjectRoot

# 如果没有指定 brief，使用最新的
if ([string]::IsNullOrEmpty($BriefFile)) {
    $BriefsDir = Join-Path $ProjectRoot "_briefs"
    if (Test-Path $BriefsDir) {
        $BriefFile = Get-ChildItem -Path $BriefsDir -Filter "*.md" |
                     Sort-Object LastWriteTime -Descending |
                     Select-Object -First 1 -ExpandProperty FullName
    }
}

if ([string]::IsNullOrEmpty($BriefFile) -or -not (Test-Path $BriefFile)) {
    Write-Host "❌ 错误: 未找到 brief 文件"
    Write-Host "用法: topic.ps1 [-BriefFile <路径>]"
    exit 1
}

Write-Host "✅ 使用 brief: $BriefFile"
Write-Host ""
Write-Host "📋 Brief 内容摘要:"
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 显示 brief 的内容（跳过 frontmatter）
$content = Get-Content $BriefFile -Raw
if ($content -match '(?s)^---.*?---\s*(.*)') {
    $content = $matches[1]
}
$content -split "`n" | Select-Object -First 20 | ForEach-Object { Write-Host $_ }

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 输出结果供 AI 使用
$Result = @{
    brief_file = $BriefFile
    workspace = Get-ActiveWorkspace
}
Write-Host ($Result | ConvertTo-Json -Compress)
