"use client";

import { AVS, FLB, getRank } from "@/constants";
import type { PlayerProfile } from "@/lib/game-types";

export function LeaderboardScreen({
  player,
  score,
  stopsDone,
  shortsDone,
}: {
  player: PlayerProfile;
  score: number;
  stopsDone: Record<number, { bonus: boolean; badge: string | null }>;
  shortsDone: Record<string, boolean>;
}) {
  const badgeCount =
    Object.keys(stopsDone).length + Object.keys(shortsDone).length;
  const av = AVS[player.avatarIndex] ?? AVS[0];

  const all = [
    ...FLB.map((p) => ({
      n: p.n,
      s: p.s,
      sc: p.sc,
      b: p.b,
      av: p.av,
      isYou: false,
    })),
    {
      n: player.name || "You",
      s: player.school,
      sc: score,
      b: badgeCount,
      av: av.em,
      isYou: true,
    },
  ].sort((a, b) => b.sc - a.sc);

  const rank = getRank(score, player.name);
  const dateStr = new Date().toLocaleDateString();

  return (
    <div className="game-scroll pb-20">
      <div className="px-[14px] pt-2.5">
        <div className="game-bc">
          HUNT <span>›</span> LEADERBOARD
        </div>
        <p className="font-share-mono text-[10px] text-[var(--mut)] tracking-[0.08em] mb-2.5">
          {all.length + 180} PARTICIPANTS · {dateStr}
        </p>
      </div>

      <div
        className="mx-[14px] mb-2.5 flex items-center gap-2.5 p-[11px_14px] border border-[var(--bdr)] bg-[rgba(241,92,48,0.09)]"
        style={{
          clipPath:
            "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
        }}
      >
        <div className="font-orbitron text-xl font-black text-[var(--o)] min-w-9">
          #{rank}
        </div>
        <div
          className="w-7 h-7 flex items-center justify-center text-[15px] bg-[rgba(255,255,255,0.04)] border border-[var(--bdr)] flex-shrink-0"
          style={{
            clipPath:
              "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))",
          }}
        >
          {av.em}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-orbitron text-xs font-semibold text-[var(--o)] truncate">
            {(player.name || "YOU").toUpperCase()}
          </div>
          <div className="font-share-mono text-[10px] text-[var(--mut)]">
            {player.school} · {badgeCount} BADGES
          </div>
        </div>
        <div className="font-orbitron text-sm font-black text-[var(--o)]">
          {score}
        </div>
      </div>

      {all.map((p, i) => (
        <div
          key={`${p.n}-${i}`}
          className={`flex items-center gap-2.5 px-[14px] py-2.5 border-b border-[rgba(255,255,255,0.04)]${p.isYou ? " bg-[rgba(241,92,48,0.05)]" : ""
            }`}
        >
          <div className="font-orbitron text-xs font-bold min-w-[22px] text-[var(--mut)]">
            {i + 1}
          </div>
          <div
            className="w-7 h-7 flex items-center justify-center text-[15px] bg-[rgba(255,255,255,0.04)] border border-[var(--bdr)] flex-shrink-0"
            style={{
              clipPath:
                "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))",
            }}
          >
            {p.isYou ? av.em : p.av}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-orbitron text-xs font-semibold truncate">
              {(p.n || "").toUpperCase()}
              {p.isYou ? " ◄" : ""}
            </div>
            <div className="font-share-mono text-[10px] text-[var(--mut)]">
              {p.s} · {p.b} BADGES
            </div>
          </div>
          <div className="font-orbitron text-sm font-black text-[var(--o)]">
            {p.sc}
          </div>
        </div>
      ))}
    </div>
  );
}
