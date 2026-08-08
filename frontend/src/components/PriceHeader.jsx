export default function PriceHeader({ symbol, name, latestPoint, prevClose, loading }) {
  if (loading || !latestPoint) {
    return <div className="h-10 w-40 rounded bg-base-700 animate-pulse" />;
  }

  const change = latestPoint.close - prevClose;
  const pct = (change / prevClose) * 100;
  const up = change >= 0;

  return (
    <div>
      <div className="flex items-baseline gap-2">
        <h1 className="text-2xl font-mono font-semibold text-ink-100 tabular-nums">
          {symbol}
        </h1>
        <span className="text-sm text-ink-500 truncate">{name}</span>
      </div>
      <div className="flex items-baseline gap-3 mt-0.5">
        <span className="text-3xl font-mono font-semibold text-ink-100 tabular-nums">
          ${latestPoint.close.toFixed(2)}
        </span>
        <span
          className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-mono font-semibold ${
            up ? "bg-bull-soft text-bull" : "bg-bear-soft text-bear"
          }`}
        >
          {up ? "▲" : "▼"} {up ? "+" : ""}
          {change.toFixed(2)} ({up ? "+" : ""}
          {pct.toFixed(2)}%)
        </span>
      </div>
    </div>
  );
}
