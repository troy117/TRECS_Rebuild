$ErrorActionPreference = 'Stop'
$env:ELECTRON_RUN_AS_NODE = $null
$env:TRECS_UI_TEST = '1'
& "$PSScriptRoot\..\node_modules\.bin\electron.cmd" "$PSScriptRoot\check-id-card-render-ui.js"
exit $LASTEXITCODE
