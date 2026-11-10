<#
.SYNOPSIS
    扫描 articles 目录下的 Markdown 文章，自动生成 js/posts.js 文章索引。

.DESCRIPTION
    文章元信息写在 Markdown 文件的 front matter 中（--- 包裹）。未提供 front matter 时：
      - 标题取第一个 # 标题，摘要取正文首段，日期取文件名前缀或文件修改时间。
    生成的 posts.js 请勿手动编辑。

.PARAMETER Root
    项目根目录，默认为脚本上一级目录。

.EXAMPLE
    powershell -ExecutionPolicy Bypass -File tools\build-posts.ps1
#>
[CmdletBinding()]
param(
    [string]$Root
)

$ErrorActionPreference = 'Stop'

if ([string]::IsNullOrWhiteSpace($Root)) {
    $Root = Split-Path -Parent $PSScriptRoot
}

$articlesDir = Join-Path $Root 'articles'
$outputFile = Join-Path $Root 'js\posts.js'

if (-not (Test-Path -LiteralPath $articlesDir)) {
    throw "找不到文章目录: $articlesDir"
}

function ConvertTo-JsString {
    param([string]$Value)
    if ($null -eq $Value) { $Value = '' }
    $v = $Value -replace '\\', '\\\\'
    $v = $v -replace '"', '\"'
    $v = $v -replace "`r?`n", ' '
    $v = $v -replace "`t", ' '
    return '"' + $v + '"'
}

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

function Get-PlainText {
    param([string]$Markdown)
    $text = $Markdown
    $text = $text -replace '(?s)```.*?```', ' '
    $text = $text -replace '!\[[^\]]*\]\([^)]*\)', ' '
    $text = $text -replace '\[([^\]]*)\]\([^)]*\)', '$1'
    $text = $text -replace '<[^>]+>', ' '
    $text = $text -replace '[*_~`#>]', ' '
    $text = $text -replace '\s+', ' '
    return $text.Trim()
}

function Get-Excerpt {
    param([string]$Body)

    $lines = $Body -split "`n"
    $paragraph = ''
    $inFence = $false

    foreach ($line in $lines) {
        $t = $line.Trim()

        if ($t -match '^```') {
            $inFence = -not $inFence
            if ($paragraph) { break }
            continue
        }
        if ($inFence) { continue }

        if ($t -eq '') {
            if ($paragraph) { break }
            continue
        }
        if ($t -match '^#{1,6}\s') {
            if ($paragraph) { break }
            continue
        }
        if ($t -match '^([-*+]\s|\d+\.\s|>|\||<)') { continue }

        $paragraph += $t
        if ($paragraph.Length -ge 120) { break }
    }

    $plain = Get-PlainText $paragraph
    if ($plain.Length -gt 90) {
        $plain = $plain.Substring(0, 90) + '…'
    }
    return $plain
}

$files = Get-ChildItem -LiteralPath $articlesDir -Recurse -File -Filter '*.md' |
    Where-Object { $_.Name -notlike '_*' }

$entries = New-Object System.Collections.Generic.List[object]

foreach ($file in $files) {
    $text = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    $text = $text -replace "`r`n", "`n"
    $text = $text.TrimStart([char]0xFEFF)

    $data = @{}
    $body = $text

    if ($text -match '(?s)\A---[ \t]*\n(.*?)\n---[ \t]*\n?') {
        $frontMatter = $matches[1]
        $body = $text.Substring($matches[0].Length)

        foreach ($line in ($frontMatter -split "`n")) {
            if ($line -match '^\s*([A-Za-z][\w-]*)\s*:\s*(.*)$') {
                $key = $matches[1].ToLowerInvariant()
                $value = $matches[2].Trim()
                if ($value.Length -ge 2) {
                    $first = $value.Substring(0, 1)
                    $last = $value.Substring($value.Length - 1, 1)
                    if (($first -eq '"' -and $last -eq '"') -or ($first -eq "'" -and $last -eq "'")) {
                        $value = $value.Substring(1, $value.Length - 2)
                    }
                }
                $data[$key] = $value
            }
        }
    }

    $title = ''
    if ($data.ContainsKey('title')) { $title = $data['title'] }
    if ([string]::IsNullOrWhiteSpace($title)) {
        $heading = [regex]::Match($body, '(?m)^#\s+(.+?)\s*$')
        if ($heading.Success) { $title = $heading.Groups[1].Value.Trim() }
    }
    if ([string]::IsNullOrWhiteSpace($title)) { $title = $file.BaseName }

    $excerpt = ''
    if ($data.ContainsKey('excerpt')) { $excerpt = $data['excerpt'] }
    if ([string]::IsNullOrWhiteSpace($excerpt)) { $excerpt = Get-Excerpt $body }
    if ([string]::IsNullOrWhiteSpace($excerpt)) { $excerpt = $title }

    $date = $null
    if ($data.ContainsKey('date') -and $data['date']) {
        $parsed = [datetime]::MinValue
        $formats = @('yyyy-MM-dd', 'yyyy/M/d', 'yyyy.MM.dd', 'yyyyMMdd')
        if ([datetime]::TryParseExact($data['date'], $formats, [System.Globalization.CultureInfo]::InvariantCulture, [System.Globalization.DateTimeStyles]::None, [ref]$parsed)) {
            $date = $parsed
        } else {
            $parsed2 = [datetime]::MinValue
            if ([datetime]::TryParse($data['date'], [ref]$parsed2)) { $date = $parsed2 }
        }
    }
    if ($null -eq $date) {
        $nameMatch = [regex]::Match($file.BaseName, '^(\d{4}-\d{2}-\d{2})')
        if ($nameMatch.Success) {
            $date = [datetime]::ParseExact($nameMatch.Groups[1].Value, 'yyyy-MM-dd', [System.Globalization.CultureInfo]::InvariantCulture)
        } else {
            $date = $file.LastWriteTime.Date
        }
    }

    $tags = @()
    if ($data.ContainsKey('tags') -and $data['tags']) {
        $rawTags = $data['tags'].Trim()
        $rawTags = $rawTags.TrimStart('[').TrimEnd(']')
        $tags = $rawTags -split '[,，]' | ForEach-Object { $_.Trim().Trim('"', "'") } | Where-Object { $_ -ne '' }
    }

    $slug = ''
    if ($data.ContainsKey('slug')) { $slug = $data['slug'] }
    if ([string]::IsNullOrWhiteSpace($slug)) { $slug = $file.BaseName }
    $slug = Get-Slug $slug

    $id = 0
    if ($data.ContainsKey('id') -and $data['id']) {
        [void][int]::TryParse($data['id'], [ref]$id)
    }

    $relative = $file.FullName.Substring($Root.Length).TrimStart('\', '/') -replace '\\', '/'
    $filePath = '../' + $relative

    $cover = ''
    if ($data.ContainsKey('cover')) { $cover = $data['cover'] }

    $entries.Add([pscustomobject]@{
        id      = $id
        slug    = $slug
        title   = $title
        excerpt = $excerpt
        date    = $date
        tags    = $tags
        file    = $filePath
        cover   = $cover
    })
}

# 按日期倒序（最新在前）
$sorted = $entries | Sort-Object -Property @{ Expression = { $_.date }; Descending = $true }, @{ Expression = { $_.slug }; Descending = $false }

# slug 去重
$usedSlugs = @{}
foreach ($entry in $sorted) {
    $baseSlug = $entry.slug
    $candidate = $baseSlug
    $index = 2
    while ($usedSlugs.ContainsKey($candidate)) {
        $candidate = "$baseSlug-$index"
        $index++
    }
    $entry.slug = $candidate
    $usedSlugs[$candidate] = $true
}

# id 处理：保留显式 id，缺失或重复时分配新 id
$maxId = 0
foreach ($entry in $sorted) {
    if ($entry.id -gt $maxId) { $maxId = $entry.id }
}

$usedIds = @{}
$nextId = $maxId + 1
foreach ($entry in $sorted) {
    if ($entry.id -gt 0 -and -not $usedIds.ContainsKey($entry.id)) {
        $usedIds[$entry.id] = $true
    } else {
        while ($usedIds.ContainsKey($nextId)) { $nextId++ }
        $entry.id = $nextId
        $usedIds[$nextId] = $true
        $nextId++
    }
}

$lines = New-Object System.Collections.Generic.List[string]
$lines.Add('/**')
$lines.Add(' * 文章索引（自动生成，请勿手动编辑）')
$lines.Add(' *')
$lines.Add(' * 写文章：')
$lines.Add(' *   1. 在 articles/ 下新建 Markdown 文件（可用 tools/new-post.ps1 生成模板）')
$lines.Add(' *   2. 在文件头部的 front matter 中填写 id / slug / title / date / tags / excerpt')
$lines.Add(' *   3. 运行 tools/build-posts.ps1 重新生成本文件')
$lines.Add(' *')
$lines.Add(' * front matter 示例：')
$lines.Add(' *   ---')
$lines.Add(' *   id: 6')
$lines.Add(' *   slug: my-post')
$lines.Add(' *   title: 我的文章')
$lines.Add(' *   date: 2025-11-09')
$lines.Add(' *   tags: [C++, 并发编程]')
$lines.Add(' *   excerpt: 一句话摘要')
$lines.Add(' *   ---')
$lines.Add(' */')
$lines.Add('')
$lines.Add('const posts = [')

$count = $sorted.Count
for ($i = 0; $i -lt $count; $i++) {
    $entry = $sorted[$i]
    $tagText = ''
    if ($entry.tags.Count -gt 0) {
        $tagText = ($entry.tags | ForEach-Object { ConvertTo-JsString $_ }) -join ', '
    }
    $lines.Add('    {')
    $lines.Add('        id: ' + $entry.id + ',')
    $lines.Add('        slug: ' + (ConvertTo-JsString $entry.slug) + ',')
    $lines.Add('        title: ' + (ConvertTo-JsString $entry.title) + ',')
    $lines.Add('        excerpt: ' + (ConvertTo-JsString $entry.excerpt) + ',')
    $lines.Add('        date: ' + (ConvertTo-JsString $entry.date.ToString('yyyy-MM-dd')) + ',')
    $lines.Add('        tags: [' + $tagText + '],')
    $lines.Add('        file: ' + (ConvertTo-JsString $entry.file) + $(if ($entry.cover) { ',' } else { '' }))
    if ($entry.cover) {
        $lines.Add('        cover: ' + (ConvertTo-JsString $entry.cover))
    }
    $lines.Add('    }' + $(if ($i -lt $count - 1) { ',' } else { '' }))
}
$lines.Add('];')
$lines.Add('')

[System.IO.File]::WriteAllText($outputFile, ($lines -join "`r`n"), (New-Object System.Text.UTF8Encoding($false)))

Write-Host ("已生成文章索引: {0}" -f $outputFile) -ForegroundColor Green
Write-Host ("共 {0} 篇文章" -f $count)
foreach ($entry in $sorted) {
    Write-Host ("  [{0}] {1}  ({2})" -f $entry.id, $entry.title, $entry.date.ToString('yyyy-MM-dd'))
}
