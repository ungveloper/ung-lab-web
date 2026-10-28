"use client";

import { useState } from "react";
import type { Output, Settings } from "@/lib/file-utils";
import { BlobImage } from "./blob-image";

export function ImageCompare({ original, result }: { original: File; result: Output }) {
  const [value, setValue] = useState(50);
  return (
    <div className={`comparison p-[17px] rounded-[11px] [border:1px_solid_#e2e9f4] mt-[14px] [&_b]:text-base`}>
      <div className={`section-inline flex items-center justify-between gap-[14px] [&_b]:text-base [&_b_em]:not-italic [&_b_em]:text-[#2868e2] [&_small]:block [&_small]:text-[#98a5b9] [&_small]:text-[13px] [.results_&_p]:text-[#8b97aa] [.results_&_p]:text-sm [.results_&_p]:[margin:4px_0] [.pdf-picker_&_span]:text-[13px] [.pdf-picker_&_span]:text-[#8291aa] [.comparison_&_span]:text-[13px] [.comparison_&_span]:text-[#8090a6]`}><b>압축 전후 이미지 비교</b><span>{original.size.toLocaleString()} → {result.blob.size.toLocaleString()} bytes</span></div>
      <div className={`comparison-frame [margin:13px_auto] max-w-[560px] h-[270px] relative overflow-hidden rounded-[11px] bg-[#f0f4fb] [&>img]:absolute [&>img]:top-0 [&>img]:left-0 [&>img]:w-full [&>img]:h-full [&>img]:object-contain`}>
        <BlobImage blob={original} alt="최적화 전 이미지" />
        <div className={`comparison-after [&_img]:absolute [&_img]:top-0 [&_img]:left-0 [&_img]:w-full [&_img]:h-full [&_img]:object-contain absolute [inset:0]`} style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}>
          <BlobImage blob={result.blob} alt="최적화 후 이미지" />
        </div>
        <span className={`comparison-divider absolute h-full w-[2px] bg-[#fff] shadow-[0_0_3px_#333]`} style={{ left: `${value}%` }} />
        <span className={`comparison-label left absolute top-[9px] bg-[#172238ad] text-[#fff] [padding:4px_8px] text-[13px] rounded-[6px] [&.left]:left-[9px] [&.right]:right-[9px]`}>원본</span>
        <span className={`comparison-label right absolute top-[9px] bg-[#172238ad] text-[#fff] [padding:4px_8px] text-[13px] rounded-[6px] [&.left]:left-[9px] [&.right]:right-[9px]`}>결과</span>
      </div>
      <label className={`comparison-range text-sm flex items-center gap-3 [&_input]:flex-1 [&_input]:accent-[#2563eb]`}>비교 위치 <input type="range" min="0" max="100" value={value} onChange={e => setValue(Number(e.target.value))} /></label>
    </div>
  );
}

export function PdfLayoutPreview({ files, settings, rotations }: { files: File[]; settings: Settings; rotations: Record<number, number> }) {
  return (
    <div className={`pdf-layout-preview p-[17px] rounded-[11px] [border:1px_solid_#e2e9f4] mt-[14px] [&_b]:text-base [&_p]:text-[#8190a6] [&_p]:text-[13px]`}>
      <b>PDF 페이지 배치 미리보기</b>
      <p>이미지 순서를 변경하면 페이지 순서도 함께 바뀝니다. 실제 여백과 용지 크기는 설정에 따라 달라질 수 있습니다.</p>
      <div className={`pdf-layout-grid grid [grid-template-columns:repeat(auto-fill,minmax(110px,1fr))] gap-[11px] mt-[13px]`}>
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
    <div className={`pdf-page-preview text-[13px] text-[#677792] text-center`}>
      <span>{num}페이지</span>
      <div className={`pdf-sheet bg-[#fff] shadow-[0_2px_8px_#14253e18] [border:1px_solid_#dfe4ed] flex items-center justify-center min-h-[110px] mt-[5px] p-[10px] overflow-hidden [&_img]:object-contain`} style={{ aspectRatio: paper === "original" ? "auto" : orientation === "landscape" ? "1.414" : "0.707" }}>
        <BlobImage blob={file} alt={`${num}페이지에 포함될 이미지`} style={{ transform: `rotate(${rotation}deg)`, maxHeight: "100%", maxWidth: "100%" }} />
      </div>
    </div>
  );
}
