const fs = require('fs');
const path = require('path');

const required = [
  'src/main/entry.js',
  'src/main/calibration-service.js',
  'src/main/headsizing-worker.mjs',
  'src/renderer/crop-calibration.js',
  'src/main/main.js',
  'src/main/portable-updater.js',
  'src/preload/preload.js',
  'src/renderer/index.html',
  'src/renderer/styles.css',
  'src/renderer/renderer.js',
  'scripts/publish-lab-update.js'
];

let missing = 0;
for (const file of required) {
  const fullPath = path.join(__dirname, '..', file);
  if (!fs.existsSync(fullPath)) {
    console.error(`Missing ${file}`);
    missing++;
  }
}

if (missing > 0) {
  process.exit(1);
}

console.log('TRECS JS prototype files OK');
