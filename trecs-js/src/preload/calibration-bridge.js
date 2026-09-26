// Also required from the normal TRECS preload. No filesystem paths accepted over IPC.
const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('cropCalibration', {
  status: () => ipcRenderer.invoke('calibration:status'),
  chooseCalibration: () => ipcRenderer.invoke('calibration:choose-calibration'),
  defaultCalibration: () => ipcRenderer.invoke('calibration:default-calibration'),
  chooseFolder: recursive => ipcRenderer.invoke('calibration:choose-folder', recursive),
  start: options => ipcRenderer.invoke('calibration:start', options),
  cancel: () => ipcRenderer.invoke('calibration:cancel'),
  runs: () => ipcRenderer.invoke('calibration:runs'),
  items: (id, offset) => ipcRenderer.invoke('calibration:items', id, offset),
  preview: (id, sequence, role) => ipcRenderer.invoke('calibration:preview', id, sequence, role),
  review: (id, sequence, value) => ipcRenderer.invoke('calibration:review', id, sequence, value),
  recover: id => ipcRenderer.invoke('calibration:recover', id),
  export: (id, previews) => ipcRenderer.invoke('calibration:export', id, previews),
  openCache: () => ipcRenderer.invoke('calibration:open-cache'),
  heartbeat: lag => ipcRenderer.invoke('calibration:heartbeat', lag),
  onProgress: callback => {
    const listener = (_event, payload) => callback(payload);
    ipcRenderer.on('calibration:progress', listener);
    return () => ipcRenderer.removeListener('calibration:progress', listener);
  }
});
