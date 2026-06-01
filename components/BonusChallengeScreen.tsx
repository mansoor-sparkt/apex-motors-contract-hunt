"use client";

import { useCallback, useEffect, useMemo } from "react";
import { HUDBar, StatusTag } from "./GameComponents";
import { useGameClock } from "./GameClockProvider";
import { ShortCard } from "./ShortsScreen";
import {
  getShortDef,
  getTimelineIndexForShort,
  getTimelineNeighbors,
  type CelebrationDismissAction,
} from "@/lib/game-timeline";
import type {
  CelebrationState,
  PlayerProfile,
  ShortCompletion,
  StopCompletion,
} from "@/lib/game-types";
import { SHORTS } from "@/constants";

export function BonusChallengeScreen({
  slug,
  isActive,
  player,
  stopsDone,
  shortsDone,
  onBack,
  onAdvance,
  onSkip,
  onNavigateTimeline,
  onComplete,
  onCelebrate,
  onToast,
  onOpenMap,
  onGoToBonusListing,
  isDemo,
}: {
  slug: string;
  isActive: boolean;
  player: PlayerProfile;
  stopsDone: Record<number, StopCompletion>;
  shortsDone: Record<string, ShortCompletion>;
  onBack: () => void;
  onAdvance: (slug: string) => void;
  onSkip: (slug: string) => void;
  onNavigateTimeline: (action: CelebrationDismissAction) => void;
  onComplete: (slug: string, data: ShortCompletion) => void;
  onCelebrate: (state: CelebrationState) => void;
  onToast: (msg: string) => void;
  onOpenMap?: () => void;
  onGoToBonusListing?: () => void;
  isDemo: boolean;
}) {
  const short = getShortDef(slug);

  // // ── 1. Check if this challenge is outside the main timeline ──
  // const isOffTimeline = useMemo(() => {
  //   return getTimelineIndexForShort(slug) < 0;
  // }, [slug]);

  // // ── 2. Find its exact position in the Bonus array ──
  // const currentShortIndex = useMemo(() => {
  //   return SHORTS.findIndex((s) => s.slug === slug);
  // }, [slug]);


  // const fullyDone = useMemo(() => {
  //   if (!short) return false;
  //   const completion = shortsDone[slug];
  //   return short.type === "app" ? !!completion?.qAnswered : !!completion;
  // }, [short, shortsDone, slug]);

  // const { prev, next, stepLabel } = useMemo(
  //   () =>
  //     getTimelineNeighbors({ type: "short", slug }, stopsDone, shortsDone),
  //   [slug, stopsDone, shortsDone],



  // );


  // // ── 3. Wire up custom PREV/NEXT targets for off-timeline bonuses ──
  // const customPrev = useMemo((): CelebrationDismissAction | null => {
  //   if (!isOffTimeline) return prev;
  //   if (currentShortIndex > 0) return { type: "short", slug: SHORTS[currentShortIndex - 1].slug };
  //   return null;
  // }, [isOffTimeline, prev, currentShortIndex]);

  // const customNext = useMemo((): CelebrationDismissAction | null => {
  //   if (!isOffTimeline) return next;
  //   if (currentShortIndex < SHORTS.length - 1) return { type: "short", slug: SHORTS[currentShortIndex + 1].slug };
  //   return null;
  // }, [isOffTimeline, next, currentShortIndex]);

  // // const goPrev = useCallback(() => {
  // //   if (prev) onNavigateTimeline(prev);
  // // }, [prev, onNavigateTimeline]);

  // // const goNext = useCallback(() => {
  // //   if (fullyDone) {
  // //     onAdvance(slug);
  // //     return;
  // //   }
  // //   if (next) {
  // //     onNavigateTimeline(next);
  // //     return;
  // //   }
  // //   onToast("🔒 COMPLETE THIS CHALLENGE FIRST");
  // // }, [fullyDone, next, onAdvance, onNavigateTimeline, onToast, slug]);


  // const goPrev = useCallback(() => {
  //   if (customPrev) onNavigateTimeline(customPrev);
  // }, [customPrev, onNavigateTimeline]);

  // const goNext = useCallback(() => {
  //   if (fullyDone) {
  //     if (!isOffTimeline) {
  //       onAdvance(slug); // Standard timeline behavior
  //     } else {
  //       // Off-timeline behavior: Go to next bonus, or back to the list if it's the last one!
  //       if (customNext) onNavigateTimeline(customNext);
  //       else if (onGoToBonusListing) onGoToBonusListing();
  //       else onBack();
  //     }
  //     return;
  //   }

  //   if (customNext) {
  //     onNavigateTimeline(customNext);
  //     return;
  //   }

  //   onToast("🔒 COMPLETE THIS CHALLENGE FIRST");
  // }, [fullyDone, isOffTimeline, customNext, onAdvance, slug, onNavigateTimeline, onGoToBonusListing, onBack, onToast]);



  // const short = getShortDef(slug);

  // ── 1. Create a mini-list of ONLY the bonuses NOT in the timeline ──
  // This guarantees it only grabs those exactly 2 new ones!
  const offTimelineShorts = useMemo(() => {
    if (!short) return [];
    return SHORTS.filter(
      (s) => s.type === short.type && getTimelineIndexForShort(s.slug) < 0
    );
  }, [short]);

  // ── 2. Check if the current bonus is one of those off-timeline ones ──
  const isOffTimeline = useMemo(() => {
    return getTimelineIndexForShort(slug) < 0;
  }, [slug]);

  // ── 3. Find its exact position in that mini-list (e.g., 1 of 2) ──
  const offTimelineIndex = useMemo(() => {
    return offTimelineShorts.findIndex((s) => s.slug === slug);
  }, [slug, offTimelineShorts]);

  // ── 4. Standard timeline logic (for the regular game path) ──
  const { prev, next, stepLabel } = useMemo(
    () => getTimelineNeighbors({ type: "short", slug }, stopsDone, shortsDone),
    [slug, stopsDone, shortsDone]
  );

  // ── 5. Wire up the Smart PREV/NEXT buttons ──
  const customPrev = useMemo((): CelebrationDismissAction | null => {
    if (!isOffTimeline) return prev; // If it's a normal timeline bonus, do normal behavior

    // If it's an off-timeline bonus, cycle only to the previous off-timeline bonus
    if (offTimelineIndex > 0) return { type: "short", slug: offTimelineShorts[offTimelineIndex - 1].slug };
    return null;
  }, [isOffTimeline, prev, offTimelineIndex, offTimelineShorts]);

  const customNext = useMemo((): CelebrationDismissAction | null => {
    if (!isOffTimeline) return next; // If it's a normal timeline bonus, do normal behavior

    // If it's an off-timeline bonus, cycle only to the next off-timeline bonus
    if (offTimelineIndex < offTimelineShorts.length - 1) return { type: "short", slug: offTimelineShorts[offTimelineIndex + 1].slug };
    return null;
  }, [isOffTimeline, next, offTimelineIndex, offTimelineShorts]);

  const fullyDone = useMemo(() => {
    if (!short) return false;
    const completion = shortsDone[slug];
    return short.type === "app" ? !!completion?.qAnswered : !!completion;
  }, [short, shortsDone, slug]);




  const goPrev = useCallback(() => {
    if (customPrev) onNavigateTimeline(customPrev);
  }, [customPrev, onNavigateTimeline]);

  const goNext = useCallback(() => {
    if (fullyDone) {
      if (!isOffTimeline) {
        onAdvance(slug); // Standard timeline behavior
      } else {
        // Off-timeline behavior: Go to next bonus, or back to the list if it's the last one!
        if (customNext) onNavigateTimeline(customNext);
        else if (onGoToBonusListing) onGoToBonusListing();
        else onBack();
      }
      return;
    }

    if (customNext) {
      onNavigateTimeline(customNext);
      return;
    }

    onToast("🔒 COMPLETE THIS CHALLENGE FIRST");
  }, [fullyDone, isOffTimeline, customNext, onAdvance, slug, onNavigateTimeline, onGoToBonusListing, onBack, onToast]);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onBack();
      if (e.key === "ArrowLeft" && prev) goPrev();
      if (e.key === "ArrowRight") goNext();
    },
    [onBack, prev, goPrev, goNext],
  );

  useEffect(() => {
    if (!isActive) return;
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey, isActive]);

  const gameClock = useGameClock();

  // const isOffTimeline = useMemo(() => {
  //   return getTimelineIndexForShort(slug) < 0;
  // }, [slug]);

  if (!short) {
    return null;
  }

  return (
    <div className="absolute inset-0 flex h-full w-full flex-col overflow-hidden z-30">
      <HUDBar
        title={`BONUS · ${short.title}`}
        onBack={onBack}
        backLabel="◄ HUNT MAP"
        onOpenMap={onOpenMap}
        isMapShow={!!onOpenMap}
        clockSeconds={gameClock?.elapsedSeconds}
      />



      <div className="game-scroll flex-1 min-h-0 bg-transparent">

        {/* ── NEW: Massive Bonus Banner ── */}
        <div className="bg-[rgba(255,187,0,0.15)] border-b border-[rgba(255,187,0,0.4)] px-4 py-2.5 flex items-center justify-center gap-3 shadow-[0_0_15px_rgba(255,187,0,0.1)] shrink-0">
          <span className="text-[#ffbb00] text-lg animate-pulse">★</span>
          <span className="font-orbitron font-bold text-[14px] text-[#ffbb00] tracking-widest drop-shadow-md">BONUS CHALLENGE</span>
          <span className="text-[#ffbb00] text-lg animate-pulse">★</span>
        </div>

        <div className="bg-[rgba(57,255,20,0.06)] border-b border-[rgba(57,255,20,0.2)] px-4 py-2 flex items-center justify-between gap-2 shrink-0">
          <span className="font-share-mono text-[10px] text-[var(--g)] tracking-[0.06em] uppercase">
            🏆 PRIZE ELIGIBILITY STATUS:
          </span>
          <span className="font-[family:var(--font-rajdhani)] text-[12px] font-semibold text-white">
            Reach <span className="text-[#ffbb00]">100 Pts</span> to unlock the Extra Prize gift box!
          </span>
        </div>

        <div className="px-[14px] pt-3 pb-2">
          <StatusTag variant="cyan">BONUS CHALLENGE · +{short.pts} PTS</StatusTag>
          <h1 className="font-orbitron text-[20px] font-black leading-tight tracking-[0.04em] text-white mt-2">
            {short.title}
          </h1>
          {"task" in short && short.task && (
            <p className="font-share-mono text-[10px] text-[var(--c)] tracking-[0.1em] uppercase mt-1">
              {short.task}
            </p>
          )}
        </div>

        <div className="px-[14px] pb-3">
          <ShortCard
            short={short}
            completion={shortsDone[slug]}
            emailId={player.email}
            onComplete={onComplete}
            onCelebrate={onCelebrate}
            onToast={onToast}
            onSkip={fullyDone ? undefined : () => onSkip(slug)}
            onGoToBonusListing={onGoToBonusListing}
            isDemo={isDemo}
          />
        </div>
      </div>

      <div className="game-stop-nav">


        {/* <button
              type="button"
              className="game-snav"
              onClick={goPrev}
            disabled={!customPrev}
            >
              ◄ PREV
            </button>
            <div className="game-snav-ctr">
              <span className="text-[10px] tracking-[0.06em]"> {isOffTimeline ? `BONUS · ${currentShortIndex + 1} / ${SHORTS.length}` : stepLabel}</span>
            </div>
            <button type="button" className="game-snav text-right" onClick={goNext}>
              {fullyDone || next ? "NEXT ►" : "DONE ►"}
            </button> */}




        {/* <button
          type="button"
          className="game-snav"
          onClick={goPrev}
          disabled={!customPrev}
        >
          ◄ PREV
        </button>
        <div className="game-snav-ctr">
          <span className="text-[10px] tracking-[0.06em]">
            {isOffTimeline ? `BONUS · ${currentShortIndex + 1} / ${SHORTS.length}` : stepLabel}
          </span>
        </div>
        <button type="button" className="game-snav text-right" onClick={goNext}>
          {fullyDone || customNext ? "NEXT ►" : "DONE ►"}
        </button> */}

        {/* <div className="game-stop-nav"> */}
        <button
          type="button"
          className="game-snav"
          onClick={goPrev}
          disabled={!customPrev}
        >
          ◄ PREV
        </button>
        <div className="game-snav-ctr">
          <span className="text-[10px] tracking-[0.06em] uppercase">
            {isOffTimeline
              ? `BONUS · ${offTimelineIndex + 1} / ${offTimelineShorts.length}`
              : stepLabel}
          </span>
        </div>
        <button type="button" className="game-snav text-right" onClick={goNext}>
          {fullyDone || customNext ? "NEXT ►" : "DONE ►"}
        </button>
        {/* </div> */}

      </div>
    </div>
  );
}
