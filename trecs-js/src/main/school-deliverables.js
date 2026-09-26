const fs = require('fs');
const path = require('path');

// Native folder names, map formats and sizes from legacy CreateCD.java.
const SIS_FORMATS = {
  student_cd: { label: 'Student CD', folder: 'STUDENT_CD_IMAGES', map: 'IDLINK.txt', exceptions: 'Exceptions.txt', width: 140, height: 175 },
  destiny: { label: 'Destiny', folder: 'DESTINY', map: 'IDLINK.txt', exceptions: 'Exceptions.txt', width: 140, height: 175 },
  powerschool: { label: 'PowerSchool', folder: 'POWERSCHOOL_CD_IMAGES', map: 'MAP.TXT', exceptions: 'Exceptions.TXT', width: 200, height: 300 },
  sasi: { label: 'SASI', folder: path.join('SASI_CD_IMAGES', 'DATAMAC'), imageFolder: path.join('SASI_CD_IMAGES', 'PCTFILEC'), map: 'XREFPICT.txt', exceptions: 'Exceptions.txt', width: 96, height: 134 }
};

function safeImageId(value) {
  const id = String(value || '').trim();
  return id && !/[<>:"/\\|?*\x00-\x1f]/.test(id) && !/[. ]$/.test(id)
    && !/^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(id) && !/^\.+$/.test(id) ? id : '';
}

function quoteFields(values) { return values.map((value) => `"${String(value || '').replace(/"/g, '""')}"`).join(','); }
function sisMapLine(format, subject, id) {
  if (format === 'powerschool') return `${id}\t${id}.jpg`;
  if (format === 'student_cd') return quoteFields([id, `${id}.jpg`, subject.lastName, subject.firstName, subject.grade]);
  return quoteFields([format === 'sasi' ? id.padStart(10, '0') : id, `${id}.jpg`]);
}

async function exportSisDelivery({ subjects, formats, outputFolder, resolveImage, resize }) {
  const selected = subjects.filter((subject) => String(subject.firstName || '').trim() && String(subject.lastName || '').trim());
  const counts = new Map();
  for (const subject of selected) {
    const key = String(subject.externalId || '').trim().toLowerCase();
    if (key) counts.set(key, (counts.get(key) || 0) + 1);
  }
  const rows = [];
  const files = [];
  const manifestFormats = [];
  for (const format of formats) {
    const definition = SIS_FORMATS[format];
    if (!definition) throw new Error('Unknown SIS format.');
    const linkLines = format === 'sasi' ? ['"",".JPG"'] : [];
    const exceptions = [];
    let exported = 0;
    for (const subject of selected) {
      const idText = String(subject.externalId || '').trim();
      const id = safeImageId(idText);
      let issue = !idText ? 'Missing Student ID' : !id ? 'Invalid Student ID filename' : counts.get(id.toLowerCase()) > 1 ? 'Duplicate Student ID' : '';
      let imagePath = '';
      let target = '';
      let exceptionImage = '';
      try {
        imagePath = await resolveImage(subject);
        if (!imagePath && !issue) issue = 'Missing Image';
        if (!issue) {
          target = path.join(definition.imageFolder || definition.folder, `${id}.jpg`);
          const resized = await resize(imagePath, definition.width, definition.height);
          const bytes = Buffer.isBuffer(resized) ? resized : resized.bytes ? Buffer.from(resized.bytes) : Buffer.from(resized.jpeg || resized.dataUrl.split(',')[1], 'base64');
          const destination = path.join(outputFolder, target);
          await fs.promises.mkdir(path.dirname(destination), { recursive: true });
          await fs.promises.writeFile(destination, bytes, { flag: 'wx' });
          files.push(destination);
          linkLines.push(sisMapLine(format, subject, id));
          exported += 1;
        } else if (format === 'sasi' && !idText && imagePath && safeImageId(subject.ref)) {
          exceptionImage = path.join(definition.imageFolder, 'Exceptions', `${safeImageId(subject.ref)}.jpg`);
          const resized = await resize(imagePath, definition.width, definition.height);
          const bytes = Buffer.isBuffer(resized) ? resized : resized.bytes ? Buffer.from(resized.bytes) : Buffer.from(resized.jpeg || resized.dataUrl.split(',')[1], 'base64');
          const destination = path.join(outputFolder, exceptionImage);
          await fs.promises.mkdir(path.dirname(destination), { recursive: true });
          await fs.promises.writeFile(destination, bytes, { flag: 'wx' });
          files.push(destination);
        }
      } catch (error) { issue = `${issue ? `${issue}; ` : ''}Image export failed: ${error.message}`; }
      if (issue) exceptions.push(`${issue}: ${subject.ref || ''} - ${subject.lastName}, ${subject.firstName} - ID: ${idText}`);
      rows.push({ Format: definition.label, Status: issue ? 'Exception' : 'Exported', Ref: subject.ref, 'Student ID': idText,
        First: subject.firstName, Last: subject.lastName, Grade: subject.grade, 'Image Source': imagePath,
        'Image Target': issue ? exceptionImage : target, Message: issue });
    }
    const folder = path.join(outputFolder, definition.folder);
    await fs.promises.mkdir(folder, { recursive: true });
    const mapFile = path.join(folder, definition.map);
    const exceptionFile = path.join(folder, definition.exceptions);
    await fs.promises.writeFile(mapFile, `${linkLines.join('\r\n')}\r\n`, { flag: 'wx' });
    await fs.promises.writeFile(exceptionFile, `${exceptions.join('\r\n')}\r\n`, { flag: 'wx' });
    files.push(mapFile, exceptionFile);
    manifestFormats.push({ format, ...definition, exported, exceptions: exceptions.length, mapFile, exceptionFile });
  }
  return { rows, files, manifest: { createdAt: new Date().toISOString(), outputFolder, selectedSubjects: selected.length,
    skippedBlankNameSubjects: subjects.length - selected.length, formats: manifestFormats, files, resizePolicy: 'Exact native dimensions; portrait fitted without distortion on a white background.' } };
}

function xml(value) { return String(value || '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[char])); }

function stickerPageSvg(rows, sources, pageNumber) {
  const columns = [56, 468, 881, 1293, 1706, 2118];
  const rowY = [150, 652, 1155, 1657, 2160, 2662];
  const cells = rows.map((row) => {
    const slot = Number(row.Position) - 1;
    const source = sources.get(String(row.Ref));
    return `<g transform="translate(${columns[slot % 6]} ${rowY[Math.floor(slot / 6)]})"><svg width="375" height="489" viewBox="0 0 375 489">${source ? `<image href="${xml(source)}" x="27" y="0" width="300" height="400" preserveAspectRatio="xMidYMin meet"/>` : '<text x="50" y="180" font-size="22">NO PHOTO</text>'}<g font-family="Arial" font-size="16"><text x="50" y="420">${xml(row.Last)}</text><text x="50" y="438">${xml(row.First)}   ${xml(row.Grade)}</text><text x="50" y="465">${xml(row.Homeroom)}  ${xml(row['Student ID'])}</text></g></svg></g>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="2550" height="3300" viewBox="0 0 2550 3300"><rect width="2550" height="3300" fill="white"/><text x="100" y="100" font-family="Arial" font-size="30">Page: ${Number(pageNumber)}</text>${cells}</svg>`;
}

module.exports = { SIS_FORMATS, safeImageId, sisMapLine, exportSisDelivery, stickerPageSvg };
