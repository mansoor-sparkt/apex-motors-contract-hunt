import { TOTAL_STOPS, getActiveStopIndex } from "@/constants";
import type { StopCompletion } from "@/lib/game-types";

const partialKey = (stopIndex: number) => `partial_time_${stopIndex}`;

export function formatGameClock(secs: number): string {
  const minutes = Math.floor(Math.max(0, secs) / 60);
  const seconds = Math.max(0, secs) % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

export function getCompletedStopsTime(
  stopsDone: Record<number, StopCompletion>,
): number {
  return Object.values(stopsDone).reduce(
    (acc, stop) => acc + (stop?.timeSpent ?? 0),
    0,
  );
}

export function getPartialTime(stopIndex: number): number {
  if (typeof window === "undefined") return 0;
  return parseInt(sessionStorage.getItem(partialKey(stopIndex)) || "0", 10);
}

export function setPartialTime(stopIndex: number, seconds: number): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(partialKey(stopIndex), String(Math.max(0, seconds)));
}

export function clearPartialTime(stopIndex: number): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(partialKey(stopIndex));
}

/** Total session clock: finished stops + live partial on the current active stop. */
export function getElapsedSeconds(
  stopsDone: Record<number, StopCompletion>,
): number {
  const completed = getCompletedStopsTime(stopsDone);
  const activeIndex = getActiveStopIndex(stopsDone);
  if (activeIndex >= TOTAL_STOPS || stopsDone[activeIndex]) {
    return completed;
  }
  return completed + getPartialTime(activeIndex);
}

export function getTimeSpentOnStop(
  stopsDone: Record<number, StopCompletion>,
  stopIndex: number,
): number {
  const saved = stopsDone[stopIndex]?.timeSpent;
  if (saved != null) return saved;
  return getPartialTime(stopIndex);
}
