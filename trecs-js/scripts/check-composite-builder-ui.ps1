$ErrorActionPreference = 'Stop'
$env:ELECTRON_RUN_AS_NODE = $null
$env:TRECS_UI_TEST = '1'
& "$PSScriptRoot\..\node_modules\.bin\electron.cmd" "$PSScriptRoot\check-composite-builder-ui.js"
exit $LASTEXITCODE
