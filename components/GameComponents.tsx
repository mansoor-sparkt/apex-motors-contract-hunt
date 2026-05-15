'use client';

import React from 'react';

const SN_CLIP =
  'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))';

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
  const pts = done
    ? `${bonus ? 15 : 10} PTS`
    : active
      ? '10–15 PTS'
      : '';

  const boxClass = done
    ? 'bg-[rgba(57,255,20,0.12)] text-[var(--g)]'
    : active
      ? 'bg-[var(--o)] text-white shadow-[0_0_14px_rgba(241,92,48,0.6)]'
      : 'bg-[rgba(255,255,255,0.04)] text-[var(--dim)]';

  return (
    <div
      role={locked ? undefined : 'button'}
      onClick={locked ? undefined : onClick}
      className={`game-stop-row${done ? ' done' : ''}${active ? ' act' : ''}${locked ? ' lock' : ''}`}
    >
      <div
        className={`w-[34px] h-[34px] flex items-center justify-center font-orbitron text-xs font-bold flex-shrink-0 ${boxClass}`}
        style={{ clipPath: SN_CLIP }}
      >
        {done ? '✓' : locked ? '🔒' : index + 1}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-orbitron text-xs font-bold tracking-[0.04em]">
          {company}
        </div>
        <div className="font-share-mono text-[10px] text-[var(--mut)] mt-[1px] truncate">
          {task}
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        {pts ? (
          <div className="font-orbitron text-[11px] font-bold text-[var(--g)]">
            {pts}
          </div>
        ) : null}
        {!locked && <div className="text-sm text-[var(--o)] mt-[2px]">►</div>}
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
