"use client";

import { GameButton, ScoreRow } from "./GameComponents";
import { IMAGE_URLS } from "@/constants";

export function SplashScreen({
  onStart,
  onDemo,
}: {
  onStart: () => void;
  onDemo: () => void;
}) {
  return (
    <div className="absolute inset-0 flex flex-col h-full w-full overflow-hidden">
      <div className="relative flex-1 min-h-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('${IMAGE_URLS.splashHero}')`,
            backgroundSize: "cover",
            backgroundPosition: "center 40%",
            filter: "brightness(0.45) saturate(0.85)",
          }}
        />

        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-[14px] border border-[rgba(241,92,48,0.18)]"
            style={{
              clipPath:
                "polygon(0 20px, 20px 0, calc(100% - 20px) 0, 100% 20px, 100% calc(100% - 20px), calc(100% - 20px) 100%, 20px 100%, 0 calc(100% - 20px))",
            }}
          />
          <div
            className="absolute left-0 right-0 h-[2px] opacity-60"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(241,92,48,0.7), transparent)",
              animation: "sweep 4s linear infinite",
            }}
          />
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 px-5 pb-5 pt-10"
          style={{
            background:
              "linear-gradient(to top, rgba(4,5,6,0.88) 0%, rgba(4,5,6,0.85) 50%, transparent 100%)",
          }}
        >
          <div className="flex items-center gap-2 mb-2 font-[family:var(--font-share-mono)] text-[10px] text-[#00e5ff] tracking-[0.2em] uppercase">
            <span className="w-6 h-px bg-[#00e5ff]" />
            Phillips Machinist
          </div>
          <div className="font-[family:var(--font-orbitron)] text-2xl font-black leading-tight tracking-[0.02em] mb-3">
            Apex Motors
            <span
              className="block text-[#F15C30]"
              style={{ textShadow: "0 0 28px rgba(241,92,48,0.7)" }}
            >
              CONTRACT HUNT
            </span>
          </div>
          <div className="flex gap-[6px] mb-3">
            <ScoreRow label="Stops" value="8" />
            <ScoreRow label="Max PTS" value="160" />
            <ScoreRow label="Shorts" value="8" />
          </div>
        </div>
      </div>

      <div className="px-5 py-4 flex flex-col gap-3 flex-shrink-0">
        <GameButton variant="primary" onClick={onStart}>
          TAKE THE CONTRACT ►
        </GameButton>
        <GameButton variant="secondary" onClick={onDemo}>
          QUICK DEMO
        </GameButton>
      </div>
    </div>
  );
}
