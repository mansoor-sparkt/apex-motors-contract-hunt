"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  PhillipsHUDBar,
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
import type { PlayerProfile, StopCompletion } from "@/lib/game-types";
import type { CelebrationState } from "@/lib/game-types";

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
  const [selQ, setSelQ] = useState<number | null>(
    stopsDone[stopIndex]?.qs ?? null
  );
  const [bonusAnswer, setBonusAnswer] = useState("");
  const [repName, setRepName] = useState(stopsDone[stopIndex]?.rn ?? "");
  const [repAnswer, setRepAnswer] = useState("");

  useEffect(() => {
    setPhotoUp(!!stopsDone[stopIndex]);
    setSelQ(stopsDone[stopIndex]?.qs ?? null);
    setRepName(stopsDone[stopIndex]?.rn ?? "");
    setBonusAnswer("");
    setRepAnswer("");
  }, [stopIndex, stopsDone]);

  const photoUrl = STOP_IMAGE_MAP[stopIndex + 1] ?? STOP_IMAGE_MAP[1];
  const brightness = STOP_BRIGHTNESS[stopIndex] ?? 0.45;

  const mockUpload = () => {
    if (done) return;
    setPhotoUp(true);
    onToast("📸 EVIDENCE LOGGED");
  };

  const submitStop = () => {
    if (!photoUp && !done) {
      onToast("📷 UPLOAD PHOTO FIRST");
      return;
    }
    if (done) {
      const next = stopIndex + 1;
      if (next < TOTAL_STOPS) {
        onNavigate(next);
      } else {
        onBack();
      }
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
    const data: StopCompletion = {
      bonus,
      badge: bonus ? badge : null,
      rn: rn || undefined,
      qs: selQ ?? undefined,
    };

    onSubmit(stopIndex, data);
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
    const unlocked =
      !!stopsDone[n] || n === 0 || !!stopsDone[n - 1];
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
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('${photoUrl}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: `brightness(${brightness * 0.6}) saturate(0.65) blur(2px)`,
        }}
      />

      <PhillipsHUDBar
        title={`STOP ${stopIndex + 1} · ${s.co}`}
        onBack={onBack}
      />

      <div
        className="h-[120px] flex-shrink-0 relative z-10 mx-4 mt-2 border border-[rgba(241,92,48,0.25)] overflow-hidden"
        style={{
          backgroundImage: `url('${photoUrl}')`,
          backgroundSize: "cover",
          backgroundPosition: "center 40%",
          filter: `brightness(${brightness}) saturate(0.8)`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(4,5,6,0.9)] to-transparent" />
        <div className="absolute bottom-2 left-3 right-3">
          <div className="font-[family:var(--font-share-mono)] text-[9px] text-[#00e5ff] tracking-widest">
            STOP {stopIndex + 1} OF {TOTAL_STOPS}
          </div>
          <div className="font-[family:var(--font-orbitron)] text-lg font-black">
            {s.co.toUpperCase()}
          </div>
          <div className="font-[family:var(--font-share-mono)] text-[10px] text-[rgba(232,234,240,0.6)]">
            {s.task}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 px-4 py-3 space-y-3 scrollbar-hide relative z-10">
        <Panel header="📖 MISSION BRIEF" headerColor="orange">
          <div className="font-[family:var(--font-share-mono)] text-xs text-[rgba(232,234,240,0.75)] leading-relaxed mb-3">
            {s.story}
          </div>
          <div className="flex items-center gap-2">
            <div className="text-2xl">{av.em}</div>
            <div>
              <div className="font-[family:var(--font-orbitron)] text-[10px] font-bold">
                {player.name.toUpperCase()}
              </div>
              <div className="font-[family:var(--font-share-mono)] text-[9px] text-[rgba(232,234,240,0.5)]">
                {player.school} · {player.role}
              </div>
            </div>
          </div>
        </Panel>

        <Panel
          header={
            <>
              ① FIND-IT TASK
              <StatusTag variant="cyan">10 PTS · REQUIRED</StatusTag>
            </>
          }
          headerColor="cyan"
        >
          <div className="font-[family:var(--font-share-mono)] text-[11px] text-[rgba(232,234,240,0.6)] mb-3">
            {s.fi}
          </div>
          <button
            type="button"
            onClick={mockUpload}
            disabled={done}
            className={`w-full py-4 border text-center transition-all ${
              photoUp || done
                ? "border-[#39ff14] bg-[rgba(57,255,20,0.08)]"
                : "border-[rgba(255,255,255,0.15)] bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.06)]"
            }`}
          >
            <div className={`text-3xl mb-1 ${photoUp || done ? "text-[#39ff14]" : ""}`}>
              {photoUp || done ? "✅" : "📷"}
            </div>
            <div
              className={`font-[family:var(--font-share-mono)] text-[10px] tracking-wider ${
                photoUp || done ? "text-[#39ff14]" : "text-[rgba(232,234,240,0.5)]"
              }`}
            >
              {photoUp || done
                ? "PHOTO UPLOADED — EVIDENCE LOGGED"
                : "TAP TO OPEN CAMERA · GALLERY"}
            </div>
          </button>
        </Panel>

        {s.bt === "calc" ? (
          <Panel
            header={
              <>
                ② SKILL CHALLENGE
                <StatusTag variant="orange">+5 PTS · BONUS</StatusTag>
              </>
            }
            headerColor="yellow"
          >
            <div className="font-[family:var(--font-share-mono)] text-xs text-[rgba(232,234,240,0.8)] leading-relaxed mb-3">
              {s.bp}
            </div>
            <div className="px-3 py-2 mb-3 border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] font-[family:var(--font-share-mono)] text-[10px] text-[rgba(232,234,240,0.45)]">
              📱 GIF: where to find this tool in Phillips Machinist app
            </div>
            <input
              className="w-full px-3 py-2 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] font-[family:var(--font-share-mono)] text-xs text-white outline-none focus:border-[#ffbb00] mb-3 disabled:opacity-50"
              placeholder="ENTER YOUR ANSWER…"
              value={done && stopsDone[stopIndex]?.bonus ? "SUBMITTED ✓" : bonusAnswer}
              onChange={(e) => setBonusAnswer(e.target.value)}
              readOnly={done}
              disabled={done}
            />
            <div className="font-[family:var(--font-share-mono)] text-[9px] text-[rgba(232,234,240,0.35)] tracking-wider mb-2">
              BADGE TIERS:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {s.b1 && (
                <span className="px-2 py-1 text-[9px] border text-[#ffbb00] border-[rgba(255,187,0,0.3)] bg-[rgba(255,187,0,0.08)]">
                  🥇 {s.b1} (±10%)
                </span>
              )}
              {s.b2 && (
                <span className="px-2 py-1 text-[9px] border text-[#00e5ff] border-[rgba(0,229,255,0.25)] bg-[rgba(0,229,255,0.06)]">
                  🥈 {s.b2} (±20%)
                </span>
              )}
              {s.b3 && (
                <span className="px-2 py-1 text-[9px] border text-[rgba(232,234,240,0.45)] border-[rgba(255,255,255,0.1)]">
                  🥉 {s.b3}
                </span>
              )}
            </div>
          </Panel>
        ) : (
          <Panel
            header={
              <>
                ③ SHOP TALK
                <StatusTag variant="green">+5 PTS · BONUS</StatusTag>
              </>
            }
            headerColor="green"
          >
            <div className="font-[family:var(--font-share-mono)] text-[10px] text-[rgba(232,234,240,0.5)] tracking-wider mb-2">
              ASK A REP AT {(s.rc || "").toUpperCase()} ONE OF THESE:
            </div>
            {[s.q1, s.q2].map((q, i) => (
              <button
                key={i}
                type="button"
                disabled={done}
                onClick={() => setSelQ(i)}
                className={`w-full mb-2 px-3 py-2 text-left font-[family:var(--font-share-mono)] text-[11px] border transition-all ${
                  (done && stopsDone[stopIndex]?.qs === i) || selQ === i
                    ? "border-[#39ff14] bg-[rgba(57,255,20,0.1)] text-[#39ff14]"
                    : "border-[rgba(255,255,255,0.1)] text-[rgba(232,234,240,0.6)]"
                }`}
              >
                {q}
              </button>
            ))}
            <input
              className="w-full px-3 py-2 mb-2 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] font-[family:var(--font-share-mono)] text-xs text-white outline-none focus:border-[#39ff14] disabled:opacity-50"
              placeholder="NAME OF REP YOU SPOKE WITH…"
              value={repName}
              onChange={(e) => setRepName(e.target.value)}
              readOnly={done}
              disabled={done}
            />
            <input
              className="w-full px-3 py-2 mb-2 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] font-[family:var(--font-share-mono)] text-xs text-white outline-none focus:border-[#39ff14] disabled:opacity-50"
              placeholder="SHORT ANSWER FROM CONVERSATION…"
              value={repAnswer}
              onChange={(e) => setRepAnswer(e.target.value)}
              readOnly={done}
              disabled={done}
            />
            <div
              className={`font-[family:var(--font-share-mono)] text-[10px] ${
                done && stopsDone[stopIndex]?.bonus
                  ? "text-[#39ff14]"
                  : "text-[rgba(232,234,240,0.35)]"
              }`}
            >
              {done && stopsDone[stopIndex]?.bonus
                ? "✓ ADDED TO YOUR TEAM ROSTER"
                : "THIS PERSON JOINS YOUR JOB TRAVELER ROSTER"}
            </div>
          </Panel>
        )}
      </div>

      <div className="flex-shrink-0 px-4 py-3 space-y-2 relative z-10 bg-[rgba(4,5,6,0.92)] border-t border-[rgba(241,92,48,0.2)]">
        <GameButton variant="primary" onClick={submitStop}>
          {done
            ? "✓ COMPLETED — VIEW NEXT STOP ►"
            : `► SUBMIT STOP ${stopIndex + 1}`}
        </GameButton>
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={prevStop}
            disabled={stopIndex === 0}
            className={`flex-1 py-2 font-[family:var(--font-share-mono)] text-[10px] border ${
              stopIndex === 0
                ? "opacity-30 border-[rgba(255,255,255,0.08)]"
                : "border-[rgba(241,92,48,0.3)] text-[#F15C30]"
            }`}
          >
            ◄ PREV
          </button>
          <span className="font-[family:var(--font-orbitron)] text-xs font-bold">
            {stopIndex + 1} / {TOTAL_STOPS}
          </span>
          <button
            type="button"
            onClick={nextStop}
            disabled={!canNext}
            className={`flex-1 py-2 font-[family:var(--font-share-mono)] text-[10px] border ${
              !canNext
                ? "opacity-30 border-[rgba(255,255,255,0.08)]"
                : "border-[rgba(241,92,48,0.3)] text-[#F15C30]"
            }`}
          >
            NEXT ►
          </button>
        </div>
      </div>
    </div>
  );
}
