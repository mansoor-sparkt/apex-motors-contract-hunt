"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { TOTAL_STOPS, getActiveStopIndex } from "@/constants";
import {
  formatGameClock,
  getCompletedStopsTime,
  getElapsedSeconds,
  getPartialTime,
  getTimeSpentOnStop,
  setPartialTime,
} from "@/lib/game-clock";
import type { StopCompletion } from "@/lib/game-types";

type GameClockContextValue = {
  elapsedSeconds: number;
  activeStopIndex: number;
  formatGameClock: (secs: number) => string;
  getTimeSpentOnStop: (stopIndex: number) => number;
};

const GameClockContext = createContext<GameClockContextValue | null>(null);

export function GameClockProvider({
  stopsDone,
  running,
  children,
}: {
  stopsDone: Record<number, StopCompletion>;
  running: boolean;
  children: ReactNode;
}) {
  const activeStopIndex = useMemo(
    () => getActiveStopIndex(stopsDone),
    [stopsDone],
  );
  const activeStopDone =
    activeStopIndex < TOTAL_STOPS && !!stopsDone[activeStopIndex];

  const [tick, setTick] = useState(0);
  /** Avoid SSR/client mismatch from sessionStorage partial times. */
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !running || activeStopDone || activeStopIndex >= TOTAL_STOPS) {
      return;
    }

    const id = window.setInterval(() => {
      setPartialTime(activeStopIndex, getPartialTime(activeStopIndex) + 1);
      setTick((n) => n + 1);
    }, 1000);

    return () => window.clearInterval(id);
  }, [mounted, running, activeStopIndex, activeStopDone]);

  const elapsedSeconds = useMemo(() => {
    if (!mounted) {
      return getCompletedStopsTime(stopsDone);
    }
    return getElapsedSeconds(stopsDone);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- tick drives partial reread
  }, [stopsDone, tick, mounted]);

  const timeOnStop = useCallback(
    (stopIndex: number) => {
      if (!mounted) {
        return stopsDone[stopIndex]?.timeSpent ?? 0;
      }
      return getTimeSpentOnStop(stopsDone, stopIndex);
    },
    [stopsDone, tick, mounted],
  );

  const value = useMemo(
    () => ({
      elapsedSeconds,
      activeStopIndex,
      formatGameClock,
      getTimeSpentOnStop: timeOnStop,
    }),
    [elapsedSeconds, activeStopIndex, timeOnStop],
  );

  return (
    <GameClockContext.Provider value={value}>
      {children}
    </GameClockContext.Provider>
  );
}

export function useGameClock(): GameClockContextValue | null {
  return useContext(GameClockContext);
}
