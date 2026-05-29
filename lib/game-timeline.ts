import { GAME_TIMELINE, SHORTS, TOTAL_STOPS, getActiveStopIndex } from "@/constants";
import type { ShortCompletion, StopCompletion } from "@/lib/game-types";

export type CelebrationDismissAction =
  | { type: "nextStop"; index: number }
  | { type: "short"; slug: string }
  | { type: "traveler" };

export type TimelineLocation =
  | { type: "stop"; index: number }
  | { type: "short"; slug: string };

export function getTimelineIndexForStop(stopIndex: number): number {
  return GAME_TIMELINE.findIndex(
    (t) => t.type === "stop" && t.index === stopIndex,
  );
}

export function getTimelineIndexForShort(slug: string): number {
  return GAME_TIMELINE.findIndex(
    (t) => t.type === "short" && t.slug === slug,
  );
}

function timelineItemToAction(
  item: (typeof GAME_TIMELINE)[number],
): CelebrationDismissAction {
  if (item.type === "stop") {
    return { type: "nextStop", index: item.index };
  }
  return { type: "short", slug: item.slug };
}

/** Same unlock rules as the hunt map list. */
export function isTimelineItemLocked(
  timelineIndex: number,
  stopsDone: Record<number, StopCompletion>,
  shortsDone: Record<string, ShortCompletion>,
): boolean {
  const item = GAME_TIMELINE[timelineIndex];
  if (!item) return true;

  if (item.type === "stop") {
    const idx = item.index;
    const done = !!stopsDone[idx];
    const active = !done && idx === getActiveStopIndex(stopsDone);
    return !done && !active;
  }

  const shortRecord = shortsDone[item.slug];
  const done = !!shortRecord;

  let lastCoreStopIndex = -1;
  for (let i = timelineIndex - 1; i >= 0; i--) {
    const entry = GAME_TIMELINE[i];
    if (entry?.type === "stop") {
      lastCoreStopIndex = entry.index;
      break;
    }
  }

  const prevStopDone =
    lastCoreStopIndex === -1 || !!stopsDone[lastCoreStopIndex];
  const active = !done && prevStopDone;
  return !done && !active;
}

export function getTimelineNeighbors(
  location: TimelineLocation,
  stopsDone: Record<number, StopCompletion>,
  shortsDone: Record<string, ShortCompletion>,
) {
  const currentIndex =
    location.type === "stop"
      ? getTimelineIndexForStop(location.index)
      : getTimelineIndexForShort(location.slug);

  const findNeighbor = (direction: -1 | 1): CelebrationDismissAction | null => {
    if (currentIndex < 0) return null;

    for (
      let i = currentIndex + direction;
      direction < 0 ? i >= 0 : i < GAME_TIMELINE.length;
      i += direction
    ) {
      if (!isTimelineItemLocked(i, stopsDone, shortsDone)) {
        return timelineItemToAction(GAME_TIMELINE[i]!);
      }
    }
    return null;
  };

  const item = currentIndex >= 0 ? GAME_TIMELINE[currentIndex] : null;
  const stepKind = item?.type === "short" ? "BONUS" : "STOP";

  return {
    currentIndex: Math.max(0, currentIndex),
    total: GAME_TIMELINE.length,
    prev: findNeighbor(-1),
    next: findNeighbor(1),
    stepLabel: `${stepKind} · ${Math.max(1, currentIndex + 1)} / ${GAME_TIMELINE.length}`,
  };
}

function isShortFullyDone(
  slug: string,
  shortsDone: Record<string, ShortCompletion>,
): boolean {
  const record = shortsDone[slug];
  if (!record) return false;
  const def = SHORTS.find((s) => s.slug === slug);
  if (def?.type === "app") return !!record.qAnswered;
  return true;
}

/** Walk timeline forward — includes the next bonus if not finished yet. */
function nextForwardTimelineAction(
  timelineIndex: number,
  stopsDone: Record<number, StopCompletion>,
  shortsDone: Record<string, ShortCompletion>,
): CelebrationDismissAction | null {
  for (let i = timelineIndex + 1; i < GAME_TIMELINE.length; i++) {
    const item = GAME_TIMELINE[i];
    if (!item) continue;

    if (item.type === "short") {
      if (!isShortFullyDone(item.slug, shortsDone)) {
        return { type: "short", slug: item.slug };
      }
      continue;
    }

    if (!isTimelineItemLocked(i, stopsDone, shortsDone)) {
      return { type: "nextStop", index: item.index };
    }
    return null;
  }
  return null;
}

/** Next core stop only — used when the player explicitly skips a bonus. */
function nextCoreStopAfterTimelineIndex(
  timelineIndex: number,
): CelebrationDismissAction | null {
  for (let i = timelineIndex + 1; i < GAME_TIMELINE.length; i++) {
    const item = GAME_TIMELINE[i];
    if (item?.type === "stop") {
      return { type: "nextStop", index: item.index };
    }
  }
  return null;
}

/** What to open after the player dismisses a stop celebration (or NEXT on a completed stop). */
export function planProgressAfterStop(
  stopIndex: number,
  stopsDone: Record<number, StopCompletion>,
  shortsDone: Record<string, ShortCompletion>,
): CelebrationDismissAction | null {
  if (stopIndex >= TOTAL_STOPS - 1) {
    return { type: "traveler" };
  }

  const timelineIndex = getTimelineIndexForStop(stopIndex);
  if (timelineIndex < 0) {
    return { type: "nextStop", index: stopIndex + 1 };
  }

  return (
    nextForwardTimelineAction(timelineIndex, stopsDone, shortsDone) ?? {
      type: "nextStop",
      index: stopIndex + 1,
    }
  );
}

/** Skip an optional bonus and continue to the next core stop. */
export function planSkipBonus(slug: string): CelebrationDismissAction | null {
  const timelineIndex = getTimelineIndexForShort(slug);
  if (timelineIndex < 0) return null;
  return nextCoreStopAfterTimelineIndex(timelineIndex);
}

/** What to open after a bonus challenge is fully completed. */
export function planProgressAfterShort(
  slug: string,
): CelebrationDismissAction | null {
  const timelineIndex = getTimelineIndexForShort(slug);
  const next = timelineIndex >= 0 ? GAME_TIMELINE[timelineIndex + 1] : undefined;

  if (next?.type === "stop") {
    return { type: "nextStop", index: next.index };
  }

  if (next?.type === "short") {
    return { type: "short", slug: next.slug };
  }

  return null;
}

export function getShortDef(slug: string) {
  return SHORTS.find((s) => s.slug === slug);
}
