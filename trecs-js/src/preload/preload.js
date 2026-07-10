const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('trecs', {
  prototypeDatabasePath: '',
  getDashboardData: () => ipcRenderer.invoke('dashboard:get'),
  getJobsData: () => ipcRenderer.invoke('jobs:list'),
  getJobDetail: (jobId) => ipcRenderer.invoke('job:detail', jobId),
  getStudentFieldSettings: () => ipcRenderer.invoke('settings:student-fields:get'),
  saveStudentFieldSettings: (input) => ipcRenderer.invoke('settings:student-fields:save', input),
  createClient: (input) => ipcRenderer.invoke('client:create', input),
  createJob: (input) => ipcRenderer.invoke('job:create', input),
  choosePreviousTrecsJobFolder: () => ipcRenderer.invoke('job:choose-previous-trecs-folder'),
  importPreviousTrecsJob: (input) => ipcRenderer.invoke('job:import-previous-trecs', input),
  chooseOnsiteSetupFolder: () => ipcRenderer.invoke('job:choose-onsite-setup-folder'),
  loadOnsiteSetup: (input) => ipcRenderer.invoke('job:load-onsite-setup', input),
  chooseEndOfDayPackageFolder: () => ipcRenderer.invoke('end-of-day:choose-package-folder'),
  approveEndOfDayPackage: (input) => ipcRenderer.invoke('end-of-day:approve-package', input),
  chooseSchoolDataFile: (jobId) => ipcRenderer.invoke('school-data:choose-file', jobId),
  importSchoolData: (jobId, input) => ipcRenderer.invoke('school-data:import', jobId, input),
  getAdminItems: (jobId, stage) => ipcRenderer.invoke('admin-items:get', jobId, stage),
  renderAdminItem: (jobId, input) => ipcRenderer.invoke('admin-items:render', jobId, input),
  renderSubjectIdCard: (jobId, subjectId, input) => ipcRenderer.invoke('id-card:render-subject', jobId, subjectId, input),
  syncCroppedImages: (jobId) => ipcRenderer.invoke('images:sync-cropped', jobId),
  getCapturePlan: async (jobId) => {
    const detail = await ipcRenderer.invoke('job:detail', jobId);
    return detail.capture;
  },
  createSubject: (jobId, input) => ipcRenderer.invoke('subject:create', jobId, input),
  createBlankSubjects: (jobId, count) => ipcRenderer.invoke('subject:create-blank-batch', jobId, count),
  updateSubject: (subjectId, input) => ipcRenderer.invoke('subject:update', subjectId, input),
  updateSubjectNotes: (subjectId, notes) => ipcRenderer.invoke('subject:update-notes', subjectId, notes),
  updateOrderNotes: (orderId, notes) => ipcRenderer.invoke('order:update-notes', orderId, notes),
  updateOrderRenderStatus: (orderId, status) => ipcRenderer.invoke('order:update-render-status', orderId, status),
  updateOrder: (orderId, input) => ipcRenderer.invoke('order:update', orderId, input),
  deleteOrder: (orderId) => ipcRenderer.invoke('order:delete', orderId),
  findSubjectByBarcode: (jobId, barcode) => ipcRenderer.invoke('envelope:find-subject', jobId, barcode),
  searchEnvelopeSubjects: (jobId, search) => ipcRenderer.invoke('envelope:search-subjects', jobId, search),
  startEnvelopeWatcher: (jobId, subjectId, hotFolder) => ipcRenderer.invoke('envelope:start-watcher', jobId, subjectId, hotFolder),
  stopEnvelopeWatcher: () => ipcRenderer.invoke('envelope:stop-watcher'),
  confirmEnvelopeScan: (accept) => ipcRenderer.invoke('envelope:confirm-scan', accept),
  startCaptureWatcher: (jobId, subjectId, options) => ipcRenderer.invoke('capture:start-watcher', jobId, subjectId, options),
  stopCaptureWatcher: () => ipcRenderer.invoke('capture:stop-watcher'),
  getCaptureSubjectImages: (subjectId) => ipcRenderer.invoke('capture:subject-images', subjectId),
  selectCaptureImage: (subjectId, imageId) => ipcRenderer.invoke('capture:select-image', subjectId, imageId),
  onCaptureImageImported: (callback) => {
    ipcRenderer.removeAllListeners('capture:image-imported');
    ipcRenderer.on('capture:image-imported', (_event, payload) => callback(payload));
  },
  onTrecsMenuAction: (callback) => {
    ipcRenderer.removeAllListeners('menu:trecs-action');
    ipcRenderer.on('menu:trecs-action', (_event, action) => callback(action));
  },
  getOrderEnvelopePreview: (orderId) => ipcRenderer.invoke('envelope:order-preview', orderId),
  getUnlinkedEnvelopeScans: (jobId) => ipcRenderer.invoke('envelope:unlinked-list', jobId),
  getEnvelopeScanPreview: (scanId) => ipcRenderer.invoke('envelope:scan-preview', scanId),
  assignEnvelopeScan: (scanId, subjectId) => ipcRenderer.invoke('envelope:assign-scan', scanId, subjectId),
  deleteEnvelopeScan: (scanId) => ipcRenderer.invoke('envelope:delete-scan', scanId),
  onEnvelopeScanImported: (callback) => {
    ipcRenderer.removeAllListeners('envelope:scan-imported');
    ipcRenderer.on('envelope:scan-imported', (_event, payload) => callback(payload));
  },
  createEnvelopeOrder: (jobId, subjectId, input) => ipcRenderer.invoke('envelope:create-order', jobId, subjectId, input),
  linkSubjectImage: (subjectId, imageId) => ipcRenderer.invoke('image:link-subject', subjectId, imageId),
  getImagePreview: (imageId) => ipcRenderer.invoke('image:preview', imageId),
  prepareLaptopPackage: (jobId) => ipcRenderer.invoke('laptop-package:prepare', jobId),
  getEndOfDayPreview: (jobId) => ipcRenderer.invoke('end-of-day:preview', jobId),
  createEndOfDayPackage: (jobId, adjustments) => ipcRenderer.invoke('end-of-day:create', jobId, adjustments)
});
