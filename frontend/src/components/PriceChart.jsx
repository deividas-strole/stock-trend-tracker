import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const OVERLAY_META = {
  sma20: { label: "SMA 20", color: "#E0A339" },
  sma50: { label: "SMA 50", color: "#6C8EF5" },
  ema12: { label: "EMA 12", color: "#2BB3A3" },
};

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const close = payload.find((p) => p.dataKey === "close");
  return (
    <div className="rounded-lg border border-base-600 bg-base-900/95 backdrop-blur px-3 py-2 text-xs font-mono shadow-xl">
      <div className="text-ink-500 mb-1">{formatDate(label)}</div>
      {close && (
        <div className="text-ink-100 font-semibold">
          Close ${close.value?.toFixed(2)}
        </div>
      )}
      {payload
        .filter((p) => p.dataKey !== "close")
        .map((p) =>
          p.value != null ? (
            <div key={p.dataKey} style={{ color: p.color }}>
              {OVERLAY_META[p.dataKey]?.label ?? p.dataKey}: {p.value.toFixed(2)}
            </div>
          ) : null
        )}
    </div>
  );
}

export default function PriceChart({ chartData, activeOverlays, onToggleOverlay, loading }) {
  return (
    <div className="rounded-xl border border-base-600 bg-base-800 grid-texture">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 pt-4">
        <h2 className="text-sm font-semibold text-ink-100">Price history</h2>
        <div className="flex flex-wrap gap-2">
          {Object.entries(OVERLAY_META).map(([key, meta]) => (
            <button
              key={key}
              onClick={() => onToggleOverlay(key)}
              className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-mono transition-colors ${
                activeOverlays.includes(key)
                  ? "border-base-500 bg-base-700 text-ink-100"
                  : "border-base-600 text-ink-500 hover:text-ink-300"
              }`}
              aria-pressed={activeOverlays.includes(key)}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: activeOverlays.includes(key) ? meta.color : "#3A4552" }}
              />
              {meta.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-72 sm:h-96 px-2 pb-4 pt-2">
        {loading ? (
          <div className="flex h-full items-center justify-center text-ink-500 text-sm font-mono">
            Loading price history…
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6C8EF5" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#6C8EF5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#1A222D" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                stroke="#3A4552"
                tick={{ fill: "#7C8896", fontSize: 11, fontFamily: "IBM Plex Mono" }}
                minTickGap={40}
                axisLine={{ stroke: "#232B36" }}
                tickLine={false}
              />
              <YAxis
                domain={["auto", "auto"]}
                stroke="#3A4552"
                tick={{ fill: "#7C8896", fontSize: 11, fontFamily: "IBM Plex Mono" }}
                tickFormatter={(v) => `$${v}`}
                axisLine={false}
                tickLine={false}
                width={56}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="close"
                stroke="#6C8EF5"
                strokeWidth={2}
                fill="url(#priceFill)"
                dot={false}
                isAnimationActive={false}
              />
              {activeOverlays.map((key) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={OVERLAY_META[key].color}
                  strokeWidth={1.5}
                  dot={false}
                  connectNulls
                  isAnimationActive={false}
                />
              ))}
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
