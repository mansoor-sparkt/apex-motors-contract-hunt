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
      className="game-celeb on"
      onClick={onClose}
    >
      <div
        className="game-celeb-box"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-[48px] mb-[10px]">{state.icon}</div>
        <div className="font-orbitron text-lg font-black tracking-[0.06em] mb-[6px]">
          {state.title}
        </div>
        <div className="font-share-mono text-[11px] text-[var(--mut)] leading-[1.6] mb-[14px]">
          {state.sub}
        </div>
        <div
          className="inline-block px-[14px] py-[6px] font-share-mono text-[11px] text-[var(--o)] border border-[var(--bdr)] bg-[rgba(241,92,48,0.09)] mb-4"
          style={{
            clipPath:
              "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
          }}
        >
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
