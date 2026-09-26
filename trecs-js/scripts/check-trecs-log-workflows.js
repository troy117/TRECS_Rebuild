const fs = require('fs');
const path = require('path');

const mainPath = path.join(__dirname, '..', 'src', 'main', 'main.js');
const source = fs.readFileSync(mainPath, 'utf8');

function functionSource(name, nextName) {
  const start = source.indexOf(`async function ${name}`);
  const end = source.indexOf(`async function ${nextName}`, start + 1);
  if (start < 0 || end < 0) {
    throw new Error(`Could not locate ${name} for TRECS Log verification`);
  }
  return source.slice(start, end);
}

const cameraCards = functionSource('renderAdminItem', 'renderSubjectIdCard');
const previousTrecs = functionSource('importPreviousTrecsJob', 'loadOnsiteSetups');

const checks = {
  cameraCardsEvent: cameraCards.includes("queueTrecsLogEvent('CAMERA_CARDS.CREATED'"),
  cameraCardsAfterSnapshot: cameraCards.indexOf("queueTrecsLogEvent('CAMERA_CARDS.CREATED'")
    > cameraCards.indexOf('writeJobDatabaseSnapshot(jobId)'),
  cameraCardsContext: ['jobId:', 'schoolName:', 'studentCount:', 'fileCount:', 'destinationLocation:']
    .every((field) => cameraCards.includes(field)),
  previousTrecsEvent: previousTrecs.includes("queueTrecsLogEvent('JOB.PREVIOUS_TRECS_IMPORTED'"),
  previousTrecsAfterSnapshot: previousTrecs.indexOf("queueTrecsLogEvent('JOB.PREVIOUS_TRECS_IMPORTED'")
    > previousTrecs.indexOf('writeJobDatabaseSnapshot(result.id)'),
  previousTrecsContext: ['jobId:', 'schoolName:', 'studentCount:', 'imageCount:', 'sourceLocation:', 'destinationLocation:']
    .every((field) => previousTrecs.includes(field))
};

if (Object.values(checks).some((passed) => !passed)) {
  console.error(JSON.stringify(checks, null, 2));
  process.exit(1);
}

console.log(JSON.stringify(checks, null, 2));
