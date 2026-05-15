"use client";

import { GameButton } from "./GameComponents";
import type { CelebrationState } from "@/lib/game-types";

export function CelebrationModal({
  state,
  onClose,
  onContinue,
}: {
  state: CelebrationState | null;
  onClose: () => void;
  onContinue?: () => void;
}) {
  if (!state) return null;

  return (
    <div
      className="absolute inset-0 z-[500] flex items-center justify-center opacity-100 pointer-events-auto"
      style={{ background: "rgba(0,0,0,0.82)" }}
      onClick={onClose}
    >
      <div
        className="bg-[rgba(8,10,14,0.98)] border border-[#F15C30] p-7 text-center w-[300px] max-w-[90vw] relative"
        style={{
          clipPath:
            "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))",
          animation: "cbPop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-5xl mb-2">{state.icon}</div>
        <div className="font-[family:var(--font-orbitron)] text-lg font-black tracking-wide mb-1">
          {state.title}
        </div>
        <div className="font-[family:var(--font-share-mono)] text-[11px] text-[rgba(232,234,240,0.5)] leading-relaxed mb-3">
          {state.sub}
        </div>
        <div className="inline-block px-3 py-1 font-[family:var(--font-share-mono)] text-[11px] text-[#F15C30] border border-[rgba(241,92,48,0.3)] bg-[rgba(241,92,48,0.09)] mb-4">
          🏅 {state.badge}
        </div>
        <GameButton
          variant="primary"
          onClick={() => {
            onContinue?.();
            onClose();
          }}
        >
          CONTINUE MISSION ►
        </GameButton>
      </div>
    </div>
  );
}
