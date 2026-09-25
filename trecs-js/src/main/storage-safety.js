// File-backed sql.js storage: never truncate a live database, retain bounded
// recovery copies, and keep camera originals until metadata is durable.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const backupTimes = new Map();
const backupFolder = (filePath) => path.join(path.dirname(filePath), '.backups', path.basename(filePath));

function listDatabaseBackups(filePath) {
  const folder = backupFolder(filePath);
  if (!fs.existsSync(folder)) return [];
  return fs.readdirSync(folder).filter((name) => name.endsWith('.db')).map((name) => {
    const backupPath = path.join(folder, name);
    const stat = fs.statSync(backupPath);
    return { path: backupPath, name, size: stat.size, createdAt: stat.mtime.toISOString() };
  }).sort((a, b) => b.name.localeCompare(a.name));
}

async function atomicWriteFile(filePath, bytes, options = {}) {
  const destination = path.resolve(filePath);
  await fs.promises.mkdir(path.dirname(destination), { recursive: true });
  const temporary = `${destination}.${crypto.randomUUID()}.tmp`;
  let handle;
  try {
    handle = await fs.promises.open(temporary, 'wx');
    await handle.writeFile(bytes);
    await handle.sync();
    await handle.close();
    handle = null;
    if (options.backup && Date.now() - (backupTimes.get(destination) || 0) >= (options.backupIntervalMs ?? 300000)) {
      try {
        await fs.promises.mkdir(backupFolder(destination), { recursive: true });
        const name = `${new Date().toISOString().replace(/[:.]/g, '-')}-${crypto.randomUUID()}.db`;
        const backupPath = path.join(backupFolder(destination), name);
        await fs.promises.copyFile(destination, backupPath, fs.constants.COPYFILE_EXCL);
        const backup = await fs.promises.open(backupPath, 'r+');
        try { await backup.sync(); } finally { await backup.close(); }
        backupTimes.set(destination, Date.now());
        for (const older of listDatabaseBackups(destination).slice(options.keepBackups ?? 12)) {
          await fs.promises.unlink(older.path);
        }
      } catch (error) {
        if (error.code !== 'ENOENT') throw error;
      }
    }
    // On Windows/SMB an open reader may briefly prevent replace. Do not fall
    // back to delete-then-rename: the original must survive any failed save.
    for (let attempt = 0; ; attempt += 1) {
      try { await fs.promises.rename(temporary, destination); break; }
      catch (error) {
        if (!['EPERM', 'EACCES', 'EBUSY'].includes(error.code) || attempt >= 5) throw error;
        await new Promise((resolve) => setTimeout(resolve, 40 * (attempt + 1)));
      }
    }
  } finally {
    if (handle) await handle.close();
    await fs.promises.unlink(temporary).catch((error) => { if (error.code !== 'ENOENT') throw error; });
  }
}

function fileSignature(filePath) {
  const stat = fs.statSync(filePath, { bigint: true });
  return `${stat.size}:${stat.mtimeNs}:${stat.ctimeNs}:${stat.ino}`;
}

function atomicJsonSync(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const temporary = `${filePath}.${crypto.randomUUID()}.tmp`;
  let fd;
  try {
    fd = fs.openSync(temporary, 'wx');
    fs.writeFileSync(fd, JSON.stringify(value, null, 2));
    fs.fsyncSync(fd);
    fs.closeSync(fd);
    fd = null;
    fs.renameSync(temporary, filePath);
  } finally {
    if (fd != null) fs.closeSync(fd);
    if (fs.existsSync(temporary)) fs.unlinkSync(temporary);
  }
}

function fingerprint(filePath) {
  const before = fileSignature(filePath);
  const hash = crypto.createHash('sha256');
  const buffer = Buffer.allocUnsafe(1024 * 1024);
  const fd = fs.openSync(filePath, 'r');
  let size = 0;
  try {
    let read;
    while ((read = fs.readSync(fd, buffer, 0, buffer.length, null)) > 0) {
      hash.update(buffer.subarray(0, read));
      size += read;
    }
  } finally { fs.closeSync(fd); }
  if (!size || before !== fileSignature(filePath)) throw new Error(`Image is empty or still changing: ${path.basename(filePath)}`);
  return { size, sha256: hash.digest('hex') };
}

function matches(filePath, expected) {
  try { const actual = fingerprint(filePath); return actual.size === expected.size && actual.sha256 === expected.sha256; }
  catch (_) { return false; }
}

async function fingerprintAsync(filePath) {
  const before = fileSignature(filePath);
  const hash = crypto.createHash('sha256');
  let size = 0;
  for await (const chunk of fs.createReadStream(filePath)) { hash.update(chunk); size += chunk.length; }
  if (!size || before !== fileSignature(filePath)) throw new Error(`Image is empty or still changing: ${path.basename(filePath)}`);
  return { size, sha256: hash.digest('hex') };
}

async function stageImageFilesAsync(databasePath, files) {
  const journalPath = path.join(path.dirname(databasePath), 'pending-image-imports', `${crypto.randomUUID()}.json`);
  const journal = { version: 1, databasePath: path.resolve(databasePath), phase: 'copying', files: [] };
  atomicJsonSync(journalPath, journal);
  try {
    for (const file of files) {
      const sourcePath = path.resolve(file.sourcePath);
      const destinationPath = path.resolve(file.destinationPath);
      if (sourcePath === destinationPath) throw new Error('Camera source and destination must differ.');
      const sourceSignature = fileSignature(sourcePath);
      const integrity = await fingerprintAsync(sourcePath);
      const item = { sourcePath, destinationPath, integrity, sourceSignature, copied: false };
      if (fs.existsSync(destinationPath)) throw new Error(`Image destination already exists: ${destinationPath}`);
      journal.files.push(item);
      atomicJsonSync(journalPath, journal);
      await fs.promises.mkdir(path.dirname(destinationPath), { recursive: true });
      await fs.promises.copyFile(sourcePath, destinationPath, fs.constants.COPYFILE_EXCL);
      item.copied = true;
      const handle = await fs.promises.open(destinationPath, 'r+');
      try { await handle.sync(); } finally { await handle.close(); }
      const actual = await fingerprintAsync(destinationPath);
      if (actual.sha256 !== integrity.sha256 || actual.size !== integrity.size || sourceSignature !== fileSignature(sourcePath)) throw new Error('Image pair changed while being saved. Originals have been retained.');
      item.destinationSignature = fileSignature(destinationPath);
      atomicJsonSync(journalPath, journal);
    }
    journal.phase = 'files_ready';
    atomicJsonSync(journalPath, journal);
    return { ...journal, journalPath };
  } catch (error) { rollbackImageStage({ ...journal, journalPath }); throw error; }
}

function stageImageFiles(databasePath, files) {
  const journalPath = path.join(path.dirname(databasePath), 'pending-image-imports', `${crypto.randomUUID()}.json`);
  const journal = { version: 1, databasePath: path.resolve(databasePath), phase: 'copying', files: [] };
  atomicJsonSync(journalPath, journal);
  try {
    for (const file of files) {
      const sourcePath = path.resolve(file.sourcePath);
      const destinationPath = path.resolve(file.destinationPath);
      if (sourcePath === destinationPath) throw new Error('Camera source and destination must differ.');
      const integrity = fingerprint(sourcePath);
      const item = { sourcePath, destinationPath, integrity, copied: false };
      // Persist intent before creating anything. Exclusive copy never replaces
      // a pre-existing photograph, including a similarly named late RAW.
      if (fs.existsSync(destinationPath)) throw new Error(`Image destination already exists: ${destinationPath}`);
      journal.files.push(item);
      atomicJsonSync(journalPath, journal);
      fs.mkdirSync(path.dirname(destinationPath), { recursive: true });
      fs.copyFileSync(sourcePath, destinationPath, fs.constants.COPYFILE_EXCL);
      item.copied = true;
      const fd = fs.openSync(destinationPath, 'r+');
      try { fs.fsyncSync(fd); } finally { fs.closeSync(fd); }
      if (!matches(destinationPath, integrity) || !matches(sourcePath, integrity)) throw new Error('Image pair changed while being saved. Originals have been retained.');
      atomicJsonSync(journalPath, journal);
    }
    journal.phase = 'files_ready';
    atomicJsonSync(journalPath, journal);
    return { ...journal, journalPath };
  } catch (error) {
    rollbackImageStage({ ...journal, journalPath });
    throw error;
  }
}

function rollbackImageStage(journal) {
  const retainedFiles = [];
  for (const file of journal.files) {
    if (!fs.existsSync(file.destinationPath)) continue;
    if (file.copied && matches(file.destinationPath, file.integrity) && matches(file.sourcePath, file.integrity)) fs.unlinkSync(file.destinationPath);
    else retainedFiles.push({ path: file.destinationPath, reason: 'Retained because the original source or staged copy changed or disappeared.' });
  }
  if (retainedFiles.length) atomicJsonSync(journal.journalPath, { ...journal, phase: 'rollback_retained', retainedFiles });
  else if (fs.existsSync(journal.journalPath)) fs.unlinkSync(journal.journalPath);
  return retainedFiles;
}

function commitImageStage(journal) {
  journal.phase = 'database_committed';
  atomicJsonSync(journal.journalPath, journal);
  const retainedFiles = [];
  for (const file of journal.files) {
    if (!fs.existsSync(file.sourcePath)) continue;
    try {
      const unchanged = file.sourceSignature && file.destinationSignature
        ? fileSignature(file.sourcePath) === file.sourceSignature && fileSignature(file.destinationPath) === file.destinationSignature
        : matches(file.destinationPath, file.integrity) && matches(file.sourcePath, file.integrity);
      if (!unchanged) {
        throw new Error('File changed; original retained for recovery.');
      }
      fs.unlinkSync(file.sourcePath);
    } catch (error) { retainedFiles.push({ path: file.sourcePath, reason: error.message }); }
  }
  if (!retainedFiles.length) fs.unlinkSync(journal.journalPath);
  else atomicJsonSync(journal.journalPath, { ...journal, retainedFiles });
  return retainedFiles;
}

module.exports = { atomicWriteFile, atomicJsonSync, listDatabaseBackups, fileSignature, stageImageFiles, stageImageFilesAsync, rollbackImageStage, commitImageStage, fingerprint, fingerprintAsync, matches };
