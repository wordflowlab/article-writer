#!/usr/bin/env pwsh
# 通用函数库 - Article Writer (PowerShell)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Get-ProjectRoot {
    $current = (Get-Location).Path
    while ($true) {
        $cfg = Join-Path $current ".specify/config.json"
        if (Test-Path $cfg) { return $current }
        $parent = Split-Path $current -Parent
        if (-not $parent -or $parent -eq $current) { break }
        $current = $parent
    }
    throw "未找到 article-writer 项目根目录（缺少 .specify/config.json）"
}

function Get-CurrentWorkspace {
    $root = Get-ProjectRoot
    $workspaces = Join-Path $root "workspaces"
    if (-not (Test-Path $workspaces)) { return $null }
    $dirs = Get-ChildItem -Path $workspaces -Directory | Sort-Object LastWriteTime -Descending
    if ($dirs.Count -gt 0) { return $dirs[0].FullName }
    return $null
}

function Get-ActiveWorkspace {
    $workspaceDir = Get-CurrentWorkspace
    if ($workspaceDir) {
        return Split-Path $workspaceDir -Leaf
    }
    # 如果没有工作区，返回默认名称
    return "general"
}

function Get-LatestBrief {
    $root = Get-ProjectRoot
    $briefsDir = Join-Path $root "_briefs"
    if (-not (Test-Path $briefsDir)) { return $null }
    $briefs = Get-ChildItem -Path $briefsDir -Filter "*.md" | Sort-Object LastWriteTime -Descending
    if ($briefs.Count -gt 0) { return $briefs[0].FullName }
    return $null
}

function Get-LatestDraft {
    $workspaceDir = Get-CurrentWorkspace
    if (-not $workspaceDir) { return $null }
    $drafts = Get-ChildItem -Path $workspaceDir -Filter "*draft.md" -Recurse | Sort-Object LastWriteTime -Descending
    if ($drafts.Count -gt 0) { return $drafts[0].FullName }
    return $null
}

function Count-ChineseWords {
    param([string]$FilePath)

    if (-not (Test-Path $FilePath)) {
        return 0
    }

    $content = Get-Content $FilePath -Raw -Encoding UTF8

    # 移除 Markdown 标记和格式符号
    $content = $content -replace '```[\s\S]*?```', ''  # 代码块
    $content = $content -replace '^#+\s+', '', 'Multiline'  # 标题
    $content = $content -replace '\*\*', ''  # 粗体
    $content = $content -replace '__', ''  # 粗体
    $content = $content -replace '\*', ''  # 斜体
    $content = $content -replace '_', ''  # 斜体
    $content = $content -replace '\[', ''  # 链接
    $content = $content -replace '\]', ''  # 链接
    $content = $content -replace '\(http[^\)]*\)', ''  # URL
    $content = $content -replace '^\>\s+', '', 'Multiline'  # 引用
    $content = $content -replace '^\s*[-\*]\s+', '', 'Multiline'  # 列表
    $content = $content -replace '^\s*\d+\.\s+', '', 'Multiline'  # 有序列表
    $content = $content -replace '[\s\p{P}]', ''  # 空格和标点

    return $content.Length
}

# 输出 JSON（用于与 AI 助手通信）
function Write-JsonOutput {
    param([hashtable]$Data)
    Write-Host ($Data | ConvertTo-Json -Compress)
}
