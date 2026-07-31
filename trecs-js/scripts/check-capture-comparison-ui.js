const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

async function run() {
  const errors = [];
  ipcMain.handle('dashboard:get', () => ({
    counts: [],
    jobs: [],
    migration: [],
    databasePath: 'capture-comparison-test.db'
  }));
  ipcMain.handle('app:system-info', () => ({
    captureStationMode: false,
    captureHotFolder: ''
  }));
  ipcMain.handle('app:focus-window', () => true);
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

  window.webContents.on('console-message', (_event, level, message) => {
    if (level >= 3) errors.push(message);
  });

  await window.loadFile(path.join(__dirname, '../src/renderer/index.html'));
  window.showInactive();
  await new Promise((resolve) => setTimeout(resolve, 300));

  const result = await window.webContents.executeJavaScript(`
    (async () => {
      jobsState.captureSubject = { id: 1, ref: '10010', name: 'Test Student', imageAssetId: 10 };
      jobsState.detail = { subjects: [
        { id: 1, ref: '10010', name: 'Test Student', imageAssetId: 10, photographedStatus: 'photographed' },
        { id: 2, ref: '10009', name: 'Correct Student', grade: '4', homeroom: 'Smith', imageAssetId: 12, photographedStatus: 'photographed' }
      ] };
      jobsState.captureImages = [
        {
          id: 10,
          filename: '10010_MG_0413.JPG',
          capturedAt: '2026-07-30 14:00:00',
          selected: true,
          rawPath: 'C:\\\\Capture\\\\10010_MG_0413.CR3',
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
      renderCaptureCompare();
      capturePreviewMeta.click();
      const opened = {
        buttonText: capturePreviewMeta.textContent,
        modalVisible: !captureComparisonModal.hidden,
        cardCount: captureComparisonScroller.querySelectorAll('[data-capture-comparison-image]').length,
        appInert: appShell.inert
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
      return {
        ...opened,
        closed: captureComparisonModal.hidden && !appShell.inert,
        selectedImageId: jobsState.captureImages.find((image) => image.selected)?.id || null,
        subjectImageId: jobsState.captureSubject.imageAssetId,
        detailImageId: jobsState.detail.subjects[0].imageAssetId,
        previewIds,
        selectedPreviewIds,
        selectedStudentPreview,
        wrongReferenceRows,
        wrongReferenceLayout,
        confirmationHiddenWhenEmpty,
        endOfDayInitiallyDisabled,
        endOfDayEnabledAfterConfirmation: !confirmEndOfDayButton.disabled,
        capturePhotoCount: document.getElementById('capturePhotoCount').textContent
      };
    })()
  `);

  const passed = result.buttonText === 'Compare 2'
    && result.modalVisible
    && result.cardCount === 2
    && result.appInert
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
    && result.capturePhotoCount === '5 JPG / 2 students / 2 photo / 786 records'
    && errors.length === 0;

  console.log(JSON.stringify({ pass: passed, ...result, errors }, null, 2));
  app.exit(passed ? 0 : 1);
}

app.whenReady().then(run).catch((error) => {
  console.error(error);
  app.exit(1);
});
