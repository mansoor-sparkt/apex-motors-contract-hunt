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
    <div className="flex-1 overflow-y-auto min-h-0 px-4 py-3 scrollbar-hide space-y-3">
      <div className="font-[family:var(--font-share-mono)] text-[10px] text-[rgba(232,234,240,0.45)] tracking-wider">
        {all.length + 180} PARTICIPANTS · {dateStr}
      </div>

      <div
        className="flex items-center gap-3 p-3 border border-[#F15C30] bg-[rgba(241,92,48,0.08)]"
        style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))" }}
      >
        <div className="font-[family:var(--font-orbitron)] text-xl font-black text-[#F15C30] w-10 text-center">
          #{rank}
        </div>
        <div className="text-2xl">{av.em}</div>
        <div className="flex-1 min-w-0">
          <div className="font-[family:var(--font-orbitron)] text-xs font-bold text-[#F15C30] truncate">
            {(player.name || "YOU").toUpperCase()}
          </div>
          <div className="font-[family:var(--font-share-mono)] text-[9px] text-[rgba(232,234,240,0.5)]">
            {player.school} · {badgeCount} BADGES
          </div>
        </div>
        <div className="font-[family:var(--font-orbitron)] text-lg font-black text-[#39ff14]">
          {score}
        </div>
      </div>

      <div className="space-y-1">
        {all.map((p, i) => (
          <div
            key={`${p.n}-${i}`}
            className={`flex items-center gap-2.5 px-3 py-2 border-b border-[rgba(255,255,255,0.05)] ${
              p.isYou ? "bg-[rgba(241,92,48,0.06)]" : ""
            }`}
          >
            <div className="font-[family:var(--font-orbitron)] text-xs font-bold text-[rgba(232,234,240,0.35)] w-5">
              {i + 1}
            </div>
            <div className="text-lg">{p.isYou ? av.em : p.av}</div>
            <div className="flex-1 min-w-0">
              <div className="font-[family:var(--font-orbitron)] text-[10px] font-bold truncate">
                {(p.n || "").toUpperCase()}
                {p.isYou ? " ◄" : ""}
              </div>
              <div className="font-[family:var(--font-share-mono)] text-[9px] text-[rgba(232,234,240,0.45)]">
                {p.s} · {p.b} BADGES
              </div>
            </div>
            <div className="font-[family:var(--font-orbitron)] text-sm font-bold text-[#39ff14]">
              {p.sc}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
