const assert = require('assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const vm = require('vm');
const initSqlJs = require('sql.js');
const { outputSnapshot, orderRenderOutcome, completedOrderIds, renderJobStatus } = require('../src/main/production-outcomes');
const { SIS_FORMATS, safeImageId, exportSisDelivery, stickerPageSvg } = require('../src/main/school-deliverables');

async function main() {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'trecs-production-test-'));
  try {
    const result = { units: 0, envelopes: 0, deferredComposites: 0, missingPhotos: [], missingImagePrep: [], unsupportedItems: [], errors: [] };
    const before = outputSnapshot(result);
    result.units = 2;
    assert.equal(orderRenderOutcome({ id: 1 }, before, result).status, 'completed');
    result.missingPhotos.push({ orderId: 1 });
    assert.equal(orderRenderOutcome({ id: 1 }, before, result).status, 'needs_attention');
    assert.equal(orderRenderOutcome({ id: 2 }, before, result, { includeUnits: false }).status, 'outputs_only');
    result.missingPhotos = [];
    result.deferredComposites = 1;
    assert.equal(orderRenderOutcome({ id: 1 }, before, result).status, 'needs_attention');
    assert.deepEqual(completedOrderIds({ orderResults: [{ orderId: 1, status: 'completed' }, { orderId: 2, status: 'needs_attention' }] }), [1]);

    for (const invalid of ['../student', '..', 'CON', 'foo/bar', 'one:two', 'bad.']) assert.equal(safeImageId(invalid), '');
    assert.equal(safeImageId('00123'), '00123');
    const dimensions = [];
    const delivery = await exportSisDelivery({
      subjects: [
        { ref: '1', firstName: 'Amy', lastName: 'One', externalId: '00123', grade: '04' },
        { ref: '2', firstName: 'Bob', lastName: 'Two', externalId: 'duplicate' },
        { ref: '3', firstName: 'Cam', lastName: 'Three', externalId: 'DUPLICATE' },
        { ref: '4', firstName: 'Dan', lastName: 'Four', externalId: '' },
        { ref: '5', firstName: 'Eve', lastName: 'Five', externalId: 'missing' },
        { ref: '6', firstName: 'Fox', lastName: 'Six', externalId: '../escape' },
        { ref: '7', firstName: 'Gus', lastName: 'Seven', externalId: 'corrupt' }
      ], formats: Object.keys(SIS_FORMATS), outputFolder: path.join(temporary, 'delivery'),
      resolveImage: async (subject) => subject.ref === '5' ? '' : `${subject.ref}.jpg`,
      resize: async (source, width, height) => { if (source === '7.jpg') throw new Error('Cannot decode image'); dimensions.push([width, height]); return { bytes: Uint8Array.from([255, 216, 255, 217]) }; }
    });
    assert.equal(delivery.manifest.formats.every((format) => format.exported === 1 && format.exceptions === 6), true);
    assert.deepEqual(dimensions, [[140,175],[140,175],[200,300],[96,134],[96,134]]);
    assert.equal(fs.readFileSync(path.join(temporary, 'delivery/POWERSCHOOL_CD_IMAGES/MAP.TXT'), 'utf8'), '00123\t00123.jpg\r\n');
    assert.equal(fs.readFileSync(path.join(temporary, 'delivery/SASI_CD_IMAGES/DATAMAC/XREFPICT.txt'), 'utf8'), '"",".JPG"\r\n"0000000123","00123.jpg"\r\n');
    assert.equal(fs.existsSync(path.join(temporary, 'delivery/SASI_CD_IMAGES/PCTFILEC/Exceptions/4.jpg')), true);
    assert.equal(fs.existsSync(path.join(temporary, 'escape.jpg')), false);
    const svg = stickerPageSvg([{ Position: 36, Ref: 'x', First: 'A&B', Last: '<Photo>' }], new Map(), 2);
    assert.match(svg, /width="2550" height="3300"/);
    assert.match(svg, /translate\(2118 2662\)/);
    assert.match(svg, /A&amp;B/);
    assert.match(svg, /NO PHOTO/);

    const SQL = await initSqlJs();
    const program = new SQL.Database();
    program.run(`CREATE TABLE clients(id INTEGER PRIMARY KEY, display_name TEXT);
      CREATE TABLE jobs(id INTEGER PRIMARY KEY, client_id INTEGER, name TEXT);
      INSERT INTO clients VALUES (1, 'School'); INSERT INTO jobs VALUES(1,1,'Fall'),(2,1,'Makeup');
      CREATE TABLE render_batches(id INTEGER PRIMARY KEY,job_id INTEGER,name TEXT,status TEXT,output_path TEXT,options_json TEXT,result_json TEXT,started_at TEXT,finished_at TEXT,created_by TEXT,created_at TEXT DEFAULT CURRENT_TIMESTAMP);
      CREATE TABLE render_batch_jobs(id INTEGER PRIMARY KEY,render_batch_id INTEGER,job_id INTEGER,sort_order INTEGER,status TEXT,output_path TEXT,result_json TEXT,error_message TEXT,started_at TEXT,finished_at TEXT);
    `);
    const jobDatabase = new SQL.Database();
    jobDatabase.run(`CREATE TABLE orders(id INTEGER PRIMARY KEY,job_id INTEGER,render_status TEXT,updated_at TEXT); INSERT INTO orders VALUES(11,1,'ready',NULL),(12,1,'ready',NULL),(21,2,'ready',NULL);`);
    const rowsFromDatabase = (database, sql) => { const output = database.exec(sql)[0]; return output ? output.values.map((row) => Object.fromEntries(output.columns.map((column, index) => [column, row[index]]))) : []; };
    let api;
    let stopFirst = true;
    let needsAttention = true;
    const renderedJobs = [];
    const released = [];
    const context = vm.createContext({ fs, path, console, JSON, Date, Map, Set, Number, String,
      outputSnapshot, orderRenderOutcome, completedOrderIds, renderJobStatus, rowsFromDatabase,
      numericId: Number, normalizeText: String, optionalText: (value) => value || null,
      safeFolderName: (value) => String(value).replace(/[^\w-]/g, '_'), systemInfo: () => ({ userName: 'test' }),
      queryProgramSql: async (sql) => rowsFromDatabase(program, sql),
      writeProgramSql: async (work) => work(program), writeJobSql: async (_id, work) => work(jobDatabase),
      getUnitRenderSetup: async () => ({ jobs: [] }), getJobSessions: async () => [],
      acquireJobSession: async () => ({ acquired: true }), releaseJobSession: async (_event, ids) => released.push(...ids),
      runUnitRender: async (event, input) => {
        renderedJobs.push(input.jobId);
        if (stopFirst) { stopFirst = false; await api.controlProductionBatch(event, { batchId: 1, action: 'pause' }); return { interrupted: input.stopRequested(), orderResults: [] }; }
        return { orderResults: input.jobId === 1 ? [
          { orderId: 11, status: 'completed', issues: [] },
          { orderId: 12, status: needsAttention ? 'needs_attention' : 'completed', issues: needsAttention ? [{ type: 'missingImagePrep' }] : [] }
        ] : [{ orderId: 21, status: 'completed', issues: [] }] };
      }
    });
    const source = fs.readFileSync(path.join(__dirname, '../src/main/main.js'), 'utf8');
    vm.runInContext(source.slice(source.indexOf('const activeProductionBatches ='), source.indexOf("ipcMain.handle('student-lists:get-setup'")) + '\nthis.testApi = { runBatchRender, executeProductionBatch, controlProductionBatch, getBatchRenderSetup };', context);
    api = context.testApi;
    const event = { sender: { send: () => {} } };
    const paused = await api.runBatchRender(event, { jobIds: [1,2], outputFolder: temporary });
    assert.equal(paused.status, 'paused');
    assert.equal(rowsFromDatabase(program, 'SELECT status FROM render_batch_jobs WHERE job_id = 2')[0].status, 'queued');
    const resumed = await api.controlProductionBatch(event, { batchId: paused.batchId, action: 'resume' });
    assert.equal(resumed.status, 'completed_with_errors');
    assert.deepEqual(rowsFromDatabase(jobDatabase, 'SELECT id,render_status FROM orders ORDER BY id'), [
      { id: 11, render_status: 'rendered' }, { id: 12, render_status: 'ready' }, { id: 21, render_status: 'rendered' }
    ]);
    needsAttention = false;
    const retried = await api.controlProductionBatch(event, { batchId: paused.batchId, action: 'retry' });
    assert.equal(retried.status, 'completed');
    assert.deepEqual(renderedJobs, [1,1,2,1], 'Retry must preserve the completed second job.');
    assert.equal(rowsFromDatabase(jobDatabase, 'SELECT render_status FROM orders WHERE id = 12')[0].render_status, 'rendered');
    assert.equal(released.length, 5, 'All acquired reservations must be released.');
    program.close(); jobDatabase.close();
    console.log('PASS: production status, pause/resume/retry, native SIS maps/dimensions/exceptions, and legacy sticker geometry (isolated data).');
  } finally { fs.rmSync(temporary, { recursive: true, force: true }); }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
