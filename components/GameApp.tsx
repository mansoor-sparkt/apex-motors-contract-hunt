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
import { AuthScreen } from "./AuthScreen";
import { OtpScreen } from "./OtpScreen";
import { GameService } from "@/lib/game.service";

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
      className="absolute inset-0 flex min-h-full w-full flex-col overflow-x-hidden overflow-y-auto"
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

  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authEmail, setAuthEmail] = useState("");

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

  // NEW: The Core Authentication Logic
  const handleAuthSubmit = async (email: string) => {
    setIsAuthenticating(true);
    setAuthEmail(email);
    // const payloade = {
    //   email: email,
    //   olduser: false,
    // }
    localStorage.setItem("user", email)
    const oldUser = localStorage.getItem("userType") === 'old' ? true : localStorage.setItem("userType", "new")




    try {
      // TODO: Replace this with your actual Next.js API call later
      // const res = await fetch('/api/auth', { method: 'POST', body: JSON.stringify({ email }) });
      // const data = await res.json();

      // Simulating a network request for 1 second
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // MOCK LOGIC: If they type "alex@school.edu", pretend they are a returning user.


      const oldUserEmail = localStorage.getItem("user")
      const isReturningUser = oldUser

      if (isReturningUser) {

        // Hydrate state from "Database" and go straight to game
        setPlayer({
          name: "Alex Johnson",
          email: oldUserEmail || '',
          school: "Lincoln Tech",
          role: "Student",
          avatarIndex: 0,
        });

        setScreen("otp");
        showToast("WELCOME BACK, OPERATOR");
      } else {

        setScreen("register");
      }
    } catch (error) {
      showToast("⚠️ CONNECTION ERROR");
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Step 2: Submit OTP
  const handleOtpSubmit = async (code: string) => {
    setIsAuthenticating(true);

    try {
      const data = await GameService.verifyOtp(authEmail, code);

      if (data.success) {
        // Hydrate state from DB and go to game
        setPlayer(data?.user as PlayerProfile);
        setScreen("hunt");
        showToast("WELCOME BACK, OPERATOR");
      } else {
        showToast("⚠️ INVALID CODE");
      }
    } catch (error) {
      showToast("⚠️ CONNECTION ERROR");
    } finally {
      setIsAuthenticating(false);
    }
  };


  const handleingAvater = (p: PlayerProfile) => {
    localStorage.setItem('userType', 'old')

    setPlayer(p);
    setRegisterDraft(null);
    enterHuntHub("stops");
  }
  return (





    <div className="mx-auto w-full max-w-[390px] min-h-dvh overflow-x-hidden overflow-y-auto">
      <div
        className="relative flex w-full min-h-dvh flex-shrink-0 flex-col"
      >
        <PhotoBg />
        <ViewportChrome />

        <div
          className="absolute inset-0 z-10 flex w-full min-h-dvh flex-col overflow-x-hidden overflow-y-auto"
          style={{
            boxShadow:
              "0 0 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.06)",
          }}
        >

          {/* background overlays  */}
          <div
            className="absolute inset-0 z-[3] pointer-events-none opacity-60"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`,
              mixBlendMode: 'overlay',
            }}
          />

          <div
            className="absolute inset-0 z-[4] pointer-events-none"
            style={{


              background:
                `repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0, 0, 0, 0.06) 3px, rgba(0, 0, 0, 0.06) 4px)`

            }}
          />
          {/* A: Splash */}
          <ScreenSlot active={screen === "splash"} direction="fade">
            <SplashScreen
              onStart={() => setScreen("auth")}
              onDemo={quickDemo}
            />
          </ScreenSlot>

          {/* B: Auth (NEW) */}
          <ScreenSlot active={screen === "auth"} direction="fwd">
            <AuthScreen
              isLoading={isAuthenticating}
              onNext={handleAuthSubmit}
              onBack={() => setScreen("splash")}
            />
          </ScreenSlot>

          {/* B2: OTP Verification (For returning users) */}
          <ScreenSlot active={screen === "otp"} direction="fwd">
            <OtpScreen
              email={authEmail}
              isLoading={isAuthenticating}
              onVerify={handleOtpSubmit}
              onBack={() => setScreen("auth")}
            />
          </ScreenSlot>

          {/* C: Register */}
          <ScreenSlot active={screen === "register"} direction="fwd">
            <RegisterScreen
              initialEmail={authEmail}
              onNext={(draft) => {
                setRegisterDraft(draft);
                setScreen("avatar");
              }}
              onBack={() => setScreen("auth")}
            />
          </ScreenSlot>

          {/* D: Choose Avatar */}
          <ScreenSlot active={screen === "avatar"} direction="fwd">
            {registerDraft ? (
              <AvatarScreen
                draft={registerDraft}
                onComplete={(p) => {
                  handleingAvater(p)

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

          {/* E: Hunt Hub */}
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
              onCelebrate={(state) => openCelebration(state, "shorts")}
            />
          </ScreenSlot>

          {/* F: Stop Detail */}
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

          {/* G: Celebration Modal */}
          <CelebrationModal
            state={celebration}
            onClose={dismissCelebration}
            onContinue={dismissCelebration}
          />

          <GameToast message={toast} onDone={() => setToast(null)} />
        </div>
      </div>
    </div>
  );
}
