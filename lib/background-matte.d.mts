export function combineForeground(
  source: Uint8ClampedArray,
  modelRgba: Uint8ClampedArray | Uint8Array,
  edgeCleanup?: number,
): Uint8ClampedArray;
export function alphaToOpaqueGrayscale(
  modelRgba: Uint8ClampedArray | Uint8Array,
): Uint8ClampedArray;
