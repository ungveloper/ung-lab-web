"use client";

import { useState } from "react";
import type { Output, Settings } from "@/lib/file-utils";
import { BlobImage } from "./blob-image";

export function ImageCompare({ original, result }: { original: File; result: Output }) {
  const [value, setValue] = useState(50);
  return (
    <div className="comparison">
      <div className="section-inline"><b>압축 전후 이미지 비교</b><span>{original.size.toLocaleString()} → {result.blob.size.toLocaleString()} bytes</span></div>
      <div className="comparison-frame">
        <BlobImage blob={original} alt="최적화 전 이미지" />
        <div className="comparison-after" style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}>
          <BlobImage blob={result.blob} alt="최적화 후 이미지" />
        </div>
        <span className="comparison-divider" style={{ left: `${value}%` }} />
        <span className="comparison-label left">원본</span>
        <span className="comparison-label right">결과</span>
      </div>
      <label className="comparison-range">비교 위치 <input type="range" min="0" max="100" value={value} onChange={e => setValue(Number(e.target.value))} /></label>
    </div>
  );
}

export function PdfLayoutPreview({ files, settings, rotations }: { files: File[]; settings: Settings; rotations: Record<number, number> }) {
  return (
    <div className="pdf-layout-preview">
      <b>PDF 페이지 배치 미리보기</b>
      <p>이미지 순서를 변경하면 페이지 순서도 함께 바뀝니다. 실제 여백과 용지 크기는 설정에 따라 달라질 수 있습니다.</p>
      <div className="pdf-layout-grid">
        {files.slice(0, 12).map((file, i) => (
          <ImagePagePreview key={`${file.name}-${i}`} file={file} num={i + 1} rotation={rotations[i] ?? 0} orientation={settings.orientation} paper={settings.paper} />
        ))}
      </div>
      {files.length > 12 && <small>처음 12페이지만 미리 보여줍니다.</small>}
    </div>
  );
}

function ImagePagePreview({ file, num, rotation, orientation, paper }: { file: File; num: number; rotation: number; orientation: string; paper: string }) {
  return (
    <div className="pdf-page-preview">
      <span>{num}페이지</span>
      <div className="pdf-sheet" style={{ aspectRatio: paper === "original" ? "auto" : orientation === "landscape" ? "1.414" : "0.707" }}>
        <BlobImage blob={file} alt={`${num}페이지에 포함될 이미지`} style={{ transform: `rotate(${rotation}deg)`, maxHeight: "100%", maxWidth: "100%" }} />
      </div>
    </div>
  );
}
