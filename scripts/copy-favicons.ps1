# Copiar favicons desde DATOS/favicomatic a images/favicomatic
# Uso: Ejecutar desde la raíz del proyecto en Powershell:
#    .\scripts\copy-favicons.ps1

$source = "DATOS\favicomatic"
$dest = "images\favicomatic"

if (-not (Test-Path $source)) {
    Write-Error "Directorio fuente no encontrado: $source"
    exit 1
}

if (-not (Test-Path $dest)) {
    New-Item -ItemType Directory -Path $dest | Out-Null
}

Get-ChildItem -Path $source -File | ForEach-Object {
    $srcFile = $_.FullName
    $destFile = Join-Path $dest $_.Name
    Copy-Item -Path $srcFile -Destination $destFile -Force
    Write-Output "Copied: $($_.Name)"
}

Write-Output "Favicons copied to: $dest"