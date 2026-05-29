"use client";

import * as Dialog from "@radix-ui/react-dialog";
import {
  resolveMediaPreviewUrl,
  resolveVideoPreviewUrl,
} from "@/lib/media-preview";

// ── MEDIA PREVIEW MODAL ──────────────────────────────────────────────────────
const MediaModal = ({
  previewUrl,
  mediaType,
  title,
  onClose,
}: {
  previewUrl: string;
  mediaType: "image" | "video";
  title: string;
  onClose: () => void;
}) => {
  const resolvedSrc =
    (mediaType === "video"
      ? resolveVideoPreviewUrl(previewUrl)
      : resolveMediaPreviewUrl(previewUrl)) ?? previewUrl;

  return (
    <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
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

          <Dialog.Title style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 }}>
            {title}
          </Dialog.Title>
          <div
            style={{
              background: "rgba(8,10,14,0.98)",
              border: "1px solid var(--o)",
              width: "min(340px, 92vw)",
              clipPath: "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))",
              animation: "cbPop .35s cubic-bezier(.34,1.56,.64,1) both",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Top accent line */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent, var(--o), transparent)" }} />

            {/* Header */}
            <div style={{ padding: "11px 14px 10px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(241,92,48,0.18)", background: "linear-gradient(135deg, rgba(241,92,48,0.12), rgba(177,77,255,0.05))" }}>
              <div>
                <div style={{ fontFamily: "var(--fm)", fontSize: 9, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--o)", marginBottom: 3 }}>
                  // EVIDENCE PREVIEW
                </div>
                <div style={{ fontFamily: "var(--fd)", fontSize: 12, fontWeight: 700, letterSpacing: ".04em", color: "var(--txt)", lineHeight: 1.2 }}>
                  {title}
                </div>
              </div>
              <Dialog.Close asChild>
                <button
                  type="button"
                  aria-label="Close evidence preview"
                  style={{ fontFamily: "var(--fm)", fontSize: 10, color: "var(--o)", border: "1px solid var(--bdr)", background: "rgba(241,92,48,0.08)", padding: "5px 10px", letterSpacing: ".08em", cursor: "pointer", clipPath: "polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px))", flexShrink: 0 }}
                >
                  ✕ CLOSE
                </button>
              </Dialog.Close>
            </div>

            {/* Media */}
            <div style={{ background: "#000", minHeight: 200, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              {/* Scanlines */}
              <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.06) 3px,rgba(0,0,0,0.06) 4px)", zIndex: 1 }} />
              {/* HUD frame */}
              <div style={{ position: "absolute", inset: 8, border: "1px solid rgba(241,92,48,0.2)", clipPath: "polygon(0 12px,12px 0,calc(100% - 12px) 0,100% 12px,100% calc(100% - 12px),calc(100% - 12px) 100%,12px 100%,0 calc(100% - 12px))", pointerEvents: "none", zIndex: 2 }} />
              {mediaType === "image" ? (
                <img src={resolvedSrc} alt={title} style={{ width: "100%", maxHeight: 280, objectFit: "contain", display: "block" }} />
              ) : (
                <video src={resolvedSrc} style={{ width: "100%", maxHeight: 280, display: "block" }} controls playsInline autoPlay />
              )}
            </div>

            {/* Footer */}
            <div style={{ padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(241,92,48,0.12)" }}>
              <span style={{ fontFamily: "var(--fm)", fontSize: 9, color: "var(--g)", letterSpacing: ".1em", display: "flex", alignItems: "center", gap: 5 }}>
                <span>✓</span> SUBMITTED · EVIDENCE LOGGED
              </span>
              <span style={{ fontFamily: "var(--fm)", fontSize: 9, color: "var(--mut)", letterSpacing: ".08em" }}>
                {mediaType === "image" ? "📷 PHOTO" : "🎬 VIDEO"}
              </span>
            </div>
          </div>

          <style>{`
            @keyframes cbPop { from { transform:scale(.55); opacity:0 } to { transform:scale(1); opacity:1 } }
            @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
          `}</style>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default MediaModal