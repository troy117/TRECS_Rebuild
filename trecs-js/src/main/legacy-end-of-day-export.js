const path = require('path');
const XLSX = require('xlsx');

const LEGACY_NEW_RECORD_HEADERS = [
  'LastName',
  'FirstName',
  'ID_Number',
  'Grade',
  'Homeroom',
  'Track',
  'Field1',
  'Field2'
];

const LEGACY_SUBJECT_HEADERS = [
  'ReferenceNumber',
  'LastName',
  'FirstName',
  'ID_Number',
  'Grade',
  'Homeroom',
  'Track',
  'Field1',
  'Field2',
  'Notes',
  'ChangedFields'
];

function text(value) {
  return value === null || value === undefined ? '' : String(value);
}

function subjectName(row = {}) {
  return text(row.display_name)
    || [text(row.first_name), text(row.last_name)].filter(Boolean).join(' ');
}

function rowsById(subjectRows = []) {
  return new Map(subjectRows.map((row) => [Number(row.id), row]));
}

function legacyNewRecordRow(row = {}) {
  return [
    text(row.last_name),
    text(row.first_name),
    text(row.external_id),
    text(row.grade),
    text(row.homeroom),
    text(row.track),
    text(row.field1),
    text(row.field2)
  ];
}

function legacySubjectRow(row = {}, changedFields = []) {
  return [
    text(row.legacy_ref_num),
    text(row.last_name),
    text(row.first_name),
    text(row.external_id),
    text(row.grade),
    text(row.homeroom),
    text(row.track),
    text(row.field1),
    text(row.field2),
    text(row.notes),
    changedFields.join(', ')
  ];
}

function subjectFallback(change = {}) {
  const name = text(change.name).trim();
  const nameParts = name.split(/\s+/).filter(Boolean);
  return {
    id: change.id,
    legacy_ref_num: change.ref,
    first_name: nameParts.length > 1 ? nameParts.slice(0, -1).join(' ') : name,
    last_name: nameParts.length > 1 ? nameParts[nameParts.length - 1] : '',
    display_name: name,
    external_id: change.externalId,
    grade: change.grade,
    homeroom: change.homeroom,
    track: change.track,
    field1: change.field1,
    field2: change.field2,
    notes: change.notes
  };
}

function nameParts(nameValue) {
  const name = text(nameValue).trim();
  const parts = name.split(/\s+/).filter(Boolean);
  return {
    display_name: name,
    first_name: parts.length > 1 ? parts.slice(0, -1).join(' ') : name,
    last_name: parts.length > 1 ? parts[parts.length - 1] : ''
  };
}

function newSubjectWithReviewValues(row, manifestSubject) {
  const result = { ...row };
  const values = {
    legacy_ref_num: manifestSubject.ref,
    subject_type: manifestSubject.type,
    first_name: manifestSubject.firstName,
    last_name: manifestSubject.lastName,
    display_name: manifestSubject.displayName,
    external_id: manifestSubject.externalId,
    grade: manifestSubject.grade,
    homeroom: manifestSubject.homeroom,
    track: manifestSubject.track,
    team: manifestSubject.team,
    field1: manifestSubject.field1,
    field2: manifestSubject.field2,
    notes: manifestSubject.notes
  };
  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined) result[key] = value;
  });
  if (Object.prototype.hasOwnProperty.call(manifestSubject, 'name')
    && text(manifestSubject.name) !== subjectName(result)) {
    Object.assign(result, nameParts(manifestSubject.name));
  }
  return result;
}

const CHANGE_FIELD_COLUMNS = {
  ref: 'legacy_ref_num',
  type: 'subject_type',
  firstName: 'first_name',
  lastName: 'last_name',
  displayName: 'display_name',
  externalId: 'external_id',
  grade: 'grade',
  homeroom: 'homeroom',
  track: 'track',
  team: 'team',
  field1: 'field1',
  field2: 'field2',
  notes: 'notes'
};

function editedSubjectWithReviewValues(row, changes = []) {
  const result = { ...row };
  changes.forEach((change) => {
    const column = CHANGE_FIELD_COLUMNS[change.field];
    if (column) result[column] = change.after;
  });
  return result;
}

function buildLegacyTrecsImportRows(manifest = {}, subjectRows = []) {
  const changes = manifest.subjectChanges || {};
  const subjectMap = rowsById(subjectRows);
  const newSubjects = Array.isArray(changes.newSubjects) ? changes.newSubjects : [];
  const editedSubjects = Array.isArray(changes.editedSubjects) ? changes.editedSubjects : [];

  const newRecordSubjects = newSubjects.map((subject) => newSubjectWithReviewValues(
    subjectMap.get(Number(subject.id)) || subjectFallback(subject),
    subject
  ));
  const editedRecordSubjects = editedSubjects.map((subject) => {
    const subjectFieldChanges = Array.isArray(subject.changes) ? subject.changes : [];
    return {
      subject: editedSubjectWithReviewValues(
        subjectMap.get(Number(subject.id)) || subjectFallback(subject),
        subjectFieldChanges
      ),
      changes: subjectFieldChanges
    };
  });

  const newRecords = [
    LEGACY_NEW_RECORD_HEADERS,
    ...newRecordSubjects.map(legacyNewRecordRow)
  ];
  const newRecordReferences = [
    LEGACY_SUBJECT_HEADERS,
    ...newRecordSubjects.map((subject) => legacySubjectRow(subject, ['New record']))
  ];
  const subjectChanges = [
    LEGACY_SUBJECT_HEADERS,
    ...editedRecordSubjects.map(({ subject, changes: subjectFieldChanges }) => (
      legacySubjectRow(subject, subjectFieldChanges.map((change) => change.label || change.field).filter(Boolean))
    ))
  ];
  const changeDetail = [
    ['ReferenceNumber', 'Subject', 'Field', 'Before', 'After'],
    ...editedRecordSubjects.flatMap(({ subject, changes: subjectFieldChanges }) => subjectFieldChanges.map((change) => [
      text(subject.legacy_ref_num || change.ref),
      subjectName(subject),
      text(change.label || change.field),
      text(change.before),
      text(change.after)
    ]))
  ];

  return {
    newRecords,
    newRecordReferences,
    subjectChanges,
    changeDetail,
    counts: {
      newRecords: newRecordSubjects.length,
      changedSubjects: editedRecordSubjects.length,
      fieldChanges: Math.max(0, changeDetail.length - 1)
    }
  };
}

function setWorksheetLayout(worksheet, widths, freezeHeader = true) {
  worksheet['!cols'] = widths.map((wch) => ({ wch }));
  if (freezeHeader) {
    worksheet['!freeze'] = { xSplit: 0, ySplit: 1, topLeftCell: 'A2', activePane: 'bottomLeft', state: 'frozen' };
  }
  if (worksheet['!ref']) {
    worksheet['!autofilter'] = { ref: worksheet['!ref'] };
  }
}

function appendSheet(workbook, name, rows, widths) {
  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  setWorksheetLayout(worksheet, widths);
  XLSX.utils.book_append_sheet(workbook, worksheet, name);
}

function writeLegacyTrecsImportWorkbook(outputPath, manifest = {}, subjectRows = []) {
  const importRows = buildLegacyTrecsImportRows(manifest, subjectRows);
  const workbook = XLSX.utils.book_new();
  const job = manifest.job || {};
  const instructions = [
    ['TRECS End of Day - Legacy Import'],
    ['School', text(job.clientName || job.trecsName)],
    ['Job', text(job.name)],
    ['Created', text(manifest.createdAt)],
    ['New records', importRows.counts.newRecords],
    ['Changed subjects', importRows.counts.changedSubjects],
    ['Individual field changes', importRows.counts.fieldChanges],
    [],
    ['New Records is formatted for old TRECS Student > Add Students.'],
    ['In the standard Add Students screen, leave Include Header unchecked and map columns 1 through 8 in order.'],
    ['Old TRECS assigns the next available reference numbers; verify them against New Record Refs afterward.'],
    ['Subject Changes contains the complete resulting values keyed by ReferenceNumber.'],
    ['Change Detail is the before/after audit list. Empty sheets mean there were no changes of that type.']
  ];
  const instructionSheet = XLSX.utils.aoa_to_sheet(instructions);
  instructionSheet['!cols'] = [{ wch: 110 }, { wch: 35 }];
  XLSX.utils.book_append_sheet(workbook, instructionSheet, 'Instructions');

  appendSheet(workbook, 'New Records', importRows.newRecords, [24, 24, 18, 12, 24, 16, 24, 24]);
  appendSheet(workbook, 'New Record Refs', importRows.newRecordReferences, [18, 24, 24, 18, 12, 24, 16, 24, 24, 42, 28]);
  appendSheet(workbook, 'Subject Changes', importRows.subjectChanges, [18, 24, 24, 18, 12, 24, 16, 24, 24, 42, 36]);
  appendSheet(workbook, 'Change Detail', importRows.changeDetail, [18, 32, 22, 36, 36]);

  XLSX.writeFile(workbook, outputPath);
  return {
    outputPath: path.resolve(outputPath),
    ...importRows.counts
  };
}

module.exports = {
  LEGACY_NEW_RECORD_HEADERS,
  LEGACY_SUBJECT_HEADERS,
  buildLegacyTrecsImportRows,
  writeLegacyTrecsImportWorkbook
};
