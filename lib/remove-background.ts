import type { Output, Settings } from "@/lib/file-utils";
import { baseName, canvasBlob, loadImage } from "@/lib/file-utils";
import { alphaToOpaqueGrayscale, combineForeground } from "@/lib/background-matte.mjs";

type RgbaRawImage = {
  data: Uint8ClampedArray | Uint8Array;
  channels: number;
  width: number;
  height: number;
};

function validateMask(image: RgbaRawImage | undefined): asserts image is RgbaRawImage {
  if (!image || image.channels !== 4 || !Number.isInteger(image.width) ||
      !Number.isInteger(image.height) || image.width < 1 || image.height < 1 ||
      image.width * image.height > 16_000_000 ||
      image.data.length !== image.width * image.height * 4) {
    throw new Error("AI 모델이 유효한 RGBA 배경 제거 결과를 반환하지 않았습니다.");
  }
}

/** When the library returns a resized model result, resize alpha only. */
function modelMatteAtSize(mask: RgbaRawImage, width: number, height: number): Uint8ClampedArray | Uint8Array {
  if (mask.width === width && mask.height === height) return mask.data;
  const sourceCanvas = document.createElement("canvas");
  sourceCanvas.width = mask.width;
  sourceCanvas.height = mask.height;
  const sourceContext = sourceCanvas.getContext("2d");
  if (!sourceContext) throw new Error("AI 마스크의 크기를 조절할 수 없습니다.");
  const grayscale = sourceContext.createImageData(mask.width, mask.height);
  grayscale.data.set(alphaToOpaqueGrayscale(mask.data));
  sourceContext.putImageData(grayscale, 0, 0);

  const resizedCanvas = document.createElement("canvas");
  resizedCanvas.width = width;
  resizedCanvas.height = height;
  const resizedContext = resizedCanvas.getContext("2d");
  if (!resizedContext) throw new Error("AI 마스크를 이미지에 맞출 수 없습니다.");
  resizedContext.imageSmoothingEnabled = true;
  resizedContext.imageSmoothingQuality = "high";
  resizedContext.drawImage(sourceCanvas, 0, 0, width, height);
  const resampled = resizedContext.getImageData(0, 0, width, height).data;
  // The actual alpha has been encoded as gray for interpolation. Move it
  // back to the fourth channel before composing with the original image.
  const matte = new Uint8ClampedArray(resampled.length);
  for (let i = 0; i < resampled.length; i += 4) matte[i + 3] = resampled[i];
  return matte;
}

export async function removeBackground(file: File, settings: Settings, signal: AbortSignal): Promise<Output> {
  if (signal.aborted) throw new Error("작업이 취소되었습니다.");
  const bitmap = await loadImage(file);
  try {
    // Guard memory before model inference, not after allocating the output.
    if (bitmap.width * bitmap.height > 16_000_000) {
      throw new Error("배경 제거는 1,600만 픽셀 이하의 이미지만 지원합니다.");
    }
    if (signal.aborted) throw new Error("작업이 취소되었습니다.");
    const { pipeline } = await import("@huggingface/transformers");
    const model = await pipeline("background-removal", "Xenova/modnet", { dtype: "fp32" });
    if (signal.aborted) throw new Error("작업이 취소되었습니다.");
    const objectUrl = URL.createObjectURL(file);
    let mask: RgbaRawImage;
    try {
      const result = await model(objectUrl) as unknown as RgbaRawImage[];
      validateMask(result?.[0]);
      mask = result[0];
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
    if (signal.aborted) throw new Error("작업이 취소되었습니다.");
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) throw new Error("이미지 합성용 Canvas를 사용할 수 없습니다.");
    context.drawImage(bitmap, 0, 0);
    const original = context.getImageData(0, 0, canvas.width, canvas.height);
    const alphaMask = modelMatteAtSize(mask, canvas.width, canvas.height);
    original.data.set(combineForeground(original.data, alphaMask, settings.feather));
    context.putImageData(original, 0, 0);

    if (signal.aborted) throw new Error("작업이 취소되었습니다.");
    if (settings.format === "jpg") {
      const flattened = document.createElement("canvas");
      flattened.width = canvas.width;
      flattened.height = canvas.height;
      const flatContext = flattened.getContext("2d");
      if (!flatContext) throw new Error("배경색을 적용할 수 없습니다.");
      flatContext.fillStyle = settings.background;
      flatContext.fillRect(0, 0, flattened.width, flattened.height);
      flatContext.drawImage(canvas, 0, 0);
      return {
        name: `${baseName(file.name)}-background.jpg`,
        blob: await canvasBlob(flattened, "jpg", settings.quality),
        note: "선택한 배경색으로 저장",
      };
    }
    if (settings.format !== "png" && settings.format !== "webp") {
      throw new Error("배경 제거는 PNG, WebP 또는 JPG 형식으로 저장할 수 있습니다.");
    }
    const blob = await canvasBlob(canvas, settings.format, settings.quality);
    if (blob.type !== (settings.format === "webp" ? "image/webp" : "image/png")) {
      throw new Error("현재 브라우저는 선택한 출력 형식을 지원하지 않습니다.");
    }
    return {
      name: `${baseName(file.name)}-no-background.${settings.format}`,
      blob,
      note: "AI 알파 마스크 기반 투명 배경",
    };
  } finally {
    bitmap.close();
  }
}
