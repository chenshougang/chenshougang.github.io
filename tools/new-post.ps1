<#
.SYNOPSIS
    快速新建一篇博客文章，并自动更新文章索引。

.DESCRIPTION
    在 articles/ 目录下生成带 front matter 的 Markdown 模板，自动分配 id / slug / 日期，
    随后调用 build-posts.ps1 更新 js/posts.js。

.PARAMETER Title
    文章标题（必填）。

.PARAMETER Tags
    标签，多个用逗号分隔，例如 "C++, 并发编程"。

.PARAMETER Slug
    文章别名（用于链接和文件名），默认根据标题生成。

.PARAMETER Date
    发布日期，默认今天，格式 yyyy-MM-dd。

.PARAMETER Excerpt
    卡片摘要，留空则由正文首段自动生成。

.PARAMETER Folder
    文章子目录（如 boost），默认放在 articles/ 根目录。

.PARAMETER NoBuild
    只创建文件，不运行索引生成。

.EXAMPLE
    .\tools\new-post.ps1 -Title "C++ 内存模型" -Tags "C++, 并发编程"

.EXAMPLE
    .\tools\new-post.ps1 -Title "Boost.Asio 深入" -Tags "C++" -Folder boost
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory = $true, Position = 0)]
    [string]$Title,

    [string]$Tags = '',
    [string]$Slug = '',
    [string]$Date = '',
    [string]$Excerpt = '',
    [string]$Folder = '',
    [switch]$NoBuild
)

$ErrorActionPreference = 'Stop'

$Root = Split-Path -Parent $PSScriptRoot
$articlesDir = Join-Path $Root 'articles'

function Get-Slug {
    param([string]$Value)
    $s = $Value.Trim().ToLowerInvariant()
    $s = $s -replace '\s+', '-'
    $s = $s -replace '[^\w\u4e00-\u9fa5\-]', ''
    $s = $s -replace '-{2,}', '-'
    $s = $s.Trim('-')
    if ([string]::IsNullOrWhiteSpace($s)) { $s = 'post' }
    return $s
}

$Title = $Title.Trim()
if ([string]::IsNullOrWhiteSpace($Title)) {
    throw '文章标题不能为空'
}

# 日期
$publishDate = Get-Date
if (-not [string]::IsNullOrWhiteSpace($Date)) {
    $parsedDate = [datetime]::MinValue
    if (-not [datetime]::TryParse($Date, [ref]$parsedDate)) {
        throw "日期格式无法识别: $Date（示例：2025-11-09）"
    }
    $publishDate = $parsedDate
}

# 目录
$targetDir = $articlesDir
if (-not [string]::IsNullOrWhiteSpace($Folder)) {
    $safeFolder = $Folder.Trim().Trim('\', '/')
    if ($safeFolder -match '\.\.' -or [System.IO.Path]::IsPathRooted($safeFolder)) {
        throw "子目录不合法: $Folder"
    }
    $targetDir = Join-Path $articlesDir $safeFolder
}
if (-not (Test-Path -LiteralPath $targetDir)) {
    New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
}

# slug 与文件名去重
$baseSlug = Get-Slug $(if ([string]::IsNullOrWhiteSpace($Slug)) { $Title } else { $Slug })
$finalSlug = $baseSlug
$filePath = Join-Path $targetDir ($finalSlug + '.md')
$counter = 2
while (Test-Path -LiteralPath $filePath) {
    $finalSlug = "$baseSlug-$counter"
    $filePath = Join-Path $targetDir ($finalSlug + '.md')
    $counter++
}

# 计算下一个 id
$maxId = 0
if (Test-Path -LiteralPath $articlesDir) {
    $mdFiles = Get-ChildItem -LiteralPath $articlesDir -Recurse -File -Filter '*.md'
    foreach ($md in $mdFiles) {
        $text = [System.IO.File]::ReadAllText($md.FullName, [System.Text.Encoding]::UTF8)
        foreach ($m in [regex]::Matches($text, '(?m)^id\s*:\s*(\d+)\s*$')) {
            $value = [int]$m.Groups[1].Value
            if ($value -gt $maxId) { $maxId = $value }
        }
    }
}
$newId = $maxId + 1

# 标签
$tagList = @()
if (-not [string]::IsNullOrWhiteSpace($Tags)) {
    $trimmed = $Tags.Trim().TrimStart('[').TrimEnd(']')
    $tagList = $trimmed -split '[,，]' | ForEach-Object { $_.Trim().Trim('"', "'") } | Where-Object { $_ -ne '' }
}

$lines = New-Object System.Collections.Generic.List[string]
$lines.Add('---')
$lines.Add('id: ' + $newId)
$lines.Add('slug: ' + $finalSlug)
$lines.Add('title: ' + $Title)
$lines.Add('date: ' + $publishDate.ToString('yyyy-MM-dd'))
$lines.Add('tags: [' + (($tagList | ForEach-Object { $_ }) -join ', ') + ']')
if (-not [string]::IsNullOrWhiteSpace($Excerpt)) {
    $lines.Add('excerpt: ' + $Excerpt.Trim())
}
$lines.Add('---')
$lines.Add('')
$lines.Add('<!-- 正文从这里开始，标题与摘要已在上方 front matter 中定义 -->')
$lines.Add('')
$lines.Add('在这里开始写作……')
$lines.Add('')

[System.IO.File]::WriteAllText($filePath, ($lines -join "`r`n"), (New-Object System.Text.UTF8Encoding($false)))

Write-Host ''
Write-Host '已创建文章:' -ForegroundColor Green
Write-Host ('  ' + $filePath)
Write-Host ('  id={0}  slug={1}  date={2}' -f $newId, $finalSlug, $publishDate.ToString('yyyy-MM-dd'))

if (-not $NoBuild) {
    Write-Host ''
    & (Join-Path $PSScriptRoot 'build-posts.ps1') -Root $Root
}
