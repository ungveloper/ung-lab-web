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
    <section className="background-compare" aria-label="배경 제거 전후 비교">
      <div className="background-compare-title">
        <strong>Before / After</strong>
        <span><ArrowLeftRight size={15} aria-hidden="true" /> 구분선을 좌우로 드래그</span>
      </div>
      <div
        className="background-compare-frame"
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
        <div className="background-compare-after" aria-hidden="true">
          <BlobImage blob={result.blob} alt="" draggable={false} />
        </div>
        <div
          className="background-compare-before"
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
        <div className="background-compare-divider" aria-hidden="true" style={{ left: `${split}%` }}>
          <span className="background-compare-handle"><ArrowLeftRight size={19} strokeWidth={2.5} /></span>
        </div>
        <span className="background-compare-badge background-compare-badge--before" aria-hidden="true">Before</span>
        <span className="background-compare-badge background-compare-badge--after" aria-hidden="true">After</span>
      </div>
      <p className="background-compare-help">왼쪽 원본 · 오른쪽 결과. 모바일에서는 손가락으로, 키보드에서는 방향키로 조절합니다.</p>
    </section>
  );
}
