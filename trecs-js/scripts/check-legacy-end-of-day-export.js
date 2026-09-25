const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');
const XLSX = require('xlsx');
const { exportLegacyEndOfDay } = require('./export-legacy-end-of-day');

const appRoot = path.resolve(__dirname, '..');
const workspaceRoot = path.resolve(appRoot, '..');
const exportRoot = path.join(workspaceRoot, 'exports');
const testRoot = path.join(exportRoot, '_legacy-eod-export-smoke');

function resetTestRoot() {
  if (path.dirname(testRoot) !== exportRoot || path.basename(testRoot) !== '_legacy-eod-export-smoke') {
    throw new Error(`Refusing to clear unexpected test folder: ${testRoot}`);
  }
  fs.rmSync(testRoot, { recursive: true, force: true });
  fs.mkdirSync(path.join(testRoot, 'Database'), { recursive: true });
}

function worksheetRows(workbook, name) {
  return XLSX.utils.sheet_to_json(workbook.Sheets[name], { header: 1, raw: false, defval: '' });
}

async function run() {
  resetTestRoot();
  try {
    const SQL = await initSqlJs({
      locateFile: (file) => path.join(appRoot, 'node_modules', 'sql.js', 'dist', file)
    });
    const database = new SQL.Database();
    database.run(`
      CREATE TABLE subjects (
        id INTEGER PRIMARY KEY,
        legacy_ref_num TEXT,
        first_name TEXT,
        last_name TEXT,
        display_name TEXT,
        external_id TEXT,
        grade TEXT,
        homeroom TEXT,
        track TEXT,
        field1 TEXT,
        field2 TEXT,
        notes TEXT
      );
    `);
    database.run(`
      INSERT INTO subjects VALUES
        (1, '10001', 'JAMIE', 'SMITH', 'JAMIE SMITH', 'S-1', '04', 'LEE', 'A', 'BUS', '', 'UPDATED NOTE'),
        (2, '10002', 'MORGAN', 'JONES', 'MORGAN JONES', 'S-2', '05', 'KIM', 'B', '', 'PICKUP', '');
    `);
    fs.writeFileSync(path.join(testRoot, 'Database', 'job.db'), Buffer.from(database.export()));
    database.close();

    fs.writeFileSync(path.join(testRoot, 'end-of-day-manifest.json'), JSON.stringify({
      packageType: 'end_of_day',
      createdAt: '2026-09-07T20:00:00.000Z',
      job: { name: 'FALL 2026', clientName: 'TEST SCHOOL' },
      subjectChanges: {
        newSubjects: [{ id: 2, ref: '10002', name: 'MORGAN JONES', grade: '06', homeroom: 'KIM' }],
        editedSubjects: [{
          id: 1,
          ref: '10001',
          name: 'JAMIE SMITH',
          changes: [
            { field: 'grade', label: 'Grade', before: '03', after: '05' },
            { field: 'field1', label: 'Field1', before: '', after: 'BUS' }
          ]
        }],
        deletedSubjects: []
      },
      paths: { database: 'Database/job.db' }
    }, null, 2));

    const result = await exportLegacyEndOfDay(path.join(testRoot, 'end-of-day-manifest.json'));
    const workbook = XLSX.readFile(result.outputPath);
    const newRecords = worksheetRows(workbook, 'New Records');
    const newRecordRefs = worksheetRows(workbook, 'New Record Refs');
    const subjectChanges = worksheetRows(workbook, 'Subject Changes');
    const changeDetail = worksheetRows(workbook, 'Change Detail');

    const expectedSheets = ['Instructions', 'New Records', 'New Record Refs', 'Subject Changes', 'Change Detail'];
    const pass = expectedSheets.every((name) => workbook.SheetNames.includes(name))
      && result.newRecords === 1
      && result.changedSubjects === 1
      && result.fieldChanges === 2
      && JSON.stringify(newRecords[1]) === JSON.stringify(['JONES', 'MORGAN', 'S-2', '06', 'KIM', 'B', '', 'PICKUP'])
      && newRecordRefs[1][0] === '10002'
      && subjectChanges[1][0] === '10001'
      && subjectChanges[1][4] === '05'
      && subjectChanges[1][7] === 'BUS'
      && changeDetail[1][2] === 'Grade'
      && changeDetail[2][2] === 'Field1';

    if (!pass) {
      throw new Error(JSON.stringify({ result, sheets: workbook.SheetNames, newRecords, newRecordRefs, subjectChanges, changeDetail }, null, 2));
    }
    console.log(JSON.stringify({ ok: true, ...result, sheets: workbook.SheetNames }, null, 2));
  } finally {
    resetTestRoot();
    fs.rmSync(testRoot, { recursive: true, force: true });
  }
}

run().catch((error) => {
  console.error(error.stack || error);
  process.exit(1);
});
