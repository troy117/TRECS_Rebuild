$ErrorActionPreference = 'Stop'
$env:ELECTRON_RUN_AS_NODE = $null
& "$PSScriptRoot\..\node_modules\.bin\electron.cmd" "$PSScriptRoot\check-eod-roundtrip.js"
$testExitCode = $LASTEXITCODE
$resultPath = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..\..\exports\_eod-roundtrip-result.json'))
if (Test-Path -LiteralPath $resultPath) {
  $result = Get-Content -LiteralPath $resultPath -Raw | ConvertFrom-Json
  $result | ConvertTo-Json -Depth 8
  if ($result.ok -and $result.fixtureRoot) {
    $allowedParent = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..\..\exports'))
    $fixturePath = [IO.Path]::GetFullPath($result.fixtureRoot)
    if ((Test-Path -LiteralPath $fixturePath) -and [IO.Path]::GetDirectoryName($fixturePath) -eq $allowedParent -and [IO.Path]::GetFileName($fixturePath).StartsWith('_eod-roundtrip-')) {
      Remove-Item -LiteralPath $fixturePath -Recurse -Force
    }
  }
}
exit $testExitCode
