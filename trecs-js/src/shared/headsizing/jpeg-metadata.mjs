// Read only the metadata needed to define the stored JPEG coordinate frame.
// Missing EXIF means the JPEG's normal orientation; malformed EXIF is not guessed.
export function readJpegMetadata(bytes) {
  const d = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (bytes.length < 4 || d.getUint16(0) !== 0xffd8) throw new Error('Not a JPEG');
  let width, height, exifOrientation = 1, hasOrientation = false;
  for (let p = 2; p < bytes.length;) {
    if (bytes[p++] !== 0xff) throw new Error('Invalid JPEG marker');
    while (bytes[p] === 0xff) p++;
    const marker = bytes[p++];
    if (marker === 0xda || marker === 0xd9) break;
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue;
    if (p + 2 > bytes.length) throw new Error('Truncated JPEG');
    const size = d.getUint16(p), end = p + size;
    if (size < 2 || end > bytes.length) throw new Error('Truncated JPEG segment');
    if ([0xc0, 0xc1, 0xc2].includes(marker)) {
      if (size < 8) throw new Error('Invalid JPEG dimensions');
      height = d.getUint16(p + 3); width = d.getUint16(p + 5);
    }
    if (marker === 0xe1 && size >= 8 && d.getUint32(p + 2) === 0x45786966 && d.getUint16(p + 6) === 0) {
      const base = p + 8;
      if (base + 8 > end) throw new Error('Truncated EXIF');
      const byteOrder = d.getUint16(base), little = byteOrder === 0x4949;
      if (![0x4949, 0x4d4d].includes(byteOrder) || d.getUint16(base + 2, little) !== 42) throw new Error('Invalid EXIF');
      const ifd = base + d.getUint32(base + 4, little);
      if (ifd < base + 8 || ifd + 2 > end) throw new Error('Invalid EXIF directory');
      const count = d.getUint16(ifd, little);
      if (ifd + 2 + count * 12 > end) throw new Error('Truncated EXIF directory');
      for (let i = 0; i < count; i++) {
        const e = ifd + 2 + i * 12;
        if (d.getUint16(e, little) !== 0x112) continue;
        const orientation = d.getUint16(e + 8, little);
        if (d.getUint16(e + 2, little) !== 3 || d.getUint32(e + 4, little) !== 1 || orientation < 1 || orientation > 8
          || (hasOrientation && orientation !== exifOrientation)) throw new Error('Invalid or conflicting EXIF orientation');
        hasOrientation = true; exifOrientation = orientation;
      }
    }
    p = end;
  }
  if (!width || !height) throw new Error('Unsupported or missing JPEG dimensions');
  if (width * height > 64_000_000) throw new Error('JPEG exceeds the 64 megapixel test limit');
  return { width, height, exifOrientation, hasOrientation };
}
