"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  HUDBar,
  Panel,
  GameButton,
  StatusTag,
} from "./GameComponents";
import {
  STOPS,
  AVS,
  STOP_IMAGE_MAP,
  STOP_BRIGHTNESS,
  TOTAL_STOPS,
} from "@/constants";
import type { PlayerProfile, StopCompletion, CelebrationState } from "@/lib/game-types";

export function StopScreen({
  stopIndex,
  player,
  stopsDone,
  onBack,
  onSubmit,
  onNavigate,
  onToast,
  onCelebrate,
}: {
  stopIndex: number;
  player: PlayerProfile;
  stopsDone: Record<number, StopCompletion>;
  onBack: () => void;
  onSubmit: (index: number, data: StopCompletion) => void;
  onNavigate: (index: number) => void;
  onToast: (msg: string) => void;
  onCelebrate: (state: CelebrationState) => void;
}) {
  const s = STOPS[stopIndex];
  const done = !!stopsDone[stopIndex];
  const av = AVS[player.avatarIndex] ?? AVS[0];


  const [photoUp, setPhotoUp] = useState(done);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selQ, setSelQ] = useState<number | null>(
    stopsDone[stopIndex]?.qs ?? null
  );
  const [bonusAnswer, setBonusAnswer] = useState("");
  const [repName, setRepName] = useState(stopsDone[stopIndex]?.rn ?? "");
  const [repAnswer, setRepAnswer] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPhotoUp(!!stopsDone[stopIndex]);

    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });


    setSelQ(stopsDone[stopIndex]?.qs ?? null);
    setRepName(stopsDone[stopIndex]?.rn ?? "");
    setBonusAnswer("");
    setRepAnswer("");
  }, [stopIndex, stopsDone]);

  useEffect(() => {
    return () => {
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    };
  }, []);

  const photoUrl = STOP_IMAGE_MAP[stopIndex + 1] ?? STOP_IMAGE_MAP[1];
  const brightness = STOP_BRIGHTNESS[stopIndex] ?? 0.45;


  const openPicker = () => {
    if (done || photoUp) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Revoke any previous object URL before creating a new one
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });

    setPhotoUp(true);
    onToast("📸 EVIDENCE LOGGED");

    // Reset so the same file can be re-selected if needed
    e.target.value = "";
  };

  const handleRetake = () => {
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setPhotoUp(false);
  };

  // const mockUpload = () => {
  //   if (done) return;
  //   setPhotoUp(true);
  //   onToast("📸 EVIDENCE LOGGED");
  // };

  const submitStop = () => {
    if (!photoUp && !done) {
      onToast("📷 UPLOAD PHOTO FIRST");
      return;
    }
    if (done) {
      const next = stopIndex + 1;
      if (next < TOTAL_STOPS) onNavigate(next);
      else onBack();
      return;
    }

    let bonus = false;
    let badge: string | null = s.b1;
    let rn = "";

    if (s.bt === "calc") {
      bonus = !!bonusAnswer.trim();
    } else {
      rn = repName.trim();
      bonus = !!rn;
    }

    const gained = 10 + (bonus ? 5 : 0);
    onSubmit(stopIndex, {
      bonus,
      badge: bonus ? badge : null,
      rn: rn || undefined,
      qs: selQ ?? undefined,
    });
    onCelebrate({
      icon: bonus ? "🎉" : "✅",
      title: bonus ? `STOP ${stopIndex + 1} COMPLETE!` : "FIND-IT LOGGED!",
      sub: bonus
        ? `+${gained} PTS · YOUR SHOP IS BUILDING MOMENTUM`
        : "+10 PTS · BONUS STILL AVAILABLE",
      badge: bonus ? (badge ?? "BONUS") : "FIND-IT COMPLETE",
    });
  };

  const prevStop = () => {
    if (stopIndex > 0) onNavigate(stopIndex - 1);
  };

  const nextStop = () => {
    const n = stopIndex + 1;
    if (n >= TOTAL_STOPS) return;
    const unlocked = !!stopsDone[n] || n === 0 || !!stopsDone[n - 1];
    if (!unlocked) {
      onToast(`🔒 COMPLETE STOP ${n} FIRST`);
      return;
    }
    onNavigate(n);
  };

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextStop();
      if (e.key === "ArrowLeft") prevStop();
      if (e.key === "Escape") onBack();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [stopIndex, stopsDone]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  const canNext =
    stopIndex + 1 < TOTAL_STOPS &&
    (!!stopsDone[stopIndex + 1] ||
      !!stopsDone[stopIndex] ||
      stopIndex + 1 === 0);

  return (
    <div className="absolute inset-0 flex flex-col h-full w-full overflow-hidden z-30">

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        // capture="environment"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={handleFileChange}
      />
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('${photoUrl}')`,
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
          filter: `brightness(${brightness * 0.6}) saturate(0.65) blur(2px)`,
        }}
      />
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(4,5,6,0.45) 0%, rgba(4,5,6,0.72) 45%, rgba(4,5,6,0.88) 100%)",
        }}
      />

      <HUDBar
        title={`STOP ${stopIndex + 1} · ${s.co}`}
        onBack={onBack}
        backLabel="◄ STOPS"
      />

      <div className="game-scroll flex-1 min-h-0 bg-transparent">
        <div className="relative h-[168px] flex-shrink-0 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-[center_30%]"
            style={{
              backgroundImage: `url('${photoUrl}')`,
              filter: `brightness(${brightness}) saturate(0.8)`,
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(rgba(241, 92, 48, 0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(241, 92, 48, 0.05) 1px, transparent 1px)
              `,
              backgroundSize: "28px 28px",
            }}
          />
          <div
            className="absolute left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(241,92,48,0.8), transparent)",
              animation: "sweep 3s linear infinite",
            }}
          />
          <div
            className="absolute inset-2 border border-[rgba(241,92,48,0.2)] pointer-events-none"
            style={{
              clipPath:
                "polygon(0 14px, 14px 0, calc(100% - 14px) 0, 100% 14px, 100% calc(100% - 14px), calc(100% - 14px) 100%, 14px 100%, 0 calc(100% - 14px))",
            }}
          />
          <div
            className="absolute top-1/2 left-1/2 w-9 h-9 pointer-events-none border border-[rgba(241,92,48,0.25)] opacity-50"
            style={{
              transform: "translate(-50%, -60%)",
              clipPath:
                "polygon(0 50%, 35% 50%, 50% 0, 65% 50%, 100% 50%, 65% 50%, 50% 100%, 35% 50%)",
              animation: "rSpin 8s linear infinite",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(4,5,6,0.88)] via-[rgba(4,5,6,0.5)] to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 px-4 py-3 z-[2]">
            <div
              className="game-bc mb-1"
              style={{ color: "rgba(232,234,240,0.28)" }}
            >
              STOPS <span>›</span> STOP {stopIndex + 1}
            </div>
            <StatusTag variant="orange">
              STOP {stopIndex + 1} OF {TOTAL_STOPS}
            </StatusTag>
            <div className="flex items-end justify-between gap-2 mt-2">
              <div>
                <h1
                  className="font-orbitron text-[22px] font-black leading-none tracking-[0.04em]"
                  style={{ textShadow: "0 0 16px rgba(241,92,48,0.5)" }}
                >
                  {s.co.toUpperCase()}
                </h1>
                <p className="font-share-mono text-[10px] text-[var(--c)] tracking-[0.1em] uppercase mt-1">
                  {s.task}
                </p>
              </div>
              <div
                className="flex-shrink-0 border border-[var(--bdr)] bg-[rgba(4,5,6,0.9)] px-[11px] py-[7px]"
                style={{
                  clipPath:
                    "polygon(0 0, calc(100% - 7px) 0, 100% 7px, 100% 100%, 7px 100%, 0 calc(100% - 7px))",
                }}
              >
                <div className="font-share-mono text-[8px] text-[var(--mut)] tracking-[0.14em] uppercase">
                  CONTRACT
                </div>
                <div className="font-orbitron text-[10px] font-bold text-[var(--o)]">
                  APEX MOTORS
                </div>
                <div className="font-share-mono text-[9px] text-[var(--mut)]">
                  500 PCS · 6 WKS
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-[14px] py-3 flex flex-col gap-2.5">
          <Panel
            header={
              <span style={{ color: "var(--o)" }}>
                📖 <span>MISSION BRIEF</span>
              </span>
            }
            headerColor="orange"
            stopVariant
            className="story-bg"
          >
            <p className="text-sm leading-[1.75] text-[rgba(232,234,240,0.85)]">
              {s.story}
            </p>
            <div className="flex items-center gap-2.5 mt-3 pt-3 border-t border-[rgba(255,255,255,0.05)]">
              <div
                className="w-9 h-9 flex items-center justify-center text-xl bg-[rgba(241,92,48,0.1)] border border-[var(--bdr)]"
                style={{
                  clipPath:
                    "polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px))",
                }}
              >
                {av.em}
              </div>
              <div>
                <div className="font-orbitron text-[11px] font-bold tracking-[0.06em]">
                  {player.name.toUpperCase()}
                </div>
                <div className="font-share-mono text-[10px] text-[var(--mut)]">
                  {player.school} · {player.role}
                </div>
              </div>
            </div>
          </Panel>

          <Panel
            header={
              <>
                <span style={{ color: "var(--c)" }}>
                  ① <span>FIND-IT TASK</span>
                </span>
                <StatusTag variant="cyan">10 PTS · REQUIRED</StatusTag>
              </>
            }
            headerColor="cyan"
            stopVariant
          >
            <p className="font-share-mono text-[11px] text-[var(--mut)] mb-2.5 tracking-[0.04em]">
              {s.fi}
            </p>
            {/* <button
              type="button"
              onClick={mockUpload}
              disabled={done}
              className={`game-photo-box w-full${photoUp || done ? " up" : ""}`}
            >
              <span
                className={`text-[30px] ${photoUp || done ? "ok" : ""}`}
                style={{
                  filter: photoUp || done
                    ? "drop-shadow(0 0 8px rgba(57,255,20,0.6))"
                    : "drop-shadow(0 0 8px rgba(241,92,48,0.5))",
                }}
              >
                {photoUp || done ? "✅" : "📷"}
              </span>
              <span
                className={`font-share-mono text-[11px] tracking-[0.06em] text-center ${photoUp || done ? "text-[var(--g)]" : "text-[var(--mut)]"
                  }`}
              >
                {photoUp || done
                  ? "PHOTO UPLOADED — EVIDENCE LOGGED"
                  : "TAP TO OPEN CAMERA · GALLERY"}
              </span>
            </button> */}

            <button
              type="button"
              onClick={openPicker}
              disabled={done || photoUp}
              className={`game-photo-box w-full${photoUp || done ? " up" : ""}`}
            >
              {/* Show preview thumbnail after selection */}
              {previewUrl ? (
                <div className="flex flex-col items-center gap-2 w-full">
                  <img
                    src={previewUrl}
                    alt="Your uploaded evidence"
                    className="w-full max-h-[120px] object-cover"
                    style={{
                      clipPath:
                        "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                    }}
                  />
                  <span className="font-share-mono text-[11px] tracking-[0.06em] text-[var(--g)]">
                    ✅ PHOTO UPLOADED — EVIDENCE LOGGED
                  </span>
                </div>
              ) : (
                <>
                  <span
                    className="text-[30px]"
                    style={{
                      filter:
                        photoUp || done
                          ? "drop-shadow(0 0 8px rgba(57,255,20,0.6))"
                          : "drop-shadow(0 0 8px rgba(241,92,48,0.5))",
                    }}
                  >
                    {photoUp || done ? "✅" : "📷"}
                  </span>
                  <span
                    className={`font-share-mono text-[11px] tracking-[0.06em] text-center ${photoUp || done ? "text-[var(--g)]" : "text-[var(--mut)]"
                      }`}
                  >
                    {photoUp || done
                      ? "PHOTO UPLOADED — EVIDENCE LOGGED"
                      : "TAP TO OPEN CAMERA · GALLERY"}
                  </span>
                  {!photoUp && !done && (
                    <span className="font-share-mono text-[9px] text-[var(--dim)] tracking-[0.08em] mt-1">
                      CAMERA OR PHOTO LIBRARY
                    </span>
                  )}
                </>
              )}
            </button>

            {/* Retake — only shown after upload but before submit */}
            {photoUp && !done && (
              <button
                type="button"
                onClick={handleRetake}
                className="mt-2 w-full font-share-mono text-[10px] text-[var(--mut)] tracking-[0.08em] py-1.5 border border-[rgba(255,255,255,0.08)] bg-transparent hover:bg-[rgba(255,255,255,0.04)] transition-colors"
              >
                ↺ RETAKE PHOTO
              </button>
            )}
          </Panel>

          {s.bt === "calc" ? (
            <Panel
              header={
                <>
                  <span style={{ color: "#ffbb00" }}>
                    ② <span>SKILL CHALLENGE</span>
                  </span>
                  <span
                    className="game-tag"
                    style={{
                      color: "#ffbb00",
                      borderColor: "rgba(255,187,0,0.3)",
                      background: "rgba(255,187,0,0.07)",
                      clipPath:
                        "polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px))",
                    }}
                  >
                    +5 PTS · BONUS
                  </span>
                </>
              }
              headerColor="yellow"
              stopVariant
            >
              <p className="font-[family:var(--font-rajdhani)] text-[13px] leading-[1.6] text-[rgba(232,234,240,0.82)] mb-2">
                {s.bp}
              </p>
              <div className="gif-box flex items-center gap-1.5 px-3 py-2 mb-2 border border-[rgba(255,187,0,0.22)] bg-[rgba(255,187,0,0.05)] text-[#ffbb00] font-share-mono text-[11px]">
                📱 GIF: where to find this tool in Phillips Machinist app
              </div>
              <input
                className="game-input mb-2"
                placeholder="ENTER YOUR ANSWER…"
                value={
                  done && stopsDone[stopIndex]?.bonus
                    ? "SUBMITTED ✓"
                    : bonusAnswer
                }
                onChange={(e) => setBonusAnswer(e.target.value)}
                readOnly={done}
                disabled={done}
              />
              <p className="font-share-mono text-[10px] text-[var(--dim)] tracking-[0.08em] mb-1">
                BADGE TIERS:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {s.b1 && (
                  <span className="px-2.5 py-1 text-[10px] border border-[rgba(255,187,0,0.3)] bg-[rgba(255,187,0,0.1)] text-[#ffbb00]">
                    🥇 {s.b1} (±10%)
                  </span>
                )}
                {s.b2 && (
                  <span className="px-2.5 py-1 text-[10px] border border-[var(--bdc)] bg-[rgba(0,229,255,0.08)] text-[var(--c)]">
                    🥈 {s.b2} (±20%)
                  </span>
                )}
                {s.b3 && (
                  <span className="px-2.5 py-1 text-[10px] border border-[var(--dim)] bg-[rgba(255,255,255,0.04)] text-[var(--mut)]">
                    🥉 {s.b3}
                  </span>
                )}
              </div>
            </Panel>
          ) : (
            <Panel
              header={
                <>
                  <span style={{ color: "var(--g)" }}>
                    ③ <span>SHOP TALK</span>
                  </span>
                  <StatusTag variant="green">+5 PTS · BONUS</StatusTag>
                </>
              }
              headerColor="green"
              stopVariant
            >
              <p className="font-share-mono text-[10px] text-[var(--mut)] tracking-[0.06em] mb-2">
                ASK A REP AT {(s.rc || "").toUpperCase()} ONE OF THESE:
              </p>
              {[s.q1, s.q2].map((q, i) => (
                <button
                  key={i}
                  type="button"
                  disabled={done}
                  onClick={() => setSelQ(i)}
                  className={`game-q-opt${(done && stopsDone[stopIndex]?.qs === i) || selQ === i
                    ? " sel"
                    : ""
                    }`}
                >
                  {q}
                </button>
              ))}
              <input
                className="game-input mb-2 mt-1"
                placeholder="NAME OF REP YOU SPOKE WITH…"
                value={repName}
                onChange={(e) => setRepName(e.target.value)}
                readOnly={done}
                disabled={done}
              />
              <input
                className="game-input mb-2"
                placeholder="SHORT ANSWER FROM CONVERSATION…"
                value={repAnswer}
                onChange={(e) => setRepAnswer(e.target.value)}
                readOnly={done}
                disabled={done}
              />
              <p
                className={`font-share-mono text-[10px] tracking-[0.06em] ${done && stopsDone[stopIndex]?.bonus
                  ? "text-[var(--g)]"
                  : "text-[var(--dim)]"
                  }`}
              >
                {done && stopsDone[stopIndex]?.bonus
                  ? "✓ ADDED TO YOUR TEAM ROSTER"
                  : "THIS PERSON JOINS YOUR JOB TRAVELER ROSTER"}
              </p>
            </Panel>
          )}
        </div>

        <div className="px-[14px] py-3">
          <GameButton variant="primary" onClick={submitStop}>
            {done
              ? "✓ COMPLETED — VIEW NEXT STOP ►"
              : `► SUBMIT STOP ${stopIndex + 1}`}
          </GameButton>
        </div>

        <p className="font-share-mono text-[9px] text-[var(--dim)] text-center pb-3 tracking-[0.08em]">
          ← SWIPE OR USE ARROWS BELOW →
        </p>
      </div>

      <div className="game-stop-nav">
        <button
          type="button"
          className="game-snav"
          onClick={prevStop}
          disabled={stopIndex === 0}
        >
          ◄ PREV
        </button>
        <div className="game-snav-ctr">
          {stopIndex + 1}{" "}
          <span className="text-[var(--mut)] text-[11px] font-normal">
            / {TOTAL_STOPS}
          </span>
        </div>
        <button
          type="button"
          className="game-snav text-right"
          onClick={nextStop}
          disabled={!canNext}
        >
          NEXT ►
        </button>
      </div>
    </div>
  );
}
