import { MAP_IMAGES } from "@/constants";
import Image from "next/image";

// ── 1. INCOMPLETE BONUS NUDGE MODAL ──
export function IncompleteBonusModal({
  isOpen,
  onClose,
  onDoBonus
}: {
  isOpen: boolean;
  onClose: () => void;
  onDoBonus: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-[120] flex flex-col justify-center items-center bg-black/85 backdrop-blur-sm p-4 transition-opacity">
      <div
        className="bg-[rgba(4,5,6,0.95)] border border-[#ffbb00] w-full max-w-sm p-5 relative shadow-[0_0_40px_rgba(255,187,0,0.2)]"
        style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}
      >
        <div className="text-center mb-5 mt-2">
          <div className="text-5xl mb-2 drop-shadow-[0_0_15px_rgba(255,187,0,0.8)]">🎁</div>
          <h2 className="font-orbitron text-lg font-bold text-[#ffbb00] tracking-widest">
            BONUS UNLOCKED
          </h2>
          <p className="font-[family:var(--font-rajdhani)] text-[14px] text-[rgba(232,234,240,0.85)] mt-3 leading-relaxed px-2">
            You completed all core stops! Optional <span className="text-[#ffbb00] font-bold">bonus challenges</span> are still on your hunt map. Rack up points to unlock the exclusive <span className="text-white font-bold">bonus prize</span>.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={onDoBonus}
            className="w-full py-3 bg-[rgba(255,187,0,0.15)] hover:bg-[rgba(255,187,0,0.25)] text-[#ffbb00] border border-[rgba(255,187,0,0.5)] font-share-mono text-[12px] tracking-[0.1em] transition-colors"
            style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}
          >
            ★ DO BONUS NOW
          </button>

          <button
            onClick={onClose}
            className="w-full py-2 text-[var(--mut)] font-share-mono text-[10px] tracking-[0.1em] hover:bg-[rgba(255,255,255,0.05)] transition-colors mt-2"
          >
            SKIP FOR NOW ►
          </button>
        </div>
      </div>
    </div>
  );
}

// ── 2. FINAL CONGRATULATIONS MODAL ──
export function CongratulationModal({
  isOpen,
  onClose
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-[120] flex flex-col justify-center items-center bg-black/90 backdrop-blur-md p-4 transition-opacity">
      <div
        className="bg-[rgba(4,5,6,0.95)] border border-[var(--g)] w-full max-w-sm p-5 relative shadow-[0_0_50px_rgba(57,255,20,0.25)]"
        style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}
      >
        <div className="text-center mb-4">
          <div className="text-5xl mb-2 animate-bounce">🎉</div>
          <h2 className="font-orbitron text-xl font-black text-[var(--g)] tracking-widest drop-shadow-[0_0_8px_rgba(57,255,20,0.5)]">
            CONGRATULATIONS!
          </h2>
          <div className="font-share-mono text-[10px] tracking-[0.2em] text-[var(--c)] mt-1 mb-4">
            ALL CORE STOPS COMPLETE
          </div>

          {/* Location Instructions Box */}
          <div
            className="bg-[rgba(57,255,20,0.05)] border border-[rgba(57,255,20,0.3)] p-3 mb-4"
            style={{ clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))" }}
          >
            <p className="font-[family:var(--font-rajdhani)] text-[15px] text-white leading-snug">
              Go to the <span className="text-[var(--o)] font-bold">Phillips Machinist Booth</span> for your Prize!
            </p>
          </div>

          {/* Map Image Container */}
          <div
            className="relative w-full h-40 border border-[rgba(255,255,255,0.15)] mb-5 overflow-hidden bg-black"
            style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}
          >
            <Image
              src={MAP_IMAGES.zoomOut.src}
              alt="Map to Phillips Booth"
              className="w-full h-full object-cover opacity-80"
              fill
            />
            {/* Gradient Overlay for Text Visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(4,5,6,0.9)] via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-2 left-0 right-0 text-center font-share-mono text-[10px] text-[var(--o)] font-bold tracking-widest drop-shadow-md">
              📍 RETURN TO BASE
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-[rgba(57,255,20,0.15)] hover:bg-[rgba(57,255,20,0.25)] text-[var(--g)] border border-[rgba(57,255,20,0.5)] font-share-mono text-[12px] tracking-[0.1em] transition-colors"
          style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}
        >
          ✓ CLOSE & CLAIM PRIZE
        </button>
      </div>
    </div>
  );
}