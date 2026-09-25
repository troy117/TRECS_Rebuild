const { ipcRenderer, nativeImage } = require('electron');
const channel = process.argv.find((arg) => arg.startsWith('--trecs-image-channel='))?.split('=').slice(1).join('=');
ipcRenderer.on('trecs:image-worker:run', async (_event, request) => {
  try {
    const original = nativeImage.createFromBuffer(Buffer.from(request.bytes));
    if (original.isEmpty()) throw new Error('Could not decode image.');
    const originalSize = original.getSize();
    const maxEdge = request.size === 'thumbnail' ? 320 : request.size === 'original' ? Infinity : 1440;
    const ratio = Math.min(1, maxEdge / Math.max(originalSize.width, originalSize.height));
    const width = request.width || Math.max(1, Math.round(originalSize.width * ratio));
    const height = request.height || Math.max(1, Math.round(originalSize.height * ratio));
    let bytes;
    if (request.fit === 'contain' || request.fit === 'cover') {
      const scale = (request.fit === 'contain' ? Math.min : Math.max)(width / originalSize.width, height / originalSize.height);
      const fitted = original.resize({ width: Math.max(1, Math.round(originalSize.width * scale)), height: Math.max(1, Math.round(originalSize.height * scale)), quality: 'best' });
      const bitmap = await createImageBitmap(new Blob([fitted.toPNG()], { type: 'image/png' }));
      const canvas = new OffscreenCanvas(width, height);
      const context = canvas.getContext('2d');
      context.fillStyle = '#ffffff'; context.fillRect(0, 0, width, height);
      context.drawImage(bitmap, (width - bitmap.width) / 2, (height - bitmap.height) / 2);
      bitmap.close();
      bytes = Buffer.from(await (await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.92 })).arrayBuffer());
    } else {
      const resized = width === originalSize.width && height === originalSize.height
        ? original : original.resize({ width, height, quality: 'best' });
      bytes = resized.toJPEG(request.output === 'jpeg' ? 92 : 88);
    }
    const result = request.output === 'jpeg' ? { bytes, width, height }
      : { dataUrl: `data:image/jpeg;base64,${bytes.toString('base64')}`, width, height, originalWidth: originalSize.width, originalHeight: originalSize.height };
    ipcRenderer.send(channel, { id: request.id, result });
  } catch (error) {
    ipcRenderer.send(channel, { id: request.id, error: error.message || String(error) });
  }
});
