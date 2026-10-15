"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent, type KeyboardEvent } from "react";
import { Maximize2 } from "lucide-react";
import type { Settings } from "@/lib/file-utils";
import { loadImage } from "@/lib/file-utils";
import { cropAspect, cropRectFromPoints, cropRectFromSettings, cropRectToSettings, moveCropRect } from "@/lib/crop-geometry.mjs";

type Dimensions = { width: number; height: number };
type CropRect = { x: number; y: number; w: number; h: number };
type SelectionChange = Pick<Settings, "cropX" | "cropY" | "cropWidth" | "cropHeight">;
type DragMode = "new" | "move" | "nw" | "ne" | "sw" | "se";
type Drag = { id: number; mode: DragMode; start: { x: number; y: number }; initial: CropRect; anchor?: { x: number; y: number } };

const percent = (n: number) => `${(n * 100).toFixed(3)}%`;

export function CropPreview({ file, settings, onChange, onStart, onEnd }: {
  file: File;
  settings: Settings;
  onChange: (value: SelectionChange) => void;
  onStart: () => void;
  onEnd: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bitmapRef = useRef<ImageBitmap | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<Drag | null>(null);
  const [natural, setNatural] = useState<Dimensions | null>(null);
  const [loadError, setLoadError] = useState("");
  const rotated = Math.abs(settings.rotate) % 180 === 90;
  const dimensions = natural ? {
    width: rotated ? natural.height : natural.width,
    height: rotated ? natural.width : natural.height,
  } : null;
  const rect = dimensions ? cropRectFromSettings(settings, dimensions.width, dimensions.height) : null;
  const fixedAspect = dimensions ? cropAspect(settings.cropRatio, dimensions.width, dimensions.height, settings.width, settings.height) : null;

  useEffect(() => {
    let cancelled = false;
    let bitmap: ImageBitmap | undefined;
    loadImage(file).then((loaded) => {
      if (cancelled) { loaded.close(); return; }
      bitmap = loaded;
      bitmapRef.current = loaded;
      setNatural({ width: loaded.width, height: loaded.height });
      setLoadError("");
    }).catch(() => {
      if (!cancelled) { setLoadError("이미지 미리보기를 열 수 없습니다."); setNatural(null); }
    });
    return () => {
      cancelled = true;
      bitmap?.close();
      if (bitmapRef.current === bitmap) bitmapRef.current = null;
    };
  }, [file]);

  useEffect(() => {
    const image = bitmapRef.current;
    const canvas = canvasRef.current;
    if (!image || !canvas || !natural) return;
    // Derive the rotated size inside the effect from its actual dependencies.
    // This avoids depending on a new `dimensions` object created each render.
    const isQuarterTurn = Math.abs(settings.rotate) % 180 === 90;
    const width = isQuarterTurn ? natural.height : natural.width;
    const height = isQuarterTurn ? natural.width : natural.height;
    const scale = Math.min(1, 1200 / Math.max(width, height));
    canvas.width = Math.max(1, Math.round(width * scale));
    canvas.height = Math.max(1, Math.round(height * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(settings.rotate * Math.PI / 180);
    ctx.scale(settings.flipX ? -scale : scale, settings.flipY ? -scale : scale);
    ctx.drawImage(image, -image.width / 2, -image.height / 2);
    ctx.restore();
  }, [natural, settings.rotate, settings.flipX, settings.flipY]);

  const position = useCallback((e: PointerEvent<HTMLDivElement>) => {
    const box = stageRef.current?.getBoundingClientRect();
    if (!box || box.width === 0 || box.height === 0) return { x: 0, y: 0 };
    return {
      x: Math.min(1, Math.max(0, (e.clientX - box.left) / box.width)),
      y: Math.min(1, Math.max(0, (e.clientY - box.top) / box.height)),
    };
  }, []);

  function startPointer(e: PointerEvent<HTMLDivElement>) {
    if (!rect || !dimensions || e.button !== 0 || dragRef.current) return;
    e.preventDefault();
    const target = e.target as HTMLElement;
    const handle = target.closest<HTMLElement>("[data-crop-handle]")?.dataset.cropHandle as DragMode | undefined;
    const inside = target.closest("[data-crop-selection]");
    const mode: DragMode = handle ?? (inside && !(rect.w > .995 && rect.h > .995) ? "move" : "new");
    const anchor = mode === "nw" ? { x: rect.x + rect.w, y: rect.y + rect.h }
      : mode === "ne" ? { x: rect.x, y: rect.y + rect.h }
      : mode === "sw" ? { x: rect.x + rect.w, y: rect.y }
      : mode === "se" ? { x: rect.x, y: rect.y } : undefined;
    dragRef.current = { id: e.pointerId, mode, start: position(e), initial: rect, anchor };
    stageRef.current?.setPointerCapture(e.pointerId);
    onStart();
  }

  function movePointer(e: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.id !== e.pointerId || !dimensions) return;
    e.preventDefault();
    const p = position(e);
    let next: CropRect | null;
    if (drag.mode === "move") {
      next = moveCropRect(drag.initial, p.x - drag.start.x, p.y - drag.start.y);
    } else {
      next = cropRectFromPoints(drag.anchor ?? drag.start, p, fixedAspect, dimensions.width, dimensions.height);
    }
    if (next) onChange(cropRectToSettings(next));
  }

  function finishPointer(e: PointerEvent<HTMLDivElement>) {
    if (dragRef.current?.id !== e.pointerId) return;
    dragRef.current = null;
    if (stageRef.current?.hasPointerCapture(e.pointerId)) stageRef.current.releasePointerCapture(e.pointerId);
    onEnd();
  }

  function keyboardMove(e: KeyboardEvent<HTMLDivElement>) {
    if (!rect) return;
    const movement: Record<string, [number, number]> = {
      ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1],
    };
    const change = movement[e.key];
    if (!change) return;
    e.preventDefault();
    const step = e.shiftKey ? .05 : .01;
    onStart();
    onChange(cropRectToSettings(moveCropRect(rect, change[0] * step, change[1] * step)));
    onEnd();
  }

  const maxWidth = dimensions ? Math.min(620, Math.max(80, Math.round(470 * dimensions.width / dimensions.height))) : 600;
  const dimensionsNote = rect && dimensions ? `${Math.max(1, Math.round(rect.w * dimensions.width))} × ${Math.max(1, Math.round(rect.h * dimensions.height))} px` : "";
  return (
    <div className="crop-preview">
      <div className="crop-preview-heading">
        <b>이미지 자르기</b>
        <button type="button" className="small-ghost" onClick={() => {
          onStart();
          onChange({ cropX: 0, cropY: 0, cropWidth: 100, cropHeight: 100 });
          onEnd();
        }}><Maximize2 size={14}/> 전체 선택</button>
      </div>
      <p>영역을 손가락이나 마우스로 그려 선택하세요. 선택 영역을 이동하거나 모서리를 끌어 크기를 조절할 수 있습니다.</p>
      {loadError && <p role="alert">{loadError}</p>}
      <div
        ref={stageRef}
        className="crop-stage"
        style={{ width: `min(100%, ${maxWidth}px)`, aspectRatio: dimensions ? `${dimensions.width} / ${dimensions.height}` : "4 / 3" }}
        role="group"
        aria-label="이미지 자르기 영역 편집"
        onPointerDown={startPointer}
        onPointerMove={movePointer}
        onPointerUp={finishPointer}
        onPointerCancel={finishPointer}
        onLostPointerCapture={() => { if (dragRef.current) { dragRef.current = null; onEnd(); } }}
      >
        <canvas ref={canvasRef} className="crop-stage-image" aria-hidden="true" />
        {rect && <div
          className="crop-selection"
          data-crop-selection="true"
          tabIndex={0}
          role="group"
          aria-label={`선택된 자르기 영역 ${dimensionsNote}. 방향키로 이동, Shift+방향키로 크게 이동`}
          onKeyDown={keyboardMove}
          style={{ left: percent(rect.x), top: percent(rect.y), width: percent(rect.w), height: percent(rect.h) }}
        >
          {(["nw", "ne", "sw", "se"] as const).map((corner) => <span key={corner} data-crop-handle={corner} className={`crop-handle crop-handle-${corner}`} aria-hidden="true" />)}
        </div>}
      </div>
      <div className="crop-preview-footer">
        <span aria-live="polite">{dimensionsNote ? `선택 크기 ${dimensionsNote}` : "이미지를 불러오는 중…"}</span>
        <span>모바일 터치 · 마우스 · 키보드</span>
      </div>
    </div>
  );
}
