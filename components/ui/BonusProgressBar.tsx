import { MAX_BONUS_SCORE } from "@/constants";

export function BonusProgressBar({ bonusScore }: { bonusScore: number }) {
  // ── MILESTONE CONFIGURATION ──
  const GIFT_MILESTONE = 100;
  const TOTAL_BONUS_POOL = MAX_BONUS_SCORE;

  // 1. Calculate percentage based on the true bonus pool maximum
  const fillPercent = Math.min(100, (bonusScore / TOTAL_BONUS_POOL) * 100);

  // 2. Locate exactly where the 100-point marker sits on the bar
  const milestonePercent = (GIFT_MILESTONE / TOTAL_BONUS_POOL) * 100;

  const isGoalReached = bonusScore >= GIFT_MILESTONE;
  const activeColor = isGoalReached ? "var(--g)" : "#ffbb00";
  const activeBorder = isGoalReached ? "rgba(57,255,20,0.3)" : "rgba(241,187,0,0.3)";

  return (
    <div className="px-4 py-2 space-y-3 relative z-[1]">
      <div
        className="bg-[rgba(0,0,0,0.65)] p-3 transition-colors duration-300"
        style={{
          border: `1px solid ${activeBorder}`,
          clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))"
        }}
      >
        {/* Tracker Headers */}
        <div className="flex justify-between items-end mb-2">
          <div
            className="font-share-mono text-[9px] tracking-[0.1em] transition-colors duration-300"
            style={{ color: activeColor }}
          >
            BONUS SCORE
            {isGoalReached ? " 🎉 EXTRA PRIZE UNLOCKED!" : "REACH 100 PTS TO UNLOCK EXTRA PRIZE"}
          </div>
          <div className="font-orbitron text-[12px] font-bold text-white">
            {bonusScore} / {TOTAL_BONUS_POOL} PTS
          </div>
        </div>

        {/* Master Progress Container with space for the marker overflow */}
        <div className="relative w-full pt-2 pb-4">

          {/* Bonus progress track */}
          <div className="h-2 w-full bg-[rgba(255,255,255,0.1)] overflow-hidden rounded-sm">
            <div
              className="h-full transition-all duration-500 ease-out"
              style={{
                width: `${fillPercent}%`,
                backgroundColor: isGoalReached ? "var(--g)" : "#ffbb00",
                boxShadow: isGoalReached ? "0 0 4px var(--g)" : "none"
              }}
            />
          </div>

          {/* ── 100-POINT MILESTONE TARGET TAG ── */}
          <div
            className="absolute top-0 -translate-x-1/2 flex flex-col items-center pointer-events-none z-10"
            style={{ left: `${milestonePercent}%`, marginTop: '-2px' }}
          >
            {/* Vertical Marker Line crossing the bar */}
            <div
              className="w-[2px] h-5 transition-colors duration-300 shadow-sm"
              style={{ backgroundColor: activeColor }}
            />
            {/* Tag Label underneath the line */}
            <span
              className="font-share-mono text-[10px] font-bold mt-1 whitespace-nowrap tracking-widest transition-colors duration-300"
              style={{
                color: activeColor,
                textShadow: isGoalReached ? "0 0 8px rgba(57,255,20,0.4)" : "none"
              }}
            >
              🎁 100 PTS
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
