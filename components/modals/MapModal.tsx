"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useCallback, useEffect, useRef, useState } from "react";
import { MAP_IMAGES } from "@/constants";
import Image from "next/image";

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.25;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function touchDistance(touches: TouchList) {
  if (touches.length < 2) return 0;
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.hypot(dx, dy);
}

const MapModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [view, setView] = useState<"zoomOut" | "zoomIn">("zoomOut");
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isPinching, setIsPinching] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    active: boolean;
    startX: number;
    startY: number;
    startOffsetX: number;
    startOffsetY: number;
  } | null>(null);
  const pinchRef = useRef<{ distance: number; scale: number } | null>(null);

  const resetTransform = useCallback(() => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    resetTransform();
  }, [view, resetTransform]);

  useEffect(() => {
    if (!isOpen) resetTransform();
  }, [isOpen, resetTransform]);

  const clampOffset = useCallback((x: number, y: number, zoom: number) => {
    if (!containerRef.current || zoom <= 1) return { x: 0, y: 0 };
    const maxX = (containerRef.current.clientWidth * (zoom - 1)) / 2;
    const maxY = (containerRef.current.clientHeight * (zoom - 1)) / 2;
    return {
      x: clamp(x, -maxX, maxX),
      y: clamp(y, -maxY, maxY),
    };
  }, []);

  const setZoom = useCallback((next: number | ((prev: number) => number)) => {
    setScale((prev) => {
      const value =
        typeof next === "function"
          ? clamp(next(prev), MIN_ZOOM, MAX_ZOOM)
          : clamp(next, MIN_ZOOM, MAX_ZOOM);
      if (value <= 1) setOffset({ x: 0, y: 0 });
      else setOffset((o) => clampOffset(o.x, o.y, value));
      return value;
    });
  }, [clampOffset]);

  const zoomBy = (delta: number) => setZoom((s) => s + delta);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    zoomBy(e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP);
  };

  const startDrag = (clientX: number, clientY: number) => {
    if (scale <= 1) return;
    setIsDragging(true);
    dragRef.current = {
      active: true,
      startX: clientX,
      startY: clientY,
      startOffsetX: offset.x,
      startOffsetY: offset.y,
    };
  };

  const moveDrag = (clientX: number, clientY: number) => {
    const drag = dragRef.current;
    if (!drag?.active) return;
    const dx = clientX - drag.startX;
    const dy = clientY - drag.startY;
    setOffset(
      clampOffset(
        drag.startOffsetX + dx,
        drag.startOffsetY + dy,
        scale,
      ),
    );
  };

  const endDrag = () => {
    if (dragRef.current) dragRef.current.active = false;
    setIsDragging(false);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    startDrag(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (pinchRef.current) return;
    moveDrag(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
    endDrag();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      setIsPinching(true);
      pinchRef.current = { distance: touchDistance(e.touches), scale };
      endDrag();
      return;
    }
    if (e.touches.length === 1 && scale > 1) {
      startDrag(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchRef.current) {
      e.preventDefault();
      const distance = touchDistance(e.touches);
      if (!distance || !pinchRef.current.distance) return;
      const ratio = distance / pinchRef.current.distance;
      setZoom(pinchRef.current.scale * ratio);
      return;
    }
    if (e.touches.length === 1) {
      moveDrag(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchEnd = () => {
    pinchRef.current = null;
    setIsPinching(false);
    endDrag();
  };

  const canPan = scale > 1;

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 500,
            background: "rgba(0,0,0,0.88)",
            animation: "fadeIn .2s ease both",
          }}
        />
        <Dialog.Content
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 501,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 16px",
          }}
        >
          <Dialog.Title className="sr-only">Show Floor Map</Dialog.Title>

          <div
            style={{
              background: "rgba(8,10,14,0.98)",
              border: "1px solid var(--c)",
              width: "min(360px, 92vw)",
              clipPath:
                "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))",
              animation: "cbPop .35s cubic-bezier(.34,1.56,.64,1) both",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "11px 14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid rgba(0,229,255,0.18)",
                background:
                  "linear-gradient(135deg, rgba(0,229,255,0.12), rgba(177,77,255,0.05))",
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "var(--fm)",
                    fontSize: 9,
                    letterSpacing: ".18em",
                    color: "var(--c)",
                    marginBottom: 3,
                  }}
                >
                  // STARTING LOCATION
                </div>
                <div
                  style={{
                    fontFamily: "var(--fd)",
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: ".04em",
                    color: "var(--txt)",
                  }}
                >
                  BOOTH #837 (HAAS)
                </div>
              </div>
              <Dialog.Close asChild>
                <button
                  type="button"
                  style={{
                    fontFamily: "var(--fm)",
                    fontSize: 10,
                    color: "var(--c)",
                    border: "1px solid rgba(0,229,255,0.3)",
                    background: "rgba(0,229,255,0.08)",
                    padding: "5px 10px",
                    cursor: "pointer",
                    clipPath:
                      "polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px))",
                  }}
                >
                  ✕ CLOSE
                </button>
              </Dialog.Close>
            </div>

            <div className="flex p-2 gap-2 bg-[#050608]">
              <button
                type="button"
                onClick={() => setView("zoomOut")}
                className={`flex-1 py-2 font-share-mono text-[10px] tracking-widest border ${view === "zoomOut" ? "border-[var(--c)] bg-[rgba(0,229,255,0.1)] text-[var(--c)]" : "border-[var(--bdr)] bg-transparent text-[var(--mut)]"}`}
              >
                🔍 ZOOM OUT (HALL)
              </button>
              <button
                type="button"
                onClick={() => setView("zoomIn")}
                className={`flex-1 py-2 font-share-mono text-[10px] tracking-widest border ${view === "zoomIn" ? "border-[var(--c)] bg-[rgba(0,229,255,0.1)] text-[var(--c)]" : "border-[var(--bdr)] bg-transparent text-[var(--mut)]"}`}
              >
                📍 ZOOM IN (BOOTH)
              </button>
            </div>

            <div
              ref={containerRef}
              onWheel={handleWheel}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onDoubleClick={resetTransform}
              style={{
                background: "#000",
                height: 280,
                position: "relative",
                padding: "8px",
                overflow: "hidden",
                touchAction: "none",
                cursor: canPan ? (isDragging ? "grabbing" : "grab") : "zoom-in",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  position: "relative",
                  transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                  transformOrigin: "center center",
                  transition: isDragging || isPinching ? "none" : "transform 0.12s ease-out",
                }}
              >
                <Image
                  src={MAP_IMAGES[view]}
                  alt="Floor Map"
                  style={{
                    objectFit: "contain",
                    display: "block",
                    userSelect: "none",
                    pointerEvents: "none",
                  }}
                  fill
                  draggable={false}
                />
              </div>

              <div
                className="absolute bottom-3 right-3 flex flex-col gap-1 z-10"
                onPointerDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => zoomBy(ZOOM_STEP)}
                  disabled={scale >= MAX_ZOOM}
                  aria-label="Zoom in"
                  className="w-8 h-8 font-share-mono text-sm border border-[rgba(0,229,255,0.4)] bg-[rgba(0,0,0,0.75)] text-[var(--c)] disabled:opacity-40"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => zoomBy(-ZOOM_STEP)}
                  disabled={scale <= MIN_ZOOM}
                  aria-label="Zoom out"
                  className="w-8 h-8 font-share-mono text-sm border border-[rgba(0,229,255,0.4)] bg-[rgba(0,0,0,0.75)] text-[var(--c)] disabled:opacity-40"
                >
                  −
                </button>
                {scale > 1 && (
                  <button
                    type="button"
                    onClick={resetTransform}
                    aria-label="Reset zoom"
                    className="w-8 h-8 font-share-mono text-[8px] border border-[rgba(0,229,255,0.4)] bg-[rgba(0,0,0,0.75)] text-[var(--c)]"
                  >
                    ⟲
                  </button>
                )}
              </div>

              <p className="absolute bottom-2 left-2 font-share-mono text-[8px] text-[var(--mut)] tracking-[0.06em] pointer-events-none z-10">
                SCROLL · PINCH · DRAG · DOUBLE-TAP RESET
              </p>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default MapModal;
