Remove-Item Env:ELECTRON_RUN_AS_NODE -ErrorAction SilentlyContinue
& "$PSScriptRoot\..\node_modules\.bin\electron.cmd" "$PSScriptRoot\.."
