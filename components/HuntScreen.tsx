"use client";

import {
  HUDBar,
  ProgressPips,
  HuntStopRow,
  PointsSplitRow,
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
  computeBaseScore,
  computeBonusScore,
  IMAGE_URLS,

} from "@/constants";
import type {
  CelebrationState,
  HuntTab,
  PlayerProfile,
  RosterEntry,
  StopCompletion,
  ShortCompletion,
} from "@/lib/game-types";

// const SUB_TAB_TITLES: Record<Exclude<HuntTab, "stops">, string> = {
//   shorts: "SHOP FLOOR SHORTS",
//   board: "LEADERBOARD",
//   comp: "MISSION REPORT",
// };


const SUB_TAB_TITLES: Record<Exclude<HuntTab, "stops">, string> = {
  shorts: "BONUS CHALLENGES",
  board: "LEADERBOARD",
  comp: "CLAIM PRIZE",
};

export function HuntScreen({
  player,


  baseScore,
  bonusScore,
  score,

  stopsDone,
  shortsDone,
  roster,
  activeTab,
  onTabChange,
  onOpenStop,
  onShortComplete,
  onCelebrate,
  onToast,
  onOpenMap,
}: {
  player: PlayerProfile;

  baseScore: number;
  bonusScore: number;
  score: number;

  stopsDone: Record<number, StopCompletion>;
  shortsDone: Record<string, ShortCompletion>;
  roster: RosterEntry[];
  activeTab: HuntTab;
  onTabChange: (tab: HuntTab) => void;
  onOpenStop: (index: number) => void;
  onShortComplete: (slug: string, data: ShortCompletion) => void;
  onCelebrate: (state: CelebrationState) => void;
  onToast: (msg: string) => void;
  onOpenMap: () => void;
}) {
  const av = AVS[player.avatarIndex] ?? AVS[0];
  const activeIdx = getActiveStopIndex(stopsDone);
  const stopsCount = Object.keys(stopsDone).length;
  const rank = getRank(score, player.name);
  // const baseScore = computeBaseScore(stopsDone);

  // const baseScore = computeBaseScore(stopsDone, shortsDone);
  // const bonusScore = computeBonusScore(stopsDone);
  const huntTitle = player.shopName
    ? player.shopName.toUpperCase()
    : "CONTRACT: REDLINE ROBOTICS";
  const isStopsTab = activeTab === "stops";
  // const isBonusTab = activeTab === 'shorts'

  // Calculate percentage for the new Bonus progress bar (capped at 100%)
  const TARGET_BONUS_SCORE = 160;
  const bonusPercent = Math.min(160, (bonusScore / TARGET_BONUS_SCORE) * 100);

  return (
    <div className="absolute inset-0 flex flex-col h-full w-full overflow-hidden" style={{
      backgroundImage: `url('${IMAGE_URLS.hunter}')`,
      backgroundSize: "cover",
      backgroundPosition: "center",

    }}>



      {isStopsTab ? (
        <>
          <HUDBar title={huntTitle} showLogo onOpenMap={onOpenMap} isMapShow={true} />

          <div className="game-hunt-hdr">
            <div className="flex items-center gap-2 relative z-[1]">
              <div className="game-hunt-av">{av.em}</div>
              <div>
                <div className="font-orbitron text-[11px] font-bold tracking-[0.06em]">
                  {av.title}
                </div>
                <div className="font-share-mono text-[9px] text-[var(--mut)]">
                  {player.school}
                </div>
              </div>
            </div>
            {/* <div className="relative z-[1]">
              <StatusTag variant="orange">
                {score} / {MAX_SCORE} PTS
              </StatusTag>
            </div> */}
          </div>

          <PointsSplitRow
            base={baseScore}
            bonus={bonusScore}
            rank={`#${rank}`}
            stops={`${stopsCount}/${TOTAL_STOPS}`}
          />

          {/* <div className="px-4 py-2 relative z-[1]">
            <button
              type="button"
              onClick={onOpenMap}
              className="w-full flex items-center justify-center gap-2 py-2 font-share-mono text-[11px] text-[var(--c)] tracking-widest border border-[rgba(0,229,255,0.3)] bg-[rgba(0,229,255,0.05)] hover:bg-[rgba(0,229,255,0.1)] transition-colors"
              style={{
                clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))"
              }}
            >
              <span>🗺️</span> VIEW SHOW FLOOR MAP
            </button>
          </div> */}



          <ProgressPips
            total={TOTAL_STOPS}
            completed={stopsCount}
            active={activeIdx < TOTAL_STOPS ? activeIdx : undefined}
          />
        </>
      ) : (
        <HUDBar
          title={SUB_TAB_TITLES[activeTab]}
          onBack={() => onTabChange("stops")}
          backLabel="◄ STOPS"
          onOpenMap={onOpenMap}
          isMapShow={true}
        />
      )

        // : isBonusTab ?

        // (<>
        //   <HUDBar
        //     title={SUB_TAB_TITLES[activeTab]}
        //     onBack={() => onTabChange("stops")}
        //     backLabel="◄ STOPS"
        //     onOpenMap={onOpenMap}
        //     isMapShow={true}
        //   />


        //   <div className="px-4 py-2 space-y-3 relative z-[1]">

        //     {/* 1. Core Progress (Base Prize) */}
        //     <div className="flex justify-between items-center border border-[rgba(0,229,255,0.3)] bg-[rgba(0,0,0,0.65)] p-3"
        //       style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}>
        //       <div>
        //         <div className="font-share-mono text-[9px] text-[var(--c)] tracking-[0.1em] mb-1">BASE PRIZE: CORE STOPS</div>
        //         <div className="font-orbitron text-sm font-bold text-white">{stopsCount} / {TOTAL_STOPS} COMPLETE</div>
        //       </div>
        //       <div className="text-right">
        //         <div className="font-orbitron text-lg font-black text-[var(--c)]">{baseScore}</div>
        //         <div className="font-share-mono text-[8px] text-[var(--mut)]">PTS</div>
        //       </div>
        //     </div>

        //     {/* 2. Bonus Progress (Extra Prize - 100 Pt Goal) */}
        //     <div className="border border-[rgba(255,187,0,0.3)] bg-[rgba(0,0,0,0.65)] p-3"
        //       style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}>
        //       <div className="flex justify-between items-end mb-2">
        //         <div className="font-share-mono text-[9px] text-[#ffbb00] tracking-[0.1em]">EXTRA PRIZE: BONUS TRACK</div>
        //         <div className="font-orbitron text-[12px] font-bold text-[#ffbb00]">{bonusScore} / 100 PTS</div>
        //       </div>
        //       {/* Dedicated 100-Point Fill Bar */}
        //       <div className="h-2 w-full bg-[rgba(255,255,255,0.1)] overflow-hidden rounded-sm">
        //         <div className="h-full bg-[#ffbb00] transition-all duration-500 ease-out" style={{ width: `${bonusPercent}%` }} />
        //       </div>
        //     </div>
        //   </div>
        // </>)

        // 


      }

      {activeTab === "stops" && (
        <div className="game-scroll flex-1 min-h-0 pb-20">
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
        <ShortsScreen
          shortsDone={shortsDone}
          bonusScore={bonusScore}
          onComplete={onShortComplete}
          onCelebrate={onCelebrate}
          bonusPercent={bonusPercent}
          onToast={onToast}
        />
      )}

      {activeTab === "board" && (
        <LeaderboardScreen
          player={player}
          score={score}
          stopsDone={stopsDone}
          shortsDone={shortsDone}
        />
      )}

      {activeTab === "comp" && (
        <JobTravelerScreen
          player={player}
          score={score}
          stopsDone={stopsDone}
          shortsDone={shortsDone}
          roster={roster}
          onToast={onToast}
          onViewLeaderboard={() => onTabChange("board")}
          onBackToHunt={() => onTabChange("stops")}
        />
      )}

      <BottomNav active={activeTab} onChange={onTabChange} />
    </div>
  );
}
