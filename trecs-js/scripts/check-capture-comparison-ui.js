const { app, BrowserWindow, ipcMain, safeStorage } = require('electron');
const fs = require('fs');
const path = require('path');

async function run() {
  const errors = [];
  const mainSource = fs.readFileSync(path.join(__dirname, '../src/main/main.js'), 'utf8');
  const activityLogChecks = {
    secureTokenGeneration: mainSource.includes("crypto.randomBytes(32).toString('base64url')")
      && mainSource.includes('safeStorage.encryptString(token)')
      && mainSource.includes('clipboard.writeText(token)'),
    localRetryQueue: mainSource.includes("const trecsLogQueuePath = path.join(localWorkstationSettingsFolder, 'trecs-log-queue.json')")
      && mainSource.includes('async function flushTrecsLogQueue()'),
    disabledMeansNoTraffic: mainSource.includes("if (!settings.enabled || !settings.encryptedToken) {\n    return { queued: false, reason: 'disabled' };")
      && mainSource.includes("throw new Error('Google Activity Log is disabled. Enable logging before testing the connection.')"),
    jobCreationHook: mainSource.includes("queueTrecsLogEvent('JOB.CREATED'"),
    workflowHooks: [
      "queueTrecsLogEvent('DATA.LOADED'",
      "queueTrecsLogEvent('ONSITE_SETUP.CREATED'",
      "queueTrecsLogEvent('ONSITE_SETUP.LOADED'",
      "queueTrecsLogEvent('END_OF_DAY.CREATED'",
      "queueTrecsLogEvent('END_OF_DAY.SERVER_LOADED'"
    ].every((text) => mainSource.includes(text))
  };
  let logTokenConfigured = false;
  let logSettings = {
    enabled: false,
    webAppUrl: 'https://script.google.com/macros/s/test-deployment/exec',
    appMode: 'auto',
    resolvedAppMode: 'CAPTURE',
    stationId: 'RENDERMACHINE',
    computerName: 'RENDERMACHINE',
    tokenConfigured: false,
    encryptionAvailable: true,
    storageScope: 'Current Windows user on this computer',
    storageFolder: 'C:\\Users\\Test\\AppData\\Local\\TRECS\\local-settings'
  };
  const safeStorageSentinel = 'TRECS-LOG-SECRET-SENTINEL';
  const safeStorageEncrypted = safeStorage.encryptString(safeStorageSentinel);
  const safeStorageCheck = {
    available: safeStorage.isEncryptionAvailable(),
    encrypted: !safeStorageEncrypted.toString('utf8').includes(safeStorageSentinel),
    decrypts: safeStorage.decryptString(safeStorageEncrypted) === safeStorageSentinel
  };
  ipcMain.handle('dashboard:get', () => ({
    counts: [],
    jobs: [],
    migration: [],
    databasePath: 'capture-comparison-test.db'
  }));
  ipcMain.handle('app:system-info', () => ({
    captureStationMode: true,
    captureHotFolder: ''
  }));
  ipcMain.handle('jobs:list', () => ({
    jobs: [],
    types: [],
    clients: [],
    packagePlans: [],
    idCardTemplates: [],
    databasePath: 'capture-comparison-test.db'
  }));
  ipcMain.handle('app:focus-window', () => true);
  ipcMain.handle('app:show-message', (_event, input) => input);
  ipcMain.handle('app:confirm-action', () => true);
  ipcMain.handle('menu:set-context', (_event, context) => ({ context }));
  ipcMain.handle('settings:student-fields:get', () => ({
    global: { visibleFields: {} },
    jobTypes: {}
  }));
  ipcMain.handle('trecs-log:settings:get', () => ({ ...logSettings, tokenConfigured: logTokenConfigured }));
  ipcMain.handle('trecs-log:settings:save', (_event, input) => {
    if (input.token) logTokenConfigured = true;
    logSettings = {
      ...logSettings,
      enabled: input.enabled === true,
      webAppUrl: input.webAppUrl,
      appMode: input.appMode,
      resolvedAppMode: input.appMode === 'auto' ? 'CAPTURE' : String(input.appMode).toUpperCase(),
      tokenConfigured: logTokenConfigured,
      tokenUpdatedAt: logTokenConfigured ? '2026-08-07T12:00:00.000Z' : null
    };
    return logSettings;
  });
  ipcMain.handle('trecs-log:token:generate', (_event, input) => {
    logTokenConfigured = true;
    logSettings = {
      ...logSettings,
      enabled: input.enabled === true,
      webAppUrl: input.webAppUrl,
      appMode: input.appMode,
      tokenConfigured: true,
      tokenUpdatedAt: '2026-08-07T12:05:00.000Z',
      pendingEvents: 0
    };
    return { ...logSettings, copiedToClipboard: true };
  });
  ipcMain.handle('trecs-log:token:clear', () => {
    logTokenConfigured = false;
    logSettings = { ...logSettings, enabled: false, tokenConfigured: false, tokenUpdatedAt: null };
    return logSettings;
  });
  ipcMain.handle('trecs-log:connection:test', () => ({
    ok: true,
    stationId: 'RENDERMACHINE',
    message: 'Connection successful. A CONNECTION.TEST row was added to TRECS LOG.'
  }));
  ipcMain.handle('capture:start-watcher', () => ({ started: true }));
  ipcMain.handle('capture:subject-images', () => []);
  ipcMain.handle('capture:select-image', () => ({ selected: true }));
  ipcMain.handle('image:preview', (_event, imageId) => ({
    id: Number(imageId),
    filename: `Image ${imageId}`,
    missing: Number(imageId) !== 12,
    dataUrl: Number(imageId) === 12
      ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII='
      : ''
  }));

  const window = new BrowserWindow({
    show: false,
    webPreferences: {
      preload: path.join(__dirname, '../src/preload/preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  window.setSize(1280, 900);

  window.webContents.on('console-message', (_event, level, message) => {
    if (level >= 3) errors.push(message);
  });

  await window.loadFile(path.join(__dirname, '../src/renderer/index.html'));
  window.showInactive();
  await new Promise((resolve) => setTimeout(resolve, 300));

  const result = await window.webContents.executeJavaScript(`
    (async () => {
      const captureNavButton = document.querySelector('[data-view-target="jobs"][data-job-tab-target="capture"]');
      const startupNavigation = {
        selectedTab: jobsState.selectedTab,
        captureSelected: captureNavButton.classList.contains('active'),
        visibleItems: [...navButtons].filter((button) => !button.hidden).map((button) => button.textContent.trim())
      };
      jobsState.captureSubject = {
        id: 1,
        ref: '10010',
        name: 'Test Student',
        firstName: 'Test',
        lastName: 'Student',
        externalId: 'abc123',
        grade: '4a',
        homeroom: 'Smith',
        notes: 'Keep Mixed Case',
        imageAssetId: 10
      };
      jobsState.detail = { subjects: [
        { id: 1, ref: '10010', name: 'Test Student', imageAssetId: 10, photographedStatus: 'photographed' },
        { id: 2, ref: '10009', name: 'Correct Student', grade: '4', homeroom: 'Smith', imageAssetId: 12, photographedStatus: 'photographed' },
        { id: 3, ref: '10008', name: '', firstName: '', lastName: '', externalId: '', grade: '', homeroom: '', imageAssetId: null, photographedStatus: 'unknown' }
      ] };
      jobsState.captureImages = [
        {
          id: 10,
          filename: '10010_MG_0413.JPG',
          capturedAt: '2026-07-30 14:00:00',
          selected: true,
          rawPath: 'C:\\\\Capture\\\\10010_MG_0413.CR2',
          dataUrl: ''
        },
        {
          id: 11,
          filename: '10010_MG_0414.JPG',
          capturedAt: '2026-07-30 14:01:00',
          selected: false,
          rawPath: null,
          dataUrl: ''
        }
      ];
      jobsState.captureSubjectEditId = 1;
      renderCaptureSubject();
      const firstNameInput = captureSubjectDetail.querySelector('input[name="firstName"]');
      firstNameInput.value = 'mixed Case';
      firstNameInput.dispatchEvent(new Event('input', { bubbles: true }));
      const captureFieldChecks = {
        referenceBold: Boolean(captureSubjectDetail.querySelector('.capture-reference-number')),
        editButtonInHeading: Boolean(captureSubjectDetail.querySelector('.subheading .capture-student-edit-button')),
        firstNameUppercase: firstNameInput.value === 'MIXED CASE',
        externalIdUppercase: captureSubjectDetail.querySelector('input[name="externalId"]').value === 'ABC123',
        notesPreserved: captureSubjectDetail.querySelector('textarea[name="notes"]').value === 'Keep Mixed Case',
        idSearchAvailable: Boolean(captureEntryForm.elements.searchMode.querySelector('option[value="id"]'))
      };
      renderCaptureCompare();
      capturePreviewMeta.click();
      const opened = {
        buttonText: capturePreviewMeta.textContent,
        modalVisible: !captureComparisonModal.hidden,
        cardCount: captureComparisonScroller.querySelectorAll('[data-capture-comparison-image]').length,
        appInert: appShell.inert,
        cr2LabelVisible: captureComparisonScroller.textContent.includes('JPG + CR2')
      };
      await selectCaptureImage(11);
      closeCaptureComparison();
      const previewIds = [...captureCompareGrid.querySelectorAll('[data-capture-select-image]')]
        .map((element) => Number(element.dataset.captureSelectImage));
      const selectedPreviewIds = [...captureCompareGrid.querySelectorAll('[data-capture-select-image].selected')]
        .map((element) => Number(element.dataset.captureSelectImage));
      openCaptureImageAction(10, 'wrong_student');
      captureImageActionForm.elements.studentSearch.value = 'Correct Student';
      renderCaptureActionStudentResults();
      captureActionStudentResults.querySelector('[data-capture-action-subject="2"]').click();
      await new Promise((resolve) => setTimeout(resolve, 30));
      const selectedStudentPreview = {
        visible: !captureActionStudentPreview.hidden,
        name: captureActionStudentPreviewName.textContent,
        meta: captureActionStudentPreviewMeta.textContent,
        hasThumbnail: Boolean(captureActionStudentPhoto.querySelector('img'))
      };
      closeCaptureImageAction();
      const endOfDayFixture = {
        hasBaseline: true,
        counts: { capturedImages: 2, capturedRawFiles: 2 },
        wrongReferenceMoves: Array.from({ length: 20 }, (_item, index) => ({
          imageAssetId: 11 + index,
          filename: '10009_MG_' + String(414 + index).padStart(4, '0') + '.JPG',
          sourceRef: '10010',
          sourceName: 'Test Student',
          targetRef: '10009',
          targetName: 'Correct Student',
          photographerName: 'Capture Test'
        })),
        subjectChanges: { newSubjects: [], editedSubjects: [], deletedSubjects: [] }
      };
      jobsState.endOfDayReview = {
        mode: 'create',
        review: endOfDayFixture,
        adjustments: createEndOfDayAdjustments(endOfDayFixture),
        wrongReferenceConfirmed: false
      };
      jobsState.endOfDayCollapsed = { wrongReferenceMoves: false, editedSubjects: true };
      jobsView.classList.add('active-view');
      endOfDayModal.hidden = false;
      renderEndOfDayReview(endOfDayFixture);
      const endOfDayInitiallyDisabled = confirmEndOfDayButton.disabled;
      const wrongReferenceCheckbox = endOfDayReview.querySelector('[data-eod-confirm-wrong-reference]');
      const wrongReferenceBody = endOfDayReview.querySelector('[data-end-of-day-section="wrongReferenceMoves"] .end-of-day-section-body');
      const wrongReferenceSection = wrongReferenceBody.closest('[data-end-of-day-section="wrongReferenceMoves"]');
      const wrongReferenceList = wrongReferenceBody.querySelector('.end-of-day-list');
      const sectionRect = wrongReferenceSection.getBoundingClientRect();
      const checkboxRect = wrongReferenceCheckbox.getBoundingClientRect();
      wrongReferenceList.dispatchEvent(new WheelEvent('wheel', { bubbles: true, cancelable: true, deltaY: 10000 }));
      const lastWrongReferenceRect = wrongReferenceList.lastElementChild.getBoundingClientRect();
      const reviewRectAfterScroll = endOfDayReview.getBoundingClientRect();
      const wrongReferenceLayout = {
        bodyHeight: wrongReferenceBody.clientHeight,
        listHeight: wrongReferenceList.clientHeight,
        listContentHeight: wrongReferenceList.scrollHeight,
        listNotClipped: wrongReferenceList.scrollHeight === wrongReferenceList.clientHeight,
        wheelScrolledReview: endOfDayReview.scrollTop > 0,
        lastItemVisible: lastWrongReferenceRect.top >= reviewRectAfterScroll.top
          && lastWrongReferenceRect.bottom <= reviewRectAfterScroll.bottom,
        confirmationBelowPanel: checkboxRect.top >= sectionRect.bottom
      };
      const wrongReferenceRows = wrongReferenceSection.querySelectorAll('li').length;
      wrongReferenceCheckbox.click();
      renderEndOfDayReview({ ...endOfDayFixture, wrongReferenceMoves: [] });
      const confirmationHiddenWhenEmpty = !endOfDayReview.querySelector('[data-eod-confirm-wrong-reference]');
      endOfDayModal.hidden = true;
      jobsState.detail.summary = {
        activeCaptureImages: 5,
        activeCaptureSubjects: 2,
        subjectsWithPrimaryImage: 2,
        subjects: 786
      };
      renderCapturePhotoCount();
      const successPopup = await showEndOfDaySuccess({
        counts: { capturedImages: 3 },
        packagePath: 'C:\\Exports\\EOD Test'
      });
      const comparisonSelection = {
        selectedImageId: jobsState.captureImages.find((image) => image.selected)?.id || null,
        subjectImageId: jobsState.captureSubject.imageAssetId,
        detailImageId: jobsState.detail.subjects[0].imageAssetId
      };
      jobsState.captureRosterFilter = 'blanks';
      setCaptureRosterOpen(true);
      const blankRow = captureRosterTableBody.querySelector('[data-capture-roster-subject="3"]');
      const rosterChecks = {
        expanded: !captureRosterPanel.hidden,
        studentInfoCollapsed: captureSubjectDetail.hidden,
        blankRows: captureRosterTableBody.querySelectorAll('[data-capture-roster-subject]').length,
        blankLabel: blankRow?.textContent.includes('Blank record') || false
      };
      blankRow.click();
      await new Promise((resolve) => setTimeout(resolve, 40));
      rosterChecks.selectedBlankRecord = jobsState.captureSubject?.id === 3;
      rosterChecks.collapsedAfterSelection = captureRosterPanel.hidden && !captureSubjectDetail.hidden;
      rosterChecks.blankReadyForEditing = jobsState.captureSubjectEditId === 3;
      document.querySelector('[data-view-button="settings"]').click();
      await new Promise((resolve) => setTimeout(resolve, 40));
      const connectionDisabledWhenLoggingOff = testTrecsLogConnectionButton.disabled
        && trecsLogSettingsStatus.textContent.includes('will not queue or send');
      trecsLogSettingsForm.elements.enabled.checked = true;
      trecsLogSettingsForm.elements.enabled.dispatchEvent(new Event('change', { bubbles: true }));
      trecsLogSettingsForm.elements.token.value = 'NEVER-RENDER-THIS-TOKEN';
      trecsLogSettingsForm.elements.token.dispatchEvent(new Event('input', { bubbles: true }));
      testTrecsLogConnectionButton.click();
      await new Promise((resolve) => setTimeout(resolve, 80));
      const connectionPassed = trecsLogSettingsStatus.textContent.includes('Connection successful');
      generateTrecsLogTokenButton.click();
      await new Promise((resolve) => setTimeout(resolve, 80));
      const settingsChecks = {
        visibleOnCaptureStation: !document.querySelector('[data-view-button="settings"]').hidden,
        active: settingsView.classList.contains('active-view'),
        connectionDisabledWhenLoggingOff,
        stationId: trecsLogSettingsForm.elements.stationId.value,
        passwordInput: trecsLogSettingsForm.elements.token.type === 'password',
        tokenClearedAfterSave: trecsLogSettingsForm.elements.token.value === '',
        tokenNotRendered: !settingsView.textContent.includes('NEVER-RENDER-THIS-TOKEN'),
        tokenConfigured: trecsLogSettingsForm.dataset.tokenConfigured === 'true',
        connectionPassed,
        tokenGenerated: trecsLogTokenStatus.textContent.includes('copied to the clipboard'),
        generationInstructions: trecsLogSettingsStatus.textContent.includes('Apps Script STATION_TOKENS'),
        queueStatusVisible: trecsLogQueueStatus.textContent.includes('No activity events'),
        localStorageMessage: trecsLogStorageStatus.textContent.includes('stored locally')
      };
      return {
        ...opened,
        startupNavigation,
        captureFieldChecks,
        closed: captureComparisonModal.hidden && !appShell.inert,
        ...comparisonSelection,
        previewIds,
        selectedPreviewIds,
        selectedStudentPreview,
        wrongReferenceRows,
        wrongReferenceLayout,
        confirmationHiddenWhenEmpty,
        endOfDayInitiallyDisabled,
        endOfDayEnabledAfterConfirmation: !confirmEndOfDayButton.disabled,
        capturePhotoCount: document.getElementById('capturePhotoCount').textContent,
        rosterChecks,
        settingsChecks,
        successPopup
      };
    })()
  `);
  const screenshotFolder = path.resolve(__dirname, '../../exports/ui-tests');
  fs.mkdirSync(screenshotFolder, { recursive: true });
  const settingsScreenshotPath = path.join(screenshotFolder, 'trecs-log-settings.png');
  fs.writeFileSync(settingsScreenshotPath, (await window.webContents.capturePage()).toPNG());

  const passed = result.buttonText === 'Compare 2'
    && result.modalVisible
    && result.cardCount === 2
    && result.appInert
    && result.cr2LabelVisible
    && result.startupNavigation.selectedTab === 'capture'
    && result.startupNavigation.captureSelected
    && result.startupNavigation.visibleItems.join(',') === 'Jobs,Capture,Settings'
    && result.captureFieldChecks.referenceBold
    && result.captureFieldChecks.editButtonInHeading
    && result.captureFieldChecks.firstNameUppercase
    && result.captureFieldChecks.externalIdUppercase
    && result.captureFieldChecks.notesPreserved
    && result.captureFieldChecks.idSearchAvailable
    && result.closed
    && result.selectedImageId === 11
    && result.subjectImageId === 11
    && result.detailImageId === 11
    && result.previewIds[0] === 10
    && result.previewIds[1] === 11
    && result.selectedPreviewIds.length === 1
    && result.selectedPreviewIds[0] === 11
    && result.selectedStudentPreview.visible
    && result.selectedStudentPreview.name === '10009 Correct Student'
    && result.selectedStudentPreview.meta === '4 / Smith'
    && result.selectedStudentPreview.hasThumbnail
    && result.wrongReferenceRows === 20
    && result.wrongReferenceLayout.listNotClipped
    && result.wrongReferenceLayout.wheelScrolledReview
    && result.wrongReferenceLayout.lastItemVisible
    && result.wrongReferenceLayout.confirmationBelowPanel
    && result.confirmationHiddenWhenEmpty
    && result.endOfDayInitiallyDisabled
    && result.endOfDayEnabledAfterConfirmation
    && result.capturePhotoCount === '2 Students Photographed'
    && result.rosterChecks.expanded
    && result.rosterChecks.studentInfoCollapsed
    && result.rosterChecks.blankRows === 1
    && result.rosterChecks.blankLabel
    && result.rosterChecks.selectedBlankRecord
    && result.rosterChecks.collapsedAfterSelection
    && result.rosterChecks.blankReadyForEditing
    && result.settingsChecks.visibleOnCaptureStation
    && result.settingsChecks.active
    && result.settingsChecks.connectionDisabledWhenLoggingOff
    && result.settingsChecks.stationId === 'RENDERMACHINE'
    && result.settingsChecks.passwordInput
    && result.settingsChecks.tokenClearedAfterSave
    && result.settingsChecks.tokenNotRendered
    && result.settingsChecks.tokenConfigured
    && result.settingsChecks.connectionPassed
    && result.settingsChecks.tokenGenerated
    && result.settingsChecks.generationInstructions
    && result.settingsChecks.queueStatusVisible
    && result.settingsChecks.localStorageMessage
    && activityLogChecks.secureTokenGeneration
    && activityLogChecks.localRetryQueue
    && activityLogChecks.disabledMeansNoTraffic
    && activityLogChecks.jobCreationHook
    && activityLogChecks.workflowHooks
    && safeStorageCheck.available
    && safeStorageCheck.encrypted
    && safeStorageCheck.decrypts
    && result.successPopup.title === 'End of Day Complete'
    && result.successPopup.message === 'End of Day created successfully.'
    && result.successPopup.detail.includes('3 captured images included.')
    && errors.length === 0;

  console.log(JSON.stringify({ pass: passed, ...result, safeStorageCheck, activityLogChecks, settingsScreenshotPath, errors }, null, 2));
  app.exit(passed ? 0 : 1);
}

app.whenReady().then(run).catch((error) => {
  console.error(error);
  app.exit(1);
});
