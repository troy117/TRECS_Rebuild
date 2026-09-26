// Ported from Headsizer 2.0 v0.4; see SOURCE.md in this directory.
// Crop functions copied without mathematical changes from existing Headsizer.jsx.
// Photoshop dependencies replaced by numeric measurements supplied by MediaPipe.
const px = Number;
const DEFAULT_NOSE_SHIFT_MULTIPLIER = 1;
const DEFAULT_PERSON_TOP_ZOOM_FRACTION = 0.25;
const DEFAULT_PERSON_TOP_MOVE_FRACTION = 0.25;
function calcPersonSliverShiftInfo(doc, personLayer, eyeY, eyeX) {
 return {shiftX: personLayer?.sliverCenterX == null ? 0 : (personLayer.sliverCenterX - eyeX) * 0.25};
}
function buildCropRect(doc, meas, calibration) {
    var aspect = 4 / 5; // always 8x10

    var docW = px(doc.width);
    var docH = px(doc.height);

    var calibrationHeight = calibration.aspectHeight || 10;
    var calibrationWidth = calibration.aspectWidth || 8;

    var topGap = calibration.topGapPx || 0;
    var bottomGap = calibration.bottomGapPx || 0;
    var eyeOffsetX = calibration.eyeCenterOffsetXPx || 0;
    var centerNudgeY = calibration.centerNudgeYPx || 0;

    var sourceEyeMouthDistance = Math.abs(meas.mouth.centerY - meas.eyes.centerY);
    if (sourceEyeMouthDistance < 1) sourceEyeMouthDistance = 1;

    var targetEyeYPct = topGap / calibrationHeight;
    var targetMouthYPct = 1 - (bottomGap / calibrationHeight);
    var targetEyeMouthPct = targetMouthYPct - targetEyeYPct;

    var cropH;
    var top;
    var bottom;

    if (isFiniteNumber(targetEyeMouthPct) && targetEyeMouthPct > 0.01) {
        // Two-point alignment from eyes and mouth
        cropH = sourceEyeMouthDistance / targetEyeMouthPct;
        top = meas.eyes.centerY - (targetEyeYPct * cropH);
        bottom = top + cropH;
    } else {
        // Fallback if calibration values are missing/bad
        top = meas.eyes.centerY - topGap;
        bottom = meas.mouth.centerY + bottomGap;
        cropH = bottom - top;
    }

    if (cropH < 1) cropH = 1;

    var cropW = cropH * aspect;

    var eyeOffsetPct = 0;
    if (isFiniteNumber(calibrationWidth) && Math.abs(calibrationWidth) > 0.0001) {
        eyeOffsetPct = eyeOffsetX / calibrationWidth;
    }

    var noseShiftX = calcNoseShiftX(meas, calibration);

    var centerX = meas.eyes.centerX + (eyeOffsetPct * cropW) + noseShiftX;
    var centerY = ((top + bottom) / 2) + centerNudgeY;

    var crop = {
        left: centerX - (cropW / 2),
        top: centerY - (cropH / 2),
        right: centerX + (cropW / 2),
        bottom: centerY + (cropH / 2)
    };

    crop = fitRectInsideDocument(crop, docW, docH);

    // Horizontal correction from a thin person-layer sliver at eye height
    var sliverInfo = calcPersonSliverShiftInfo(
        doc,
        meas.personLayer,
        meas.eyes.centerY,
        meas.eyes.centerX,
        calibration
    );

    if (Math.abs(sliverInfo.shiftX) > 0.001) {
        crop = moveRectWithinDocument(crop, sliverInfo.shiftX, 0, docW, docH);
    }

    // Top-only correction: if person top is above calibrated top, zoom out 25% and move 25%
    var topAdjustInfo = adjustCropForPersonTopOnly(crop, meas.person, docW, docH, calibration);
    crop = topAdjustInfo.crop;

    crop = fitRectInsideDocument(crop, docW, docH);

    return {
        crop: crop,
        noseShiftX: noseShiftX,
        personFitIterations: 0,
        silhouetteShiftX: sliverInfo.shiftX || 0,
        personTopAdjustPx: topAdjustInfo.adjustPx || 0
    };
}

function calcNoseShiftX(meas, calibration) {
        if (!meas || !meas.nose || !meas.leftEye || !meas.rightEye) return 0;

        var leftOverlap = overlapWidth(meas.nose.left, meas.nose.right, meas.leftEye.left, meas.leftEye.right);
        var rightOverlap = overlapWidth(meas.nose.left, meas.nose.right, meas.rightEye.left, meas.rightEye.right);
        var intrusionDifference = rightOverlap - leftOverlap;

        var multiplier = calibration.noseShiftMultiplier;
        if (!isFiniteNumber(multiplier)) multiplier = DEFAULT_NOSE_SHIFT_MULTIPLIER;

        return intrusionDifference * multiplier;
    }

function overlapWidth(aLeft, aRight, bLeft, bRight) {
        var left = Math.max(aLeft, bLeft);
        var right = Math.min(aRight, bRight);
        return Math.max(0, right - left);
    }

function adjustCropForPersonTopOnly(rect, personBounds, docW, docH, calibration) {
    var out = copyRect(rect);

    if (!personBounds) {
        return {
            crop: fitRectInsideDocument(out, docW, docH),
            adjustPx: 0,
            zoomPx: 0,
            movePx: 0
        };
    }

    var cropH = out.bottom - out.top;
    var cropW = out.right - out.left;
    var aspect = cropW / Math.max(1, cropH);

    var calibrationHeight = calibration.aspectHeight || 10;
    var calibratedPersonTopPx = calibration.averagePersonTopToPhotoTopPx;

    if (!isFiniteNumber(calibratedPersonTopPx)) {
        calibratedPersonTopPx = calibration.personTopToPhotoTopPx;
    }

    if (!isFiniteNumber(calibratedPersonTopPx)) {
        calibratedPersonTopPx = 0;
    }

    var targetPersonTopPct = calibratedPersonTopPx / calibrationHeight;
    var targetPersonTopY = out.top + (targetPersonTopPct * cropH);

    var difference = targetPersonTopY - personBounds.top;

    if (!isFiniteNumber(difference) || difference <= 0) {
        return {
            crop: fitRectInsideDocument(out, docW, docH),
            adjustPx: 0,
            zoomPx: 0,
            movePx: 0
        };
    }

    var zoomOutAmount = difference * DEFAULT_PERSON_TOP_ZOOM_FRACTION;
    var moveUpAmount = difference * DEFAULT_PERSON_TOP_MOVE_FRACTION;

    out = expandRectTopOnlyWithinDocument(out, zoomOutAmount, aspect, docW, docH);
    out = moveRectWithinDocument(out, 0, -moveUpAmount, docW, docH);
    out = fitRectInsideDocument(out, docW, docH);

    return {
        crop: out,
        adjustPx: difference,
        zoomPx: zoomOutAmount,
        movePx: moveUpAmount
    };
}

function expandRectTopOnlyWithinDocument(rect, addHeight, aspect, docW, docH) {
    var out = copyRect(rect);

    if (!isFiniteNumber(addHeight) || addHeight <= 0) {
        return fitRectInsideDocument(out, docW, docH);
    }

    var oldH = out.bottom - out.top;
    var newH = oldH + addHeight;
    var newW = newH * aspect;

    var centerX = (out.left + out.right) / 2;
    var bottom = out.bottom;

    out.top = bottom - newH;
    out.bottom = bottom;
    out.left = centerX - (newW / 2);
    out.right = centerX + (newW / 2);

    return fitRectInsideDocument(out, docW, docH);
}

function moveRectWithinDocument(rect, dx, dy, docW, docH) {
    var out = copyRect(rect);

    var minDx = -out.left;
    var maxDx = docW - out.right;
    var minDy = -out.top;
    var maxDy = docH - out.bottom;

    dx = clampNumber(dx, minDx, maxDx);
    dy = clampNumber(dy, minDy, maxDy);

    out.left += dx;
    out.right += dx;
    out.top += dy;
    out.bottom += dy;

    return out;
}

function fitRectInsideDocument(rect, docW, docH) {
        var out = copyRect(rect);
        var w = out.right - out.left;
        var h = out.bottom - out.top;

        if (w <= 0 || h <= 0) {
            return { left: 0, top: 0, right: docW, bottom: docH };
        }

        var scale = 1;
        if (w > docW || h > docH) {
            scale = Math.min(docW / w, docH / h);
            out = scaleRectFromCenter(out, scale);
        }

        w = out.right - out.left;
        h = out.bottom - out.top;

        if (out.left < 0) {
            out.right += -out.left;
            out.left = 0;
        }
        if (out.top < 0) {
            out.bottom += -out.top;
            out.top = 0;
        }
        if (out.right > docW) {
            out.left -= (out.right - docW);
            out.right = docW;
        }
        if (out.bottom > docH) {
            out.top -= (out.bottom - docH);
            out.bottom = docH;
        }

        if (out.left < 0) out.left = 0;
        if (out.top < 0) out.top = 0;

        return out;
    }

function scaleRectFromCenter(rect, scale) {
        var cx = (rect.left + rect.right) / 2;
        var cy = (rect.top + rect.bottom) / 2;
        var halfW = ((rect.right - rect.left) / 2) * scale;
        var halfH = ((rect.bottom - rect.top) / 2) * scale;

        return {
            left: cx - halfW,
            top: cy - halfH,
            right: cx + halfW,
            bottom: cy + halfH
        };
    }

function copyRect(r) {
        return {
            left: r.left,
            top: r.top,
            right: r.right,
            bottom: r.bottom
        };
    }

function isFiniteNumber(n) {
        return typeof n === "number" && isFinite(n);
    }

function clampNumber(n, min, max) {
        if (!isFiniteNumber(n)) return min;
        return Math.max(min, Math.min(max, n));
    }
export { buildCropRect, fitRectInsideDocument };
