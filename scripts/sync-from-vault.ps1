# Sync articles from Obsidian vault to Eleventy src/
# - English articles → src/en/posts/
# - Japanese articles (*.ja.md) → src/ja/posts/ (suffix stripped)
# - Chinese articles (*.zh.md) → src/zh/posts/ (suffix stripped)
# - Only files explicitly moved into a topic's shipped/ folder are published
# - Existing src posts are preserved so retired shelf entries keep their URLs

$ErrorActionPreference = "Stop"

$vaultRoot = if ($env:BR_OS_VAULT) {
  $env:BR_OS_VAULT
} else {
  "D:\Obsidian\br-os-vault"
}
$vaultSources = @(
  "$vaultRoot\4 BuildInPublic\bright-raven-world\blog\philosophy-gaming\shipped",
  "$vaultRoot\4 BuildInPublic\bright-raven-world\blog\philosophy-agents\shipped"
)
$enDest = "$PSScriptRoot\..\src\en\posts"
$jaDest = "$PSScriptRoot\..\src\ja\posts"
$zhDest = "$PSScriptRoot\..\src\zh\posts"

foreach ($source in $vaultSources) {
  if (-not (Test-Path -LiteralPath $source -PathType Container)) {
    throw "Published-post folder not found: $source"
  }
}

# Deleting a published route is a separate action. Sync only adds or updates
# approved posts.
foreach ($dest in @($enDest, $jaDest, $zhDest)) {
  if (-not (Test-Path $dest)) {
    New-Item -ItemType Directory -Force -Path $dest | Out-Null
  }
}

$enCount = 0
$jaCount = 0
$zhCount = 0
$publishedNames = @{}

Get-ChildItem -LiteralPath $vaultSources -Filter "*.md" -File | ForEach-Object {
  $name = $_.Name
  if ($name -like "*.ja.md") {
    $newName = $name -replace "\.ja\.md$", ".md"
    $destination = "$jaDest\$newName"
    $jaCount++
  } elseif ($name -like "*.zh.md") {
    $newName = $name -replace "\.zh\.md$", ".md"
    $destination = "$zhDest\$newName"
    $zhCount++
  } else {
    $destination = "$enDest\$name"
    $enCount++
  }

  if ($publishedNames.ContainsKey($destination)) {
    throw "Duplicate published destination: $destination"
  }
  $publishedNames[$destination] = $_.FullName
  Copy-Item -LiteralPath $_.FullName -Destination $destination -Force
}

Write-Host ""
Write-Host "Sync complete." -ForegroundColor Green
Write-Host "  English posts: $enCount"
Write-Host "  Japanese posts: $jaCount"
Write-Host "  Chinese posts: $zhCount"
Write-Host ""
