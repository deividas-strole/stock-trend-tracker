const RANGES = ["1M", "3M", "6M", "1Y"];

export default function TimeframeSelector({ value, onChange }) {
  return (
    <div className="inline-flex rounded-lg border border-base-600 bg-base-800 p-0.5" role="tablist" aria-label="Price history timeframe">
      {RANGES.map((r) => (
        <button
          key={r}
          role="tab"
          aria-selected={value === r}
          onClick={() => onChange(r)}
          className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-md transition-colors ${
            value === r
              ? "bg-signal text-base-950"
              : "text-ink-500 hover:text-ink-100"
          }`}
        >
          {r}
        </button>
      ))}
    </div>
  );
}
