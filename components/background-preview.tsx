"use client";

import type { Output } from "@/lib/file-utils";
import { BlobImage } from "./blob-image";

export function BackgroundPreview({ original, result }: { original: File; result: Output }) {
  return (
    <div className="background-result-preview" aria-label="배경 제거 전후 미리보기">
      <div className="background-result-item">
        <span>원본</span>
        <div className="background-result-canvas">
          <BlobImage blob={original} alt="배경 제거 전 원본 이미지" />
        </div>
      </div>
      <div className="background-result-item">
        <span>배경 제거 결과</span>
        <div className="background-result-canvas background-result-checker">
          <BlobImage blob={result.blob} alt="배경 제거 후 이미지 (체크무늬는 투명 배경)" />
        </div>
      </div>
    </div>
  );
}
