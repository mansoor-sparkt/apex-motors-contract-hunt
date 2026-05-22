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
  onClick,
}: {
  index: number;
  company: string;
  task: string;
  done: boolean;
  active: boolean;
  locked: boolean;
  bonus?: boolean;
  onClick?: () => void;
}) {
  const showBase = done || active;
  const showBonus = done && bonus;

  const boxClass = done
    ? 'game-sn-d'
    : active
      ? 'game-sn-a'
      : 'game-sn-l';

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
    >
      <div className={`game-sn-box ${boxClass}`} style={{ clipPath: SN_CLIP }}>
        {done ? '✓' : locked ? '🔒' : index + 1}
      </div>
      <div className="game-stop-info">
        <div className="game-stop-co">{company}</div>
        <div className="game-stop-tk">{task}</div>
      </div>
      <div className="game-stop-pts">
        {showBase ? (
          <div className="game-stop-base-pts">10 BASE</div>
        ) : null}
        {showBonus ? (
          <div className="game-stop-bonus-pts">+5 BONUS</div>
        ) : null}
        {!locked ? <div className="game-stop-arrow">►</div> : null}
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
      <div className="game-pts-bonus">
        <div className="game-pts-val text-[var(--am)]">+{bonus}</div>
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
}: {
  title: string;
  onBack?: () => void;
  showLogo?: boolean;
  backLabel?: string;
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
      <div className="game-hud-ttl">{title}</div>
      {onBack && <div className="game-hud-sp" />}
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
  return <HUDBar title={title} onBack={onBack} backLabel="◄ STOPS" />;
}
