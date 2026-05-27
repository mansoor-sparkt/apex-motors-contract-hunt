"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { PhotoBg, ViewportChrome } from "./Background";
import { SplashScreen } from "./SplashScreen";
import { IntroScreen } from "./IntroScreen";
import { RegisterScreen } from "./RegisterScreen";
import { AvatarScreen } from "./AvatarScreen";
import { HuntScreen } from "./HuntScreen";
import { StopScreen } from "./StopScreen";
import { CelebrationModal } from "./CelebrationModal";
import { GameToast } from "./GameToast";
import {
  DEFAULT_PLAYER,
  TOTAL_STOPS,
  computeBaseScore,
  computeBonusScore,
  STOPS,
  computeScore,
  GAME_TIMELINE,
  SHORTS
} from "@/constants";
import type {
  AppScreen,
  CelebrationSource,
  CelebrationState,
  HuntTab,
  PlayerProfile,
  ProgressLoadStatus,
  RegisterDraft,
  RosterEntry,
  StopCompletion,
  ShortCompletion,
} from "@/lib/game-types";
import { AuthScreen } from "./AuthScreen";
import { OtpScreen } from "./OtpScreen";
import { GameService } from "@/lib/game.service";
import MapModal from "./modals/MapModal";



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
      aria-hidden={!active}
      inert={!active ? true : undefined}
      style={{
        opacity: active ? 1 : 0,
        pointerEvents: active ? "auto" : "none",
        visibility: active ? "visible" : "hidden",
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
  const [shortsDone, setShortsDone] = useState<Record<string, ShortCompletion>>({});
  const [roster, setRoster] = useState<RosterEntry[]>([]);
  const [huntTab, setHuntTab] = useState<HuntTab>("stops");
  const [curStop, setCurStop] = useState(0);
  const [progressStatus, setProgressStatus] =
    useState<ProgressLoadStatus>("idle");

  const [celebration, setCelebration] = useState<CelebrationState | null>(null);

  const [isMapOpen, setIsMapOpen] = useState(false);

  const [showBonusNudge, setShowBonusNudge] = useState<string | null>(null);
  const [showEndGameNudge, setShowEndGameNudge] = useState(false);
  const [showCongratulation, setShowCongratulation] = useState(false);


  /** Where to go after closing a stop-completion celebration modal. */
  const [celebrationDismiss, setCelebrationDismiss] = useState<
    { type: "nextStop"; index: number } | { type: "traveler" } | null
  >(null);
  const [toast, setToast] = useState<string | null>(null);

  // 1. Add this near your other state declarations at the top of GameApp
  const [isDemo, setIsDemo] = useState(false);

  /** True after cloud hydrate finds an existing GameProgress row for this email. */
  const cloudProgressExistsRef = useRef(false);

  // const score = computeScore(stopsDone, shortsDone);
  const coreScore = computeBaseScore(stopsDone);
  const bonusScore = computeBonusScore(shortsDone);
  const combinedScore = coreScore + bonusScore;



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

    // 1. Did they just finish the LAST core stop?
    if (action?.type === "traveler") {
      // Check if ALL bonuses are completed
      const allBonusesDone = Object.keys(shortsDone).length >= SHORTS.length;

      if (allBonusesDone) {
        setShowCongratulation(true); // Straight to congrats!
      } else {
        setShowEndGameNudge(true); // Show the warning nudge first
      }

      setScreen("hunt"); // ── IMPORTANT: Keep them on the map screen so modals can pop! Do NOT put setHuntTab("comp") here!
      return;
    }

    if (action?.type === "nextStop") {
      setCurStop(action.index);
      setScreen("stop");
      return;
    }

    // 2. Otherwise, check for a mid-game bonus...
    const timelineIndex = GAME_TIMELINE.findIndex((t) => t.type === "stop" && t.index === curStop);
    if (timelineIndex !== -1) {
      const nextItem = GAME_TIMELINE[timelineIndex + 1];
      if (nextItem && nextItem.type === "short" && !shortsDone[nextItem.slug as string]) {
        setShowBonusNudge(nextItem.slug as string);
      }
    }

    setScreen("hunt");
  }, [celebrationDismiss, curStop, shortsDone]);
  /**
   * Cloud Synchronizer: Resolves remote progress and populates client memory banks
   */
  /*const hydrateRemoteProgress = useCallback(
    async (emailId: string): Promise<boolean> => {
      setProgressStatus("loading");

      try {
        const res = await GameService.fetchProgress(emailId);

        if (res.success && res.gameProgress) {
          const decodedSnapshot = JSON.parse(res.gameProgress);

          if (decodedSnapshot.stops) {
            setStopsDone(decodedSnapshot.stops);
          }
          if (decodedSnapshot.shorts) {
            setShortsDone(decodedSnapshot.shorts);
          }

          cloudProgressExistsRef.current = true;
          setProgressStatus("loaded");
          console.log("⚡ Cloud metrics synchronized successfully.");
          return true;
        }

        cloudProgressExistsRef.current = false;
        setProgressStatus("loaded");
        console.log("ℹ️ No previous progress metrics found in cloud. Starting fresh.");
        return false;
      } catch (error) {
        console.error("Critical Exception encountered during engine hydration:", error);
        setProgressStatus("error");
        showToast("⚠️ CLOUD DATA CORRUPTED — STARTING FRESH");
        setStopsDone({});
        setShortsDone({});
        return false;
      }
    },
    [showToast],
  );*/
  /**
   * Cloud Synchronizer: Resolves remote progress and populates client memory banks
   */
  const hydrateRemoteProgress = useCallback(
    async (emailId: string): Promise<boolean> => {
      setProgressStatus("loading");

      try {
        const res = await GameService.fetchProgress(emailId);

        if (res.success && res.gameProgress) {
          const decodedSnapshot = JSON.parse(res.gameProgress);

          if (decodedSnapshot.stops) {
            setStopsDone(decodedSnapshot.stops);

            // ── FIX 3: Reconstruct roster arrays from saved cloud tracking files ──
            const restoredRoster: RosterEntry[] = [];
            Object.entries(decodedSnapshot.stops).forEach(([key, value]: [string, any]) => {
              if (value?.rn) {
                const s = STOPS[Number(key)];
                if (s) {
                  restoredRoster.push({ n: value.rn, c: s.rc || s.co });
                }
              }
            });
            setRoster(restoredRoster);
          }

          if (decodedSnapshot.shorts) {
            setShortsDone(decodedSnapshot.shorts);
          }

          cloudProgressExistsRef.current = true;
          setProgressStatus("loaded");
          console.log("⚡ Cloud metrics synchronized successfully.");
          return true;
        }

        cloudProgressExistsRef.current = false;
        setProgressStatus("loaded");
        console.log("ℹ️ No previous progress metrics found in cloud. Starting fresh.");
        return false;
      } catch (error) {
        console.error("Critical Exception encountered during engine hydration:", error);
        setProgressStatus("error");
        showToast("⚠️ CLOUD DATA CORRUPTED — STARTING FRESH");
        setStopsDone({});
        setShortsDone({});
        setRoster([]);
        return false;
      }
    },
    [showToast],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const restoreSession = async () => {
      try {
        const sessionRes = await GameService.getSession();
        if (!sessionRes.success || !sessionRes.email) {
          localStorage.removeItem("hunt_user_session");
          return;
        }

        const savedSession = localStorage.getItem("hunt_user_session");
        let parsedPlayer: PlayerProfile | null = null;

        if (savedSession) {
          parsedPlayer = JSON.parse(savedSession) as PlayerProfile;
          if (
            parsedPlayer.email?.toLowerCase() !==
            String(sessionRes.email).toLowerCase()
          ) {
            parsedPlayer = null;
          }
        }

        if (parsedPlayer) {
          setPlayer(parsedPlayer);
        } else {
          setPlayer({ ...DEFAULT_PLAYER, email: sessionRes.email });
        }

        await hydrateRemoteProgress(sessionRes.email);
        setScreen("hunt");
      } catch (error) {
        console.error("Session restore dropped:", error);
        localStorage.removeItem("hunt_user_session");
        setProgressStatus("idle");
      }
    };

    void restoreSession();
  }, [hydrateRemoteProgress]);

  const quickDemo = () => {
    setIsDemo(true); // ── NEW: Lock the app into offline mode
    setPlayer({
      name: "Alex Johnson",
      email: "demo@phillips.com",
      school: "Lincoln Tech",
      role: "Student",
      shopName: "Apex Precision Works",
      avatarIndex: 0,
      avatarName: "SPEED DEMON",
    });
    setRegisterDraft(null);
    setStopsDone({ 0: { bonus: true, badge: "Contract Secured" } });
    setShortsDone({});
    setRoster([]);
    setHuntTab("stops");
    setCelebrationDismiss(null);
    setProgressStatus("loaded");
    setScreen("hunt");
  };

  const handleStopSubmit = (index: number, data: StopCompletion) => {



    if (index < TOTAL_STOPS - 1) {


      setCelebrationDismiss(null)
    } else {
      setCelebrationDismiss({ type: "traveler" });
    }

    // setStopsDone((prev) => ({ ...prev, [index]: data }));
    setStopsDone((prev) => {
      const next = { ...prev, [index]: data };
      saveGameSnapshot(next, shortsDone); // <-- Trigger auto-save here
      return next;
    });

    if (data.rn) {
      const s = STOPS[index];
      setRoster((r) => {
        const exists = r.some(
          (e) => e.n === data.rn && e.c === (s.rc || s.co)
        );
        return exists ? r : [...r, { n: data.rn!, c: s.rc || s.co }];
      });
    }

    // if (Object.keys(stopsDone).length === TOTAL_STOPS) {
    //   setShowCongratulation(true);
    // }
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

    const cleanEmail = email.trim().toLowerCase();
    setAuthEmail(cleanEmail); // Save email so Register or OTP screen can use it

    try {
      // 1. Call your clean service layer using the email directly
      const data = await GameService.registerEmail(cleanEmail);
      // const data = {
      //   success: true
      // }

      // 2. Check standardized success response
      if (data.success) {


        // It's a returning user! Go to OTP Verification
        setScreen("otp");
        showToast("SECURITY CODE SENT TO EMAIL");


      } else {
        // 3. Handle errors safely (e.g., "External API is down")
        showToast(`⚠️ ${data.error.toUpperCase()}`);
      }
    } catch (error) {
      showToast("⚠️ FATAL CONNECTION ERROR");
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Step 2: Submit OTP & Check Profile Status
  const handleOtpSubmit = async (otp: string) => {
    setIsAuthenticating(true);

    try {
      const data = await GameService.verifyOtp(authEmail, otp);






      if (data.success) {
        // OTP was correct! Now, are they fully setup?
        if (data.isProfileComplete) {
          setIsDemo(false)
          // Returning player with a complete profile!
          const cleanEmail = data.user.emailId.trim().toLowerCase();
          const playerProfile = {
            name: data.user.firstName + data.user.lastName || "Operator",
            email: cleanEmail,
            school: data.user.schoolOrCompany || "My School",
            role: data.user.role || "Student",
            shopName: data.user.operatorName,
            avatarIndex: data.user.machinistCharacter ? parseInt(data.user.machinistCharacter) : 0,
          }

          // Note: Make sure data.user matches your PlayerProfile state structure. 
          // You might need to map it if the database keys are different.
          setPlayer(
            playerProfile
          );



          localStorage.setItem("hunt_user_session", JSON.stringify(playerProfile));
          await hydrateRemoteProgress(playerProfile.email);
          setScreen("hunt");
        } else {
          // New player, OR player who verified email but never picked an avatar
          setScreen("register");
        }
      } else {
        showToast(`⚠️ ${data.error?.toUpperCase() || "INVALID CODE"}`);
      }
    } catch (error) {
      showToast("⚠️ CONNECTION ERROR");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const registerHadnler = async (p: PlayerProfile) => {
    setIsAuthenticating(true); // Show loading state

    try {
      // 1. Build the exact payload the backend expects
      const nameParts = p.name.split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ") || "Player";
      const cleanEmail = p.email.trim().toLowerCase();
      const backendPayload = {
        emailId: cleanEmail,
        // operatorName: p.name,
        firstName: firstName,
        lastName: lastName,
        phoneNumber: "0000000000",
        profilePicture: "",
        schoolOrCompany: p.school,
        operatorName: p.shopName,
        role: p.role,
        machinistCharacter: p.avatarIndex.toString(),
        isProfileComplete: true,

      };



      // 2. Call the Next.js API
      const data = await GameService.registerUser(backendPayload);
      // const data = {
      //   success: true,
      //   error: 'something wrong'
      // }


      if (data.success) {
        setPlayer(p);
        setIsDemo(false)
        localStorage.setItem("hunt_user_session", JSON.stringify(p));
        cloudProgressExistsRef.current = false;
        setProgressStatus("loaded");

        enterHuntHub("stops");
        showToast("PROFILE CREATED!");
      } else {
        showToast(`⚠️ ${data.error.toUpperCase()}`);
      }
    } catch (err) {
      showToast("⚠️ FAILED TO SAVE PROFILE");
    } finally {
      setIsAuthenticating(false);
    }
  }


  const handleLogout = async () => {
    await GameService.logout();

    if (typeof window !== "undefined") {
      localStorage.removeItem("hunt_user_session");
      cloudProgressExistsRef.current = false;

      setPlayer({
        name: "",
        email: "",
        school: "",
        role: "",
        shopName: "",
        avatarIndex: 0,
        avatarName: "",
      });
      setStopsDone({});
      setShortsDone({});
      setProgressStatus("idle");

      setScreen("auth");
      showToast("👋 LOGGED OUT SUCCESSFULLY");
    }
  };




  const backHandler = () => {
    setScreen("hunt")
  }




  /**
   * Universal progress auto-saver with explicit error handling
   */
  /* const saveGameSnapshot = async (updatedStops: any, updatedShorts: any) => {
     if (!player.email) return;
 
     // Package both tracking layers into a unified snapshot object
     const snapshotData = {
       stops: updatedStops,
       shorts: updatedShorts,
     };
 
     const isUpdate =
       cloudProgressExistsRef.current ||
       Object.keys(stopsDone).length > 0 ||
       Object.keys(shortsDone).length > 0 ||
       Object.keys(updatedStops).length > 0 ||
       Object.keys(updatedShorts).length > 0;
 
     try {
       const res = await GameService.syncProgress(
         player.email,
         snapshotData,
         isUpdate
       );
 
       if (res.success) {
         cloudProgressExistsRef.current = true;
         console.log("💾 Game progress auto-saved:", res.message);
       } else {
         // Handles business rule rejections (e.g., bad format or missing record)
         console.warn("⚠️ Cloud sync rejected:", res.error);
         showToast(`⚠️ SYNC WARNING: ${res.error.toUpperCase()}`);
       }
     } catch (error) {
       // Handles total network drops (e.g., cell service lost inside convention hall)
       console.error("Failed to execute background auto-save:", error);
       showToast("⚠️ CLOUD SYNC FAILED — CHECK YOUR CONNECTION");
     }
   }*/

  /**
   * Universal progress auto-saver with explicit error handling
   */
  const saveGameSnapshot = async (updatedStops: any, updatedShorts: any) => {

    if (isDemo) {
      console.log("🛑 DEMO MODE: Skipped API Cloud Sync");
      return; // Completely bypass the API call
    }
    if (!player.email) return;

    // ── 1. CALCULATE CUMULATIVE GAME POINT ──
    // We calculate this using the freshly updated data, so it is always perfectly accurate 
    // and physically impossible to duplicate or count twice!
    const newCoreScore = computeBaseScore(updatedStops);
    const newBonusScore = computeBonusScore(updatedShorts);
    const gamePoint = newCoreScore + newBonusScore;

    // Package both tracking layers into a unified snapshot object
    const snapshotData = {
      stops: updatedStops,
      shorts: updatedShorts,
    };

    // ── FIX 1: Rely STRICTLY on cloud existence reference tracker ──
    const isUpdate = cloudProgressExistsRef.current;
    const cleanEmail = player.email.trim().toLowerCase();
    try {
      const res = await GameService.syncProgress(
        cleanEmail,
        snapshotData,
        isUpdate,
        gamePoint
      );

      if (res.success) {
        // ── FIX 2: Explicitly flag that row now exists after successful initial POST ──
        cloudProgressExistsRef.current = true;
        console.log("💾 Game progress auto-saved:", res.message);
      } else {
        // Handles business rule rejections
        console.warn("⚠️ Cloud sync rejected:", res.error);
        showToast(`⚠️ SYNC WARNING: ${res.error.toUpperCase()}`);
      }
    } catch (error) {
      // Handles total network drops
      console.error("Failed to execute background auto-save:", error);
      showToast("⚠️ CLOUD SYNC FAILED — CHECK YOUR CONNECTION");
    }
  };




  const isProgressLoading = progressStatus === "loading";
  const isProgressReady =
    progressStatus === "loaded" || progressStatus === "error";

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
              onStart={() => setScreen("intro")}
              onDemo={quickDemo}
            />
          </ScreenSlot>

          {/* A2: Mission brief */}
          <ScreenSlot active={screen === "intro"} direction="fwd">
            <IntroScreen
              onNext={() => setScreen("auth")}
              onBack={() => setScreen("splash")}
              onOpenMap={() => setIsMapOpen(true)}
            />
          </ScreenSlot>

          {/* B: Auth */}
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
              draft={registerDraft}
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
                onComplete={(p) => registerHadnler(p)}
                // onComplete={(p) => {
                //   handleingAvater(p)

                // }}
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
          <ScreenSlot active={screen === "hunt" && isProgressReady} direction="fwd">
            <HuntScreen
              player={player}

              baseScore={coreScore}       // PASS CORE SCORE
              bonusScore={bonusScore}     // PASS BONUS SCORE
              score={combinedScore}
              stopsDone={stopsDone}
              shortsDone={shortsDone}
              roster={roster}
              activeTab={huntTab}
              isDemo={isDemo}
              showBonusNudge={showBonusNudge}
              setShowBonusNudge={setShowBonusNudge}
              showEndGameNudge={showEndGameNudge}
              setShowEndGameNudge={setShowEndGameNudge}
              showCongratulation={showCongratulation}
              setShowCongratulation={setShowCongratulation}
              onTabChange={setHuntTab}
              onOpenStop={openStop}

              // onShortComplete={(slug, data) => {
              //   setShortsDone((prev) => ({ ...prev, [slug]: data }));
              // }}

              onShortComplete={(slug, data) => {
                setShortsDone((prev) => {
                  const next = { ...prev, [slug]: data };
                  saveGameSnapshot(stopsDone, next); // <-- Trigger auto-save here
                  return next;
                });
              }}
              onCelebrate={(state) => openCelebration(state, "shorts")}
              onToast={showToast}
              onOpenMap={() => setIsMapOpen(true)}
              logout={handleLogout}
            />
          </ScreenSlot>

          {/* F: Stop Detail */}
          <ScreenSlot active={screen === "stop" && isProgressReady} direction="fwd">
            <StopScreen
              isActive={screen === "stop"}
              stopIndex={curStop}
              player={player}
              stopsDone={stopsDone}
              onBack={backHandler}
              onSubmit={handleStopSubmit}
              onNavigate={openStop}
              onToast={showToast}
              onCelebrate={(state) => openCelebration(state, "stop")}
              onOpenMap={() => setIsMapOpen(true)}
              isDemo={isDemo}
            />
          </ScreenSlot>

          {/* G: Celebration Modal */}
          <CelebrationModal
            state={celebration}
            onClose={dismissCelebration}
            onContinue={dismissCelebration}
          />


          <MapModal
            isOpen={isMapOpen}
            onClose={() => setIsMapOpen(false)}
          />

          <GameToast message={toast} onDone={() => setToast(null)} />

          {isProgressLoading && (
            <div
              className="absolute inset-0 z-[60] flex flex-col items-center justify-center gap-3"
              style={{ background: "rgba(0,0,0,0.92)" }}
            >
              <div
                className="font-share-mono text-[10px] tracking-[0.2em] text-[var(--c)]"
                style={{ animation: "pulse 1.2s ease-in-out infinite" }}
              >
                SYNCING SAVED PROGRESS…
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
