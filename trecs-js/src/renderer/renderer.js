const databasePath = document.getElementById('databasePath');
const appShell = document.getElementById('appShell');
const toggleSidebarButton = document.getElementById('toggleSidebarButton');
const metricGrid = document.getElementById('metricGrid');
const jobsTableBody = document.getElementById('jobsTableBody');
const migrationList = document.getElementById('migrationList');
const title = document.querySelector('.topbar h1');
const navButtons = document.querySelectorAll('nav button');
const viewButtons = document.querySelectorAll('[data-view-button]');
const viewTargets = document.querySelectorAll('[data-view-target]');
const dashboardView = document.getElementById('dashboardView');
const jobsView = document.getElementById('jobsView');
const productsView = document.getElementById('productsView');
const productsPageContent = document.getElementById('productsPageContent');
const eventsView = document.getElementById('eventsView');
const eventJobSelect = document.getElementById('eventJobSelect');
const eventFallJobSelect = document.getElementById('eventFallJobSelect');
const linkEventFallJobButton = document.getElementById('linkEventFallJobButton');
const importEventImagesButton = document.getElementById('importEventImagesButton');
const createEventJobButton = document.getElementById('createEventJobButton');
const eventSetupStatus = document.getElementById('eventSetupStatus');
const eventWorkflowEmpty = document.getElementById('eventWorkflowEmpty');
const eventWorkflowLayout = document.getElementById('eventWorkflowLayout');
const eventQueueCount = document.getElementById('eventQueueCount');
const eventImageNumberSearch = document.getElementById('eventImageNumberSearch');
const eventQueueFilters = document.getElementById('eventQueueFilters');
const eventImageQueue = document.getElementById('eventImageQueue');
const eventCurrentImageNumber = document.getElementById('eventCurrentImageNumber');
const eventCurrentStatus = document.getElementById('eventCurrentStatus');
const eventPhotoPreview = document.getElementById('eventPhotoPreview');
const eventFallPreview = document.getElementById('eventFallPreview');
const eventExistingLinks = document.getElementById('eventExistingLinks');
const eventAddAnotherButton = document.getElementById('eventAddAnotherButton');
const eventStudentSearch = document.getElementById('eventStudentSearch');
const eventGradeFilter = document.getElementById('eventGradeFilter');
const eventHomeroomFilter = document.getElementById('eventHomeroomFilter');
const eventCandidateCount = document.getElementById('eventCandidateCount');
const eventStudentResults = document.getElementById('eventStudentResults');
const eventOrderForm = document.getElementById('eventOrderForm');
const eventSelectedStudent = document.getElementById('eventSelectedStudent');
const eventPackageCodeShortcuts = document.getElementById('eventPackageCodeShortcuts');
const eventOrderStatus = document.getElementById('eventOrderStatus');
const eventSaveStayButton = document.getElementById('eventSaveStayButton');
const eventSaveNextButton = document.getElementById('eventSaveNextButton');
const studentListsView = document.getElementById('studentListsView');
const studentListJobSelect = document.getElementById('studentListJobSelect');
const studentListSearch = document.getElementById('studentListSearch');
const studentListsSaved = document.getElementById('studentListsSaved');
const studentListAvailable = document.getElementById('studentListAvailable');
const studentListMembers = document.getElementById('studentListMembers');
const studentListName = document.getElementById('studentListName');
const studentListCount = document.getElementById('studentListCount');
const studentListMemberCount = document.getElementById('studentListMemberCount');
const studentListStatus = document.getElementById('studentListStatus');
const newStudentListButton = document.getElementById('newStudentListButton');
const addSelectedStudentsButton = document.getElementById('addSelectedStudentsButton');
const saveStudentListButton = document.getElementById('saveStudentListButton');
const deleteStudentListButton = document.getElementById('deleteStudentListButton');
const onlineOrdersView = document.getElementById('onlineOrdersView');
const onlineOrderJobSelect = document.getElementById('onlineOrderJobSelect');
const chooseOnlineOrderFileButton = document.getElementById('chooseOnlineOrderFileButton');
const onlineOrderFileName = document.getElementById('onlineOrderFileName');
const onlineOrderMapping = document.getElementById('onlineOrderMapping');
const onlineOrderSummary = document.getElementById('onlineOrderSummary');
const onlineOrderPreviewBody = document.getElementById('onlineOrderPreviewBody');
const onlineOrderStatus = document.getElementById('onlineOrderStatus');
const importOnlineOrdersButton = document.getElementById('importOnlineOrdersButton');
const unitRenderView = document.getElementById('unitRenderView');
const unitRenderForm = document.getElementById('unitRenderForm');
const unitRenderFilterField = document.getElementById('unitRenderFilterField');
const unitRenderFilterLabel = document.getElementById('unitRenderFilterLabel');
const unitRenderMetrics = document.getElementById('unitRenderMetrics');
const unitRenderProgress = document.getElementById('unitRenderProgress');
const unitRenderStatus = document.getElementById('unitRenderStatus');
const exportImagePrepButton = document.getElementById('exportImagePrepButton');
const browseUnitRenderOutputButton = document.getElementById('browseUnitRenderOutputButton');
const startUnitRenderButton = document.getElementById('startUnitRenderButton');
const batchRenderView = document.getElementById('batchRenderView');
const batchRenderForm = document.getElementById('batchRenderForm');
const batchRenderJobs = document.getElementById('batchRenderJobs');
const batchRenderHistory = document.getElementById('batchRenderHistory');
const batchRenderProgress = document.getElementById('batchRenderProgress');
const batchRenderStatus = document.getElementById('batchRenderStatus');
const browseBatchRenderOutputButton = document.getElementById('browseBatchRenderOutputButton');
const refreshBatchRenderButton = document.getElementById('refreshBatchRenderButton');
const startBatchRenderButton = document.getElementById('startBatchRenderButton');
const compositesView = document.getElementById('compositesView');
const compositeJobSelect = document.getElementById('compositeJobSelect');
const compositeJobMetrics = document.getElementById('compositeJobMetrics');
const compositeClassCount = document.getElementById('compositeClassCount');
const compositeClassList = document.getElementById('compositeClassList');
const compositePreviewType = document.getElementById('compositePreviewType');
const compositeFeaturedField = document.getElementById('compositeFeaturedField');
const compositeFeaturedStudent = document.getElementById('compositeFeaturedStudent');
const refreshCompositePreviewButton = document.getElementById('refreshCompositePreviewButton');
const compositePreviewStage = document.getElementById('compositePreviewStage');
const compositePreviewMeta = document.getElementById('compositePreviewMeta');
const compositeRenderForm = document.getElementById('compositeRenderForm');
const browseCompositeOutputButton = document.getElementById('browseCompositeOutputButton');
const compositeProgress = document.getElementById('compositeProgress');
const compositeStatus = document.getElementById('compositeStatus');
const renderCompositesButton = document.getElementById('renderCompositesButton');
const jobActionsMenu = document.getElementById('jobActionsMenu');
const jobTypeFilters = document.getElementById('jobTypeFilters');
const jobSearchInput = document.getElementById('jobSearchInput');
const jobsScreenTableBody = document.getElementById('jobsScreenTableBody');
const jobsCountLabel = document.getElementById('jobsCountLabel');
const jobDetailPanel = document.getElementById('jobDetailPanel');
const jobWorkflowTabs = document.getElementById('jobWorkflowTabs');
const jobWorkflowContent = document.getElementById('jobWorkflowContent');
const jobStudentWorkspace = document.getElementById('jobStudentWorkspace');
const backToJobsButton = document.getElementById('backToJobsButton');
const workspaceJobTitle = document.getElementById('workspaceJobTitle');
const workspaceJobMeta = document.getElementById('workspaceJobMeta');
const workspaceStudentsButton = document.getElementById('workspaceStudentsButton');
const workspaceCaptureButton = document.getElementById('workspaceCaptureButton');
const workspaceEnvelopeButton = document.getElementById('workspaceEnvelopeButton');
const workspaceAdminItemsButton = document.getElementById('workspaceAdminItemsButton');
const workspaceAddBlankButton = document.getElementById('workspaceAddBlankButton');
const workspaceEditStudentButton = document.getElementById('workspaceEditStudentButton');
const workspaceEditJobButton = document.getElementById('workspaceEditJobButton');
const workspacePreviousButton = document.getElementById('workspacePreviousButton');
const workspaceNextButton = document.getElementById('workspaceNextButton');
const workspaceStudentCount = document.getElementById('workspaceStudentCount');
const workspaceStudentSearch = document.getElementById('workspaceStudentSearch');
const workspaceStudentList = document.getElementById('workspaceStudentList');
const workspaceStudentDetail = document.getElementById('workspaceStudentDetail');
const workspaceOrderDetail = document.getElementById('workspaceOrderDetail');
const addRecordsModal = document.getElementById('addRecordsModal');
const addRecordsForm = document.getElementById('addRecordsForm');
const cancelAddRecordsButton = document.getElementById('cancelAddRecordsButton');
const addRecordsStatus = document.getElementById('addRecordsStatus');
const captureWorkspace = document.getElementById('captureWorkspace');
const captureEntryForm = document.getElementById('captureEntryForm');
const captureEntryStatus = document.getElementById('captureEntryStatus');
const captureStudentSearchResults = document.getElementById('captureStudentSearchResults');
const captureSubjectDetail = document.getElementById('captureSubjectDetail');
const captureCompareGrid = document.getElementById('captureCompareGrid');
const capturePreviewMeta = document.getElementById('capturePreviewMeta');
const capturePairStatus = document.getElementById('capturePairStatus');
const capturePhotoCount = document.getElementById('capturePhotoCount');
const captureBackToStudentsButton = document.getElementById('captureBackToStudentsButton');
const captureSessionMeta = document.getElementById('captureSessionMeta');
const captureFileModeControl = document.getElementById('captureFileModeControl');
const captureFileModeToggle = document.getElementById('captureFileModeToggle');
const captureLoginModal = document.getElementById('captureLoginModal');
const captureLoginForm = document.getElementById('captureLoginForm');
const cancelCaptureLoginButton = document.getElementById('cancelCaptureLoginButton');
const captureLoginStatus = document.getElementById('captureLoginStatus');
const imageReviewWorkspace = document.getElementById('imageReviewWorkspace');
const pictureDayWorkspace = document.getElementById('pictureDayWorkspace');
const pictureDayPrepStatus = document.getElementById('pictureDayPrepStatus');
const pictureDayPrepContent = document.getElementById('pictureDayPrepContent');
const pictureDayEodHistory = document.getElementById('pictureDayEodHistory');
const refreshPictureDayPrepButton = document.getElementById('refreshPictureDayPrepButton');
const envelopeWorkspace = document.getElementById('envelopeWorkspace');
const envelopeEntryForm = document.getElementById('envelopeEntryForm');
const envelopeEntryStatus = document.getElementById('envelopeEntryStatus');
const envelopeSubjectDetail = document.getElementById('envelopeSubjectDetail');
const envelopePreview = document.getElementById('envelopePreview');
const envelopePreviewMeta = document.getElementById('envelopePreviewMeta');
const envelopeStudentSearchResults = document.getElementById('envelopeStudentSearchResults');
const envelopeConfirmModal = document.getElementById('envelopeConfirmModal');
const envelopeConfirmMessage = document.getElementById('envelopeConfirmMessage');
const confirmEnvelopeButton = document.getElementById('confirmEnvelopeButton');
const cancelEnvelopeConfirmButton = document.getElementById('cancelEnvelopeConfirmButton');
const orderEnvelopeModal = document.getElementById('orderEnvelopeModal');
const orderEnvelopeTitle = document.getElementById('orderEnvelopeTitle');
const orderEnvelopePreview = document.getElementById('orderEnvelopePreview');
const closeOrderEnvelopeButton = document.getElementById('closeOrderEnvelopeButton');
const orderEnvelopeActions = document.getElementById('orderEnvelopeActions');
const assignEnvelopeScanButton = document.getElementById('assignEnvelopeScanButton');
const deleteEnvelopeScanButton = document.getElementById('deleteEnvelopeScanButton');
const imageLightboxModal = document.getElementById('imageLightboxModal');
const imageLightboxTitle = document.getElementById('imageLightboxTitle');
const imageLightboxContent = document.getElementById('imageLightboxContent');
const closeImageLightboxButton = document.getElementById('closeImageLightboxButton');
const previousLightboxImageButton = document.getElementById('previousLightboxImageButton');
const nextLightboxImageButton = document.getElementById('nextLightboxImageButton');
const selectLightboxImageButton = document.getElementById('selectLightboxImageButton');
const imageHoverPreview = document.getElementById('imageHoverPreview');
const cropToolModal = document.getElementById('cropToolModal');
const cropToolCanvas = document.getElementById('cropToolCanvas');
const closeCropToolButton = document.getElementById('closeCropToolButton');
const chooseCropToolImageButton = document.getElementById('chooseCropToolImageButton');
const chooseCropToolInputFolderButton = document.getElementById('chooseCropToolInputFolderButton');
const chooseCropToolOutputFolderButton = document.getElementById('chooseCropToolOutputFolderButton');
const cropToolFolderSummary = document.getElementById('cropToolFolderSummary');
const cropToolImageList = document.getElementById('cropToolImageList');
const rotateCropToolButton = document.getElementById('rotateCropToolButton');
const cropToolZoom = document.getElementById('cropToolZoom');
const resetCropToolButton = document.getElementById('resetCropToolButton');
const saveCropToolButton = document.getElementById('saveCropToolButton');
const cropToolStatus = document.getElementById('cropToolStatus');
const studentFieldSettingsModal = document.getElementById('studentFieldSettingsModal');
const studentFieldSettingsForm = document.getElementById('studentFieldSettingsForm');
const studentFieldSettingsList = document.getElementById('studentFieldSettingsList');
const studentFieldSettingsStatus = document.getElementById('studentFieldSettingsStatus');
const cancelStudentFieldSettingsButton = document.getElementById('cancelStudentFieldSettingsButton');
const applyStudentFieldsToAllButton = document.getElementById('applyStudentFieldsToAllButton');
const editOrderModal = document.getElementById('editOrderModal');
const editOrderForm = document.getElementById('editOrderForm');
const editOrderTitle = document.getElementById('editOrderTitle');
const editOrderStatus = document.getElementById('editOrderStatus');
const editOrderEnvelopePreview = document.getElementById('editOrderEnvelopePreview');
const cancelEditOrderButton = document.getElementById('cancelEditOrderButton');
const deleteOrderButton = document.getElementById('deleteOrderButton');
const endOfDayModal = document.getElementById('endOfDayModal');
const endOfDayModalTitle = document.getElementById('endOfDayModalTitle');
const endOfDayReview = document.getElementById('endOfDayReview');
const endOfDayStatus = document.getElementById('endOfDayStatus');
const endOfDayActionNote = document.getElementById('endOfDayActionNote');
const cancelEndOfDayButton = document.getElementById('cancelEndOfDayButton');
const confirmEndOfDayButton = document.getElementById('confirmEndOfDayButton');
const croppedMediumModal = document.getElementById('croppedMediumModal');
const croppedMediumProgress = document.getElementById('croppedMediumProgress');
const croppedMediumStatus = document.getElementById('croppedMediumStatus');
const croppedMediumSummary = document.getElementById('croppedMediumSummary');
const closeCroppedMediumButton = document.getElementById('closeCroppedMediumButton');
const cameraCardsModal = document.getElementById('cameraCardsModal');
const cameraCardsForm = document.getElementById('cameraCardsForm');
const cancelCameraCardsButton = document.getElementById('cancelCameraCardsButton');
const browseCameraCardsOutputButton = document.getElementById('browseCameraCardsOutputButton');
const cameraCardsFilterLabel = document.getElementById('cameraCardsFilterLabel');
const cameraCardsProgress = document.getElementById('cameraCardsProgress');
const cameraCardsStatus = document.getElementById('cameraCardsStatus');
const cameraCardsSummary = document.getElementById('cameraCardsSummary');
const createCameraCardsButton = document.getElementById('createCameraCardsButton');
const schoolDataModal = document.getElementById('schoolDataModal');
const schoolDataFilePath = document.getElementById('schoolDataFilePath');
const schoolDataMapping = document.getElementById('schoolDataMapping');
const schoolDataPreview = document.getElementById('schoolDataPreview');
const schoolDataStatus = document.getElementById('schoolDataStatus');
const schoolDataBlankCount = document.getElementById('schoolDataBlankCount');
const cancelSchoolDataButton = document.getElementById('cancelSchoolDataButton');
const browseSchoolDataButton = document.getElementById('browseSchoolDataButton');
const confirmSchoolDataButton = document.getElementById('confirmSchoolDataButton');
const refreshUnlinkedEnvelopesButton = document.getElementById('refreshUnlinkedEnvelopesButton');
const unlinkedEnvelopeList = document.getElementById('unlinkedEnvelopeList');
const adminItemsWorkspace = document.getElementById('adminItemsWorkspace');
const adminOptionsForm = document.getElementById('adminOptionsForm');
const adminItemsStatus = document.getElementById('adminItemsStatus');
const adminItemsList = document.getElementById('adminItemsList');
const browseAdminOutputFolderButton = document.getElementById('browseAdminOutputFolderButton');
const runAdminItemsButton = document.getElementById('runAdminItemsButton');
const adminItemsProgress = document.getElementById('adminItemsProgress');
const adminItemsProgressText = document.getElementById('adminItemsProgressText');
const adminItemsHistoryCount = document.getElementById('adminItemsHistoryCount');
const adminItemsHistory = document.getElementById('adminItemsHistory');
const openIdTemplateDesignerButton = document.getElementById('openIdTemplateDesignerButton');
const idTemplateWorkspace = document.getElementById('idTemplateWorkspace');
const idTemplateBackButton = document.getElementById('idTemplateBackButton');
const newIdTemplateButton = document.getElementById('newIdTemplateButton');
const idTemplateList = document.getElementById('idTemplateList');
const idTemplateForm = document.getElementById('idTemplateForm');
const chooseIdTemplateBackgroundButton = document.getElementById('chooseIdTemplateBackgroundButton');
const idTemplateStatus = document.getElementById('idTemplateStatus');
const idTemplateStage = document.getElementById('idTemplateStage');
const idTemplateProperties = document.getElementById('idTemplateProperties');
const idTemplateFolderLabel = document.getElementById('idTemplateFolderLabel');
const newSchoolButton = document.getElementById('newSchoolButton');
const newSchoolPanel = document.getElementById('newSchoolPanel');
const newSchoolForm = document.getElementById('newSchoolForm');
const cancelNewSchoolButton = document.getElementById('cancelNewSchoolButton');
const newSchoolStatus = document.getElementById('newSchoolStatus');
const newJobButton = document.getElementById('newJobButton');
const newJobPanel = document.getElementById('newJobPanel');
const newJobForm = document.getElementById('newJobForm');
const cancelNewJobButton = document.getElementById('cancelNewJobButton');
const newJobStatus = document.getElementById('newJobStatus');
const importPreviousJobButton = document.getElementById('importPreviousJobButton');
const loadOnsiteSetupButton = document.getElementById('loadOnsiteSetupButton');
const loadEndOfDayButton = document.getElementById('loadEndOfDayButton');
const importPreviousJobPanel = document.getElementById('importPreviousJobPanel');
const importPreviousJobForm = document.getElementById('importPreviousJobForm');
const cancelImportPreviousJobButton = document.getElementById('cancelImportPreviousJobButton');
const browsePreviousJobFolderButton = document.getElementById('browsePreviousJobFolderButton');
const importPreviousJobStatus = document.getElementById('importPreviousJobStatus');
const editJobModal = document.getElementById('editJobModal');
const editJobForm = document.getElementById('editJobForm');
const cancelEditJobButton = document.getElementById('cancelEditJobButton');
const editJobStatus = document.getElementById('editJobStatus');

let jobsState = {
  jobs: [],
  types: [],
  clients: [],
  packagePlans: [],
  idCardTemplates: [],
  selectedType: 'all',
  sortKey: 'location',
  sortDirection: 'asc',
  selectedJobId: null,
  search: '',
  selectedTab: 'subjects',
  detail: null,
  selectedImageId: null,
  selectedImageSubjectId: null,
  selectedSubjectId: null,
  selectedOrderId: null,
  jobWorkspaceOpen: false,
  workspaceMode: 'students',
  workspaceStudentSearch: '',
  captureSubject: null,
  captureImages: [],
  captureCompareSlotIds: null,
  captureSearchResults: [],
  captureSearchActiveIndex: -1,
  captureSearchTimer: null,
  captureSubjectEditId: null,
  captureFileMode: 'jpg_raw',
  captureShootStage: 'main',
  captureSession: null,
  pendingCaptureJobId: null,
  envelopeSubject: null,
  envelopeScan: null,
  envelopePending: null,
  envelopeWatcherSubjectId: null,
  envelopeSearchResults: [],
  envelopeSearchActiveIndex: -1,
  envelopeSearchTimer: null,
  unlinkedEnvelopeScans: [],
  viewingEnvelopeScanId: null,
  editingOrderId: null,
  showStudentEditForm: false,
  showAddRecordsModal: false,
  adminItems: null,
  adminItemsLoading: false,
  pictureDayPrep: null,
  pictureDayPrepLoading: false,
  adminStage: 'original_picture_day',
  adminSortBy: 'grade',
  expandedAdminItem: null,
  adminOutputFolder: '',
  selectedAdminItems: [
    'delivery_envelope_cover',
    'school_directory',
    'missing_photo_report',
    'id_cards',
    'sis_student_cd',
    'sis_powerschool',
    'staff_med'
  ],
  adminRunStatus: {
    running: false,
    progress: 0,
    message: 'Ready'
  },
  idTemplateDesigner: {
    loaded: false,
    folder: '',
    templates: [],
    backgrounds: [],
    template: null,
    selectedTemplateId: null,
    selectedElement: 'photo',
    drag: null
  },
  sisStudentCd: true,
  sisDestiny: false,
  sisPowerSchool: false,
  sisSasi: false,
  idCardSource: 'all',
  idCardListName: '',
  idCardReason: 'admin_batch',
  idCardSortMethod: 'alpha_grade',
  idCardPhotographedOnly: true,
  cameraCardSource: 'all',
  cameraCardSourceValue: '',
  cameraCardListName: '',
  cameraCardSortMethod: 'alpha_grade',
  cameraCardsDialog: {
    jobId: null,
    loading: false,
    running: false,
    listNames: [],
    filterOptions: {
      grades: [],
      homerooms: [],
      tracks: []
    }
  },
  directoryType: 'mugbook',
  directorySource: 'all',
  directoryListName: '',
  directorySortMethod: 'alpha_grade',
  directorySchoolYear: '2025-2026',
  directoryContactLine: 'Island Photography: 559-456-1400',
  directoryPhotographedOnly: false,
  stickerSource: 'all',
  stickerListName: '',
  stickerCopies: 3,
  stickerSortMethod: 'alpha',
  stickerPhotographedOnly: false,
  orderRenderFilter: 'all',
  subjectSearch: '',
  imageSearch: '',
  imageLinkSubjectSearch: '',
  imageReviewSearchTimer: null,
  lastLaptopPackage: null,
  lastEndOfDayPackage: null,
  lastCroppedImageSync: null,
  lastCroppedMediumGeneration: null,
  imagePreviewCache: new Map(),
  imageHoverToken: 0,
  lightboxImageIds: [],
  lightboxImageId: null,
  lightboxSubjectId: null,
  studentFieldSettings: null,
  studentFieldSettingsScope: 'global',
  endOfDayReview: null,
  endOfDayCollapsed: {
    capturedImages: true,
    newSubjects: false,
    editedSubjects: false
  },
  schoolDataImport: null,
  showNewSchoolForm: false,
  selectedNewClientId: null,
  showNewJobForm: false,
  showImportPreviousJobForm: false,
  unitRenderSetup: null,
  unitRenderRunning: false,
  studentListSetup: null,
  studentListId: null,
  studentListMemberIds: [],
  studentListCheckedIds: new Set(),
  onlineOrderPreview: null,
  batchRenderSetup: null,
  batchRenderRunning: false,
  eventSetup: null,
  eventQueueFilter: 'all',
  eventCandidates: [],
  eventSelectedCandidateId: null,
  eventSearchTimer: null,
  eventSaving: false,
  compositeSetup: null,
  compositeHomeroom: '',
  compositePreviewKind: 'traditional',
  compositeRunning: false,
  cropTool: {
    image: null,
    files: [],
    currentIndex: -1,
    inputFolder: '',
    outputFolder: '',
    filename: '',
    sourcePath: '',
    rotation: 0,
    zoom: 1,
    minZoom: 1,
    offsetX: 0,
    offsetY: 0,
    dragging: false,
    dragStartX: 0,
    dragStartY: 0,
    dragOffsetX: 0,
    dragOffsetY: 0
  }
};

const activeJobLockIds = new Set();

if (window.trecs && databasePath) {
  databasePath.textContent = window.trecs.prototypeDatabasePath;
}

if (window.trecs && typeof window.trecs.onTrecsMenuAction === 'function') {
  window.trecs.onTrecsMenuAction((action) => {
    handleTrecsMenuAction(action).catch((error) => {
      console.error(error);
      window.alert(error.message || 'Menu action failed');
    });
  });
}

if (window.trecs && typeof window.trecs.onCroppedMediumProgress === 'function') {
  window.trecs.onCroppedMediumProgress((payload) => {
    updateCroppedMediumProgress(payload);
  });
}

if (window.trecs && typeof window.trecs.onUnitRenderProgress === 'function') {
  window.trecs.onUnitRenderProgress((payload) => {
    const total = Number(payload.total || 0);
    const current = Number(payload.current || 0);
    unitRenderProgress.max = total || 100;
    unitRenderProgress.value = total ? current : 0;
    unitRenderStatus.textContent = payload.message || 'Rendering...';
  });
}

if (window.trecs && typeof window.trecs.onCompositeProgress === 'function') {
  window.trecs.onCompositeProgress((payload) => {
    const total = Number(payload.total || 0);
    const current = Number(payload.current || 0);
    compositeProgress.max = total || 100;
    compositeProgress.value = total ? current : 0;
    compositeStatus.textContent = payload.message || 'Rendering composites...';
  });
}

if (window.trecs && typeof window.trecs.onBatchRenderProgress === 'function') {
  window.trecs.onBatchRenderProgress((payload) => {
    const total = Number(payload.total || 0); const current = Number(payload.current || 0);
    batchRenderProgress.max = total || 100; batchRenderProgress.value = total ? current : 0;
    batchRenderStatus.textContent = payload.message || 'Batch rendering...';
  });
}

const STUDENT_FIELD_DEFINITIONS = [
  { key: 'firstName', label: 'First Name', editOnly: true },
  { key: 'lastName', label: 'Last Name', editOnly: true },
  { key: 'externalId', label: 'Student ID' },
  { key: 'grade', label: 'Grade' },
  { key: 'homeroom', label: 'Homeroom' },
  { key: 'track', label: 'Track' },
  { key: 'team', label: 'Team' },
  { key: 'subjectType', label: 'Type' },
  { key: 'photographedStatus', label: 'Photo Status', editOnly: true }
];
const DEFAULT_STUDENT_VISIBLE_FIELDS = Object.fromEntries(
  STUDENT_FIELD_DEFINITIONS.map((field) => [field.key, true])
);

function trecsApi(methodName) {
  if (!window.trecs) {
    throw new Error('TRECS app bridge is not loaded. Close all TRECS windows and start the app with npm start.');
  }
  if (methodName && typeof window.trecs[methodName] !== 'function') {
    throw new Error('TRECS app bridge is out of date. Close all TRECS windows and restart the app.');
  }
  return window.trecs;
}

function formatNumber(value) {
  return Number(value).toLocaleString();
}

function formatType(type) {
  return String(type || '')
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function formatShortDateTime(value) {
  if (!value) {
    return '';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

function formatImageSource(source) {
  const sourceText = String(source || '').replace(/_/g, ' ').trim();
  return sourceText ? formatType(sourceText) : 'Unknown Source';
}

function formatShootStage(stage) {
  return {
    main: 'Main Picture Day',
    makeup: 'Makeup Day',
    retake: 'Retake',
    other: 'Other'
  }[stage] || formatType(stage || 'other');
}

function imageFolderName(imagePath) {
  const parts = String(imagePath || '').split(/[\\/]/).filter(Boolean);
  return parts.length > 1 ? parts[parts.length - 2] : '';
}

function linkedImageFolderLine(image) {
  const displayFolder = imageFolderName(image.displayPath || image.currentPath);
  const originalFolder = imageFolderName(image.currentPath);
  if (displayFolder && originalFolder && displayFolder !== originalFolder) {
    return `Using ${displayFolder}, original ${originalFolder}`;
  }
  if (displayFolder) {
    return `Folder ${displayFolder}`;
  }
  return '';
}

function linkedImageMetaLine(image) {
  const addedDate = formatShortDateTime(image.importedAt || image.capturedAt);
  const capturedDate = image.capturedAt && image.importedAt && image.importedAt !== image.capturedAt
    ? formatShortDateTime(image.capturedAt)
    : '';
  const parts = [];
  if (addedDate) {
    parts.push(`Added ${addedDate}`);
  }
  if (capturedDate) {
    parts.push(`Captured ${capturedDate}`);
  }
  parts.push(image.shootStageLabel || (image.shootStage ? formatShootStage(image.shootStage) : formatImageSource(image.source)));
  if (image.captureFileMode) {
    parts.push(image.captureFileMode === 'jpg_only' ? 'JPG only' : 'JPG + CR3');
  }
  if (image.captureWorkstation) {
    parts.push(image.captureWorkstation);
  }
  parts.push(linkedImageFolderLine(image));
  return parts.filter(Boolean).join(' / ');
}

function renderMetrics(counts) {
  metricGrid.innerHTML = counts
    .map((count) => `
      <article>
        <span>${count.label}</span>
        <strong>${formatNumber(count.value)}</strong>
      </article>
    `)
    .join('');
}

function renderJobs(jobs) {
  jobsTableBody.innerHTML = jobs
    .map((job) => `
      <tr>
        <td>${job.location}</td>
        <td>${job.job}</td>
        <td>${formatType(job.type)}</td>
        <td>${job.packagePlan}</td>
        <td><span class="status ready">${job.status}</span></td>
      </tr>
    `)
    .join('');
}

function renderMigration(items) {
  migrationList.innerHTML = items
    .map((item) => `
      <div>
        <dt>${item.label}</dt>
        <dd>${item.value || 'None'}</dd>
      </div>
    `)
    .join('');
}

function jobsViewTitle() {
  if (jobsState.selectedTab === 'orders') {
    return 'Orders';
  }
  if (jobsState.selectedTab === 'capture') {
    return 'Capture';
  }
  if (jobsState.selectedTab === 'pictureDay') {
    return 'Picture Day';
  }
  if (jobsState.selectedTab === 'products') {
    return 'Products';
  }
  return 'Jobs';
}

function updateMainNavigation(view) {
  navButtons.forEach((button) => {
    const matchesMainView = button.dataset.viewButton === view
      && !(view === 'jobs' && jobsState.selectedTab !== 'subjects');
    const matchesJobTarget = button.dataset.viewTarget === view
      && button.dataset.jobTabTarget === jobsState.selectedTab;
    button.classList.toggle('active', matchesMainView || matchesJobTarget);
  });
}

function updateMenuContext() {
  if (!window.trecs || typeof window.trecs.setMenuContext !== 'function') {
    return;
  }
  const context = jobsState.jobWorkspaceOpen
    ? (jobsState.workspaceMode === 'students' ? 'student' : jobsState.workspaceMode === 'capture' ? 'capture' : 'default')
    : 'job';
  window.trecs.setMenuContext(context).catch((error) => console.error(error));
}

function setView(view) {
  if (studentListsView.classList.contains('active-view') && view !== 'studentLists' && jobsState.studentListSetup?.selectedJobId) {
    releaseUiJobLocks(jobsState.studentListSetup.selectedJobId).catch((error) => console.error(error));
  }
  if (eventsView.classList.contains('active-view') && view !== 'events' && jobsState.eventSetup?.selectedEventJobId) {
    releaseUiJobLocks(jobsState.eventSetup.selectedEventJobId).catch((error) => console.error(error));
  }
  dashboardView.classList.toggle('active-view', view === 'dashboard');
  jobsView.classList.toggle('active-view', view === 'jobs');
  productsView.classList.toggle('active-view', view === 'products');
  eventsView.classList.toggle('active-view', view === 'events');
  studentListsView.classList.toggle('active-view', view === 'studentLists');
  onlineOrdersView.classList.toggle('active-view', view === 'onlineOrders');
  unitRenderView.classList.toggle('active-view', view === 'unitRender');
  batchRenderView.classList.toggle('active-view', view === 'batchRender');
  compositesView.classList.toggle('active-view', view === 'composites');
  title.textContent = view === 'jobs' ? jobsViewTitle() : view === 'events' ? 'Events' : view === 'products' ? 'Products' : view === 'studentLists' ? 'Student Lists' : view === 'onlineOrders' ? 'Online Orders' : view === 'unitRender' ? 'Unit Render' : view === 'batchRender' ? 'Batch Render' : view === 'composites' ? 'Class Composites' : 'Dashboard';
  updateMainNavigation(view);
  if (!jobsState.jobWorkspaceOpen) {
    updateMenuContext();
  }

  if (view === 'jobs' && jobsState.jobs.length === 0) {
    loadJobs().catch(showJobsLoadError);
  }
  if (view === 'products') {
    renderProductsPage().catch((error) => {
      productsPageContent.innerHTML = `<div class="empty-state">${escapeHtml(error.message || 'Could not load package plans.')}</div>`;
    });
  }
  if (view === 'events') {
    loadEventWorkflow().catch((error) => { eventSetupStatus.textContent = error.message || 'Could not load event workflow.'; });
  }
  if (view === 'unitRender') {
    loadUnitRenderSetup().catch((error) => {
      unitRenderStatus.textContent = error.message || 'Could not load the render queue.';
    });
  }
  if (view === 'studentLists') {
    loadStudentListSetup().catch((error) => { studentListStatus.textContent = error.message || 'Could not load student lists.'; });
  }
  if (view === 'onlineOrders') {
    loadOnlineOrderJobs().catch((error) => { onlineOrderStatus.textContent = error.message || 'Could not load jobs.'; });
  }
  if (view === 'batchRender') {
    loadBatchRenderSetup().catch((error) => { batchRenderStatus.textContent = error.message || 'Could not load batch rendering.'; });
  }
  if (view === 'composites') {
    if (!jobsState.compositeSetup) {
      loadCompositeSetup().catch((error) => {
        compositeStatus.textContent = error.message || 'Could not load composite classes.';
      });
    }
  }
}

function setJobsWorkspaceMode(open) {
  jobsState.jobWorkspaceOpen = open;
  document.querySelector('.app-shell').classList.toggle('workspace-mode', open);
  document.querySelector('.jobs-toolbar').hidden = open;
  newSchoolPanel.hidden = open || !jobsState.showNewSchoolForm;
  newJobPanel.hidden = open || !jobsState.showNewJobForm;
  importPreviousJobPanel.hidden = open || !jobsState.showImportPreviousJobForm;
  document.querySelector('.jobs-layout').hidden = open;
  document.getElementById('jobWorkflowPanel').hidden = true;
  jobStudentWorkspace.hidden = !open;
  updateMenuContext();
}

function showJobsLoadError(error) {
  jobsScreenTableBody.innerHTML = '';
  jobsCountLabel.textContent = 'Load failed';
  if (jobDetailPanel) {
    jobDetailPanel.innerHTML = `
      <div class="panel-heading">
        <h2>Job Detail</h2>
      </div>
      <div class="empty-state">${escapeHtml(error.message || 'Could not load jobs.')}</div>
    `;
  }
  jobWorkflowContent.innerHTML = '<div class="empty-state">Jobs could not be loaded.</div>';
  console.error(error);
}

function filteredJobs() {
  const search = jobsState.search.toLowerCase();
  const rows = jobsState.jobs.filter((job) => {
    const matchesType = jobsState.selectedType === 'all' || job.type === jobsState.selectedType;
    const matchesSearch = !search ||
      String(job.location || '').toLowerCase().includes(search) ||
      String(job.job || '').toLowerCase().includes(search) ||
      String(job.packagePlan || '').toLowerCase().includes(search);
    return matchesType && matchesSearch;
  });

  return rows.sort((first, second) => compareJobs(first, second));
}

function compareJobs(first, second) {
  const direction = jobsState.sortDirection === 'desc' ? -1 : 1;
  const firstValue = String(first[jobsState.sortKey] || '').toLowerCase();
  const secondValue = String(second[jobsState.sortKey] || '').toLowerCase();
  const valueCompare = firstValue.localeCompare(secondValue, undefined, {
    numeric: true,
    sensitivity: 'base'
  });

  if (valueCompare !== 0) {
    return valueCompare * direction;
  }

  return String(first.job || '').localeCompare(String(second.job || ''), undefined, {
    numeric: true,
    sensitivity: 'base'
  });
}

function sortIndicator(key) {
  if (jobsState.sortKey !== key) {
    return '';
  }

  return jobsState.sortDirection === 'asc' ? ' (A-Z)' : ' (Z-A)';
}

function sortLabel(key) {
  const labels = {
    location: 'Location',
    job: 'Job',
    type: 'Type',
    packagePlan: 'Package Plan'
  };
  return labels[key] || key;
}

function renderJobTypeFilters() {
  const filters = [
    { type: 'all', label: 'All', count: jobsState.jobs.length },
    ...jobsState.types.map((type) => ({
      type: type.type,
      label: formatType(type.type),
      count: type.count
    }))
  ];

  jobTypeFilters.innerHTML = filters
    .map((filter) => `
      <button class="${jobsState.selectedType === filter.type ? 'active' : ''}" data-job-type="${filter.type}">
        ${filter.label} <span>${filter.count}</span>
      </button>
    `)
    .join('');

  jobTypeFilters.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', () => {
      jobsState.selectedType = button.dataset.jobType;
      jobsState.selectedJobId = null;
      renderJobsScreen();
    });
  });
}

function renderJobsScreen() {
  const rows = filteredJobs();
  jobsCountLabel.textContent = `${rows.length} shown`;

  jobsScreenTableBody.innerHTML = rows
    .map((job) => `
      <tr class="${job.id === jobsState.selectedJobId ? 'selected-row' : ''}" data-job-id="${job.id}">
        <td>${job.location}</td>
        <td>${job.job}</td>
        <td>${formatType(job.type)}</td>
        <td>${job.packagePlan || 'No package plan'}</td>
        <td>${formatNumber(job.subjects)}</td>
        <td>${formatNumber(job.orders)}</td>
        <td>${formatNumber(job.images)}</td>
      </tr>
    `)
    .join('');

  jobsScreenTableBody.querySelectorAll('tr').forEach((row) => {
    row.addEventListener('click', () => {
      selectJobSummary(Number(row.dataset.jobId));
    });

    row.addEventListener('dblclick', () => {
      openJob(Number(row.dataset.jobId));
    });
  });

  renderJobTypeFilters();
  bindJobSortHeaders();
}

function selectJobSummary(jobId) {
  jobsState.selectedJobId = jobId;
  jobsState.detail = null;
  jobsState.lastLaptopPackage = null;

  jobsScreenTableBody.querySelectorAll('[data-job-id]').forEach((row) => {
    row.classList.toggle('selected-row', Number(row.dataset.jobId) === jobId);
  });

  jobWorkflowContent.innerHTML = '<div class="empty-state">Double-click a job to open workflow data.</div>';
}

async function openJob(jobId) {
  selectJobSummary(jobId);
  if (!(await acquireUiJobLock(jobId))) return;
  try {
    await loadJobDetail(jobId);
  } catch (error) {
    await releaseUiJobLocks(jobId);
    throw error;
  }
  if (jobsState.selectedTab === 'capture') {
    await openCaptureLogin(jobId);
    return;
  }
  setJobsWorkspaceMode(true);
  setWorkspaceMode(jobsState.selectedTab === 'pictureDay' ? 'pictureDay' : 'students');
}

function closeJobWorkspace() {
  stopCaptureWatcher().catch((error) => console.error(error));
  stopEnvelopeWatcher().catch((error) => console.error(error));
  if (jobsState.selectedJobId) releaseUiJobLocks(jobsState.selectedJobId).catch((error) => console.error(error));
  setJobsWorkspaceMode(false);
  title.textContent = 'Jobs';
}

function activeElementAcceptsTyping() {
  const element = document.activeElement;
  return Boolean(element && ['INPUT', 'TEXTAREA', 'SELECT'].includes(element.tagName));
}

function focusCaptureBarcode(force = false) {
  if (!force && activeElementAcceptsTyping()) {
    return;
  }
  setTimeout(() => {
    if (!force && activeElementAcceptsTyping()) {
      return;
    }
    captureEntryForm.elements.barcode.focus();
    captureEntryForm.elements.barcode.select();
  }, 0);
}

function setCaptureLoginVisible(visible) {
  captureLoginModal.hidden = !visible;
  if (!visible) {
    jobsState.pendingCaptureJobId = null;
    captureLoginStatus.textContent = '';
  }
}

async function focusCaptureLoginPhotographer() {
  const input = captureLoginForm.elements.photographerName;
  if (!input || captureLoginModal.hidden) {
    return;
  }

  try {
    if (window.trecs && typeof window.trecs.focusWindow === 'function') {
      await window.trecs.focusWindow();
    }
  } catch (error) {
    console.warn('Could not focus TRECS window', error);
  }

  [0, 50, 150, 300, 600, 1000].forEach((delay) => {
    setTimeout(() => {
      if (captureLoginModal.hidden) {
        return;
      }
      input.focus({ preventScroll: true });
      input.select();
    }, delay);
  });

  requestAnimationFrame(() => {
    if (!captureLoginModal.hidden) {
      input.focus({ preventScroll: true });
      input.select();
    }
  });
}

async function openCaptureLogin(jobId) {
  if (!(await acquireUiJobLock(jobId))) return;
  jobsState.pendingCaptureJobId = jobId;
  setCaptureLoginVisible(true);
  captureLoginStatus.textContent = '';

  try {
    const info = await trecsApi('getSystemInfo').getSystemInfo();
    captureLoginForm.elements.workstationName.value = info.computerName || '';
    if (!captureLoginForm.elements.photographerName.value) {
      captureLoginForm.elements.photographerName.value = jobsState.captureSession && jobsState.captureSession.photographerName
        ? jobsState.captureSession.photographerName
        : '';
    }
    captureLoginForm.elements.shootStage.value = jobsState.captureShootStage || 'main';
  } catch (error) {
    captureLoginStatus.textContent = error.message || 'Could not load computer name';
    console.error(error);
  }

  await focusCaptureLoginPhotographer();
}

async function submitCaptureLogin(event) {
  event.preventDefault();
  const jobId = jobsState.pendingCaptureJobId || jobsState.selectedJobId;
  if (!jobId) {
    return;
  }

  const photographerName = captureLoginForm.elements.photographerName.value.trim();
  const workstationName = captureLoginForm.elements.workstationName.value.trim();
  const shootStage = captureLoginForm.elements.shootStage.value;
  if (!photographerName || !workstationName) {
    captureLoginStatus.textContent = 'Photographer and computer are required.';
    return;
  }

  jobsState.captureSession = {
    photographerName,
    workstationName,
    shootStage
  };
  jobsState.captureShootStage = shootStage;
  setCaptureLoginVisible(false);
  selectJobSummary(jobId);
  if (!jobsState.detail || !jobsState.detail.summary || jobsState.detail.summary.id !== jobId) {
    await loadJobDetail(jobId);
  }
  setJobsWorkspaceMode(true);
  setWorkspaceMode('capture');
}

function setWorkspaceMode(mode) {
  hideImageHoverPreview();
  jobsState.workspaceMode = mode;
  updateMenuContext();
  const studentsOpen = mode === 'students';
  const captureOpen = mode === 'capture';
  const envelopeOpen = mode === 'envelope';
  const adminOpen = mode === 'admin';
  const idTemplateOpen = mode === 'idTemplates';
  const imageReviewOpen = mode === 'imageReview';
  const pictureDayOpen = mode === 'pictureDay';
  document.querySelector('.student-workspace-grid').hidden = !studentsOpen;
  jobStudentWorkspace.classList.toggle('capture-mode', captureOpen);
  captureWorkspace.hidden = !captureOpen;
  imageReviewWorkspace.hidden = !imageReviewOpen;
  if (pictureDayWorkspace) {
    pictureDayWorkspace.hidden = !pictureDayOpen;
  }
  envelopeWorkspace.hidden = !envelopeOpen;
  adminItemsWorkspace.hidden = !adminOpen;
  if (idTemplateWorkspace) {
    idTemplateWorkspace.hidden = !idTemplateOpen;
  }
  backToJobsButton.textContent = (captureOpen || envelopeOpen || imageReviewOpen)
    ? 'Back to Students'
    : (adminOpen || idTemplateOpen || pictureDayOpen)
      ? 'Back to School'
      : 'Back to Jobs';
  if (workspaceStudentsButton) {
    workspaceStudentsButton.classList.toggle('active', studentsOpen);
  }
  if (workspaceCaptureButton) {
    workspaceCaptureButton.classList.toggle('active', captureOpen);
  }
  if (workspaceEnvelopeButton) {
    workspaceEnvelopeButton.classList.toggle('active', envelopeOpen);
  }
  if (workspaceAdminItemsButton) {
    workspaceAdminItemsButton.classList.toggle('active', adminOpen);
  }
  if (workspaceAddBlankButton) {
    workspaceAddBlankButton.hidden = !studentsOpen;
  }
  workspaceEditStudentButton.hidden = !studentsOpen;
  workspacePreviousButton.hidden = !studentsOpen;
  workspaceNextButton.hidden = !studentsOpen;

  if (!envelopeOpen) {
    stopEnvelopeWatcher().catch((error) => console.error(error));
  }
  if (!captureOpen) {
    stopCaptureWatcher().catch((error) => console.error(error));
  }

  if (studentsOpen) {
    renderStudentWorkspace();
  } else if (captureOpen) {
    renderCaptureWorkspace();
  } else if (imageReviewOpen) {
    renderImageReviewWorkspace();
  } else if (pictureDayOpen) {
    renderPictureDayPrepWorkspace();
  } else if (envelopeOpen) {
    renderEnvelopeWorkspace();
  } else if (idTemplateOpen) {
    renderIdTemplateDesigner();
  } else if (adminOpen) {
    renderAdminItemsWorkspace();
  }
}

function setAddRecordsModalVisible(visible) {
  jobsState.showAddRecordsModal = visible;
  addRecordsModal.hidden = !visible;
  addRecordsStatus.textContent = '';
  if (visible) {
    addRecordsForm.reset();
    addRecordsForm.elements.recordCount.focus();
    addRecordsForm.elements.recordCount.select();
  }
}

function setEndOfDayModalVisible(visible) {
  endOfDayModal.hidden = !visible;
  if (!visible) {
    jobsState.endOfDayReview = null;
    endOfDayStatus.textContent = '';
    endOfDayReview.innerHTML = '<div class="empty-state">Loading changes...</div>';
    confirmEndOfDayButton.disabled = false;
    endOfDayModalTitle.textContent = 'End of Day Review';
    endOfDayActionNote.textContent = 'Confirm these changes before creating the package.';
    confirmEndOfDayButton.textContent = 'Create End of Day';
  }
}

function shortChangeValue(value) {
  const text = String(value || '').trim();
  if (!text) {
    return '(blank)';
  }
  return text.length > 80 ? `${text.slice(0, 77)}...` : text;
}

function createEndOfDayAdjustments(review) {
  const changes = review.subjectChanges || {};
  return {
    newSubjects: (changes.newSubjects || []).map((subject) => ({
      id: subject.id,
      include: true,
      name: subject.name || '',
      grade: subject.grade || '',
      homeroom: subject.homeroom || ''
    })),
    editedSubjects: (changes.editedSubjects || []).map((subject) => ({
      id: subject.id,
      include: true,
      changes: (subject.changes || []).map((change) => ({
        field: change.field,
        include: true,
        after: change.after || ''
      }))
    }))
  };
}

function currentEndOfDayAdjustments() {
  const state = jobsState.endOfDayReview || {};
  if (!state.adjustments && state.review) {
    state.adjustments = createEndOfDayAdjustments(state.review);
  }
  return state.adjustments || { newSubjects: [], editedSubjects: [] };
}

function endOfDayNewSubjectAdjustment(subjectId) {
  const adjustments = currentEndOfDayAdjustments();
  return adjustments.newSubjects.find((subject) => Number(subject.id) === Number(subjectId)) || null;
}

function endOfDayEditedSubjectAdjustment(subjectId) {
  const adjustments = currentEndOfDayAdjustments();
  return adjustments.editedSubjects.find((subject) => Number(subject.id) === Number(subjectId)) || null;
}

function renderEndOfDaySection(sectionId, title, count, contentHtml) {
  const collapsed = jobsState.endOfDayCollapsed[sectionId] === true;
  return `
    <section class="end-of-day-section ${sectionId === 'editedSubjects' ? 'database-edits' : ''} ${collapsed ? 'collapsed' : ''}" data-end-of-day-section="${sectionId}">
      <button class="end-of-day-section-heading" type="button" data-end-of-day-toggle="${sectionId}">
        <span>${escapeHtml(title)}</span>
        <strong>${formatNumber(count || 0)}</strong>
      </button>
      <div class="end-of-day-section-body" ${collapsed ? 'hidden' : ''}>
        ${contentHtml}
      </div>
    </section>
  `;
}

function includedEndOfDayNewSubjectCount(newSubjects) {
  return newSubjects.filter((subject) => {
    const adjustment = endOfDayNewSubjectAdjustment(subject.id);
    return !adjustment || adjustment.include !== false;
  }).length;
}

function includedEndOfDayEditedSubjectCount(editedSubjects) {
  return editedSubjects.filter((subject) => {
    const adjustment = endOfDayEditedSubjectAdjustment(subject.id);
    if (adjustment && adjustment.include === false) {
      return false;
    }
    const includedChanges = (subject.changes || []).filter((change) => {
      const changeAdjustment = adjustment
        ? adjustment.changes.find((item) => item.field === change.field)
        : null;
      return !changeAdjustment || changeAdjustment.include !== false;
    });
    return includedChanges.length > 0;
  }).length;
}

function renderEndOfDayCapturedImages(capturedImages) {
  if (!capturedImages.length) {
    return '<div class="empty-state">No captured images found.</div>';
  }
  return `
    <ul class="end-of-day-list">
      ${capturedImages.map((image) => `
        <li>
          <strong>${escapeHtml(image.ref || '')}</strong>
          <span>${escapeHtml(image.studentName || image.filename || '')}</span>
          <em>${escapeHtml(image.filename || '')}${image.rawPath ? ' / CR3' : ''}</em>
        </li>
      `).join('')}
    </ul>
  `;
}

function renderEndOfDayNewSubjects(newSubjects) {
  if (!newSubjects.length) {
    return '<div class="empty-state">No new camera cards found.</div>';
  }
  return `
    <ul class="end-of-day-list editable">
      ${newSubjects.map((subject) => {
        const adjustment = endOfDayNewSubjectAdjustment(subject.id) || {};
        return `
          <li>
            <label class="end-of-day-include">
              <input type="checkbox" data-eod-new-include="${subject.id}" ${adjustment.include === false ? '' : 'checked'}>
              <strong>${escapeHtml(subject.ref || '')}</strong>
            </label>
            <div class="end-of-day-edit-grid">
              <label>
                <span>Name</span>
                <input data-eod-new-field="${subject.id}" data-field="name" value="${escapeHtml(adjustment.name ?? subject.name ?? '')}">
              </label>
              <label>
                <span>Grade</span>
                <input data-eod-new-field="${subject.id}" data-field="grade" value="${escapeHtml(adjustment.grade ?? subject.grade ?? '')}">
              </label>
              <label>
                <span>Homeroom</span>
                <input data-eod-new-field="${subject.id}" data-field="homeroom" value="${escapeHtml(adjustment.homeroom ?? subject.homeroom ?? '')}">
              </label>
            </div>
          </li>
        `;
      }).join('')}
    </ul>
  `;
}

function renderEndOfDayEditedSubjects(editedSubjects) {
  if (!editedSubjects.length) {
    return '<div class="empty-state">No student edits found.</div>';
  }
  return `
    <ul class="end-of-day-change-list">
      ${editedSubjects.map((subject) => {
        const adjustment = endOfDayEditedSubjectAdjustment(subject.id) || {};
        return `
          <li>
            <label class="end-of-day-include">
              <input type="checkbox" data-eod-edit-subject-include="${subject.id}" ${adjustment.include === false ? '' : 'checked'}>
              <strong>${escapeHtml(subject.ref || '')} ${escapeHtml(subject.name || '')}</strong>
            </label>
            ${(subject.changes || []).map((change) => {
              const changeAdjustment = adjustment.changes
                ? adjustment.changes.find((item) => item.field === change.field)
                : null;
              return `
                <div class="end-of-day-change-row">
                  <label>
                    <input type="checkbox" data-eod-edit-change-include="${subject.id}" data-field="${escapeHtml(change.field)}" ${changeAdjustment && changeAdjustment.include === false ? '' : 'checked'}>
                    <span>${escapeHtml(change.label)}</span>
                  </label>
                  <em>${escapeHtml(shortChangeValue(change.before))}</em>
                  <input data-eod-edit-change-after="${subject.id}" data-field="${escapeHtml(change.field)}" value="${escapeHtml(changeAdjustment ? changeAdjustment.after : change.after || '')}">
                </div>
              `;
            }).join('')}
          </li>
        `;
      }).join('')}
    </ul>
  `;
}

function renderEndOfDayReview(review) {
  const counts = review.counts || {};
  const changes = review.subjectChanges || {};
  const newSubjects = changes.newSubjects || [];
  const editedSubjects = changes.editedSubjects || [];
  const includedNewSubjectCount = includedEndOfDayNewSubjectCount(newSubjects);
  const includedEditedSubjectCount = includedEndOfDayEditedSubjectCount(editedSubjects);

  endOfDayReview.innerHTML = `
    <div class="end-of-day-summary">
      <article><span>Captured Images</span><strong>${formatNumber(counts.capturedImages || 0)}</strong></article>
      <article><span>CR3 Files</span><strong>${formatNumber(counts.capturedRawFiles || 0)}</strong></article>
      <article><span>New Cards Exported</span><strong>${formatNumber(includedNewSubjectCount)}</strong></article>
      <article><span>Student Edits Exported</span><strong>${formatNumber(includedEditedSubjectCount)}</strong></article>
    </div>
    ${review.hasBaseline ? '' : '<div class="end-of-day-warning">No onsite-start baseline was found, so student edit comparisons are not available for this job.</div>'}
    ${renderEndOfDaySection('editedSubjects', 'Student Database Edits', editedSubjects.length, renderEndOfDayEditedSubjects(editedSubjects))}
  `;
  bindEndOfDayReviewControls(review);
}

function updateEndOfDaySummaryOnly(review) {
  renderEndOfDayReview(review);
}

function bindEndOfDayReviewControls(review) {
  endOfDayReview.querySelectorAll('[data-end-of-day-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      const sectionId = button.dataset.endOfDayToggle;
      jobsState.endOfDayCollapsed[sectionId] = !jobsState.endOfDayCollapsed[sectionId];
      renderEndOfDayReview(review);
    });
  });

  endOfDayReview.querySelectorAll('[data-eod-new-include]').forEach((input) => {
    input.addEventListener('change', () => {
      const adjustment = endOfDayNewSubjectAdjustment(input.dataset.eodNewInclude);
      if (adjustment) {
        adjustment.include = input.checked;
        updateEndOfDaySummaryOnly(review);
      }
    });
  });

  endOfDayReview.querySelectorAll('[data-eod-new-field]').forEach((input) => {
    input.addEventListener('input', () => {
      const adjustment = endOfDayNewSubjectAdjustment(input.dataset.eodNewField);
      if (adjustment) {
        adjustment[input.dataset.field] = input.value;
      }
    });
  });

  endOfDayReview.querySelectorAll('[data-eod-edit-subject-include]').forEach((input) => {
    input.addEventListener('change', () => {
      const adjustment = endOfDayEditedSubjectAdjustment(input.dataset.eodEditSubjectInclude);
      if (adjustment) {
        adjustment.include = input.checked;
        updateEndOfDaySummaryOnly(review);
      }
    });
  });

  endOfDayReview.querySelectorAll('[data-eod-edit-change-include]').forEach((input) => {
    input.addEventListener('change', () => {
      const adjustment = endOfDayEditedSubjectAdjustment(input.dataset.eodEditChangeInclude);
      const change = adjustment
        ? adjustment.changes.find((item) => item.field === input.dataset.field)
        : null;
      if (change) {
        change.include = input.checked;
        updateEndOfDaySummaryOnly(review);
      }
    });
  });

  endOfDayReview.querySelectorAll('[data-eod-edit-change-after]').forEach((input) => {
    input.addEventListener('input', () => {
      const adjustment = endOfDayEditedSubjectAdjustment(input.dataset.eodEditChangeAfter);
      const change = adjustment
        ? adjustment.changes.find((item) => item.field === input.dataset.field)
        : null;
      if (change) {
        change.after = input.value;
      }
    });
  });
}

function closeJobActionsMenu() {
  if (jobActionsMenu) {
    jobActionsMenu.open = false;
  }
}

function showJobsForAction() {
  closeJobActionsMenu();
  setView('jobs');
}

async function openEndOfDayReview(jobId) {
  jobsState.endOfDayReview = { mode: 'create', jobId, loading: true };
  jobsState.endOfDayCollapsed = {
    capturedImages: true,
    newSubjects: false,
    editedSubjects: false
  };
  endOfDayModalTitle.textContent = 'End of Day Review';
  endOfDayActionNote.textContent = 'Confirm these changes before creating the package.';
  confirmEndOfDayButton.textContent = 'Create End of Day';
  endOfDayStatus.textContent = '';
  endOfDayReview.innerHTML = '<div class="empty-state">Loading changes...</div>';
  setEndOfDayModalVisible(true);
  try {
    const review = await trecsApi('getEndOfDayPreview').getEndOfDayPreview(jobId);
    jobsState.endOfDayReview = {
      mode: 'create',
      jobId,
      review,
      adjustments: createEndOfDayAdjustments(review)
    };
    renderEndOfDayReview(review);
  } catch (error) {
    jobsState.endOfDayReview = { jobId, error };
    endOfDayReview.innerHTML = '<div class="empty-state">Could not load end of day changes.</div>';
    endOfDayStatus.textContent = error.message || 'End of day review failed';
    confirmEndOfDayButton.disabled = true;
    throw error;
  }
}

function reviewFromEndOfDayManifest(manifest) {
  return {
    job: manifest.job || {},
    hasBaseline: true,
    counts: manifest.counts || {},
    capturedImages: (manifest.copiedImages || []).map((image) => ({
      ...image,
      id: image.imageAssetId,
      currentPath: image.jpgPath,
      rawPath: image.rawPath || null
    })),
    subjectChanges: manifest.subjectChanges || {
      newSubjects: [],
      editedSubjects: [],
      deletedSubjects: []
    }
  };
}

function openEndOfDayPackageReview(choice) {
  const review = reviewFromEndOfDayManifest(choice.manifest || {});
  jobsState.endOfDayReview = {
    mode: 'approve',
    packageFolder: choice.folderPath,
    review,
    adjustments: createEndOfDayAdjustments(review)
  };
  jobsState.endOfDayCollapsed = {
    capturedImages: true,
    newSubjects: false,
    editedSubjects: false
  };
  endOfDayModalTitle.textContent = 'Approve End of Day';
  endOfDayActionNote.textContent = 'Review these changes before updating the main database.';
  confirmEndOfDayButton.textContent = 'Approve End of Day';
  endOfDayStatus.textContent = '';
  setEndOfDayModalVisible(true);
  renderEndOfDayReview(review);
}

async function confirmEndOfDayPackage() {
  const reviewState = jobsState.endOfDayReview;
  if (!reviewState) {
    return;
  }

  confirmEndOfDayButton.disabled = true;
  confirmEndOfDayButton.textContent = reviewState.mode === 'approve' ? 'Approving...' : 'Creating...';
  endOfDayStatus.textContent = '';
  jobsState.lastEndOfDayPackage = { jobId: reviewState.jobId || null, status: 'working' };

  try {
    let result;
    if (reviewState.mode === 'approve') {
      result = await trecsApi('approveEndOfDayPackage').approveEndOfDayPackage({
        packageFolder: reviewState.packageFolder,
        adjustments: reviewState.adjustments || currentEndOfDayAdjustments()
      });
    } else {
      result = await trecsApi('createEndOfDayPackage').createEndOfDayPackage(
        reviewState.jobId,
        reviewState.adjustments || currentEndOfDayAdjustments()
      );
    }
    jobsState.lastEndOfDayPackage = {
      jobId: result.id || reviewState.jobId,
      status: 'done',
      packagePath: result.packagePath,
      capturedImages: result.counts.capturedImages || result.counts.images || 0
    };
    setEndOfDayModalVisible(false);
    if (reviewState.mode === 'approve') {
      const wasWorkspaceOpen = jobsState.jobWorkspaceOpen && Number(jobsState.selectedJobId) === Number(result.id);
      const previousWorkspaceMode = jobsState.workspaceMode;
      const previousSubjectId = jobsState.selectedSubjectId;
      jobsState.selectedJobId = result.id;
      jobsState.selectedType = 'all';
      jobsState.search = '';
      jobSearchInput.value = '';
      await loadDashboard();
      await loadJobs();
      if (wasWorkspaceOpen) {
        jobsState.workspaceMode = previousWorkspaceMode || 'students';
        jobsState.selectedSubjectId = previousSubjectId;
        await reloadCurrentJobDetail();
        if (previousWorkspaceMode === 'pictureDay') {
          await loadPictureDayPrep(true);
        }
      } else {
        jobsState.detail = null;
        await loadJobDetail(result.id);
      }
      window.alert([
        'End of Day package approved.',
        '',
        `Files copied: ${formatNumber((result.counts && result.counts.copiedFiles) || 0)}`,
        `Images imported: ${formatNumber((result.counts && result.counts.images) || 0)}`,
        `New camera cards: ${formatNumber((result.counts && result.counts.newSubjects) || 0)}`,
        `Student edits: ${formatNumber((result.counts && result.counts.editedSubjects) || 0)}`
      ].join('\n'));
    } else {
      await reloadCurrentJobDetail();
    }
  } catch (error) {
    jobsState.lastEndOfDayPackage = {
      jobId: reviewState.jobId,
      status: 'error',
      message: error.message || 'End of day failed'
    };
    endOfDayStatus.textContent = error.message || 'End of day failed';
    confirmEndOfDayButton.disabled = false;
    confirmEndOfDayButton.textContent = reviewState.mode === 'approve' ? 'Approve End of Day' : 'Create End of Day';
    if (reviewState.mode !== 'approve') {
      await reloadCurrentJobDetail();
    }
    console.error(error);
  }
}

function setSchoolDataModalVisible(visible) {
  schoolDataModal.hidden = !visible;
  if (!visible) {
    jobsState.schoolDataImport = null;
    schoolDataFilePath.value = '';
    schoolDataStatus.textContent = '';
    if (schoolDataBlankCount) {
      schoolDataBlankCount.value = '0';
    }
    schoolDataMapping.innerHTML = '<div class="empty-state">Choose a file to preview and map columns.</div>';
    schoolDataPreview.innerHTML = '';
    confirmSchoolDataButton.disabled = true;
    confirmSchoolDataButton.textContent = 'Import School Data';
  }
}

function openSchoolDataImport(jobId) {
  jobsState.schoolDataImport = {
    jobId,
    preview: null,
    mapping: {}
  };
  schoolDataFilePath.value = '';
  schoolDataStatus.textContent = '';
  if (schoolDataBlankCount) {
    schoolDataBlankCount.value = '0';
  }
  schoolDataMapping.innerHTML = '<div class="empty-state">Choose a file to preview and map columns.</div>';
  schoolDataPreview.innerHTML = '';
  confirmSchoolDataButton.disabled = true;
  setSchoolDataModalVisible(true);
}

function schoolDataColumnOptions(preview, selectedIndex) {
  const options = ['<option value="">Do not import</option>'];
  (preview.columns || []).forEach((column) => {
    options.push(`
      <option value="${column.index}" ${Number(selectedIndex) === column.index ? 'selected' : ''}>
        ${escapeHtml(column.name)}
      </option>
    `);
  });
  return options.join('');
}

function renderSchoolDataMapping() {
  const state = jobsState.schoolDataImport;
  const preview = state && state.preview;
  if (!preview) {
    return;
  }

  const mapping = state.mapping || {};
  schoolDataFilePath.value = preview.filePath;
  schoolDataMapping.innerHTML = `
    <div class="school-data-fields">
      ${(preview.fields || []).map((field) => `
        <label>
          <span>${escapeHtml(field.label)}${field.required ? ' *' : ''}</span>
          <select data-school-field="${escapeHtml(field.key)}">
            ${schoolDataColumnOptions(preview, mapping[field.key])}
          </select>
        </label>
      `).join('')}
    </div>
  `;

  schoolDataMapping.querySelectorAll('[data-school-field]').forEach((select) => {
    select.addEventListener('change', () => {
      const key = select.dataset.schoolField;
      if (select.value === '') {
        delete jobsState.schoolDataImport.mapping[key];
      } else {
        jobsState.schoolDataImport.mapping[key] = Number(select.value);
      }
      confirmSchoolDataButton.disabled = false;
      renderSchoolDataPreview();
    });
  });

  confirmSchoolDataButton.disabled = false;
  renderSchoolDataPreview();
}

function renderSchoolDataPreview() {
  const state = jobsState.schoolDataImport;
  const preview = state && state.preview;
  if (!preview) {
    schoolDataPreview.innerHTML = '';
    return;
  }

  const columns = preview.columns || [];
  const rows = preview.rows || [];
  schoolDataPreview.innerHTML = `
    <div class="school-data-meta">
      <span>${escapeHtml(preview.fileName || '')}</span>
      <span>${preview.hasHeader ? 'Header row detected' : 'No header row detected'}</span>
    </div>
    <table>
      <thead>
        <tr>
          ${columns.map((column) => `<th>${escapeHtml(column.name)}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${rows.slice(0, 10).map((row) => `
          <tr>
            ${columns.map((column) => `<td>${escapeHtml(row[column.index] || '')}</td>`).join('')}
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

async function browseSchoolDataFile() {
  const state = jobsState.schoolDataImport;
  if (!state || !state.jobId) {
    return;
  }

  browseSchoolDataButton.disabled = true;
  browseSchoolDataButton.textContent = 'Browsing...';
  schoolDataStatus.textContent = '';

  try {
    const preview = await trecsApi('chooseSchoolDataFile').chooseSchoolDataFile(state.jobId);
    if (!preview || preview.canceled) {
      return;
    }
    jobsState.schoolDataImport.preview = preview;
    jobsState.schoolDataImport.mapping = { ...(preview.mapping || {}) };
    renderSchoolDataMapping();
  } catch (error) {
    schoolDataStatus.textContent = error.message || 'Could not read school data file';
    console.error(error);
  } finally {
    browseSchoolDataButton.disabled = false;
    browseSchoolDataButton.textContent = 'Browse';
  }
}

async function confirmSchoolDataImport() {
  const state = jobsState.schoolDataImport;
  if (!state || !state.preview || !state.jobId) {
    return;
  }

  confirmSchoolDataButton.disabled = true;
  confirmSchoolDataButton.textContent = 'Importing...';
  schoolDataStatus.textContent = '';

  try {
    const result = await trecsApi('importSchoolData').importSchoolData(state.jobId, {
      filePath: state.preview.filePath,
      hasHeader: state.preview.hasHeader,
      mapping: state.mapping
    });
    const blankCount = Math.max(0, Math.floor(Number(schoolDataBlankCount ? schoolDataBlankCount.value : 0) || 0));
    let blankResult = null;
    if (blankCount > 0) {
      blankResult = await trecsApi('createBlankSubjects').createBlankSubjects(state.jobId, blankCount);
    }
    schoolDataStatus.textContent = `Imported ${formatNumber(result.created)} new, updated ${formatNumber(result.updated)}, and added ${formatNumber(blankResult ? blankResult.count : 0)} blank records.`;
    await loadDashboard();
    await loadJobs();
    jobsState.selectedJobId = state.jobId;
    if (jobsState.jobWorkspaceOpen) {
      await reloadCurrentJobDetail();
    } else {
      await loadJobDetail(state.jobId);
    }
    setSchoolDataModalVisible(false);
  } catch (error) {
    schoolDataStatus.textContent = error.message || 'School data import failed';
    confirmSchoolDataButton.disabled = false;
    confirmSchoolDataButton.textContent = 'Import School Data';
    console.error(error);
  }
}

function moveWorkspaceSubject(offset) {
  const subjects = workspaceSubjects();
  if (!subjects.length) {
    return;
  }

  const currentIndex = subjects.findIndex((subject) => subject.id === jobsState.selectedSubjectId);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;
  const nextIndex = (safeIndex + offset + subjects.length) % subjects.length;

  jobsState.selectedSubjectId = subjects[nextIndex].id;
  renderStudentWorkspace();
}

function workspaceSubjects() {
  if (!jobsState.detail) {
    return [];
  }

  const search = String(jobsState.workspaceStudentSearch || '').trim().toLowerCase();
  const subjects = jobsState.detail.subjects || [];
  if (!search) {
    return subjects;
  }

  return subjects.filter((subject) => textIncludes(
    subject,
    ['ref', 'name', 'externalId', 'grade', 'homeroom', 'track', 'photographedStatus'],
    search
  ));
}

function currentWorkspaceSubject() {
  const subjects = workspaceSubjects();
  if (!subjects.length) {
    return null;
  }

  if (!jobsState.selectedSubjectId || !subjects.some((subject) => subject.id === jobsState.selectedSubjectId)) {
    jobsState.selectedSubjectId = subjects[0].id;
  }

  return subjects.find((subject) => subject.id === jobsState.selectedSubjectId) || subjects[0];
}

function renderStudentWorkspace() {
  if (!jobsState.detail || !jobsState.detail.summary) {
    return;
  }

  const job = jobsState.detail.summary;
  const subjects = workspaceSubjects();
  const currentSubject = currentWorkspaceSubject();
  title.textContent = job.job;
  workspaceJobTitle.textContent = `${job.location} / ${job.job}`;
  const unlinkedImageCount = Number(jobsState.detail.capture && jobsState.detail.capture.summary
    ? jobsState.detail.capture.summary.unlinkedImages
    : 0);
  workspaceJobMeta.innerHTML = `
    <span>${escapeHtml(formatType(job.type))} / ${escapeHtml(job.packagePlan || 'No package plan')} / ${formatNumber(job.subjects)} subjects</span>
    <span class="workspace-unlinked-count">${formatNumber(unlinkedImageCount)} unlinked image${unlinkedImageCount === 1 ? '' : 's'}</span>
    ${unlinkedImageCount > 0 ? '<button class="review-alert-button" id="openImageReviewButton" type="button">Review Images</button>' : ''}
  `;
  workspaceStudentCount.textContent = `${formatNumber(subjects.length)} shown`;
  workspaceStudentSearch.value = jobsState.workspaceStudentSearch;
  workspaceEditStudentButton.disabled = !currentSubject;
  workspaceEditStudentButton.textContent = jobsState.showStudentEditForm ? 'Close Edit' : 'Edit Student';

  workspaceStudentList.innerHTML = subjects.length
    ? subjects.map((subject) => `
      <button class="${subject.id === jobsState.selectedSubjectId ? 'active' : ''}" data-workspace-subject-id="${subject.id}" type="button">
        <span>${subject.ref || ''}</span>
        <strong>${subject.name || 'Unnamed student'}</strong>
        <em>${subject.grade || ''}${subject.homeroom ? ` / ${subject.homeroom}` : ''}</em>
      </button>
    `).join('')
    : '<div class="empty-state">No students match this search.</div>';

  workspaceStudentList.querySelectorAll('[data-workspace-subject-id]').forEach((button) => {
    button.onclick = () => {
      jobsState.selectedSubjectId = Number(button.dataset.workspaceSubjectId);
      renderStudentWorkspace();
    };
  });

  renderWorkspaceStudentDetail(currentSubject);
  renderWorkspaceOrderDetail(currentSubject);
  updateWorkspaceNavButtons();
  const imageReviewButton = document.getElementById('openImageReviewButton');
  if (imageReviewButton) {
    imageReviewButton.addEventListener('click', () => {
      setWorkspaceMode('imageReview');
    });
  }
}

function normalizeStudentVisibleFields(fields = {}) {
  return Object.fromEntries(
    STUDENT_FIELD_DEFINITIONS.map((field) => [field.key, fields[field.key] !== false])
  );
}

function defaultStudentFieldSettings() {
  return {
    global: { visibleFields: { ...DEFAULT_STUDENT_VISIBLE_FIELDS } },
    jobTypes: {}
  };
}

function effectiveStudentVisibleFields(jobType) {
  const settings = jobsState.studentFieldSettings || defaultStudentFieldSettings();
  const globalFields = normalizeStudentVisibleFields(settings.global && settings.global.visibleFields);
  const jobTypeSettings = settings.jobTypes && settings.jobTypes[jobType];
  if (jobTypeSettings && jobTypeSettings.inheritGlobal === false) {
    return normalizeStudentVisibleFields(jobTypeSettings.visibleFields);
  }
  return globalFields;
}

function currentStudentVisibleFields() {
  const jobType = jobsState.detail && jobsState.detail.summary ? jobsState.detail.summary.type : '';
  return effectiveStudentVisibleFields(jobType);
}

function studentFieldVisible(fields, key) {
  return fields[key] !== false;
}

function studentDetailFieldRows(subject, fields) {
  const rows = [
    ['externalId', 'Student ID', subject.externalId || ''],
    ['grade', 'Grade', subject.grade || ''],
    ['homeroom', 'Homeroom', subject.homeroom || ''],
    ['track', 'Track', subject.track || ''],
    ['team', 'Team', subject.team || ''],
    ['subjectType', 'Type', formatType(subject.subjectType || 'student')],
    ['photographedStatus', 'Photo Status', formatStatusLabel(subject.photographedStatus || 'unknown')]
  ];

  return rows
    .filter(([key]) => studentFieldVisible(fields, key))
    .map(([_key, label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`)
    .join('');
}

function renderWorkspaceStudentDetail(subject) {
  if (!subject) {
    workspaceStudentDetail.innerHTML = '<div class="empty-state">No student selected.</div>';
    return;
  }
  const visibleFields = currentStudentVisibleFields();

  workspaceStudentDetail.innerHTML = `
    <div class="workspace-student-header">
      <div>
        <span>Ref # ${subject.ref || ''}</span>
        <h2>${subject.name || 'Unnamed student'}</h2>
      </div>
      <span class="status ${subject.imageAssetId ? 'ready' : 'review'}">${subject.imageAssetId ? 'Photo linked' : 'No photo'}</span>
    </div>
    <div class="workspace-photo" id="workspacePhotoPanel">
      <div class="empty-state">Loading photo...</div>
    </div>
    <dl class="workspace-fields">
      ${studentDetailFieldRows(subject, visibleFields) || '<div><dt>Student Info</dt><dd>No fields selected</dd></div>'}
    </dl>
    ${jobsState.showStudentEditForm ? renderStudentEditForm(subject) : ''}
    <form class="notes-form" data-note-form="subject" data-note-id="${subject.id}">
      <label>
        <span>Notes</span>
        <textarea name="notes" rows="2">${escapeHtml(subject.notes)}</textarea>
      </label>
      <div class="form-actions">
        <span data-note-status></span>
        <button type="submit">Save Notes</button>
      </div>
    </form>
  `;

  bindStudentEditForm();
  bindNoteForms(workspaceStudentDetail);
  loadWorkspacePhoto(subject.imageAssetId);
}

function renderStudentEditForm(subject) {
  const visibleFields = currentStudentVisibleFields();
  const fieldHtml = [
    studentFieldVisible(visibleFields, 'externalId') ? `
      <label>
        <span>Student ID</span>
        <input name="externalId" value="${escapeHtml(subject.externalId || '')}">
      </label>
    ` : '',
    studentFieldVisible(visibleFields, 'firstName') ? `
      <label>
        <span>First Name</span>
        <input name="firstName" value="${escapeHtml(subject.firstName || '')}">
      </label>
    ` : '',
    studentFieldVisible(visibleFields, 'lastName') ? `
      <label>
        <span>Last Name</span>
        <input name="lastName" value="${escapeHtml(subject.lastName || '')}">
      </label>
    ` : '',
    studentFieldVisible(visibleFields, 'grade') ? `
      <label>
        <span>Grade</span>
        <input name="grade" value="${escapeHtml(subject.grade || '')}">
      </label>
    ` : '',
    studentFieldVisible(visibleFields, 'homeroom') ? `
      <label>
        <span>Homeroom</span>
        <input name="homeroom" value="${escapeHtml(subject.homeroom || '')}">
      </label>
    ` : '',
    studentFieldVisible(visibleFields, 'track') ? `
      <label>
        <span>Track</span>
        <input name="track" value="${escapeHtml(subject.track || '')}">
      </label>
    ` : '',
    studentFieldVisible(visibleFields, 'team') ? `
      <label>
        <span>Team</span>
        <input name="team" value="${escapeHtml(subject.team || '')}">
      </label>
    ` : '',
    studentFieldVisible(visibleFields, 'subjectType') ? `
      <label>
        <span>Type</span>
        <select name="subjectType">
          ${studentTypeOptions(subject.subjectType)}
        </select>
      </label>
    ` : '',
    studentFieldVisible(visibleFields, 'photographedStatus') ? `
      <label>
        <span>Photo Status</span>
        <select name="photographedStatus">
          ${photoStatusOptions(subject.photographedStatus)}
        </select>
      </label>
    ` : ''
  ].join('');

  return `
    <form class="student-edit-form" data-student-edit-form data-subject-id="${subject.id}">
      <div class="subheading">
        <h3>Edit Student Info</h3>
        <span data-student-edit-status></span>
      </div>
      <div class="student-edit-grid">
        <div class="readonly-edit-field">
          <span>Ref</span>
          <strong>${escapeHtml(subject.ref || '')}</strong>
        </div>
        ${fieldHtml}
      </div>
      <div class="form-actions">
        <button type="button" data-cancel-student-edit>Cancel</button>
        <button class="primary" type="submit">Save Student</button>
      </div>
    </form>
  `;
}

function jobTypeOptionsForFieldSettings() {
  const types = new Set(['fall', 'spring', 'sports', 'seniors', 'event', 'qr_event', 'league']);
  jobsState.types.forEach((type) => types.add(type.type));
  jobsState.jobs.forEach((job) => types.add(job.type));
  return Array.from(types).sort();
}

function studentFieldSettingsConfigForScope(scope) {
  const settings = jobsState.studentFieldSettings || defaultStudentFieldSettings();
  if (scope === 'global') {
    return {
      inheritGlobal: false,
      visibleFields: normalizeStudentVisibleFields(settings.global && settings.global.visibleFields)
    };
  }
  const config = settings.jobTypes && settings.jobTypes[scope];
  return {
    inheritGlobal: !config || config.inheritGlobal !== false,
    visibleFields: config && config.inheritGlobal === false
      ? normalizeStudentVisibleFields(config.visibleFields)
      : normalizeStudentVisibleFields(settings.global && settings.global.visibleFields)
  };
}

function currentStudentFieldFormFields() {
  const fields = {};
  studentFieldSettingsList.querySelectorAll('[data-student-field-key]').forEach((input) => {
    fields[input.dataset.studentFieldKey] = input.checked;
  });
  return normalizeStudentVisibleFields(fields);
}

function renderStudentFieldSettingsModal() {
  const settings = jobsState.studentFieldSettings || defaultStudentFieldSettings();
  const scope = jobsState.studentFieldSettingsScope || 'global';
  const typeOptions = jobTypeOptionsForFieldSettings();
  const config = studentFieldSettingsConfigForScope(scope);
  const inheritWrap = studentFieldSettingsForm.querySelector('[data-student-field-inherit-wrap]');

  studentFieldSettingsForm.elements.scope.innerHTML = [
    '<option value="global">Global Defaults</option>',
    ...typeOptions.map((type) => `<option value="${type}">${formatType(type)}</option>`)
  ].join('');
  studentFieldSettingsForm.elements.scope.value = scope;
  inheritWrap.hidden = scope === 'global';
  studentFieldSettingsForm.elements.inheritGlobal.checked = config.inheritGlobal;
  studentFieldSettingsList.hidden = scope !== 'global' && config.inheritGlobal;
  applyStudentFieldsToAllButton.hidden = scope !== 'global';

  const visibleFields = config.visibleFields;
  studentFieldSettingsList.innerHTML = STUDENT_FIELD_DEFINITIONS.map((field) => `
    <label class="student-field-option">
      <input data-student-field-key="${field.key}" type="checkbox" ${visibleFields[field.key] !== false ? 'checked' : ''}>
      <span>${field.label}</span>
    </label>
  `).join('');

  if (!settings.jobTypes) {
    settings.jobTypes = {};
  }
}

async function openStudentFieldSettings() {
  studentFieldSettingsStatus.textContent = '';
  studentFieldSettingsModal.hidden = false;
  try {
    jobsState.studentFieldSettings = await trecsApi('getStudentFieldSettings').getStudentFieldSettings();
  } catch (error) {
    jobsState.studentFieldSettings = defaultStudentFieldSettings();
    studentFieldSettingsStatus.textContent = error.message || 'Could not load field settings';
    console.error(error);
  }
  renderStudentFieldSettingsModal();
}

function closeStudentFieldSettings() {
  studentFieldSettingsModal.hidden = true;
  studentFieldSettingsStatus.textContent = '';
}

async function saveStudentFieldSettingsFromForm(applyToAll = false) {
  const scope = jobsState.studentFieldSettingsScope || 'global';
  const settings = structuredClone(jobsState.studentFieldSettings || defaultStudentFieldSettings());
  const visibleFields = currentStudentFieldFormFields();

  if (applyToAll) {
    settings.global = { visibleFields };
    settings.jobTypes = {};
  } else if (scope === 'global') {
    settings.global = { visibleFields };
  } else {
    settings.jobTypes = settings.jobTypes || {};
    if (studentFieldSettingsForm.elements.inheritGlobal.checked) {
      settings.jobTypes[scope] = {
        inheritGlobal: true,
        visibleFields: normalizeStudentVisibleFields(settings.global && settings.global.visibleFields)
      };
    } else {
      settings.jobTypes[scope] = {
        inheritGlobal: false,
        visibleFields
      };
    }
  }

  studentFieldSettingsStatus.textContent = 'Saving...';
  jobsState.studentFieldSettings = await trecsApi('saveStudentFieldSettings').saveStudentFieldSettings(settings);
  studentFieldSettingsStatus.textContent = applyToAll ? 'Applied to all job types.' : 'Saved.';
  renderStudentFieldSettingsModal();
  if (jobsState.jobWorkspaceOpen) {
    renderStudentWorkspace();
  }
}

function studentTypeOptions(selectedType) {
  return [
    ['student', 'Student'],
    ['faculty', 'Faculty'],
    ['staff', 'Staff'],
    ['athlete', 'Athlete'],
    ['senior', 'Senior'],
    ['group', 'Group'],
    ['other', 'Other']
  ].map(([value, label]) => `
    <option value="${value}" ${value === (selectedType || 'student') ? 'selected' : ''}>${label}</option>
  `).join('');
}

function photoStatusOptions(selectedStatus) {
  return [
    ['unknown', 'Unknown'],
    ['not_photographed', 'Not Photographed'],
    ['photographed', 'Photographed'],
    ['absent', 'Absent'],
    ['retake_needed', 'Retake Needed']
  ].map(([value, label]) => `
    <option value="${value}" ${value === (selectedStatus || 'unknown') ? 'selected' : ''}>${label}</option>
  `).join('');
}

function subjectInputFromForm(form) {
  const currentSubject = findById(jobsState.detail.subjects || [], Number(form.dataset.subjectId)) || {};
  const valueFor = (name, fallback = '') => (form.elements[name] ? form.elements[name].value : (currentSubject[name] || fallback));
  return {
    externalId: valueFor('externalId'),
    firstName: valueFor('firstName'),
    lastName: valueFor('lastName'),
    grade: valueFor('grade'),
    homeroom: valueFor('homeroom'),
    track: valueFor('track'),
    team: valueFor('team'),
    subjectType: valueFor('subjectType', 'student'),
    photographedStatus: valueFor('photographedStatus', 'unknown')
  };
}

function bindStudentEditForm() {
  const form = workspaceStudentDetail.querySelector('[data-student-edit-form]');
  if (!form) {
    return;
  }

  const status = form.querySelector('[data-student-edit-status]');
  const submitButton = form.querySelector('button[type="submit"]');
  const cancelButton = form.querySelector('[data-cancel-student-edit]');

  cancelButton.addEventListener('click', () => {
    jobsState.showStudentEditForm = false;
    renderStudentWorkspace();
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    submitButton.disabled = true;
    status.textContent = 'Saving...';

    try {
      const result = await trecsApi('updateSubject').updateSubject(
        Number(form.dataset.subjectId),
        subjectInputFromForm(form)
      );
      jobsState.selectedSubjectId = result.id;
      jobsState.showStudentEditForm = false;
      await reloadCurrentJobDetail();
    } catch (error) {
      status.textContent = error.message || 'Save failed';
      console.error(error);
    } finally {
      submitButton.disabled = false;
    }
  });
}

async function submitAddRecords(event) {
  event.preventDefault();
  if (!jobsState.selectedJobId) {
    return;
  }

  const button = addRecordsForm.querySelector('button[type="submit"]');
  const count = Number(addRecordsForm.elements.recordCount.value);
  button.disabled = true;
  button.textContent = 'Adding...';
  addRecordsStatus.textContent = '';

  try {
    const previousWorkspaceMode = jobsState.workspaceMode;
    const result = await trecsApi('createBlankSubjects').createBlankSubjects(jobsState.selectedJobId, count);
    jobsState.selectedSubjectId = result.firstId;
    jobsState.workspaceStudentSearch = '';
    jobsState.showStudentEditForm = previousWorkspaceMode === 'students';
    setAddRecordsModalVisible(false);
    await reloadCurrentJobDetail();
    if (previousWorkspaceMode === 'capture' && result.firstId) {
      const subject = findById(jobsState.detail.subjects || [], result.firstId);
      if (subject) {
        await setCaptureSubject(subject, false);
      }
    }
  } catch (error) {
    addRecordsStatus.textContent = error.message || 'Add records failed';
    console.error(error);
  } finally {
    button.disabled = false;
    button.textContent = 'Add Records';
  }
}

async function imagePreviewForId(imageId) {
  if (!imageId) {
    return null;
  }
  if (!jobsState.imagePreviewCache.has(imageId)) {
    jobsState.imagePreviewCache.set(imageId, trecsApi('getImagePreview').getImagePreview(imageId));
  }
  return jobsState.imagePreviewCache.get(imageId);
}

function fitRotatedImageToFrame(image) {
  const frame = image.parentElement;
  if (!frame || !image.naturalWidth || !image.naturalHeight || image.naturalWidth <= image.naturalHeight) {
    image.style.width = '';
    return;
  }

  const frameWidth = Math.max(0, frame.clientWidth - 20);
  const frameHeight = Math.max(0, frame.clientHeight - 20);
  if (!frameWidth || !frameHeight) {
    return;
  }

  const aspect = image.naturalWidth / image.naturalHeight;
  const fittedWidth = Math.min(frameHeight, frameWidth * aspect);
  image.style.width = `${Math.max(120, fittedWidth)}px`;
}

function setLandscapeRotation(image, options = {}) {
  if (!image) {
    return;
  }
  image.classList.add('orientation-pending');
  const apply = () => {
    const isLandscape = image.naturalWidth > image.naturalHeight;
    image.classList.toggle('rotate-landscape-ccw', isLandscape);
    if (options.fitRotatedToFrame) {
      fitRotatedImageToFrame(image);
    }
    image.classList.remove('orientation-pending');
  };

  if (image.complete && image.naturalWidth) {
    apply();
  } else {
    image.addEventListener('load', apply, { once: true });
    image.addEventListener('error', () => {
      image.classList.remove('orientation-pending');
    }, { once: true });
  }
}

function linkedImagesForSubject(subjectId) {
  return rowsFor(jobsState.detail && jobsState.detail.subjectImages ? jobsState.detail.subjectImages : [], 'subjectId', subjectId);
}

function availabilityMark(value) {
  return value ? '<span class="availability-mark yes" aria-label="Exists">&#10003;</span>' : '<span class="availability-mark no" aria-label="Missing">&times;</span>';
}

function linkedImageAvailabilityTable(image) {
  return `
    <table class="linked-image-availability">
      <thead>
        <tr>
          <th>Image</th>
          <th>Large</th>
          <th>Med</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${availabilityMark(Number(image.hasOriginal || 0) > 0)}</td>
          <td>${availabilityMark(Number(image.hasCroppedLarge || 0) > 0)}</td>
          <td>${availabilityMark(Number(image.hasCroppedMed || 0) > 0)}</td>
        </tr>
      </tbody>
    </table>
  `;
}

function linkedImageStatusLine(image) {
  const parts = [];
  if (image.selected) {
    parts.push('selected');
  } else if (image.role) {
    parts.push(image.role);
  }
  if (image.status === 'rejected') {
    parts.push('rejected');
  }
  parts.push(image.shootStageLabel || 'Unknown event');
  return parts.join(' / ');
}

function renderLinkedImageCard(image, options = {}) {
  const subjectId = options.subjectId || '';
  const mode = options.mode || 'workspace';
  const imageId = image.imageAssetId;
  const selected = Boolean(image.selected);
  const rejected = image.status === 'rejected';
  const selectAttr = mode === 'workspace'
    ? `data-workspace-select-image="${imageId}"`
    : `data-link-subject-id="${subjectId}" data-link-image-id="${imageId}"`;
  const selectLabel = selected ? 'Selected' : 'Set Selected';
  const rejectButton = mode === 'workspace'
    ? `<button data-workspace-reject-image="${imageId}" data-rejected="${rejected ? '1' : '0'}" type="button">${rejected ? 'Restore' : 'Reject'}</button>`
    : '';
  const unlinkButton = mode === 'workspace'
    ? `<button data-workspace-unlink-image="${imageId}" type="button">Unlink</button>`
    : '';

  return `
    <div class="linked-image-card ${selected ? 'selected-linked-image' : ''} ${rejected ? 'rejected-linked-image' : ''}" data-linked-image-card="${imageId}" data-linked-image-subject-id="${subjectId}">
      <div class="linked-image-topline">
        <span>${escapeHtml(linkedImageStatusLine(image))}</span>
        <small>${escapeHtml(image.captureWorkstation || '')}</small>
      </div>
      <strong class="linked-image-file">${escapeHtml(image.filename || '')}</strong>
      <div class="linked-image-preview-row">
        <button class="linked-image-thumb" data-open-linked-image="${imageId}" type="button">
          <span>Loading</span>
        </button>
        <em>${escapeHtml(linkedImageMetaLine(image))}</em>
      </div>
      ${linkedImageAvailabilityTable(image)}
      <div class="linked-image-actions">
        <button ${selectAttr} type="button" ${selected || rejected ? 'disabled' : ''}>${selectLabel}</button>
        ${rejectButton}
        ${unlinkButton}
      </div>
    </div>
  `;
}

async function loadLinkedImageThumbnails(root = document) {
  const thumbs = Array.from(root.querySelectorAll('.linked-image-thumb[data-open-linked-image]'));
  await Promise.all(thumbs.map(async (button) => {
    const imageId = Number(button.dataset.openLinkedImage);
    if (!imageId) {
      return;
    }
    try {
      const preview = await imagePreviewForId(imageId);
      if (!preview || preview.missing || !preview.dataUrl) {
        button.innerHTML = '<span>No preview</span>';
        return;
      }
      button.innerHTML = `<img src="${preview.dataUrl}" alt="${escapeHtml(preview.filename || 'Linked image thumbnail')}">`;
      setLandscapeRotation(button.querySelector('img'));
    } catch (error) {
      button.innerHTML = '<span>No preview</span>';
      console.error(error);
    }
  }));
}

function bindLinkedImageCards(root = document) {
  root.querySelectorAll('[data-linked-image-card]').forEach((card) => {
    card.addEventListener('dblclick', (event) => {
      if (event.target.closest('button')) {
        return;
      }
      openImageLightbox(Number(card.dataset.linkedImageCard), {
        subjectId: Number(card.dataset.linkedImageSubjectId) || null
      });
    });
  });
  root.querySelectorAll('[data-open-linked-image]').forEach((button) => {
    button.addEventListener('click', () => {
      const card = button.closest('[data-linked-image-card]');
      openImageLightbox(Number(button.dataset.openLinkedImage), {
        subjectId: card ? Number(card.dataset.linkedImageSubjectId) || null : null
      });
    });
  });
  loadLinkedImageThumbnails(root);
}

function lightboxImagesForSubject(subjectId, fallbackImageId) {
  const linkedImages = linkedImagesForSubject(subjectId);
  const ids = linkedImages.map((image) => Number(image.imageAssetId)).filter(Boolean);
  if (fallbackImageId && !ids.includes(Number(fallbackImageId))) {
    ids.unshift(Number(fallbackImageId));
  }
  return ids;
}

function renderImageLightboxActions() {
  const hasList = jobsState.lightboxImageIds.length > 1;
  const canSelect = Boolean(jobsState.lightboxSubjectId && jobsState.lightboxImageId);
  previousLightboxImageButton.disabled = !hasList;
  nextLightboxImageButton.disabled = !hasList;
  selectLightboxImageButton.hidden = !canSelect;

  if (canSelect) {
    const linkedImage = linkedImagesForSubject(jobsState.lightboxSubjectId)
      .find((image) => Number(image.imageAssetId) === Number(jobsState.lightboxImageId));
    selectLightboxImageButton.disabled = Boolean(linkedImage && (linkedImage.selected || linkedImage.status === 'rejected'));
    selectLightboxImageButton.textContent = linkedImage && linkedImage.status === 'rejected'
      ? 'Rejected Image'
      : linkedImage && linkedImage.selected
      ? 'Selected Image'
      : 'Use As Selected Image';
  }
}

async function openImageLightbox(imageId, options = {}) {
  if (!imageId || !imageLightboxModal) {
    return;
  }

  const subjectId = options.subjectId || jobsState.selectedSubjectId || null;
  jobsState.lightboxSubjectId = subjectId;
  jobsState.lightboxImageId = Number(imageId);
  jobsState.lightboxImageIds = options.imageIds && options.imageIds.length
    ? options.imageIds.map(Number)
    : lightboxImagesForSubject(subjectId, imageId);

  imageLightboxModal.hidden = false;
  imageLightboxTitle.textContent = 'Image Preview';
  imageLightboxContent.innerHTML = '<div class="empty-state">Loading image...</div>';
  renderImageLightboxActions();

  try {
    const preview = await imagePreviewForId(imageId);
    if (!preview || preview.missing || !preview.dataUrl) {
      imageLightboxContent.innerHTML = '<div class="empty-state">Preview unavailable.</div>';
      return;
    }

    imageLightboxTitle.textContent = preview.filename || 'Image Preview';
    imageLightboxContent.innerHTML = `<img src="${preview.dataUrl}" alt="${escapeHtml(preview.filename || 'Image preview')}">`;
    setLandscapeRotation(imageLightboxContent.querySelector('img'));
    renderImageLightboxActions();
  } catch (error) {
    imageLightboxContent.innerHTML = '<div class="empty-state">Preview unavailable.</div>';
    console.error(error);
  }
}

function closeImageLightbox() {
  if (imageLightboxModal) {
    imageLightboxModal.hidden = true;
    jobsState.lightboxImageIds = [];
    jobsState.lightboxImageId = null;
    jobsState.lightboxSubjectId = null;
    imageLightboxContent.innerHTML = '<div class="empty-state">Loading image...</div>';
  }
}

function moveLightboxImage(offset) {
  const ids = jobsState.lightboxImageIds;
  if (!ids.length || !jobsState.lightboxImageId) {
    return;
  }
  const currentIndex = Math.max(0, ids.findIndex((id) => id === Number(jobsState.lightboxImageId)));
  const nextIndex = (currentIndex + offset + ids.length) % ids.length;
  openImageLightbox(ids[nextIndex], {
    subjectId: jobsState.lightboxSubjectId,
    imageIds: ids
  });
}

async function selectCurrentLightboxImage() {
  if (!jobsState.lightboxSubjectId || !jobsState.lightboxImageId) {
    return;
  }
  const originalText = selectLightboxImageButton.textContent;
  selectLightboxImageButton.disabled = true;
  selectLightboxImageButton.textContent = 'Saving...';
  try {
    await saveSubjectImageLink(jobsState.lightboxSubjectId, jobsState.lightboxImageId, null);
    await openImageLightbox(jobsState.lightboxImageId, { subjectId: jobsState.lightboxSubjectId });
  } catch (error) {
    selectLightboxImageButton.textContent = 'Failed';
    console.error(error);
  } finally {
    if (selectLightboxImageButton.textContent === 'Saving...') {
      selectLightboxImageButton.textContent = originalText;
    }
  }
}

function moveImageHoverPreview(event) {
  if (!imageHoverPreview || imageHoverPreview.hidden) {
    return;
  }
  const padding = 18;
  const width = imageHoverPreview.offsetWidth || 240;
  const height = imageHoverPreview.offsetHeight || 280;
  let left = event.clientX + padding;
  let top = event.clientY + padding;

  if (left + width > window.innerWidth - padding) {
    left = event.clientX - width - padding;
  }
  if (top + height > window.innerHeight - padding) {
    top = event.clientY - height - padding;
  }

  imageHoverPreview.style.left = `${Math.max(padding, left)}px`;
  imageHoverPreview.style.top = `${Math.max(padding, top)}px`;
}

function hideImageHoverPreview() {
  jobsState.imageHoverToken += 1;
  if (imageHoverPreview) {
    imageHoverPreview.hidden = true;
    imageHoverPreview.innerHTML = '';
  }
}

function bindHoverImagePreviews(root = document) {
  if (!imageHoverPreview) {
    return;
  }

  root.querySelectorAll('[data-hover-image-id]').forEach((element) => {
    element.addEventListener('mouseenter', async (event) => {
      const imageId = Number(element.dataset.hoverImageId);
      const token = jobsState.imageHoverToken + 1;
      jobsState.imageHoverToken = token;
      imageHoverPreview.hidden = false;
      imageHoverPreview.innerHTML = '<div class="empty-state">Loading...</div>';
      moveImageHoverPreview(event);

      try {
        const preview = await imagePreviewForId(imageId);
        if (token !== jobsState.imageHoverToken) {
          return;
        }
        if (!preview || preview.missing || !preview.dataUrl) {
          imageHoverPreview.innerHTML = '<div class="empty-state">Preview unavailable.</div>';
          return;
        }
        imageHoverPreview.innerHTML = `
          <img src="${preview.dataUrl}" alt="${escapeHtml(preview.filename || 'Image preview')}">
          <span>${escapeHtml(preview.filename || '')}</span>
        `;
        setLandscapeRotation(imageHoverPreview.querySelector('img'));
      } catch (error) {
        if (token === jobsState.imageHoverToken) {
          imageHoverPreview.innerHTML = '<div class="empty-state">Preview unavailable.</div>';
        }
        console.error(error);
      }
    });

    element.addEventListener('mousemove', moveImageHoverPreview);
    element.addEventListener('mouseleave', hideImageHoverPreview);
    element.addEventListener('dblclick', (event) => {
      if (event.target.closest('button') && event.target.closest('button') !== element) {
        return;
      }
      openImageLightbox(Number(element.dataset.hoverImageId));
    });
  });
}

async function loadWorkspacePhoto(imageId) {
  const panel = document.getElementById('workspacePhotoPanel');
  if (!panel) {
    return;
  }

  if (!imageId) {
    panel.innerHTML = '<div class="empty-state">No photo linked.</div>';
    return;
  }

  try {
    const preview = await imagePreviewForId(imageId);
    if (!preview || preview.missing || !preview.dataUrl) {
      panel.innerHTML = '<div class="empty-state">Preview unavailable.</div>';
      return;
    }

    panel.innerHTML = `<img src="${preview.dataUrl}" alt="${escapeHtml(preview.filename)}">`;
    const image = panel.querySelector('img');
    setLandscapeRotation(image);
    image.addEventListener('dblclick', () => openImageLightbox(imageId, {
      subjectId: jobsState.selectedSubjectId
    }));
  } catch (error) {
    panel.innerHTML = '<div class="empty-state">Preview unavailable.</div>';
    console.error(error);
  }
}

async function loadEnvelopeSubjectPhoto(imageId) {
  const panel = document.getElementById('envelopeSubjectPhoto');
  if (!panel) {
    return;
  }

  if (!imageId) {
    panel.innerHTML = '<div class="empty-state">No photo linked.</div>';
    return;
  }

  try {
    const preview = await trecsApi('getImagePreview').getImagePreview(imageId);
    if (!preview || preview.missing || !preview.dataUrl) {
      panel.innerHTML = '<div class="empty-state">Preview unavailable.</div>';
      return;
    }

    panel.innerHTML = `<img src="${preview.dataUrl}" alt="${escapeHtml(preview.filename)}">`;
  } catch (error) {
    panel.innerHTML = '<div class="empty-state">Preview unavailable.</div>';
    console.error(error);
  }
}

function renderWorkspaceOrderDetail(subject) {
  if (!subject) {
    workspaceOrderDetail.innerHTML = '<div class="empty-state">No student selected.</div>';
    return;
  }

  const orders = rowsFor(jobsState.detail.subjectOrders || [], 'subjectId', subject.id);
  const images = rowsFor(jobsState.detail.subjectImages || [], 'subjectId', subject.id);

  workspaceOrderDetail.innerHTML = `
    <div class="panel-heading">
      <h2>Orders</h2>
      <span>${formatNumber(orders.length)}</span>
    </div>
    ${renderMiniSection(
      'Order Summary',
      orders.map((order) => `
        <div class="mini-order-row">
          <span>#${order.id} ${order.source} / ${order.paidStatus}</span>
          <strong>${order.packageCodes || 'No codes'} (${order.itemCount} items)</strong>
          <div class="mini-row-actions">
            <button data-workspace-order-envelope="${order.id}" type="button">View</button>
            <button data-workspace-order-edit="${order.id}" type="button">Edit</button>
            <button data-workspace-order-delete="${order.id}" type="button">Delete</button>
          </div>
        </div>
      `),
      'No orders for this student.'
    )}
    ${renderMiniSection(
      'Linked Images',
      images.map((image) => renderLinkedImageCard(image, { subjectId: subject.id, mode: 'workspace' })),
      'No linked images.'
    )}
  `;

  workspaceOrderDetail.querySelectorAll('[data-workspace-order-envelope]').forEach((row) => {
    row.addEventListener('click', () => {
      showOrderEnvelope(Number(row.dataset.workspaceOrderEnvelope));
    });
  });
  workspaceOrderDetail.querySelectorAll('[data-workspace-order-edit]').forEach((button) => {
    button.addEventListener('click', () => {
      showEditOrder(Number(button.dataset.workspaceOrderEdit));
    });
  });
  workspaceOrderDetail.querySelectorAll('[data-workspace-order-delete]').forEach((button) => {
    button.addEventListener('click', () => {
      deleteWorkspaceOrder(Number(button.dataset.workspaceOrderDelete));
    });
  });
  workspaceOrderDetail.querySelectorAll('[data-workspace-select-image]').forEach((button) => {
    button.addEventListener('click', async () => {
      await saveSubjectImageLink(subject.id, Number(button.dataset.workspaceSelectImage), button);
    });
  });
  workspaceOrderDetail.querySelectorAll('[data-workspace-reject-image]').forEach((button) => {
    button.addEventListener('click', async () => {
      const imageId = Number(button.dataset.workspaceRejectImage);
      const currentlyRejected = button.dataset.rejected === '1';
      await setLinkedImageRejected(imageId, !currentlyRejected, button);
    });
  });
  workspaceOrderDetail.querySelectorAll('[data-workspace-unlink-image]').forEach((button) => {
    button.addEventListener('click', async () => {
      await unlinkLinkedImage(subject.id, Number(button.dataset.workspaceUnlinkImage), button);
    });
  });
  bindLinkedImageCards(workspaceOrderDetail);
}

async function showOrderEnvelope(orderId) {
  jobsState.viewingEnvelopeScanId = null;
  orderEnvelopeModal.hidden = false;
  orderEnvelopeActions.hidden = true;
  orderEnvelopeTitle.textContent = `Order #${orderId} Envelope`;
  orderEnvelopePreview.innerHTML = '<div class="empty-state">Loading envelope...</div>';

  try {
    const preview = await trecsApi('getOrderEnvelopePreview').getOrderEnvelopePreview(orderId);
    const subjectLine = [preview.ref, preview.subjectName].filter(Boolean).join(' ');
    orderEnvelopeTitle.textContent = `Order #${orderId}${subjectLine ? ` / ${subjectLine}` : ''}`;
    renderOrderEnvelopePreview(orderEnvelopePreview, preview);
  } catch (error) {
    orderEnvelopePreview.innerHTML = `<div class="empty-state">${escapeHtml(error.message || 'Could not load envelope.')}</div>`;
    console.error(error);
  }
}

function renderOrderEnvelopePreview(container, preview) {
  if (preview.missing || !preview.dataUrl) {
    container.innerHTML = `<div class="empty-state">${escapeHtml(preview.reason || 'No envelope scan linked.')}</div>`;
    return;
  }

  container.innerHTML = `
    <img src="${preview.dataUrl}" alt="${escapeHtml(preview.filename || 'Envelope scan')}">
    <div class="order-envelope-meta">
      <span>${escapeHtml(preview.filename || '')}</span>
      <span>${preview.keyedOrderCode ? `Codes: ${escapeHtml(preview.keyedOrderCode)}` : ''}</span>
    </div>
  `;
}

function closeOrderEnvelope() {
  jobsState.viewingEnvelopeScanId = null;
  orderEnvelopeModal.hidden = true;
  orderEnvelopeActions.hidden = true;
  orderEnvelopePreview.innerHTML = '<div class="empty-state">Loading envelope...</div>';
}

function showEditOrder(orderId) {
  const order = findById(jobsState.detail.subjectOrders || [], orderId) || findById(jobsState.detail.orders || [], orderId);
  if (!order) {
    return;
  }

  jobsState.editingOrderId = orderId;
  editOrderTitle.textContent = `Edit Order #${orderId}`;
  editOrderForm.elements.orderCodes.value = order.packageCodes || '';
  editOrderForm.elements.paidStatus.value = order.paidStatus || 'unknown';
  editOrderForm.elements.notes.value = order.notes || '';
  editOrderEnvelopePreview.innerHTML = '<div class="empty-state">Loading envelope...</div>';
  editOrderStatus.textContent = '';
  editOrderModal.hidden = false;
  editOrderForm.elements.orderCodes.focus();
  editOrderForm.elements.orderCodes.select();
  loadEditOrderEnvelope(orderId);
}

async function loadEditOrderEnvelope(orderId) {
  try {
    const preview = await trecsApi('getOrderEnvelopePreview').getOrderEnvelopePreview(orderId);
    renderOrderEnvelopePreview(editOrderEnvelopePreview, preview);
  } catch (error) {
    editOrderEnvelopePreview.innerHTML = `<div class="empty-state">${escapeHtml(error.message || 'Could not load envelope.')}</div>`;
    console.error(error);
  }
}

function closeEditOrder() {
  jobsState.editingOrderId = null;
  editOrderModal.hidden = true;
  editOrderStatus.textContent = '';
}

async function submitEditOrder(event) {
  event.preventDefault();
  if (!jobsState.editingOrderId) {
    return;
  }

  const button = editOrderForm.querySelector('button[type="submit"]');
  button.disabled = true;
  editOrderStatus.textContent = 'Saving...';

  try {
    const result = await trecsApi('updateOrder').updateOrder(jobsState.editingOrderId, {
      orderCodes: editOrderForm.elements.orderCodes.value,
      paidStatus: editOrderForm.elements.paidStatus.value,
      notes: editOrderForm.elements.notes.value
    });
    jobsState.selectedOrderId = result.id;
    closeEditOrder();
    await reloadCurrentJobDetail();
  } catch (error) {
    editOrderStatus.textContent = error.message || 'Save failed';
    console.error(error);
  } finally {
    button.disabled = false;
  }
}

async function deleteWorkspaceOrder(orderId) {
  const order = findById(jobsState.detail.subjectOrders || [], orderId) || findById(jobsState.detail.orders || [], orderId);
  const label = order && order.packageCodes ? `#${orderId} (${order.packageCodes})` : `#${orderId}`;
  if (!confirm(`Delete order ${label}? This will keep the envelope scan but remove the order and its items.`)) {
    return;
  }

  try {
    await trecsApi('deleteOrder').deleteOrder(orderId);
    if (jobsState.selectedOrderId === orderId) {
      jobsState.selectedOrderId = null;
    }
    await reloadCurrentJobDetail();
    if (jobsState.workspaceMode === 'envelope') {
      await loadUnlinkedEnvelopeScans();
    }
  } catch (error) {
    alert(error.message || 'Delete failed');
    console.error(error);
  }
}

function renderCaptureWorkspace() {
  if (!jobsState.detail || !jobsState.detail.summary) {
    return;
  }

  const job = jobsState.detail.summary;
  title.textContent = `${job.job} Image Capture`;
  workspaceJobTitle.textContent = `${job.location} / ${job.job}`;
  workspaceJobMeta.textContent = '';
  renderCaptureSessionMeta();
  renderCaptureFileModeToggle();
  renderCapturePhotoCount();
  renderCaptureSubject();
  loadCaptureImages();

  focusCaptureBarcode();
}

function captureFileModeLabel(mode = jobsState.captureFileMode) {
  return mode === 'jpg_only' ? 'JPG Only' : 'JPG + CR3';
}

function captureShootStageLabel(stage = jobsState.captureShootStage) {
  return formatShootStage(stage);
}

function captureFileModeControlsVisible() {
  const photographer = jobsState.captureSession && jobsState.captureSession.photographerName;
  return String(photographer || '').trim().toLowerCase() === 'troy';
}

function renderCaptureSessionMeta() {
  if (!captureSessionMeta) {
    return;
  }
  const job = jobsState.detail && jobsState.detail.summary ? jobsState.detail.summary : {};
  captureSessionMeta.textContent = [
    job.location && job.job ? `${job.location} / ${job.job}` : '',
    captureShootStageLabel(),
    jobsState.captureSession && jobsState.captureSession.photographerName,
    jobsState.captureSession && jobsState.captureSession.workstationName
  ].filter(Boolean).join(' / ');
}

function renderCaptureFileModeToggle() {
  const visible = captureFileModeControlsVisible();
  if (!visible) {
    jobsState.captureFileMode = 'jpg_raw';
  }
  if (captureFileModeControl) {
    captureFileModeControl.hidden = !visible;
  }
  if (!captureFileModeToggle) {
    return;
  }

  captureFileModeToggle.querySelectorAll('[data-capture-file-mode]').forEach((button) => {
    button.classList.toggle('active', button.dataset.captureFileMode === jobsState.captureFileMode);
  });
}

function renderCapturePhotoCount() {
  if (!capturePhotoCount) {
    return;
  }
  const summary = jobsState.detail && jobsState.detail.summary ? jobsState.detail.summary : {};
  const jpgCount = Number(summary.activeCaptureImages || 0);
  const sessionStudents = Number(summary.activeCaptureSubjects || 0);
  const totalPhotographed = Number(summary.subjectsWithPrimaryImage || 0);
  const totalRecords = Number(summary.subjects || 0);
  capturePhotoCount.textContent = `${formatNumber(jpgCount)} JPG / ${formatNumber(sessionStudents)} students / ${formatNumber(totalPhotographed)} photo / ${formatNumber(totalRecords)} records`;
}

async function setCaptureFileMode(fileMode) {
  if (!captureFileModeControlsVisible()) {
    jobsState.captureFileMode = 'jpg_raw';
    renderCaptureFileModeToggle();
    return;
  }
  const nextMode = fileMode === 'jpg_only' ? 'jpg_only' : 'jpg_raw';
  if (jobsState.captureFileMode === nextMode) {
    return;
  }

  jobsState.captureFileMode = nextMode;
  renderCaptureFileModeToggle();
  setCapturePairStatus({ ready: true, message: `Ready (${captureShootStageLabel()} / ${captureFileModeLabel()})` });

  if (jobsState.captureSubject) {
    try {
      await startCaptureWatcherForCurrentSubject();
    } catch (error) {
      captureEntryStatus.textContent = error.message || 'Could not restart capture watcher';
      console.error(error);
    }
  }
}

async function setCaptureShootStage(stage) {
  const nextStage = ['main', 'makeup', 'retake', 'other'].includes(stage) ? stage : 'main';
  if (jobsState.captureShootStage === nextStage) {
    return;
  }

  jobsState.captureShootStage = nextStage;
  renderCaptureSessionMeta();
  setCapturePairStatus({ ready: true, message: `Ready (${captureShootStageLabel()})` });

  if (jobsState.captureSubject) {
    try {
      await startCaptureWatcherForCurrentSubject();
    } catch (error) {
      captureEntryStatus.textContent = error.message || 'Could not restart capture watcher';
      console.error(error);
    }
  }
}

function captureReviewImages() {
  const capture = jobsState.detail && jobsState.detail.capture ? jobsState.detail.capture : {};
  return capture.reviewCandidates || [];
}

function renderImageReviewWorkspace() {
  if (!imageReviewWorkspace) {
    return;
  }

  const capture = jobsState.detail && jobsState.detail.capture ? jobsState.detail.capture : null;
  if (!capture || !capture.summary) {
    imageReviewWorkspace.innerHTML = '<div class="empty-state">No image review data found.</div>';
    return;
  }

  const reviewImages = captureReviewImages();
  if (!jobsState.selectedImageId || !reviewImages.some((image) => Number(image.id) === Number(jobsState.selectedImageId))) {
    jobsState.selectedImageId = reviewImages.length ? Number(reviewImages[0].id) : null;
  }

  imageReviewWorkspace.innerHTML = `
    <div class="panel-heading">
      <h2>Unlinked / Review Images</h2>
      <span>${formatNumber((capture.reviewCandidates || []).length)} review / ${formatNumber(capture.summary.unlinkedImages || 0)} unlinked</span>
    </div>
    <div class="image-review-layout">
      <section class="image-review-assign">
        ${renderImageLinkPanel(jobsState.selectedImageId, { mode: 'review' })}
      </section>
      <section class="image-review-main">
        <aside class="capture-preview image-review-preview" id="imagePreviewPanel">
          <div class="empty-state">Select an image to review.</div>
        </aside>
        <div class="image-review-list">
          ${tableHtml(
            ['Filename', 'Reason', 'Links', 'Refs'],
            reviewImages.map((image) => `
              <tr class="${Number(image.id) === Number(jobsState.selectedImageId) ? 'selected-row' : ''}" data-capture-review-image-id="${image.id}">
                <td>${escapeHtml(image.filename || '')}</td>
                <td>${escapeHtml(image.reason || (Number(image.linkedSubjects) === 0 ? 'Unlinked image' : 'Review'))}</td>
                <td>${formatNumber(image.linkedSubjects || 0)}</td>
                <td>${escapeHtml(image.refs || '')}</td>
              </tr>
            `),
            'No unlinked or review images found.'
          )}
        </div>
      </section>
    </div>
  `;

  imageReviewWorkspace.querySelectorAll('[data-capture-review-image-id]').forEach((row) => {
    row.addEventListener('click', () => {
      jobsState.selectedImageId = Number(row.dataset.captureReviewImageId);
      renderImageReviewWorkspace();
    });
  });

  bindImagePreviewLinkForm({ mode: 'review' });
  loadReviewSubjectPreview();
  loadImagePreview(jobsState.selectedImageId, { includeLinkPanel: false, layout: 'review' });
}

function isBlankCaptureSubject(subject) {
  return ![
    subject.firstName,
    subject.lastName,
    subject.name,
    subject.externalId,
    subject.grade,
    subject.homeroom
  ].some((value) => String(value || '').trim());
}

function captureHomeroomOptions(currentHomeroom = '') {
  const seen = new Set();
  const options = [];
  (jobsState.detail && jobsState.detail.subjects ? jobsState.detail.subjects : []).forEach((subject) => {
    const homeroom = String(subject.homeroom || '').trim();
    if (!homeroom || seen.has(homeroom.toLowerCase())) {
      return;
    }
    seen.add(homeroom.toLowerCase());
    options.push(homeroom);
  });
  const current = String(currentHomeroom || '').trim();
  if (current && !seen.has(current.toLowerCase())) {
    options.push(current);
  }
  return options.sort((first, second) => first.localeCompare(second, undefined, { numeric: true, sensitivity: 'base' }));
}

function renderCaptureHomeroomField(subject, disabled = false) {
  const value = subject.homeroom || '';
  const options = captureHomeroomOptions(value);
  const disabledAttr = disabled ? 'disabled' : '';
  if (options.length) {
    return `
      <select name="homeroom" ${disabledAttr}>
        <option value="">Choose homeroom</option>
        ${options.map((homeroom) => `<option value="${escapeHtml(homeroom)}" ${homeroom === value ? 'selected' : ''}>${escapeHtml(homeroom)}</option>`).join('')}
      </select>
    `;
  }
  return `<input name="homeroom" value="${escapeHtml(value)}" ${disabledAttr}>`;
}

function focusFirstCaptureStudentField() {
  setTimeout(() => {
    const firstInput = captureSubjectDetail.querySelector('[data-capture-subject-form] input:not([disabled]), [data-capture-subject-form] select:not([disabled]), [data-capture-subject-form] textarea:not([disabled])');
    if (firstInput) {
      firstInput.focus();
      if (typeof firstInput.select === 'function') {
        firstInput.select();
      }
    }
  }, 0);
}

function renderCaptureSubject() {
  const subject = jobsState.captureSubject;
  if (!subject) {
    captureSubjectDetail.innerHTML = '<div class="empty-state">Scan a camera card barcode or search for a student.</div>';
    capturePreviewMeta.textContent = '';
    return;
  }

  const isEditing = jobsState.captureSubjectEditId === subject.id;
  const lockedAttr = isEditing ? '' : 'disabled';
  const homeroomField = renderCaptureHomeroomField(subject, !isEditing);
  const editButton = isEditing
    ? '<button class="primary capture-student-edit-button" type="submit">Save</button>'
    : '<button class="capture-student-edit-button" data-capture-edit-student type="button">Edit Student</button>';
  captureSubjectDetail.innerHTML = `
    <div class="capture-subject-current ${subject.imageAssetId ? 'has-photo' : ''}">
      <div class="capture-subject-info-column">
        <div class="capture-subject-card">
          <span>${escapeHtml(subject.ref || '')}</span>
          <strong>${escapeHtml(subject.name || 'Unnamed student')}</strong>
          <em>${escapeHtml([subject.grade, subject.homeroom].filter(Boolean).join(' / '))}</em>
          <small>${escapeHtml(subject.externalId || '')}</small>
        </div>
      </div>
      ${subject.imageAssetId ? '<div class="capture-subject-photo-column"><div class="capture-subject-photo" id="captureSubjectPhoto"><div class="empty-state">Loading photo...</div></div></div>' : ''}
      <form class="capture-subject-form" data-capture-subject-form data-subject-id="${subject.id}">
        <div class="subheading">
          <h3>Student Info</h3>
          <span data-capture-subject-status></span>
        </div>
        <div class="capture-subject-fields compact">
          <label>
            <span>First Name</span>
            <input name="firstName" value="${escapeHtml(subject.firstName || '')}" ${lockedAttr}>
          </label>
          <label>
            <span>Last Name</span>
            <input name="lastName" value="${escapeHtml(subject.lastName || '')}" ${lockedAttr}>
          </label>
          <label>
            <span>Student ID</span>
            <input name="externalId" value="${escapeHtml(subject.externalId || '')}" ${lockedAttr}>
          </label>
          <label>
            <span>Grade</span>
            <input name="grade" value="${escapeHtml(subject.grade || '')}" ${lockedAttr}>
          </label>
          <label class="capture-homeroom-field">
            <span>Homeroom</span>
            <div class="capture-homeroom-row">
              ${homeroomField}
              ${editButton}
            </div>
          </label>
          <label class="wide-field">
            <span>Notes</span>
            <textarea name="notes" rows="2" ${lockedAttr}>${escapeHtml(subject.notes || '')}</textarea>
          </label>
        </div>
      </form>
    </div>
  `;
  bindCaptureSubjectForm();
  loadCaptureSubjectPhoto(subject.imageAssetId);
}

function renderCaptureCompare() {
  const images = jobsState.captureImages || [];
  capturePreviewMeta.textContent = jobsState.captureSubject
    ? `${formatNumber(images.length)} comparison image${images.length === 1 ? '' : 's'}`
    : '';

  if (!jobsState.captureSubject) {
    captureCompareGrid.innerHTML = '<div class="empty-state">Load a student, then capture images into CaptureHotFolder.</div>';
    return;
  }

  let selectedImage = null;
  let mostRecent = null;
  if (jobsState.captureCompareSlotIds) {
    selectedImage = images.find((image) => Number(image.id) === Number(jobsState.captureCompareSlotIds.previousId)) || null;
    mostRecent = images.find((image) => Number(image.id) === Number(jobsState.captureCompareSlotIds.recentId)) || null;
  }
  if (!selectedImage && !mostRecent) {
    selectedImage = images.find((image) => image.selected) || images[1] || images[0] || null;
    mostRecent = images.find((image) => !selectedImage || Number(image.id) !== Number(selectedImage.id)) || null;
    jobsState.captureCompareSlotIds = {
      previousId: selectedImage ? selectedImage.id : null,
      recentId: mostRecent ? mostRecent.id : null
    };
  }
  const slots = [
    { image: selectedImage, label: 'Previous Image' },
    { image: mostRecent, label: 'Most Recent Image' }
  ];
  captureCompareGrid.innerHTML = slots.map((slot) => {
    const image = slot.image;
    if (!image) {
      return `
        <button class="capture-image-slot empty" type="button" disabled>
          <span>${slot.label}</span>
          <strong>No image yet</strong>
        </button>
      `;
    }
    return `
      <button class="capture-image-slot ${image.selected ? 'selected' : ''}" data-capture-select-image="${image.id}" type="button">
        <span>${slot.label}</span>
        ${image.dataUrl ? `<div class="capture-image-stage"><img data-capture-orient src="${image.dataUrl}" alt="${escapeHtml(image.filename || 'Captured image')}"></div>` : '<strong>Preview unavailable</strong>'}
        <em>${escapeHtml(image.filename || '')}</em>
      </button>
    `;
  }).join('');

  captureCompareGrid.querySelectorAll('[data-capture-orient]').forEach((image) => {
    image.addEventListener('load', () => {
      image.classList.toggle('rotate-ccw', image.naturalWidth > image.naturalHeight);
    }, { once: true });
  });

  captureCompareGrid.querySelectorAll('[data-capture-select-image]').forEach((button) => {
    button.addEventListener('click', () => {
      selectCaptureImage(Number(button.dataset.captureSelectImage), button);
    });
  });
}

function setCapturePairStatus(status) {
  const ready = !status || status.ready !== false;
  const message = status && status.message ? status.message : 'Ready';
  capturePairStatus.classList.toggle('ready', ready);
  capturePairStatus.classList.toggle('waiting', !ready);
  capturePairStatus.innerHTML = `<i></i>${escapeHtml(message)}`;
}

async function loadCaptureSubjectPhoto(imageId) {
  const panel = document.getElementById('captureSubjectPhoto');
  if (!panel || !imageId) {
    return;
  }

  try {
    const preview = await trecsApi('getImagePreview').getImagePreview(imageId);
    if (!preview || preview.missing || !preview.dataUrl) {
      panel.innerHTML = '<div class="empty-state">Preview unavailable.</div>';
      return;
    }

    panel.innerHTML = `<img src="${preview.dataUrl}" alt="${escapeHtml(preview.filename || 'Student photo')}">`;
    setLandscapeRotation(panel.querySelector('img'));
  } catch (error) {
    panel.innerHTML = '<div class="empty-state">Preview unavailable.</div>';
    console.error(error);
  }
}

function bindCaptureSubjectForm() {
  const form = captureSubjectDetail.querySelector('[data-capture-subject-form]');
  if (!form) {
    return;
  }

  const editButton = form.querySelector('[data-capture-edit-student]');
  if (editButton) {
    editButton.addEventListener('click', () => {
      const subject = jobsState.captureSubject;
      if (!subject) {
        return;
      }
      jobsState.captureSubjectEditId = subject.id;
      renderCaptureSubject();
      focusFirstCaptureStudentField();
    });
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const subject = jobsState.captureSubject;
    if (!subject) {
      return;
    }
    if (jobsState.captureSubjectEditId !== subject.id) {
      return;
    }

    const status = form.querySelector('[data-capture-subject-status]');
    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    status.textContent = 'Saving...';

    try {
      if (form.elements.firstName) {
        const updatedSubjectFields = {
          externalId: form.elements.externalId.value,
          firstName: form.elements.firstName.value,
          lastName: form.elements.lastName.value,
          grade: form.elements.grade.value,
          homeroom: form.elements.homeroom.value,
          track: subject.track || '',
          team: subject.team || '',
          subjectType: subject.subjectType || 'student',
          photographedStatus: subject.photographedStatus || 'unknown'
        };
        await trecsApi('updateSubject').updateSubject(subject.id, updatedSubjectFields);
        jobsState.captureSubject = {
          ...subject,
          ...updatedSubjectFields,
          name: [updatedSubjectFields.firstName, updatedSubjectFields.lastName].filter(Boolean).join(' ') || subject.name
        };
      }

      const notesResult = await trecsApi('updateSubjectNotes').updateSubjectNotes(subject.id, form.elements.notes.value);
      jobsState.captureSubject = {
        ...jobsState.captureSubject,
        notes: notesResult.notes
      };
      const detailSubject = findById(jobsState.detail.subjects || [], subject.id);
      if (detailSubject) {
        Object.assign(detailSubject, jobsState.captureSubject);
      }
      jobsState.captureSubjectEditId = null;
      status.textContent = 'Saved';
      renderCaptureSubject();
      focusCaptureBarcode(true);
    } catch (error) {
      status.textContent = error.message || 'Save failed';
      console.error(error);
    } finally {
      button.disabled = false;
    }
  });
}

async function loadCaptureImages(options = {}) {
  if (!jobsState.captureSubject) {
    jobsState.captureImages = [];
    jobsState.captureCompareSlotIds = null;
    renderCaptureCompare();
    return;
  }

  try {
    jobsState.captureImages = await trecsApi('getCaptureSubjectImages').getCaptureSubjectImages(jobsState.captureSubject.id);
    if (!options.preserveSlots) {
      jobsState.captureCompareSlotIds = null;
    }
    renderCaptureCompare();
  } catch (error) {
    captureCompareGrid.innerHTML = `<div class="empty-state">${escapeHtml(error.message || 'Could not load capture images.')}</div>`;
    console.error(error);
  }
}

async function lookupCaptureSubject() {
  const barcode = captureEntryForm.elements.barcode.value.trim();
  if (!barcode || !jobsState.selectedJobId) {
    return;
  }

  captureEntryStatus.textContent = '';
  try {
    const result = await trecsApi('findSubjectByBarcode').findSubjectByBarcode(jobsState.selectedJobId, barcode);
    await setCaptureSubject(result.subject, true);
  } catch (error) {
    jobsState.captureSubject = null;
    jobsState.captureSubjectEditId = null;
    jobsState.captureCompareSlotIds = null;
    await stopCaptureWatcher();
    captureEntryStatus.textContent = error.message || 'Student not found';
    renderCaptureSubject();
    renderCaptureCompare();
    console.error(error);
  }
}

async function setCaptureSubject(subject, focusBarcode = false) {
  if (!subject) {
    return;
  }

  const shouldEditBlank = isBlankCaptureSubject(subject);
  jobsState.captureSubject = subject;
  jobsState.captureSubjectEditId = shouldEditBlank ? subject.id : null;
  jobsState.captureCompareSlotIds = null;
  jobsState.selectedSubjectId = subject.id;
  captureEntryForm.elements.barcode.value = subject.ref || subject.externalId || '';
  captureEntryStatus.textContent = '';
  renderCaptureSubject();
  await loadCaptureImages();
  await startCaptureWatcherForCurrentSubject();
  if (shouldEditBlank) {
    focusFirstCaptureStudentField();
  } else if (focusBarcode) {
    focusCaptureBarcode(true);
  }
}

function hideCaptureStudentSearch() {
  jobsState.captureSearchResults = [];
  jobsState.captureSearchActiveIndex = -1;
  captureStudentSearchResults.hidden = true;
  captureStudentSearchResults.innerHTML = '';
}

function renderCaptureStudentSearchResults() {
  const results = jobsState.captureSearchResults || [];
  if (!results.length) {
    captureStudentSearchResults.hidden = true;
    captureStudentSearchResults.innerHTML = '';
    return;
  }

  captureStudentSearchResults.innerHTML = results.map((subject, index) => `
    <button class="${index === jobsState.captureSearchActiveIndex ? 'active' : ''}" data-capture-student-index="${index}" type="button">
      <strong>${escapeHtml(subject.name || 'Unnamed student')}</strong>
      <span>${escapeHtml([subject.ref ? `Ref ${subject.ref}` : '', subject.grade ? `Grade ${subject.grade}` : '', subject.homeroom ? `HR ${subject.homeroom}` : ''].filter(Boolean).join(' / '))}</span>
    </button>
  `).join('');
  captureStudentSearchResults.hidden = false;

  captureStudentSearchResults.querySelectorAll('[data-capture-student-index]').forEach((button) => {
    button.addEventListener('mousedown', (event) => {
      event.preventDefault();
    });
    button.addEventListener('click', () => {
      selectCaptureSearchResult(Number(button.dataset.captureStudentIndex));
    });
  });
}

async function searchCaptureStudents() {
  const input = captureEntryForm.elements.studentSearch;
  const search = input.value.trim();
  const mode = captureEntryForm.elements.searchMode ? captureEntryForm.elements.searchMode.value : 'all';
  const minimumLength = mode === 'grade' || mode === 'homeroom' ? 1 : 2;
  if (!jobsState.selectedJobId || search.length < minimumLength) {
    hideCaptureStudentSearch();
    return;
  }

  try {
    const results = await trecsApi('searchEnvelopeSubjects').searchEnvelopeSubjects(jobsState.selectedJobId, search, mode);
    if (input.value.trim() !== search) {
      return;
    }
    jobsState.captureSearchResults = results;
    jobsState.captureSearchActiveIndex = results.length ? 0 : -1;
    renderCaptureStudentSearchResults();
  } catch (error) {
    captureStudentSearchResults.hidden = false;
    captureStudentSearchResults.innerHTML = `<div class="empty-state">${escapeHtml(error.message || 'Student search failed')}</div>`;
    console.error(error);
  }
}

async function selectCaptureSearchResult(index) {
  const subject = jobsState.captureSearchResults[index];
  if (!subject) {
    return;
  }

  captureEntryForm.elements.studentSearch.value = '';
  hideCaptureStudentSearch();
  await setCaptureSubject(subject, true);
}

async function startCaptureWatcherForCurrentSubject() {
  if (!jobsState.captureSubject) {
    return;
  }

  setCapturePairStatus({ ready: true, message: `Ready (${captureFileModeLabel()})` });
  return trecsApi('startCaptureWatcher').startCaptureWatcher(
    jobsState.selectedJobId,
    jobsState.captureSubject.id,
    {
      fileMode: jobsState.captureFileMode,
      shootStage: jobsState.captureShootStage,
      photographerName: jobsState.captureSession && jobsState.captureSession.photographerName,
      workstationName: jobsState.captureSession && jobsState.captureSession.workstationName
    }
  );
}

async function stopCaptureWatcher() {
  if (!window.trecs || typeof window.trecs.stopCaptureWatcher !== 'function') {
    return;
  }
  await trecsApi('stopCaptureWatcher').stopCaptureWatcher();
}

async function handleCaptureImageImported(payload) {
  if (!payload) {
    return;
  }
  if (payload.status) {
    setCapturePairStatus(payload.status);
  }
  if (payload.error) {
    captureEntryStatus.textContent = payload.error;
    return;
  }
  if (!payload.image || !jobsState.captureSubject || payload.image.subjectId !== jobsState.captureSubject.id) {
    return;
  }

  captureEntryStatus.textContent = `Captured ${payload.image.filename}`;
  await loadCaptureImages();
  await reloadCurrentJobDetail();
}

async function selectCaptureImage(imageId, control) {
  if (!jobsState.captureSubject || !imageId) {
    return;
  }

  const originalText = control ? control.querySelector('span')?.textContent : '';
  if (control) {
    control.disabled = true;
  }

  try {
    await trecsApi('selectCaptureImage').selectCaptureImage(jobsState.captureSubject.id, imageId);
    jobsState.captureImages = (jobsState.captureImages || []).map((image) => ({
      ...image,
      selected: Number(image.id) === Number(imageId)
    }));
    renderCaptureCompare();
    focusCaptureBarcode(true);
  } catch (error) {
    captureEntryStatus.textContent = error.message || 'Could not select image';
    console.error(error);
  } finally {
    if (control) {
      control.disabled = false;
      const label = control.querySelector('span');
      if (label && originalText) {
        label.textContent = originalText;
      }
    }
  }
}

function renderEnvelopeWorkspace() {
  if (!jobsState.detail || !jobsState.detail.summary) {
    return;
  }

  const job = jobsState.detail.summary;
  title.textContent = `${job.job} Envelope Entry`;
  workspaceJobTitle.textContent = `${job.location} / ${job.job}`;
  workspaceJobMeta.textContent = `${formatType(job.type)} / Envelope scan order entry`;
  renderEnvelopeSubject();
  renderEnvelopePreview();
  loadUnlinkedEnvelopeScans();

  setTimeout(() => {
    envelopeEntryForm.elements.barcode.focus();
    envelopeEntryForm.elements.barcode.select();
  }, 0);
}

async function loadUnlinkedEnvelopeScans() {
  if (!jobsState.selectedJobId || jobsState.workspaceMode !== 'envelope') {
    return;
  }

  unlinkedEnvelopeList.innerHTML = '<div class="empty-state">Loading unlinked envelopes...</div>';
  try {
    jobsState.unlinkedEnvelopeScans = await trecsApi('getUnlinkedEnvelopeScans').getUnlinkedEnvelopeScans(jobsState.selectedJobId);
    renderUnlinkedEnvelopeScans();
  } catch (error) {
    unlinkedEnvelopeList.innerHTML = `<div class="empty-state">${escapeHtml(error.message || 'Could not load unlinked envelopes.')}</div>`;
    console.error(error);
  }
}

function renderUnlinkedEnvelopeScans() {
  const scans = jobsState.unlinkedEnvelopeScans || [];
  if (!scans.length) {
    unlinkedEnvelopeList.innerHTML = '<div class="empty-state">No unlinked envelopes.</div>';
    return;
  }

  unlinkedEnvelopeList.innerHTML = scans.map((scan) => `
    <div class="unlinked-envelope-row">
      <div>
        <span>${escapeHtml(scan.ref || scan.envelopeIdentifier || '')}</span>
        <strong>${escapeHtml(scan.subjectName || 'Unassigned envelope')}</strong>
        <em>${escapeHtml(scan.scanPath || '')}</em>
      </div>
      <button data-unlinked-envelope-view="${scan.id}" type="button">View</button>
    </div>
  `).join('');

  unlinkedEnvelopeList.querySelectorAll('[data-unlinked-envelope-view]').forEach((button) => {
    button.addEventListener('click', () => {
      showEnvelopeScan(Number(button.dataset.unlinkedEnvelopeView));
    });
  });
}

async function showEnvelopeScan(scanId) {
  jobsState.viewingEnvelopeScanId = scanId;
  orderEnvelopeModal.hidden = false;
  orderEnvelopeActions.hidden = false;
  orderEnvelopeTitle.textContent = `Envelope Scan #${scanId}`;
  orderEnvelopePreview.innerHTML = '<div class="empty-state">Loading envelope...</div>';

  try {
    const preview = await trecsApi('getEnvelopeScanPreview').getEnvelopeScanPreview(scanId);
    const subjectLine = [preview.ref, preview.subjectName].filter(Boolean).join(' ');
    orderEnvelopeTitle.textContent = `Envelope Scan #${scanId}${subjectLine ? ` / ${subjectLine}` : ''}`;
    renderOrderEnvelopePreview(orderEnvelopePreview, preview);
  } catch (error) {
    orderEnvelopePreview.innerHTML = `<div class="empty-state">${escapeHtml(error.message || 'Could not load envelope.')}</div>`;
    console.error(error);
  }
}

async function assignViewedEnvelopeScan() {
  const scanId = jobsState.viewingEnvelopeScanId;
  const subject = jobsState.envelopeSubject;
  if (!scanId) {
    return;
  }
  if (!subject) {
    alert('Load a student reference before assigning this envelope.');
    envelopeEntryForm.elements.barcode.focus();
    return;
  }

  assignEnvelopeScanButton.disabled = true;
  deleteEnvelopeScanButton.disabled = true;
  orderEnvelopePreview.insertAdjacentHTML('afterbegin', '<div class="empty-state">Assigning envelope...</div>');

  try {
    const result = await trecsApi('assignEnvelopeScan').assignEnvelopeScan(scanId, subject.id);
    jobsState.envelopeScan = result.scan;
    renderEnvelopePreview();
    await loadUnlinkedEnvelopeScans();
    const preview = await trecsApi('getEnvelopeScanPreview').getEnvelopeScanPreview(scanId);
    const subjectLine = [preview.ref, preview.subjectName].filter(Boolean).join(' ');
    orderEnvelopeTitle.textContent = `Envelope Scan #${scanId}${subjectLine ? ` / ${subjectLine}` : ''}`;
    renderOrderEnvelopePreview(orderEnvelopePreview, preview);
    orderEnvelopeActions.hidden = true;
    envelopeEntryForm.elements.orderCodes.focus();
  } catch (error) {
    orderEnvelopePreview.innerHTML = `<div class="empty-state">${escapeHtml(error.message || 'Could not assign envelope.')}</div>`;
    console.error(error);
  } finally {
    assignEnvelopeScanButton.disabled = false;
    deleteEnvelopeScanButton.disabled = false;
  }
}

async function deleteViewedEnvelopeScan() {
  const scanId = jobsState.viewingEnvelopeScanId;
  if (!scanId) {
    return;
  }
  if (!confirm('Delete this unlinked envelope scan and its image file?')) {
    return;
  }

  assignEnvelopeScanButton.disabled = true;
  deleteEnvelopeScanButton.disabled = true;
  try {
    await trecsApi('deleteEnvelopeScan').deleteEnvelopeScan(scanId);
    if (jobsState.envelopeScan && Number(jobsState.envelopeScan.id) === Number(scanId)) {
      jobsState.envelopeScan = null;
      renderEnvelopePreview();
    }
    closeOrderEnvelope();
    await loadUnlinkedEnvelopeScans();
  } catch (error) {
    alert(error.message || 'Could not delete envelope.');
    console.error(error);
  } finally {
    assignEnvelopeScanButton.disabled = false;
    deleteEnvelopeScanButton.disabled = false;
  }
}

function renderEnvelopeSubject() {
  const subject = jobsState.envelopeSubject;
  if (!subject) {
    envelopeSubjectDetail.innerHTML = '<div class="empty-state">Scan a camera card barcode.</div>';
    return;
  }

  const existingOrders = rowsFor(jobsState.detail.subjectOrders || [], 'subjectId', subject.id);
  envelopeSubjectDetail.innerHTML = `
    <div class="workspace-student-header">
      <div>
        <span>Ref # ${subject.ref || ''}</span>
        <h2>${subject.name || 'Unnamed student'}</h2>
      </div>
      <span class="status ${subject.imageAssetId ? 'ready' : 'review'}">${subject.imageAssetId ? 'Photo linked' : 'No photo'}</span>
    </div>
    <div class="envelope-subject-photo" id="envelopeSubjectPhoto">
      <div class="empty-state">Loading photo...</div>
    </div>
    <dl class="workspace-fields envelope-fields">
      <div><dt>Student ID</dt><dd>${subject.externalId || ''}</dd></div>
      <div><dt>Grade</dt><dd>${subject.grade || ''}</dd></div>
      <div><dt>Homeroom</dt><dd>${subject.homeroom || ''}</dd></div>
      <div><dt>Orders</dt><dd>${formatNumber(existingOrders.length)}</dd></div>
    </dl>
    ${renderMiniSection(
      'Existing Orders',
      existingOrders.map((order) => `
        <div>
          <span>#${order.id} ${order.source} / ${order.paidStatus}</span>
          <strong>${order.packageCodes || 'No codes'} (${order.itemCount} items)</strong>
        </div>
      `),
      'No existing orders.'
    )}
  `;
  loadEnvelopeSubjectPhoto(subject.imageAssetId);
}

function renderEnvelopePreview() {
  const scan = jobsState.envelopeScan;
  if (!scan) {
    envelopePreviewMeta.textContent = '';
    envelopePreview.innerHTML = '<div class="empty-state">No envelope scan imported.</div>';
    return;
  }

  envelopePreviewMeta.textContent = scan.filename || '';
  if (!scan.dataUrl) {
    envelopePreview.innerHTML = '<div class="empty-state">Preview unavailable.</div>';
    return;
  }

  envelopePreview.innerHTML = `<img src="${scan.dataUrl}" alt="${escapeHtml(scan.filename || 'Envelope scan')}">`;
}

async function lookupEnvelopeSubject() {
  const barcode = envelopeEntryForm.elements.barcode.value.trim();
  if (!barcode || !jobsState.selectedJobId) {
    return;
  }

  envelopeEntryStatus.textContent = '';
  try {
    const result = await trecsApi('findSubjectByBarcode').findSubjectByBarcode(jobsState.selectedJobId, barcode);
    await setEnvelopeSubject(result.subject, true);
  } catch (error) {
    jobsState.envelopeSubject = null;
    jobsState.envelopeWatcherSubjectId = null;
    await stopEnvelopeWatcher();
    envelopeEntryStatus.textContent = error.message || 'Student not found';
    renderEnvelopeSubject();
    console.error(error);
  }
}

async function setEnvelopeSubject(subject, focusOrderCodes = false) {
  if (!subject) {
    return;
  }

  const previousSubjectId = jobsState.envelopeSubject ? jobsState.envelopeSubject.id : null;
  jobsState.envelopeSubject = subject;
  jobsState.selectedSubjectId = subject.id;
  envelopeEntryForm.elements.barcode.value = subject.ref || subject.externalId || '';
  if (previousSubjectId !== subject.id) {
    jobsState.envelopeScan = null;
    jobsState.envelopePending = null;
    envelopeConfirmModal.hidden = true;
    renderEnvelopePreview();
  }
  envelopeEntryStatus.textContent = '';
  renderEnvelopeSubject();
  await startEnvelopeWatcherForCurrentSubject();
  if (focusOrderCodes) {
    envelopeEntryForm.elements.orderCodes.focus();
  }
}

function hideEnvelopeStudentSearch() {
  jobsState.envelopeSearchResults = [];
  jobsState.envelopeSearchActiveIndex = -1;
  envelopeStudentSearchResults.hidden = true;
  envelopeStudentSearchResults.innerHTML = '';
}

function renderEnvelopeStudentSearchResults() {
  const results = jobsState.envelopeSearchResults || [];
  if (!results.length) {
    envelopeStudentSearchResults.hidden = true;
    envelopeStudentSearchResults.innerHTML = '';
    return;
  }

  envelopeStudentSearchResults.innerHTML = results.map((subject, index) => `
    <button class="${index === jobsState.envelopeSearchActiveIndex ? 'active' : ''}" data-envelope-student-index="${index}" type="button">
      <strong>${escapeHtml(subject.name || 'Unnamed student')}</strong>
      <span>${escapeHtml([subject.ref ? `Ref ${subject.ref}` : '', subject.grade ? `Grade ${subject.grade}` : '', subject.homeroom ? `HR ${subject.homeroom}` : ''].filter(Boolean).join(' / '))}</span>
    </button>
  `).join('');
  envelopeStudentSearchResults.hidden = false;

  envelopeStudentSearchResults.querySelectorAll('[data-envelope-student-index]').forEach((button) => {
    button.addEventListener('mousedown', (event) => {
      event.preventDefault();
    });
    button.addEventListener('click', () => {
      selectEnvelopeSearchResult(Number(button.dataset.envelopeStudentIndex));
    });
  });
}

async function searchEnvelopeStudents() {
  const input = envelopeEntryForm.elements.studentSearch;
  const search = input.value.trim();
  if (!jobsState.selectedJobId || search.length < 2) {
    hideEnvelopeStudentSearch();
    return;
  }

  try {
    const results = await trecsApi('searchEnvelopeSubjects').searchEnvelopeSubjects(jobsState.selectedJobId, search);
    if (input.value.trim() !== search) {
      return;
    }
    jobsState.envelopeSearchResults = results;
    jobsState.envelopeSearchActiveIndex = results.length ? 0 : -1;
    renderEnvelopeStudentSearchResults();
  } catch (error) {
    envelopeStudentSearchResults.hidden = false;
    envelopeStudentSearchResults.innerHTML = `<div class="empty-state">${escapeHtml(error.message || 'Student search failed')}</div>`;
    console.error(error);
  }
}

async function selectEnvelopeSearchResult(index) {
  const subject = jobsState.envelopeSearchResults[index];
  if (!subject) {
    return;
  }

  envelopeEntryForm.elements.studentSearch.value = subject.name || '';
  hideEnvelopeStudentSearch();
  await setEnvelopeSubject(subject, true);
}

async function startEnvelopeWatcherForCurrentSubject() {
  const hotFolder = 'EnvelopeHotFolder';
  if (!jobsState.envelopeSubject) {
    return;
  }

  const result = await trecsApi('startEnvelopeWatcher').startEnvelopeWatcher(
    jobsState.selectedJobId,
    jobsState.envelopeSubject.id,
    hotFolder
  );
  jobsState.envelopeWatcherSubjectId = jobsState.envelopeSubject.id;
  return result;
}

async function stopEnvelopeWatcher() {
  if (!window.trecs || typeof window.trecs.stopEnvelopeWatcher !== 'function') {
    return;
  }
  jobsState.envelopeWatcherSubjectId = null;
  await trecsApi('stopEnvelopeWatcher').stopEnvelopeWatcher();
}

function handleEnvelopeScanImported(payload) {
  if (!payload) {
    return;
  }
  if (payload.pending) {
    showEnvelopeConfirm(payload.pending);
    return;
  }
  if (payload.error) {
    envelopeEntryStatus.textContent = payload.error;
    return;
  }
  if (!payload.scan) {
    return;
  }
  if (!jobsState.envelopeSubject || payload.scan.subjectId !== jobsState.envelopeSubject.id) {
    return;
  }
  jobsState.envelopeScan = payload.scan;
  envelopeEntryStatus.textContent = '';
  renderEnvelopePreview();
  loadUnlinkedEnvelopeScans();
  envelopeEntryForm.elements.orderCodes.focus();
}

function showEnvelopeConfirm(pending) {
  if (!jobsState.envelopeSubject || pending.subjectId !== jobsState.envelopeSubject.id) {
    return;
  }

  jobsState.envelopePending = pending;
  envelopeConfirmMessage.textContent = `Another envelope was scanned. Attach ${pending.filename} to ref ${jobsState.envelopeSubject.ref || ''}?`;
  envelopeConfirmModal.hidden = false;
  confirmEnvelopeButton.focus();
}

async function respondEnvelopeConfirm(accept) {
  if (!jobsState.envelopePending) {
    envelopeConfirmModal.hidden = true;
    return;
  }

  confirmEnvelopeButton.disabled = true;
  cancelEnvelopeConfirmButton.disabled = true;
  try {
    const result = await trecsApi('confirmEnvelopeScan').confirmEnvelopeScan(accept);
    envelopeConfirmModal.hidden = true;
    jobsState.envelopePending = null;
    if (accept && result.scan) {
      handleEnvelopeScanImported({ scan: result.scan });
    } else {
      envelopeEntryForm.elements.barcode.focus();
      envelopeEntryForm.elements.barcode.select();
    }
  } catch (error) {
    envelopeConfirmMessage.textContent = error.message || 'Could not confirm envelope';
    console.error(error);
  } finally {
    confirmEnvelopeButton.disabled = false;
    cancelEnvelopeConfirmButton.disabled = false;
  }
}

async function submitEnvelopeOrder(event) {
  event.preventDefault();
  if (!jobsState.selectedJobId) {
    return;
  }
  if (!jobsState.envelopeSubject) {
    await lookupEnvelopeSubject();
  }
  if (!jobsState.envelopeSubject) {
    return;
  }

  const orderInput = envelopeEntryForm.elements.orderCodes;
  orderInput.disabled = true;
  envelopeEntryStatus.textContent = '';

  try {
    const result = await trecsApi('createEnvelopeOrder').createEnvelopeOrder(
      jobsState.selectedJobId,
      jobsState.envelopeSubject.id,
      {
        envelopeScanId: jobsState.envelopeScan ? jobsState.envelopeScan.id : null,
        orderCodes: envelopeEntryForm.elements.orderCodes.value,
        paidStatus: envelopeEntryForm.elements.paidStatus.value,
        notes: envelopeEntryForm.elements.notes.value
      }
    );
    envelopeEntryStatus.textContent = `Created order #${result.orderId}`;
    jobsState.selectedOrderId = result.orderId;
    envelopeEntryForm.elements.orderCodes.value = '';
    envelopeEntryForm.elements.notes.value = '';
    await reloadCurrentJobDetail();
    jobsState.envelopeSubject = jobsState.detail.subjects.find((subject) => subject.id === result.subjectId) || jobsState.envelopeSubject;
    renderEnvelopeSubject();
    renderEnvelopePreview();
    envelopeEntryForm.elements.barcode.focus();
    envelopeEntryForm.elements.barcode.select();
  } catch (error) {
    envelopeEntryStatus.textContent = error.message || 'Order failed';
    console.error(error);
  } finally {
    orderInput.disabled = false;
  }
}

const MAIN_PICTURE_DAY_ADMIN_ITEMS = [
  {
    type: 'delivery_envelope_cover',
    label: 'Delivery Envelope Cover',
    group: 'Forms',
    detail: 'Creates the first delivery envelope cover using the fall delivery form template.'
  },
  {
    type: 'school_directory',
    label: 'School Directory',
    group: 'Reports',
    detail: 'Creates the first-pass school directory from photographed students.'
  },
  {
    type: 'missing_photo_report',
    label: 'Missing Photo Report',
    group: 'Reports',
    detail: 'Lists students and staff who still need a usable photo before makeup day.'
  },
  {
    type: 'id_cards',
    label: 'Student & Staff IDs',
    group: 'Cards',
    detail: 'Prepares the original picture-day ID card batch.'
  },
  {
    type: 'sis_student_cd',
    label: 'Student CD',
    group: 'Administrative CDs',
    detail: 'Exports student photo/data files for the standard student CD.'
  },
  {
    type: 'sis_sasi',
    label: 'SASI',
    group: 'Administrative CDs',
    detail: 'Exports the SASI admin data set.'
  },
  {
    type: 'sis_destiny',
    label: 'Destiny',
    group: 'Administrative CDs',
    detail: 'Exports the library/Destiny image and data set.'
  },
  {
    type: 'sis_powerschool',
    label: 'PowerSchool',
    group: 'Administrative CDs',
    detail: 'Exports the PowerSchool admin data set.'
  },
  {
    type: 'staff_large',
    label: 'Staff Large',
    group: 'Staff Exports',
    detail: 'Exports staff images from CroppedLarge.'
  },
  {
    type: 'staff_med',
    label: 'Staff Med',
    group: 'Staff Exports',
    detail: 'Exports staff images from CroppedMed.'
  }
];

const MAKEUP_DAY_ADMIN_ITEMS = [
  ...MAIN_PICTURE_DAY_ADMIN_ITEMS,
  {
    type: 'sticker_prints',
    label: 'Sticker Prints',
    group: 'Makeup Day',
    detail: 'Prepares makeup-day sticker prints.'
  },
  {
    type: 'staff_picture_packages',
    label: 'Staff Picture Packages',
    group: 'Makeup Day',
    detail: 'Prepares staff package units.'
  },
  {
    type: 'yearbook_small',
    label: 'Yearbook Small',
    group: 'Yearbook',
    detail: 'Exports the small yearbook CD set.'
  },
  {
    type: 'yearbook_large',
    label: 'Yearbook Large',
    group: 'Yearbook',
    detail: 'Exports the large yearbook CD set.'
  }
];

function adminItemDefinitionsForUi(stage = 'original_picture_day') {
  return stage === 'makeup_day' ? MAKEUP_DAY_ADMIN_ITEMS : MAIN_PICTURE_DAY_ADMIN_ITEMS;
}

function adminItemLabel(type) {
  const item = [...MAIN_PICTURE_DAY_ADMIN_ITEMS, ...MAKEUP_DAY_ADMIN_ITEMS].find((candidate) => candidate.type === type);
  return item ? item.label : formatType(type);
}

function shootStageLabel(stage) {
  return stage === 'makeup_day' ? 'Makeup Day' : 'Original Picture Day';
}

function currentJobSummary() {
  return jobsState.detail && jobsState.detail.summary
    ? jobsState.detail.summary
    : jobsState.jobs.find((job) => Number(job.id) === Number(jobsState.selectedJobId));
}

function schoolYearFromJobName(job) {
  const name = String(job && (job.job || job.name) || '');
  const fallMatch = name.match(/\bFALL[_\s-]*(20\d{2})\b/i);
  const yearMatch = fallMatch || name.match(/\b(20\d{2})\b/);
  if (!yearMatch) {
    return '2025-2026';
  }
  const startYear = Number(yearMatch[1]);
  if (!Number.isFinite(startYear)) {
    return '2025-2026';
  }
  return `${startYear}-${startYear + 1}`;
}

function resetAdminSchoolYearForCurrentJob(force = false) {
  const defaultYear = schoolYearFromJobName(currentJobSummary());
  if (force || !jobsState.directorySchoolYear) {
    jobsState.directorySchoolYear = defaultYear;
  }
}

function directorySchoolYearLabel(value) {
  const text = String(value || '').trim();
  if (!text) {
    return 'School Year: 2025 - 2026';
  }
  if (/^school year:/i.test(text)) {
    return text;
  }
  const match = text.match(/^(20\d{2})\s*[-/]\s*(20\d{2})$/);
  if (match) {
    return `School Year: ${match[1]} - ${match[2]}`;
  }
  return `School Year: ${text}`;
}

function adminItemHelp(type, stage) {
  const helps = {
    delivery_envelope_cover: 'Creates the delivery envelope cover summary for this stage.',
    school_directory: 'Exports a school directory using the selected sort/group option.',
    missing_photo_report: 'Lists students who still have no usable linked photo.',
    sis_export: 'Exports student data and linked image filenames for SIS import.',
    id_cards: stage === 'makeup_day'
      ? 'Creates the makeup-day ID card work list.'
      : 'Creates the original picture-day ID card work list.',
    sticker_prints: 'Creates the makeup-day sticker print work list.',
    staff_picture_packages: 'Creates the staff package work list.'
  };
  return helps[type] || '';
}

function ensureAdminOutputControls() {
  if (!adminOptionsForm) {
    return;
  }

  if (!adminOptionsForm.elements.outputFolder) {
    adminOptionsForm.insertAdjacentHTML('beforeend', `
      <label class="admin-output-field">
        <span>Output Folder</span>
        <div class="folder-picker">
          <input name="outputFolder" readonly placeholder="Choose where admin items will be created">
          <button id="browseAdminOutputFolderButton" type="button">Browse</button>
        </div>
      </label>
    `);
  }

  if (adminItemsList && !document.getElementById('adminItemsProgress')) {
    adminItemsList.insertAdjacentHTML('afterend', `
      <div class="admin-run-footer">
        <div class="admin-progress-wrap">
          <progress id="adminItemsProgress" value="0" max="100"></progress>
          <span id="adminItemsProgressText">Ready</span>
        </div>
        <button class="primary" id="runAdminItemsButton" type="button">Run Selected Items</button>
      </div>
    `);
  }
}

function adminOutputFolderInput() {
  ensureAdminOutputControls();
  return adminOptionsForm && adminOptionsForm.elements ? adminOptionsForm.elements.outputFolder : null;
}

function adminOutputOptions() {
  const outputInput = adminOutputFolderInput();
  return {
    stage: adminOptionsForm.elements.stage.value,
    sortBy: adminOptionsForm.elements.sortBy ? adminOptionsForm.elements.sortBy.value : jobsState.adminSortBy,
    schoolYear: adminOptionsForm.elements.schoolYear ? adminOptionsForm.elements.schoolYear.value : jobsState.directorySchoolYear,
    outputFolder: outputInput ? outputInput.value : ''
  };
}

function applyAdminOptions(options) {
  jobsState.adminStage = options.stage;
  jobsState.adminSortBy = options.sortBy;
  jobsState.directorySchoolYear = options.schoolYear || jobsState.directorySchoolYear;
  jobsState.adminOutputFolder = options.outputFolder || '';
}

function renderDirectoryOptions(listNames) {
  const listOptions = listNames.length
    ? listNames.map((name) => `
      <option value="${escapeHtml(name)}" ${name === jobsState.directoryListName ? 'selected' : ''}>
        ${escapeHtml(name)}
      </option>
    `).join('')
    : '<option value="">No saved lists</option>';

  return `
    <section class="directory-options">
      <label>
        <span>Directory Type</span>
        <select data-directory-option="directoryType">
          <option value="mugbook" ${jobsState.directoryType === 'mugbook' ? 'selected' : ''}>Mugbook</option>
          <option value="library_book" ${jobsState.directoryType === 'library_book' ? 'selected' : ''}>Library Book</option>
        </select>
      </label>
      <label>
        <span>Students</span>
        <select data-directory-option="directorySource">
          <option value="all" ${jobsState.directorySource === 'all' ? 'selected' : ''}>All Students</option>
          <option value="list" ${jobsState.directorySource === 'list' ? 'selected' : ''}>Saved List</option>
        </select>
      </label>
      <label>
        <span>Saved List</span>
        <select data-directory-option="directoryListName" ${jobsState.directorySource !== 'list' || !listNames.length ? 'disabled' : ''}>
          ${listOptions}
        </select>
      </label>
      <label>
        <span>Sort Method</span>
        <select data-directory-option="directorySortMethod">
          <option value="alpha_grade" ${jobsState.directorySortMethod === 'alpha_grade' ? 'selected' : ''}>Alpha by Grade</option>
          <option value="alpha_homeroom" ${jobsState.directorySortMethod === 'alpha_homeroom' ? 'selected' : ''}>Alpha by Homeroom</option>
          <option value="alpha_school" ${jobsState.directorySortMethod === 'alpha_school' ? 'selected' : ''}>Alpha by School</option>
        </select>
      </label>
      <label class="directory-contact-field">
        <span>Contact Line</span>
        <input data-directory-option="directoryContactLine" value="${escapeHtml(jobsState.directoryContactLine)}">
      </label>
      <label class="checkbox-label">
        <input data-directory-option="directoryPhotographedOnly" type="checkbox" ${jobsState.directoryPhotographedOnly ? 'checked' : ''}>
        <span>Photographed Only</span>
      </label>
    </section>
  `;
}

function bindDirectoryOptions() {
  adminItemsList.querySelectorAll('[data-directory-option]').forEach((control) => {
    control.addEventListener('change', () => {
      const key = control.dataset.directoryOption;
      jobsState[key] = control.type === 'checkbox' ? control.checked : control.value;
      if (key === 'directorySource' && jobsState.directorySource !== 'list') {
        jobsState.directoryListName = '';
      }
      renderAdminItemsWorkspace();
    });
  });
}

function renderStickerOptions(listNames) {
  const listOptions = listNames.length
    ? listNames.map((name) => `
      <option value="${escapeHtml(name)}" ${name === jobsState.stickerListName ? 'selected' : ''}>
        ${escapeHtml(name)}
      </option>
    `).join('')
    : '<option value="">No saved lists</option>';

  return `
    <section class="sticker-options">
      <label>
        <span>Students</span>
        <select data-sticker-option="stickerSource">
          <option value="all" ${jobsState.stickerSource === 'all' ? 'selected' : ''}>All Students</option>
          <option value="list" ${jobsState.stickerSource === 'list' ? 'selected' : ''}>Saved List</option>
        </select>
      </label>
      <label>
        <span>Saved List</span>
        <select data-sticker-option="stickerListName" ${jobsState.stickerSource !== 'list' || !listNames.length ? 'disabled' : ''}>
          ${listOptions}
        </select>
      </label>
      <label>
        <span>Stickers Per Student</span>
        <input data-sticker-option="stickerCopies" type="number" min="1" max="50" value="${escapeHtml(jobsState.stickerCopies)}">
      </label>
      <label>
        <span>Sort</span>
        <select data-sticker-option="stickerSortMethod">
          <option value="alpha" ${jobsState.stickerSortMethod === 'alpha' ? 'selected' : ''}>Alpha</option>
          <option value="alpha_grade" ${jobsState.stickerSortMethod === 'alpha_grade' ? 'selected' : ''}>Alpha by Grade</option>
          <option value="alpha_teacher" ${jobsState.stickerSortMethod === 'alpha_teacher' ? 'selected' : ''}>Alpha by Teacher</option>
        </select>
      </label>
      <label class="checkbox-label">
        <input data-sticker-option="stickerPhotographedOnly" type="checkbox" ${jobsState.stickerPhotographedOnly ? 'checked' : ''}>
        <span>Photographed Only</span>
      </label>
    </section>
  `;
}

function bindStickerOptions() {
  adminItemsList.querySelectorAll('[data-sticker-option]').forEach((control) => {
    control.addEventListener('change', () => {
      const key = control.dataset.stickerOption;
      if (control.type === 'checkbox') {
        jobsState[key] = control.checked;
      } else if (control.type === 'number') {
        jobsState[key] = Number(control.value);
      } else {
        jobsState[key] = control.value;
      }
      if (key === 'stickerSource' && jobsState.stickerSource !== 'list') {
        jobsState.stickerListName = '';
      }
      renderAdminItemsWorkspace();
    });
  });
}

function renderSisOptions() {
  return `
    <section class="sis-options">
      <label class="checkbox-label">
        <input data-sis-option="sisStudentCd" type="checkbox" ${jobsState.sisStudentCd ? 'checked' : ''}>
        <span>Student CD</span>
      </label>
      <label class="checkbox-label">
        <input data-sis-option="sisDestiny" type="checkbox" ${jobsState.sisDestiny ? 'checked' : ''}>
        <span>Destiny</span>
      </label>
      <label class="checkbox-label">
        <input data-sis-option="sisPowerSchool" type="checkbox" ${jobsState.sisPowerSchool ? 'checked' : ''}>
        <span>PowerSchool</span>
      </label>
      <label class="checkbox-label">
        <input data-sis-option="sisSasi" type="checkbox" ${jobsState.sisSasi ? 'checked' : ''}>
        <span>SASI</span>
      </label>
    </section>
  `;
}

function bindSisOptions() {
  adminItemsList.querySelectorAll('[data-sis-option]').forEach((control) => {
    control.addEventListener('change', () => {
      jobsState[control.dataset.sisOption] = control.checked;
      if (!selectedSisFormats(false).length) {
        jobsState[control.dataset.sisOption] = true;
      }
      renderAdminItemsWorkspace();
    });
  });
}

function renderIdCardOptions(listNames) {
  const listOptions = listNames.length
    ? listNames.map((name) => `
      <option value="${escapeHtml(name)}" ${name === jobsState.idCardListName ? 'selected' : ''}>
        ${escapeHtml(name)}
      </option>
    `).join('')
    : '<option value="">No saved lists</option>';

  return `
    <section class="id-card-options">
      <label>
        <span>Students</span>
        <select data-id-card-option="idCardSource">
          <option value="all" ${jobsState.idCardSource === 'all' ? 'selected' : ''}>All Students</option>
          <option value="list" ${jobsState.idCardSource === 'list' ? 'selected' : ''}>Saved List</option>
        </select>
      </label>
      <label>
        <span>Saved List</span>
        <select data-id-card-option="idCardListName" ${jobsState.idCardSource !== 'list' || !listNames.length ? 'disabled' : ''}>
          ${listOptions}
        </select>
      </label>
      <label>
        <span>Reason</span>
        <select data-id-card-option="idCardReason">
          <option value="admin_batch" ${jobsState.idCardReason === 'admin_batch' ? 'selected' : ''}>Admin Batch</option>
          <option value="makeup_day" ${jobsState.idCardReason === 'makeup_day' ? 'selected' : ''}>Makeup Day</option>
          <option value="replacement_request" ${jobsState.idCardReason === 'replacement_request' ? 'selected' : ''}>Replacement Request</option>
          <option value="school_request" ${jobsState.idCardReason === 'school_request' ? 'selected' : ''}>School Request</option>
        </select>
      </label>
      <label>
        <span>Sort</span>
        <select data-id-card-option="idCardSortMethod">
          <option value="alpha_grade" ${jobsState.idCardSortMethod === 'alpha_grade' ? 'selected' : ''}>Alpha by Grade</option>
          <option value="alpha_homeroom" ${jobsState.idCardSortMethod === 'alpha_homeroom' ? 'selected' : ''}>Alpha by Homeroom</option>
          <option value="alpha_school" ${jobsState.idCardSortMethod === 'alpha_school' ? 'selected' : ''}>Alpha by School</option>
        </select>
      </label>
      <label class="checkbox-label">
        <input data-id-card-option="idCardPhotographedOnly" type="checkbox" ${jobsState.idCardPhotographedOnly ? 'checked' : ''}>
        <span>Photographed Only</span>
      </label>
    </section>
  `;
}

function bindIdCardOptions() {
  adminItemsList.querySelectorAll('[data-id-card-option]').forEach((control) => {
    control.addEventListener('change', () => {
      const key = control.dataset.idCardOption;
      jobsState[key] = control.type === 'checkbox' ? control.checked : control.value;
      if (key === 'idCardSource' && jobsState.idCardSource !== 'list') {
        jobsState.idCardListName = '';
      }
      renderAdminItemsWorkspace();
    });
  });
}

function renderCameraCardOptions(listNames, filterOptions = {}) {
  const source = jobsState.cameraCardSource || 'all';
  const valuesBySource = {
    grade: filterOptions.grades || [],
    homeroom: filterOptions.homerooms || [],
    track: filterOptions.tracks || [],
    list: listNames || []
  };
  const sourceValues = valuesBySource[source] || [];
  const valueControlEnabled = source !== 'all' && sourceValues.length > 0;
  let selectedValue = source === 'list'
    ? (jobsState.cameraCardListName || jobsState.cameraCardSourceValue)
    : jobsState.cameraCardSourceValue;
  if (source !== 'all' && !selectedValue && sourceValues.length) {
    selectedValue = sourceValues[0];
    if (source === 'list') {
      jobsState.cameraCardListName = selectedValue;
    }
    jobsState.cameraCardSourceValue = selectedValue;
  }

  return `
    <section class="id-card-options">
      <label>
        <span>Students</span>
        <select data-camera-card-option="cameraCardSource">
          <option value="all" ${source === 'all' ? 'selected' : ''}>Entire School</option>
          <option value="grade" ${source === 'grade' ? 'selected' : ''}>Grade</option>
          <option value="homeroom" ${source === 'homeroom' ? 'selected' : ''}>Homeroom</option>
          <option value="track" ${source === 'track' ? 'selected' : ''}>Track</option>
          <option value="list" ${source === 'list' ? 'selected' : ''}>Saved List</option>
        </select>
      </label>
      <label>
        <span>${source === 'list' ? 'Saved List' : 'Filter'}</span>
        <select data-camera-card-option="${source === 'list' ? 'cameraCardListName' : 'cameraCardSourceValue'}" ${valueControlEnabled ? '' : 'disabled'}>
          ${sourceValues.length
            ? sourceValues.map((value) => `
              <option value="${escapeHtml(value)}" ${value === selectedValue ? 'selected' : ''}>
                ${escapeHtml(value)}
              </option>
            `).join('')
            : '<option value="">No values</option>'}
        </select>
      </label>
      <label>
        <span>Sort</span>
        <select data-camera-card-option="cameraCardSortMethod">
          <option value="alpha_homeroom" ${jobsState.cameraCardSortMethod === 'alpha_homeroom' ? 'selected' : ''}>Alpha by Homeroom</option>
          <option value="alpha_track" ${jobsState.cameraCardSortMethod === 'alpha_track' ? 'selected' : ''}>Alpha by Track</option>
          <option value="alpha_grade" ${jobsState.cameraCardSortMethod === 'alpha_grade' ? 'selected' : ''}>Alpha by Grade</option>
          <option value="alpha_school" ${jobsState.cameraCardSortMethod === 'alpha_school' ? 'selected' : ''}>Alpha by School</option>
          <option value="ref" ${jobsState.cameraCardSortMethod === 'ref' ? 'selected' : ''}>Reference Number</option>
        </select>
      </label>
    </section>
  `;
}

function bindCameraCardOptions() {
  adminItemsList.querySelectorAll('[data-camera-card-option]').forEach((control) => {
    control.addEventListener('change', () => {
      const key = control.dataset.cameraCardOption;
      jobsState[key] = control.value;
      if (key === 'cameraCardSource') {
        jobsState.cameraCardSourceValue = '';
        jobsState.cameraCardListName = '';
      }
      if (key === 'cameraCardListName') {
        jobsState.cameraCardSourceValue = control.value;
      }
      renderAdminItemsWorkspace();
    });
  });
}

function pictureDaySortLabel(value) {
  return {
    alpha_homeroom: 'Alpha by Homeroom',
    alpha_track: 'Alpha by Track',
    alpha_grade: 'Alpha by Grade',
    alpha_school: 'Alpha by School',
    ref: 'Reference Number'
  }[value] || formatType(value || 'alpha_grade');
}

function renderPictureDayPrepWorkspace() {
  if (!pictureDayWorkspace || jobsState.workspaceMode !== 'pictureDay') {
    return;
  }
  if (!jobsState.pictureDayPrep || jobsState.pictureDayPrep.job.id !== jobsState.selectedJobId) {
    loadPictureDayPrep();
    pictureDayPrepContent.innerHTML = '<div class="empty-state">Loading picture day prep...</div>';
    pictureDayEodHistory.innerHTML = '<div class="empty-state">Loading End of Day imports...</div>';
    return;
  }

  const prep = jobsState.pictureDayPrep;
  const counts = prep.counts || {};
  const cameraCardRuns = (prep.prepHistory || []).filter((item) => item.adminItemType === 'camera_cards');
  const onsiteRuns = (prep.prepHistory || []).filter((item) => item.adminItemType === 'onsite_setup');
  pictureDayPrepStatus.textContent = jobsState.pictureDayPrepLoading ? 'Refreshing...' : 'Ready';
  pictureDayPrepContent.innerHTML = `
    <section class="picture-day-metrics">
      <article><span>Subjects</span><strong>${formatNumber(counts.subjects || 0)}</strong></article>
      <article><span>Photographed</span><strong>${formatNumber(counts.photographed || 0)}</strong></article>
      <article><span>Blank Records</span><strong>${formatNumber(counts.blankRecords || 0)}</strong></article>
    </section>
    <section class="picture-day-actions">
      <button class="primary" data-picture-day-action="camera-cards" type="button">Create Camera Cards</button>
      <button data-picture-day-action="onsite" type="button">Make Onsite Setup</button>
      <button data-picture-day-action="load-onsite" type="button">Load Onsite Setup</button>
      <button data-picture-day-action="load-eod" type="button">Load End of Day</button>
    </section>
    <section class="picture-day-section">
      <h3>Camera Card Runs</h3>
      ${cameraCardRuns.length ? cameraCardRuns.map((run) => {
        let options = {};
        try {
          options = JSON.parse(run.optionsJson || '{}');
        } catch (_error) {
          options = {};
        }
        const source = options.cameraCardSource === 'list'
          ? `List: ${options.cameraCardListName || options.cameraCardSourceValue || ''}`
          : options.cameraCardSource === 'all'
            ? 'Entire School'
            : `${formatType(options.cameraCardSource)}: ${options.cameraCardSourceValue || ''}`;
        return `
          <article class="picture-day-history-row">
            <strong>${escapeHtml(source)}</strong>
            <span>${escapeHtml(pictureDaySortLabel(options.cameraCardSortMethod))} / ${options.cameraCardPdfOnly ? 'PDF' : 'JPG sheets'}</span>
            <em>${escapeHtml(formatShortDateTime(run.completedAt || run.createdAt))}</em>
            <code>${escapeHtml(run.outputPath || '')}</code>
          </article>
        `;
      }).join('') : '<div class="empty-state">No camera cards created yet.</div>'}
    </section>
    <section class="picture-day-section">
      <h3>Onsite Setup</h3>
      ${onsiteRuns.length ? onsiteRuns.map((run) => `
        <article class="picture-day-history-row">
          <strong>${escapeHtml(formatShortDateTime(run.completedAt || run.createdAt))}</strong>
          <span>${escapeHtml(run.status || 'complete')}</span>
          <code>${escapeHtml(run.outputPath || '')}</code>
        </article>
      `).join('') : '<div class="empty-state">No onsite setup history yet.</div>'}
    </section>
  `;

  pictureDayPrepContent.querySelectorAll('[data-picture-day-action]').forEach((button) => {
    button.addEventListener('click', async () => {
      const jobId = jobsState.selectedJobId;
      if (button.dataset.pictureDayAction === 'camera-cards') {
        await openCameraCardsModal(jobId);
      } else if (button.dataset.pictureDayAction === 'onsite') {
        await performPrepareOnsiteSetup(jobId);
        await loadPictureDayPrep(true);
      } else if (button.dataset.pictureDayAction === 'load-onsite') {
        await loadOnsiteSetup();
      } else if (button.dataset.pictureDayAction === 'load-eod') {
        await loadEndOfDayPackage();
      }
    });
  });

  const imports = prep.endOfDayImports || [];
  pictureDayEodHistory.innerHTML = imports.length ? imports.map((item) => `
    <article class="eod-history-card">
      <strong>${escapeHtml(item.packageName || 'End of Day')}</strong>
      <span>${escapeHtml(formatShortDateTime(item.importedAt))}</span>
      <dl>
        <div><dt>Photographer</dt><dd>${escapeHtml(item.photographerName || '')}</dd></div>
        <div><dt>Computer</dt><dd>${escapeHtml(item.workstationName || '')}</dd></div>
        <div><dt>Images</dt><dd>${formatNumber(item.capturedImages || 0)}</dd></div>
        <div><dt>New Cards</dt><dd>${formatNumber(item.newSubjects || 0)}</dd></div>
        <div><dt>Edits</dt><dd>${formatNumber(item.editedSubjects || 0)}</dd></div>
      </dl>
      <code>${escapeHtml(item.packageFolder || '')}</code>
    </article>
  `).join('') : '<div class="empty-state">No End of Day imports loaded.</div>';
}

async function loadPictureDayPrep(force = false) {
  if (!jobsState.selectedJobId || jobsState.pictureDayPrepLoading) {
    return;
  }
  if (!force && jobsState.pictureDayPrep && jobsState.pictureDayPrep.job.id === jobsState.selectedJobId) {
    renderPictureDayPrepWorkspace();
    return;
  }
  jobsState.pictureDayPrepLoading = true;
  if (pictureDayPrepStatus) {
    pictureDayPrepStatus.textContent = 'Loading...';
  }
  try {
    jobsState.pictureDayPrep = await trecsApi('getPictureDayPrep').getPictureDayPrep(jobsState.selectedJobId);
    renderPictureDayPrepWorkspace();
  } catch (error) {
    if (pictureDayPrepContent) {
      pictureDayPrepContent.innerHTML = `<div class="empty-state">${escapeHtml(error.message || 'Could not load picture day prep.')}</div>`;
    }
    console.error(error);
  } finally {
    jobsState.pictureDayPrepLoading = false;
    if (pictureDayPrepStatus) {
      pictureDayPrepStatus.textContent = 'Ready';
    }
  }
}

const ID_TEMPLATE_ELEMENT_DEFINITIONS = [
  { key: 'photo', label: 'Photo', kind: 'photo', x: 70, y: 86, w: 260, h: 325 },
  { key: 'name', label: 'Full Name', kind: 'text', field: 'fullName', x: 390, y: 155, w: 580, h: 70, size: 54, color: '#000000', font: 'Arial', align: 'left' },
  { key: 'first', label: 'First Name', kind: 'text', field: 'firstName', x: 390, y: 240, w: 420, h: 50, size: 38, color: '#000000', font: 'Arial', align: 'left' },
  { key: 'last', label: 'Last Name', kind: 'text', field: 'lastName', x: 390, y: 300, w: 420, h: 50, size: 38, color: '#000000', font: 'Arial', align: 'left' },
  { key: 'barcode', label: 'Barcode', kind: 'barcode', symbology: 'code128', x: 390, y: 545, w: 420, h: 70, size: 70 },
  { key: 'homeroom', label: 'Homeroom', kind: 'text', field: 'homeroom', x: 390, y: 370, w: 430, h: 45, size: 32, color: '#000000', font: 'Arial', align: 'left' },
  { key: 'studentId', label: 'Student ID', kind: 'text', field: 'studentId', x: 390, y: 425, w: 430, h: 45, size: 32, color: '#000000', font: 'Arial', align: 'left' },
  { key: 'extra1', label: 'Extra 1', kind: 'text', field: 'extra1', x: 390, y: 480, w: 430, h: 45, size: 32, color: '#000000', font: 'Arial', align: 'left' },
  { key: 'extra2', label: 'Extra 2', kind: 'text', field: 'extra2', x: 760, y: 480, w: 260, h: 45, size: 32, color: '#000000', font: 'Arial', align: 'left' },
  { key: 'year', label: 'School Year', kind: 'text', field: 'year', x: 830, y: 620, w: 230, h: 48, size: 34, color: '#000000', font: 'Myriad Pro', align: 'left' },
  { key: 'qr', label: 'QR Code', kind: 'qr', x: 930, y: 90, w: 120, h: 120 }
];

const ID_TEMPLATE_GRADE_BACKGROUNDS = {
  TK: 'TK.jpg',
  KIN: 'KIN.jpg',
  K: 'KIN.jpg',
  '1': '01.jpg',
  '01': '01.jpg',
  '2': '02.jpg',
  '02': '02.jpg',
  '3': '03.jpg',
  '03': '03.jpg',
  '4': '04.jpg',
  '04': '04.jpg',
  '5': '05.jpg',
  '05': '05.jpg',
  '6': '06.jpg',
  '06': '06.jpg',
  '7': '07.jpg',
  '07': '07.jpg',
  '8': '08.jpg',
  '08': '08.jpg',
  '9': '09.jpg',
  '09': '09.jpg',
  '10': '10.jpg',
  '11': '11.jpg',
  '12': '12.jpg',
  FAC: 'FAC.jpg',
  FACULTY: 'FAC.jpg',
  STAFF: 'FAC.jpg'
};

function createDefaultIdTemplate() {
  return {
    schema: 'trecs.id-card-template.v1',
    name: 'Student ID',
    templateType: 'student',
    card: {
      width: 1128,
      height: 702,
      orientation: 'horizontal'
    },
    background: '',
    backgroundRules: {
      mode: 'grade',
      gradeBackgrounds: ID_TEMPLATE_GRADE_BACKGROUNDS,
      allowSingleCardOverride: true
    },
    elements: Object.fromEntries(ID_TEMPLATE_ELEMENT_DEFINITIONS.map((definition) => [
      definition.key,
      {
        ...definition,
        enabled: true
      }
    ]))
  };
}

function normalizeIdTemplateForDesigner(template) {
  const nextTemplate = template || createDefaultIdTemplate();
  nextTemplate.elements = nextTemplate.elements || {};
  nextTemplate.card = nextTemplate.card || {};
  nextTemplate.templateType = nextTemplate.templateType === 'staff' ? 'staff' : 'student';
  nextTemplate.backgroundRules = {
    mode: 'grade',
    gradeBackgrounds: {
      ...ID_TEMPLATE_GRADE_BACKGROUNDS,
      ...((nextTemplate.backgroundRules && nextTemplate.backgroundRules.gradeBackgrounds) || {})
    },
    allowSingleCardOverride: true,
    ...(nextTemplate.backgroundRules || {})
  };
  const orientation = nextTemplate.card.orientation === 'vertical' ? 'vertical' : 'horizontal';
  const size = idTemplateCardSize({ card: { orientation } });
  nextTemplate.card = {
    ...nextTemplate.card,
    orientation,
    width: size.width,
    height: size.height
  };
  const defaultBarcode = ID_TEMPLATE_ELEMENT_DEFINITIONS.find((element) => element.key === 'barcode');
  const barcode = nextTemplate.elements.barcode || {};
  nextTemplate.elements.barcode = {
    ...defaultBarcode,
    ...barcode,
    kind: 'barcode',
    field: undefined,
    font: undefined,
    color: undefined,
    symbology: 'code128',
    size: Number(barcode.size || barcode.h || defaultBarcode.size)
  };
  Object.values(nextTemplate.elements).forEach((element) => {
    if (element && element.kind === 'text') {
      element.align = ['left', 'center', 'right'].includes(element.align) ? element.align : 'left';
    }
  });
  return nextTemplate;
}

function idTemplateCardSize(template) {
  const orientation = template && template.card && template.card.orientation === 'vertical' ? 'vertical' : 'horizontal';
  return orientation === 'vertical'
    ? { width: 702, height: 1128, orientation }
    : { width: 1128, height: 702, orientation };
}

function setIdTemplateOrientation(template, orientationValue) {
  const current = idTemplateCardSize(template);
  const next = idTemplateCardSize({ card: { orientation: orientationValue } });
  template.card = template.card || {};
  if (current.orientation !== next.orientation && template.elements) {
    const scaleX = next.width / current.width;
    const scaleY = next.height / current.height;
    Object.values(template.elements).forEach((element) => {
      element.x = Math.round(Number(element.x || 0) * scaleX);
      element.y = Math.round(Number(element.y || 0) * scaleY);
      element.w = Math.round(Number(element.w || 0) * scaleX);
      element.h = Math.round(Number(element.h || 0) * scaleY);
    });
  }
  template.card = {
    ...template.card,
    width: next.width,
    height: next.height,
    orientation: next.orientation
  };
  return template;
}

function idTemplateBackgroundDataUrl(backgroundName) {
  const match = (jobsState.idTemplateDesigner.backgrounds || [])
    .find((background) => background.fileName === backgroundName);
  return match ? match.dataUrl : '';
}

function renderIdTemplateDesigner() {
  const designer = jobsState.idTemplateDesigner;
  if (!designer.loaded) {
    loadIdTemplateDesigner().catch((error) => {
      idTemplateStatus.textContent = error.message || 'Could not load ID templates';
      console.error(error);
    });
    return;
  }
  const template = designer.template || createDefaultIdTemplate();
  designer.template = normalizeIdTemplateForDesigner(template);

  idTemplateFolderLabel.textContent = designer.folder ? designer.folder : '';
  idTemplateList.innerHTML = designer.templates.length
    ? designer.templates.map((item) => `
      <button class="${Number(item.id) === Number(designer.selectedTemplateId) ? 'active' : ''}" data-id-template-file="${escapeHtml(item.fileName)}" type="button">
        <strong>${escapeHtml(item.name)}</strong>
        <span>${escapeHtml(item.templateType === 'staff' ? 'Staff ID' : 'Student ID')}</span>
      </button>
    `).join('')
    : '<div class="empty-state">No saved templates yet.</div>';

  idTemplateForm.elements.templateName.value = template.name || '';
  idTemplateForm.elements.templateType.value = template.templateType === 'staff' ? 'staff' : 'student';
  idTemplateForm.elements.orientation.value = template.card && template.card.orientation === 'vertical' ? 'vertical' : 'horizontal';
  idTemplateForm.elements.background.innerHTML = [
    '<option value="">No background</option>',
    ...designer.backgrounds.map((background) => `
      <option value="${escapeHtml(background.fileName)}" ${template.background === background.fileName ? 'selected' : ''}>
        ${escapeHtml(background.fileName)}
      </option>
    `)
  ].join('');
  renderIdTemplateStage();
  renderIdTemplateProperties();
}

function renderIdTemplateStage() {
  const template = jobsState.idTemplateDesigner.template || createDefaultIdTemplate();
  const card = idTemplateCardSize(template);
  const background = idTemplateBackgroundDataUrl(template.background);
  idTemplateStage.style.backgroundImage = background ? `url("${background}")` : '';
  idTemplateStage.style.aspectRatio = `${card.width} / ${card.height}`;
  idTemplateStage.classList.toggle('vertical', card.orientation === 'vertical');
  const elements = template.elements || {};
  idTemplateStage.innerHTML = Object.entries(elements)
    .filter(([_key, element]) => element.enabled !== false)
    .map(([key, element]) => {
      const left = (Number(element.x || 0) / card.width) * 100;
      const top = (Number(element.y || 0) / card.height) * 100;
      const width = (Number(element.w || 120) / card.width) * 100;
      const height = (Number(element.h || 40) / card.height) * 100;
      const selected = key === jobsState.idTemplateDesigner.selectedElement;
      const text = element.kind === 'photo' ? 'Photo' : element.kind === 'qr' ? 'QR' : element.kind === 'barcode' ? '' : sampleIdTemplateText(element);
      const barcodeMarkup = element.kind === 'barcode' ? renderCode128PreviewBars() : '';
      const align = ['left', 'center', 'right'].includes(element.align) ? element.align : 'left';
      const justifyContent = align === 'right' ? 'flex-end' : align === 'center' ? 'center' : 'flex-start';
      return `
        <div class="id-template-element ${escapeHtml(element.kind || 'text')} ${selected ? 'selected' : ''}"
          data-id-template-element="${escapeHtml(key)}"
          style="left:${left}%;top:${top}%;width:${width}%;height:${height}%;font-size:${Math.max(10, Number(element.size || 28) / 2)}px;color:${escapeHtml(element.color || '#000000')};font-family:${escapeHtml(element.font || 'Arial')};text-align:${align};justify-content:${justifyContent};">
          ${barcodeMarkup || escapeHtml(text)}
        </div>
      `;
    }).join('');
}

function renderCode128PreviewBars() {
  const bars = [2, 1, 1, 2, 3, 1, 2, 2, 1, 1, 3, 2, 1, 2, 2, 3, 1, 1, 2, 1, 3, 2, 2, 1, 1, 3, 1, 2, 2, 2, 1, 1];
  return `
    <div class="id-template-barcode-preview" aria-label="CODE128 barcode preview">
      ${bars.map((width, index) => `<i style="width:${width * 2}px;${index % 2 ? 'background:transparent;' : ''}"></i>`).join('')}
    </div>
  `;
}

function sampleIdTemplateText(element) {
  const samples = {
    fullName: 'Alex Student',
    firstName: 'Alex',
    lastName: 'Student',
    homeroom: 'HR: Martinez',
    studentId: 'ID #: 123456',
    extra1: 'Grade 5',
    extra2: 'Track A',
    year: jobsState.directorySchoolYear || '2025-2026'
  };
  return samples[element.field] || element.label || 'Text';
}

function renderIdTemplateProperties() {
  const template = jobsState.idTemplateDesigner.template || createDefaultIdTemplate();
  const key = jobsState.idTemplateDesigner.selectedElement;
  const element = template.elements && template.elements[key];
  if (!element) {
    idTemplateProperties.innerHTML = '<div class="empty-state">Select an element to edit its position and style.</div>';
    return;
  }
  const isText = element.kind === 'text';
  const isBarcode = element.kind === 'barcode';
  idTemplateProperties.innerHTML = `
    <h3>${escapeHtml(element.label || key)}</h3>
    <label class="checkbox-label">
      <input data-id-template-property="enabled" type="checkbox" ${element.enabled !== false ? 'checked' : ''}>
      <span>Show element</span>
    </label>
    <div class="id-template-property-grid">
      ${['x', 'y', 'w', 'h'].map((property) => `
        <label>
          <span>${property.toUpperCase()}</span>
          <input data-id-template-property="${property}" type="number" value="${Number(element[property] || 0)}">
        </label>
      `).join('')}
    </div>
    ${isBarcode ? `
      <label>
        <span>Symbology</span>
        <input value="CODE128" disabled>
      </label>
      <label>
        <span>Barcode Height</span>
        <input data-id-template-property="size" type="number" min="20" max="220" value="${Number(element.size || element.h || 70)}">
      </label>
    ` : ''}
    ${isText ? `
      <label>
        <span>Field</span>
        <select data-id-template-property="field">
          ${['fullName', 'firstName', 'lastName', 'homeroom', 'studentId', 'extra1', 'extra2', 'year'].map((field) => `
            <option value="${field}" ${element.field === field ? 'selected' : ''}>${escapeHtml(formatType(field))}</option>
          `).join('')}
        </select>
      </label>
      <div class="id-template-property-grid">
        <label>
          <span>Font</span>
          <input data-id-template-property="font" value="${escapeHtml(element.font || 'Arial')}">
        </label>
        <label>
          <span>Size</span>
          <input data-id-template-property="size" type="number" value="${Number(element.size || 32)}">
        </label>
        <label>
          <span>Color</span>
          <input data-id-template-property="color" type="color" value="${escapeHtml(element.color || '#000000')}">
        </label>
        <label>
          <span>Alignment</span>
          <select data-id-template-property="align">
            ${['left', 'center', 'right'].map((align) => `
              <option value="${align}" ${element.align === align ? 'selected' : ''}>${escapeHtml(formatType(align))}</option>
            `).join('')}
          </select>
        </label>
      </div>
    ` : ''}
  `;
}

async function loadIdTemplateDesigner() {
  const payload = await trecsApi('listIdTemplates').listIdTemplates(jobsState.selectedJobId);
  jobsState.idTemplateDesigner = {
    ...jobsState.idTemplateDesigner,
    loaded: true,
    folder: payload.folder || '',
    templates: payload.templates || [],
    backgrounds: payload.backgrounds || [],
    template: jobsState.idTemplateDesigner.template || createDefaultIdTemplate()
  };
  renderIdTemplateDesigner();
}

async function loadIdTemplateFile(fileName) {
  const result = await trecsApi('loadIdTemplate').loadIdTemplate(jobsState.selectedJobId, fileName);
  jobsState.idTemplateDesigner.selectedFileName = result.fileName;
  jobsState.idTemplateDesigner.selectedTemplateId = Number(result.fileName);
  jobsState.idTemplateDesigner.template = normalizeIdTemplateForDesigner(result.template);
  jobsState.idTemplateDesigner.selectedElement = 'photo';
  renderIdTemplateDesigner();
}

async function saveCurrentIdTemplate() {
  const designer = jobsState.idTemplateDesigner;
  const template = normalizeIdTemplateForDesigner(designer.template || createDefaultIdTemplate());
  template.name = idTemplateForm.elements.templateName.value.trim() || 'Student ID';
  template.templateType = idTemplateForm.elements.templateType.value === 'staff' ? 'staff' : 'student';
  setIdTemplateOrientation(template, idTemplateForm.elements.orientation.value);
  template.background = idTemplateForm.elements.background.value || '';
  const result = await trecsApi('saveIdTemplate').saveIdTemplate(jobsState.selectedJobId, {
    id: designer.selectedTemplateId,
    template
  });
  designer.template = result.template;
  designer.selectedFileName = result.fileName;
  designer.selectedTemplateId = result.id;
  designer.loaded = false;
  idTemplateStatus.textContent = `Saved ${result.fileName}`;
  await loadIdTemplateDesigner();
}

function updateSelectedIdTemplateElement(property, value, inputType) {
  const template = jobsState.idTemplateDesigner.template;
  const element = template && template.elements && template.elements[jobsState.idTemplateDesigner.selectedElement];
  if (!element) {
    return;
  }
  if (property === 'enabled') {
    element.enabled = Boolean(value);
  } else if (['x', 'y', 'w', 'h', 'size'].includes(property)) {
    element[property] = Number(value || 0);
  } else {
    element[property] = inputType === 'color' ? value : String(value || '');
  }
  renderIdTemplateStage();
  renderIdTemplateProperties();
}

function selectedSisFormats(useFallback = true) {
  const formats = [];
  if (jobsState.sisStudentCd) {
    formats.push('student_cd');
  }
  if (jobsState.sisDestiny) {
    formats.push('destiny');
  }
  if (jobsState.sisPowerSchool) {
    formats.push('powerschool');
  }
  if (jobsState.sisSasi) {
    formats.push('sasi');
  }
  return formats.length || !useFallback ? formats : ['student_cd'];
}

function adminRenderRequest(type) {
  return {
    type,
    stage: jobsState.adminStage,
    sortBy: jobsState.adminSortBy,
    outputFolder: jobsState.adminOutputFolder,
    sisFormats: selectedSisFormats(),
    idCardSource: jobsState.idCardSource,
    idCardListName: jobsState.idCardListName,
    idCardReason: jobsState.idCardReason,
    idCardSortMethod: jobsState.idCardSortMethod,
    idCardPhotographedOnly: jobsState.idCardPhotographedOnly,
    cameraCardSource: jobsState.cameraCardSource,
    cameraCardSourceValue: jobsState.cameraCardSourceValue,
    cameraCardListName: jobsState.cameraCardListName,
    cameraCardSortMethod: jobsState.cameraCardSortMethod,
    directoryType: jobsState.directoryType,
    directorySource: jobsState.directorySource,
    directoryListName: jobsState.directoryListName,
    directorySortMethod: jobsState.directorySortMethod,
    directorySchoolYear: directorySchoolYearLabel(jobsState.directorySchoolYear),
    directoryContactLine: jobsState.directoryContactLine,
    directoryPhotographedOnly: jobsState.directoryPhotographedOnly,
    stickerSource: jobsState.stickerSource,
    stickerListName: jobsState.stickerListName,
    stickerCopies: jobsState.stickerCopies,
    stickerSortMethod: jobsState.stickerSortMethod,
    stickerPhotographedOnly: jobsState.stickerPhotographedOnly
  };
}

async function loadAdminItems() {
  if (!jobsState.selectedJobId) {
    return;
  }
  if (jobsState.adminItemsLoading) {
    return;
  }

  jobsState.adminItemsLoading = true;
  adminItemsStatus.textContent = shootStageLabel(jobsState.adminStage);
  const options = adminOutputOptions();
  applyAdminOptions(options);

  try {
    jobsState.adminItems = await trecsApi('getAdminItems').getAdminItems(jobsState.selectedJobId, jobsState.adminStage);
    adminItemsStatus.textContent = shootStageLabel(jobsState.adminStage);
    renderAdminItemsWorkspace();
  } catch (error) {
    adminItemsStatus.textContent = 'Checklist ready';
    jobsState.adminItems = {
      stage: jobsState.adminStage,
      metrics: {},
      batches: [],
      error: error.message || 'Could not load admin item history.'
    };
    renderAdminItemsWorkspace();
    console.error(error);
  } finally {
    jobsState.adminItemsLoading = false;
  }
}

function renderAdminItemsWorkspace() {
  if (jobsState.workspaceMode !== 'admin') {
    return;
  }

  ensureAdminOutputControls();
  resetAdminSchoolYearForCurrentJob();
  adminOptionsForm.elements.stage.value = jobsState.adminStage;
  if (adminOptionsForm.elements.sortBy) {
    adminOptionsForm.elements.sortBy.value = jobsState.adminSortBy;
  }
  if (adminOptionsForm.elements.schoolYear) {
    adminOptionsForm.elements.schoolYear.value = jobsState.directorySchoolYear || schoolYearFromJobName(currentJobSummary());
  }
  const outputInput = adminOutputFolderInput();
  if (outputInput) {
    outputInput.value = jobsState.adminOutputFolder || '';
  }

  const data = jobsState.adminItems && jobsState.adminItems.stage === jobsState.adminStage
    ? jobsState.adminItems
    : {
      stage: jobsState.adminStage,
      metrics: {},
      batches: []
    };
  if (!jobsState.adminItems || jobsState.adminItems.stage !== jobsState.adminStage) {
    loadAdminItems();
  }

  const metrics = data.metrics || {};
  const items = adminItemDefinitionsForUi(jobsState.adminStage);
  const selectedItems = new Set(jobsState.selectedAdminItems || []);
  const groups = Array.from(new Set(items.map((item) => item.group)));
  const selectedCount = items.filter((item) => selectedItems.has(item.type)).length;
  const allSelected = selectedCount === items.length;
  adminItemsStatus.textContent = shootStageLabel(data.stage);
  adminItemsList.innerHTML = `
    <section class="admin-metrics">
      <article><span>Subjects</span><strong>${formatNumber(metrics.subjects || 0)}</strong></article>
      <article><span>Photographed</span><strong>${formatNumber(metrics.photographed || 0)}</strong></article>
      <article><span>Missing</span><strong>${formatNumber(metrics.missing || 0)}</strong></article>
      <article><span>Staff</span><strong>${formatNumber(metrics.staff || 0)}</strong></article>
    </section>
    <section class="admin-batch-summary">
      <div>
        <h3>${escapeHtml(shootStageLabel(data.stage))}</h3>
        <p>${formatNumber(selectedCount)} of ${formatNumber(items.length)} admin items selected</p>
      </div>
      <label class="checkbox-label admin-select-all">
        <input data-admin-select-all type="checkbox" ${allSelected ? 'checked' : ''}>
        <span>Select all</span>
      </label>
    </section>
    <div class="admin-checklist">
      ${groups.map((group) => `
        <section class="admin-checklist-group">
          <h3>${escapeHtml(group)}</h3>
          ${items.filter((item) => item.group === group).map((item) => `
            <div class="admin-check-row">
              <label class="admin-check-label">
                <input data-admin-item-checkbox="${escapeHtml(item.type)}" type="checkbox" ${selectedItems.has(item.type) ? 'checked' : ''}>
                <span>
                  <strong>${escapeHtml(item.label)}</strong>
                  <em>${escapeHtml(item.detail)}</em>
                </span>
              </label>
              ${item.type === 'school_directory' ? renderDirectoryOptions(data.listNames || []) : ''}
              ${item.type === 'id_cards' ? renderIdCardOptions(data.listNames || []) : ''}
              ${item.type === 'sis_export' ? renderSisOptions() : ''}
              ${item.type === 'sticker_prints' ? renderStickerOptions(data.listNames || []) : ''}
            </div>
          `).join('')}
        </section>
      `).join('')}
    </div>
    <section class="admin-design-note">
      <strong>Output ready</strong>
      <span>Select the admin items to render, choose an output folder, then run the batch.</span>
      ${data.error ? `<span>${escapeHtml(data.error)}</span>` : ''}
    </section>
  `;

  const batches = data.batches || [];
  adminItemsHistoryCount.textContent = `${formatNumber(batches.length)} shown`;
  adminItemsHistory.innerHTML = batches.length
    ? batches.map((batch) => `
      <div class="history-row">
        <span>${escapeHtml(shootStageLabel(batch.shootStage))} / ${escapeHtml(adminItemLabel(batch.adminItemType))}</span>
        <strong>${escapeHtml(batch.outputPath || '')}</strong>
        <em>${escapeHtml(batch.status)}${batch.completedAt ? ` / ${escapeHtml(batch.completedAt)}` : ''}</em>
      </div>
    `).join('')
    : '<div class="empty-state">No admin outputs yet.</div>';

  adminItemsList.querySelectorAll('[data-admin-item-checkbox]').forEach((input) => {
    input.addEventListener('change', () => {
      const nextSelected = new Set(jobsState.selectedAdminItems || []);
      if (input.checked) {
        nextSelected.add(input.dataset.adminItemCheckbox);
      } else {
        nextSelected.delete(input.dataset.adminItemCheckbox);
      }
      jobsState.selectedAdminItems = Array.from(nextSelected);
      renderAdminItemsWorkspace();
    });
  });

  const selectAll = adminItemsList.querySelector('[data-admin-select-all]');
  if (selectAll) {
    selectAll.addEventListener('change', () => {
      jobsState.selectedAdminItems = selectAll.checked ? items.map((item) => item.type) : [];
      renderAdminItemsWorkspace();
    });
  }

  bindDirectoryOptions();
  bindIdCardOptions();
  bindSisOptions();
  bindStickerOptions();
  renderAdminRunState();
}

function renderAdminRunState() {
  const state = jobsState.adminRunStatus || {};
  const visibleItemTypes = new Set(adminItemDefinitionsForUi(jobsState.adminStage).map((item) => item.type));
  const selectedCount = (jobsState.selectedAdminItems || []).filter((type) => visibleItemTypes.has(type)).length;
  const progress = adminItemsProgress || document.getElementById('adminItemsProgress');
  const progressText = adminItemsProgressText || document.getElementById('adminItemsProgressText');
  const runButton = runAdminItemsButton || document.getElementById('runAdminItemsButton');
  if (progress) {
    progress.value = Number(state.progress || 0);
  }
  if (progressText) {
    progressText.textContent = state.message || 'Ready';
  }
  if (runButton) {
    runButton.disabled = Boolean(state.running) || !selectedCount || !jobsState.adminOutputFolder;
    runButton.textContent = state.running ? 'Running...' : 'Run Selected Items';
  }
}

async function chooseAdminOutputFolder() {
  try {
    const result = await trecsApi('chooseAdminOutputFolder').chooseAdminOutputFolder();
    if (!result || result.canceled) {
      return;
    }
    jobsState.adminOutputFolder = result.folderPath || '';
    const outputInput = adminOutputFolderInput();
    if (outputInput) {
      outputInput.value = jobsState.adminOutputFolder;
    }
    jobsState.adminRunStatus = {
      running: false,
      progress: 0,
      message: jobsState.adminOutputFolder ? 'Output folder selected' : 'Ready'
    };
    renderAdminRunState();
  } catch (error) {
    adminItemsStatus.textContent = error.message || 'Could not choose output folder';
    console.error(error);
  }
}

async function runSelectedAdminItems() {
  const selectedItems = adminItemDefinitionsForUi(jobsState.adminStage)
    .filter((item) => (jobsState.selectedAdminItems || []).includes(item.type));
  if (!selectedItems.length) {
    jobsState.adminRunStatus = { running: false, progress: 0, message: 'Select at least one admin item' };
    renderAdminRunState();
    return;
  }
  if (!jobsState.adminOutputFolder) {
    jobsState.adminRunStatus = { running: false, progress: 0, message: 'Choose an output folder' };
    renderAdminRunState();
    return;
  }

  jobsState.adminRunStatus = {
    running: true,
    progress: 0,
    message: `Preparing ${formatNumber(selectedItems.length)} admin item${selectedItems.length === 1 ? '' : 's'}...`
  };
  adminItemsStatus.textContent = shootStageLabel(jobsState.adminStage);
  renderAdminRunState();

  const rendered = [];
  for (let index = 0; index < selectedItems.length; index += 1) {
    const item = selectedItems[index];
    jobsState.adminRunStatus = {
      running: true,
      progress: Math.round((index / selectedItems.length) * 100),
      message: `Rendering ${item.label}...`
    };
    renderAdminRunState();
    const result = await trecsApi('renderAdminItem').renderAdminItem(
      jobsState.selectedJobId,
      adminRenderRequest(item.type)
    );
    rendered.push(result);
    jobsState.adminRunStatus = {
      running: true,
      progress: Math.round(((index + 1) / selectedItems.length) * 100),
      message: `Rendered ${item.label}`
    };
    renderAdminRunState();
  }

  jobsState.adminRunStatus = {
    running: false,
    progress: 100,
    message: `Rendered ${formatNumber(rendered.length)} admin item${rendered.length === 1 ? '' : 's'}`
  };
  jobsState.adminItems = null;
  await loadAdminItems();
  renderAdminRunState();
}

async function renderAdminItem(button) {
  const originalText = button.textContent;
  button.disabled = true;
  button.textContent = 'Rendering...';
  adminItemsStatus.textContent = 'Rendering...';

  try {
    await trecsApi('renderAdminItem').renderAdminItem(
      jobsState.selectedJobId,
      adminRenderRequest(button.dataset.renderAdminItem)
    );
    jobsState.adminItems = null;
    await loadAdminItems();
  } catch (error) {
    adminItemsStatus.textContent = error.message || 'Render failed';
    console.error(error);
  } finally {
    button.disabled = false;
    button.textContent = originalText;
  }
}

function updateWorkspaceNavButtons() {
  const subjects = workspaceSubjects();
  workspacePreviousButton.disabled = subjects.length < 2;
  workspaceNextButton.disabled = subjects.length < 2;
}

function bindJobSortHeaders() {
  document.querySelectorAll('[data-job-sort]').forEach((button) => {
    const key = button.dataset.jobSort;
    button.classList.toggle('active', jobsState.sortKey === key);
    button.classList.toggle('sort-asc', jobsState.sortKey === key && jobsState.sortDirection === 'asc');
    button.classList.toggle('sort-desc', jobsState.sortKey === key && jobsState.sortDirection === 'desc');
    button.setAttribute(
      'aria-sort',
      jobsState.sortKey === key
        ? (jobsState.sortDirection === 'asc' ? 'ascending' : 'descending')
        : 'none'
    );
    button.textContent = `${sortLabel(key)}${sortIndicator(key)}`;

    button.onclick = () => {
      if (jobsState.sortKey === key) {
        jobsState.sortDirection = jobsState.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        jobsState.sortKey = key;
        jobsState.sortDirection = 'asc';
      }
      renderJobsScreen();
    };
  });
}

function renderNewSchoolForm() {
  if (!newSchoolPanel) {
    return;
  }

  newSchoolPanel.hidden = jobsState.jobWorkspaceOpen || !jobsState.showNewSchoolForm;
}

function setNewSchoolFormVisible(visible) {
  jobsState.showNewSchoolForm = visible;
  if (visible) {
    jobsState.showNewJobForm = false;
    jobsState.showImportPreviousJobForm = false;
  }
  if (newSchoolStatus) {
    newSchoolStatus.textContent = '';
  }
  renderNewSchoolForm();
  renderNewJobForm();
  renderImportPreviousJobForm();
}

function populateJobSetupOptions(form, options = {}) {
  if (!form) {
    return;
  }

  const clientSelect = form.elements.clientId;
  const packageSelect = form.elements.packagePlanId;
  const studentTemplateSelect = form.elements.studentIdTemplateId;
  const staffTemplateSelect = form.elements.facultyIdTemplateId;
  const currentClientId = clientSelect ? clientSelect.value : '';
  const currentPackagePlanId = packageSelect ? packageSelect.value : '';
  const currentStudentTemplateId = studentTemplateSelect ? studentTemplateSelect.value : '';
  const currentStaffTemplateId = staffTemplateSelect ? staffTemplateSelect.value : '';

  if (clientSelect) {
    clientSelect.innerHTML = jobsState.clients
      .length
      ? jobsState.clients
        .map((client) => `
          <option value="${client.id}">
            ${escapeHtml(client.trecsName || client.displayName)}
          </option>
        `)
        .join('')
      : '<option value="">Add a school first</option>';
  }

  if (packageSelect) {
    packageSelect.innerHTML = `
      <option value="">No package plan</option>
      ${jobsState.packagePlans
        .map((plan) => `
          <option value="${plan.id}">
            ${escapeHtml(plan.name)}${plan.version > 1 ? ` v${plan.version}` : ''}
          </option>
        `)
        .join('')}
    `;
  }

  if (clientSelect && currentClientId && jobsState.clients.some((client) => String(client.id) === currentClientId)) {
    clientSelect.value = currentClientId;
  } else if (clientSelect && jobsState.selectedNewClientId) {
    clientSelect.value = String(jobsState.selectedNewClientId);
  }
  if (packageSelect && currentPackagePlanId && jobsState.packagePlans.some((plan) => String(plan.id) === currentPackagePlanId)) {
    packageSelect.value = currentPackagePlanId;
  }

  if (studentTemplateSelect) {
    const studentTemplates = (jobsState.idCardTemplates || []).filter((template) => template.templateType === 'student');
    studentTemplateSelect.innerHTML = `
      <option value="">Use latest Student ID template</option>
      ${studentTemplates.map((template) => `
        <option value="${template.id}">${escapeHtml(template.name)}</option>
      `).join('')}
    `;
    if (currentStudentTemplateId && studentTemplates.some((template) => String(template.id) === currentStudentTemplateId)) {
      studentTemplateSelect.value = currentStudentTemplateId;
    } else if (options.applyDefaults !== false) {
      const defaultStudent = studentTemplates.find((template) => /^student id$/i.test(template.name));
      if (defaultStudent) {
        studentTemplateSelect.value = String(defaultStudent.id);
      }
    }
  }

  if (staffTemplateSelect) {
    const staffTemplates = (jobsState.idCardTemplates || []).filter((template) => template.templateType === 'staff');
    staffTemplateSelect.innerHTML = `
      <option value="">Use latest Staff ID template</option>
      ${staffTemplates.map((template) => `
        <option value="${template.id}">${escapeHtml(template.name)}</option>
      `).join('')}
    `;
    if (currentStaffTemplateId && staffTemplates.some((template) => String(template.id) === currentStaffTemplateId)) {
      staffTemplateSelect.value = currentStaffTemplateId;
    } else if (options.applyDefaults !== false) {
      const defaultStaff = staffTemplates.find((template) => /^staff id$/i.test(template.name));
      if (defaultStaff) {
        staffTemplateSelect.value = String(defaultStaff.id);
      }
    }
  }
}

function renderNewJobForm() {
  if (!newJobPanel || !newJobForm) {
    return;
  }

  newJobPanel.hidden = jobsState.jobWorkspaceOpen || !jobsState.showNewJobForm;
  if (!jobsState.showNewJobForm) {
    return;
  }

  populateJobSetupOptions(newJobForm);
}

function setNewJobFormVisible(visible) {
  jobsState.showNewJobForm = visible;
  if (visible) {
    jobsState.showNewSchoolForm = false;
    jobsState.showImportPreviousJobForm = false;
  }
  if (newJobStatus) {
    newJobStatus.textContent = '';
  }
  renderNewSchoolForm();
  renderNewJobForm();
  renderImportPreviousJobForm();
}

function renderImportPreviousJobForm() {
  if (!importPreviousJobPanel || !importPreviousJobForm) {
    return;
  }

  importPreviousJobPanel.hidden = jobsState.jobWorkspaceOpen || !jobsState.showImportPreviousJobForm;
  if (!jobsState.showImportPreviousJobForm) {
    return;
  }

  populateJobSetupOptions(importPreviousJobForm);
}

function setImportPreviousJobFormVisible(visible) {
  jobsState.showImportPreviousJobForm = visible;
  if (visible) {
    jobsState.showNewSchoolForm = false;
    jobsState.showNewJobForm = false;
  }
  if (importPreviousJobStatus) {
    importPreviousJobStatus.textContent = '';
  }
  renderNewSchoolForm();
  renderNewJobForm();
  renderImportPreviousJobForm();
}

function resetNewJobForm() {
  newJobForm.reset();
  if (jobsState.selectedNewClientId) {
    newJobForm.elements.clientId.value = String(jobsState.selectedNewClientId);
  }
  const fallPlan = jobsState.packagePlans.find((plan) => /fall/i.test(plan.name));
  if (fallPlan) {
    newJobForm.elements.packagePlanId.value = String(fallPlan.id);
  }
}

function openEditJobModal() {
  if (!editJobModal || !editJobForm || !jobsState.detail || !jobsState.detail.summary) {
    return;
  }
  const job = jobsState.detail.summary;
  editJobForm.reset();
  populateJobSetupOptions(editJobForm, { applyDefaults: false });
  editJobForm.elements.name.value = job.job || job.name || '';
  editJobForm.elements.type.value = job.type || 'fall';
  editJobForm.elements.packagePlanId.value = job.packagePlanId ? String(job.packagePlanId) : '';
  editJobForm.elements.studentIdTemplateId.value = job.studentIdTemplateId ? String(job.studentIdTemplateId) : '';
  editJobForm.elements.facultyIdTemplateId.value = job.facultyIdTemplateId ? String(job.facultyIdTemplateId) : '';
  editJobForm.elements.shootDate.value = job.shootDate || '';
  editJobForm.elements.retakeDate.value = job.retakeDate || '';
  editJobForm.elements.rootPath.value = job.rootPath || '';
  editJobForm.elements.notes.value = job.notes || '';
  editJobStatus.textContent = '';
  editJobModal.hidden = false;
  editJobForm.elements.name.focus();
  editJobForm.elements.name.select();
}

function closeEditJobModal() {
  if (!editJobModal) {
    return;
  }
  editJobModal.hidden = true;
  if (editJobStatus) {
    editJobStatus.textContent = '';
  }
}

async function submitEditJob(event) {
  event.preventDefault();
  if (!jobsState.selectedJobId) {
    return;
  }
  const button = editJobForm.querySelector('button[type="submit"]');
  button.disabled = true;
  button.textContent = 'Saving...';
  editJobStatus.textContent = 'Saving...';

  try {
    await trecsApi('updateJob').updateJob(jobsState.selectedJobId, {
      name: editJobForm.elements.name.value,
      type: editJobForm.elements.type.value,
      packagePlanId: editJobForm.elements.packagePlanId.value,
      studentIdTemplateId: editJobForm.elements.studentIdTemplateId.value,
      facultyIdTemplateId: editJobForm.elements.facultyIdTemplateId.value,
      shootDate: editJobForm.elements.shootDate.value,
      retakeDate: editJobForm.elements.retakeDate.value,
      rootPath: editJobForm.elements.rootPath.value,
      notes: editJobForm.elements.notes.value
    });
    closeEditJobModal();
    jobsState.detail = null;
    await loadDashboard();
    await loadJobs();
    await loadJobDetail(jobsState.selectedJobId);
  } catch (error) {
    editJobStatus.textContent = error.message || 'Save failed';
    console.error(error);
  } finally {
    button.disabled = false;
    button.textContent = 'Save Job';
  }
}

function resetImportPreviousJobForm() {
  importPreviousJobForm.reset();
  if (jobsState.selectedNewClientId) {
    importPreviousJobForm.elements.clientId.value = String(jobsState.selectedNewClientId);
  }
  const fallPlan = jobsState.packagePlans.find((plan) => /fall/i.test(plan.name));
  if (fallPlan) {
    importPreviousJobForm.elements.packagePlanId.value = String(fallPlan.id);
  }
}

function resetNewSchoolForm() {
  newSchoolForm.reset();
}

function renderJobDetail(job) {
  if (!jobDetailPanel) {
    return;
  }
  if (!job) {
    jobDetailPanel.innerHTML = `
      <div class="panel-heading">
        <h2>Job Detail</h2>
      </div>
      <div class="empty-state">Select a job</div>
    `;
    return;
  }

  const photographedPercent = job.subjects > 0
    ? Math.round((job.subjectsWithPrimaryImage / job.subjects) * 100)
    : 0;

  jobDetailPanel.innerHTML = `
    <div class="panel-heading">
      <h2>${job.job}</h2>
      <span class="status ready">${job.status}</span>
    </div>
    <div class="detail-body">
      <div class="detail-title">
        <strong>${job.location}</strong>
        <span>${formatType(job.type)} / ${job.packagePlan || 'No package plan'}</span>
      </div>
      <dl>
        <div>
          <dt>Subjects</dt>
          <dd>${formatNumber(job.subjects)}</dd>
        </div>
        <div>
          <dt>Primary Images</dt>
          <dd>${formatNumber(job.subjectsWithPrimaryImage)} (${photographedPercent}%)</dd>
        </div>
        <div>
          <dt>Orders</dt>
          <dd>${formatNumber(job.orders)}</dd>
        </div>
        <div>
          <dt>Order Items</dt>
          <dd>${formatNumber(job.orderItems)}</dd>
        </div>
        <div>
          <dt>Image Assets</dt>
          <dd>${formatNumber(job.images)}</dd>
        </div>
        <div>
          <dt>Subject Image Links</dt>
          <dd>${formatNumber(job.subjectImages)}</dd>
        </div>
      </dl>
      <div class="path-box">${job.rootPath}</div>
      <div class="detail-actions">
        <button data-generate-cropped-medium="${job.id}" type="button">Create Cropped Medium</button>
      </div>
      <div class="package-actions">
        <span data-cropped-medium-status>
          ${renderCroppedMediumStatus(job.id)}
        </span>
        <span data-cropped-image-sync-status>
          ${renderCroppedImageSyncStatus(job.id)}
        </span>
        <span data-laptop-package-status>
          ${renderLaptopPackageStatus(job.id)}
        </span>
        <span data-end-of-day-status>
          ${renderEndOfDayStatus(job.id)}
        </span>
      </div>
    </div>
  `;

  bindJobDetailActions();
}

function renderCroppedImageSyncStatus(jobId) {
  const sync = jobsState.lastCroppedImageSync;
  if (!sync || sync.jobId !== jobId) {
    return '';
  }

  if (sync.status === 'working') {
    return 'Syncing cropped images...';
  }

  if (sync.status === 'error') {
    return sync.message || 'Cropped image sync failed';
  }

  const skipped = sync.ambiguous ? ` ${sync.ambiguous} ambiguous.` : '';
  return `Synced ${sync.registered} cropped images (${sync.croppedLarge} large, ${sync.croppedMed} medium). ${sync.unmatched} unmatched.${skipped}`;
}

function croppedSyncStatusFromResult(jobId, result) {
  const folders = result && result.folders ? result.folders : [];
  const folderCounts = Object.fromEntries(
    folders.map((folder) => [folder.versionType, folder])
  );
  return {
    jobId,
    status: 'done',
    registered: result ? result.registered : 0,
    croppedLarge: folderCounts.cropped_large ? folderCounts.cropped_large.matched : 0,
    croppedMed: folderCounts.cropped_med ? folderCounts.cropped_med.matched : 0,
    unmatched: folders.reduce((total, folder) => total + ((folder.unmatched || []).length), 0),
    ambiguous: folders.reduce((total, folder) => total + ((folder.ambiguous || []).length), 0)
  };
}

function renderCroppedMediumStatus(jobId) {
  const generation = jobsState.lastCroppedMediumGeneration;
  if (!generation || generation.jobId !== jobId) {
    return '';
  }

  if (generation.status === 'working') {
    return 'Creating Cropped Medium images...';
  }

  if (generation.status === 'error') {
    return generation.message || 'Cropped Medium creation failed';
  }

  return `Cropped Medium: ${generation.created} created, ${generation.skipped} skipped, ${generation.failed} failed.`;
}

function setCroppedMediumModalVisible(visible) {
  if (!croppedMediumModal) {
    return;
  }
  croppedMediumModal.hidden = !visible;
  if (visible) {
    closeCroppedMediumButton.disabled = true;
    croppedMediumProgress.value = 0;
    croppedMediumProgress.max = 100;
    croppedMediumStatus.textContent = 'Preparing images...';
    croppedMediumSummary.textContent = '';
  }
}

function updateCroppedMediumProgress(payload = {}) {
  if (!croppedMediumModal || croppedMediumModal.hidden) {
    return;
  }
  const total = Number(payload.total || 0);
  const done = Number(payload.done || 0);
  croppedMediumProgress.max = total || 100;
  croppedMediumProgress.value = total ? done : 0;
  const filename = payload.filename ? ` ${payload.filename}` : '';
  const status = payload.status ? `${payload.status}${filename}` : 'Working...';
  croppedMediumStatus.textContent = status;
  croppedMediumSummary.textContent = `${formatNumber(done)} / ${formatNumber(total)} processed, ${formatNumber(payload.created || 0)} created, ${formatNumber(payload.skipped || 0)} skipped, ${formatNumber(payload.failed || 0)} failed`;
}

async function performGenerateCroppedMedium(jobId) {
  setCroppedMediumModalVisible(true);
  jobsState.lastCroppedMediumGeneration = { jobId, status: 'working' };
  renderJobDetail(jobsState.detail && jobsState.detail.summary ? jobsState.detail.summary : jobsState.jobs.find((job) => job.id === jobId));

  try {
    const result = await trecsApi('generateCroppedMediumImages').generateCroppedMediumImages(jobId);
    jobsState.imagePreviewCache.clear();
    jobsState.lastCroppedMediumGeneration = {
      jobId,
      status: 'done',
      created: result.created || 0,
      skipped: result.skipped || 0,
      failed: result.failed || 0
    };
    jobsState.lastCroppedImageSync = croppedSyncStatusFromResult(jobId, result.syncResult);
    croppedMediumStatus.textContent = `Done. ${formatNumber(result.created || 0)} created, ${formatNumber(result.skipped || 0)} skipped, ${formatNumber(result.failed || 0)} failed.`;
    closeCroppedMediumButton.disabled = false;
    await reloadCurrentJobDetail();
  } catch (error) {
    jobsState.lastCroppedMediumGeneration = {
      jobId,
      status: 'error',
      message: error.message || 'Cropped Medium creation failed'
    };
    croppedMediumStatus.textContent = error.message || 'Cropped Medium creation failed';
    closeCroppedMediumButton.disabled = false;
    renderJobDetail(jobsState.detail && jobsState.detail.summary ? jobsState.detail.summary : jobsState.jobs.find((job) => job.id === jobId));
    console.error(error);
  }
}

function renderLaptopPackageStatus(jobId) {
  const laptopPackage = jobsState.lastLaptopPackage;
  if (!laptopPackage || laptopPackage.jobId !== jobId) {
    return '';
  }

  if (laptopPackage.status === 'working') {
    return 'Creating onsite setup...';
  }

  if (laptopPackage.status === 'error') {
    return laptopPackage.message || 'Package failed';
  }

  return `Created onsite setup with ${laptopPackage.subjects} subjects at ${laptopPackage.packagePath}`;
}

function renderEndOfDayStatus(jobId) {
  const endOfDay = jobsState.lastEndOfDayPackage;
  if (!endOfDay || endOfDay.jobId !== jobId) {
    return '';
  }

  if (endOfDay.status === 'working') {
    return 'Creating end of day...';
  }

  if (endOfDay.status === 'error') {
    return endOfDay.message || 'End of day failed';
  }

  return `Created end of day with ${endOfDay.capturedImages} captured images at ${endOfDay.packagePath}`;
}

function selectedJobIdForAction() {
  if (jobsState.selectedJobId) {
    return jobsState.selectedJobId;
  }
  window.alert('Select a job first.');
  return null;
}

async function ensureSelectedJobWorkspace(mode) {
  const jobId = selectedJobIdForAction();
  if (!jobId) {
    return null;
  }

  setView('jobs');
  if (mode === 'capture') {
    await openCaptureLogin(jobId);
    return jobId;
  }
  if (
    !jobsState.jobWorkspaceOpen
    || !jobsState.detail
    || !jobsState.detail.summary
    || jobsState.detail.summary.id !== jobId
  ) {
    await openJob(jobId);
  }
  setWorkspaceMode(mode);
  return jobId;
}

async function performPrepareOnsiteSetup(jobId) {
  const status = jobDetailPanel ? jobDetailPanel.querySelector('[data-laptop-package-status]') : null;
  jobsState.lastLaptopPackage = { jobId, status: 'working' };
  if (status) {
    status.textContent = renderLaptopPackageStatus(jobId);
  }

  try {
    const result = await trecsApi('prepareLaptopPackage').prepareLaptopPackage(jobId);
    jobsState.lastLaptopPackage = {
      jobId,
      status: 'done',
      packagePath: result.packagePath,
      subjects: result.counts.subjects
    };
    alert(`Onsite setup created.\n\n${result.packagePath}`);
    await loadPictureDayPrep(true);
  } catch (error) {
    jobsState.lastLaptopPackage = {
      jobId,
      status: 'error',
      message: error.message || 'Package failed'
    };
    console.error(error);
  } finally {
    if (status) {
      status.textContent = renderLaptopPackageStatus(jobId);
    }
  }
}

function cameraCardDialogValuesForSource(source) {
  const dialog = jobsState.cameraCardsDialog || {};
  const filters = dialog.filterOptions || {};
  if (source === 'grade') {
    return filters.grades || [];
  }
  if (source === 'homeroom') {
    return filters.homerooms || [];
  }
  if (source === 'track') {
    return filters.tracks || [];
  }
  if (source === 'list') {
    return dialog.listNames || [];
  }
  return [];
}

function setCameraCardsProgress(value, message) {
  if (cameraCardsProgress) {
    cameraCardsProgress.value = Number(value || 0);
  }
  if (cameraCardsStatus && message) {
    cameraCardsStatus.textContent = message;
  }
}

function renderCameraCardsModalOptions() {
  if (!cameraCardsForm) {
    return;
  }
  const source = cameraCardsForm.elements.source.value || jobsState.cameraCardSource || 'all';
  const values = cameraCardDialogValuesForSource(source);
  const selected = source === 'list'
    ? (jobsState.cameraCardListName || jobsState.cameraCardSourceValue)
    : jobsState.cameraCardSourceValue;
  const label = {
    all: 'Filter',
    grade: 'Grade',
    homeroom: 'Homeroom',
    track: 'Track',
    list: 'Saved List'
  }[source] || 'Filter';
  cameraCardsFilterLabel.textContent = label;
  cameraCardsForm.elements.sourceValue.disabled = source === 'all' || values.length === 0;
  cameraCardsForm.elements.sourceValue.innerHTML = values.length
    ? values.map((value) => `
      <option value="${escapeHtml(value)}" ${value === selected ? 'selected' : ''}>
        ${escapeHtml(value)}
      </option>
    `).join('')
    : `<option value="">${source === 'all' ? 'No filter needed' : 'No values found'}</option>`;
  if (source !== 'all' && values.length && !values.includes(cameraCardsForm.elements.sourceValue.value)) {
    cameraCardsForm.elements.sourceValue.value = values[0];
  }
}

async function openCameraCardsModal(jobId) {
  if (!cameraCardsModal || !cameraCardsForm) {
    await performCreateCameraCards(jobId);
    return;
  }
  jobsState.cameraCardsDialog = {
    ...jobsState.cameraCardsDialog,
    jobId,
    loading: true,
    running: false,
    listNames: [],
    filterOptions: { grades: [], homerooms: [], tracks: [] }
  };
  cameraCardsModal.hidden = false;
  cameraCardsForm.elements.source.value = jobsState.cameraCardSource || 'all';
  cameraCardsForm.elements.sortMethod.value = jobsState.cameraCardSortMethod || 'alpha_grade';
  cameraCardsForm.elements.outputFolder.value = jobsState.adminOutputFolder || '';
  cameraCardsForm.elements.pdfOnly.checked = false;
  createCameraCardsButton.disabled = true;
  browseCameraCardsOutputButton.disabled = false;
  setCameraCardsProgress(0, 'Loading camera card options...');
  cameraCardsSummary.textContent = '';
  renderCameraCardsModalOptions();

  try {
    const data = await trecsApi('getAdminItems').getAdminItems(jobId, jobsState.adminStage || 'original_picture_day');
    jobsState.cameraCardsDialog = {
      ...jobsState.cameraCardsDialog,
      loading: false,
      listNames: data.listNames || [],
      filterOptions: data.filterOptions || { grades: [], homerooms: [], tracks: [] }
    };
    renderCameraCardsModalOptions();
    createCameraCardsButton.disabled = !cameraCardsForm.elements.outputFolder.value;
    setCameraCardsProgress(0, 'Choose options, then create camera cards.');
  } catch (error) {
    jobsState.cameraCardsDialog.loading = false;
    createCameraCardsButton.disabled = true;
    setCameraCardsProgress(0, error.message || 'Could not load camera card options.');
    console.error(error);
  }
}

function closeCameraCardsModal() {
  if (!cameraCardsModal || (jobsState.cameraCardsDialog && jobsState.cameraCardsDialog.running)) {
    return;
  }
  cameraCardsModal.hidden = true;
}

async function browseCameraCardsOutputFolder() {
  try {
    const result = await trecsApi('chooseAdminOutputFolder').chooseAdminOutputFolder();
    if (!result || result.canceled) {
      return;
    }
    jobsState.adminOutputFolder = result.folderPath || '';
    cameraCardsForm.elements.outputFolder.value = jobsState.adminOutputFolder;
    createCameraCardsButton.disabled = !jobsState.adminOutputFolder || Boolean(jobsState.cameraCardsDialog.loading);
    setCameraCardsProgress(0, 'Output folder selected.');
  } catch (error) {
    setCameraCardsProgress(0, error.message || 'Could not choose output folder.');
    console.error(error);
  }
}

async function performCreateCameraCards(jobId, input = null) {
  const request = input || {
    outputFolder: jobsState.adminOutputFolder || '',
    cameraCardSource: jobsState.cameraCardSource || 'all',
    cameraCardSourceValue: jobsState.cameraCardSourceValue || '',
    cameraCardListName: jobsState.cameraCardListName || '',
    cameraCardSortMethod: jobsState.cameraCardSortMethod || 'alpha_grade',
    cameraCardPdfOnly: false
  };
  const outputFolder = request.outputFolder || '';
  try {
    jobsState.adminOutputFolder = outputFolder;
    const result = await trecsApi('renderAdminItem').renderAdminItem(jobId, {
      type: 'camera_cards',
      stage: jobsState.adminStage || 'original_picture_day',
      outputFolder,
      cameraCardSource: request.cameraCardSource || 'all',
      cameraCardSourceValue: request.cameraCardSourceValue || '',
      cameraCardListName: request.cameraCardListName || '',
      cameraCardSortMethod: request.cameraCardSortMethod || 'alpha_grade',
      cameraCardPdfOnly: Boolean(request.cameraCardPdfOnly)
    });
    await loadAdminItems();
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function submitCameraCardsForm(event) {
  event.preventDefault();
  const jobId = jobsState.cameraCardsDialog && jobsState.cameraCardsDialog.jobId;
  if (!jobId) {
    return;
  }
  const source = cameraCardsForm.elements.source.value || 'all';
  const sourceValue = source === 'all' ? '' : cameraCardsForm.elements.sourceValue.value;
  jobsState.cameraCardSource = source;
  jobsState.cameraCardSourceValue = sourceValue;
  jobsState.cameraCardListName = source === 'list' ? sourceValue : '';
  jobsState.cameraCardSortMethod = cameraCardsForm.elements.sortMethod.value || 'alpha_grade';
  jobsState.adminOutputFolder = cameraCardsForm.elements.outputFolder.value || '';
  if (!jobsState.adminOutputFolder) {
    setCameraCardsProgress(0, 'Choose an output folder first.');
    return;
  }

  jobsState.cameraCardsDialog.running = true;
  createCameraCardsButton.disabled = true;
  cancelCameraCardsButton.disabled = true;
  browseCameraCardsOutputButton.disabled = true;
  setCameraCardsProgress(15, 'Preparing camera card work list...');
  cameraCardsSummary.textContent = '';

  try {
    setCameraCardsProgress(45, 'Rendering camera card sheets...');
    const result = await performCreateCameraCards(jobId, {
      outputFolder: jobsState.adminOutputFolder,
      cameraCardSource: jobsState.cameraCardSource,
      cameraCardSourceValue: jobsState.cameraCardSourceValue,
      cameraCardListName: jobsState.cameraCardListName,
      cameraCardSortMethod: jobsState.cameraCardSortMethod,
      cameraCardPdfOnly: cameraCardsForm.elements.pdfOnly.checked
    });
    setCameraCardsProgress(100, 'Camera cards complete.');
    cameraCardsSummary.textContent = result.absoluteOutputPath || result.outputPath || '';
    await loadPictureDayPrep(true);
  } catch (error) {
    setCameraCardsProgress(0, error.message || 'Camera card render failed.');
  } finally {
    jobsState.cameraCardsDialog.running = false;
    createCameraCardsButton.disabled = false;
    cancelCameraCardsButton.disabled = false;
    browseCameraCardsOutputButton.disabled = false;
  }
}

async function performSyncCroppedImages(jobId) {
  const status = jobDetailPanel ? jobDetailPanel.querySelector('[data-cropped-image-sync-status]') : null;
  jobsState.lastCroppedImageSync = { jobId, status: 'working' };
  if (status) {
    status.textContent = renderCroppedImageSyncStatus(jobId);
  }

  try {
    const result = await trecsApi('syncCroppedImages').syncCroppedImages(jobId);
    jobsState.imagePreviewCache.clear();
    jobsState.lastCroppedImageSync = croppedSyncStatusFromResult(jobId, result);
    await reloadCurrentJobDetail();
  } catch (error) {
    jobsState.lastCroppedImageSync = {
      jobId,
      status: 'error',
      message: error.message || 'Cropped image sync failed'
    };
    if (status) {
      status.textContent = renderCroppedImageSyncStatus(jobId);
    }
    console.error(error);
  }
}

function cropToolContext() {
  return cropToolCanvas ? cropToolCanvas.getContext('2d') : null;
}

function cropToolRotation() {
  return ((Number(jobsState.cropTool.rotation) || 0) % 360 + 360) % 360;
}

function cropToolOrientedSize() {
  const image = jobsState.cropTool.image;
  if (!image) {
    return { width: 1, height: 1 };
  }
  const rotatedSideways = cropToolRotation() === 90 || cropToolRotation() === 270;
  return {
    width: rotatedSideways ? image.naturalHeight : image.naturalWidth,
    height: rotatedSideways ? image.naturalWidth : image.naturalHeight
  };
}

function cropToolBaseScale() {
  if (!jobsState.cropTool.image || !cropToolCanvas) {
    return 1;
  }
  const size = cropToolOrientedSize();
  return Math.max(cropToolCanvas.width / size.width, cropToolCanvas.height / size.height);
}

function clampCropToolOffsets() {
  const image = jobsState.cropTool.image;
  if (!image || !cropToolCanvas) {
    return;
  }
  const scale = cropToolBaseScale() * jobsState.cropTool.zoom;
  const size = cropToolOrientedSize();
  const drawWidth = size.width * scale;
  const drawHeight = size.height * scale;
  const minX = Math.min(0, cropToolCanvas.width - drawWidth);
  const maxX = Math.max(0, cropToolCanvas.width - drawWidth);
  const minY = Math.min(0, cropToolCanvas.height - drawHeight);
  const maxY = Math.max(0, cropToolCanvas.height - drawHeight);
  jobsState.cropTool.offsetX = Math.min(maxX, Math.max(minX, jobsState.cropTool.offsetX));
  jobsState.cropTool.offsetY = Math.min(maxY, Math.max(minY, jobsState.cropTool.offsetY));
}

function drawCropToolImage(context, image, x, y, scale) {
  const rawWidth = image.naturalWidth * scale;
  const rawHeight = image.naturalHeight * scale;
  const rotation = cropToolRotation();

  context.save();
  context.translate(x, y);
  if (rotation === 90) {
    context.translate(rawHeight, 0);
    context.rotate(Math.PI / 2);
  } else if (rotation === 180) {
    context.translate(rawWidth, rawHeight);
    context.rotate(Math.PI);
  } else if (rotation === 270) {
    context.translate(0, rawWidth);
    context.rotate(-Math.PI / 2);
  }
  context.drawImage(image, 0, 0, rawWidth, rawHeight);
  context.restore();
}

function drawCropTool() {
  const context = cropToolContext();
  if (!context || !cropToolCanvas) {
    return;
  }
  context.clearRect(0, 0, cropToolCanvas.width, cropToolCanvas.height);
  context.fillStyle = '#f8fafc';
  context.fillRect(0, 0, cropToolCanvas.width, cropToolCanvas.height);

  const image = jobsState.cropTool.image;
  if (!image) {
    context.fillStyle = '#52677a';
    context.font = '18px Segoe UI, Arial, sans-serif';
    context.textAlign = 'center';
    context.fillText('Open an image', cropToolCanvas.width / 2, cropToolCanvas.height / 2);
    return;
  }

  clampCropToolOffsets();
  const scale = cropToolBaseScale() * jobsState.cropTool.zoom;
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  drawCropToolImage(context, image, jobsState.cropTool.offsetX, jobsState.cropTool.offsetY, scale);

  context.strokeStyle = 'rgba(255, 255, 255, 0.9)';
  context.lineWidth = 2;
  context.strokeRect(1, 1, cropToolCanvas.width - 2, cropToolCanvas.height - 2);
  context.strokeStyle = 'rgba(15, 23, 42, 0.32)';
  context.lineWidth = 1;
  for (const x of [cropToolCanvas.width / 3, cropToolCanvas.width * 2 / 3]) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, cropToolCanvas.height);
    context.stroke();
  }
  for (const y of [cropToolCanvas.height / 3, cropToolCanvas.height * 2 / 3]) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(cropToolCanvas.width, y);
    context.stroke();
  }
}

function resetCropToolImage() {
  const image = jobsState.cropTool.image;
  if (!image || !cropToolCanvas) {
    return;
  }
  jobsState.cropTool.zoom = 1;
  jobsState.cropTool.minZoom = 1;
  const scale = cropToolBaseScale();
  const size = cropToolOrientedSize();
  jobsState.cropTool.offsetX = (cropToolCanvas.width - size.width * scale) / 2;
  jobsState.cropTool.offsetY = (cropToolCanvas.height - size.height * scale) / 2;
  if (cropToolZoom) {
    cropToolZoom.disabled = false;
    cropToolZoom.value = '1';
  }
  if (resetCropToolButton) {
    resetCropToolButton.disabled = false;
  }
  if (saveCropToolButton) {
    saveCropToolButton.disabled = false;
  }
  if (rotateCropToolButton) {
    rotateCropToolButton.disabled = false;
  }
  drawCropTool();
}

function setCropToolStatus(message) {
  if (cropToolStatus) {
    cropToolStatus.textContent = message;
  }
}

function renderCropToolBatchList() {
  if (cropToolFolderSummary) {
    const input = jobsState.cropTool.inputFolder ? `Input: ${jobsState.cropTool.inputFolder}` : 'Input: not selected';
    const output = jobsState.cropTool.outputFolder ? `Output: ${jobsState.cropTool.outputFolder}` : 'Output: not selected';
    cropToolFolderSummary.textContent = `${input}\n${output}`;
  }

  if (!cropToolImageList) {
    return;
  }

  const files = jobsState.cropTool.files || [];
  if (!files.length) {
    cropToolImageList.innerHTML = '<div class="empty-state">No input folder loaded.</div>';
    return;
  }

  cropToolImageList.innerHTML = files.map((file, index) => `
    <button class="${index === jobsState.cropTool.currentIndex ? 'active' : ''}" data-crop-tool-index="${index}" type="button">
      ${escapeHtml(file.filename || '')}
    </button>
  `).join('');

  cropToolImageList.querySelectorAll('[data-crop-tool-index]').forEach((button) => {
    button.addEventListener('click', () => {
      loadCropToolFileAtIndex(Number(button.dataset.cropToolIndex)).catch((error) => {
        setCropToolStatus(error.message || 'Could not load crop image.');
        console.error(error);
      });
    });
  });
}

function setCropToolVisible(visible) {
  if (!cropToolModal) {
    return;
  }
  cropToolModal.hidden = !visible;
  if (visible) {
    renderCropToolBatchList();
    drawCropTool();
  }
}

function loadCropToolPayload(result, index = -1) {
  const image = new Image();
  image.onload = () => {
    jobsState.cropTool.image = image;
    jobsState.cropTool.filename = result.filename || '';
    jobsState.cropTool.sourcePath = result.filePath || '';
    jobsState.cropTool.currentIndex = index;
    jobsState.cropTool.rotation = 0;
    resetCropToolImage();
    renderCropToolBatchList();
    setCropToolStatus(`${result.filename || 'Image loaded'} - drag to position, adjust zoom, then save.`);
  };
  image.onerror = () => {
    setCropToolStatus('Could not load that image.');
  };
  image.src = result.dataUrl;
}

async function chooseCropToolImage() {
  const result = await trecsApi('chooseCropToolImage').chooseCropToolImage();
  if (!result || result.canceled) {
    return;
  }

  loadCropToolPayload(result, -1);
}

async function chooseCropToolInputFolder() {
  const result = await trecsApi('chooseCropToolInputFolder').chooseCropToolInputFolder();
  if (!result || result.canceled) {
    return;
  }
  jobsState.cropTool.inputFolder = result.folderPath || '';
  jobsState.cropTool.files = result.files || [];
  jobsState.cropTool.currentIndex = -1;
  renderCropToolBatchList();
  if (!jobsState.cropTool.files.length) {
    setCropToolStatus('No JPG or PNG images found in that input folder.');
    return;
  }
  await loadCropToolFileAtIndex(0);
}

async function chooseCropToolOutputFolder() {
  const result = await trecsApi('chooseCropToolOutputFolder').chooseCropToolOutputFolder();
  if (!result || result.canceled) {
    return;
  }
  jobsState.cropTool.outputFolder = result.folderPath || '';
  renderCropToolBatchList();
  setCropToolStatus(`Output folder selected. Crops will save there and advance to the next image.`);
}

async function loadCropToolFileAtIndex(index) {
  const files = jobsState.cropTool.files || [];
  if (index < 0 || index >= files.length) {
    return;
  }
  const result = await trecsApi('loadCropToolImage').loadCropToolImage(files[index].filePath);
  loadCropToolPayload(result, index);
}

async function saveCropToolImage() {
  const image = jobsState.cropTool.image;
  if (!image || !cropToolCanvas) {
    return;
  }

  const output = document.createElement('canvas');
  output.width = 2400;
  output.height = 3000;
  const context = output.getContext('2d');
  context.fillStyle = '#fff';
  context.fillRect(0, 0, output.width, output.height);
  const multiplier = output.width / cropToolCanvas.width;
  const scale = cropToolBaseScale() * jobsState.cropTool.zoom * multiplier;
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  drawCropToolImage(
    context,
    image,
    jobsState.cropTool.offsetX * multiplier,
    jobsState.cropTool.offsetY * multiplier,
    scale
  );

  setCropToolStatus('Saving crop...');
  const result = await trecsApi('saveCropToolImage').saveCropToolImage({
    sourcePath: jobsState.cropTool.sourcePath,
    outputFolder: jobsState.cropTool.outputFolder,
    dataUrl: output.toDataURL('image/jpeg', 0.95)
  });
  if (!result || result.canceled) {
    setCropToolStatus('Save canceled.');
    return;
  }
  setCropToolStatus(`Saved ${result.filename || '8x10 crop'} at 2400 x 3000 / 300 DPI.`);
  const nextIndex = jobsState.cropTool.currentIndex + 1;
  if (jobsState.cropTool.outputFolder && nextIndex > 0 && nextIndex < jobsState.cropTool.files.length) {
    await loadCropToolFileAtIndex(nextIndex);
  }
}

async function handleTrecsMenuAction(action) {
  if (action === 'crop-tool') {
    setCropToolVisible(true);
    return;
  }

  if (action === 'new-school') {
    showJobsForAction();
    setNewSchoolFormVisible(!jobsState.showNewSchoolForm);
    return;
  }

  if (action === 'new-job') {
    showJobsForAction();
    setNewJobFormVisible(!jobsState.showNewJobForm);
    return;
  }

  if (action === 'import-previous-job') {
    showJobsForAction();
    setImportPreviousJobFormVisible(!jobsState.showImportPreviousJobForm);
    return;
  }

  if (action === 'load-onsite-setup') {
    await loadOnsiteSetup();
    return;
  }

  if (action === 'load-end-of-day') {
    await loadEndOfDayPackage();
    return;
  }

  if (action === 'student-field-setup') {
    await openStudentFieldSettings();
    return;
  }

  if (action === 'image-capture') {
    const jobId = selectedJobIdForAction();
    if (jobId) {
      await openCaptureLogin(jobId);
    }
    return;
  }

  if (action === 'envelope-entry') {
    await ensureSelectedJobWorkspace('envelope');
    return;
  }

  if (action === 'admin-items') {
    await ensureSelectedJobWorkspace('admin');
    return;
  }

  if (action === 'package-plan-editor') {
    if (jobsState.jobWorkspaceOpen) {
      closeJobWorkspace();
    }
    setView('products');
    return;
  }

  if (action === 'unit-render') {
    if (jobsState.jobWorkspaceOpen) {
      closeJobWorkspace();
    }
    setView('unitRender');
    return;
  }

  if (action === 'composite-builder') {
    if (jobsState.jobWorkspaceOpen) {
      closeJobWorkspace();
    }
    setView('composites');
    return;
  }

  if (action === 'student-list-builder') {
    if (jobsState.jobWorkspaceOpen) closeJobWorkspace();
    setView('studentLists');
    return;
  }

  if (action === 'event-workflow') {
    if (jobsState.jobWorkspaceOpen) closeJobWorkspace();
    setView('events');
    return;
  }

  if (action === 'online-order-import') {
    if (jobsState.jobWorkspaceOpen) closeJobWorkspace();
    setView('onlineOrders');
    return;
  }

  if (action === 'batch-render') {
    if (jobsState.jobWorkspaceOpen) closeJobWorkspace();
    setView('batchRender');
    return;
  }

  if (action === 'picture-day-prep') {
    await ensureSelectedJobWorkspace('pictureDay');
    return;
  }

  if (action === 'image-review') {
    await ensureSelectedJobWorkspace('imageReview');
    return;
  }

  if (action === 'add-records') {
    if (jobsState.jobWorkspaceOpen && jobsState.workspaceMode === 'capture' && jobsState.selectedJobId) {
      setAddRecordsModalVisible(true);
    } else {
      const jobId = await ensureSelectedJobWorkspace('students');
      if (jobId) {
        setAddRecordsModalVisible(true);
      }
    }
    return;
  }

  const jobId = selectedJobIdForAction();
  if (!jobId) {
    return;
  }

  if (action === 'import-school-data') {
    openSchoolDataImport(jobId);
  } else if (action === 'sync-cropped-images') {
    await performSyncCroppedImages(jobId);
  } else if (action === 'create-cropped-medium') {
    await performGenerateCroppedMedium(jobId);
  } else if (action === 'create-camera-cards') {
    await openCameraCardsModal(jobId);
  } else if (action === 'prepare-onsite-setup') {
    await performPrepareOnsiteSetup(jobId);
  } else if (action === 'make-end-of-day') {
    await openEndOfDayReview(jobId);
  }
}

function bindJobDetailActions() {
  if (!jobDetailPanel) {
    return;
  }
  const importSchoolDataButton = jobDetailPanel.querySelector('[data-import-school-data]');
  if (importSchoolDataButton) {
    importSchoolDataButton.addEventListener('click', () => {
      openSchoolDataImport(Number(importSchoolDataButton.dataset.importSchoolData));
    });
  }

  const button = jobDetailPanel.querySelector('[data-prepare-laptop-package]');
  if (button) {
    button.addEventListener('click', async () => {
      const originalText = button.textContent;
      button.disabled = true;
      button.textContent = 'Preparing...';
      try {
        await performPrepareOnsiteSetup(Number(button.dataset.prepareLaptopPackage));
      } finally {
        button.disabled = false;
        button.textContent = originalText;
      }
    });
  }

  const croppedSyncButton = jobDetailPanel.querySelector('[data-sync-cropped-images]');
  if (croppedSyncButton) {
    croppedSyncButton.addEventListener('click', async () => {
      const originalText = croppedSyncButton.textContent;
      croppedSyncButton.disabled = true;
      croppedSyncButton.textContent = 'Syncing...';
      try {
        await performSyncCroppedImages(Number(croppedSyncButton.dataset.syncCroppedImages));
      } finally {
        croppedSyncButton.disabled = false;
        croppedSyncButton.textContent = originalText;
      }
    });
  }

  const croppedMediumButton = jobDetailPanel.querySelector('[data-generate-cropped-medium]');
  if (croppedMediumButton) {
    croppedMediumButton.addEventListener('click', async () => {
      const originalText = croppedMediumButton.textContent;
      croppedMediumButton.disabled = true;
      croppedMediumButton.textContent = 'Creating...';
      try {
        await performGenerateCroppedMedium(Number(croppedMediumButton.dataset.generateCroppedMedium));
      } finally {
        croppedMediumButton.disabled = false;
        croppedMediumButton.textContent = originalText;
      }
    });
  }

  const endOfDayButton = jobDetailPanel.querySelector('[data-end-of-day-package]');
  if (!endOfDayButton) {
    return;
  }

  endOfDayButton.addEventListener('click', async () => {
    const jobId = Number(endOfDayButton.dataset.endOfDayPackage);
    const status = jobDetailPanel.querySelector('[data-end-of-day-status]');
    const originalText = endOfDayButton.textContent;

    try {
      endOfDayButton.disabled = true;
      endOfDayButton.textContent = 'Reviewing...';
      await openEndOfDayReview(jobId);
    } catch (error) {
      jobsState.lastEndOfDayPackage = {
        jobId,
        status: 'error',
        message: error.message || 'End of day review failed'
      };
      if (status) {
        status.textContent = renderEndOfDayStatus(jobId);
      }
      console.error(error);
    } finally {
      endOfDayButton.disabled = false;
      endOfDayButton.textContent = originalText;
    }
  });
}

function renderWorkflowTab() {
  jobWorkflowTabs.querySelectorAll('button').forEach((button) => {
    button.classList.toggle('active', button.dataset.jobTab === jobsState.selectedTab);
  });

  if (!jobsState.detail) {
    jobWorkflowContent.innerHTML = '<div class="empty-state">Loading job workflow data...</div>';
    return;
  }

  if (jobsState.selectedTab === 'subjects') {
    renderSubjectsTab(jobsState.detail.subjects);
  } else if (jobsState.selectedTab === 'orders') {
    renderOrdersTab(jobsState.detail.orders);
  } else if (jobsState.selectedTab === 'capture') {
    renderCaptureTab(jobsState.detail.capture);
  } else if (jobsState.selectedTab === 'images') {
    renderImagesTab(jobsState.detail.images);
  } else {
    jobWorkflowContent.innerHTML = '<div class="empty-state">Choose a workflow tab.</div>';
  }
}

function tableHtml(headers, rows, emptyText) {
  if (!rows.length) {
    return `<div class="empty-state">${emptyText}</div>`;
  }

  return `
    <table>
      <thead>
        <tr>${headers.map((header) => `<th>${header}</th>`).join('')}</tr>
      </thead>
      <tbody>${rows.join('')}</tbody>
    </table>
  `;
}

function findById(rows, id) {
  return rows.find((row) => row.id === id) || null;
}

function rowsFor(rows, field, id) {
  return rows.filter((row) => row[field] === id);
}

function textIncludes(row, fields, search) {
  const term = String(search || '').trim().toLowerCase();
  if (!term) {
    return true;
  }

  return fields.some((field) => String(row[field] || '').toLowerCase().includes(term));
}

function formatMoney(value) {
  if (value === null || value === undefined || value === '') {
    return '';
  }

  return `$${Number(value).toFixed(2)}`;
}

function formatStatusLabel(status) {
  return String(status || '')
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderSubjectsTab(subjects) {
  if (!subjects.length) {
    jobWorkflowContent.innerHTML = '<div class="empty-state">No subjects found.</div>';
    return;
  }

  const filteredSubjects = subjects.filter((subject) => textIncludes(
    subject,
    ['ref', 'name', 'externalId', 'grade', 'homeroom', 'track', 'team', 'photographedStatus'],
    jobsState.subjectSearch
  ));

  if (!filteredSubjects.length) {
    jobsState.selectedSubjectId = null;
  } else if (!jobsState.selectedSubjectId || !filteredSubjects.some((subject) => subject.id === jobsState.selectedSubjectId)) {
    jobsState.selectedSubjectId = filteredSubjects[0].id;
  }

  const selectedSubject = findById(subjects, jobsState.selectedSubjectId);
  jobWorkflowContent.innerHTML = `
    <div class="queue-toolbar">
      <label class="inline-search">
        <span>Subject Search</span>
        <input data-subject-search type="search" value="${escapeHtml(jobsState.subjectSearch)}" placeholder="Ref, name, ID, grade, homeroom">
      </label>
      <span>${formatNumber(filteredSubjects.length)} shown</span>
    </div>
    <div class="detail-browser">
      <div class="detail-list">
        ${tableHtml(
          ['Ref', 'Name', 'ID', 'Grade', 'Homeroom', 'Image'],
          filteredSubjects.map((subject) => `
            <tr class="${subject.id === jobsState.selectedSubjectId ? 'selected-row' : ''}" data-subject-id="${subject.id}">
              <td>${subject.ref || ''}</td>
              <td>${subject.name || ''}</td>
              <td>${subject.externalId || ''}</td>
              <td>${subject.grade || ''}</td>
              <td>${subject.homeroom || ''}</td>
              <td>${subject.imagePath ? 'Linked' : ''}</td>
            </tr>
          `),
          'No subjects found.'
        )}
      </div>
      <aside class="record-detail">
        ${renderSubjectDetail(selectedSubject)}
      </aside>
    </div>
  `;

  const subjectSearch = jobWorkflowContent.querySelector('[data-subject-search]');
  subjectSearch.addEventListener('input', () => {
    jobsState.subjectSearch = subjectSearch.value;
    renderSubjectsTab(subjects);
  });

  jobWorkflowContent.querySelectorAll('[data-subject-id]').forEach((row) => {
    row.addEventListener('click', () => {
      jobsState.selectedSubjectId = Number(row.dataset.subjectId);
      renderSubjectsTab(subjects);
    });
  });

  const imageButton = jobWorkflowContent.querySelector('[data-open-subject-image]');
  if (imageButton) {
    imageButton.addEventListener('click', () => {
      jobsState.selectedTab = 'images';
      jobsState.selectedImageId = Number(imageButton.dataset.openSubjectImage);
      renderWorkflowTab();
    });
  }

  bindNoteForms();
  bindImageLinkActions();
  bindLinkedImageCards(jobWorkflowContent);
  bindHoverImagePreviews(jobWorkflowContent);
}

function renderOrdersTab(orders) {
  if (!orders.length) {
    jobWorkflowContent.innerHTML = '<div class="empty-state">No orders found.</div>';
    return;
  }

  const filteredOrders = filteredOrdersForQueue(orders);
  if (!filteredOrders.length) {
    jobsState.selectedOrderId = null;
  } else if (!jobsState.selectedOrderId || !filteredOrders.some((order) => order.id === jobsState.selectedOrderId)) {
    jobsState.selectedOrderId = filteredOrders[0].id;
  }

  const selectedOrder = findById(orders, jobsState.selectedOrderId);
  jobWorkflowContent.innerHTML = `
    <div class="queue-toolbar">
      <div class="segmented compact" id="orderRenderFilters">
        ${renderOrderQueueFilters(orders)}
      </div>
      <span>${formatNumber(filteredOrders.length)} shown</span>
    </div>
    <div class="detail-browser">
      <div class="detail-list">
        ${tableHtml(
          ['Order', 'Source', 'Reference', 'Subject', 'Paid', 'Production', 'Items', 'Codes'],
          filteredOrders.map((order) => `
            <tr class="${order.id === jobsState.selectedOrderId ? 'selected-row' : ''}" data-order-id="${order.id}">
              <td>${order.id}</td>
              <td>${order.source}</td>
              <td>${order.sourceReference || ''}</td>
              <td>${order.ref || ''} ${order.subjectName || ''}</td>
              <td>${order.paidStatus}</td>
              <td><span class="status ${statusClass(order.productionStatus)}">${formatStatusLabel(order.productionStatus)}</span></td>
              <td>${formatNumber(order.itemCount)}</td>
              <td>${order.packageCodes || ''}</td>
            </tr>
          `),
          'No orders match this queue filter.'
        )}
      </div>
      <aside class="record-detail wide">
        ${renderOrderDetail(selectedOrder)}
      </aside>
    </div>
  `;

  jobWorkflowContent.querySelectorAll('[data-order-render-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      jobsState.orderRenderFilter = button.dataset.orderRenderFilter;
      jobsState.selectedOrderId = null;
      renderOrdersTab(orders);
    });
  });

  jobWorkflowContent.querySelectorAll('[data-order-id]').forEach((row) => {
    row.addEventListener('click', () => {
      jobsState.selectedOrderId = Number(row.dataset.orderId);
      renderOrdersTab(orders);
    });
  });

  const subjectButton = jobWorkflowContent.querySelector('[data-open-order-subject]');
  if (subjectButton) {
    subjectButton.addEventListener('click', () => {
      jobsState.selectedTab = 'subjects';
      jobsState.selectedSubjectId = Number(subjectButton.dataset.openOrderSubject);
      renderWorkflowTab();
    });
  }

  jobWorkflowContent.querySelectorAll('[data-open-order-image]').forEach((button) => {
    button.addEventListener('click', () => {
      jobsState.selectedTab = 'images';
      jobsState.selectedImageId = Number(button.dataset.openOrderImage);
      renderWorkflowTab();
    });
  });

  bindNoteForms();
  bindOrderStatusActions();
  bindHoverImagePreviews(jobWorkflowContent);
}

function filteredOrdersForQueue(orders) {
  if (jobsState.orderRenderFilter === 'all') {
    return orders;
  }

  return orders.filter((order) => order.productionStatus === jobsState.orderRenderFilter);
}

function renderOrderQueueFilters(orders) {
  const filters = [
    { status: 'all', label: 'All', count: orders.length },
    ...['ready', 'not_ready', 'queued', 'rendered', 'held', 'failed'].map((status) => ({
      status,
      label: formatStatusLabel(status),
      count: orders.filter((order) => order.productionStatus === status).length
    }))
  ];

  return filters
    .map((filter) => `
      <button class="${jobsState.orderRenderFilter === filter.status ? 'active' : ''}" data-order-render-filter="${filter.status}">
        ${filter.label} <span>${filter.count}</span>
      </button>
    `)
    .join('');
}

function statusClass(status) {
  if (status === 'ready' || status === 'rendered') {
    return 'ready';
  }
  if (status === 'failed') {
    return 'error';
  }
  return 'review';
}

function renderSubjectDetail(subject) {
  if (!subject) {
    return '<div class="empty-state">Select a subject.</div>';
  }

  const codes = rowsFor(jobsState.detail.subjectCodes || [], 'subjectId', subject.id);
  const orders = rowsFor(jobsState.detail.subjectOrders || [], 'subjectId', subject.id);
  const images = rowsFor(jobsState.detail.subjectImages || [], 'subjectId', subject.id);

  return `
    <div class="record-heading">
      <div>
        <span>Subject</span>
        <strong>${subject.name || 'Unnamed subject'}</strong>
      </div>
      <span class="status ${subject.imageAssetId ? 'ready' : 'review'}">${subject.imageAssetId ? 'Photo linked' : 'No photo'}</span>
    </div>
    <dl class="compact-dl">
      <div>
        <dt>Reference</dt>
        <dd>${subject.ref || ''}</dd>
      </div>
      <div>
        <dt>Student ID</dt>
        <dd>${subject.externalId || ''}</dd>
      </div>
      <div>
        <dt>Grade / Homeroom</dt>
        <dd>${subject.grade || ''}${subject.homeroom ? ` / ${subject.homeroom}` : ''}</dd>
      </div>
      <div>
        <dt>Track / Team</dt>
        <dd>${subject.track || ''}${subject.team ? ` / ${subject.team}` : ''}</dd>
      </div>
      <div>
        <dt>Primary Image</dt>
        <dd>${subject.imageFilename || ''}</dd>
      </div>
    </dl>
    <form class="notes-form" data-note-form="subject" data-note-id="${subject.id}">
      <label>
        <span>Notes</span>
        <textarea name="notes" rows="5">${escapeHtml(subject.notes)}</textarea>
      </label>
      <div class="form-actions">
        <span data-note-status></span>
        <button type="submit">Save Notes</button>
      </div>
    </form>
    ${subject.imageAssetId ? `<button class="detail-action" data-open-subject-image="${subject.imageAssetId}" data-hover-image-id="${subject.imageAssetId}">Open Image</button>` : ''}
    ${renderMiniSection(
      'Codes',
      codes.map((code) => `<div><span>${code.codeType}</span><strong>${code.code}</strong></div>`),
      'No codes.'
    )}
    ${renderMiniSection(
      'Orders',
      orders.map((order) => `<div><span>#${order.id} ${order.source}</span><strong>${order.packageCodes || ''}</strong></div>`),
      'No orders.'
    )}
    ${renderMiniSection(
      'Linked Images',
      images.map((image) => renderLinkedImageCard(image, { subjectId: subject.id, mode: 'detail' })),
      'No linked images.'
    )}
  `;
}

function renderOrderDetail(order) {
  if (!order) {
    return '<div class="empty-state">Select an order.</div>';
  }

  const items = rowsFor(jobsState.detail.orderItems || [], 'orderId', order.id);
  const payments = rowsFor(jobsState.detail.payments || [], 'orderId', order.id);

  return `
    <div class="record-heading">
      <div>
        <span>Order</span>
        <strong>#${order.id} ${order.sourceReference || ''}</strong>
      </div>
      <span class="status ${order.renderStatus === 'rendered' ? 'ready' : 'review'}">${order.renderStatus}</span>
    </div>
    <dl class="compact-dl">
      <div>
        <dt>Subject</dt>
        <dd>${order.ref || ''} ${order.subjectName || ''}</dd>
      </div>
      <div>
        <dt>Source / Timing</dt>
        <dd>${order.source || ''}${order.entryTiming ? ` / ${order.entryTiming}` : ''}</dd>
      </div>
      <div>
        <dt>Status</dt>
        <dd>${order.status || ''} / ${formatStatusLabel(order.productionStatus)}</dd>
      </div>
      <div>
        <dt>Paid</dt>
        <dd>${order.paidStatus || ''}</dd>
      </div>
      <div>
        <dt>Production Reason</dt>
        <dd>${order.productionReason || ''}</dd>
      </div>
      <div>
        <dt>Family Key</dt>
        <dd>${order.familyKey || ''}</dd>
      </div>
    </dl>
    <div class="record-actions" data-order-status-actions="${order.id}">
      <button data-order-status="queued">Queue</button>
      <button data-order-status="held">Hold</button>
      <button data-order-status="rendered">Rendered</button>
      <button data-order-status="not_ready">Reset</button>
      <span data-order-status-message></span>
    </div>
    <form class="notes-form" data-note-form="order" data-note-id="${order.id}">
      <label>
        <span>Notes</span>
        <textarea name="notes" rows="5">${escapeHtml(order.notes)}</textarea>
      </label>
      <div class="form-actions">
        <span data-note-status></span>
        <button type="submit">Save Notes</button>
      </div>
    </form>
    ${order.subjectId ? `<button class="detail-action" data-open-order-subject="${order.subjectId}">Open Subject</button>` : ''}
    <div class="mini-table">
      <div class="subheading">
        <h3>Items</h3>
        <span>${formatNumber(items.length)}</span>
      </div>
      ${tableHtml(
        ['Code', 'Product', 'Qty', 'Image'],
        items.map((item) => `
          <tr>
            <td>${item.packageCode || item.rawCode || ''}</td>
            <td>${item.productName || ''}</td>
            <td>${formatNumber(item.quantity)}</td>
            <td>${item.imageAssetId ? `<button data-open-order-image="${item.imageAssetId}" data-hover-image-id="${item.imageAssetId}">${item.imageFilename}</button>` : ''}</td>
          </tr>
        `),
        'No order items.'
      )}
    </div>
    ${renderMiniSection(
      'Payments',
      payments.map((payment) => `<div><span>${payment.method || 'Payment'} ${payment.status}</span><strong>${formatMoney(payment.amount)} ${payment.reference || ''}</strong></div>`),
      'No payments.'
    )}
  `;
}

function bindNoteForms(root = jobWorkflowContent) {
  root.querySelectorAll('[data-note-form]').forEach((form) => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const id = Number(form.dataset.noteId);
      const type = form.dataset.noteForm;
      const textarea = form.querySelector('textarea[name="notes"]');
      const button = form.querySelector('button[type="submit"]');
      const status = form.querySelector('[data-note-status]');
      const notes = textarea.value;

      button.disabled = true;
      status.textContent = 'Saving...';

      try {
        if (type === 'subject') {
          const result = await trecsApi('updateSubjectNotes').updateSubjectNotes(id, notes);
          const subject = findById(jobsState.detail.subjects, result.id);
          if (subject) {
            subject.notes = result.notes;
          }
          status.textContent = 'Saved';
        } else if (type === 'order') {
          const result = await trecsApi('updateOrderNotes').updateOrderNotes(id, notes);
          const order = findById(jobsState.detail.orders, result.id);
          if (order) {
            order.notes = result.notes;
          }
          status.textContent = 'Saved';
        }
      } catch (error) {
        status.textContent = 'Save failed';
        console.error(error);
      } finally {
        button.disabled = false;
      }
    });
  });
}

function bindOrderStatusActions() {
  jobWorkflowContent.querySelectorAll('[data-order-status-actions]').forEach((container) => {
    const orderId = Number(container.dataset.orderStatusActions);
    const message = container.querySelector('[data-order-status-message]');

    container.querySelectorAll('[data-order-status]').forEach((button) => {
      button.addEventListener('click', async () => {
        const originalText = button.textContent;
        button.disabled = true;
        button.textContent = 'Saving...';
        message.textContent = '';

        try {
          const result = await trecsApi('updateOrderRenderStatus').updateOrderRenderStatus(orderId, button.dataset.orderStatus);
          jobsState.selectedOrderId = result.id;
          await reloadCurrentJobDetail();
        } catch (error) {
          message.textContent = error.message || 'Update failed';
          console.error(error);
        } finally {
          button.disabled = false;
          button.textContent = originalText;
        }
      });
    });
  });
}

function bindImageLinkActions() {
  jobWorkflowContent.querySelectorAll('[data-link-subject-id][data-link-image-id]').forEach((button) => {
    button.addEventListener('click', async () => {
      await saveSubjectImageLink(
        Number(button.dataset.linkSubjectId),
        Number(button.dataset.linkImageId),
        button
      );
    });
  });
}

async function saveSubjectImageLink(subjectId, imageId, control) {
  if (!subjectId || !imageId) {
    return;
  }

  const originalText = control ? control.textContent : '';
  if (control) {
    control.disabled = true;
    control.textContent = 'Saving...';
  }

  try {
    const result = await trecsApi('linkSubjectImage').linkSubjectImage(subjectId, imageId);
    jobsState.selectedSubjectId = result.subjectId;
    jobsState.selectedImageId = result.imageId;
    jobsState.imagePreviewCache.delete(result.imageId);
    await reloadCurrentJobDetail();
  } catch (error) {
    if (control) {
      control.textContent = 'Failed';
    }
    console.error(error);
  } finally {
    if (control) {
      control.disabled = false;
      if (control.textContent === 'Saving...') {
        control.textContent = originalText;
      }
    }
  }
}

async function setLinkedImageRejected(imageId, rejected, control) {
  if (!imageId) {
    return;
  }
  hideImageHoverPreview();
  const originalText = control ? control.textContent : '';
  if (control) {
    control.disabled = true;
    control.textContent = rejected ? 'Rejecting...' : 'Restoring...';
  }

  try {
    await trecsApi('setImageRejected').setImageRejected(imageId, rejected, rejected ? 'Rejected during linked image review' : null);
    jobsState.imagePreviewCache.delete(imageId);
    await reloadCurrentJobDetail();
  } catch (error) {
    if (control) {
      control.textContent = 'Failed';
    }
    console.error(error);
  } finally {
    if (control) {
      control.disabled = false;
      if (control.textContent === 'Rejecting...' || control.textContent === 'Restoring...') {
        control.textContent = originalText;
      }
    }
  }
}

async function unlinkLinkedImage(subjectId, imageId, control) {
  if (!subjectId || !imageId) {
    return;
  }
  hideImageHoverPreview();
  const image = linkedImagesForSubject(subjectId).find((item) => Number(item.imageAssetId) === Number(imageId));
  const label = image && image.filename ? image.filename : `image #${imageId}`;
  if (!confirm(`Unlink ${label} from this student? If this image has no other student links, the reference prefix will be removed from the filename.`)) {
    return;
  }

  const originalText = control ? control.textContent : '';
  if (control) {
    control.disabled = true;
    control.textContent = 'Unlinking...';
  }

  try {
    await trecsApi('unlinkSubjectImage').unlinkSubjectImage(subjectId, imageId);
    jobsState.imagePreviewCache.delete(imageId);
    if (Number(jobsState.lightboxImageId) === Number(imageId)) {
      closeImageLightbox();
    }
    await reloadCurrentJobDetail();
  } catch (error) {
    if (control) {
      control.textContent = 'Failed';
    }
    console.error(error);
  } finally {
    if (control) {
      control.disabled = false;
      if (control.textContent === 'Unlinking...') {
        control.textContent = originalText;
      }
    }
  }
}

function renderMiniSection(label, rows, emptyText) {
  return `
    <section class="mini-section">
      <div class="subheading">
        <h3>${label}</h3>
        <span>${formatNumber(rows.length)}</span>
      </div>
      <div class="mini-list">
        ${rows.length ? rows.join('') : `<p>${emptyText}</p>`}
      </div>
    </section>
  `;
}

function renderImagesTab(images) {
  if (!images.length) {
    jobWorkflowContent.innerHTML = '<div class="empty-state">No images found.</div>';
    return;
  }

  const filteredImages = images.filter((image) => textIncludes(
    image,
    ['filename', 'source', 'status', 'versionTypes'],
    jobsState.imageSearch
  ));

  if (!filteredImages.length) {
    jobsState.selectedImageId = null;
  } else if (!jobsState.selectedImageId || !filteredImages.some((image) => image.id === jobsState.selectedImageId)) {
    jobsState.selectedImageId = filteredImages[0].id;
  }
  if (!jobsState.selectedImageSubjectId && jobsState.selectedSubjectId) {
    jobsState.selectedImageSubjectId = jobsState.selectedSubjectId;
  }
  if (!jobsState.selectedImageSubjectId && jobsState.detail.subjects.length) {
    jobsState.selectedImageSubjectId = jobsState.detail.subjects[0].id;
  }

  jobWorkflowContent.innerHTML = `
    <div class="queue-toolbar">
      <label class="inline-search">
        <span>Image Search</span>
        <input data-image-search type="search" value="${escapeHtml(jobsState.imageSearch)}" placeholder="Filename, source, status">
      </label>
      <span>${formatNumber(filteredImages.length)} shown</span>
    </div>
    <div class="image-browser">
      <div class="image-table">
        ${tableHtml(
          ['Filename', 'Source', 'Versions', 'Size', 'Types', 'Subjects'],
          filteredImages.map((image) => `
            <tr class="${image.id === jobsState.selectedImageId ? 'selected-row' : ''}" data-image-id="${image.id}" data-hover-image-id="${image.id}">
              <td>${image.filename}</td>
              <td>${image.source}</td>
              <td>${formatNumber(image.versions)}</td>
              <td>${image.width || 0} x ${image.height || 0}</td>
              <td>${image.versionTypes || ''}</td>
              <td>${formatNumber(image.linkedSubjects)}</td>
            </tr>
          `),
          'No images found.'
        )}
      </div>
      <aside class="image-preview" id="imagePreviewPanel">
        <div class="empty-state">Loading preview...</div>
      </aside>
    </div>
  `;

  const imageSearch = jobWorkflowContent.querySelector('[data-image-search]');
  imageSearch.addEventListener('input', () => {
    jobsState.imageSearch = imageSearch.value;
    renderImagesTab(images);
  });

  jobWorkflowContent.querySelectorAll('[data-image-id]').forEach((row) => {
    row.addEventListener('click', () => {
      jobsState.selectedImageId = Number(row.dataset.imageId);
      renderImagesTab(images);
    });
  });

  bindHoverImagePreviews(jobWorkflowContent);
  loadImagePreview(jobsState.selectedImageId);
}

function renderCaptureTab(capture) {
  if (!capture || !capture.summary) {
    jobWorkflowContent.innerHTML = '<div class="empty-state">No capture planning data found.</div>';
    return;
  }

  const recentImages = capture.recentImages || [];
  const reviewCandidates = capture.reviewCandidates || [];
  if (!jobsState.selectedImageId || !recentImages.some((image) => image.id === jobsState.selectedImageId)) {
    jobsState.selectedImageId = recentImages.length ? recentImages[0].id : null;
  }

  const summary = capture.summary;
  const photographedPercent = summary.subjects > 0
    ? Math.round((summary.linkedSubjects / summary.subjects) * 100)
    : 0;

  jobWorkflowContent.innerHTML = `
    <div class="capture-planner">
      <section class="capture-metrics" aria-label="Capture planning metrics">
        <article>
          <span>No Photo</span>
          <strong>${formatNumber(summary.noPhotoSubjects)}</strong>
        </article>
        <article>
          <span>Photographed</span>
          <strong>${photographedPercent}%</strong>
        </article>
        <article>
          <span>Images</span>
          <strong>${formatNumber(summary.images)}</strong>
        </article>
        <article>
          <span>Unlinked</span>
          <strong>${formatNumber(summary.unlinkedImages)}</strong>
        </article>
        <article>
          <span>Ordered / No Photo</span>
          <strong>${formatNumber(summary.orderedNoPhotoSubjects)}</strong>
        </article>
      </section>

      <section class="capture-grid">
        <div class="capture-column">
          <div class="subheading">
            <h3>No-Photo Queue</h3>
            <span>${formatNumber(capture.noPhotoSubjects.length)} shown</span>
          </div>
          ${tableHtml(
            ['Ref', 'Name', 'Grade', 'Homeroom', 'Orders'],
            capture.noPhotoSubjects.map((subject) => `
              <tr>
                <td>${subject.ref || ''}</td>
                <td>${subject.name || ''}</td>
                <td>${subject.grade || ''}</td>
                <td>${subject.homeroom || ''}</td>
                <td>${formatNumber(subject.orders)}</td>
              </tr>
            `),
            'Every subject in this job has a primary image.'
          )}
        </div>

        <div class="capture-column">
          <div class="subheading">
            <h3>Recent Images</h3>
            <span>${formatNumber(recentImages.length)} shown</span>
          </div>
          ${tableHtml(
            ['Filename', 'Size', 'Links', 'Refs'],
            recentImages.map((image) => `
              <tr class="${image.id === jobsState.selectedImageId ? 'selected-row' : ''}" data-capture-image-id="${image.id}" data-hover-image-id="${image.id}">
                <td>${image.filename}</td>
                <td>${image.width || 0} x ${image.height || 0}</td>
                <td>${formatNumber(image.linkedSubjects)}</td>
                <td>${image.refs || ''}</td>
              </tr>
            `),
            'No recent images found.'
          )}
        </div>

        <aside class="capture-preview" id="imagePreviewPanel">
          <div class="subheading">
            <h3>Selected Image</h3>
            <span>Read-only</span>
          </div>
          <div class="empty-state">Loading preview...</div>
        </aside>
      </section>

      <section class="capture-review">
        <div class="subheading">
          <h3>Unlinked / Review Images</h3>
          <span>${formatNumber(reviewCandidates.length)} shown</span>
        </div>
        ${tableHtml(
          ['Filename', 'Reason', 'Source', 'Size', 'Links'],
          reviewCandidates.map((image) => `
            <tr data-capture-image-id="${image.id}" data-hover-image-id="${image.id}">
              <td>${image.filename}</td>
              <td>${image.reason}</td>
              <td>${image.source}</td>
              <td>${image.width || 0} x ${image.height || 0}</td>
              <td>${formatNumber(image.linkedSubjects)}</td>
            </tr>
          `),
          'No image review candidates found.'
        )}
      </section>
    </div>
  `;

  jobWorkflowContent.querySelectorAll('[data-capture-image-id]').forEach((row) => {
    row.addEventListener('click', () => {
      jobsState.selectedImageId = Number(row.dataset.captureImageId);
      renderCaptureTab(capture);
    });
  });

  bindHoverImagePreviews(jobWorkflowContent);
  loadImagePreview(jobsState.selectedImageId);
}

async function renderProductsPage() {
  productsPageContent.innerHTML = '<div class="empty-state">Loading package-plan editor...</div>';
  try {
    const requestedPlanId = jobsState.packageEditorPlanId || null;
    jobsState.packageEditor = await trecsApi('getPackageEditorData').getPackageEditorData(requestedPlanId);
    jobsState.packageEditorPlanId = jobsState.packageEditor.selectedPlanId;
    drawPackageEditor();
  } catch (error) {
    productsPageContent.innerHTML = `<div class="empty-state">${escapeHtml(error.message || 'Could not load package plans.')}</div>`;
  }
}

async function acquireUiJobLock(jobId, scope = 'job_write') {
  if (activeJobLockIds.has(Number(jobId))) return true;
  const result = await trecsApi('acquireJobSession').acquireJobSession(Number(jobId), scope);
  if (!result.acquired) {
    const owner = [result.conflict?.userName, result.conflict?.workstationName].filter(Boolean).join(' on ');
    window.alert(`${result.job.clientName} / ${result.job.name} is currently in use${owner ? ` by ${owner}` : ' on another workstation'}.\n\nTRECS will release an abandoned lock automatically after two minutes.`);
    return false;
  }
  activeJobLockIds.add(Number(jobId));
  return true;
}

async function releaseUiJobLocks(jobIds) {
  const ids = (Array.isArray(jobIds) ? jobIds : [jobIds]).map(Number).filter((id) => activeJobLockIds.has(id));
  if (!ids.length) return;
  ids.forEach((id) => activeJobLockIds.delete(id));
  await trecsApi('releaseJobSession').releaseJobSession(ids);
}

function studentDisplayName(subject) {
  return subject.displayName || [subject.firstName, subject.lastName].filter(Boolean).join(' ') || `Student ${subject.ref || subject.id}`;
}

function renderStudentListBuilder() {
  const setup = jobsState.studentListSetup;
  if (!setup) return;
  studentListJobSelect.innerHTML = setup.jobs.map((job) => `<option value="${job.id}" ${Number(job.id) === Number(setup.selectedJobId) ? 'selected' : ''}>${escapeHtml(job.clientName)} / ${escapeHtml(job.jobName)} (${formatNumber(job.subjects)})</option>`).join('');
  studentListCount.textContent = `${setup.lists.length} list${setup.lists.length === 1 ? '' : 's'}`;
  studentListsSaved.innerHTML = setup.lists.length ? setup.lists.map((list) => `<button type="button" data-list-id="${list.id}" class="${Number(list.id) === Number(jobsState.studentListId) ? 'active' : ''}"><strong>${escapeHtml(list.name)}</strong><span>${formatNumber(list.memberCount)} member${Number(list.memberCount) === 1 ? '' : 's'}</span></button>`).join('') : '<div class="empty-state">No lists yet. Select New List to begin.</div>';
  const memberSet = new Set(jobsState.studentListMemberIds.map(Number));
  const search = studentListSearch.value.trim().toLowerCase();
  const available = setup.subjects.filter((subject) => !memberSet.has(Number(subject.id))).filter((subject) => !search || [studentDisplayName(subject), subject.ref, subject.externalId, subject.grade, subject.homeroom].some((value) => String(value || '').toLowerCase().includes(search)));
  studentListAvailable.innerHTML = available.length ? available.map((subject) => `<label class="student-picker-row"><input type="checkbox" data-available-subject="${subject.id}" ${jobsState.studentListCheckedIds.has(Number(subject.id)) ? 'checked' : ''}><span><strong>${escapeHtml(studentDisplayName(subject))}</strong><small>Ref ${escapeHtml(subject.ref || '—')} · ${escapeHtml(subject.grade || 'No grade')} · ${escapeHtml(subject.homeroom || 'No homeroom')}</small></span><small>${subject.hasPhoto ? 'Photo' : ''}</small></label>`).join('') : '<div class="empty-state">No available students match.</div>';
  const byId = new Map(setup.subjects.map((subject) => [Number(subject.id), subject]));
  studentListMembers.innerHTML = jobsState.studentListMemberIds.length ? jobsState.studentListMemberIds.map((id, index) => {
    const subject = byId.get(Number(id)); if (!subject) return '';
    return `<div class="student-picker-row"><span>${index + 1}</span><span><strong>${escapeHtml(studentDisplayName(subject))}</strong><small>Ref ${escapeHtml(subject.ref || '—')} · ${escapeHtml(subject.grade || 'No grade')} · ${escapeHtml(subject.homeroom || 'No homeroom')}</small></span><span class="member-actions"><button type="button" data-member-up="${id}" ${index === 0 ? 'disabled' : ''}>↑</button><button type="button" data-member-down="${id}" ${index === jobsState.studentListMemberIds.length - 1 ? 'disabled' : ''}>↓</button><button type="button" data-member-remove="${id}">×</button></span></div>`;
  }).join('') : '<div class="empty-state">Add students from the middle column.</div>';
  studentListMemberCount.textContent = `${jobsState.studentListMemberIds.length} member${jobsState.studentListMemberIds.length === 1 ? '' : 's'}`;
  deleteStudentListButton.disabled = !jobsState.studentListId;
}

async function loadStudentListSetup(jobId = null, listId = null) {
  const setup = await trecsApi('getStudentListSetup').getStudentListSetup(jobId, listId);
  jobsState.studentListSetup = setup;
  jobsState.studentListId = setup.selectedList?.id || null;
  jobsState.studentListMemberIds = setup.selectedList?.memberIds || [];
  jobsState.studentListCheckedIds.clear();
  studentListName.value = setup.selectedList?.name || '';
  studentListStatus.textContent = setup.selectedList ? `Editing ${setup.selectedList.name}.` : 'Select New List to begin.';
  renderStudentListBuilder();
}

function startNewStudentList() {
  jobsState.studentListId = null; jobsState.studentListMemberIds = []; jobsState.studentListCheckedIds.clear(); studentListName.value = ''; studentListStatus.textContent = 'New list. Add students, enter a name, and save.'; renderStudentListBuilder(); studentListName.focus();
}

function addCheckedStudentsToList() {
  jobsState.studentListMemberIds.push(...Array.from(jobsState.studentListCheckedIds).filter((id) => !jobsState.studentListMemberIds.includes(id)));
  jobsState.studentListCheckedIds.clear(); renderStudentListBuilder();
}

function moveStudentListMember(id, direction) {
  const index = jobsState.studentListMemberIds.indexOf(Number(id)); const next = index + direction;
  if (index < 0 || next < 0 || next >= jobsState.studentListMemberIds.length) return;
  [jobsState.studentListMemberIds[index], jobsState.studentListMemberIds[next]] = [jobsState.studentListMemberIds[next], jobsState.studentListMemberIds[index]]; renderStudentListBuilder();
}

async function saveCurrentStudentList() {
  const jobId = Number(jobsState.studentListSetup?.selectedJobId); if (!jobId) return;
  if (!(await acquireUiJobLock(jobId))) return;
  saveStudentListButton.disabled = true;
  try {
    const result = await trecsApi('saveStudentList').saveStudentList({ id: jobsState.studentListId, jobId, name: studentListName.value, memberIds: jobsState.studentListMemberIds });
    await loadStudentListSetup(jobId, result.id); studentListStatus.textContent = `Saved ${result.name} with ${result.memberCount} members.`;
  } catch (error) { studentListStatus.textContent = error.message || 'Could not save list.'; } finally { saveStudentListButton.disabled = false; }
}

async function deleteCurrentStudentList() {
  if (!jobsState.studentListId || !window.confirm(`Delete “${studentListName.value}”?`)) return;
  const jobId = Number(jobsState.studentListSetup.selectedJobId); if (!(await acquireUiJobLock(jobId))) return;
  await trecsApi('deleteStudentList').deleteStudentList(jobsState.studentListId); await loadStudentListSetup(jobId); studentListStatus.textContent = 'List deleted.';
}

async function loadOnlineOrderJobs() {
  const setup = await trecsApi('getStudentListSetup').getStudentListSetup(onlineOrderJobSelect.value || null, null);
  onlineOrderJobSelect.innerHTML = setup.jobs.map((job) => `<option value="${job.id}" ${Number(job.id) === Number(setup.selectedJobId) ? 'selected' : ''}>${escapeHtml(job.clientName)} / ${escapeHtml(job.jobName)}</option>`).join('');
}

function renderOnlineOrderPreview() {
  const preview = jobsState.onlineOrderPreview;
  if (!preview) { onlineOrderMapping.innerHTML = ''; onlineOrderPreviewBody.innerHTML = ''; importOnlineOrdersButton.disabled = true; return; }
  onlineOrderFileName.textContent = preview.fileName;
  onlineOrderMapping.innerHTML = preview.fields.map((field) => `<label><span>${escapeHtml(field.label)}${field.required ? ' *' : ''}</span><select data-online-field="${field.key}"><option value="">Not mapped</option>${preview.columns.map((column) => `<option value="${column.index}" ${Number(preview.mapping[field.key]) === Number(column.index) && preview.mapping[field.key] !== undefined ? 'selected' : ''}>${escapeHtml(column.name)}</option>`).join('')}</select></label>`).join('');
  onlineOrderSummary.innerHTML = `<div class="unit-render-metrics"><article><span>Rows</span><strong>${formatNumber(preview.totals.rows)}</strong></article><article><span>Ready</span><strong>${formatNumber(preview.totals.ready)}</strong></article><article><span>Need Review</span><strong>${formatNumber(preview.totals.problems)}</strong></article></div>`;
  onlineOrderPreviewBody.innerHTML = preview.rows.map((row) => `<tr><td>${row.rowNumber}</td><td>${escapeHtml(row.values.sourceReference || '—')}</td><td>${escapeHtml([row.values.firstName, row.values.lastName].filter(Boolean).join(' ') || row.values.subjectRef || row.values.externalId || '—')}</td><td>${row.subject ? `${escapeHtml([row.subject.firstName, row.subject.lastName].filter(Boolean).join(' '))}<br><small>Ref ${escapeHtml(row.subject.ref || '—')}</small>` : '—'}</td><td>${escapeHtml(row.values.packageCodes || '—')}</td><td><span class="import-status ${row.status}">${escapeHtml(row.message)}</span></td></tr>`).join('');
  importOnlineOrdersButton.disabled = preview.totals.ready < 1;
}

async function chooseOnlineOrderFile() {
  chooseOnlineOrderFileButton.disabled = true;
  try {
    const result = await trecsApi('chooseOnlineOrderFile').chooseOnlineOrderFile(Number(onlineOrderJobSelect.value));
    if (!result.canceled) { jobsState.onlineOrderPreview = result; renderOnlineOrderPreview(); onlineOrderStatus.textContent = `${result.totals.ready} of ${result.totals.rows} rows are ready.`; }
  } catch (error) { onlineOrderStatus.textContent = error.message || 'Could not read online orders.'; } finally { chooseOnlineOrderFileButton.disabled = false; }
}

async function refreshOnlineOrderPreviewFromMapping() {
  const current = jobsState.onlineOrderPreview; if (!current) return;
  const mapping = {}; onlineOrderMapping.querySelectorAll('[data-online-field]').forEach((select) => { if (select.value !== '') mapping[select.dataset.onlineField] = Number(select.value); });
  jobsState.onlineOrderPreview = await trecsApi('previewOnlineOrders').previewOnlineOrders({ jobId: Number(onlineOrderJobSelect.value), filePath: current.filePath, mapping }); renderOnlineOrderPreview();
}

async function importReadyOnlineOrders() {
  const preview = jobsState.onlineOrderPreview; if (!preview) return;
  const jobId = Number(onlineOrderJobSelect.value); if (!(await acquireUiJobLock(jobId))) return;
  const mapping = {}; onlineOrderMapping.querySelectorAll('[data-online-field]').forEach((select) => { if (select.value !== '') mapping[select.dataset.onlineField] = Number(select.value); });
  importOnlineOrdersButton.disabled = true;
  try { const result = await trecsApi('importOnlineOrders').importOnlineOrders({ jobId, filePath: preview.filePath, mapping }); onlineOrderStatus.textContent = `Imported ${result.inserted} new and updated ${result.updated} existing online orders; ${result.skipped} rows skipped.`; await refreshOnlineOrderPreviewFromMapping(); } catch (error) { onlineOrderStatus.textContent = error.message || 'Import failed.'; } finally { importOnlineOrdersButton.disabled = false; await releaseUiJobLocks(jobId); }
}

function renderBatchRenderSetup() {
  const setup = jobsState.batchRenderSetup; if (!setup) return;
  batchRenderJobs.innerHTML = setup.jobs.map((job) => `<label><input type="checkbox" name="jobIds" value="${job.id}" ${Number(job.readyOrders) > 0 ? '' : ''}><span><strong>${escapeHtml(job.clientName)} / ${escapeHtml(job.jobName)}</strong><small>${escapeHtml(job.packagePlan || 'No package plan')}</small></span><small>${formatNumber(job.readyOrders)} ready / ${formatNumber(job.paidOrders)} paid</small></label>`).join('');
  batchRenderHistory.innerHTML = setup.history.length ? setup.history.map((batch) => `<button type="button"><strong>${escapeHtml(batch.name)}</strong><span>${escapeHtml(formatType(batch.status))} · ${formatNumber(batch.completedJobs || 0)}/${formatNumber(batch.jobs || 0)} jobs · ${escapeHtml(formatShortDateTime(batch.createdAt))}</span><span>${escapeHtml(batch.outputPath || '')}</span></button>`).join('') : '<div class="empty-state">No batch renders have run yet.</div>';
}

async function loadBatchRenderSetup() { jobsState.batchRenderSetup = await trecsApi('getBatchRenderSetup').getBatchRenderSetup(); renderBatchRenderSetup(); }

async function browseBatchRenderOutput() { const result = await trecsApi('chooseBatchRenderOutputFolder').chooseBatchRenderOutputFolder(); if (!result.canceled) batchRenderForm.elements.outputFolder.value = result.folderPath; }

async function submitBatchRender(event) {
  event.preventDefault(); if (jobsState.batchRenderRunning) return;
  const jobIds = Array.from(batchRenderForm.querySelectorAll('input[name="jobIds"]:checked')).map((input) => Number(input.value));
  jobsState.batchRenderRunning = true; startBatchRenderButton.disabled = true; batchRenderStatus.textContent = 'Reserving jobs and starting batch...';
  try {
    const result = await trecsApi('runBatchRender').runBatchRender({ jobIds, name: batchRenderForm.elements.name.value, sortBy: batchRenderForm.elements.sortBy.value, outputFolder: batchRenderForm.elements.outputFolder.value, includeUnits: batchRenderForm.elements.includeUnits.checked, includeEnvelopes: batchRenderForm.elements.includeEnvelopes.checked, includeLabels: batchRenderForm.elements.includeLabels.checked });
    batchRenderStatus.textContent = `${result.name} finished: ${result.results.filter((item) => item.status === 'completed').length} completed, ${result.results.filter((item) => item.status === 'failed').length} failed.`; await loadBatchRenderSetup();
  } catch (error) { batchRenderStatus.textContent = error.message || 'Batch render failed.'; } finally { jobsState.batchRenderRunning = false; startBatchRenderButton.disabled = false; }
}

function eventStatusLabel(status) {
  return { unlinked: 'Unlinked', linked: 'Linked', coded: 'Order coded' }[status] || formatType(status || 'unlinked');
}

function eventStatusClass(status) {
  return status === 'coded' ? 'ready' : status === 'linked' ? 'review' : 'error';
}

function selectedEventCandidate() {
  return jobsState.eventCandidates.find((candidate) => Number(candidate.id) === Number(jobsState.eventSelectedCandidateId))
    || jobsState.eventSetup?.selectedEntry?.links?.find((link) => Number(link.subjectId) === Number(jobsState.eventSelectedCandidateId))
    || null;
}

async function loadEventImagePreview(imageAssetId, container, missingText) {
  if (!imageAssetId) { container.innerHTML = `<div class="empty-state">${escapeHtml(missingText)}</div>`; return; }
  container.innerHTML = '<div class="empty-state">Loading photo...</div>';
  try {
    const preview = await imagePreviewForId(Number(imageAssetId));
    container.innerHTML = preview?.dataUrl && !preview.missing ? `<img src="${preview.dataUrl}" alt="Photo preview">` : `<div class="empty-state">${escapeHtml(preview?.reason || missingText)}</div>`;
  } catch (error) { container.innerHTML = `<div class="empty-state">${escapeHtml(error.message || missingText)}</div>`; }
}

function renderEventJobSetup() {
  const setup = jobsState.eventSetup;
  eventJobSelect.innerHTML = setup?.eventJobs?.length ? setup.eventJobs.map((job) => `<option value="${job.id}" ${Number(job.id) === Number(setup.selectedEventJobId) ? 'selected' : ''}>${escapeHtml(job.clientName)} / ${escapeHtml(job.jobName)}</option>`).join('') : '<option value="">No event jobs yet</option>';
  eventFallJobSelect.innerHTML = setup?.fallJobs?.length ? `<option value="">Choose the matching fall job</option>${setup.fallJobs.map((job) => `<option value="${job.id}" ${Number(job.id) === Number(setup.linkedFallJobId) ? 'selected' : ''}>${escapeHtml(job.jobName)} · ${formatNumber(job.subjects)} students · ${formatNumber(job.photographed)} photos</option>`).join('')}` : '<option value="">No fall jobs for this school</option>';
  const empty = !setup?.selectedEventJobId;
  eventWorkflowEmpty.hidden = !empty; eventWorkflowLayout.hidden = empty;
  linkEventFallJobButton.disabled = empty || !setup.fallJobs.length;
  importEventImagesButton.disabled = empty;
  eventSetupStatus.textContent = empty ? 'Create an Event job to begin.' : setup.linkedFallJobId ? 'Fall student records linked. Ready for image matching.' : 'Choose and link the fall job before matching students.';
}

function filteredEventQueue() {
  const setup = jobsState.eventSetup; if (!setup) return [];
  const jump = eventImageNumberSearch.value.trim().toLowerCase();
  return setup.queue.filter((entry) => jobsState.eventQueueFilter === 'all' || entry.status === jobsState.eventQueueFilter)
    .filter((entry) => !jump || String(entry.imageNumber || '').toLowerCase().includes(jump) || String(entry.filename || '').toLowerCase().includes(jump));
}

function renderEventQueue() {
  const setup = jobsState.eventSetup; if (!setup) return;
  const queue = filteredEventQueue();
  eventQueueCount.textContent = `${queue.length} of ${setup.queue.length}`;
  eventImageQueue.innerHTML = queue.length ? queue.map((entry) => `<button class="event-image-card ${Number(entry.id) === Number(setup.selectedEntry?.id) ? 'active' : ''}" data-event-entry-id="${entry.id}" type="button"><span><strong>Image ${escapeHtml(entry.imageNumber)}</strong><small>${escapeHtml(entry.linkedNames || entry.filename)}</small></span><span class="status ${eventStatusClass(entry.status)}">${escapeHtml(eventStatusLabel(entry.status))}</span></button>`).join('') : '<div class="empty-state">No event images match this filter.</div>';
}

function renderEventExistingLinks() {
  const links = jobsState.eventSetup?.selectedEntry?.links || [];
  eventExistingLinks.innerHTML = links.length ? links.map((link) => `<div class="event-link-chip"><strong>${escapeHtml([link.firstName, link.lastName].filter(Boolean).join(' ') || `Ref ${link.ref}`)}</strong><span>${escapeHtml([link.ref ? `Ref ${link.ref}` : '', link.packageCodes ? `Order ${link.packageCodes}` : 'Linked only'].filter(Boolean).join(' · '))}</span><button data-remove-event-link="${link.id}" type="button" title="Remove this match">×</button></div>`).join('') : '<span class="tool-status">No fall students linked yet.</span>';
}

function renderEventSelectedCandidate() {
  const candidate = selectedEventCandidate();
  if (!candidate) {
    eventSelectedStudent.innerHTML = '<span>No fall student selected.</span>';
    eventFallPreview.innerHTML = '<div class="empty-state">Select a fall student result.</div>';
    eventOrderForm.elements.confirmed.checked = false;
    return;
  }
  const name = candidate.name || [candidate.firstName, candidate.lastName].filter(Boolean).join(' ') || `Ref ${candidate.ref}`;
  eventSelectedStudent.innerHTML = `<strong>${escapeHtml(name)}</strong><span>${escapeHtml([candidate.ref ? `Ref ${candidate.ref}` : '', candidate.grade ? `Grade ${candidate.grade}` : '', candidate.homeroom || ''].filter(Boolean).join(' · '))}</span>`;
  eventOrderForm.elements.confirmed.checked = false;
  const existing = jobsState.eventSetup?.selectedEntry?.links?.find((link) => Number(link.subjectId) === Number(candidate.id || candidate.subjectId));
  eventOrderForm.elements.orderCodes.value = existing?.packageCodes || '';
  eventOrderForm.elements.paidStatus.value = existing?.paidStatus || 'paid';
  eventOrderForm.elements.notes.value = jobsState.eventSetup?.selectedEntry?.notes || '';
  loadEventImagePreview(candidate.fallImageAssetId, eventFallPreview, 'This fall student does not have a thumbnail.').catch((error) => console.error(error));
}

async function hydrateEventResultThumbnails(candidates) {
  const entryId = jobsState.eventSetup?.selectedEntry?.id;
  await Promise.all(candidates.slice(0, 30).map(async (candidate) => {
    if (!candidate.fallImageAssetId) return;
    try {
      const preview = await imagePreviewForId(candidate.fallImageAssetId);
      if (entryId !== jobsState.eventSetup?.selectedEntry?.id || !preview?.dataUrl) return;
      const node = eventStudentResults.querySelector(`[data-event-result-thumb="${candidate.id}"]`);
      if (node) node.innerHTML = `<img src="${preview.dataUrl}" alt="Fall thumbnail">`;
    } catch (_error) { /* A missing thumbnail remains a neutral placeholder. */ }
  }));
}

function renderEventCandidates() {
  const candidates = jobsState.eventCandidates;
  eventCandidateCount.textContent = `${candidates.length} found`;
  eventStudentResults.innerHTML = candidates.length ? candidates.map((candidate) => `<button class="event-student-result ${Number(candidate.id) === Number(jobsState.eventSelectedCandidateId) ? 'active' : ''}" data-event-candidate-id="${candidate.id}" type="button"><span class="event-result-thumb" data-event-result-thumb="${candidate.id}">${candidate.fallImageAssetId ? '' : 'No photo'}</span><span><strong>${escapeHtml(candidate.name || [candidate.firstName, candidate.lastName].filter(Boolean).join(' ') || `Ref ${candidate.ref}`)}</strong><small>${escapeHtml([candidate.ref ? `Ref ${candidate.ref}` : '', candidate.externalId ? `ID ${candidate.externalId}` : '', candidate.grade ? `Grade ${candidate.grade}` : '', candidate.homeroom || ''].filter(Boolean).join(' · '))}</small></span></button>`).join('') : '<div class="empty-state">No fall students match those filters.</div>';
  hydrateEventResultThumbnails(candidates).catch((error) => console.error(error));
}

async function searchEventStudents() {
  const setup = jobsState.eventSetup;
  if (!setup?.selectedEventJobId || !setup.linkedFallJobId) { jobsState.eventCandidates = []; renderEventCandidates(); return; }
  jobsState.eventCandidates = await trecsApi('searchEventFallStudents').searchEventFallStudents({ eventJobId: setup.selectedEventJobId, search: eventStudentSearch.value, grade: eventGradeFilter.value, homeroom: eventHomeroomFilter.value });
  renderEventCandidates();
}

function renderEventEntry() {
  const entry = jobsState.eventSetup?.selectedEntry;
  if (!entry) {
    eventCurrentImageNumber.textContent = 'Choose an image'; eventCurrentStatus.textContent = 'Waiting'; eventCurrentStatus.className = 'status review';
    eventPhotoPreview.innerHTML = '<div class="empty-state">Import and choose an event image.</div>'; renderEventExistingLinks(); renderEventSelectedCandidate(); return;
  }
  eventCurrentImageNumber.textContent = `Image ${entry.imageNumber}`; eventCurrentStatus.textContent = eventStatusLabel(entry.status); eventCurrentStatus.className = `status ${eventStatusClass(entry.status)}`;
  loadEventImagePreview(entry.imageAssetId, eventPhotoPreview, 'Event photo could not be loaded.').catch((error) => console.error(error));
  renderEventExistingLinks();
  const firstLink = entry.links?.[0]; jobsState.eventSelectedCandidateId = firstLink?.subjectId || null;
  renderEventSelectedCandidate();
}

function renderEventFilters() {
  const setup = jobsState.eventSetup;
  const selectedGrade = eventGradeFilter.value; const selectedHomeroom = eventHomeroomFilter.value;
  eventGradeFilter.innerHTML = `<option value="">All Grades</option>${(setup?.filters?.grades || []).map((value) => `<option value="${escapeHtml(value)}" ${value === selectedGrade ? 'selected' : ''}>${escapeHtml(value)}</option>`).join('')}`;
  eventHomeroomFilter.innerHTML = `<option value="">All Homerooms</option>${(setup?.filters?.homerooms || []).map((value) => `<option value="${escapeHtml(value)}" ${value === selectedHomeroom ? 'selected' : ''}>${escapeHtml(value)}</option>`).join('')}`;
  eventPackageCodeShortcuts.innerHTML = (setup?.packageCodes || []).slice(0, 12).map((code) => `<button data-event-package-code="${escapeHtml(code.code)}" type="button" title="${escapeHtml(code.name || '')}">${escapeHtml(code.code)}${code.name ? ` · ${escapeHtml(code.name)}` : ''}</button>`).join('');
}

async function loadEventWorkflow(eventJobId = null, entryId = null) {
  eventSetupStatus.textContent = 'Loading event workflow...';
  jobsState.eventSetup = await trecsApi('getEventWorkflowSetup').getEventWorkflowSetup(eventJobId || jobsState.eventSetup?.selectedEventJobId || null, entryId);
  jobsState.eventCandidates = []; jobsState.eventSelectedCandidateId = null;
  renderEventJobSetup(); renderEventFilters(); renderEventQueue(); renderEventEntry();
  if (jobsState.eventSetup.linkedFallJobId) await searchEventStudents();
}

async function configureSelectedEventFallJob() {
  const eventJobId = Number(eventJobSelect.value); const fallJobId = Number(eventFallJobSelect.value);
  if (!eventJobId || !fallJobId) { eventSetupStatus.textContent = 'Choose an event job and fall job.'; return; }
  if (!(await acquireUiJobLock(eventJobId))) return;
  try { await trecsApi('configureEventFallJob').configureEventFallJob({ eventJobId, fallJobId }); await loadEventWorkflow(eventJobId); eventSetupStatus.textContent = 'Fall student job linked.'; } catch (error) { eventSetupStatus.textContent = error.message || 'Could not link fall job.'; }
}

async function importSelectedEventImages() {
  const eventJobId = Number(eventJobSelect.value); if (!eventJobId || !(await acquireUiJobLock(eventJobId))) return;
  importEventImagesButton.disabled = true;
  try { const result = await trecsApi('chooseEventImageFolder').chooseEventImageFolder(eventJobId); if (!result.canceled) { await loadEventWorkflow(eventJobId); eventSetupStatus.textContent = `Imported ${result.imported} new event images; ${result.existing} already loaded.`; } } catch (error) { eventSetupStatus.textContent = error.message || 'Could not import event images.'; } finally { importEventImagesButton.disabled = false; }
}

async function selectEventEntry(entryId) {
  await loadEventWorkflow(Number(eventJobSelect.value), Number(entryId)); eventStudentSearch.focus(); eventStudentSearch.select();
}

function selectEventCandidate(candidateId, focusOrder = false) {
  jobsState.eventSelectedCandidateId = Number(candidateId); renderEventCandidates(); renderEventSelectedCandidate();
  if (focusOrder) { eventOrderForm.elements.orderCodes.focus(); eventOrderForm.elements.orderCodes.select(); }
}

async function saveEventOrder(goNext) {
  const setup = jobsState.eventSetup; const candidate = selectedEventCandidate();
  if (!setup?.selectedEntry || !candidate || jobsState.eventSaving) { eventOrderStatus.textContent = 'Choose an event image and fall student first.'; return; }
  if (!(await acquireUiJobLock(setup.selectedEventJobId))) return;
  jobsState.eventSaving = true; eventSaveNextButton.disabled = true; eventSaveStayButton.disabled = true;
  try {
    const result = await trecsApi('saveEventMatch').saveEventMatch({ eventJobId: setup.selectedEventJobId, entryId: setup.selectedEntry.id, fallSubjectId: candidate.id || candidate.subjectId, confirmed: eventOrderForm.elements.confirmed.checked, orderCodes: eventOrderForm.elements.orderCodes.value, paidStatus: eventOrderForm.elements.paidStatus.value, notes: eventOrderForm.elements.notes.value });
    await loadEventWorkflow(setup.selectedEventJobId, goNext ? result.nextEntryId : result.entryId);
    eventOrderStatus.textContent = result.orderId ? 'Student linked and picture order saved.' : 'Student linked without an order.';
    if (goNext) { eventStudentSearch.focus(); eventStudentSearch.select(); } else { jobsState.eventSelectedCandidateId = null; renderEventSelectedCandidate(); eventStudentSearch.focus(); eventStudentSearch.select(); }
  } catch (error) { eventOrderStatus.textContent = error.message || 'Could not save event match.'; } finally { jobsState.eventSaving = false; eventSaveNextButton.disabled = false; eventSaveStayButton.disabled = false; }
}

function packageProductOptions(selectedId = '') {
  const products = (jobsState.packageEditor && jobsState.packageEditor.products) || [];
  const groups = new Map();
  products.forEach((product) => {
    const category = product.category || 'other';
    if (!groups.has(category)) groups.set(category, []);
    groups.get(category).push(product);
  });
  return Array.from(groups.entries()).map(([category, rows]) => `
    <optgroup label="${escapeHtml(formatStatusLabel(category))}">
      ${rows.map((product) => `<option value="${product.id}" ${Number(selectedId) === Number(product.id) ? 'selected' : ''}>${escapeHtml(product.name)}${product.size ? ` (${escapeHtml(product.size)})` : ''}</option>`).join('')}
    </optgroup>
  `).join('');
}

function productCategoryOptions(selected = '') {
  const selectedValue = String(selected || 'print');
  const categories = [
    ['print', 'Print'],
    ['print_bundle', 'Print Bundle'],
    ['group_print', 'Group / Composite Print'],
    ['id_card', 'ID Card'],
    ['image_prep', 'ImagePrep'],
    ['specialty', 'Photoshop Handoff / Specialty'],
    ['digital', 'Digital'],
    ['envelope_text', 'Envelope Text Only'],
    ['unknown', 'Other / Needs Review']
  ];
  if (selectedValue && !categories.some(([value]) => value === selectedValue)) {
    categories.push([selectedValue, `${formatStatusLabel(selectedValue)} (legacy)`]);
  }
  return categories.map(([value, label]) => `<option value="${value}" ${selectedValue === value ? 'selected' : ''}>${escapeHtml(label)}</option>`).join('');
}

function productCatalogRows() {
  const products = (jobsState.packageEditor && jobsState.packageEditor.products) || [];
  if (!products.length) return '<div class="empty-state">Load default products or add a product to begin review.</div>';
  return products.map((product) => {
    const reviewed = product.reviewed === true;
    const support = formatStatusLabel(product.renderStatus || 'unknown');
    return `<article class="product-review-row ${reviewed ? 'reviewed' : ''}" data-product-review="${product.id}">
      <span class="review-check" title="${reviewed ? 'Reviewed' : 'Not reviewed'}">${reviewed ? '✓' : ''}</span>
      <input name="productName" value="${escapeHtml(product.name || '')}" placeholder="Product name">
      <select name="productCategory">${productCategoryOptions(product.category || 'print')}</select>
      <input name="productSize" type="hidden" value="${escapeHtml(product.size || '')}">
      <label class="checkbox-line compact" title="Needs a student image to render or export"><input name="productRequiresImage" type="checkbox" ${product.requiresImage === 0 || product.requiresImage === false ? '' : 'checked'}><span>Needs Photo</span></label>
      <small>${escapeHtml(support)}</small>
      <button data-test-product="${product.id}" type="button">Test</button>
      <button data-toggle-product-reviewed="${product.id}" type="button">${reviewed ? 'Unreview' : 'Mark Reviewed'}</button>
      <button class="danger" data-delete-product="${product.id}" type="button">Delete</button>
    </article>`;
  }).join('');
}

function packageItemRow(item = {}) {
  return `<div class="package-item-row">
    <span class="package-item-handle" title="Items render in this order">≡</span>
    <select name="productId" required><option value="">Choose product...</option>${packageProductOptions(item.productId)}</select>
    <label>Qty <input name="quantity" type="number" min="1" max="999" value="${Number(item.quantity || 1)}"></label>
    <button data-test-package-item type="button">Test Item</button>
    <button data-remove-package-item type="button">Remove</button>
  </div>`;
}

function drawPackageEditor(selectedCodeId = null) {
  const editor = jobsState.packageEditor;
  const productsExpanded = jobsState.productsPanelExpanded === true;
  const productsCollapsed = jobsState.productsPanelCollapsed === true;
  const selected = selectedCodeId === 0
    ? null
    : editor.codes.find((code) => Number(code.id) === Number(selectedCodeId)) || editor.codes[0] || null;
  productsPageContent.innerHTML = `
    <div class="package-editor">
      <div class="package-editor-toolbar">
        <label><span>Package Plan</span><select id="packageEditorPlan">${editor.plans.map((plan) => `<option value="${plan.id}" ${Number(plan.id) === Number(editor.selectedPlanId) ? 'selected' : ''}>${escapeHtml(plan.name)} (v${plan.version})</option>`).join('')}</select></label>
        <button id="newPackagePlanButton" type="button">New Plan</button>
        <button id="newPackageCodeButton" type="button">New Code</button>
        <span id="packageEditorStatus"></span>
      </div>
      <form id="newPackagePlanForm" class="new-package-plan-form" hidden>
        <label><span>Plan Name</span><input name="name" required placeholder="Example: Fall 2026"></label>
        <label><span>Version</span><input name="version" type="number" min="1" value="1"></label>
        <button class="primary" type="submit">Create Plan</button>
        <button id="cancelNewPackagePlanButton" type="button">Cancel</button>
      </form>
      <section class="product-catalog-panel">
        <div>
          <h3>Product Catalog</h3>
          <p>${formatNumber(editor.products.length)} product${editor.products.length === 1 ? '' : 's'} available for package contents.</p>
        </div>
        <button id="seedDefaultProductsButton" type="button">Load Default Products</button>
        <button id="newProductButton" type="button">Add Product</button>
      </section>
      <form id="newProductForm" class="new-product-form" hidden>
        <input name="id" type="hidden">
        <label><span>Name</span><input name="name" required placeholder="Example: StarPhoto"></label>
        <label><span>Category</span><select name="category">
          <option value="print">Print</option>
          <option value="print_bundle">Print Bundle</option>
          <option value="group_print">Group / Composite Print</option>
          <option value="id_card">ID Card</option>
          <option value="image_prep">ImagePrep</option>
          <option value="specialty">Photoshop Handoff / Specialty</option>
          <option value="digital">Digital</option>
          <option value="envelope_text">Envelope Text Only</option>
          <option value="unknown">Other / Needs Review</option>
        </select></label>
        <input name="size" type="hidden">
        <label class="checkbox-line" title="Needs a student image to render or export"><input name="requiresImage" type="checkbox" checked><span>Needs Photo</span></label>
        <button class="primary" type="submit">Save Product</button>
        <button id="cancelNewProductButton" type="button">Cancel</button>
      </form>
      <section class="product-review-panel ${productsExpanded ? 'expanded' : ''} ${productsCollapsed ? 'collapsed' : ''}">
        <div class="column-title product-review-heading"><div><strong>Products</strong><span>${productsCollapsed ? 'Product list hidden.' : 'Edit products, test a single item, or mark render setup reviewed.'}</span></div><div class="product-review-actions"><button id="collapseProductPanelButton" type="button">${productsCollapsed ? 'Show Products' : 'Hide Products'}</button><button id="toggleProductPanelButton" type="button" ${productsCollapsed ? 'disabled' : ''}>${productsExpanded ? 'Compact' : 'Expand'}</button><button id="saveProductListButton" type="button" ${productsCollapsed ? 'disabled' : ''}>Save Product List</button><button id="saveProductsDefaultButton" type="button" ${productsCollapsed ? 'disabled' : ''}>Save as Default Products</button></div></div>
        <div class="product-review-list">${productCatalogRows()}</div>
      </section>
      <div class="package-editor-layout">
        <aside class="package-code-list">
          ${editor.codes.length ? editor.codes.map((code) => `<button data-package-code="${code.id}" class="${selected && Number(code.id) === Number(selected.id) ? 'active' : ''} ${code.reviewed ? 'reviewed' : ''}" type="button"><strong>${code.reviewed ? '<span class="review-check">✓</span>' : ''}${escapeHtml(code.name || 'Unnamed package')}</strong><span>Code ${escapeHtml(code.code)}</span><small>${code.items.length} item${code.items.length === 1 ? '' : 's'}</small></button>`).join('') : '<div class="empty-state">No codes in this plan.</div>'}
        </aside>
        <form id="packageCodeForm" class="package-code-form">
          <input name="id" type="hidden" value="${selected ? selected.id : ''}">
          <div class="package-code-heading"><label><span>Order Code</span><input name="code" required value="${selected ? escapeHtml(selected.code) : ''}" placeholder="1"></label><label class="grow"><span>Customer-facing Name</span><input name="name" value="${selected ? escapeHtml(selected.name || '') : ''}" placeholder="Package A"></label></div>
          <div class="package-item-heading"><div><h3>Package Contents</h3><p>Each row is a product, service, modifier, or fulfillment instruction.</p></div><button id="addPackageItemButton" type="button">Add Item</button></div>
          <div id="packageItemRows">${selected && selected.items.length ? selected.items.map(packageItemRow).join('') : packageItemRow()}</div>
          <div class="form-actions"><button id="deletePackageCodeButton" class="danger" type="button" ${selected ? '' : 'disabled'}>Delete Code</button><button id="testPackageCodeButton" type="button" ${selected ? '' : 'disabled'}>Test</button><button id="markPackageReviewedButton" type="button" ${selected ? '' : 'disabled'}>${selected?.reviewed ? 'Unreview' : 'Mark Reviewed'}</button><button class="primary" type="submit">Save Package</button></div>
        </form>
      </div>
    </div>`;
  bindPackageEditor(selected);
}

function collectProductListRows() {
  return Array.from(document.querySelectorAll('[data-product-review]')).map((row) => ({
    id: Number(row.dataset.productReview),
    name: row.querySelector('[name="productName"]').value,
    category: row.querySelector('[name="productCategory"]').value,
    size: row.querySelector('[name="productSize"]').value,
    requiresImage: row.querySelector('[name="productRequiresImage"]').checked
  }));
}

function rememberProductListScroll() {
  const list = document.querySelector('.product-review-list');
  if (list) jobsState.productListScrollTop = list.scrollTop;
}

function restoreProductListScroll() {
  const list = document.querySelector('.product-review-list');
  if (!list || !Number.isFinite(Number(jobsState.productListScrollTop))) return;
  list.scrollTop = Number(jobsState.productListScrollTop);
}

function rememberPackageCodeListScroll() {
  const list = document.querySelector('.package-code-list');
  if (list) jobsState.packageCodeListScrollTop = list.scrollTop;
}

function restorePackageCodeListScroll() {
  const list = document.querySelector('.package-code-list');
  if (!list || !Number.isFinite(Number(jobsState.packageCodeListScrollTop))) return;
  list.scrollTop = Number(jobsState.packageCodeListScrollTop);
}

function bindPackageEditor(selected) {
  const status = document.querySelector('#packageEditorStatus');
  const productList = document.querySelector('.product-review-list');
  if (productList) {
    restoreProductListScroll();
    productList.addEventListener('scroll', () => {
      jobsState.productListScrollTop = productList.scrollTop;
    });
  }
  const packageCodeList = document.querySelector('.package-code-list');
  if (packageCodeList) {
    restorePackageCodeListScroll();
    packageCodeList.addEventListener('scroll', () => {
      jobsState.packageCodeListScrollTop = packageCodeList.scrollTop;
    });
  }
  document.querySelector('#packageEditorPlan').addEventListener('change', async (event) => {
    jobsState.packageEditorPlanId = Number(event.target.value);
    jobsState.packageCodeListScrollTop = 0;
    await renderProductsPage();
  });
  document.querySelectorAll('[data-package-code]').forEach((button) => button.addEventListener('click', () => {
    rememberPackageCodeListScroll();
    drawPackageEditor(Number(button.dataset.packageCode));
  }));
  document.querySelector('#addPackageItemButton').addEventListener('click', () => document.querySelector('#packageItemRows').insertAdjacentHTML('beforeend', packageItemRow()));
  document.querySelector('#packageItemRows').addEventListener('click', async (event) => {
    if (event.target.matches('[data-remove-package-item]')) {
      event.target.closest('.package-item-row').remove();
      return;
    }
    if (event.target.matches('[data-test-package-item]')) {
      const row = event.target.closest('.package-item-row');
      const productId = Number(row.querySelector('[name="productId"]').value || 0);
      const quantity = Number(row.querySelector('[name="quantity"]').value || 1);
      if (!productId) {
        status.textContent = 'Choose a product before testing the item.';
        return;
      }
      event.target.disabled = true;
      try {
        const result = await trecsApi('testPackageItemRender').testPackageItemRender({ productId, quantity });
        const count = Number(result.rendered || result.handoffs || result.imagePrep || 0);
        status.textContent = `Tested ${count} output${count === 1 ? '' : 's'}. ${result.outputFolder}`;
      } catch (error) {
        status.textContent = error.message || 'Item test failed.';
      } finally {
        event.target.disabled = false;
      }
    }
  });
  document.querySelector('#newPackageCodeButton').addEventListener('click', () => {
    rememberPackageCodeListScroll();
    drawPackageEditor(0);
  });
  const newPlanForm = document.querySelector('#newPackagePlanForm');
  document.querySelector('#newPackagePlanButton').addEventListener('click', () => {
    newPlanForm.hidden = false;
    newPlanForm.elements.name.focus();
    status.textContent = '';
  });
  document.querySelector('#cancelNewPackagePlanButton').addEventListener('click', () => {
    newPlanForm.hidden = true;
    newPlanForm.reset();
  });
  newPlanForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submitButton = newPlanForm.querySelector('[type="submit"]');
    submitButton.disabled = true;
    try {
      status.textContent = 'Creating package plan...';
      const result = await trecsApi('createPackagePlan').createPackagePlan({ name: newPlanForm.elements.name.value, version: newPlanForm.elements.version.value });
      jobsState.packageEditorPlanId = result.id;
      await renderProductsPage();
    } catch (error) {
      status.textContent = error.message || 'Could not create package plan.';
      submitButton.disabled = false;
    }
  });
  const newProductForm = document.querySelector('#newProductForm');
  document.querySelector('#newProductButton').addEventListener('click', () => {
    newProductForm.reset();
    newProductForm.elements.id.value = '';
    newProductForm.elements.requiresImage.checked = true;
    newProductForm.hidden = false;
    newProductForm.elements.name.focus();
    status.textContent = '';
  });
  document.querySelector('#cancelNewProductButton').addEventListener('click', () => {
    newProductForm.hidden = true;
    newProductForm.reset();
  });
  document.querySelector('#collapseProductPanelButton').addEventListener('click', (event) => {
    const panel = document.querySelector('.product-review-panel');
    jobsState.productsPanelCollapsed = !jobsState.productsPanelCollapsed;
    panel.classList.toggle('collapsed', jobsState.productsPanelCollapsed);
    event.currentTarget.textContent = jobsState.productsPanelCollapsed ? 'Show Products' : 'Hide Products';
    document.querySelector('#toggleProductPanelButton').disabled = jobsState.productsPanelCollapsed;
    document.querySelector('#saveProductListButton').disabled = jobsState.productsPanelCollapsed;
    document.querySelector('#saveProductsDefaultButton').disabled = jobsState.productsPanelCollapsed;
  });
  document.querySelector('#toggleProductPanelButton').addEventListener('click', (event) => {
    const panel = document.querySelector('.product-review-panel');
    panel.classList.toggle('expanded');
    jobsState.productsPanelExpanded = panel.classList.contains('expanded');
    event.currentTarget.textContent = jobsState.productsPanelExpanded ? 'Collapse' : 'Expand';
  });
  document.querySelector('#saveProductListButton').addEventListener('click', async (event) => {
    event.currentTarget.disabled = true;
    try {
      rememberProductListScroll();
      status.textContent = 'Saving product list...';
      const result = await trecsApi('saveProductsBatch').saveProductsBatch(collectProductListRows());
      jobsState.packageEditor = await trecsApi('getPackageEditorData').getPackageEditorData(jobsState.packageEditorPlanId);
      drawPackageEditor(selected ? Number(selected.id) : null);
      document.querySelector('#packageEditorStatus').textContent = `Saved ${result.saved} products.`;
    } catch (error) {
      status.textContent = error.message || 'Could not save product list.';
      event.currentTarget.disabled = false;
    }
  });
  document.querySelector('#saveProductsDefaultButton').addEventListener('click', async (event) => {
    if (!window.confirm('Save the current product list as the default products loaded by TRECS?')) return;
    event.currentTarget.disabled = true;
    try {
      rememberProductListScroll();
      status.textContent = 'Saving default products...';
      const result = await trecsApi('saveProductsAsDefault').saveProductsAsDefault(collectProductListRows());
      jobsState.packageEditor = await trecsApi('getPackageEditorData').getPackageEditorData(jobsState.packageEditorPlanId);
      drawPackageEditor(selected ? Number(selected.id) : null);
      document.querySelector('#packageEditorStatus').textContent = `Saved ${result.saved} default products. ${result.outputPath}`;
    } catch (error) {
      status.textContent = error.message || 'Could not save default products.';
      event.currentTarget.disabled = false;
    }
  });
  document.querySelector('.product-review-list').addEventListener('click', async (event) => {
    const editButton = event.target.closest('[data-edit-product]');
    const testButton = event.target.closest('[data-test-product]');
    const toggleButton = event.target.closest('[data-toggle-product-reviewed]');
    const deleteButton = event.target.closest('[data-delete-product]');
    if (editButton) {
      const product = jobsState.packageEditor.products.find((row) => Number(row.id) === Number(editButton.dataset.editProduct));
      if (!product) return;
      newProductForm.hidden = false;
      newProductForm.elements.id.value = product.id;
      newProductForm.elements.name.value = product.name || '';
      newProductForm.elements.category.value = product.category || 'print';
      newProductForm.elements.size.value = product.size || '';
      newProductForm.elements.requiresImage.checked = product.requiresImage !== 0 && product.requiresImage !== false;
      newProductForm.elements.name.focus();
      status.textContent = `Editing ${product.name}.`;
      return;
    }
    if (testButton) {
      testButton.disabled = true;
      try {
        const result = await trecsApi('testProductRender').testProductRender(Number(testButton.dataset.testProduct));
        const count = Number(result.files?.length || result.sheets || 0);
        status.textContent = result.status === 'photoshop_handoff'
          ? `Created Photoshop handoff files. ${result.outputPath}`
          : result.status === 'image_prep'
            ? `Created ImagePrep source files. ${result.outputPath}`
          : result.status === 'digital_download'
            ? `Created digital download card. ${result.outputPath}`
          : `Tested ${count} sheet${count === 1 ? '' : 's'}. ${result.outputPath || ''}`;
      } catch (error) {
        status.textContent = error.message || 'Product test failed.';
      } finally {
        testButton.disabled = false;
      }
      return;
    }
    if (toggleButton) {
      const productId = Number(toggleButton.dataset.toggleProductReviewed);
      const product = jobsState.packageEditor.products.find((row) => Number(row.id) === productId);
      toggleButton.disabled = true;
      try {
        rememberProductListScroll();
        const result = await trecsApi('markProductReviewed').markProductReviewed(productId, !(product && product.reviewed));
        jobsState.packageEditor = await trecsApi('getPackageEditorData').getPackageEditorData(jobsState.packageEditorPlanId);
        drawPackageEditor(selected ? Number(selected.id) : null);
        document.querySelector('#packageEditorStatus').textContent = `${result.reviewed ? 'Reviewed' : 'Unreviewed'} ${result.name}.`;
      } catch (error) {
        status.textContent = error.message || 'Could not update product review status.';
        toggleButton.disabled = false;
      }
      return;
    }
    if (deleteButton) {
      const product = jobsState.packageEditor.products.find((row) => Number(row.id) === Number(deleteButton.dataset.deleteProduct));
      if (!product || !window.confirm(`Delete product ${product.name}?`)) return;
      deleteButton.disabled = true;
      try {
        rememberProductListScroll();
        const result = await trecsApi('deleteProduct').deleteProduct(product.id);
        jobsState.packageEditor = await trecsApi('getPackageEditorData').getPackageEditorData(jobsState.packageEditorPlanId);
        drawPackageEditor(selected ? Number(selected.id) : null);
        document.querySelector('#packageEditorStatus').textContent = `Deleted product ${result.name}.`;
      } catch (error) {
        status.textContent = error.message || 'Could not delete product.';
        deleteButton.disabled = false;
      }
    }
  });
  document.querySelector('#seedDefaultProductsButton').addEventListener('click', async (event) => {
    event.currentTarget.disabled = true;
    try {
      rememberProductListScroll();
      status.textContent = 'Loading default products...';
      const result = await trecsApi('seedDefaultProducts').seedDefaultProducts();
      jobsState.packageEditor = await trecsApi('getPackageEditorData').getPackageEditorData(jobsState.packageEditorPlanId);
      drawPackageEditor(selected ? Number(selected.id) : null);
      document.querySelector('#packageEditorStatus').textContent = `Loaded ${result.productCount} products (${result.added} new).`;
    } catch (error) {
      status.textContent = error.message || 'Could not load default products.';
      event.currentTarget.disabled = false;
    }
  });
  document.querySelector('#testPackageCodeButton').addEventListener('click', async (event) => {
    if (!selected) return;
    event.currentTarget.disabled = true;
    try {
      status.textContent = `Testing ${selected.name || selected.code}...`;
      const result = await trecsApi('testPackageCodeRender').testPackageCodeRender(selected.id);
      status.textContent = `Rendered ${result.rendered} output${Number(result.rendered) === 1 ? '' : 's'} with SampleCroppedLarge.jpg${result.skipped.length ? `; ${result.skipped.length} item(s) need setup` : ''}. ${result.outputFolder}`;
    } catch (error) {
      status.textContent = error.message || 'Package test failed.';
    } finally {
      event.currentTarget.disabled = false;
    }
  });
  document.querySelector('#markPackageReviewedButton').addEventListener('click', async (event) => {
    if (!selected) return;
    event.currentTarget.disabled = true;
    try {
      const result = await trecsApi('markPackageCodeReviewed').markPackageCodeReviewed(selected.id, !selected.reviewed);
      jobsState.packageEditor = await trecsApi('getPackageEditorData').getPackageEditorData(jobsState.packageEditorPlanId);
      rememberPackageCodeListScroll();
      drawPackageEditor(selected.id);
      document.querySelector('#packageEditorStatus').textContent = `${result.reviewed ? 'Reviewed' : 'Unreviewed'} ${result.name || result.code}.`;
    } catch (error) {
      status.textContent = error.message || 'Could not update package review status.';
      event.currentTarget.disabled = false;
    }
  });
  newProductForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submitButton = newProductForm.querySelector('[type="submit"]');
    submitButton.disabled = true;
    try {
      status.textContent = 'Saving product...';
      const product = await trecsApi('createProduct').createProduct({
        id: newProductForm.elements.id.value || null,
        name: newProductForm.elements.name.value,
        category: newProductForm.elements.category.value,
        size: newProductForm.elements.size.value,
        requiresImage: newProductForm.elements.requiresImage.checked
      });
      jobsState.packageEditor = await trecsApi('getPackageEditorData').getPackageEditorData(jobsState.packageEditorPlanId);
      drawPackageEditor(selected ? Number(selected.id) : null);
      document.querySelector('#packageEditorStatus').textContent = `Saved product ${product?.name || ''}.`;
    } catch (error) {
      status.textContent = error.message || 'Could not save product.';
      submitButton.disabled = false;
    }
  });
  document.querySelector('#packageCodeForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const items = Array.from(form.querySelectorAll('.package-item-row')).filter((row) => row.querySelector('[name="productId"]').value).map((row) => ({ productId: Number(row.querySelector('[name="productId"]').value), quantity: Number(row.querySelector('[name="quantity"]').value || 1) }));
    try {
      status.textContent = 'Saving...';
      const result = await trecsApi('savePackageCode').savePackageCode({ id: form.elements.id.value || null, packagePlanId: jobsState.packageEditorPlanId, code: form.elements.code.value, name: form.elements.name.value, items });
      jobsState.packageEditor = await trecsApi('getPackageEditorData').getPackageEditorData(jobsState.packageEditorPlanId);
      status.textContent = 'Saved';
      rememberPackageCodeListScroll();
      drawPackageEditor(result.id);
    } catch (error) { status.textContent = error.message; }
  });
  document.querySelector('#deletePackageCodeButton').addEventListener('click', async () => {
    if (!selected || !window.confirm(`Delete package code ${selected.code}?`)) return;
    rememberPackageCodeListScroll();
    await trecsApi('deletePackageCode').deletePackageCode(selected.id);
    jobsState.packageEditor = await trecsApi('getPackageEditorData').getPackageEditorData(jobsState.packageEditorPlanId);
    drawPackageEditor();
  });
}

async function loadJobDetail(jobId) {
  jobWorkflowContent.innerHTML = '<div class="empty-state">Loading job workflow data...</div>';
  jobsState.detail = await trecsApi('getJobDetail').getJobDetail(jobId);
  jobsState.selectedImageId = null;
  jobsState.selectedImageSubjectId = null;
  jobsState.selectedSubjectId = null;
  jobsState.selectedOrderId = null;
  jobsState.subjectSearch = '';
  jobsState.imageSearch = '';
  jobsState.imageLinkSubjectSearch = '';
  jobsState.imagePreviewCache.clear();
  jobsState.workspaceStudentSearch = '';
  jobsState.captureSubject = null;
  jobsState.captureImages = [];
  jobsState.captureCompareSlotIds = null;
  jobsState.captureSearchResults = [];
  hideCaptureStudentSearch();
  jobsState.envelopeSubject = null;
  jobsState.envelopeScan = null;
  jobsState.envelopePending = null;
  envelopeConfirmModal.hidden = true;
  jobsState.showStudentEditForm = false;
  jobsState.workspaceMode = 'students';
  jobsState.adminItems = null;
  resetAdminSchoolYearForCurrentJob(true);
  renderWorkflowTab();
}

async function reloadCurrentJobDetail() {
  hideImageHoverPreview();
  if (!jobsState.selectedJobId) {
    return;
  }

  const captureEditing = jobsState.workspaceMode === 'capture'
    && captureWorkspace
    && captureWorkspace.contains(document.activeElement)
    && activeElementAcceptsTyping();
  jobsState.detail = await trecsApi('getJobDetail').getJobDetail(jobsState.selectedJobId);
  renderJobDetail(jobsState.detail.summary || jobsState.jobs.find((job) => job.id === jobsState.selectedJobId));
  if (jobsState.jobWorkspaceOpen) {
    if (jobsState.workspaceMode === 'admin') {
      renderAdminItemsWorkspace();
    } else if (jobsState.workspaceMode === 'capture') {
      if (captureEditing) {
        renderCapturePhotoCount();
      } else {
        renderCaptureWorkspace();
      }
    } else if (jobsState.workspaceMode === 'imageReview') {
      renderImageReviewWorkspace();
    } else if (jobsState.workspaceMode === 'envelope') {
      renderEnvelopeWorkspace();
    } else {
      renderStudentWorkspace();
    }
  } else {
    renderWorkflowTab();
  }
}

async function loadImagePreview(imageId, options = {}) {
  const panel = document.getElementById(options.panelId || 'imagePreviewPanel');
  if (!panel || !imageId) {
    if (panel) {
      panel.innerHTML = '<div class="empty-state">Select an image to review.</div>';
    }
    return;
  }

  const preview = await trecsApi('getImagePreview').getImagePreview(imageId);
  if (!preview || preview.missing || !preview.dataUrl) {
    panel.innerHTML = '<div class="empty-state">Preview unavailable.</div>';
    return;
  }

  const detailHtml = `
    <dl>
      <div>
        <dt>Filename</dt>
        <dd>${preview.filename}</dd>
      </div>
      <div>
        <dt>Version</dt>
        <dd>${preview.versionType}</dd>
      </div>
      <div>
        <dt>Size</dt>
        <dd>${preview.width} x ${preview.height}</dd>
      </div>
    </dl>
  `;
  panel.innerHTML = options.layout === 'review'
    ? `
      <div class="image-review-selected-image">
        <div class="image-review-selected-photo">
          <img src="${preview.dataUrl}" alt="${escapeHtml(preview.filename || 'Review image')}">
        </div>
        <div class="image-review-selected-detail">
          ${detailHtml}
        </div>
      </div>
      ${options.includeLinkPanel === false ? '' : renderImageLinkPanel(imageId)}
    `
    : `
      <img src="${preview.dataUrl}" alt="${escapeHtml(preview.filename || 'Image preview')}">
      ${detailHtml}
      ${options.includeLinkPanel === false ? '' : renderImageLinkPanel(imageId)}
    `;
  const previewImage = panel.querySelector('img');
  if (previewImage) {
    setLandscapeRotation(previewImage, { fitRotatedToFrame: options.layout === 'review' });
    if (options.layout === 'review') {
      previewImage.addEventListener('dblclick', () => {
        openImageLightbox(imageId);
      });
    }
  }

  if (options.includeLinkPanel !== false) {
    bindImagePreviewLinkForm();
  }
}

function renderImageLinkPanel(imageId, options = {}) {
  const subjects = jobsState.detail ? jobsState.detail.subjects : [];
  if (!subjects.length) {
    return '';
  }
  const filteredSubjects = subjects.filter((subject) => textIncludes(
    subject,
    ['ref', 'name', 'externalId', 'grade', 'homeroom'],
    jobsState.imageLinkSubjectSearch
  ));
  const selectableSubjects = filteredSubjects.length ? filteredSubjects : subjects;

  if (!selectableSubjects.some((subject) => subject.id === jobsState.selectedImageSubjectId)) {
    jobsState.selectedImageSubjectId = selectableSubjects[0].id;
  }

  const reviewResults = options.mode === 'review' ? imageReviewSubjectResults() : [];

  return `
    <form class="image-link-form ${options.mode === 'review' ? 'image-review-form' : ''}" data-image-link-form data-form-mode="${escapeHtml(options.mode || '')}">
      <div class="subheading compact-subheading">
        <h3>Assign Selected Image</h3>
        <span>${escapeHtml(jobsState.detail.summary ? jobsState.detail.summary.job : '')}</span>
      </div>
      ${options.mode === 'review' ? `
        <label class="image-review-subject-search-field">
          <span>Student Name Search</span>
          <input name="subjectSearch" type="search" value="${escapeHtml(jobsState.imageLinkSubjectSearch)}" placeholder="Ref, name, ID, grade" autocomplete="off">
          <div class="student-search-results image-review-search-results" ${reviewResults.length ? '' : 'hidden'}>
            ${imageReviewSubjectResultHtml(reviewResults)}
          </div>
        </label>
        <div class="image-review-subject-preview" id="imageReviewSubjectPreview"><div class="empty-state">Select a student to preview their current photo.</div></div>
      ` : `
        <label>
          <span>Find Subject</span>
          <input name="subjectSearch" type="search" value="${escapeHtml(jobsState.imageLinkSubjectSearch)}" placeholder="Ref, name, ID, grade">
        </label>
        <label>
          <span>Link To Subject</span>
          <select name="subjectId">
            ${selectableSubjects.map((subject) => `
              <option value="${subject.id}" ${subject.id === jobsState.selectedImageSubjectId ? 'selected' : ''}>
                ${subject.ref || ''} ${subject.name || ''}
              </option>
            `).join('')}
          </select>
        </label>
      `}
      <div class="form-actions">
        <span data-image-link-status></span>
        <button type="submit" data-link-image-id="${imageId}">Assign Image</button>
      </div>
    </form>
  `;
}

function selectedImageReviewSubject() {
  const subjects = jobsState.detail ? jobsState.detail.subjects : [];
  return subjects.find((subject) => Number(subject.id) === Number(jobsState.selectedImageSubjectId)) || null;
}

function imageReviewSubjectResults() {
  const search = jobsState.imageLinkSubjectSearch.trim();
  if (search.length < 2 || !jobsState.detail) {
    return [];
  }
  return (jobsState.detail.subjects || [])
    .filter((subject) => textIncludes(subject, ['ref', 'name', 'externalId', 'grade', 'homeroom'], search))
    .slice(0, 12);
}

function imageReviewSubjectResultHtml(subjects) {
  return subjects.map((subject) => `
    <button data-image-review-subject-id="${subject.id}" type="button">
      <strong>${escapeHtml(subject.name || 'Unnamed student')}</strong>
      <span>${escapeHtml([subject.ref ? `Ref ${subject.ref}` : '', subject.grade ? `Grade ${subject.grade}` : '', subject.homeroom ? `HR ${subject.homeroom}` : ''].filter(Boolean).join(' / '))}</span>
    </button>
  `).join('');
}

function bindImageReviewSubjectButtons(form) {
  form.querySelectorAll('[data-image-review-subject-id]').forEach((button) => {
    button.addEventListener('mousedown', (event) => {
      event.preventDefault();
    });
    button.addEventListener('click', () => {
      const subject = findById(jobsState.detail.subjects || [], Number(button.dataset.imageReviewSubjectId));
      if (!subject) {
        return;
      }
      jobsState.selectedImageSubjectId = subject.id;
      jobsState.imageLinkSubjectSearch = '';
      form.elements.subjectSearch.value = '';
      const results = form.querySelector('.image-review-search-results');
      if (results) {
        results.hidden = true;
      }
      loadReviewSubjectPreview();
    });
  });
}

async function loadReviewSubjectPreview() {
  const panel = document.getElementById('imageReviewSubjectPreview');
  if (!panel) {
    return;
  }
  const subject = selectedImageReviewSubject();
  if (!subject) {
    panel.innerHTML = '<div class="empty-state">Select a student to preview their current photo.</div>';
    return;
  }

  const detail = `
    <strong>${escapeHtml(subject.ref || '')} ${escapeHtml(subject.name || 'Unnamed student')}</strong>
    <span>${escapeHtml([subject.grade, subject.homeroom, subject.externalId].filter(Boolean).join(' / '))}</span>
  `;
  if (!subject.imageAssetId) {
    panel.innerHTML = `
      <div class="image-review-subject-card">
        <div class="image-review-subject-meta">${detail}</div>
        <div class="image-review-subject-photo"><div class="empty-state">No current photo linked.</div></div>
      </div>
    `;
    return;
  }

  try {
    const preview = await imagePreviewForId(subject.imageAssetId);
    if (!preview || preview.missing || !preview.dataUrl) {
      panel.innerHTML = `
        <div class="image-review-subject-card">
          <div class="image-review-subject-meta">${detail}</div>
          <div class="image-review-subject-photo"><div class="empty-state">Preview unavailable.</div></div>
        </div>
      `;
      return;
    }
    panel.innerHTML = `
      <div class="image-review-subject-card">
        <div class="image-review-subject-meta">${detail}</div>
        <div class="image-review-subject-photo">
          <img src="${preview.dataUrl}" alt="${escapeHtml(preview.filename || 'Current student photo')}">
        </div>
      </div>
    `;
    setLandscapeRotation(panel.querySelector('img'), { fitRotatedToFrame: true });
  } catch (error) {
    panel.innerHTML = `
      <div class="image-review-subject-card">
        <div class="image-review-subject-meta">${detail}</div>
        <div class="image-review-subject-photo"><div class="empty-state">Preview unavailable.</div></div>
      </div>
    `;
    console.error(error);
  }
}

function bindImagePreviewLinkForm(options = {}) {
  const form = document.querySelector('[data-image-link-form]');
  if (!form) {
    return;
  }
  const mode = options.mode || form.dataset.formMode || '';

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const subjectId = mode === 'review'
      ? Number(jobsState.selectedImageSubjectId)
      : Number(form.elements.subjectId.value);
    const button = form.querySelector('button[type="submit"]');
    const status = form.querySelector('[data-image-link-status]');
    if (!subjectId) {
      status.textContent = 'Choose a student first.';
      return;
    }
    jobsState.selectedImageSubjectId = subjectId;
    status.textContent = '';
    await saveSubjectImageLink(subjectId, Number(button.dataset.linkImageId), button);
  });

  if (form.elements.subjectId) {
    form.elements.subjectId.addEventListener('change', () => {
      jobsState.selectedImageSubjectId = Number(form.elements.subjectId.value);
      if (mode === 'review') {
        loadReviewSubjectPreview();
      }
    });
  }

  form.elements.subjectSearch.addEventListener('input', () => {
    jobsState.imageLinkSubjectSearch = form.elements.subjectSearch.value;
    if (mode === 'review') {
      clearTimeout(jobsState.imageReviewSearchTimer);
      jobsState.imageReviewSearchTimer = setTimeout(() => {
        const resultsPanel = form.querySelector('.image-review-search-results');
        const results = imageReviewSubjectResults();
        if (resultsPanel) {
          resultsPanel.innerHTML = imageReviewSubjectResultHtml(results);
          resultsPanel.hidden = !results.length;
          bindImageReviewSubjectButtons(form);
        }
      }, 80);
    } else {
      loadImagePreview(jobsState.selectedImageId);
    }
  });

  bindImageReviewSubjectButtons(form);
}

function unitRenderSelectedJob() {
  const setup = jobsState.unitRenderSetup;
  if (!setup || !unitRenderForm) return null;
  return setup.jobs.find((job) => Number(job.id) === Number(unitRenderForm.elements.jobId.value)) || null;
}

function renderUnitRenderFilter() {
  const setup = jobsState.unitRenderSetup;
  if (!setup) return;
  const source = unitRenderForm.elements.source.value;
  const values = source === 'grade' ? setup.filters.grades : source === 'homeroom' ? setup.filters.homerooms : source === 'individual' ? setup.filters.orders : [];
  unitRenderFilterField.hidden = source === 'all';
  unitRenderFilterLabel.textContent = source === 'grade' ? 'Grade' : source === 'homeroom' ? 'Homeroom' : 'Order';
  unitRenderForm.elements.sourceValue.innerHTML = source === 'individual'
    ? values.map((order) => `<option value="${order.id}">${escapeHtml(`${order.subjectName || 'Unnamed'} — Ref ${order.ref || ''} — ${order.packageCodes || 'No codes'}${order.hasPhoto ? '' : ' — NO PHOTO'}`)}</option>`).join('')
    : values.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join('');
}

function renderUnitRenderSummary() {
  const job = unitRenderSelectedJob();
  if (!job) {
    unitRenderMetrics.innerHTML = '<div class="empty-state">No job selected.</div>';
    return;
  }
  unitRenderForm.elements.packagePlan.value = job.packagePlan || 'No package plan';
  unitRenderMetrics.innerHTML = `
    <article><span>Paid Orders</span><strong>${formatNumber(job.paidOrders)}</strong></article>
    <article><span>Ready With Photo</span><strong>${formatNumber(job.readyOrders)}</strong></article>
    <article><span>Needs Photo</span><strong>${formatNumber(Number(job.paidOrders || 0) - Number(job.readyOrders || 0))}</strong></article>
    <article><span>All Orders</span><strong>${formatNumber(job.orders)}</strong></article>`;
}

async function loadUnitRenderSetup(jobId = null) {
  if (jobsState.unitRenderRunning) return;
  unitRenderStatus.textContent = 'Loading render queue...';
  const previousJobId = jobId || unitRenderForm.elements.jobId.value || null;
  jobsState.unitRenderSetup = await trecsApi('getUnitRenderSetup').getUnitRenderSetup(previousJobId);
  const setup = jobsState.unitRenderSetup;
  unitRenderForm.elements.jobId.innerHTML = setup.jobs.map((job) => `<option value="${job.id}" ${Number(job.id) === Number(setup.selectedJobId) ? 'selected' : ''}>${escapeHtml(`${job.clientName} — ${job.jobName}`)}</option>`).join('');
  renderUnitRenderSummary();
  renderUnitRenderFilter();
  unitRenderStatus.textContent = setup.jobs.length ? 'Choose an output folder, then render.' : 'No jobs are available.';
}

async function browseUnitRenderOutput() {
  const result = await trecsApi('chooseUnitRenderOutputFolder').chooseUnitRenderOutputFolder();
  if (!result || result.canceled) return;
  unitRenderForm.elements.outputFolder.value = result.folderPath || '';
  unitRenderStatus.textContent = 'Output folder selected.';
}

async function exportUnitImagePrep() {
  if (jobsState.unitRenderRunning) return;
  const outputFolder = unitRenderForm.elements.outputFolder.value;
  if (!outputFolder) {
    unitRenderStatus.textContent = 'Choose an output folder first.';
    unitRenderForm.elements.outputFolder.focus();
    return;
  }
  const jobId = Number(unitRenderForm.elements.jobId.value);
  if (!(await acquireUiJobLock(jobId, 'image_prep'))) return;
  jobsState.unitRenderRunning = true;
  exportImagePrepButton.disabled = true;
  startUnitRenderButton.disabled = true;
  browseUnitRenderOutputButton.disabled = true;
  unitRenderProgress.value = 0;
  unitRenderStatus.textContent = 'Exporting ImagePrep source files...';
  try {
    const result = await trecsApi('exportImagePrep').exportImagePrep({
      jobId,
      source: unitRenderForm.elements.source.value,
      sourceValue: unitRenderForm.elements.sourceValue.value,
      outputFolder
    });
    unitRenderStatus.textContent = `Image Prep exported ${result.exported} image${Number(result.exported) === 1 ? '' : 's'} across ${result.prepTypes || 0} prep item${Number(result.prepTypes || 0) === 1 ? '' : 's'}${result.missingPhotos.length ? `; ${result.missingPhotos.length} missing photo(s)` : ''}. ${result.outputFolder || ''}`;
  } catch (error) {
    unitRenderStatus.textContent = error.message || 'ImagePrep export failed.';
    console.error(error);
  } finally {
    await releaseUiJobLocks(jobId);
    jobsState.unitRenderRunning = false;
    exportImagePrepButton.disabled = false;
    startUnitRenderButton.disabled = false;
    browseUnitRenderOutputButton.disabled = false;
  }
}

async function submitUnitRender(event) {
  event.preventDefault();
  if (jobsState.unitRenderRunning) return;
  const outputFolder = unitRenderForm.elements.outputFolder.value;
  if (!outputFolder) {
    unitRenderStatus.textContent = 'Choose an output folder first.';
    return;
  }
  const jobId = Number(unitRenderForm.elements.jobId.value);
  if (!(await acquireUiJobLock(jobId, 'batch_render'))) return;
  jobsState.unitRenderRunning = true;
  startUnitRenderButton.disabled = true;
  browseUnitRenderOutputButton.disabled = true;
  unitRenderProgress.value = 0;
  unitRenderStatus.textContent = 'Preparing orders...';
  try {
    const result = await trecsApi('runUnitRender').runUnitRender({
      jobId,
      source: unitRenderForm.elements.source.value,
      sourceValue: unitRenderForm.elements.sourceValue.value,
      sortBy: unitRenderForm.elements.sortBy.value,
      includeUnits: unitRenderForm.elements.includeUnits.checked,
      includeEnvelopes: unitRenderForm.elements.includeEnvelopes.checked,
      includeLabels: unitRenderForm.elements.includeLabels.checked,
      outputFolder
    });
    unitRenderStatus.textContent = `Complete: ${result.units} unit sheets, ${result.tenByThirteens || 0} 10x13s, ${result.digitalDownloads || 0} digital downloads, ${result.envelopes} envelopes, ${result.largeEnvelopes} large envelopes, ${result.labels} labels. ${result.unsupportedItems.length} template items skipped${result.missingImagePrep?.length ? `; ${result.missingImagePrep.length} missing ImagePrep image(s)` : ''}.`;
  } catch (error) {
    unitRenderStatus.textContent = error.message || 'Render failed.';
    console.error(error);
  } finally {
    await releaseUiJobLocks(jobId);
    jobsState.unitRenderRunning = false;
    startUnitRenderButton.disabled = false;
    browseUnitRenderOutputButton.disabled = false;
  }
}

function selectedCompositeClass() {
  return jobsState.compositeSetup?.classes.find((group) => group.homeroom === jobsState.compositeHomeroom) || null;
}

function compositeInput() {
  const group = selectedCompositeClass();
  return {
    jobId: Number(compositeJobSelect.value),
    homeroom: group?.homeroom || '',
    type: jobsState.compositePreviewKind,
    featuredSubjectId: Number(compositeFeaturedStudent.value || group?.featuredStudents?.[0]?.id || 0),
    schoolName: compositeRenderForm.elements.schoolName.value,
    principal: compositeRenderForm.elements.principal.value,
    additionalStaff1Id: Number(compositeRenderForm.elements.additionalStaff1Id.value || 0),
    additionalStaff2Id: Number(compositeRenderForm.elements.additionalStaff2Id.value || 0),
    schoolYear: compositeRenderForm.elements.schoolYear.value,
    classHeading: compositeRenderForm.elements.classHeading.value,
    photographedOnly: compositeRenderForm.elements.photographedOnly.checked,
    includeStaff: compositeRenderForm.elements.includeStaff.checked,
    includeNames: compositeRenderForm.elements.includeNames.checked
  };
}

function renderCompositeClasses() {
  const setup = jobsState.compositeSetup;
  const classes = setup?.classes || [];
  compositeClassCount.textContent = `${formatNumber(classes.length)} classes`;
  if (!classes.length) {
    compositeClassList.innerHTML = '<div class="empty-state">This job has no homerooms to build.</div>';
    compositePreviewStage.innerHTML = '<div class="empty-state">No class is available.</div>';
    return;
  }
  if (!classes.some((group) => group.homeroom === jobsState.compositeHomeroom)) jobsState.compositeHomeroom = classes[0].homeroom;
  compositeClassList.innerHTML = classes.map((group) => {
    const overLimit = group.traditionalLayout === 'Over legacy limit' || group.starLayout === 'Over legacy limit';
    return `<button type="button" class="composite-class-item ${group.homeroom === jobsState.compositeHomeroom ? 'selected' : ''}" data-composite-homeroom="${escapeHtml(group.homeroom)}">
      <span><strong>${escapeHtml(group.homeroom)}</strong><em>${escapeHtml(group.gradeLabel || 'No grade label')}</em></span>
      <span class="composite-class-counts"><b>${formatNumber(group.students)}</b> students · ${formatNumber(group.photographed)} photos</span>
      <span class="composite-class-orders">${formatNumber(group.traditionalOrders)} class · ${formatNumber(group.starOrders)} STAR orders${overLimit ? ' · OVER LIMIT' : ''}</span>
    </button>`;
  }).join('');
  compositeClassList.querySelectorAll('[data-composite-homeroom]').forEach((button) => button.addEventListener('click', () => {
    jobsState.compositeHomeroom = button.dataset.compositeHomeroom;
    compositeRenderForm.elements.classHeading.value = '';
    renderCompositeClasses();
    updateCompositeFeaturedStudents();
    refreshCompositePreview();
  }));
}

function updateCompositeFeaturedStudents() {
  const group = selectedCompositeClass();
  const featured = group?.featuredStudents || [];
  compositeFeaturedField.hidden = jobsState.compositePreviewKind !== 'star';
  compositeFeaturedStudent.innerHTML = featured.map((student) => `<option value="${student.id}">${escapeHtml(`${student.name} — Ref ${student.ref || ''}${student.hasPhoto ? '' : ' — NO PHOTO'}${student.starOrders ? ` — ${student.starOrders} STAR` : ''}`)}</option>`).join('');
}

function compositeStaffLabel(staff) {
  const details = [staff.homeroom, staff.grade || staff.subjectType].filter(Boolean).join(' / ');
  return `${staff.name || `Ref ${staff.ref || staff.id}`}${details ? ` - ${details}` : ''}${staff.hasPhoto ? '' : ' - NO PHOTO'}`;
}

function setSidebarCollapsed(collapsed) {
  appShell.classList.toggle('sidebar-collapsed', collapsed);
  toggleSidebarButton.title = collapsed ? 'Show menu' : 'Hide menu';
  toggleSidebarButton.setAttribute('aria-label', collapsed ? 'Show menu' : 'Hide menu');
}

function updateCompositeAdditionalStaffOptions() {
  const staff = jobsState.compositeSetup?.staff || [];
  const options = `<option value="">None</option>${staff.map((subject) => `<option value="${subject.id}">${escapeHtml(compositeStaffLabel(subject))}</option>`).join('')}`;
  ['additionalStaff1Id', 'additionalStaff2Id'].forEach((field) => {
    const select = compositeRenderForm.elements[field];
    if (!select) return;
    const current = select.value;
    select.innerHTML = options;
    if (staff.some((subject) => String(subject.id) === current)) select.value = current;
  });
}

function renderCompositeJobSummary() {
  const setup = jobsState.compositeSetup; const classes = setup?.classes || [];
  const students = classes.reduce((total, group) => total + Number(group.students || 0), 0);
  const photographed = classes.reduce((total, group) => total + Number(group.photographed || 0), 0);
  const starOrders = classes.reduce((total, group) => total + Number(group.starOrders || 0), 0);
  compositeJobMetrics.innerHTML = `<span><strong>${formatNumber(classes.length)}</strong> classes</span><span><strong>${formatNumber(students)}</strong> students</span><span><strong>${formatNumber(photographed)}</strong> photos</span><span><strong>${formatNumber(starOrders)}</strong> STAR orders</span>`;
}

async function loadCompositeSetup(jobId = null) {
  if (jobsState.compositeRunning) return;
  compositeStatus.textContent = 'Loading class groups...';
  const previousJobId = jobId || compositeJobSelect.value || null;
  jobsState.compositeSetup = await trecsApi('getCompositeSetup').getCompositeSetup(previousJobId);
  const setup = jobsState.compositeSetup;
  compositeJobSelect.innerHTML = setup.jobs.map((job) => `<option value="${job.id}" ${Number(job.id) === Number(setup.selectedJobId) ? 'selected' : ''}>${escapeHtml(`${job.clientName} — ${job.jobName} — ${job.classes} classes`)}</option>`).join('');
  compositeRenderForm.elements.schoolName.value = setup.job?.clientName || '';
  compositeRenderForm.elements.schoolYear.value = setup.job?.schoolYear || '';
  updateCompositeAdditionalStaffOptions();
  jobsState.compositeHomeroom = setup.classes[0]?.homeroom || '';
  renderCompositeJobSummary();
  renderCompositeClasses();
  updateCompositeFeaturedStudents();
  compositeStatus.textContent = setup.classes.length ? 'Ready. Preview a class or choose an output folder.' : 'This job has no class groups.';
  if (setup.classes.length) await refreshCompositePreview();
}

async function refreshCompositePreview() {
  const group = selectedCompositeClass();
  if (!group || jobsState.compositeRunning) return;
  refreshCompositePreviewButton.disabled = true;
  compositePreviewStage.innerHTML = '<div class="empty-state">Building full-resolution preview...</div>';
  try {
    const result = await trecsApi('previewComposite').previewComposite(compositeInput());
    compositePreviewStage.innerHTML = `<img src="${result.dataUrl}" alt="${escapeHtml(`${group.homeroom} ${jobsState.compositePreviewKind} composite preview`)}">`;
    compositePreviewMeta.textContent = `${group.homeroom} · ${result.layout} layout · ${result.studentCount} selected students · ${result.width} × ${result.height} pixels at 300 DPI output`;
  } catch (error) {
    compositePreviewStage.innerHTML = `<div class="empty-state error-text">${escapeHtml(error.message || 'Preview failed.')}</div>`;
    compositePreviewMeta.textContent = '';
  } finally {
    refreshCompositePreviewButton.disabled = false;
  }
}

async function browseCompositeOutput() {
  const result = await trecsApi('chooseCompositeOutputFolder').chooseCompositeOutputFolder();
  if (!result || result.canceled) return;
  compositeRenderForm.elements.outputFolder.value = result.folderPath || '';
  compositeStatus.textContent = 'Output folder selected.';
}

async function submitCompositeRender(event) {
  event.preventDefault();
  if (jobsState.compositeRunning) return;
  const input = compositeInput();
  input.scope = compositeRenderForm.elements.scope.value;
  input.outputFolder = compositeRenderForm.elements.outputFolder.value;
  input.includeTraditional = compositeRenderForm.elements.includeTraditional.checked;
  input.includeStar = compositeRenderForm.elements.includeStar.checked;
  input.includePurchaserCopies = compositeRenderForm.elements.includePurchaserCopies.checked;
  if (input.scope === 'all') input.classHeading = '';
  if (!input.outputFolder) {
    compositeStatus.textContent = 'Choose an output folder first.';
    return;
  }
  jobsState.compositeRunning = true; renderCompositesButton.disabled = true; browseCompositeOutputButton.disabled = true; compositeProgress.value = 0;
  try {
    const result = await trecsApi('renderComposites').renderComposites(input);
    compositeStatus.textContent = `Complete: ${result.traditionalBackgrounds} traditional backgrounds, ${result.starBackgrounds} STAR backgrounds, ${result.traditionalCopies} traditional buyer copies, and ${result.starCopies} personalized STAR copies.`;
  } catch (error) {
    compositeStatus.textContent = error.message || 'Composite render failed.';
    console.error(error);
  } finally {
    jobsState.compositeRunning = false; renderCompositesButton.disabled = false; browseCompositeOutputButton.disabled = false;
  }
}

async function loadJobs() {
  const [data, fieldSettings] = await Promise.all([
    trecsApi('getJobsData').getJobsData(),
    trecsApi('getStudentFieldSettings').getStudentFieldSettings()
  ]);
  jobsState.jobs = data.jobs;
  jobsState.types = data.types;
  jobsState.clients = data.clients || [];
  jobsState.packagePlans = data.packagePlans || [];
  jobsState.idCardTemplates = data.idCardTemplates || [];
  jobsState.studentFieldSettings = fieldSettings || defaultStudentFieldSettings();
  renderNewSchoolForm();
  renderNewJobForm();
  renderImportPreviousJobForm();
  renderJobsScreen();
}

async function submitNewSchool(event) {
  event.preventDefault();
  const button = newSchoolForm.querySelector('button[type="submit"]');
  button.disabled = true;
  button.textContent = 'Adding...';
  newSchoolStatus.textContent = '';

  try {
    const result = await trecsApi('createClient').createClient({
      displayName: newSchoolForm.elements.displayName.value,
      trecsName: newSchoolForm.elements.trecsName.value,
      referenceNumber: newSchoolForm.elements.referenceNumber.value,
      phone: newSchoolForm.elements.phone.value,
      address: newSchoolForm.elements.address.value,
      city: newSchoolForm.elements.city.value,
      state: newSchoolForm.elements.state.value,
      zip: newSchoolForm.elements.zip.value,
      notes: newSchoolForm.elements.notes.value
    });

    resetNewSchoolForm();
    jobsState.selectedNewClientId = result.id;
    setNewSchoolFormVisible(false);
    setNewJobFormVisible(true);
    await loadDashboard();
    await loadJobs();
  } catch (error) {
    newSchoolStatus.textContent = error.message || 'Add school failed';
    console.error(error);
  } finally {
    button.disabled = false;
    button.textContent = 'Add School';
  }
}

async function submitNewJob(event) {
  event.preventDefault();
  const button = newJobForm.querySelector('button[type="submit"]');
  button.disabled = true;
  button.textContent = 'Creating...';
  newJobStatus.textContent = '';

  try {
    const result = await trecsApi('createJob').createJob({
      clientId: newJobForm.elements.clientId.value,
      name: newJobForm.elements.name.value,
      type: newJobForm.elements.type.value,
      packagePlanId: newJobForm.elements.packagePlanId.value,
      studentIdTemplateId: newJobForm.elements.studentIdTemplateId.value,
      facultyIdTemplateId: newJobForm.elements.facultyIdTemplateId.value,
      shootDate: newJobForm.elements.shootDate.value,
      retakeDate: newJobForm.elements.retakeDate.value,
      rootPath: newJobForm.elements.rootPath.value,
      notes: newJobForm.elements.notes.value
    });

    resetNewJobForm();
    jobsState.selectedJobId = result.id;
    jobsState.selectedType = 'all';
    jobsState.search = '';
    jobsState.detail = null;
    jobsState.lastLaptopPackage = null;
    jobSearchInput.value = '';
    setNewJobFormVisible(false);
    await loadDashboard();
    await loadJobs();
    await loadJobDetail(result.id);
  } catch (error) {
    newJobStatus.textContent = error.message || 'Create failed';
    console.error(error);
  } finally {
    button.disabled = false;
    button.textContent = 'Create Job';
  }
}

async function browsePreviousJobFolder() {
  importPreviousJobStatus.textContent = '';
  try {
    const result = await trecsApi('choosePreviousTrecsJobFolder').choosePreviousTrecsJobFolder();
    if (!result || result.canceled) {
      return;
    }

    importPreviousJobForm.elements.sourceFolder.value = result.folderPath;
    const folderName = result.folderPath.split(/[\\/]/).filter(Boolean).pop();
    if (!importPreviousJobForm.elements.name.value && folderName) {
      importPreviousJobForm.elements.name.value = folderName;
    }
    if (!result.hasStudentsDatabase) {
      importPreviousJobStatus.textContent = 'Database\\Students.accdb was not found in that folder.';
    }
  } catch (error) {
    importPreviousJobStatus.textContent = error.message || 'Folder browse failed';
    console.error(error);
  }
}

async function submitImportPreviousJob(event) {
  event.preventDefault();
  const button = importPreviousJobForm.querySelector('button[type="submit"]');
  button.disabled = true;
  button.textContent = 'Importing...';
  importPreviousJobStatus.textContent = 'Reading old TRECS job...';

  try {
    const result = await trecsApi('importPreviousTrecsJob').importPreviousTrecsJob({
      clientId: importPreviousJobForm.elements.clientId.value,
      name: importPreviousJobForm.elements.name.value,
      type: importPreviousJobForm.elements.type.value,
      packagePlanId: importPreviousJobForm.elements.packagePlanId.value,
      sourceFolder: importPreviousJobForm.elements.sourceFolder.value,
      rootPath: importPreviousJobForm.elements.rootPath.value,
      notes: importPreviousJobForm.elements.notes.value
    });

    resetImportPreviousJobForm();
    jobsState.selectedJobId = result.id;
    jobsState.selectedType = 'all';
    jobsState.search = '';
    jobsState.detail = null;
    jobsState.lastLaptopPackage = null;
    jobSearchInput.value = '';
    setImportPreviousJobFormVisible(false);
    await loadDashboard();
    await loadJobs();
    await loadJobDetail(result.id);
  } catch (error) {
    importPreviousJobStatus.textContent = error.message || 'Import failed';
    console.error(error);
  } finally {
    button.disabled = false;
    button.textContent = 'Import Job';
  }
}

async function loadOnsiteSetup() {
  showJobsForAction();
  if (loadOnsiteSetupButton) {
    loadOnsiteSetupButton.disabled = true;
    loadOnsiteSetupButton.textContent = 'Choosing...';
  }

  try {
    const choice = await trecsApi('chooseOnsiteSetupFolder').chooseOnsiteSetupFolder();
    if (!choice || choice.canceled) {
      return;
    }
    const setupFolders = choice.setupFolders && choice.setupFolders.length ? choice.setupFolders : [];
    if (!setupFolders.length) {
      throw new Error('No onsite setup folders were found. Select an onsite setup folder or a parent folder containing onsite setup folders.');
    }

    if (loadOnsiteSetupButton) {
      loadOnsiteSetupButton.textContent = 'Loading...';
    }
    const result = await trecsApi('loadOnsiteSetups').loadOnsiteSetups({
      setupFolders
    });

    const firstLoaded = result.loaded && result.loaded.length ? result.loaded[0] : null;
    jobsState.selectedJobId = firstLoaded ? firstLoaded.id : jobsState.selectedJobId;
    jobsState.selectedType = 'all';
    jobsState.search = '';
    jobsState.detail = null;
    jobsState.lastLaptopPackage = null;
    jobSearchInput.value = '';
    setImportPreviousJobFormVisible(false);
    await loadDashboard();
    await loadJobs();
    if (firstLoaded) {
      await loadJobDetail(firstLoaded.id);
    }
    const skippedText = result.counts.skipped ? `\nSkipped ${result.counts.skipped}.` : '';
    window.alert(`Loaded ${result.counts.loaded} onsite setup${result.counts.loaded === 1 ? '' : 's'}.${skippedText}`);
  } catch (error) {
    window.alert(error.message || 'Load onsite setup failed');
    console.error(error);
  } finally {
    if (loadOnsiteSetupButton) {
      loadOnsiteSetupButton.disabled = false;
      loadOnsiteSetupButton.textContent = 'Load Onsite Setup';
    }
  }
}

async function loadEndOfDayPackage() {
  showJobsForAction();
  if (loadEndOfDayButton) {
    loadEndOfDayButton.disabled = true;
    loadEndOfDayButton.textContent = 'Choosing...';
  }

  try {
    const choice = await trecsApi('chooseEndOfDayPackageFolder').chooseEndOfDayPackageFolder();
    if (!choice || choice.canceled) {
      return;
    }
    if (!choice.hasManifest) {
      throw new Error('end-of-day-manifest.json was not found in that folder.');
    }
    if (!choice.hasDatabase) {
      throw new Error('Database\\job.db was not found in that folder.');
    }
    if (!choice.manifest || choice.manifest.packageType !== 'end_of_day') {
      throw new Error('That folder is not a TRECS End of Day package.');
    }

    openEndOfDayPackageReview(choice);
  } catch (error) {
    window.alert(error.message || 'Load End of Day failed');
    console.error(error);
  } finally {
    if (loadEndOfDayButton) {
      loadEndOfDayButton.disabled = false;
      loadEndOfDayButton.textContent = 'Load End of Day';
    }
  }
}

async function loadDashboard() {
  try {
    const dashboard = await trecsApi('getDashboardData').getDashboardData();
    databasePath.textContent = dashboard.databasePath;
    renderMetrics(dashboard.counts);
    renderJobs(dashboard.jobs);
    renderMigration(dashboard.migration);
  } catch (error) {
    metricGrid.innerHTML = `
      <article class="error">
        <span>Database Error</span>
        <strong>Check console</strong>
      </article>
    `;
    console.error(error);
  }
}

loadDashboard();

toggleSidebarButton.addEventListener('click', () => {
  setSidebarCollapsed(!appShell.classList.contains('sidebar-collapsed'));
});

viewButtons.forEach((button) => {
  button.addEventListener('click', () => {
    if (button.dataset.viewButton === 'jobs') {
      jobsState.selectedTab = 'subjects';
    }
    if (['events', 'products', 'studentLists', 'onlineOrders', 'unitRender', 'batchRender', 'composites'].includes(button.dataset.viewButton) && jobsState.jobWorkspaceOpen) {
      closeJobWorkspace();
    }
    setView(button.dataset.viewButton);
  });
});

eventJobSelect.addEventListener('change', async () => {
  const previousId = jobsState.eventSetup?.selectedEventJobId;
  if (previousId) await releaseUiJobLocks(previousId);
  loadEventWorkflow(Number(eventJobSelect.value)).catch((error) => { eventSetupStatus.textContent = error.message; });
});
linkEventFallJobButton.addEventListener('click', configureSelectedEventFallJob);
importEventImagesButton.addEventListener('click', importSelectedEventImages);
createEventJobButton.addEventListener('click', () => {
  setView('jobs'); setNewJobFormVisible(true); newJobForm.elements.type.value = 'event'; newJobForm.elements.name.focus();
});
eventImageQueue.addEventListener('click', (event) => { const button = event.target.closest('[data-event-entry-id]'); if (button) selectEventEntry(Number(button.dataset.eventEntryId)).catch((error) => { eventOrderStatus.textContent = error.message; }); });
eventQueueFilters.addEventListener('click', (event) => { const button = event.target.closest('[data-event-queue-filter]'); if (!button) return; jobsState.eventQueueFilter = button.dataset.eventQueueFilter; eventQueueFilters.querySelectorAll('[data-event-queue-filter]').forEach((item) => item.classList.toggle('active', item === button)); renderEventQueue(); });
eventImageNumberSearch.addEventListener('input', renderEventQueue);
eventImageNumberSearch.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter') return; event.preventDefault();
  const value = eventImageNumberSearch.value.trim().toLowerCase(); const queue = jobsState.eventSetup?.queue || [];
  const exact = queue.find((entry) => String(entry.imageNumber || '').toLowerCase() === value || String(entry.filename || '').toLowerCase() === value);
  const match = exact || filteredEventQueue()[0];
  if (match) selectEventEntry(match.id).catch((error) => { eventOrderStatus.textContent = error.message; });
});
eventStudentSearch.addEventListener('input', () => { clearTimeout(jobsState.eventSearchTimer); jobsState.eventSearchTimer = setTimeout(() => searchEventStudents().catch((error) => { eventOrderStatus.textContent = error.message; }), 140); });
eventStudentSearch.addEventListener('keydown', (event) => {
  if (!['ArrowDown', 'ArrowUp', 'Enter'].includes(event.key) || !jobsState.eventCandidates.length) return;
  event.preventDefault(); let index = jobsState.eventCandidates.findIndex((candidate) => Number(candidate.id) === Number(jobsState.eventSelectedCandidateId));
  if (event.key === 'ArrowDown') index = Math.min(jobsState.eventCandidates.length - 1, index + 1);
  else if (event.key === 'ArrowUp') index = Math.max(0, index < 0 ? 0 : index - 1);
  else if (index < 0) index = 0;
  selectEventCandidate(jobsState.eventCandidates[index].id, event.key === 'Enter');
});
eventGradeFilter.addEventListener('change', () => searchEventStudents().catch((error) => { eventOrderStatus.textContent = error.message; }));
eventHomeroomFilter.addEventListener('change', () => searchEventStudents().catch((error) => { eventOrderStatus.textContent = error.message; }));
eventStudentResults.addEventListener('click', (event) => { const button = event.target.closest('[data-event-candidate-id]'); if (button) selectEventCandidate(button.dataset.eventCandidateId, false); });
eventStudentResults.addEventListener('dblclick', (event) => { const button = event.target.closest('[data-event-candidate-id]'); if (button) selectEventCandidate(button.dataset.eventCandidateId, true); });
eventPackageCodeShortcuts.addEventListener('click', (event) => { const button = event.target.closest('[data-event-package-code]'); if (!button) return; const input = eventOrderForm.elements.orderCodes; input.value = input.value.trim() ? `${input.value.trim()}.${button.dataset.eventPackageCode}` : button.dataset.eventPackageCode; input.focus(); });
eventOrderForm.addEventListener('submit', (event) => { event.preventDefault(); saveEventOrder(true); });
eventSaveStayButton.addEventListener('click', () => saveEventOrder(false));
eventAddAnotherButton.addEventListener('click', () => { jobsState.eventSelectedCandidateId = null; eventStudentSearch.value = ''; eventOrderForm.reset(); eventOrderForm.elements.paidStatus.value = 'paid'; renderEventSelectedCandidate(); searchEventStudents().catch((error) => { eventOrderStatus.textContent = error.message; }); eventStudentSearch.focus(); });
eventExistingLinks.addEventListener('click', async (event) => { const button = event.target.closest('[data-remove-event-link]'); if (!button || !window.confirm('Remove this fall-student match and its event order?')) return; try { await trecsApi('removeEventSubjectLink').removeEventSubjectLink(Number(button.dataset.removeEventLink)); await loadEventWorkflow(jobsState.eventSetup.selectedEventJobId, jobsState.eventSetup.selectedEntry.id); } catch (error) { eventOrderStatus.textContent = error.message; } });

studentListJobSelect.addEventListener('change', () => loadStudentListSetup(Number(studentListJobSelect.value)).catch((error) => { studentListStatus.textContent = error.message; }));
studentListSearch.addEventListener('input', renderStudentListBuilder);
newStudentListButton.addEventListener('click', startNewStudentList);
addSelectedStudentsButton.addEventListener('click', addCheckedStudentsToList);
saveStudentListButton.addEventListener('click', saveCurrentStudentList);
deleteStudentListButton.addEventListener('click', () => deleteCurrentStudentList().catch((error) => { studentListStatus.textContent = error.message; }));
studentListsSaved.addEventListener('click', (event) => { const button = event.target.closest('[data-list-id]'); if (button) loadStudentListSetup(Number(studentListJobSelect.value), Number(button.dataset.listId)).catch((error) => { studentListStatus.textContent = error.message; }); });
studentListAvailable.addEventListener('change', (event) => { const checkbox = event.target.closest('[data-available-subject]'); if (!checkbox) return; const id = Number(checkbox.dataset.availableSubject); if (checkbox.checked) jobsState.studentListCheckedIds.add(id); else jobsState.studentListCheckedIds.delete(id); });
studentListMembers.addEventListener('click', (event) => { const remove = event.target.closest('[data-member-remove]'); const up = event.target.closest('[data-member-up]'); const down = event.target.closest('[data-member-down]'); if (remove) { jobsState.studentListMemberIds = jobsState.studentListMemberIds.filter((id) => Number(id) !== Number(remove.dataset.memberRemove)); renderStudentListBuilder(); } else if (up) moveStudentListMember(up.dataset.memberUp, -1); else if (down) moveStudentListMember(down.dataset.memberDown, 1); });
onlineOrderJobSelect.addEventListener('change', () => { jobsState.onlineOrderPreview = null; onlineOrderFileName.textContent = 'No file chosen'; renderOnlineOrderPreview(); });
chooseOnlineOrderFileButton.addEventListener('click', chooseOnlineOrderFile);
onlineOrderMapping.addEventListener('change', () => refreshOnlineOrderPreviewFromMapping().catch((error) => { onlineOrderStatus.textContent = error.message; }));
importOnlineOrdersButton.addEventListener('click', importReadyOnlineOrders);
browseBatchRenderOutputButton.addEventListener('click', browseBatchRenderOutput);
refreshBatchRenderButton.addEventListener('click', () => loadBatchRenderSetup().catch((error) => { batchRenderStatus.textContent = error.message; }));
batchRenderForm.addEventListener('submit', submitBatchRender);

setInterval(() => {
  if (activeJobLockIds.size) trecsApi('heartbeatJobSessions').heartbeatJobSessions(Array.from(activeJobLockIds)).catch((error) => console.error('Job lock heartbeat failed', error));
}, 30000);

viewTargets.forEach((button) => {
  button.addEventListener('click', () => {
    if (button.dataset.jobTabTarget) {
      jobsState.selectedTab = button.dataset.jobTabTarget;
    } else if (button.dataset.viewTarget === 'jobs') {
      jobsState.selectedTab = 'subjects';
    }
    setView(button.dataset.viewTarget);
  });
});

jobWorkflowTabs.querySelectorAll('button').forEach((button) => {
  button.addEventListener('click', () => {
    jobsState.selectedTab = button.dataset.jobTab;
    if (jobsView.classList.contains('active-view') && !jobsState.jobWorkspaceOpen) {
      title.textContent = jobsViewTitle();
      updateMainNavigation('jobs');
    }
    renderWorkflowTab();
  });
});

jobSearchInput.addEventListener('input', () => {
  jobsState.search = jobSearchInput.value;
  jobsState.selectedJobId = null;
  renderJobsScreen();
});

backToJobsButton.addEventListener('click', () => {
  if (jobsState.workspaceMode === 'idTemplates') {
    setWorkspaceMode('admin');
  } else if (
    jobsState.workspaceMode === 'capture'
    || jobsState.workspaceMode === 'envelope'
    || jobsState.workspaceMode === 'imageReview'
    || jobsState.workspaceMode === 'pictureDay'
  ) {
    setWorkspaceMode('students');
  } else {
    closeJobWorkspace();
  }
});

if (workspaceStudentsButton) {
  workspaceStudentsButton.addEventListener('click', () => {
    setWorkspaceMode('students');
  });
}

if (workspaceCaptureButton) {
  workspaceCaptureButton.addEventListener('click', async () => {
    if (!jobsState.captureSession) {
      await openCaptureLogin(jobsState.selectedJobId);
      return;
    }
    setWorkspaceMode('capture');
  });
}

if (workspaceEnvelopeButton) {
  workspaceEnvelopeButton.addEventListener('click', () => {
    setWorkspaceMode('envelope');
  });
}

if (workspaceAdminItemsButton) {
  workspaceAdminItemsButton.addEventListener('click', () => {
    setWorkspaceMode('admin');
  });
}

if (refreshPictureDayPrepButton) {
  refreshPictureDayPrepButton.addEventListener('click', () => {
    loadPictureDayPrep(true).catch((error) => {
      pictureDayPrepStatus.textContent = error.message || 'Refresh failed';
      console.error(error);
    });
  });
}

if (workspaceEditJobButton) {
  workspaceEditJobButton.addEventListener('click', openEditJobModal);
}

if (cancelEditJobButton) {
  cancelEditJobButton.addEventListener('click', closeEditJobModal);
}

if (editJobForm) {
  editJobForm.addEventListener('submit', submitEditJob);
}

if (openIdTemplateDesignerButton) {
  openIdTemplateDesignerButton.addEventListener('click', () => {
    setWorkspaceMode('idTemplates');
  });
}

if (idTemplateBackButton) {
  idTemplateBackButton.addEventListener('click', () => {
    setWorkspaceMode('admin');
  });
}

if (newIdTemplateButton) {
  newIdTemplateButton.addEventListener('click', () => {
    jobsState.idTemplateDesigner.template = createDefaultIdTemplate();
    jobsState.idTemplateDesigner.selectedFileName = '';
    jobsState.idTemplateDesigner.selectedTemplateId = null;
    jobsState.idTemplateDesigner.selectedElement = 'photo';
    idTemplateStatus.textContent = 'New template';
    renderIdTemplateDesigner();
  });
}

if (idTemplateList) {
  idTemplateList.addEventListener('click', (event) => {
    const button = event.target.closest('[data-id-template-file]');
    if (!button) {
      return;
    }
    loadIdTemplateFile(button.dataset.idTemplateFile).catch((error) => {
      idTemplateStatus.textContent = error.message || 'Could not load template';
      console.error(error);
    });
  });
}

if (idTemplateForm) {
  idTemplateForm.addEventListener('submit', (event) => {
    event.preventDefault();
    saveCurrentIdTemplate().catch((error) => {
      idTemplateStatus.textContent = error.message || 'Could not save template';
      console.error(error);
    });
  });
  idTemplateForm.addEventListener('change', () => {
    const template = jobsState.idTemplateDesigner.template || createDefaultIdTemplate();
    jobsState.idTemplateDesigner.template = template;
    template.name = idTemplateForm.elements.templateName.value.trim() || template.name;
    template.templateType = idTemplateForm.elements.templateType.value === 'staff' ? 'staff' : 'student';
    setIdTemplateOrientation(template, idTemplateForm.elements.orientation.value);
    template.background = idTemplateForm.elements.background.value || '';
    renderIdTemplateStage();
  });
}

if (chooseIdTemplateBackgroundButton) {
  chooseIdTemplateBackgroundButton.addEventListener('click', async () => {
    try {
      const result = await trecsApi('chooseIdTemplateBackground').chooseIdTemplateBackground(jobsState.selectedJobId);
      if (!result || result.canceled) {
        return;
      }
      jobsState.idTemplateDesigner.backgrounds.push(result);
      const template = jobsState.idTemplateDesigner.template || createDefaultIdTemplate();
      template.background = result.fileName;
      jobsState.idTemplateDesigner.template = template;
      renderIdTemplateDesigner();
    } catch (error) {
      idTemplateStatus.textContent = error.message || 'Could not import background';
      console.error(error);
    }
  });
}

if (idTemplateStage) {
  idTemplateStage.addEventListener('pointerdown', (event) => {
    const elementNode = event.target.closest('[data-id-template-element]');
    if (!elementNode) {
      return;
    }
    const key = elementNode.dataset.idTemplateElement;
    const template = jobsState.idTemplateDesigner.template;
    const element = template && template.elements && template.elements[key];
    if (!element) {
      return;
    }
    jobsState.idTemplateDesigner.selectedElement = key;
    jobsState.idTemplateDesigner.drag = {
      key,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: Number(element.x || 0),
      originY: Number(element.y || 0)
    };
    elementNode.setPointerCapture(event.pointerId);
    renderIdTemplateStage();
    renderIdTemplateProperties();
  });

  idTemplateStage.addEventListener('pointermove', (event) => {
    const drag = jobsState.idTemplateDesigner.drag;
    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }
    const template = jobsState.idTemplateDesigner.template;
    const element = template && template.elements && template.elements[drag.key];
    if (!element) {
      return;
    }
    const rect = idTemplateStage.getBoundingClientRect();
    const card = idTemplateCardSize(template);
    const scaleX = card.width / rect.width;
    const scaleY = card.height / rect.height;
    element.x = Math.max(0, Math.round(drag.originX + ((event.clientX - drag.startX) * scaleX)));
    element.y = Math.max(0, Math.round(drag.originY + ((event.clientY - drag.startY) * scaleY)));
    renderIdTemplateStage();
    renderIdTemplateProperties();
  });

  idTemplateStage.addEventListener('pointerup', (event) => {
    const drag = jobsState.idTemplateDesigner.drag;
    if (drag && drag.pointerId === event.pointerId) {
      jobsState.idTemplateDesigner.drag = null;
    }
  });
}

if (idTemplateProperties) {
  idTemplateProperties.addEventListener('change', (event) => {
    const control = event.target.closest('[data-id-template-property]');
    if (!control) {
      return;
    }
    updateSelectedIdTemplateElement(
      control.dataset.idTemplateProperty,
      control.type === 'checkbox' ? control.checked : control.value,
      control.type
    );
  });
}

adminOptionsForm.addEventListener('change', () => {
  const options = adminOutputOptions();
  applyAdminOptions(options);
  jobsState.adminItems = null;
  jobsState.adminItemsLoading = false;
  jobsState.adminRunStatus = { running: false, progress: 0, message: 'Ready' };
  renderAdminItemsWorkspace();
});

if (browseAdminOutputFolderButton) {
  browseAdminOutputFolderButton.addEventListener('click', chooseAdminOutputFolder);
}

if (runAdminItemsButton) {
  runAdminItemsButton.addEventListener('click', () => {
    runSelectedAdminItems().catch((error) => {
      jobsState.adminRunStatus = {
        running: false,
        progress: 0,
        message: error.message || 'Admin item run failed'
      };
      renderAdminRunState();
      console.error(error);
    });
  });
}

document.addEventListener('click', (event) => {
  const browseButton = event.target.closest ? event.target.closest('#browseAdminOutputFolderButton') : null;
  if (browseButton && browseButton !== browseAdminOutputFolderButton) {
    chooseAdminOutputFolder();
    return;
  }

  const runButton = event.target.closest ? event.target.closest('#runAdminItemsButton') : null;
  if (runButton && runButton !== runAdminItemsButton) {
    runSelectedAdminItems().catch((error) => {
      jobsState.adminRunStatus = {
        running: false,
        progress: 0,
        message: error.message || 'Admin item run failed'
      };
      renderAdminRunState();
      console.error(error);
    });
  }
});

if (workspaceAddBlankButton) {
  workspaceAddBlankButton.addEventListener('click', () => {
    setAddRecordsModalVisible(true);
  });
}

cancelAddRecordsButton.addEventListener('click', () => {
  setAddRecordsModalVisible(false);
});

addRecordsForm.addEventListener('submit', submitAddRecords);

if (cameraCardsForm) {
  cameraCardsForm.addEventListener('submit', submitCameraCardsForm);
  cameraCardsForm.elements.source.addEventListener('change', () => {
    jobsState.cameraCardSource = cameraCardsForm.elements.source.value || 'all';
    jobsState.cameraCardSourceValue = '';
    jobsState.cameraCardListName = '';
    renderCameraCardsModalOptions();
  });
  cameraCardsForm.elements.sourceValue.addEventListener('change', () => {
    jobsState.cameraCardSourceValue = cameraCardsForm.elements.sourceValue.value || '';
    if (cameraCardsForm.elements.source.value === 'list') {
      jobsState.cameraCardListName = jobsState.cameraCardSourceValue;
    }
  });
  cameraCardsForm.elements.sortMethod.addEventListener('change', () => {
    jobsState.cameraCardSortMethod = cameraCardsForm.elements.sortMethod.value || 'alpha_grade';
  });
}

if (cancelCameraCardsButton) {
  cancelCameraCardsButton.addEventListener('click', closeCameraCardsModal);
}

if (browseCameraCardsOutputButton) {
  browseCameraCardsOutputButton.addEventListener('click', browseCameraCardsOutputFolder);
}

if (closeCropToolButton) {
  closeCropToolButton.addEventListener('click', () => setCropToolVisible(false));
}

if (chooseCropToolImageButton) {
  chooseCropToolImageButton.addEventListener('click', () => {
    chooseCropToolImage().catch((error) => {
      setCropToolStatus(error.message || 'Could not open image.');
      console.error(error);
    });
  });
}

if (chooseCropToolInputFolderButton) {
  chooseCropToolInputFolderButton.addEventListener('click', () => {
    chooseCropToolInputFolder().catch((error) => {
      setCropToolStatus(error.message || 'Could not open input folder.');
      console.error(error);
    });
  });
}

if (chooseCropToolOutputFolderButton) {
  chooseCropToolOutputFolderButton.addEventListener('click', () => {
    chooseCropToolOutputFolder().catch((error) => {
      setCropToolStatus(error.message || 'Could not choose output folder.');
      console.error(error);
    });
  });
}

if (resetCropToolButton) {
  resetCropToolButton.addEventListener('click', resetCropToolImage);
}

if (rotateCropToolButton) {
  rotateCropToolButton.addEventListener('click', () => {
    if (!jobsState.cropTool.image) {
      return;
    }
    jobsState.cropTool.rotation = (cropToolRotation() + 270) % 360;
    resetCropToolImage();
    setCropToolStatus(`${jobsState.cropTool.filename || 'Image'} rotated 90 degrees counter clockwise.`);
  });
}

if (saveCropToolButton) {
  saveCropToolButton.addEventListener('click', () => {
    saveCropToolImage().catch((error) => {
      setCropToolStatus(error.message || 'Could not save crop.');
      console.error(error);
    });
  });
}

if (cropToolZoom) {
  cropToolZoom.addEventListener('input', () => {
    const image = jobsState.cropTool.image;
    if (!image) {
      return;
    }
    const previousZoom = jobsState.cropTool.zoom;
    const nextZoom = Number(cropToolZoom.value) || 1;
    const centerX = cropToolCanvas.width / 2;
    const centerY = cropToolCanvas.height / 2;
    const ratio = nextZoom / previousZoom;
    jobsState.cropTool.offsetX = centerX - (centerX - jobsState.cropTool.offsetX) * ratio;
    jobsState.cropTool.offsetY = centerY - (centerY - jobsState.cropTool.offsetY) * ratio;
    jobsState.cropTool.zoom = nextZoom;
    drawCropTool();
  });
}

if (cropToolCanvas) {
  cropToolCanvas.addEventListener('pointerdown', (event) => {
    if (!jobsState.cropTool.image) {
      return;
    }
    cropToolCanvas.setPointerCapture(event.pointerId);
    cropToolCanvas.classList.add('dragging');
    jobsState.cropTool.dragging = true;
    jobsState.cropTool.dragStartX = event.clientX;
    jobsState.cropTool.dragStartY = event.clientY;
    jobsState.cropTool.dragOffsetX = jobsState.cropTool.offsetX;
    jobsState.cropTool.dragOffsetY = jobsState.cropTool.offsetY;
  });

  cropToolCanvas.addEventListener('pointermove', (event) => {
    if (!jobsState.cropTool.dragging) {
      return;
    }
    const rect = cropToolCanvas.getBoundingClientRect();
    const scaleX = cropToolCanvas.width / rect.width;
    const scaleY = cropToolCanvas.height / rect.height;
    jobsState.cropTool.offsetX = jobsState.cropTool.dragOffsetX + (event.clientX - jobsState.cropTool.dragStartX) * scaleX;
    jobsState.cropTool.offsetY = jobsState.cropTool.dragOffsetY + (event.clientY - jobsState.cropTool.dragStartY) * scaleY;
    drawCropTool();
  });

  cropToolCanvas.addEventListener('pointerup', (event) => {
    jobsState.cropTool.dragging = false;
    cropToolCanvas.classList.remove('dragging');
    if (cropToolCanvas.hasPointerCapture(event.pointerId)) {
      cropToolCanvas.releasePointerCapture(event.pointerId);
    }
  });

  cropToolCanvas.addEventListener('pointercancel', () => {
    jobsState.cropTool.dragging = false;
    cropToolCanvas.classList.remove('dragging');
  });
}

captureEntryForm.addEventListener('submit', (event) => {
  event.preventDefault();
  lookupCaptureSubject();
});
captureEntryForm.elements.barcode.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    lookupCaptureSubject();
  }
});
captureEntryForm.elements.studentSearch.addEventListener('input', () => {
  clearTimeout(jobsState.captureSearchTimer);
  jobsState.captureSearchTimer = setTimeout(searchCaptureStudents, 180);
});
captureEntryForm.elements.searchMode.addEventListener('change', () => {
  clearTimeout(jobsState.captureSearchTimer);
  jobsState.captureSearchTimer = setTimeout(searchCaptureStudents, 60);
});
captureEntryForm.elements.studentSearch.addEventListener('keydown', (event) => {
  const results = jobsState.captureSearchResults || [];
  if (event.key === 'ArrowDown' && results.length) {
    event.preventDefault();
    jobsState.captureSearchActiveIndex = Math.min(results.length - 1, jobsState.captureSearchActiveIndex + 1);
    renderCaptureStudentSearchResults();
  } else if (event.key === 'ArrowUp' && results.length) {
    event.preventDefault();
    jobsState.captureSearchActiveIndex = Math.max(0, jobsState.captureSearchActiveIndex - 1);
    renderCaptureStudentSearchResults();
  } else if (event.key === 'Enter' && results.length) {
    event.preventDefault();
    selectCaptureSearchResult(Math.max(0, jobsState.captureSearchActiveIndex));
  } else if (event.key === 'Escape') {
    hideCaptureStudentSearch();
  }
});
captureEntryForm.elements.studentSearch.addEventListener('blur', () => {
  setTimeout(hideCaptureStudentSearch, 120);
});
if (captureFileModeToggle) {
  captureFileModeToggle.addEventListener('click', (event) => {
    const button = event.target.closest('[data-capture-file-mode]');
    if (!button) {
      return;
    }
    setCaptureFileMode(button.dataset.captureFileMode);
  });
}
if (captureBackToStudentsButton) {
  captureBackToStudentsButton.addEventListener('click', () => {
    setWorkspaceMode('students');
  });
}

workspaceEditStudentButton.addEventListener('click', () => {
  jobsState.showStudentEditForm = !jobsState.showStudentEditForm;
  renderStudentWorkspace();
});

workspacePreviousButton.addEventListener('click', () => {
  moveWorkspaceSubject(-1);
});

workspaceNextButton.addEventListener('click', () => {
  moveWorkspaceSubject(1);
});

workspaceStudentSearch.addEventListener('input', () => {
  jobsState.workspaceStudentSearch = workspaceStudentSearch.value;
  renderStudentWorkspace();
});

envelopeEntryForm.addEventListener('submit', submitEnvelopeOrder);
envelopeEntryForm.elements.barcode.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    lookupEnvelopeSubject();
  }
});
envelopeEntryForm.elements.studentSearch.addEventListener('input', () => {
  clearTimeout(jobsState.envelopeSearchTimer);
  jobsState.envelopeSearchTimer = setTimeout(searchEnvelopeStudents, 180);
});
envelopeEntryForm.elements.studentSearch.addEventListener('keydown', (event) => {
  const results = jobsState.envelopeSearchResults || [];
  if (event.key === 'ArrowDown' && results.length) {
    event.preventDefault();
    jobsState.envelopeSearchActiveIndex = Math.min(results.length - 1, jobsState.envelopeSearchActiveIndex + 1);
    renderEnvelopeStudentSearchResults();
  } else if (event.key === 'ArrowUp' && results.length) {
    event.preventDefault();
    jobsState.envelopeSearchActiveIndex = Math.max(0, jobsState.envelopeSearchActiveIndex - 1);
    renderEnvelopeStudentSearchResults();
  } else if (event.key === 'Enter' && results.length) {
    event.preventDefault();
    selectEnvelopeSearchResult(Math.max(0, jobsState.envelopeSearchActiveIndex));
  } else if (event.key === 'Escape') {
    hideEnvelopeStudentSearch();
  }
});
envelopeEntryForm.elements.studentSearch.addEventListener('blur', () => {
  setTimeout(hideEnvelopeStudentSearch, 120);
});
envelopeEntryForm.elements.orderCodes.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    submitEnvelopeOrder(event);
  }
});
confirmEnvelopeButton.addEventListener('click', () => {
  respondEnvelopeConfirm(true);
});
cancelEnvelopeConfirmButton.addEventListener('click', () => {
  respondEnvelopeConfirm(false);
});
closeOrderEnvelopeButton.addEventListener('click', closeOrderEnvelope);
closeImageLightboxButton.addEventListener('click', closeImageLightbox);
previousLightboxImageButton.addEventListener('click', () => moveLightboxImage(-1));
nextLightboxImageButton.addEventListener('click', () => moveLightboxImage(1));
selectLightboxImageButton.addEventListener('click', selectCurrentLightboxImage);
imageLightboxModal.addEventListener('click', (event) => {
  if (event.target === imageLightboxModal) {
    closeImageLightbox();
  }
});
cancelStudentFieldSettingsButton.addEventListener('click', closeStudentFieldSettings);
studentFieldSettingsModal.addEventListener('click', (event) => {
  if (event.target === studentFieldSettingsModal) {
    closeStudentFieldSettings();
  }
});
studentFieldSettingsForm.elements.scope.addEventListener('change', () => {
  jobsState.studentFieldSettingsScope = studentFieldSettingsForm.elements.scope.value;
  studentFieldSettingsStatus.textContent = '';
  renderStudentFieldSettingsModal();
});
studentFieldSettingsForm.elements.inheritGlobal.addEventListener('change', () => {
  studentFieldSettingsStatus.textContent = '';
  studentFieldSettingsList.hidden = studentFieldSettingsForm.elements.scope.value !== 'global'
    && studentFieldSettingsForm.elements.inheritGlobal.checked;
});
studentFieldSettingsForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  try {
    await saveStudentFieldSettingsFromForm(false);
  } catch (error) {
    studentFieldSettingsStatus.textContent = error.message || 'Save failed';
    console.error(error);
  }
});
applyStudentFieldsToAllButton.addEventListener('click', async () => {
  try {
    await saveStudentFieldSettingsFromForm(true);
  } catch (error) {
    studentFieldSettingsStatus.textContent = error.message || 'Apply failed';
    console.error(error);
  }
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && imageLightboxModal && !imageLightboxModal.hidden) {
    closeImageLightbox();
  } else if (event.key === 'ArrowLeft' && imageLightboxModal && !imageLightboxModal.hidden) {
    moveLightboxImage(-1);
  } else if (event.key === 'ArrowRight' && imageLightboxModal && !imageLightboxModal.hidden) {
    moveLightboxImage(1);
  } else if (event.key === 'Escape' && studentFieldSettingsModal && !studentFieldSettingsModal.hidden) {
    closeStudentFieldSettings();
  }
});
assignEnvelopeScanButton.addEventListener('click', assignViewedEnvelopeScan);
deleteEnvelopeScanButton.addEventListener('click', deleteViewedEnvelopeScan);
cancelEditOrderButton.addEventListener('click', closeEditOrder);
editOrderForm.addEventListener('submit', submitEditOrder);
deleteOrderButton.addEventListener('click', async () => {
  const orderId = jobsState.editingOrderId;
  closeEditOrder();
  if (orderId) {
    await deleteWorkspaceOrder(orderId);
  }
});
cancelEndOfDayButton.addEventListener('click', () => {
  setEndOfDayModalVisible(false);
});
confirmEndOfDayButton.addEventListener('click', confirmEndOfDayPackage);
if (closeCroppedMediumButton) {
  closeCroppedMediumButton.addEventListener('click', () => {
    if (!closeCroppedMediumButton.disabled) {
      setCroppedMediumModalVisible(false);
    }
  });
}
endOfDayModal.addEventListener('wheel', (event) => {
  if (endOfDayModal.hidden) {
    return;
  }

  const target = event.target instanceof Element ? event.target : event.target.parentElement;
  const candidates = target
    ? Array.from(target.closest('.end-of-day-card')?.querySelectorAll('.end-of-day-section-body, .end-of-day-review') || [])
    : [];
  const nearestScrollable = target ? target.closest('.end-of-day-section-body, .end-of-day-review') : null;
  const scrollTarget = [nearestScrollable, ...candidates]
    .filter(Boolean)
    .find((candidate) => {
      const canScrollDown = event.deltaY > 0 && candidate.scrollTop + candidate.clientHeight < candidate.scrollHeight - 1;
      const canScrollUp = event.deltaY < 0 && candidate.scrollTop > 0;
      return canScrollDown || canScrollUp;
    });
  if (!scrollTarget) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  scrollTarget.scrollTop += event.deltaY;
}, { passive: false });
cancelSchoolDataButton.addEventListener('click', () => {
  setSchoolDataModalVisible(false);
});
browseSchoolDataButton.addEventListener('click', browseSchoolDataFile);
confirmSchoolDataButton.addEventListener('click', confirmSchoolDataImport);
captureLoginForm.addEventListener('submit', submitCaptureLogin);
cancelCaptureLoginButton.addEventListener('click', () => {
  const jobId = jobsState.pendingCaptureJobId;
  setCaptureLoginVisible(false);
  if (jobId && !jobsState.jobWorkspaceOpen) releaseUiJobLocks(jobId).catch((error) => console.error(error));
});
window.addEventListener('focus', () => {
  if (!captureLoginModal.hidden) {
    focusCaptureLoginPhotographer();
  }
});
refreshUnlinkedEnvelopesButton.addEventListener('click', loadUnlinkedEnvelopeScans);
if (window.trecs && typeof window.trecs.onEnvelopeScanImported === 'function') {
  window.trecs.onEnvelopeScanImported(handleEnvelopeScanImported);
}
if (window.trecs && typeof window.trecs.onCaptureImageImported === 'function') {
  window.trecs.onCaptureImageImported(handleCaptureImageImported);
}

if (newSchoolButton) {
  newSchoolButton.addEventListener('click', () => {
    showJobsForAction();
    setNewSchoolFormVisible(!jobsState.showNewSchoolForm);
  });
}

cancelNewSchoolButton.addEventListener('click', () => {
  setNewSchoolFormVisible(false);
});

newSchoolForm.addEventListener('submit', submitNewSchool);

if (newJobButton) {
  newJobButton.addEventListener('click', () => {
    showJobsForAction();
    setNewJobFormVisible(!jobsState.showNewJobForm);
  });
}

cancelNewJobButton.addEventListener('click', () => {
  setNewJobFormVisible(false);
});

newJobForm.addEventListener('submit', submitNewJob);

if (importPreviousJobButton) {
  importPreviousJobButton.addEventListener('click', () => {
    showJobsForAction();
    setImportPreviousJobFormVisible(!jobsState.showImportPreviousJobForm);
  });
}

if (loadOnsiteSetupButton) {
  loadOnsiteSetupButton.addEventListener('click', loadOnsiteSetup);
}
if (loadEndOfDayButton) {
  loadEndOfDayButton.addEventListener('click', loadEndOfDayPackage);
}

cancelImportPreviousJobButton.addEventListener('click', () => {
  setImportPreviousJobFormVisible(false);
});

browsePreviousJobFolderButton.addEventListener('click', browsePreviousJobFolder);
importPreviousJobForm.addEventListener('submit', submitImportPreviousJob);

unitRenderForm.elements.jobId.addEventListener('change', () => {
  loadUnitRenderSetup(Number(unitRenderForm.elements.jobId.value)).catch((error) => {
    unitRenderStatus.textContent = error.message || 'Could not load job render options.';
  });
});
unitRenderForm.elements.source.addEventListener('change', renderUnitRenderFilter);
browseUnitRenderOutputButton.addEventListener('click', browseUnitRenderOutput);
exportImagePrepButton.addEventListener('click', exportUnitImagePrep);
unitRenderForm.addEventListener('submit', submitUnitRender);
compositeJobSelect.addEventListener('change', () => {
  loadCompositeSetup(Number(compositeJobSelect.value)).catch((error) => {
    compositeStatus.textContent = error.message || 'Could not load composite classes.';
  });
});
compositePreviewType.querySelectorAll('[data-composite-type]').forEach((button) => button.addEventListener('click', () => {
  jobsState.compositePreviewKind = button.dataset.compositeType;
  compositePreviewType.querySelectorAll('[data-composite-type]').forEach((item) => item.classList.toggle('active', item === button));
  updateCompositeFeaturedStudents();
  refreshCompositePreview();
}));
compositeFeaturedStudent.addEventListener('change', refreshCompositePreview);
compositeRenderForm.elements.additionalStaff1Id.addEventListener('change', refreshCompositePreview);
compositeRenderForm.elements.additionalStaff2Id.addEventListener('change', refreshCompositePreview);
refreshCompositePreviewButton.addEventListener('click', refreshCompositePreview);
browseCompositeOutputButton.addEventListener('click', browseCompositeOutput);
compositeRenderForm.addEventListener('submit', submitCompositeRender);
