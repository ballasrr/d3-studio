# Сборка D3 в статику для деплоя на общий nginx
#
#   powershell -ExecutionPolicy Bypass -File studio\d3\deploy\package.ps1
#
# На выходе: studio\d3\deploy\d3-site.tar.gz (внутри папка d3/ с готовым сайтом).
# Сайт собирается с basePath=/d3 и живёт по адресу https://<домен>/d3/

param(
  [string]$SiteUrl = "https://shah-hookah-bar.ru",
  [string]$BasePath = "/d3"
)

$ErrorActionPreference = "Stop"
$Project = Split-Path $PSScriptRoot -Parent
Push-Location $Project
try {
  Write-Host "==> static export, basePath=$BasePath, site=$SiteUrl"
  $env:STATIC_EXPORT = "1"
  $env:NEXT_PUBLIC_SITE_URL = $SiteUrl
  npm run build
  if ($LASTEXITCODE -ne 0) { throw "next build failed" }

  if (-not (Test-Path "out\index.html")) { throw "out\index.html not found" }

  $staging = Join-Path $PSScriptRoot "staging"
  Remove-Item $staging -Recurse -Force -ErrorAction SilentlyContinue
  New-Item -ItemType Directory -Force -Path (Join-Path $staging "d3") | Out-Null
  Copy-Item "out\*" (Join-Path $staging "d3") -Recurse -Force

  $archive = Join-Path $PSScriptRoot "d3-site.tar.gz"
  Remove-Item $archive -Force -ErrorAction SilentlyContinue
  tar -czf $archive -C $staging d3
  if ($LASTEXITCODE -ne 0) { throw "tar failed" }
  Remove-Item $staging -Recurse -Force -ErrorAction SilentlyContinue

  $size = [math]::Round((Get-Item $archive).Length / 1MB, 2)
  Write-Host "==> ready: $archive ($size MB)"
  Write-Host "==> git deploy (preferred): ssh root@<server> 'bash /var/www/d3-site/deploy/server-deploy.sh'"
  Write-Host "==> archive deploy: scp d3-site.tar.gz deploy-d3.sh nginx-d3.sh root@<server>:/tmp/ ; ssh root@<server> 'bash /tmp/deploy-d3.sh shah-hookah-bar.ru /tmp/d3-site.tar.gz'"
}
finally {
  Pop-Location
  Remove-Item Env:STATIC_EXPORT -ErrorAction SilentlyContinue
  Remove-Item Env:NEXT_PUBLIC_SITE_URL -ErrorAction SilentlyContinue
}
