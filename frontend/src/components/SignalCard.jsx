const TREND_META = {
  Bullish: { color: "#2BB3A3", soft: "#173B37", arrow: "M12 4l7 8h-4v8h-6v-8H5l7-8z" },
  Bearish: { color: "#E0554F", soft: "#3A1F1E", arrow: "M12 20l-7-8h4V4h6v8h4l-7 8z" },
  Neutral: { color: "#7C8896", soft: "#1A222D", arrow: "M4 12h16" },
};

// Semi-circular confidence gauge, drawn by hand so the sweep angle maps
// exactly to the confidence percentage (0 => empty, 100 => full arc).
function ConfidenceGauge({ confidence, color }) {
  const radius = 54;
  const cx = 64;
  const cy = 64;
  const startAngle = 180;
  const endAngle = 180 - (confidence / 100) * 180;

  function point(angleDeg) {
    const rad = (angleDeg * Math.PI) / 180;
    return {
      x: cx + radius * Math.cos(rad),
      y: cy - radius * Math.sin(rad),
    };
  }

  const start = point(startAngle);
  const end = point(endAngle);
  const largeArc = confidence > 50 ? 1 : 0;

  return (
    <svg viewBox="0 0 128 78" width="128" height="78">
      <path
        d={`M ${point(180).x} ${point(180).y} A ${radius} ${radius} 0 1 1 ${point(0).x} ${point(0).y}`}
        fill="none"
        stroke="#232B36"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d={`M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`}
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
      />
      <text x={cx} y={cy - 4} textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="24" fontWeight="600" fill="#E7ECF2">
        {confidence}%
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="9" fill="#7C8896" letterSpacing="0.5">
        CONFIDENCE
      </text>
    </svg>
  );
}

export default function SignalCard({ signal, symbol, loading }) {
  if (loading || !signal) {
    return (
      <div className="rounded-xl border border-base-600 bg-base-800 p-4">
        <h2 className="text-sm font-semibold text-ink-100 mb-3">AI trend signal</h2>
        <div className="h-24 flex items-center justify-center text-ink-500 text-sm font-mono">
          Computing signal…
        </div>
      </div>
    );
  }

  const meta = TREND_META[signal.trend] ?? TREND_META.Neutral;

  return (
    <div
      className="rounded-xl border p-4"
      style={{ borderColor: "#232B36", background: `linear-gradient(180deg, ${meta.soft}55, #121821)` }}
    >
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-semibold text-ink-100">AI trend signal</h2>
        <span className="text-[11px] font-mono text-ink-500">{symbol}</span>
      </div>

      <div className="flex items-center gap-3">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
          style={{ background: meta.soft }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d={meta.arrow} fill={meta.color} />
          </svg>
        </div>
        <div>
          <div className="text-xl font-semibold" style={{ color: meta.color }}>
            {signal.trend}
          </div>
          <div className="text-[11px] text-ink-500 font-mono">as of {signal.asOf}</div>
        </div>
      </div>

      <div className="flex justify-center mt-2">
        <ConfidenceGauge confidence={signal.confidence} color={meta.color} />
      </div>

      <p className="text-[11px] leading-relaxed text-ink-500 mt-1 border-t border-base-600 pt-2">
        Estimate derived from moving-average crossover, 15-day momentum, and RSI —
        not a prediction of future price. For learning purposes only.
      </p>
    </div>
  );
}
