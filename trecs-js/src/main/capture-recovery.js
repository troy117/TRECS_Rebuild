const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { atomicJsonSync } = require('./storage-safety');

function saveRecord(record) {
  const destination = path.join(record.recoveryFolder, 'capture.json');
  atomicJsonSync(destination, record);
}

function readSkippedCaptures(hotFolder) {
  const folder = path.join(hotFolder, 'SkippedCaptures');
  if (!fs.existsSync(folder)) return [];
  return fs.readdirSync(folder, { withFileTypes: true }).filter((item) => item.isDirectory()).flatMap((item) => {
    try { return [JSON.parse(fs.readFileSync(path.join(folder, item.name, 'capture.json'), 'utf8'))]; }
    catch (_) { return []; }
  });
}

function skipCapture(pending, hotFolder) {
  const id = crypto.randomUUID();
  const recoveryFolder = path.join(hotFolder, 'SkippedCaptures', id);
  fs.mkdirSync(recoveryFolder, { recursive: true });
  const record = { ...pending, id, recoveryFolder, skippedAt: new Date().toISOString(), state: 'staged',
    jpgPath: path.join(recoveryFolder, path.basename(pending.sourcePath)) };
  // Persist student/station ownership before touching the JPG. A restart can
  // finish the rename without ever reassigning the photograph to a new student.
  saveRecord(record);
  fs.renameSync(record.sourcePath, record.jpgPath);
  record.state = 'waiting_raw';
  saveRecord(record);
  return record;
}

function collectLateRaw(record, findRaw, isStable) {
  if (record.state === 'staged' && fs.existsSync(record.sourcePath)) {
    fs.renameSync(record.sourcePath, record.jpgPath);
    record.state = 'waiting_raw';
    saveRecord(record);
  }
  if (record.state === 'paired') return false;
  // A camera may reuse a filename. If another JPG is present, leave that RAW
  // to the new pair rather than guessing ownership from its name alone.
  if (fs.existsSync(record.sourcePath)) return false;
  const rawPath = findRaw(record.sourcePath);
  if (!rawPath || !isStable(rawPath)) return false;
  record.rawPath = path.join(record.recoveryFolder, path.basename(rawPath));
  fs.renameSync(rawPath, record.rawPath);
  record.state = 'paired';
  saveRecord(record);
  return true;
}

function shouldWarnMissingRaw(pending, pair, now, isStable) {
  return pending.fileMode !== 'jpg_only' && !pair.rawPath && isStable(pending.sourcePath, 10000)
    && now >= (pending.nextRawWarningAt || pending.queuedAt + 10000);
}

function captureFileIdentity(sourcePath) {
  const stats = fs.statSync(sourcePath);
  return { birthtimeMs: stats.birthtimeMs, ino: stats.ino };
}

function readCaptureQueue(hotFolder) {
  const queuePath = path.join(hotFolder, '.capture-queue.json');
  if (!fs.existsSync(queuePath)) return [];
  const records = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
  if (!Array.isArray(records)) throw new Error('Capture queue recovery file is invalid. Preserve the hot folder and contact support.');
  return records.filter((record) => {
    if (!record || !Number.isSafeInteger(Number(record.jobId)) || !Number.isSafeInteger(Number(record.subjectId))
      || path.resolve(path.dirname(String(record.sourcePath || ''))).toLowerCase() !== path.resolve(hotFolder).toLowerCase()) return false;
    try {
      const current = captureFileIdentity(record.sourcePath);
      return record.sourceIdentity && current.birthtimeMs === record.sourceIdentity.birthtimeMs && current.ino === record.sourceIdentity.ino;
    } catch (_) { return false; }
  });
}

function saveCaptureQueue(hotFolder, records) {
  const queuePath = path.join(hotFolder, '.capture-queue.json');
  atomicJsonSync(queuePath, records);
}

module.exports = { skipCapture, readSkippedCaptures, collectLateRaw, shouldWarnMissingRaw,
  captureFileIdentity, readCaptureQueue, saveCaptureQueue };
