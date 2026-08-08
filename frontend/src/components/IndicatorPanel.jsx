import { ResponsiveContainer, LineChart, Line, ReferenceLine, YAxis } from "recharts";

function StatTile({ label, value, sub, tone = "neutral" }) {
  const toneClass =
    tone === "bull" ? "text-bull" : tone === "bear" ? "text-bear" : "text-ink-100";
  return (
    <div className="rounded-lg border border-base-600 bg-base-900 px-3 py-2">
      <div className="text-[11px] text-ink-500 font-mono uppercase tracking-wide">{label}</div>
      <div className={`text-lg font-mono font-semibold tabular-nums ${toneClass}`}>{value}</div>
      {sub && <div className="text-[11px] text-ink-500">{sub}</div>}
    </div>
  );
}

export default function IndicatorPanel({ rsiSeries, latest }) {
  const latestRsi = latest?.rsi ?? null;
  const rsiTone = latestRsi > 70 ? "bear" : latestRsi < 30 ? "bull" : "neutral";
  const rsiRead = latestRsi > 70 ? "Overbought" : latestRsi < 30 ? "Oversold" : "Neutral zone";

  return (
    <div className="rounded-xl border border-base-600 bg-base-800 p-4 space-y-4">
      <h2 className="text-sm font-semibold text-ink-100">Indicators</h2>

      <div>
        <div className="flex items-baseline justify-between mb-1">
          <span className="text-[11px] text-ink-500 font-mono uppercase tracking-wide">RSI (14)</span>
          <span className={`text-xs font-mono ${rsiTone === "bull" ? "text-bull" : rsiTone === "bear" ? "text-bear" : "text-ink-500"}`}>
            {rsiRead}
          </span>
        </div>
        <div className="h-16">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={rsiSeries} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
              <YAxis domain={[0, 100]} hide />
              <ReferenceLine y={70} stroke="#3A4552" strokeDasharray="3 3" />
              <ReferenceLine y={30} stroke="#3A4552" strokeDasharray="3 3" />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#E0A339"
                strokeWidth={1.5}
                dot={false}
                isAnimationActive={false}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <StatTile label="RSI" value={latestRsi != null ? latestRsi.toFixed(1) : "—"} tone={rsiTone} />
        <StatTile
          label="15D Momentum"
          value={latest ? `${latest.momentum > 0 ? "+" : ""}${latest.momentum}%` : "—"}
          tone={latest?.momentum > 0 ? "bull" : latest?.momentum < 0 ? "bear" : "neutral"}
        />
        <StatTile label="SMA 20" value={latest?.sma20 ? `$${latest.sma20.toFixed(2)}` : "—"} />
        <StatTile label="SMA 50" value={latest?.sma50 ? `$${latest.sma50.toFixed(2)}` : "—"} />
      </div>
    </div>
  );
}
