export function PhotoBg() {
  return (
    <div className="absolute inset-0 z-0">
      {/* Photo background with dark CNC shop floor */}


      {/* Tint layers */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 70% 60% at 20% 0%, rgba(241, 92, 30, 0.08) 0%, transparent 65%),
            radial-gradient(ellipse 100% 40% at 50% 100%, rgba(10, 8, 6, 0.5) 0%, transparent 70%),
            linear-gradient(to bottom, rgba(4, 5, 6, 0.45) 0%, transparent 18%, transparent 75%, rgba(4, 5, 6, 0.6) 100%)
          `,
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 92% 92% at 50% 45%, transparent 42%, rgba(2, 3, 4, 0.22) 72%, rgba(2, 3, 4, 0.5) 100%)`,
        }}
      />

      {/* Film grain */}
      <div
        className="absolute inset-0 z-[3] pointer-events-none opacity-60"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`,
          mixBlendMode: 'overlay',
        }}
      />

      {/* Scanlines */}
      <div
        className="absolute inset-0 z-[4] pointer-events-none"
        style={{

          //           background: `repeating-linear-gradient(
          //   0deg,
          //   transparent,
          //   transparent 3px,
          //   rgba(255, 255, 255, 0.05) 3px,
          //   rgba(255, 255, 255, 0.05) 4px
          // )`
          background:
            `repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0, 0, 0, 0.06) 3px, rgba(0, 0, 0, 0.06) 4px)`
          // `repeating-linear-gradient(
          //   0deg,
          //   transparent,
          //   transparent 3px,
          //   rgba(0, 0, 0, 0.06) 3px,
          //   rgba(0, 0, 0, 0.06) 4px
          // )`,
        }}
      />
    </div>
  );
}

export function ViewportChrome() {
  return (
    <div className="absolute inset-0 z-[5] pointer-events-none">
      {/* Corner brackets */}
      <div
        className="absolute inset-0 border border-[rgba(241,92,48,0.12)] sm:inset-[10px]"
        style={{
          clipPath: `polygon(
            0 16px, 16px 0, calc(100% - 16px) 0, 100% 16px,
            100% calc(100% - 16px), calc(100% - 16px) 100%,
            16px 100%, 0 calc(100% - 16px)
          )`,
        }}
      />

      {/* Top HUD bar decorative line */}
      <div
        className="absolute top-12 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(
            90deg,
            transparent,
            rgba(241, 92, 48, 0.35) 20%,
            rgba(241, 92, 48, 0.6) 50%,
            rgba(241, 92, 48, 0.35) 80%,
            transparent
          )`,
        }}
      />
    </div>
  );
}
