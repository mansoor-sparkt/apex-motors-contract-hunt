"use client";

import { MachinistAvatar } from "./GameComponents";
import type { useLeaderboard } from "@/hooks/useLeaderboard";
import type { PlayerProfile } from "@/lib/game-types";

function formatTime(secs: number) {
  const mins = Math.floor(secs / 60);
  const remainSecs = secs % 60;
  return `${mins}:${remainSecs < 10 ? "0" : ""}${remainSecs}`;
}

function formatTimeLabel(secs: number) {
  return secs > 0 ? `${formatTime(secs)} MIN` : "0:00 MIN";
}

export function LeaderboardScreen({
  player,
  leaderboard,
}: {
  player: PlayerProfile;
  leaderboard: ReturnType<typeof useLeaderboard>;
}) {
  const {
    all,
    rank,
    totalParticipants,
    loading,
    error,
    baseScore,
    bonusScore,
    badgeCount,
    totalSeconds,
  } = leaderboard;

  const timeDisplay = formatTimeLabel(totalSeconds);
  const dateStr = new Date().toLocaleDateString();

  return (
    <div className="game-hub-panel">
      <div className="game-lb-hdr">
        <div className="game-bc">
          HUNT <span>›</span> LEADERBOARD
        </div>
        <p className="font-share-mono text-[10px] text-[var(--mut)] tracking-[0.08em] mb-2">
          {loading
            ? "LOADING PARTICIPANTS…"
            : `${totalParticipants || all.length} PARTICIPANTS · ${dateStr}`}
        </p>
      </div>

      <div className="game-lb-you">
        <div className="game-lb-rank">#{rank}</div>
        <div className="game-lb-av">
          <MachinistAvatar avatarIndex={player.avatarIndex} />
        </div>
        <div className="game-lb-info">
          <div className="game-lb-pn you">
            {(player.name || "YOU").toUpperCase()}
          </div>
          <div className="game-lb-sc">
            {badgeCount} BADGES · {timeDisplay}
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
        {loading && (
          <p className="font-share-mono text-[10px] text-[var(--mut)] p-4 tracking-[0.08em]">
            SYNCING LEADERBOARD…
          </p>
        )}

        {!loading && error && (
          <p className="font-share-mono text-[10px] text-[var(--mut)] p-4 tracking-[0.08em]">
            {error.toUpperCase()}
          </p>
        )}

        {!loading &&
          all.map((p, i) => (
            <div
              key={`${p.emailId}-${i}`}
              className={`game-lb-row${p.isYou ? " you" : ""}`}
            >
              <div className="game-lb-n">{i + 1}</div>
              <div className="game-lb-av">
                <MachinistAvatar avatarIndex={p.avatarIndex} />
              </div>
              <div className="game-lb-info">
                <div className={`game-lb-pn${p.isYou ? " you" : ""}`}>
                  {(p.name || "").toUpperCase()}
                  {p.isYou ? " ◄" : ""}
                </div>
                <div className="game-lb-sc">
                  {p.badges} BADGES · {formatTimeLabel(p.timeSpent)}
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
