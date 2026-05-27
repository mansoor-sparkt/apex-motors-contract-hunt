import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh w-full flex-col items-center justify-center bg-[#0a0a0a] px-6 text-center">
      <p className="font-share-mono text-[10px] tracking-[0.2em] text-[var(--c)] mb-3">
        // SIGNAL LOST
      </p>
      <h1 className="font-orbitron text-2xl font-black tracking-[0.06em] text-white mb-2">
        ROUTE NOT ON THE MAP
      </h1>
      <p className="font-share-mono text-[11px] text-[var(--mut)] leading-relaxed max-w-[280px] mb-8">
        This page isn&apos;t part of the Apex Motors Contract Hunt. Head back to
        continue your mission.
      </p>
      <Link
        href="/"
        className="inline-block font-share-mono text-[11px] tracking-widest text-[var(--o)] border border-[var(--bdr)] bg-[rgba(241,92,48,0.08)] px-5 py-3 hover:bg-[rgba(241,92,48,0.14)] transition-colors"
        style={{
          clipPath:
            "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
        }}
      >
        ► RETURN TO HUNT
      </Link>
    </main>
  );
}
