"use client";

import { StatusTag } from "./GameComponents";
import { SHORTS } from "@/constants";
import type { CelebrationState } from "@/lib/game-types";

export function ShortsScreen({
  shortsDone,
  onComplete,
  onCelebrate,
}: {
  shortsDone: Record<string, boolean>;
  onComplete: (slug: string) => void;
  onCelebrate: (state: CelebrationState) => void;
}) {
  return (
    <div className="game-scroll flex-1 min-h-0">
      <div className="px-[14px] pt-3 pb-2 flex-shrink-0">
        <div className="game-bc">
          HUNT <span>›</span> SHOP FLOOR SHORTS
        </div>
        <p className="font-share-mono text-[10px] text-[var(--mut)] tracking-[0.08em]">
          ALL UNLOCKED · ANY ORDER · +5 PTS + BADGE EACH
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2 px-[14px] pb-[100px]">
        {SHORTS.map((s) => {
          const done = !!shortsDone[s.slug];
          return (
            <button
              key={s.slug}
              type="button"
              disabled={done}
              onClick={() => {
                onComplete(s.slug);
                onCelebrate({
                  icon: "🎬",
                  title: `${s.title} SUBMITTED!`,
                  sub: "+5 PTS EARNED.",
                  badge: s.badge,
                });
              }}
              className={`text-left p-3 border flex flex-col gap-[7px] relative transition-all duration-[0.18s] ${done
                ? "border-[rgba(57,255,20,0.3)] bg-[rgba(5,6,8,0.88)]"
                : "border-[var(--bdr)] bg-[rgba(5,6,8,0.88)] hover:-translate-y-0.5 hover:border-[rgba(241,92,48,0.5)] cursor-pointer"
                }`}
              style={{
                clipPath:
                  "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-px opacity-35"
                style={{
                  background: done
                    ? "linear-gradient(90deg, var(--g), transparent 50%)"
                    : "linear-gradient(90deg, var(--o), transparent 50%)",
                }}
              />
              <div className="text-2xl">{s.em}</div>
              <div className="font-orbitron text-[11px] font-bold tracking-[0.04em] leading-tight">
                {s.title}
              </div>
              <div className="font-rajdhani text-[11px] text-[var(--mut)] leading-snug">
                {s.desc}
              </div>
              <div className="flex items-center justify-between">
                <StatusTag variant={s.type === "photo" ? "cyan" : "purple"}>
                  <span className="text-[9px]">
                    {s.type === "photo" ? "📷 PHOTO" : "🎬 VIDEO"}
                  </span>
                </StatusTag>
                {done ? (
                  <StatusTag variant="green">
                    <span className="text-[9px]">✓ DONE</span>
                  </StatusTag>
                ) : (
                  <span className="font-orbitron text-[11px] font-bold text-[var(--g)]">
                    +5 PTS
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
