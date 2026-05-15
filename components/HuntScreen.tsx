"use client";

import {
  HUDBar,
  ProgressPips,
  HuntStopRow,
  ScoreRow,
  StatusTag,
} from "./GameComponents";
import { ShortsScreen } from "./ShortsScreen";
import { LeaderboardScreen } from "./LeaderboardScreen";
import { JobTravelerScreen } from "./JobTravelerScreen";
import { BottomNav } from "./BottomNav";
import {
  STOPS,
  AVS,
  TOTAL_STOPS,
  MAX_SCORE,
  getActiveStopIndex,
  getRank,
} from "@/constants";
import type {
  CelebrationState,
  HuntTab,
  PlayerProfile,
  RosterEntry,
  StopCompletion,
} from "@/lib/game-types";

export function HuntScreen({
  player,
  score,
  stopsDone,
  shortsDone,
  roster,
  activeTab,
  onTabChange,
  onOpenStop,
  onShortComplete,
  onCelebrate,
}: {
  player: PlayerProfile;
  score: number;
  stopsDone: Record<number, StopCompletion>;
  shortsDone: Record<string, boolean>;
  roster: RosterEntry[];
  activeTab: HuntTab;
  onTabChange: (tab: HuntTab) => void;
  onOpenStop: (index: number) => void;
  onShortComplete: (slug: string) => void;
  onCelebrate: (state: CelebrationState) => void;
}) {
  const av = AVS[player.avatarIndex] ?? AVS[0];
  const activeIdx = getActiveStopIndex(stopsDone);
  const stopsCount = Object.keys(stopsDone).length;
  const rank = getRank(score, player.name);

  return (
    <div className="absolute inset-0 flex flex-col h-full w-full overflow-hidden bg-[rgba(4,5,6,0.97)]">
      <HUDBar title="APEX MOTORS CONTRACT" />

      <div className="px-3.5 py-2.5 flex items-center gap-2.5 border-b border-[rgba(241,92,48,0.2)] bg-[rgba(4,5,6,0.92)]">
        <div className="text-2xl w-10 h-10 flex items-center justify-center bg-[rgba(241,92,48,0.1)] border border-[rgba(241,92,48,0.3)]">
          {av.em}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-[family:var(--font-orbitron)] text-xs font-black tracking-wide">
            {(player.name.split(" ")[0] || "OPERATOR").toUpperCase()}
          </div>
          <div className="font-[family:var(--font-share-mono)] text-[9px] text-[rgba(232,234,240,0.45)] truncate">
            {player.school}
          </div>
        </div>
        <StatusTag variant="orange">{score} / {MAX_SCORE} PTS</StatusTag>
      </div>

      <ProgressPips
        total={TOTAL_STOPS}
        completed={stopsCount}
        active={activeIdx < TOTAL_STOPS ? activeIdx : undefined}
      />

      <div className="flex gap-1.5 px-3.5 py-2">
        <ScoreRow label="Score" value={score} />
        <ScoreRow label="Rank" value={`#${rank}`} />
        <ScoreRow label="Stops" value={`${stopsCount}/${TOTAL_STOPS}`} />
      </div>

      {activeTab === "stops" && (
        <div className="flex-1 overflow-y-auto min-h-0 scrollbar-hide bg-[rgba(4,5,6,0.88)]">
          {STOPS.map((s, i) => {
            const done = !!stopsDone[i];
            const active = !done && (i === 0 || !!stopsDone[i - 1]);
            const locked = !done && !active;
            return (
              <HuntStopRow
                key={s.n}
                index={i}
                company={s.co}
                task={s.task}
                done={done}
                active={active}
                locked={locked}
                bonus={stopsDone[i]?.bonus}
                onClick={() => !locked && onOpenStop(i)}
              />
            );
          })}
          <div className="flex gap-2 px-3.5 py-3">
            <StatusTag variant="cyan">TACTICAL MAP LOADED</StatusTag>
            <StatusTag variant="green">SYSTEMS ONLINE</StatusTag>
          </div>
        </div>
      )}

      {activeTab === "shorts" && (
        <div className="flex-1 min-h-0 flex flex-col bg-[rgba(4,5,6,0.88)]">
        <ShortsScreen
          shortsDone={shortsDone}
          onComplete={onShortComplete}
          onCelebrate={onCelebrate}
        />
        </div>
      )}

      {activeTab === "board" && (
        <div className="flex-1 min-h-0 overflow-hidden bg-[rgba(4,5,6,0.88)]">
        <LeaderboardScreen
          player={player}
          score={score}
          stopsDone={stopsDone}
          shortsDone={shortsDone}
        />
        </div>
      )}

      {activeTab === "comp" && (
        <div className="flex-1 min-h-0 overflow-hidden bg-[rgba(4,5,6,0.88)]">
        <JobTravelerScreen
          player={player}
          score={score}
          stopsDone={stopsDone}
          shortsDone={shortsDone}
          roster={roster}
        />
        </div>
      )}

      <BottomNav active={activeTab} onChange={onTabChange} />
    </div>
  );
}
