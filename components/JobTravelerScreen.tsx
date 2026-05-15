"use client";

import { AVS, SHORTS, getRank } from "@/constants";
import type { PlayerProfile, RosterEntry, StopCompletion } from "@/lib/game-types";

const BADGE_COLORS = [
  { bg: "rgba(241,92,48,0.15)", text: "#F15C30", border: "rgba(241,92,48,0.3)" },
  { bg: "rgba(0,229,255,0.10)", text: "#00e5ff", border: "rgba(0,229,255,0.3)" },
  { bg: "rgba(57,255,20,0.08)", text: "#39ff14", border: "rgba(57,255,20,0.3)" },
  { bg: "rgba(255,187,0,0.10)", text: "#ffbb00", border: "rgba(255,187,0,0.3)" },
  { bg: "rgba(177,77,255,0.10)", text: "#b14dff", border: "rgba(177,77,255,0.3)" },
];

export function JobTravelerScreen({
  player,
  score,
  stopsDone,
  shortsDone,
  roster,
}: {
  player: PlayerProfile;
  score: number;
  stopsDone: Record<number, StopCompletion>;
  shortsDone: Record<string, boolean>;
  roster: RosterEntry[];
}) {
  const av = AVS[player.avatarIndex] ?? AVS[0];
  const rank = getRank(score, player.name);

  const badges = [
    ...Object.values(stopsDone)
      .filter((v) => v?.badge)
      .map((v) => v.badge as string),
    ...Object.keys(shortsDone)
      .map((k) => SHORTS.find((s) => s.slug === k)?.badge || "")
      .filter(Boolean),
  ];

  return (
    <div className="game-scroll pb-20 h-full">
      <div className="comp-hero px-4 py-4 text-center flex-shrink-0 bg-gradient-to-b from-[rgba(241,92,48,0.08)] to-transparent">
        <div className="game-bc flex justify-center mb-2">
          HUNT <span style={{ margin: "0 5px", color: "var(--o)" }}>›</span>{" "}
          <span style={{ color: "var(--o)" }}>JOB TRAVELER</span>
        </div>
        <div
          className="text-[52px] mb-2"
          style={{ animation: "compBounce 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) both" }}
        >
          🏭
        </div>
        <h2 className="font-orbitron text-[22px] font-black tracking-[0.04em] leading-tight my-2.5">
          500 BRACKETS
          <br />
          <span className="text-[var(--o)]">SHIPPED.</span>
        </h2>
        <p className="font-share-mono text-[11px] text-[var(--mut)] leading-[1.65]">
          Apex Motors signs off on the lot.
          <br />
          A second PO hits your inbox.
          <br />
          <strong className="text-[var(--txt)]">YOUR SHOP IS REAL NOW.</strong>
        </p>
      </div>

      <div
        className="mx-[14px] mb-3.5 border border-[var(--bdr)] overflow-hidden relative bg-[var(--panel)]"
        style={{
          clipPath:
            "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
        }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{
            background:
              "linear-gradient(90deg, var(--o), var(--pu), transparent)",
          }}
        />
        <div className="trav-top flex items-center gap-3 p-3.5 border-b border-[var(--bdr)] bg-gradient-to-br from-[rgba(241,92,48,0.12)] to-[rgba(177,77,255,0.06)]">
          <div
            className="w-[46px] h-[46px] flex items-center justify-center text-[26px] bg-[rgba(241,92,48,0.1)] border border-[var(--bdr)]"
            style={{
              clipPath:
                "polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px))",
            }}
          >
            {av.em}
          </div>
          <div>
            <div className="font-share-mono text-[9px] tracking-[0.18em] uppercase text-[var(--o)] mb-1">
              // JOB TRAVELER
            </div>
            <div className="font-orbitron text-base font-black tracking-[0.04em]">
              {(player.name || "Operator").toUpperCase()}
            </div>
            <div className="font-share-mono text-[10px] text-[var(--mut)] mt-0.5">
              {player.school} · {player.role}
            </div>
          </div>
        </div>

        <div className="p-3.5 flex flex-col gap-3">
          <div>
            <div className="font-share-mono text-[9px] tracking-[0.14em] uppercase text-[var(--mut)] mb-1.5">
              SCORE
            </div>
            <div
              className="font-orbitron text-4xl font-black text-[var(--o)] leading-none"
              style={{ textShadow: "0 0 24px rgba(241, 92, 48, 0.5)" }}
            >
              {score}
            </div>
            <div className="font-share-mono text-[10px] text-[var(--mut)] mt-1">
              RANK #{rank} · — MIN
            </div>
          </div>

          <div className="border-t border-[rgba(255,255,255,0.05)] pt-3">
            <div className="font-share-mono text-[9px] tracking-[0.14em] uppercase text-[var(--mut)] mb-1.5">
              BADGES EARNED
            </div>
            {badges.length ? (
              <div className="flex flex-wrap gap-1.5">
                {badges.map((b, i) => {
                  const c = BADGE_COLORS[i % BADGE_COLORS.length];
                  return (
                    <span
                      key={`${b}-${i}`}
                      className="px-2.5 py-1 font-share-mono text-[10px]"
                      style={{
                        background: c.bg,
                        color: c.text,
                        border: `1px solid ${c.border}`,
                        clipPath:
                          "polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px))",
                      }}
                    >
                      {b}
                    </span>
                  );
                })}
              </div>
            ) : (
              <p className="font-share-mono text-[10px] text-[var(--mut)]">
                COMPLETE BONUS CHALLENGES
              </p>
            )}
          </div>

          <div className="border-t border-[rgba(255,255,255,0.05)] pt-3">
            <div className="font-share-mono text-[9px] tracking-[0.14em] uppercase text-[var(--mut)] mb-1.5">
              CONTRACT
            </div>
            <p className="font-share-mono text-[11px] text-[rgba(232,234,240,0.8)] leading-[1.7]">
              APEX MOTORS · 500 BRAKE CALIPER BRACKETS
              <br />
              MATERIAL: 6061 ALUMINUM
            </p>
          </div>

          <div className="border-t border-[rgba(255,255,255,0.05)] pt-3">
            <div className="font-share-mono text-[9px] tracking-[0.14em] uppercase text-[var(--mut)] mb-1.5">
              TEAM BUILT
            </div>
            {roster.length ? (
              roster.map((t, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 font-share-mono text-[11px] text-[rgba(232,234,240,0.8)] mb-1"
                >
                  <div className="w-[5px] h-[5px] bg-[var(--o)] flex-shrink-0" />
                  {t.n} — {t.c}
                </div>
              ))
            ) : (
              <p className="font-share-mono text-[10px] text-[var(--mut)]">
                COMPLETE CONVERSATION STOPS TO BUILD YOUR TEAM
              </p>
            )}
          </div>

          <div className="border-t border-[rgba(255,255,255,0.05)] pt-3 text-center">
            <p className="font-share-mono text-[10px] text-[var(--mut)] mb-1">
              POWERED BY PHILLIPS MACHINIST
            </p>
            <p className="font-orbitron text-xs text-[var(--o)] tracking-[0.06em]">
              📱 DOWNLOAD THE APP [QR]
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
