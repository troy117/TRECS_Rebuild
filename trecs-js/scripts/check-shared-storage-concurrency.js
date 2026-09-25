const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const vm = require('vm');
const { fork } = require('child_process');
const initSqlJs = require('sql.js');
const reservations = require('../src/main/id-reservations');
const { atomicWriteFile } = require('../src/main/storage-safety');

function loadWriterLock(root) {
  const source = fs.readFileSync(path.join(__dirname, '../src/main/main.js'), 'utf8');
  const context = vm.createContext({ fs, path, os, process, crypto, console, Date, Promise, Number, JSON,
    setTimeout, setInterval, clearInterval,
    APP_SESSION_ID: crypto.randomUUID(), DATABASE_WRITE_LOCK_PATH: path.join(root, 'ProgramData.db.write-lock') });
  const start = source.indexOf('let databaseWriteQueue =');
  const end = source.indexOf('function systemInfo()', start);
  assert.ok(start > 0 && end > start, 'Shared-lock source boundaries must be found.');
  vm.runInContext(source.slice(start, end) + '\nthis.lock = { acquire: acquireDatabaseWriteLock, release: releaseDatabaseWriteLock };', context);
  return context.lock;
}

function sqlRows(database, sql) {
  return database.exec(sql)[0]?.values || [];
}

async function worker(root, workerNumber) {
  const SQL = await initSqlJs();
  const lock = loadWriterLock(root);
  const databasePath = path.join(root, `job-${workerNumber}.db`);
  const allocatorPath = path.join(root, 'record-id-reservations.json');
  const activePath = path.join(root, 'active-writer');
  process.send({ ready: true });
  await new Promise((resolve) => process.once('message', resolve));
  // Concurrent requests in each process exercise both the in-process queue
  // and the shared-directory lock against the other process.
  await Promise.all(Array.from({ length: 24 }, async (_, index) => {
    await lock.acquire(15000);
    let database;
    let marker;
    try {
      marker = fs.openSync(activePath, 'wx');
      database = new SQL.Database(fs.readFileSync(databasePath));
      reservations.ensureAutoincrement(database, ['samples']);
      const validate = await reservations.reserveIds(database, ['samples'], allocatorPath, async () => {
        const values = {};
        for (const number of [1, 2]) {
          const other = new SQL.Database(fs.readFileSync(path.join(root, `job-${number}.db`)));
          try { reservations.maxima(other, ['samples'], values); } finally { other.close(); }
        }
        return values;
      }, 100);
      const counterPath = path.join(root, 'counter.json');
      const counter = JSON.parse(fs.readFileSync(counterPath, 'utf8'));
      await new Promise((resolve) => setTimeout(resolve, 4 + ((index + workerNumber) % 5)));
      database.run('INSERT INTO samples(value) VALUES (?)', [`worker-${workerNumber}-${index}`]);
      validate();
      await atomicWriteFile(databasePath, Buffer.from(database.export()));
      await atomicWriteFile(counterPath, Buffer.from(JSON.stringify({ count: counter.count + 1 })));
    } finally {
      if (database) database.close();
      if (marker != null) { fs.closeSync(marker); fs.unlinkSync(activePath); }
      lock.release();
    }
  }));
  process.send({ done: true });
}

async function main() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'trecs-shared-writer-'));
  const children = [];
  try {
    const SQL = await initSqlJs();
    for (const number of [1, 2]) {
      const database = new SQL.Database();
      database.run('CREATE TABLE samples(id INTEGER PRIMARY KEY, value TEXT);');
      fs.writeFileSync(path.join(root, `job-${number}.db`), Buffer.from(database.export()));
      database.close();
    }
    fs.writeFileSync(path.join(root, 'counter.json'), JSON.stringify({ count: 0 }));
    const startedAt = Date.now();
    const workers = [1, 2].map((number) => {
      const child = fork(__filename, ['worker', root, String(number)], { stdio: ['ignore', 'pipe', 'pipe', 'ipc'] });
      children.push(child);
      let output = '';
      child.stdout.on('data', (chunk) => { output += chunk; });
      child.stderr.on('data', (chunk) => { output += chunk; });
      const ready = new Promise((resolve, reject) => {
        child.on('message', (message) => { if (message.ready) resolve(); });
        child.once('error', reject);
        child.once('exit', (code) => { if (code) reject(new Error(`Worker ${number} failed before ready: ${output}`)); });
      });
      const completed = new Promise((resolve, reject) => {
        child.once('error', reject);
        child.once('exit', (code) => code === 0 ? resolve() : reject(new Error(`Worker ${number} failed: ${output}`)));
      });
      return { child, ready, completed };
    });
    await Promise.all(workers.map((item) => item.ready));
    workers.forEach((item) => item.child.send({ start: true }));
    await Promise.all(workers.map((item) => item.completed));
    const ids = [];
    for (const number of [1, 2]) {
      const database = new SQL.Database(fs.readFileSync(path.join(root, `job-${number}.db`)));
      try {
        assert.equal(sqlRows(database, 'PRAGMA quick_check')[0][0], 'ok');
        const rows = sqlRows(database, 'SELECT id,value FROM samples');
        assert.equal(rows.length, 24);
        ids.push(...rows.map(([id]) => id));
      } finally { database.close(); }
    }
    assert.equal(new Set(ids).size, 48, 'IDs must be unique across job databases.');
    assert.equal(JSON.parse(fs.readFileSync(path.join(root, 'counter.json'), 'utf8')).count, 48, 'No shared counter update may be lost.');
    assert.equal(fs.existsSync(path.join(root, 'active-writer')), false);
    assert.equal(fs.existsSync(path.join(root, 'ProgramData.db.write-lock')), false);

    // Unknown or dead owners must not be stolen automatically. A short
    // acquisition timeout should preserve the owner file for explicit repair.
    const lockPath = path.join(root, 'ProgramData.db.write-lock');
    fs.mkdirSync(lockPath);
    const ownerPath = path.join(lockPath, 'owner.json');
    const ownerText = JSON.stringify({ sessionId: 'stale-owner', pid: 2000000000, computerName: process.env.COMPUTERNAME || os.hostname() });
    fs.writeFileSync(ownerPath, ownerText);
    await assert.rejects(loadWriterLock(root).acquire(180), /lock|administrator|workstation/i);
    assert.equal(fs.readFileSync(ownerPath, 'utf8'), ownerText, 'A stale lock must not be deleted by a contender.');
    console.log(`PASS: two processes, 48 queued writes, no overlap/lost writes, globally unique IDs, stale lock preserved (${Date.now() - startedAt} ms; isolated data).`);
  } finally {
    for (const child of children) if (child.exitCode === null) child.kill();
    fs.rmSync(root, { recursive: true, force: true });
  }
}

if (process.argv[2] === 'worker') {
  worker(process.argv[3], Number(process.argv[4])).then(() => process.exit(0)).catch((error) => { console.error(error); process.exit(1); });
} else main().catch((error) => { console.error(error); process.exitCode = 1; });
