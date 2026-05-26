"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GameButton } from "./GameComponents";
import {
  AVS,
  SHORTS,
  computeBaseScore,
  computeBonusScore,
} from "@/constants";
import type { PlayerProfile, RosterEntry, StopCompletion } from "@/lib/game-types";
import { openMachinistApp } from "@/lib/machinist-app";
import {
  prepareMissionReportShareFile,
  shareMissionReportFile,
} from "@/lib/mission-report-share";

const BADGE_COLORS = [
  { bg: "rgba(241,92,48,0.15)", text: "#F15C30", border: "rgba(241,92,48,0.3)" },
  { bg: "rgba(0,229,255,0.10)", text: "#00e5ff", border: "rgba(0,229,255,0.3)" },
  { bg: "rgba(57,255,20,0.08)", text: "#39ff14", border: "rgba(57,255,20,0.3)" },
  { bg: "rgba(255,187,0,0.10)", text: "#ffbb00", border: "rgba(255,187,0,0.3)" },
  { bg: "rgba(177,77,255,0.10)", text: "#b14dff", border: "rgba(177,77,255,0.3)" },
];

export function JobTravelerScreen({
  player,
  score,
  stopsDone,
  shortsDone,
  roster,
  onToast,
  onViewLeaderboard,
  onBackToHunt,
  rank,
  onLogout
}: {
  player: PlayerProfile;
  score: number;
  stopsDone: Record<number, StopCompletion>;
  shortsDone: Record<string, unknown>;
  roster: RosterEntry[];
  rank: number;
  onToast?: (msg: string) => void;
  onViewLeaderboard?: () => void;
  onBackToHunt?: () => void;
  onLogout?: () => void;
}) {
  const av = AVS[player.avatarIndex] ?? AVS[0];
  const baseScore = computeBaseScore(stopsDone);
  const bonusScore = computeBonusScore(shortsDone);
  const metaLine = `${player.shopName || player.school} · ${player.role}`;

  const badges = [
    ...Object.values(stopsDone)
      .filter((v) => v?.badge)
      .map((v) => v.badge as string),
    ...Object.keys(shortsDone)
      .map((k) => SHORTS.find((s) => s.slug === k)?.badge || "")
      .filter(Boolean),
  ];

  // Extracts the time from the stopsDone state
  const totalSeconds = Object.values(stopsDone).reduce(
    (acc, curr: any) => acc + (curr.timeSpent || 0),
    0
  );

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainSecs = secs % 60;
    return `${mins}:${remainSecs < 10 ? "0" : ""}${remainSecs}`;
  };

  const timeDisplay = totalSeconds > 0 ? `${formatTime(totalSeconds)} MIN` : "0:00 MIN";

  const reportRef = useRef<HTMLDivElement>(null);
  const shareFileRef = useRef<File | null>(null);
  const [sharing, setSharing] = useState(false);
  const [shareReady, setShareReady] = useState(false);

  const shareData = {
    playerName: av.title,
    metaLine,
    baseScore,
    bonusScore,
    rank,
    timeDisplay,
    badges,
  };

  // Pre-render share image so the tap opens the native sheet immediately (user gesture).
  useEffect(() => {
    const el = reportRef.current;
    if (!el) return;

    let cancelled = false;
    shareFileRef.current = null;
    setShareReady(false);

    const timer = window.setTimeout(() => {
      void prepareMissionReportShareFile(el)
        .then((file) => {
          if (!cancelled) {
            shareFileRef.current = file;
            setShareReady(true);
          }
        })
        .catch(() => {
          if (!cancelled) setShareReady(false);
        });
    }, 400);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [
    baseScore,
    bonusScore,
    rank,
    timeDisplay,
    badges,
    av.title,
    metaLine,
    roster.length,
  ]);

  const handleShare = useCallback(async () => {
    const el = reportRef.current;
    if (!el || sharing) return;

    setSharing(true);
    try {
      let file = shareFileRef.current;
      if (!file) {
        onToast?.("📸 Preparing report…");
        file = await prepareMissionReportShareFile(el);
        shareFileRef.current = file;
      }

      await shareMissionReportFile(file, shareData, onToast);
    } finally {
      setSharing(false);
    }
  }, [sharing, onToast, shareData]);

  return (
    <div className="game-hub-panel">
      <div className="game-scroll flex-1 min-h-0 game-comp-scroll">
        <div className="game-comp-hero">
          <div className="game-bc">
            HUNT <span>›</span>
            <span style={{ color: "var(--o)" }}>MISSION REPORT</span>
          </div>
          <div className="game-comp-hero-icon">🏭</div>
          {/* <h2 className="game-comp-hero-title">
            500 BRACKETS
            <br />
            <span className="text-[var(--o)]">SHIPPED.</span>
          </h2>
          <p className="font-share-mono text-[11px] text-[var(--mut)] leading-[1.65] m-0">
            Apex Motors signs off.
            <br />
            <strong className="text-[var(--txt)]">YOUR SHOP IS REAL NOW.</strong>
          </p> */}

          <h2 className="game-comp-hero-title">
            GEARBOX
            <br />
            <span className="text-[var(--o)]">DELIVERED.</span>
          </h2>
          <p className="font-share-mono text-[11px] text-[var(--mut)] leading-[1.65] m-0">
            Redline Robotics signs off.
            <br />
            <strong className="text-[var(--txt)]">YOUR SHOP IS REAL NOW.</strong>
          </p>
        </div>

        <div className="game-traveler" ref={reportRef}>
          <div className="game-trav-top">
            <div className="game-trav-av">{av.em}</div>
            <div className="min-w-0">
              <div className="game-trav-lbl">// MISSION REPORT</div>
              <div className="game-trav-name">{av.title}</div>
              <div className="game-trav-meta">{metaLine}</div>
            </div>
          </div>

          <div className="game-trav-body">
            <div>
              <div className="game-trav-sec-lbl">SCORE</div>
              <div className="game-trav-score-row">
                <div className="game-trav-score-val">{baseScore}</div>
                <div>
                  <div className="font-share-mono text-[11px] text-[var(--am)]">
                    +{bonusScore} bonus
                  </div>
                  <div className="font-share-mono text-[10px] text-[var(--mut)]">
                    RANK #{rank}
                  </div>
                  <div className="font-share-mono text-[10px] text-[var(--mut)]">
                    TIME {timeDisplay}
                  </div>
                </div>
              </div>
            </div>

            <div className="game-trav-sec">
              <div className="game-trav-sec-lbl">BADGES EARNED</div>
              {badges.length ? (
                <div className="flex flex-wrap gap-[5px]">
                  {badges.map((b, i) => {
                    const c = BADGE_COLORS[i % BADGE_COLORS.length];
                    return (
                      <span
                        key={`${b}-${i}`}
                        className="game-earn-b"
                        style={{
                          background: c.bg,
                          color: c.text,
                          border: `1px solid ${c.border}`,
                        }}
                      >
                        {b}
                      </span>
                    );
                  })}
                </div>
              ) : (
                <p className="font-share-mono text-[10px] text-[var(--mut)] m-0">
                  COMPLETE BONUS CHALLENGES TO EARN BADGES
                </p>
              )}
            </div>

            {/* <div className="game-trav-sec">
              <div className="game-trav-sec-lbl">CONTRACT</div>
              <p className="font-share-mono text-[11px] text-[rgba(232,234,240,0.8)] leading-[1.7] m-0">
                APEX MOTORS · 500 BRAKE CALIPER BRACKETS
                <br />
                MATERIAL: 6061 ALUMINUM
              </p>
            </div> */}

            <div className="game-trav-sec">
              <div className="game-trav-sec-lbl">CONTRACT</div>
              <p className="font-share-mono text-[11px] text-[rgba(232,234,240,0.8)] leading-[1.7] m-0">
                REDLINE ROBOTICS · PLANETARY GEARBOX
                <br />
                MATERIAL: HYBRID (PRINTED & MACHINED)
              </p>
            </div>

            <div className="game-trav-sec">
              <div className="game-trav-sec-lbl">TEAM BUILT</div>
              {roster.length ? (
                roster.map((t, i) => (
                  <div key={i} className="game-team-r">
                    <div className="game-team-dot" />
                    {t.n} — {t.c}
                  </div>
                ))
              ) : (
                <p className="font-share-mono text-[10px] text-[var(--mut)] m-0">
                  COMPLETE CONVERSATION STOPS TO BUILD YOUR TEAM
                </p>
              )}
            </div>

            <div className="game-trav-sec text-center">
              <p className="font-share-mono text-[10px] text-[var(--mut)] mb-[5px] m-0">
                POWERED BY PHILLIPS MACHINIST
              </p>
              <button
                type="button"
                className="game-app-dl-strip"
                onClick={() => {
                  openMachinistApp();
                  onToast?.("📱 Opening Phillips Machinist…");
                }}
              >
                <span className="game-app-dl-label">
                  📱 DOWNLOAD / OPEN THE APP
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="game-share-section">
          <GameButton
            variant="primary"
            disabled={sharing}
            onClick={() => void handleShare()}
          >
            {sharing
              ? "OPENING SHARE…"
              : shareReady
                ? "► SHARE MISSION REPORT"
                : "► PREPARING SHARE…"}
          </GameButton>
        </div>

        <div className="game-share-btns">
          <GameButton variant="secondary" onClick={onViewLeaderboard}>
            VIEW LEADERBOARD
          </GameButton>
          <GameButton variant="secondary" onClick={onBackToHunt}>
            ◄ BACK TO HUNT
          </GameButton>
          <GameButton variant="primary" onClick={onLogout}>
            LOGOUT
          </GameButton>
        </div>
      </div>
    </div>
  );
}
