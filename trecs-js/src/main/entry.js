// One TRECS application; optional local-only calibration launch bypasses job/server initialization.
if (process.argv.includes('--crop-calibration')) require('./calibration-only');
else require('./main');
