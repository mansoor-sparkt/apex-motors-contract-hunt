export function MediaPickerSheet({
  isPhoto,
  onCamera,
  onGallery,
  onClose,
}: {
  isPhoto: boolean;
  onCamera: () => void;
  onGallery: () => void;
  onClose: () => void;
}) {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0b0e] border-t border-[rgba(0,229,255,0.25)] px-4 pt-4 pb-8"
        style={{
          clipPath:
            "polygon(0 8px, 8px 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <span className="font-share-mono text-[10px] text-[var(--c)] tracking-[0.12em] uppercase">
            // SELECT SOURCE
          </span>
          <button
            type="button"
            onClick={onClose}
            className="font-share-mono text-[10px] text-[var(--mut)] tracking-[0.08em] px-2 py-1 border border-[rgba(255,255,255,0.1)]"
          >
            CANCEL
          </button>
        </div>

        {/* Two options */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => { onCamera(); onClose(); }}
            className="flex-1 flex flex-col items-center justify-center gap-2 py-5 border border-[rgba(0,229,255,0.35)] bg-[rgba(0,229,255,0.06)] hover:bg-[rgba(0,229,255,0.1)] transition-colors"
            style={{
              clipPath:
                "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
            }}
          >
            <span className="text-3xl">
              {isPhoto ? "📷" : "🎬"}
            </span>
            <span className="font-share-mono text-[10px] text-[var(--c)] tracking-[0.08em]">
              {isPhoto ? "TAKE PHOTO" : "RECORD VIDEO"}
            </span>
            <span className="font-share-mono text-[8px] text-[var(--mut)] tracking-[0.06em]">
              OPEN CAMERA
            </span>
          </button>

          <button
            type="button"
            onClick={() => { onGallery(); onClose(); }}
            className="flex-1 flex flex-col items-center justify-center gap-2 py-5 border border-[rgba(0,229,255,0.35)] bg-[rgba(0,229,255,0.06)] hover:bg-[rgba(0,229,255,0.1)] transition-colors"
            style={{
              clipPath:
                "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
            }}
          >
            <span className="text-3xl">🖼️</span>
            <span className="font-share-mono text-[10px] text-[var(--c)] tracking-[0.08em]">
              {isPhoto ? "CHOOSE PHOTO" : "CHOOSE VIDEO"}
            </span>
            <span className="font-share-mono text-[8px] text-[var(--mut)] tracking-[0.06em]">
              FROM GALLERY
            </span>
          </button>
        </div>
      </div>
    </>
  );
}