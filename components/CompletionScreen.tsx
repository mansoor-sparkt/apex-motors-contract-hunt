'use client';

import React from 'react';
import { HUDBar, Panel, GameButton, StatusTag } from './GameComponents';
// import type { StopResult } from './StopScreen';

export interface StopResult {
  stopId: number;
  answeredCorrectly: boolean;
  pointsEarned: number;
  bonusEarned: number;
  bonusBadge?: string | null;
  repName?: string;
}

interface CompletionScreenProps {
  playerName: string;
  school: string;
  role: string;
  avatarEmoji: string;
  results: StopResult[];
  onViewLeaderboard: () => void;
  onBackToHunt: () => void;
}

const STOP_NAMES = [
  'Markforged',
  'Autodesk',
  'Mastercam',
  'Haas',
  'Mitutoyo',
  'Zeiss',
  'Deere',
  'Caterpillar',
];

const BADGE_COLORS = [
  { bg: 'rgba(241,92,48,0.15)', text: '#F15C30', border: 'rgba(241,92,48,0.35)' },
  { bg: 'rgba(0,229,255,0.10)', text: '#00e5ff', border: 'rgba(0,229,255,0.3)' },
  { bg: 'rgba(57,255,20,0.08)', text: '#39ff14', border: 'rgba(57,255,20,0.3)' },
  { bg: 'rgba(255,187,0,0.10)', text: '#ffbb00', border: 'rgba(255,187,0,0.3)' },
  { bg: 'rgba(177,77,255,0.10)', text: '#b14dff', border: 'rgba(177,77,255,0.3)' },
];

export function CompletionScreen({
  playerName,
  school,
  role,
  avatarEmoji,
  results,
  onViewLeaderboard,
  onBackToHunt,
}: CompletionScreenProps) {
  const totalScore = results.reduce((s, r) => s + r.pointsEarned + r.bonusEarned, 0);
  const maxScore = results.length * 15; // 10 base + 5 bonus per stop
  const correctCount = results.filter((r) => r.answeredCorrectly).length;
  const wrongCount = results.length - correctCount;
  const bonusCount = results.filter((r) => r.bonusEarned > 0).length;
  const badges = results
    .filter((r) => r.bonusBadge)
    .map((r) => r.bonusBadge as string);
  const roster = results
    .filter((r) => r.repName)
    .map((r, i) => ({ name: r.repName as string, company: STOP_NAMES[r.stopId - 1] ?? '' }));

  const accuracy = results.length > 0 ? Math.round((correctCount / results.length) * 100) : 0;

  return (
    <div className="absolute inset-0 flex flex-col h-full w-full overflow-hidden">
      <HUDBar title="JOB TRAVELER" onBack={onBackToHunt} />

      <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 px-5 py-3 space-y-3 scrollbar-hide">

        {/* ── HERO ── */}
        <div className="text-center py-4 space-y-2">
          <div className="text-5xl animate-bounce">🏭</div>
          <div className="font-orbitron font-black text-xl tracking-wide leading-tight">
            500 BRACKETS<br />
            <span className="text-[#F15C30]" style={{ textShadow: '0 0 24px rgba(241,92,48,0.6)' }}>
              SHIPPED.
            </span>
          </div>
          <div className="font-share-mono text-[11px] text-[rgba(232,234,240,0.55)] leading-relaxed">
            Apex Motors signs off on the lot.<br />
            A second PO hits your inbox.<br />
            <span className="text-[rgba(232,234,240,0.85)] font-bold">YOUR SHOP IS REAL NOW.</span>
          </div>
        </div>

        {/* ── OPERATOR CARD ── */}
        <Panel header="// JOB TRAVELER" headerColor="orange">
          <div className="flex items-center gap-3 pb-3 mb-3 border-b border-[rgba(255,255,255,0.06)]">
            <div
              className="w-12 h-12 flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: 'rgba(241,92,48,0.1)', border: '1px solid rgba(241,92,48,0.3)' }}
            >
              {avatarEmoji}
            </div>
            <div>
              <div className="font-orbitron font-bold text-sm tracking-wide">
                {playerName.toUpperCase()}
              </div>
              <div className="font-share-mono text-[10px] text-[rgba(232,234,240,0.5)] mt-0.5">
                {school} · {role}
              </div>
            </div>
          </div>

          {/* Score + accuracy */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="bg-[rgba(5,6,8,0.55)] border border-[rgba(241,92,48,0.3)] p-2 text-center">
              <div
                className="font-orbitron font-black text-2xl text-[#F15C30]"
                style={{ textShadow: '0 0 18px rgba(241,92,48,0.5)' }}
              >
                {totalScore}
              </div>
              <div className="font-share-mono text-[8px] text-[rgba(232,234,240,0.4)] tracking-widest mt-0.5">
                TOTAL PTS
              </div>
            </div>
            <div className="bg-[rgba(5,6,8,0.55)] border border-[rgba(0,229,255,0.2)] p-2 text-center">
              <div className="font-orbitron font-black text-2xl text-[#00e5ff]">
                {accuracy}%
              </div>
              <div className="font-share-mono text-[8px] text-[rgba(232,234,240,0.4)] tracking-widest mt-0.5">
                ACCURACY
              </div>
            </div>
            <div className="bg-[rgba(5,6,8,0.55)] border border-[rgba(57,255,20,0.2)] p-2 text-center">
              <div className="font-orbitron font-black text-2xl text-[#39ff14]">
                {bonusCount}
              </div>
              <div className="font-share-mono text-[8px] text-[rgba(232,234,240,0.4)] tracking-widest mt-0.5">
                BONUSES
              </div>
            </div>
          </div>

          {/* Score breakdown */}
          <div className="space-y-1 text-[11px] font-share-mono">
            <div className="flex justify-between text-[#39ff14]">
              <span>✓ CORRECT ANSWERS ({correctCount})</span>
              <span>+{correctCount * 10} PTS</span>
            </div>
            <div className="flex justify-between text-[#F15C30]">
              <span>✗ PARTIAL CREDIT ({wrongCount})</span>
              <span>+{wrongCount * 5} PTS</span>
            </div>
            <div className="flex justify-between text-[#ffbb00]">
              <span>★ BONUS CHALLENGES ({bonusCount})</span>
              <span>+{bonusCount * 5} PTS</span>
            </div>
            <div
              className="flex justify-between pt-2 mt-1 border-t border-[rgba(255,255,255,0.08)] font-bold text-[rgba(232,234,240,0.85)]"
            >
              <span>TOTAL</span>
              <span>{totalScore} / {maxScore} PTS</span>
            </div>
          </div>
        </Panel>

        {/* ── STOP BY STOP ── */}
        <Panel header="STOP BREAKDOWN" headerColor="cyan">
          <div className="space-y-2">
            {results.map((r, i) => (
              <div
                key={r.stopId}
                className="flex items-center justify-between py-1.5 border-b border-[rgba(255,255,255,0.05)] last:border-0"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-5 h-5 flex items-center justify-center text-[9px] font-bold flex-shrink-0
                      ${r.answeredCorrectly
                        ? 'bg-[rgba(57,255,20,0.15)] text-[#39ff14]'
                        : 'bg-[rgba(241,92,48,0.15)] text-[#F15C30]'
                      }`}
                  >
                    {r.answeredCorrectly ? '✓' : '✗'}
                  </div>
                  <div>
                    <div className="font-orbitron text-[10px] font-bold">
                      {STOP_NAMES[r.stopId - 1]}
                    </div>
                    {r.bonusBadge && (
                      <div className="font-share-mono text-[8px] text-[#ffbb00]">
                        🏅 {r.bonusBadge}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`font-orbitron font-bold text-[11px]
                      ${r.answeredCorrectly ? 'text-[#39ff14]' : 'text-[#F15C30]'}`}
                  >
                    +{r.pointsEarned + r.bonusEarned} PTS
                  </div>
                  {r.bonusEarned > 0 && (
                    <div className="font-share-mono text-[8px] text-[#ffbb00]">
                      +{r.bonusEarned} bonus
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Panel>

        {/* ── BADGES EARNED ── */}
        {badges.length > 0 && (
          <Panel header="BADGES EARNED" headerColor="orange">
            <div className="flex flex-wrap gap-2">
              {badges.map((badge, i) => {
                const c = BADGE_COLORS[i % BADGE_COLORS.length];
                return (
                  <span
                    key={i}
                    className="px-2.5 py-1 font-share-mono text-[10px] tracking-wider"
                    style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}
                  >
                    🏅 {badge}
                  </span>
                );
              })}
            </div>
          </Panel>
        )}

        {/* ── TEAM ROSTER ── */}
        {roster.length > 0 && (
          <Panel header="TEAM BUILT" headerColor="green">
            <div className="space-y-2">
              {roster.map((r, i) => (
                <div key={i} className="flex items-center gap-2 font-share-mono text-[11px] text-[rgba(232,234,240,0.8)]">
                  <div className="w-1.5 h-1.5 bg-[#F15C30] flex-shrink-0" />
                  {r.name} — {r.company}
                </div>
              ))}
            </div>
          </Panel>
        )}

        {/* ── CONTRACT DETAILS ── */}
        <Panel header="CONTRACT" headerColor="cyan">
          <div className="font-share-mono text-[11px] text-[rgba(232,234,240,0.7)] leading-relaxed space-y-1">
            <div>APEX MOTORS · 500 BRAKE CALIPER BRACKETS</div>
            <div>MATERIAL: 6061 ALUMINUM</div>
            <div className="text-[rgba(232,234,240,0.4)]">POWERED BY PHILLIPS MACHINIST</div>
          </div>
        </Panel>

        {/* ── STATUS TAGS ── */}
        <div className="flex gap-2 flex-wrap">
          <StatusTag variant="green">CONTRACT DELIVERED</StatusTag>
          <StatusTag variant="cyan">{results.length}/8 STOPS</StatusTag>
          {badges.length > 0 && (
            <StatusTag variant="purple">{badges.length} BADGES</StatusTag>
          )}
        </div>
      </div>

      {/* ── ACTIONS ── */}
      <div className="px-5 py-4 flex flex-col gap-3 flex-shrink-0">
        <GameButton variant="primary" onClick={() => alert('📤 Sharing Job Traveler…')}>
          ► SHARE JOB TRAVELER
        </GameButton>
        <div className="flex gap-3">
          <GameButton variant="secondary" onClick={onViewLeaderboard}>
            LEADERBOARD
          </GameButton>
          <GameButton variant="secondary" onClick={onBackToHunt}>
            ◄ BACK TO HUNT
          </GameButton>
        </div>
      </div>
    </div>
  );
}