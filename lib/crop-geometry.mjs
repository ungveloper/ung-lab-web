/**
 * The crop rectangle uses normalized coordinates of the ROTATED image (0..1).
 * Geometry is shared by browser pointer controls and the actual image processor.
 * Functions are pure and can be tested in Node without DOM APIs.
 */
const clamp = (n, min, max) => Math.min(max, Math.max(min, Number.isFinite(n) ? n : min));

/** @param {string} ratio @param {number} width @param {number} height @param {number} customW @param {number} customH */
export function cropAspect(ratio, width, height, customW = 0, customH = 0) {
  if (ratio === 'free') return null;
  if (ratio === 'custom') return customW > 0 && customH > 0 ? customW / customH : 1;
  const match = /^(\d+):(\d+)$/.exec(ratio);
  if (!match) return null;
  return Number(match[1]) / Number(match[2]);
}

/**
 * @typedef {{x:number,y:number,w:number,h:number}} CropRect
 * @param {CropRect} rect
 * @returns {CropRect}
 */
export function clampCropRect(rect) {
  const w = clamp(rect.w, 0.001, 1);
  const h = clamp(rect.h, 0.001, 1);
  return { x: clamp(rect.x, 0, 1 - w), y: clamp(rect.y, 0, 1 - h), w, h };
}

/**
 * Inscribe the desired pixel aspect ratio within the selection, preserving its center.
 * @param {CropRect} raw
 * @param {number|null} desired
 * @param {number} imageW
 * @param {number} imageH
 * @returns {CropRect}
 */
export function fitCropAspect(raw, desired, imageW, imageH) {
  const r = clampCropRect(raw);
  if (!desired || desired <= 0 || imageW <= 0 || imageH <= 0) return r;
  let w = r.w, h = r.h;
  const normalizedRatio = desired * imageH / imageW;
  if (w / h > normalizedRatio) w = h * normalizedRatio;
  else h = w / normalizedRatio;
  const resized = {
    x: r.x + (r.w - w) / 2,
    y: r.y + (r.h - h) / 2,
    w, h,
  };
  return clampCropRect(resized);
}

/** @param {{cropX:number,cropY:number,cropWidth:number,cropHeight:number,cropRatio:string,width:number,height:number}} settings @param {number} imageW @param {number} imageH */
export function cropRectFromSettings(settings, imageW, imageH) {
  const raw = {
    x: settings.cropX / 100,
    y: settings.cropY / 100,
    w: settings.cropWidth / 100,
    h: settings.cropHeight / 100,
  };
  return fitCropAspect(raw, cropAspect(settings.cropRatio, imageW, imageH, settings.width, settings.height), imageW, imageH);
}

/** @param {CropRect} r */
export function cropRectToSettings(r) {
  const c = clampCropRect(r);
  return { cropX: c.x * 100, cropY: c.y * 100, cropWidth: c.w * 100, cropHeight: c.h * 100 };
}

/** @param {{x:number,y:number}} start @param {{x:number,y:number}} end @param {number|null} desired @param {number} imageW @param {number} imageH */
export function cropRectFromPoints(start, end, desired, imageW, imageH) {
  const ax = clamp(start.x, 0, 1), ay = clamp(start.y, 0, 1);
  const bx = clamp(end.x, 0, 1), by = clamp(end.y, 0, 1);
  const dx = bx - ax, dy = by - ay;
  const dirX = Math.sign(dx) || 1, dirY = Math.sign(dy) || 1;
  let w = Math.max(0.01, Math.abs(dx)), h = Math.max(0.01, Math.abs(dy));
  if (desired && desired > 0 && imageW > 0 && imageH > 0) {
    const normRatio = desired * imageH / imageW;
    if (w / h > normRatio) h = w / normRatio;
    else w = h * normRatio;
  }
  w = Math.min(w, dirX > 0 ? 1 - ax : ax);
  h = Math.min(h, dirY > 0 ? 1 - ay : ay);
  if (desired && desired > 0 && imageW > 0 && imageH > 0) {
    const normRatio = desired * imageH / imageW;
    w = Math.min(w, h * normRatio);
    h = w / normRatio;
  }
  if (w < 0.001 || h < 0.001) return null;
  return clampCropRect({ x: dirX > 0 ? ax : ax - w, y: dirY > 0 ? ay : ay - h, w, h });
}

/** @param {CropRect} r @param {number} dx @param {number} dy */
export function moveCropRect(r, dx, dy) {
  return clampCropRect({ ...r, x: r.x + dx, y: r.y + dy });
}

/** @param {CropRect} r @param {number} imageW @param {number} imageH */
export function cropPixels(r, imageW, imageH) {
  const c = clampCropRect(r);
  const x = Math.max(0, Math.min(imageW - 1, Math.round(c.x * imageW)));
  const y = Math.max(0, Math.min(imageH - 1, Math.round(c.y * imageH)));
  const width = Math.max(1, Math.min(imageW - x, Math.round(c.w * imageW)));
  const height = Math.max(1, Math.min(imageH - y, Math.round(c.h * imageH)));
  return { x, y, width, height };
}
