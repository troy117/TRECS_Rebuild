const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const os = require('os');
const initSqlJs = require('sql.js');
const safety = require('../src/main/storage-safety');
const ids = require('../src/main/id-reservations');

async function main() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'trecs-storage-safety-'));
  try {
    const target = path.join(root, 'job.db');
    await safety.atomicWriteFile(target, Buffer.from('first'));
    await safety.atomicWriteFile(target, Buffer.from('second'), { backup: true });
    assert.equal(fs.readFileSync(target, 'utf8'), 'second');
    assert.equal(fs.readFileSync(safety.listDatabaseBackups(target)[0].path, 'utf8'), 'first');
    const originalRename = fs.promises.rename;
    fs.promises.rename = async () => { throw Object.assign(new Error('simulated disk failure'), { code: 'EIO' }); };
    try { await assert.rejects(safety.atomicWriteFile(target, Buffer.from('bad')), /simulated disk failure/); }
    finally { fs.promises.rename = originalRename; }
    assert.equal(fs.readFileSync(target, 'utf8'), 'second', 'Failed save must retain last good database');
    assert.equal(fs.readdirSync(root).some((name) => name.endsWith('.tmp')), false);
    for (let i = 0; i < 15; i += 1) await safety.atomicWriteFile(target, Buffer.from(`copy-${i}`), { backup: true, backupIntervalMs: 0, keepBackups: 4 });
    assert.equal(safety.listDatabaseBackups(target).length, 4, 'Recovery retention must be bounded');

    const sourceJpg = path.join(root, 'camera', 'shot.jpg');
    const sourceRaw = path.join(root, 'camera', 'shot.CR3');
    fs.mkdirSync(path.dirname(sourceJpg));
    fs.writeFileSync(sourceJpg, Buffer.alloc(1024, 4));
    fs.writeFileSync(sourceRaw, Buffer.alloc(1024 * 1024, 5));
    const pair = [{ sourcePath: sourceJpg, destinationPath: path.join(root, 'job', 'shot.jpg') }, { sourcePath: sourceRaw, destinationPath: path.join(root, 'job', 'shot.CR3') }];
    const journal = await safety.stageImageFilesAsync(target, pair);
    assert(fs.existsSync(sourceJpg) && fs.existsSync(sourceRaw), 'Staging must not move camera originals');
    safety.rollbackImageStage(journal);
    assert(fs.existsSync(sourceJpg) && fs.existsSync(sourceRaw));
    assert(pair.every((file) => !fs.existsSync(file.destinationPath)));
    const second = await safety.stageImageFilesAsync(target, pair);
    assert.equal(safety.commitImageStage(second).length, 0);
    assert(!fs.existsSync(sourceJpg) && !fs.existsSync(sourceRaw));
    assert(pair.every((file) => fs.existsSync(file.destinationPath)));
    fs.writeFileSync(sourceJpg, Buffer.from('replacement'));
    await assert.rejects(safety.stageImageFilesAsync(target, pair), /already exists/);
    assert.equal(fs.readFileSync(sourceJpg, 'utf8'), 'replacement');
    const lastCopySource = path.join(root, 'camera', 'last.jpg');
    const lastCopyDestination = path.join(root, 'job', 'last.jpg');
    fs.writeFileSync(lastCopySource, Buffer.from('only correct photograph'));
    const lastCopyStage = await safety.stageImageFilesAsync(target, [{ sourcePath: lastCopySource, destinationPath: lastCopyDestination }]);
    fs.unlinkSync(lastCopySource);
    assert.equal(safety.rollbackImageStage(lastCopyStage).length, 1);
    assert.equal(fs.readFileSync(lastCopyDestination, 'utf8'), 'only correct photograph', 'Rollback must not remove the last correct copy');
    assert(fs.existsSync(lastCopyStage.journalPath), 'Retained recovery copy must remain discoverable');

    const SQL = await initSqlJs();
    const a = new SQL.Database();
    const b = new SQL.Database();
    for (const db of [a, b]) db.run('CREATE TABLE subjects(id INTEGER PRIMARY KEY, job_id INTEGER, name TEXT NOT NULL); CREATE INDEX idx_name ON subjects(name); INSERT INTO subjects VALUES(1,1,\'one\');');
    const allocator = path.join(root, 'ids.json');
    ids.ensureAutoincrement(a, ['subjects']);
    ids.ensureAutoincrement(b, ['subjects']);
    assert(a.exec("SELECT name FROM sqlite_master WHERE name='idx_name'").length, 'Migration must preserve indexes');
    let checks = 0;
    const bootstrap = async () => { checks += 1; return { subjects: 1 }; };
    const validateA = await ids.reserveIds(a, ['subjects'], allocator, bootstrap, 100);
    a.run("INSERT INTO subjects(job_id,name) VALUES(1,'A')");
    validateA();
    const aId = a.exec('SELECT MAX(id) FROM subjects')[0].values[0][0];
    const validateB = await ids.reserveIds(b, ['subjects'], allocator, bootstrap, 100);
    b.run("INSERT INTO subjects(job_id,name) VALUES(2,'B')");
    validateB();
    const bId = b.exec('SELECT MAX(id) FROM subjects')[0].values[0][0];
    assert(bId > aId, 'Different job writers must allocate globally unique IDs');
    assert.equal(checks, 1, 'Only first allocator creation may scan other jobs');
    a.run("INSERT INTO subjects(id,job_id,name) VALUES(99999,1,'oversize')");
    assert.throws(validateA, /exceeded/, 'Reservation overflow must stop rather than collide');
    fs.writeFileSync(allocator, '{broken');
    await assert.rejects(ids.reserveIds(b, ['subjects'], allocator, bootstrap), /stopped safely/);
    a.close(); b.close();
    console.log(JSON.stringify({ ok: true, checks: ['atomic replace failure', 'bounded backups', 'paired staging rollback/commit', 'no overwrite of existing images', 'autoincrement migration/indexes', 'global ID reservation', 'allocator failure/overflow'] }, null, 2));
  } finally {
    if (path.dirname(root) !== os.tmpdir() || !path.basename(root).startsWith('trecs-storage-safety-')) throw new Error('Unsafe test cleanup path');
    fs.rmSync(root, { recursive: true, force: true });
  }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
