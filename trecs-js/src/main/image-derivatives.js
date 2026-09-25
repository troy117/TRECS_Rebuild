const fs = require('fs');
const crypto = require('crypto');

async function sourceSignature(filePath) {
  const stats = await fs.promises.stat(filePath);
  return { size: stats.size, mtimeMs: stats.mtimeMs, ctimeMs: stats.ctimeMs };
}

async function derivativeIsFresh(sourcePath, destinationPath, { allowLegacy = false } = {}) {
  try {
    const [source, destination] = await Promise.all([sourceSignature(sourcePath), sourceSignature(destinationPath)]);
    if (!destination.size) return false;
    let saved;
    try { saved = JSON.parse(await fs.promises.readFile(`${destinationPath}.source.json`, 'utf8')); }
    catch (_) { return allowLegacy && destination.mtimeMs >= source.mtimeMs; }
    return source.size === saved.size && source.mtimeMs === saved.mtimeMs && source.ctimeMs === saved.ctimeMs;
  } catch (_) { return false; }
}

async function writeDerivativeSignature(destinationPath, signature) {
  const destination = `${destinationPath}.source.json`;
  const temporary = `${destination}.${crypto.randomUUID()}.tmp`;
  try {
    await fs.promises.writeFile(temporary, JSON.stringify(signature));
    await fs.promises.rename(temporary, destination);
  } finally { await fs.promises.unlink(temporary).catch(() => {}); }
}

module.exports = { sourceSignature, derivativeIsFresh, writeDerivativeSignature };
