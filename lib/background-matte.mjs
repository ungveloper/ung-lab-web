/**
 * Alpha matting of the original RGBA pixels using a Transformers.js
 * BackgroundRemovalPipeline RGBA result. The fourth channel (offset +3)
 * stores the foreground mask. RGB channels are NOT the mask.
 *
 * The output RGB always comes from the original image; the model is used
 * only for its alpha matte. There is no server-side upload.
 */
export function combineForeground(source, modelRgba, edgeCleanup = 0) {
  if (!(source instanceof Uint8ClampedArray) ||
      !(modelRgba instanceof Uint8ClampedArray || modelRgba instanceof Uint8Array) ||
      source.length === 0 || source.length % 4 !== 0 || source.length !== modelRgba.length) {
    throw new Error("원본 이미지와 AI 마스크의 픽셀 크기가 일치하지 않습니다.");
  }
  const adjusted = new Uint8ClampedArray(source.length);
  // Remove low-alpha background fringe only when the user increases the slider.
  // No sharpening or clipping at the default 0. The 0..30 control maps to 0..24
  // matte units, while fully opaque foreground remains fully opaque.
  const trim = Math.min(24, Math.max(0, Number.isFinite(edgeCleanup) ? edgeCleanup : 0) * 0.8);
  for (let i = 0; i < source.length; i += 4) {
    adjusted[i] = source[i];
    adjusted[i + 1] = source[i + 1];
    adjusted[i + 2] = source[i + 2];
    const matteAlpha = modelRgba[i + 3];
    const alpha = trim > 0 ? Math.round(Math.max(0, matteAlpha - trim) * 255 / (255 - trim)) : matteAlpha;
    adjusted[i + 3] = Math.round(source[i + 3] * alpha / 255);
  }
  return adjusted;
}

/**
 * Return a Canvas-compatible fully opaque grayscale RGBA buffer.
 * Its grayscale channels contain the real alpha matte (not source RGB).
 * This avoids premultiplied-alpha artifacts when rescaling the matte.
 */
export function alphaToOpaqueGrayscale(modelRgba) {
  if (!(modelRgba instanceof Uint8ClampedArray || modelRgba instanceof Uint8Array) || modelRgba.length % 4 !== 0) {
    throw new Error("AI 배경 제거 결과의 채널 수가 올바르지 않습니다.");
  }
  const gray = new Uint8ClampedArray(modelRgba.length);
  for (let i = 0; i < modelRgba.length; i += 4) {
    const alpha = modelRgba[i + 3];
    gray[i] = alpha;
    gray[i + 1] = alpha;
    gray[i + 2] = alpha;
    gray[i + 3] = 255;
  }
  return gray;
}
