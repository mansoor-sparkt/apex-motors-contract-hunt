"use client";

import { Panel, StatusTag } from "./GameComponents";
import { AVS, SHORTS, getRank } from "@/constants";
import type { PlayerProfile, RosterEntry, StopCompletion } from "@/lib/game-types";

const BADGE_COLORS = [
  { bg: "rgba(241,92,48,0.15)", text: "#F15C30", border: "rgba(241,92,48,0.35)" },
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
  const badgeCount =
    Object.keys(stopsDone).length + Object.keys(shortsDone).length;

  const badges = [
    ...Object.values(stopsDone)
      .filter((v) => v?.badge)
      .map((v) => v.badge as string),
    ...Object.keys(shortsDone)
      .map((k) => SHORTS.find((s) => s.slug === k)?.badge || "")
      .filter(Boolean),
  ];

  return (
    <div className="flex-1 overflow-y-auto min-h-0 px-4 py-3 scrollbar-hide space-y-3">
      <div className="text-center py-2">
        <div className="text-4xl mb-1">🏭</div>
        <div className="font-[family:var(--font-orbitron)] text-sm font-black text-[#F15C30]">
          JOB TRAVELER
        </div>
      </div>

      <Panel header="// OPERATOR PROFILE" headerColor="orange">
        <div className="flex items-center gap-3 mb-3">
          <div className="text-3xl w-12 h-12 flex items-center justify-center border border-[rgba(241,92,48,0.3)] bg-[rgba(241,92,48,0.08)]">
            {av.em}
          </div>
          <div>
            <div className="font-[family:var(--font-orbitron)] text-sm font-bold">
              {(player.name || "Operator").toUpperCase()}
            </div>
            <div className="font-[family:var(--font-share-mono)] text-[10px] text-[rgba(232,234,240,0.5)]">
              {player.school} · {player.role}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="p-2 border border-[rgba(241,92,48,0.3)]">
            <div className="font-[family:var(--font-orbitron)] text-xl font-black text-[#F15C30]">{score}</div>
            <div className="font-[family:var(--font-share-mono)] text-[8px] text-[rgba(232,234,240,0.4)]">TOTAL PTS</div>
          </div>
          <div className="p-2 border border-[rgba(0,229,255,0.2)]">
            <div className="font-[family:var(--font-orbitron)] text-xl font-black text-[#00e5ff]">#{rank}</div>
            <div className="font-[family:var(--font-share-mono)] text-[8px] text-[rgba(232,234,240,0.4)]">RANK</div>
          </div>
        </div>
        <div className="mt-2 font-[family:var(--font-share-mono)] text-[10px] text-[rgba(232,234,240,0.45)]">
          {badgeCount} badges earned · {Object.keys(stopsDone).length}/8 stops
        </div>
      </Panel>

      <Panel header="BADGES" headerColor="cyan">
        {badges.length ? (
          <div className="flex flex-wrap gap-1.5">
            {badges.map((b, i) => {
              const c = BADGE_COLORS[i % BADGE_COLORS.length];
              return (
                <span
                  key={`${b}-${i}`}
                  className="px-2 py-1 font-[family:var(--font-share-mono)] text-[9px]"
                  style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}
                >
                  🏅 {b}
                </span>
              );
            })}
          </div>
        ) : (
          <div className="font-[family:var(--font-share-mono)] text-[10px] text-[rgba(232,234,240,0.45)]">
            Complete bonus challenges to earn badges
          </div>
        )}
      </Panel>

      <Panel header="TEAM ROSTER" headerColor="green">
        {roster.length ? (
          <div className="space-y-1.5">
            {roster.map((t, i) => (
              <div key={i} className="flex items-center gap-2 font-[family:var(--font-share-mono)] text-[11px]">
                <div className="w-1.5 h-1.5 bg-[#F15C30]" />
                {t.n} — {t.c}
              </div>
            ))}
          </div>
        ) : (
          <div className="font-[family:var(--font-share-mono)] text-[10px] text-[rgba(232,234,240,0.45)]">
            Complete conversation stops to build your team
          </div>
        )}
      </Panel>

      <div className="flex gap-2 flex-wrap">
        <StatusTag variant="green">APEX MOTORS CONTRACT</StatusTag>
        <StatusTag variant="cyan">PHILLIPS MACHINIST</StatusTag>
      </div>
    </div>
  );
}
