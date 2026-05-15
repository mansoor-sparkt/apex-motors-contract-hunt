"use client";

import React, { useCallback, useState } from "react";
import { PhotoBg, ViewportChrome } from "./Background";
import { SplashScreen } from "./SplashScreen";
import { RegisterScreen } from "./RegisterScreen";
import { AvatarScreen } from "./AvatarScreen";
import { HuntScreen } from "./HuntScreen";
import { StopScreen } from "./StopScreen";
import { CelebrationModal } from "./CelebrationModal";
import { GameToast } from "./GameToast";
import {
  DEFAULT_PLAYER,
  TOTAL_STOPS,
  computeScore,
  STOPS,
} from "@/constants";
import type {
  AppScreen,
  CelebrationSource,
  CelebrationState,
  HuntTab,
  PlayerProfile,
  RegisterDraft,
  RosterEntry,
  StopCompletion,
} from "@/lib/game-types";

function ScreenSlot({
  active,
  direction,
  children,
}: {
  active: boolean;
  direction: "fwd" | "back" | "fade";
  children: React.ReactNode;
}) {
  const animMap = {
    fwd: "sFwd  0.26s cubic-bezier(0.4,0,0.2,1) forwards",
    back: "sBack 0.26s cubic-bezier(0.4,0,0.2,1) forwards",
    fade: "sFade 0.22s ease forwards",
  };

  return (
    <div
      className="absolute inset-0 flex flex-col h-full w-full overflow-hidden"
      style={{
        opacity: active ? 1 : 0,
        pointerEvents: active ? "auto" : "none",
        animation: active ? animMap[direction] : "none",
      }}
    >
      {children}
    </div>
  );
}

export function GameApp() {
  const [screen, setScreen] = useState<AppScreen>("splash");
  const [player, setPlayer] = useState<PlayerProfile>(DEFAULT_PLAYER);
  const [registerDraft, setRegisterDraft] = useState<RegisterDraft | null>(null);
  const [stopsDone, setStopsDone] = useState<Record<number, StopCompletion>>({});
  const [shortsDone, setShortsDone] = useState<Record<string, boolean>>({});
  const [roster, setRoster] = useState<RosterEntry[]>([]);
  const [huntTab, setHuntTab] = useState<HuntTab>("stops");
  const [curStop, setCurStop] = useState(0);
  const [celebration, setCelebration] = useState<CelebrationState | null>(null);
  /** Where to go after closing a stop-completion celebration modal. */
  const [celebrationDismiss, setCelebrationDismiss] = useState<
    { type: "nextStop"; index: number } | { type: "traveler" } | null
  >(null);
  const [toast, setToast] = useState<string | null>(null);

  const score = computeScore(stopsDone, shortsDone);

  const showToast = useCallback((msg: string) => setToast(msg), []);

  const openCelebration = useCallback(
    (_state: CelebrationState, _source: CelebrationSource) => {
      setCelebration(_state);
    },
    []
  );

  const dismissCelebration = useCallback(() => {
    setCelebration(null);
    const action = celebrationDismiss;
    setCelebrationDismiss(null);

    if (action?.type === "nextStop") {
      setCurStop(action.index);
      setScreen("stop");
      return;
    }
    if (action?.type === "traveler") {
      setScreen("hunt");
      setHuntTab("comp");
      return;
    }
    setScreen("hunt");
  }, [celebrationDismiss]);

  const quickDemo = () => {
    setPlayer({
      name: "Alex Johnson",
      email: "alex@school.edu",
      school: "Lincoln Tech",
      role: "Student",
      avatarIndex: 0,
    });
    setRegisterDraft(null);
    setStopsDone({
      0: { bonus: true, badge: "Material Whisperer" },
      1: { bonus: false, badge: null },
    });
    setShortsDone({ "action-hero": true });
    setRoster([]);
    setHuntTab("stops");
    setCelebrationDismiss(null);
    setScreen("hunt");
  };

  const handleStopSubmit = (index: number, data: StopCompletion) => {
    if (index < TOTAL_STOPS - 1) {
      setCelebrationDismiss({ type: "nextStop", index: index + 1 });
    } else {
      setCelebrationDismiss({ type: "traveler" });
    }

    setStopsDone((prev) => ({ ...prev, [index]: data }));
    if (data.rn) {
      const s = STOPS[index];
      setRoster((r) => {
        const exists = r.some(
          (e) => e.n === data.rn && e.c === (s.rc || s.co)
        );
        return exists ? r : [...r, { n: data.rn!, c: s.rc || s.co }];
      });
    }
  };

  const openStop = (index: number) => {
    setCurStop(index);
    setScreen("stop");
  };

  const enterHuntHub = (tab: HuntTab = "stops") => {
    setHuntTab(tab);
    setScreen("hunt");
  };

  return (
    <div className="relative w-[390px] h-[844px] flex-shrink-0 mx-auto">
      <PhotoBg />
      <ViewportChrome />

      <div
        className="absolute inset-0 z-10 w-full h-full overflow-hidden"
        style={{
          boxShadow:
            "0 0 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.06)",
        }}
      >
        {/* A: Splash */}
        <ScreenSlot active={screen === "splash"} direction="fade">
          <SplashScreen
            onStart={() => setScreen("register")}
            onDemo={quickDemo}
          />
        </ScreenSlot>

        {/* B: Register */}
        <ScreenSlot active={screen === "register"} direction="fwd">
          <RegisterScreen
            onNext={(draft) => {
              setRegisterDraft(draft);
              setScreen("avatar");
            }}
            onBack={() => setScreen("splash")}
          />
        </ScreenSlot>

        {/* C: Choose Avatar */}
        <ScreenSlot active={screen === "avatar"} direction="fwd">
          {registerDraft ? (
            <AvatarScreen
              draft={registerDraft}
              onComplete={(p) => {
                setPlayer(p);
                setRegisterDraft(null);
                enterHuntHub("stops");
              }}
              onBack={() => setScreen("register")}
            />
          ) : (
            <RegisterScreen
              onNext={(draft) => {
                setRegisterDraft(draft);
                setScreen("avatar");
              }}
            />
          )}
        </ScreenSlot>

        {/* D: Hunt Hub (Stops | Shorts | Board | Traveler) */}
        <ScreenSlot active={screen === "hunt"} direction="fwd">
          <HuntScreen
            player={player}
            score={score}
            stopsDone={stopsDone}
            shortsDone={shortsDone}
            roster={roster}
            activeTab={huntTab}
            onTabChange={setHuntTab}
            onOpenStop={openStop}
            onShortComplete={(slug) => {
              setShortsDone((prev) => ({ ...prev, [slug]: true }));
            }}
            onCelebrate={(state) => {
              setCelebrationDismiss(null);
              openCelebration(state, "shorts");
            }}
            onToast={showToast}
          />
        </ScreenSlot>

        {/* E: Stop Detail */}
        <ScreenSlot active={screen === "stop"} direction="fwd">
          <StopScreen
            stopIndex={curStop}
            player={player}
            stopsDone={stopsDone}
            onBack={() => setScreen("hunt")}
            onSubmit={handleStopSubmit}
            onNavigate={openStop}
            onToast={showToast}
            onCelebrate={(state) => openCelebration(state, "stop")}
          />
        </ScreenSlot>

        {/* I: Celebration → D (or H when 8 stops done) */}
        <CelebrationModal
          state={celebration}
          onClose={dismissCelebration}
          onContinue={dismissCelebration}
        />

        <GameToast message={toast} onDone={() => setToast(null)} />
      </div>
    </div>
  );
}
