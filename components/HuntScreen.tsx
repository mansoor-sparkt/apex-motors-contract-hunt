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

  IMAGE_URLS,
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
    <div className="absolute inset-0 flex flex-col h-full w-full overflow-hidden" style={{
      backgroundImage: `url('${IMAGE_URLS.hunter}')`,
    }}>

      {/* <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('${IMAGE_URLS.hunter}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          // filter: `brightness(${brightness * 0.6}) saturate(0.65) blur(2px)`,
        }}
      /> */}

      <HUDBar title="CONTRACT: APEX MOTORS" showLogo />

      <div className="game-hunt-hdr">
        <div className="flex items-center gap-2 relative z-[1]">
          <div className="game-hunt-av">{av.em}</div>
          <div>
            <div className="font-orbitron text-xs font-bold tracking-[0.06em]">
              {(player.name.split(" ")[0] || "OPERATOR").toUpperCase()}
            </div>
            <div className="font-share-mono text-[10px] text-[var(--mut)]">
              {player.school}
            </div>
          </div>
        </div>
        <div className="relative z-[1]">
          <StatusTag variant="orange">
            {score} / {MAX_SCORE} PTS
          </StatusTag>
        </div>
      </div>

      <div className="game-sc-row">
        <ScoreRow label="SCORE" value={score} valueColor="var(--o)" />
        <ScoreRow label="RANK" value={`#${rank}`} valueColor="var(--c)" />
        <ScoreRow label="STOPS" value={`${stopsCount}/${TOTAL_STOPS}`} />
      </div>

      <ProgressPips
        total={TOTAL_STOPS}
        completed={stopsCount}
        active={activeIdx < TOTAL_STOPS ? activeIdx : undefined}
      />

      {activeTab === "stops" && (
        <div className="game-scroll pb-20">
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
        </div>
      )}

      {activeTab === "shorts" && (
        <div className="flex-1 min-h-0 flex flex-col">
          <ShortsScreen
            shortsDone={shortsDone}
            onComplete={onShortComplete}
            onCelebrate={onCelebrate}
          />
        </div>
      )}

      {activeTab === "board" && (
        <div className="flex-1 min-h-0 overflow-hidden">
          <LeaderboardScreen
            player={player}
            score={score}
            stopsDone={stopsDone}
            shortsDone={shortsDone}
          />
        </div>
      )}

      {activeTab === "comp" && (
        <div className="flex-1 min-h-0 overflow-hidden">
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
