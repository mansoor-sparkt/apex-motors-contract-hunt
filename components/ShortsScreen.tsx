"use client";

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
    <div className="flex-1 overflow-y-auto min-h-0 px-4 py-3 scrollbar-hide">
      <div className="grid grid-cols-2 gap-2.5">
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
              className={`text-left p-3 border transition-colors ${
                done
                  ? "border-[rgba(57,255,20,0.3)] bg-[rgba(57,255,20,0.06)] opacity-80"
                  : "border-[rgba(241,92,48,0.25)] bg-[rgba(5,6,8,0.55)] hover:bg-[rgba(241,92,48,0.06)] cursor-pointer"
              }`}
            >
              <div className="text-2xl mb-1">{s.em}</div>
              <div className="font-[family:var(--font-orbitron)] text-[10px] font-bold tracking-wide mb-1">
                {s.title}
              </div>
              <div className="font-[family:var(--font-share-mono)] text-[9px] text-[rgba(232,234,240,0.5)] leading-snug mb-2">
                {s.desc}
              </div>
              <div className="flex items-center justify-between gap-1">
                <span
                  className={`px-1.5 py-0.5 font-[family:var(--font-share-mono)] text-[8px] border ${
                    s.type === "photo"
                      ? "text-[#00e5ff] border-[rgba(0,229,255,0.25)]"
                      : "text-[#b14dff] border-[rgba(177,77,255,0.3)]"
                  }`}
                >
                  {s.type === "photo" ? "📷 PHOTO" : "🎬 VIDEO"}
                </span>
                {done ? (
                  <span className="font-[family:var(--font-share-mono)] text-[8px] text-[#39ff14]">
                    ✓ DONE
                  </span>
                ) : (
                  <span className="font-[family:var(--font-orbitron)] text-[10px] font-bold text-[#39ff14]">
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
