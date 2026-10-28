"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { ArrowLeftRight } from "lucide-react";
import type { Output } from "@/lib/file-utils";
import { comparisonAtX, comparisonByKey } from "@/lib/compare-slider.mjs";
import { BlobImage } from "./blob-image";

type Size = { width: number; height: number };

/** Images overlap exactly: before on the left of the divider, after on the right. */
export function BackgroundPreview({ original, result }: { original: File; result: Output }) {
  const [split, setSplit] = useState(50);
  const [size, setSize] = useState<Size | null>(null);
  const draggingId = useRef<number | null>(null);

  function updateFromPointer(event: PointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    setSplit(comparisonAtX(event.clientX, bounds.left, bounds.width));
  }

  function pointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0 || !event.isPrimary || draggingId.current !== null) return;
    event.preventDefault();
    draggingId.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.focus({ preventScroll: true });
    updateFromPointer(event);
  }

  function pointerMove(event: PointerEvent<HTMLDivElement>) {
    if (draggingId.current !== event.pointerId) return;
    event.preventDefault();
    updateFromPointer(event);
  }

  function pointerEnd(event: PointerEvent<HTMLDivElement>) {
    if (draggingId.current !== event.pointerId) return;
    draggingId.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function keyboard(event: KeyboardEvent<HTMLDivElement>) {
    const next = comparisonByKey(split, event.key, event.shiftKey);
    if (next === null) return;
    event.preventDefault();
    setSplit(next);
  }

  const aspectRatio = size ? `${size.width} / ${size.height}` : "4 / 3";
  // A portrait photo should not grow taller than the surrounding work area.
  const maxWidth = size ? Math.min(720, Math.max(80, 480 * size.width / size.height)) : 720;

  return (
    <section className={`background-compare [border:1px_solid_#e2e8f3] bg-[#fbfcff] rounded-[14px] p-[18px] [margin:20px_0] max-[600px]:p-3 max-[600px]:[margin:14px_0]`} aria-label="배경 제거 전후 비교">
      <div className={`background-compare-title flex items-center justify-between gap-3 mb-[13px] flex-wrap [&_strong]:text-base [&_strong]:tracking-[-.02em] [&_span]:inline-flex [&_span]:items-center [&_span]:gap-[5px] [&_span]:text-sm [&_span]:text-[#6a7891] max-[600px]:[&_span]:text-[13px]`}>
        <strong>Before / After</strong>
        <span><ArrowLeftRight size={15} aria-hidden="true" /> 구분선을 좌우로 드래그</span>
      </div>
      <div
        className={`background-compare-frame w-full relative overflow-hidden [margin:0_auto] isolate rounded-[11px] [border:1px_solid_#dae2ee] [cursor:ew-resize] [touch-action:none] select-none [-webkit-user-select:none] [outline-offset:4px] bg-[#fff] [background-image:linear-gradient(45deg,#e8edf4_25%,transparent_25%),linear-gradient(-45deg,#e8edf4_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#e8edf4_75%),linear-gradient(-45deg,transparent_75%,#e8edf4_75%)] [background-position:0_0,0_10px,10px_-10px,-10px_0] [background-size:20px_20px] focus-visible:[outline:3px_solid_#2563eb] [&_img]:block [&_img]:w-full [&_img]:h-full [&_img]:object-contain [&_img]:pointer-events-none [&_img]:select-none [&_img]:[-webkit-user-drag:none]`}
        role="slider"
        tabIndex={0}
        aria-label="배경 제거 전후 비교 구분선"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={split}
        aria-valuetext={`원본 ${split}%, 배경 제거 결과 ${100 - split}%`}
        aria-orientation="horizontal"
        style={{ aspectRatio, maxWidth }}
        onPointerDown={pointerDown}
        onPointerMove={pointerMove}
        onPointerUp={pointerEnd}
        onPointerCancel={pointerEnd}
        onLostPointerCapture={() => { draggingId.current = null; }}
        onKeyDown={keyboard}
      >
        <div className={`background-compare-after absolute [inset:0] pointer-events-none`} aria-hidden="true">
          <BlobImage blob={result.blob} alt="" draggable={false} />
        </div>
        <div
          className={`background-compare-before absolute [inset:0] pointer-events-none`}
          aria-hidden="true"
          style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}
        >
          <BlobImage
            blob={original}
            alt=""
            draggable={false}
            onLoad={(event) => {
              const image = event.currentTarget;
              const width = image.naturalWidth;
              const height = image.naturalHeight;
              if (width > 0 && height > 0) setSize(previous =>
                previous?.width === width && previous.height === height ? previous : { width, height }
              );
            }}
          />
        </div>
        <div className={`background-compare-divider absolute top-0 bottom-0 w-[2px] bg-[#fff] shadow-[0_0_0_1px_#26446855,0_0_9px_#1b293d6b] pointer-events-none [transform:translateX(-1px)] z-2 motion-reduce:[transition:none]`} aria-hidden="true" style={{ left: `${split}%` }}>
          <span className={`background-compare-handle absolute left-[50%] top-[50%] [transform:translate(-50%,-50%)] w-[42px] h-[42px] rounded-full grid [place-items:center] text-[#1f5cd1] bg-[#fff] [border:1px_solid_#c6d9fa] shadow-[0_4px_20px_#14284936] max-[600px]:w-[38px] max-[600px]:h-[38px] motion-reduce:[transition:none]`}><ArrowLeftRight size={19} strokeWidth={2.5} /></span>
        </div>
        <span className={`background-compare-badge background-compare-badge--before absolute z-3 top-3 bg-[#122138b8] text-[#fff] [padding:5px_9px] rounded-[7px] text-[13px] font-[750] tracking-[.02em] pointer-events-none left-3 max-[600px]:top-2 max-[600px]:left-2`} aria-hidden="true">Before</span>
        <span className={`background-compare-badge background-compare-badge--after absolute z-3 top-3 bg-[#122138b8] text-[#fff] [padding:5px_9px] rounded-[7px] text-[13px] font-[750] tracking-[.02em] pointer-events-none right-3 max-[600px]:top-2 max-[600px]:right-2`} aria-hidden="true">After</span>
      </div>
      <p className={`background-compare-help text-sm text-[#738198] text-center [margin:12px_0_0]`}>왼쪽 원본 · 오른쪽 결과. 모바일에서는 손가락으로, 키보드에서는 방향키로 조절합니다.</p>
    </section>
  );
}
