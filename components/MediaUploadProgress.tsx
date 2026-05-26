"use client";

export function MediaUploadProgress({
  percent,
  label = "UPLOADING",
}: {
  percent: number;
  label?: string;
}) {
  const clamped = Math.min(100, Math.max(0, percent));

  return (
    <div className="game-upload-progress" role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100}>
      <div className="game-upload-progress-head">
        <span className="game-upload-progress-lbl">{label}</span>
        <span className="game-upload-progress-pct">{clamped}%</span>
      </div>
      <div className="game-upload-progress-track">
        <div
          className="game-upload-progress-fill"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
