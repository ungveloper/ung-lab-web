"use client";

import type { Settings } from "@/lib/file-utils";
import { BlobImage } from "./blob-image";

export function CropPreview({ file, settings }: { file: File; settings: Settings }) {
  const ratio = settings.cropRatio;
  const aspectRatio = ratio === "free" ? "auto"
    : ratio === "custom" ? `${settings.width || 1} / ${settings.height || 1}`
    : ratio.replace(":", " / ");

  return (
    <div className="crop-preview">
      <b>자르기 미리보기</b>
      <p>가로·세로 위치와 비율을 조절한 뒤 작업을 실행하세요.</p>
      <div className="crop-frame" style={{ aspectRatio }}>
        <BlobImage
          blob={file}
          alt="자르기 미리보기"
          style={{
            objectPosition: `${settings.cropX}% ${settings.cropY}%`,
            transform: `rotate(${settings.rotate}deg) scale(${settings.flipX ? -1 : 1},${settings.flipY ? -1 : 1})`,
          }}
        />
      </div>
      <small>실제 출력은 원본 픽셀을 기준으로 처리합니다. 회전 후 미리보기의 위치는 달라질 수 있습니다.</small>
    </div>
  );
}
