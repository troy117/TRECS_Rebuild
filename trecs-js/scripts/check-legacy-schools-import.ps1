$ErrorActionPreference = 'Stop'
$env:ELECTRON_RUN_AS_NODE = $null
$env:TRECS_UI_TEST = '1'
& "$PSScriptRoot\..\node_modules\.bin\electron.cmd" "$PSScriptRoot\check-legacy-schools-import.js"
$exitCode = $LASTEXITCODE
$resultPath = Join-Path $PSScriptRoot '..\..\exports\_legacy-schools-import-smoke-result.json'
if (Test-Path -LiteralPath $resultPath) {
  Get-Content -LiteralPath $resultPath
  Remove-Item -LiteralPath $resultPath -Force
}
$workspaceRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..\..'))
$allowedParent = [IO.Path]::GetFullPath((Join-Path $workspaceRoot 'exports'))
$temporaryRoot = [IO.Path]::GetFullPath((Join-Path $allowedParent '_legacy-schools-import-smoke'))
if ([IO.Path]::GetDirectoryName($temporaryRoot) -eq $allowedParent -and [IO.Path]::GetFileName($temporaryRoot) -eq '_legacy-schools-import-smoke' -and (Test-Path -LiteralPath $temporaryRoot)) {
  Remove-Item -LiteralPath $temporaryRoot -Recurse -Force
}
exit $exitCode
