# Sync articles from Obsidian vault to Eleventy src/
# - English articles → src/en/posts/
# - Chinese articles (*.zh.md) → src/zh/posts/ (suffix stripped)
# - Excludes: dashboards, drafts, group overviews (for now), index

$ErrorActionPreference = "Stop"

$vault = "D:\Obsidian\br-os-vault\4 BuildInPublic\bright-raven-world\blog\brightraven.world"
$enDest = "$PSScriptRoot\..\src\en\posts"
$jaDest = "$PSScriptRoot\..\src\ja\posts"
$zhDest = "$PSScriptRoot\..\src\zh\posts"

if (-not (Test-Path $vault)) {
  Write-Error "Vault not found at: $vault"
  exit 1
}

# Ensure destinations exist and are clean
foreach ($dest in @($enDest, $jaDest, $zhDest)) {
  if (-not (Test-Path $dest)) {
    New-Item -ItemType Directory -Force -Path $dest | Out-Null
  }
  Get-ChildItem -Path $dest -Filter "*.md" | Remove-Item -Force
}

# Patterns to exclude entirely
$excludePatterns = @(
  "_*",                        # _progress.md, _superlinear-test-post.md
  "Untitled.md",
  "00-index.md",
  "*-research.md",
  "A-00-*", "B-00-*", "C-00-*",
  "D-00-*", "E-00-*", "F-00-*"  # group overviews (English only, defer)
)

$enCount = 0
$jaCount = 0
$zhCount = 0
$skipped = 0

Get-ChildItem -Path $vault -Filter "*.md" -File | ForEach-Object {
  $name = $_.Name
  $skip = $false

  foreach ($pattern in $excludePatterns) {
    if ($name -like $pattern) {
      $skip = $true
      break
    }
  }

  if ($skip) {
    $skipped++
    return
  }

  if ($name -like "*.ja.md") {
    $newName = $name -replace "\.ja\.md$", ".md"
    Copy-Item -Path $_.FullName -Destination "$jaDest\$newName" -Force
    $jaCount++
  } elseif ($name -like "*.zh.md") {
    $newName = $name -replace "\.zh\.md$", ".md"
    Copy-Item -Path $_.FullName -Destination "$zhDest\$newName" -Force
    $zhCount++
  } else {
    Copy-Item -Path $_.FullName -Destination "$enDest\$name" -Force
    $enCount++
  }
}

Write-Host ""
Write-Host "Sync complete." -ForegroundColor Green
Write-Host "  English posts: $enCount"
Write-Host "  Japanese posts: $jaCount"
Write-Host "  Chinese posts: $zhCount"
Write-Host "  Skipped:       $skipped"
Write-Host ""
