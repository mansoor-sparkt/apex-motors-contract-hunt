"use client";

import { GameButton, HUDBar } from "./GameComponents";
import { IMAGE_URLS } from "@/constants";

function SplashStat({ value, label }: { value: string; label: string }) {
  return (
    <div
      className="flex-1 border border-[var(--bdr)] p-[7px_10px] relative overflow-hidden"
      style={{
        background: "rgba(5, 6, 8, 0.88)",
        clipPath:
          "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
      }}
    >
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, var(--o), transparent)",
        }}
      />
      <div className="font-orbitron text-sm font-black text-[var(--o)]">
        {value}
      </div>
      <div className="font-share-mono text-[8px] text-[var(--mut)] tracking-[0.1em] mt-[1px]">
        {label}
      </div>
    </div>
  );
}

export function SplashScreen({
  onStart,
  onDemo,
}: {
  onStart: () => void;
  onDemo: () => void;
}) {
  return (
    <div className="relative flex min-h-full w-full flex-col overflow-x-hidden">
      <HUDBar title="NLSC 2026 · ATLANTA" showLogo />

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="relative min-h-[min(38dvh,220px)] flex-1 overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url('${IMAGE_URLS.splashHero.src}')`,

              backgroundSize: "cover",
              backgroundPosition: "center 40%",
              filter: "brightness(0.45) saturate(0.85)",
            }}
          />

          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(rgba(241, 92, 48, 0.04) 1px, transparent 1px),
                linear-gradient(90deg, rgba(241, 92, 48, 0.04) 1px, transparent 1px)
              `,
              backgroundSize: "32px 32px",
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

          <div className="absolute inset-0 pointer-events-none">
            {[
              { cls: "top-[22px] left-[22px]", label: "ZONE A" },
              { cls: "top-[22px] right-[22px] flex-row-reverse", label: "NLSC 2026" },
              { cls: "bottom-[22px] left-[22px]", label: "8 STOPS" },
              { cls: "bottom-[22px] right-[22px] flex-row-reverse", label: "160 PTS MAX" },
            ].map((m) => (
              <div
                key={m.label}
                className={`absolute ${m.cls} flex items-center gap-[5px] font-share-mono text-[9px] text-[rgba(241,92,48,0.55)] tracking-[0.1em] before:content-[''] before:w-5 before:h-px before:bg-[rgba(241,92,48,0.4)]`}
              >
                {m.label}
              </div>
            ))}
          </div>

          <div className="absolute top-[18px] right-[18px] flex flex-col gap-[6px] pointer-events-none">
            <div className="flex items-center gap-[5px] font-share-mono text-[9px] text-[var(--g)] tracking-[0.1em]">
              <div
                className="w-[5px] h-[5px] rounded-full bg-[var(--g)]"
                style={{
                  boxShadow: "0 0 6px var(--gg)",
                  animation: "blink 2s step-end infinite",
                }}
              />
              SYSTEM ONLINE
            </div>
            <div className="flex items-center gap-[5px] font-share-mono text-[9px] text-[var(--c)] tracking-[0.1em]">
              <div
                className="w-[5px] h-[5px] rounded-full bg-[var(--c)]"
                style={{
                  boxShadow: "0 0 6px var(--cg)",
                  animation: "blink 3s step-end infinite",
                }}
              />
              GPS ACTIVE
            </div>
          </div>

          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              background:
                "linear-gradient(to top, rgba(4,5,6,0.88) 0%, rgba(4,5,6,0.85) 50%, transparent 100%)",
            }}
          >
            <div className="px-5 pt-10 pb-5">
              <div className="flex items-center gap-2 mb-2 font-(--font-share-mono) text-[10px] text-[var(--c)] tracking-[0.2em] uppercase">
                <span className="w-6 h-px bg-[var(--c)]" />
                CONTRACT INCOMING
              </div>
              <div className="font-orbitron text-[26px] font-black leading-[1.05] tracking-[0.02em]">
                PHILLIPS
                <br />
                MACHINIST
                <br />
                <span
                  className="text-[var(--o)]"
                  style={{ textShadow: "0 0 28px rgba(241,92,48,0.7)" }}
                >
                  CHALLENGE
                </span>
              </div>
              <div className="flex gap-[6px] mt-[10px]">
                <SplashStat value="500" label="PARTS" />
                <SplashStat value="6 WKS" label="DEADLINE" />
                <SplashStat value="8" label="STOPS" />
                <SplashStat value="160" label="MAX PTS" />
              </div>
            </div>
          </div>
        </div>

        <div
          className="flex flex-shrink-0 flex-col gap-[7px] border-t border-[var(--bdr)] px-[14px] pb-[max(14px,env(safe-area-inset-bottom))] pt-[14px]"
          style={{ background: "rgba(4, 5, 6, 0.88)" }}
        >
          <GameButton variant="primary" onClick={onStart}>
            ► ACCEPT THE CONTRACT
          </GameButton>
          <GameButton variant="secondary" onClick={onDemo}>
            QUICK DEMO — SKIP SETUP
          </GameButton>
          <div className="font-share-mono text-[9px] text-[var(--dim)] text-center tracking-[0.08em]">
            JUN 2–4 · NLSC 2026 · POWERED BY PHILLIPS MACHINIST
          </div>
        </div>
      </div>
    </div>
  );
}
