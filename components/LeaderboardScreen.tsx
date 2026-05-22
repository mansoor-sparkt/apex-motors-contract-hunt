"use client";

import {
  AVS,
  FLB,
  computeBaseScore,
  computeBonusScore,
  getRank,
} from "@/constants";
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
  shortsDone: Record<string, unknown>;
}) {
  const badgeCount =
    Object.keys(stopsDone).length + Object.keys(shortsDone).length;
  const av = AVS[player.avatarIndex] ?? AVS[0];
  const baseScore = computeBaseScore(stopsDone, shortsDone);
  const bonusScore = computeBonusScore(stopsDone);

  const all = [
    ...FLB.map((p) => ({
      n: p.n,
      s: p.s,
      base: p.base,
      bonus: p.bonus,
      total: p.base + p.bonus,
      b: p.b,
      av: p.av,
      isYou: false,
    })),
    {
      n: player.name || "You",
      s: player.school,
      base: baseScore,
      bonus: bonusScore,
      total: score,
      b: badgeCount,
      av: av.em,
      isYou: true,
    },
  ].sort((a, b) => b.total - a.total);

  const rank = getRank(score, player.name);
  const dateStr = new Date().toLocaleDateString();

  return (
    <div className="game-hub-panel">
      <div className="game-lb-hdr">
        <div className="game-bc">
          HUNT <span>›</span> LEADERBOARD
        </div>
        <p className="font-share-mono text-[10px] text-[var(--mut)] tracking-[0.08em] mb-2">
          {all.length + 180} PARTICIPANTS · {dateStr}
        </p>
      </div>

      <div className="game-lb-you">
        <div className="game-lb-rank">#{rank}</div>
        <div className="game-lb-av">{av.em}</div>
        <div className="game-lb-info">
          <div className="game-lb-pn you">
            {(player.name || "YOU").toUpperCase()}
          </div>
          <div className="game-lb-sc">
            {player.school} · {badgeCount} BADGES
          </div>
        </div>
        <div className="game-lb-score-wrap">
          <div>
            <span className="game-lb-you-total">{baseScore}</span>
            <span className="game-lb-you-bonus"> +{bonusScore}</span>
          </div>
          <div className="game-lb-you-sub">BASE + BONUS</div>
        </div>
      </div>

      <div className="game-scroll game-lb-list flex-1 min-h-0">
        {all.map((p, i) => (
          <div
            key={`${p.n}-${i}`}
            className={`game-lb-row${p.isYou ? " you" : ""}`}
          >
            <div className="game-lb-n">{i + 1}</div>
            <div className="game-lb-av">{p.isYou ? av.em : p.av}</div>
            <div className="game-lb-info">
              <div className={`game-lb-pn${p.isYou ? " you" : ""}`}>
                {(p.n || "").toUpperCase()}
                {p.isYou ? " ◄" : ""}
              </div>
              <div className="game-lb-sc">
                {p.s} · {p.b} BADGES
              </div>
            </div>
            <div className="game-lb-score-wrap">
              <div className="game-lb-score">{p.total}</div>
              <div className="game-lb-score-sub">
                {p.base}+{p.bonus}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
