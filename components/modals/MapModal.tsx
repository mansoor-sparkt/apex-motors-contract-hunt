import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { MAP_IMAGES } from "@/constants";
import Image from "next/image";

const MapModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [view, setView] = useState<"zoomOut" | "zoomIn">("zoomOut");

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 500,
            background: "rgba(0,0,0,0.88)",
            animation: "fadeIn .2s ease both",
          }}
        />
        <Dialog.Content
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 501,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 16px",
          }}
        >
          <Dialog.Title className="sr-only">Show Floor Map</Dialog.Title>

          <div
            style={{
              background: "rgba(8,10,14,0.98)",
              border: "1px solid var(--c)",
              width: "min(360px, 92vw)",
              clipPath: "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))",
              animation: "cbPop .35s cubic-bezier(.34,1.56,.64,1) both",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div style={{ padding: "11px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(0,229,255,0.18)", background: "linear-gradient(135deg, rgba(0,229,255,0.12), rgba(177,77,255,0.05))" }}>
              <div>
                <div style={{ fontFamily: "var(--fm)", fontSize: 9, letterSpacing: ".18em", color: "var(--c)", marginBottom: 3 }}>
                  // STARTING LOCATION
                </div>
                <div style={{ fontFamily: "var(--fd)", fontSize: 12, fontWeight: 700, letterSpacing: ".04em", color: "var(--txt)" }}>
                  BOOTH #837 (HAAS)
                </div>
              </div>
              <Dialog.Close asChild>
                <button
                  type="button"
                  style={{ fontFamily: "var(--fm)", fontSize: 10, color: "var(--c)", border: "1px solid rgba(0,229,255,0.3)", background: "rgba(0,229,255,0.08)", padding: "5px 10px", cursor: "pointer", clipPath: "polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px))" }}
                >
                  ✕ CLOSE
                </button>
              </Dialog.Close>
            </div>

            {/* Toggle Buttons */}
            <div className="flex p-2 gap-2 bg-[#050608]">
              <button
                onClick={() => setView("zoomOut")}
                className={`flex-1 py-2 font-share-mono text-[10px] tracking-widest border ${view === "zoomOut" ? "border-[var(--c)] bg-[rgba(0,229,255,0.1)] text-[var(--c)]" : "border-[var(--bdr)] bg-transparent text-[var(--mut)]"}`}
              >
                🔍 ZOOM OUT (HALL)
              </button>
              <button
                onClick={() => setView("zoomIn")}
                className={`flex-1 py-2 font-share-mono text-[10px] tracking-widest border ${view === "zoomIn" ? "border-[var(--c)] bg-[rgba(0,229,255,0.1)] text-[var(--c)]" : "border-[var(--bdr)] bg-transparent text-[var(--mut)]"}`}
              >
                📍 ZOOM IN (BOOTH)
              </button>
            </div>

            {/* Map Image */}
            <div style={{ background: "#000", height: 280, position: "relative", padding: "8px" }}>
              <Image
                src={MAP_IMAGES[view]}
                alt="Floor Map"
                style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
                fill
              />
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default MapModal