'use client';

import React from 'react';

const SN_CLIP =
  'polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px))';

export function GameButton({
  children,
  variant = 'primary',
  onClick,
  className = '',
  disabled,
  ...props
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  [key: string]: unknown;
}) {
  return (
    <button
      type="button"
      className={`game-btn ${variant === 'primary' ? 'game-btn-p' : 'game-btn-s'} ${className} disabled:opacity-40 disabled:cursor-not-allowed`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
}

export function StatusTag({
  children,
  variant = 'orange',
}: {
  children: React.ReactNode;
  variant?: 'orange' | 'cyan' | 'green' | 'purple' | 'dim';
}) {
  const map = {
    orange: 'game-tag-o',
    cyan: 'game-tag-c',
    green: 'game-tag-g',
    purple: 'game-tag-pu',
    dim: 'game-tag-d',
  };
  return <span className={`game-tag ${map[variant]}`}>{children}</span>;
}

export function Panel({
  children,
  header,
  headerColor = 'orange',
  className = '',
  stopVariant = false,
}: {
  children: React.ReactNode;
  header?: React.ReactNode;
  headerColor?: 'orange' | 'cyan' | 'green' | 'yellow';
  className?: string;
  stopVariant?: boolean;
}) {
  const accent =
    headerColor === 'cyan'
      ? 'pc'
      : headerColor === 'green'
        ? 'pg'
        : headerColor === 'yellow'
          ? 'py'
          : '';

  return (
    <div
      className={`game-panel ${accent} ${stopVariant ? 'game-panel--stop' : ''} ${className}`}
    >
      {header && <div className="game-panel-h">{header}</div>}
      <div className="game-panel-b">{children}</div>
    </div>
  );
}

export function ProgressPips({
  total,
  completed,
  active,
}: {
  total: number;
  completed: number;
  active?: number;
}) {
  return (
    <div className="game-pips">
      {Array.from({ length: total }).map((_, i) => {
        const isDone = i < completed;
        const isActive = i === active;
        return (
          <div
            key={i}
            className={`game-pip${isDone ? ' done' : ''}${isActive ? ' act' : ''}`}
          />
        );
      })}
    </div>
  );
}

export function HuntStopRow({
  index,
  company,
  task,
  done,
  active,
  locked,
  bonus,
  ptsLabel,
  isBonusRow = false,
  onClick,
}: {
  index: number;
  company: string;
  task: string;
  done: boolean;
  active: boolean;
  locked: boolean;
  bonus?: boolean;
  ptsLabel?: string;
  isBonusRow?: boolean;
  onClick?: () => void;
}) {


  const boxClass = done
    ? 'game-sn-d'
    : active
      ? 'game-sn-a'
      : 'game-sn-l';

  const rowStyle = isBonusRow ? {
    borderColor: done ? 'rgba(57,255,20,0.3)' : active ? 'rgba(255,187,0,0.4)' : 'rgba(255,255,255,0.05)',
    background: done ? 'rgba(57,255,20,0.04)' : active ? 'linear-gradient(90deg, rgba(255,187,0,0.1), transparent)' : 'transparent',
  } : {};

  const boxStyle = isBonusRow ? {
    borderColor: done ? 'var(--g)' : active ? '#ffbb00' : 'rgba(255,255,255,0.1)',
    color: done ? 'var(--g)' : active ? '#ffbb00' : 'var(--mut)',
    background: done ? 'rgba(57,255,20,0.1)' : active ? 'rgba(255,187,0,0.1)' : 'transparent',
    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
  } : { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' };
  return (
    <div
      role={locked ? undefined : 'button'}
      tabIndex={locked ? undefined : 0}
      onClick={locked ? undefined : onClick}
      onKeyDown={
        locked
          ? undefined
          : (e) => {
            if (e.key === 'Enter' || e.key === ' ') onClick?.();
          }
      }
      className={`game-stop-row${done ? ' done' : ''}${active ? ' act' : ''}${locked ? ' lock' : ''}`}
      style={rowStyle}
    >
      <div className={`game-sn-box ${boxClass}`} style={{ clipPath: SN_CLIP }}>
        {done ? '✓' : locked ? '🔒' : isBonusRow ? "B" : index + 1}
      </div>
      <div className="game-stop-info">
        {/* ── NEW: Dedicated Bonus Tag ── */}
        {isBonusRow && (
          <div className="mb-1">
            <span className="font-share-mono text-[8px] bg-[rgba(255,187,0,0.15)] text-[#ffbb00] border border-[rgba(255,187,0,0.4)] px-1.5 py-[2px] tracking-widest">
              BONUS CHALLENGE
            </span>
          </div>
        )}
        <div
          className="game-stop-co"
          style={isBonusRow ? { color: done ? 'var(--g)' : '#ffbb00' } : undefined}
        >
          {company}
        </div>
        <div className="game-stop-tk">{task}</div>
      </div>
      {/* <div className="game-stop-pts">
       
        <div className="game-stop-base-pts">{done ? (bonus ? "20 PTS" : "10 PTS") : "20 PTS MAX"}</div>
        
        {!locked ? <div className="game-stop-arrow">►</div> : null}
      </div> */}

      {/* ── NEW: Inject the dynamic displayPts here ── */}
      <div className="game-stop-pts">
        <div
          className="game-stop-base-pts"
          style={isBonusRow && active ? { color: '#ffbb00' } : undefined}
        >
          {ptsLabel}
        </div>
        {!locked ? (
          <div
            className="game-stop-arrow"
            style={isBonusRow && active ? { color: '#ffbb00' } : undefined}
          >
            ►
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function ScoreRow({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string | number;
  valueColor?: string;
}) {
  return (
    <div className="game-sc-box">
      <div className="game-sc-val" style={valueColor ? { color: valueColor } : undefined}>
        {value}
      </div>
      <div className="game-sc-lbl">{label}</div>
    </div>
  );
}

export function PointsSplitRow({
  base,
  bonus,
  rank,
  stops,
}: {
  base: number;
  bonus: number;
  rank: string;
  stops: string;
}) {


  return (
    <div className="game-pts-split">
      <div className="game-pts-base">
        <div className="game-pts-val text-[var(--o)]">{base}</div>
        <div className="game-pts-lbl">BASE PTS</div>
      </div>
      <div className={`game-pts-bonus  ${bonus === 100 ? `border-(--g)` : "border-[#ffbb0012]"}`}>
        <div className={`game-pts-val  ${bonus === 100 ? `text-(--g)` : "text-[var(--am)]"}`}>+{bonus}</div>
        <div className="game-pts-lbl">BONUS PTS</div>
      </div>
      <div className="game-pts-base">
        <div className="game-pts-val text-[var(--c)]">{rank}</div>
        <div className="game-pts-lbl">RANK</div>
      </div>
      <div className="game-pts-base">
        <div className="game-pts-val">{stops}</div>
        <div className="game-pts-lbl">STOPS</div>
      </div>
    </div>
  );
}

export function HUDBar({
  title,
  onBack,
  showLogo = false,
  backLabel = '◄ BACK',
  onOpenMap,
  isMapShow = false
}: {
  title: string;
  onBack?: () => void;
  showLogo?: boolean;
  backLabel?: string;
  onOpenMap?: () => void;
  isMapShow?: boolean
}) {
  return (
    <div className={`game-hud${onBack ? ' game-hud--back' : ''}`}>
      {onBack ? (
        <button type="button" className="game-hud-back" onClick={onBack}>
          {backLabel}
        </button>
      ) : showLogo ? (
        <>
          <div className="game-hud-logo">
            <div className="game-hud-lm">/// PHILLIPS</div>
            <div className="game-hud-ls">MACHINIST</div>
          </div>
          <div className="game-hud-sep" />
        </>
      ) : null}
      <div className="game-hud-ttl flex-1 min-w-0">{title}</div>
      {/* {isMapShow && <div className="px-4 py-2 relative z-[1]">
        <button
          type="button"
          onClick={onOpenMap}
          className="w-full flex items-center justify-center gap-2 py-2 font-share-mono text-[11px] text-[var(--c)] tracking-widest border border-[rgba(0,229,255,0.3)] bg-[rgba(0,229,255,0.05)] hover:bg-[rgba(0,229,255,0.1)] transition-colors px-4 cursor-pointer"
          style={{
            clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))"
          }}
        >
          <span>🗺️</span> MAP
        </button>
      </div>} */}
      {/* {onBack && <div className="game-hud-sp" />} */}
      {isMapShow && <div className="px-4 py-2 relative z-[1]">
        <button
          type="button"
          onClick={onOpenMap}
          className="w-full flex items-center justify-center gap-2 py-2 font-share-mono text-[11px] text-[var(--c)] tracking-widest border border-[rgba(0,229,255,0.3)] bg-[rgba(0,229,255,0.05)] hover:bg-[rgba(0,229,255,0.1)] transition-colors px-4 cursor-pointer"
          style={{
            clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))"
          }}
        >
          <span>🗺️</span> MAP
        </button>
      </div>}

    </div>
  );
}

export function PhillipsHUDBar({
  title,
  onBack,
}: {
  title: string;
  onBack?: () => void;
}) {
  return <HUDBar title={title} onBack={onBack} backLabel="◄ STOPS" isMapShow={false} />;
}


// export function UpdatePointSplitRow() {
//   return (
//     <>
//       <div className="flex justify-between items-center border border-[rgba(0,229,255,0.3)] bg-[rgba(0,0,0,0.6)] p-3"
//         style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}>
//         <div>
//           <div className="font-share-mono text-[9px] text-[var(--c)] tracking-widest mb-1">CORE STOPS (BASE PRIZE)</div>
//           <div className="font-orbitron text-sm font-bold text-white">{stopsCount} / {TOTAL_STOPS} COMPLETE</div>
//         </div>
//         <div className="text-right">
//           <div className="font-orbitron text-lg font-black text-[var(--c)]">{coreScore}</div>
//           <div className="font-share-mono text-[8px] text-[var(--mut)]">PTS</div>
//         </div>
//       </div>

//       {/* 2. Bonus Progress (Extra Prize) */}
//       <div className="border border-[rgba(255,187,0,0.3)] bg-[rgba(0,0,0,0.6)] p-3"
//         style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}>
//         <div className="flex justify-between items-end mb-2">
//           <div className="font-share-mono text-[9px] text-[#ffbb00] tracking-widest">BONUS TRACK (EXTRA PRIZE)</div>
//           <div className="font-orbitron text-[11px] font-bold text-[#ffbb00]">{bonusScore} / {TARGET_BONUS_SCORE} PTS</div>
//         </div>
//         {/* Progress Bar */}
//         <div className="h-1.5 w-full bg-[rgba(255,255,255,0.1)] overflow-hidden">
//           <div className="h-full bg-[#ffbb00] transition-all duration-500 ease-out" style={{ width: `${bonusPercent}%` }} />
//         </div>
//       </div>
//     </>
//   )
// }