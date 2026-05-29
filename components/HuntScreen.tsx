"use client";

import {
  HUDBar,
  ProgressPips,
  HuntStopRow,
  PointsSplitRow,
  StatusTag,
  MachinistAvatar,
} from "./GameComponents";
import { ShortsScreen } from "./ShortsScreen";
import { LeaderboardScreen } from "./LeaderboardScreen";
import { JobTravelerScreen } from "./JobTravelerScreen";
import { BottomNav } from "./BottomNav";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import {
  STOPS,
  AVS,
  TOTAL_STOPS,
  MAX_SCORE,
  MAX_BONUS_SCORE,
  APP_BONUS_PHOTO_PTS,
  APP_BONUS_TOTAL_PTS,
  getActiveStopIndex,
  IMAGE_URLS,
  GAME_TIMELINE,
  SHORTS,
  DEFAULT_SHOP_NAME,
} from "@/constants";
import type {
  CelebrationState,
  HuntTab,
  PlayerProfile,
  RosterEntry,
  StopCompletion,
  ShortCompletion,
} from "@/lib/game-types";
import { BonusProgressBar } from "./ui/BonusProgressBar";
import { CongratulationModal, IncompleteBonusModal } from "./modals/TaskModal";
import { useGameClock } from "./GameClockProvider";

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
  isDemo,

  showEndGameNudge,
  setShowEndGameNudge,
  showCongratulation,
  setShowCongratulation,
  onTabChange,
  onOpenStop,
  onOpenShort,
  onShortComplete,
  onCelebrate,
  onToast,
  onOpenMap,
  logout
}: {
  player: PlayerProfile;

  baseScore: number;
  bonusScore: number;
  score: number;

  stopsDone: Record<number, StopCompletion>;
  shortsDone: Record<string, ShortCompletion>;
  roster: RosterEntry[];
  activeTab: HuntTab;
  isDemo: boolean;

  showEndGameNudge: boolean;
  setShowEndGameNudge: (val: boolean) => void;
  showCongratulation: boolean;
  setShowCongratulation: (val: boolean) => void;
  onTabChange: (tab: HuntTab) => void;
  onOpenStop: (index: number) => void;
  onOpenShort: (slug: string) => void;
  onShortComplete: (slug: string, data: ShortCompletion) => void;
  onCelebrate: (state: CelebrationState) => void;
  onToast: (msg: string) => void;
  onOpenMap: () => void;
  logout: () => void
}) {
  const av = AVS[player.avatarIndex] ?? AVS[0];
  const activeIdx = getActiveStopIndex(stopsDone);
  const stopsCount = Object.keys(stopsDone).length;
  const leaderboard = useLeaderboard(player, score, stopsDone, shortsDone);
  const { rank } = leaderboard;


  // const baseScore = computeBaseScore(stopsDone);

  // const baseScore = computeBaseScore(stopsDone, shortsDone);
  // const bonusScore = computeBonusScore(stopsDone);
  const shopDisplayName = (player.shopName?.trim() || DEFAULT_SHOP_NAME).toUpperCase();
  const isStopsTab = activeTab === "stops";
  // const isBonusTab = activeTab === 'shorts'

  // Calculate percentage for the new Bonus progress bar (capped at 100%)
  const bonusPercent = Math.min(
    100,
    (bonusScore / MAX_BONUS_SCORE) * 100,
  );
  const gameClock = useGameClock();
  const clockSeconds = gameClock?.elapsedSeconds;

  return (
    <div className="absolute inset-0 flex flex-col h-full w-full overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: `url('${IMAGE_URLS.splashHero.src}')`,
          backgroundSize: "cover",
          backgroundPosition: "center 40%",
          filter: "brightness(0.45) saturate(0.85)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(4,5,6,0.35) 0%, rgba(4,5,6,0.92) 88%, rgba(4,5,6,0.98) 100%)",
        }}
      />

      <div className="relative z-[2] flex min-h-0 flex-1 flex-col">
      {isStopsTab ? (
        <>
          <HUDBar
            showLogo
            onOpenMap={onOpenMap}
            isMapShow={true}
            clockSeconds={clockSeconds}
          />

          <div className="game-hunt-hdr">
            <div className="flex items-center gap-2 relative z-[1] min-w-0 flex-1">
              <div className="game-hunt-av shrink-0">
                <MachinistAvatar avatarIndex={player.avatarIndex} />
              </div>
              <div className="min-w-0">
                <div className="font-orbitron text-[11px] font-bold tracking-[0.06em] leading-tight">
                  {av.title}
                </div>
                <div
                  className="font-orbitron text-[10px] font-bold text-[var(--o)] tracking-[0.04em] leading-snug mt-0.5 truncate"
                  title={shopDisplayName}
                >
                  {shopDisplayName}
                </div>
                <div className="font-share-mono text-[9px] text-[var(--mut)] mt-0.5 truncate">
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

          <BonusProgressBar bonusScore={bonusScore} />

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
          clockSeconds={clockSeconds}
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
          {/* {STOPS.map((s, i) => {
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
          })} */}

          {(() => {
            let lastCoreStopIndex = -1; // Tracks unlocks for skippable bonus rows
            let coreStopCounter = 0;
            return GAME_TIMELINE.map((item, i) => {
              const isStop = item.type === "stop";
              let done = false;
              let active = false;
              let locked = true;
              let title = "";
              let subtitle = "";
              let ptsLabel = "";

              if (isStop) {
                coreStopCounter++;
                lastCoreStopIndex = item.index as number;
                const s = STOPS[item.index as number];
                title = s.co;
                subtitle = s.task;
                done = !!stopsDone[item.index as number];
                active = !done && item.index === activeIdx;
                locked = !done && !active;

                ptsLabel = done
                  ? (stopsDone[item.index as number]?.bonus ? "20 PTS" : "10 PTS")
                  : "20 PTS MAX";
              } else {
                const s = SHORTS.find((sh) => sh.slug === item.slug)!;
                // title = `BONUS: ${s.title}`;
                title = `${s.title}`;
                subtitle = s.desc;

                const shortRecord = shortsDone[item.slug as string];
                done = !!shortRecord;

                // done = !!shortsDone[item.slug as string];

                // Bonus challenges unlock if the preceding core stop is done.
                // This makes them inherently "skippable" without blocking the next core stop.
                const prevStopDone = lastCoreStopIndex === -1 || !!stopsDone[lastCoreStopIndex];
                locked = !prevStopDone;
                active = !done && !locked;

                if (done) {
                  if (s.type === "app") {
                    // App challenges: 10 pts screenshot / 25 pts complete
                    ptsLabel = shortRecord.qAnswered
                      ? `${APP_BONUS_TOTAL_PTS} PTS`
                      : `${APP_BONUS_PHOTO_PTS} PTS`;
                  } else {
                    // Standard photo or video
                    ptsLabel = `${s.pts} PTS`;

                  }
                } else {
                  // Not done yet, show max possible points
                  ptsLabel = `${s.pts} PTS MAX`;
                }
              }

              return (
                <HuntStopRow
                  key={i}
                  // index={i}
                  index={isStop ? coreStopCounter - 1 : 0}
                  company={title}
                  task={subtitle}
                  done={done}
                  active={active}
                  locked={locked}
                  // bonus={isStop ? stopsDone[item.index as number]?.bonus : done}
                  isBonusRow={!isStop}
                  ptsLabel={ptsLabel}
                  onClick={() => {
                    if (!locked) {
                      if (isStop) onOpenStop(item.index as number);
                      else onOpenShort(item.slug as string);
                    }
                  }}
                />
              );
            });
          })()}
        </div>
      )}

      {activeTab === "shorts" && (
        <ShortsScreen
          shortsDone={shortsDone}
          bonusScore={bonusScore}
          emailId={player.email}
          onComplete={onShortComplete}
          onCelebrate={onCelebrate}
          bonusPercent={bonusPercent}
          onToast={onToast}
          onOpenShort={onOpenShort}
          isDemo={isDemo}
        />
      )}

      {activeTab === "board" && (
        <LeaderboardScreen player={player} leaderboard={leaderboard} />
      )}

      {activeTab === "comp" && (
        <JobTravelerScreen
          player={player}
          score={score}
          stopsDone={stopsDone}
          shortsDone={shortsDone}
          roster={roster}
          rank={rank}
          onToast={onToast}
          onViewLeaderboard={() => onTabChange("board")}
          onBackToHunt={() => onTabChange("stops")}
          onLogout={logout}
        />
      )}

      {/* ── 2. END-GAME BONUS NUDGE (You missed some side-quests!) ── */}
      <IncompleteBonusModal
        isOpen={showEndGameNudge}
        onClose={() => {
          // If they click "SKIP FOR NOW"
          setShowEndGameNudge(false);
          setShowCongratulation(true); // ── Shows the Congrats Modal!
        }}
        onDoBonus={() => {
          setShowEndGameNudge(false);
          setShowCongratulation(true);
          onTabChange("stops");
        }}
      />

      {/* ── 3. FINAL CONGRATULATIONS MODAL ── */}
      <CongratulationModal
        isOpen={showCongratulation}
        onClose={() => {
          setShowCongratulation(false);

          // If they are on the Stops tab, move them to Claim Prize. 
          // (If they clicked 'Do Bonus Now', they will safely stay on the Shorts tab!)
          if (activeTab === "stops") {
            onTabChange("comp");
          }
        }}
      />

      <BottomNav active={activeTab} onChange={onTabChange} />
      </div>
    </div>
  );
}


