"use client";

import { useCallback, useEffect, useMemo } from "react";
import { HUDBar, StatusTag } from "./GameComponents";
import { useGameClock } from "./GameClockProvider";
import { ShortCard } from "./ShortsScreen";
import {
  getShortDef,
  getTimelineNeighbors,
  type CelebrationDismissAction,
} from "@/lib/game-timeline";
import type {
  CelebrationState,
  PlayerProfile,
  ShortCompletion,
  StopCompletion,
} from "@/lib/game-types";

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

  const fullyDone = useMemo(() => {
    if (!short) return false;
    const completion = shortsDone[slug];
    return short.type === "app" ? !!completion?.qAnswered : !!completion;
  }, [short, shortsDone, slug]);

  const { prev, next, stepLabel } = useMemo(
    () =>
      getTimelineNeighbors({ type: "short", slug }, stopsDone, shortsDone),
    [slug, stopsDone, shortsDone],
  );

  const goPrev = useCallback(() => {
    if (prev) onNavigateTimeline(prev);
  }, [prev, onNavigateTimeline]);

  const goNext = useCallback(() => {
    if (fullyDone) {
      onAdvance(slug);
      return;
    }
    if (next) {
      onNavigateTimeline(next);
      return;
    }
    onToast("🔒 COMPLETE THIS CHALLENGE FIRST");
  }, [fullyDone, next, onAdvance, onNavigateTimeline, onToast, slug]);

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
        <button
          type="button"
          className="game-snav"
          onClick={goPrev}
          disabled={!prev}
        >
          ◄ PREV
        </button>
        <div className="game-snav-ctr">
          <span className="text-[10px] tracking-[0.06em]">{stepLabel}</span>
        </div>
        <button type="button" className="game-snav text-right" onClick={goNext}>
          {fullyDone || next ? "NEXT ►" : "DONE ►"}
        </button>
      </div>
    </div>
  );
}
