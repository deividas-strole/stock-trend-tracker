import { useEffect, useMemo, useState } from "react";
import SymbolSearch from "./components/SymbolSearch";
import TimeframeSelector from "./components/TimeframeSelector";
import PriceHeader from "./components/PriceHeader";
import PriceChart from "./components/PriceChart";
import IndicatorPanel from "./components/IndicatorPanel";
import SignalCard from "./components/SignalCard";
import { getPriceHistory, getTrendSignal } from "./api/stockApi";
import { sma, ema, rsi } from "./api/mockData";

const DEFAULT_SYMBOL = "AAPL";
const DEFAULT_OVERLAYS = ["sma20", "sma50"];

export default function App() {
  const [symbol, setSymbol] = useState(DEFAULT_SYMBOL);
  const [range, setRange] = useState("6M");
  const [priceHistory, setPriceHistory] = useState([]);
  const [signal, setSignal] = useState(null);
  const [activeOverlays, setActiveOverlays] = useState(DEFAULT_OVERLAYS);
  const [loadingPrice, setLoadingPrice] = useState(true);
  const [loadingSignal, setLoadingSignal] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoadingPrice(true);
    setLoadingSignal(true);
    setError(null);

    getPriceHistory(symbol, range)
      .then((history) => {
        if (cancelled) return;
        setPriceHistory(history);
        setLoadingPrice(false);
        return getTrendSignal(symbol, history);
      })
      .then((sig) => {
        if (cancelled || !sig) return;
        setSignal(sig);
        setLoadingSignal(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError("Couldn't load data for this symbol. Try another one.");
        setLoadingPrice(false);
        setLoadingSignal(false);
      });

    return () => {
      cancelled = true;
    };
  }, [symbol, range]);

  const chartData = useMemo(() => {
    if (!priceHistory.length) return [];
    const sma20 = sma(priceHistory, 20);
    const sma50 = sma(priceHistory, 50);
    const ema12 = ema(priceHistory, 12);
    return priceHistory.map((point, i) => ({
      date: point.date,
      close: point.close,
      sma20: sma20[i]?.value ?? null,
      sma50: sma50[i]?.value ?? null,
      ema12: ema12[i]?.value ?? null,
    }));
  }, [priceHistory]);

  const rsiSeries = useMemo(() => {
    if (!priceHistory.length) return [];
    return rsi(priceHistory, 14);
  }, [priceHistory]);

  function toggleOverlay(key) {
    setActiveOverlays((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }

  const latestPoint = priceHistory.at(-1);
  const prevClose = priceHistory.at(-2)?.close ?? latestPoint?.close;
  const symbolName =
    signal && priceHistory.length ? undefined : undefined;

  return (
    <div className="min-h-screen bg-base-950 text-ink-100">
      <header className="border-b border-base-600 bg-base-900/80 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-signal flex items-center justify-center text-base-950 font-mono font-bold text-sm">
              S
            </div>
            <span className="font-semibold tracking-tight">Stock Trend Tracker</span>
          </div>
          <SymbolSearch selectedSymbol={symbol} onSelect={setSymbol} />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-6 space-y-6">
        {error && (
          <div className="rounded-lg border border-bear bg-bear-soft text-bear text-sm px-4 py-3">
            {error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <PriceHeader
            symbol={symbol}
            name={SYMBOL_NAMES[symbol]}
            latestPoint={latestPoint}
            prevClose={prevClose}
            loading={loadingPrice}
          />
          <TimeframeSelector value={range} onChange={setRange} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 items-start">
          <div className="space-y-4">
            <PriceChart
              chartData={chartData}
              activeOverlays={activeOverlays}
              onToggleOverlay={toggleOverlay}
              loading={loadingPrice}
            />
            <IndicatorPanel rsiSeries={rsiSeries} latest={signal} />
          </div>

          <div className="space-y-4">
            <SignalCard signal={signal} symbol={symbol} loading={loadingSignal} />
          </div>
        </div>

        <footer className="text-[11px] text-ink-500 text-center pt-4 pb-8">
          Prices and signals shown are simulated placeholder data for development.
          Not financial advice.
        </footer>
      </main>
    </div>
  );
}

const SYMBOL_NAMES = {
  AAPL: "Apple Inc.",
  MSFT: "Microsoft Corporation",
  GOOGL: "Alphabet Inc.",
  AMZN: "Amazon.com Inc.",
  NVDA: "NVIDIA Corporation",
  TSLA: "Tesla Inc.",
  META: "Meta Platforms Inc.",
  NFLX: "Netflix Inc.",
  JPM: "JPMorgan Chase & Co.",
  DIS: "The Walt Disney Company",
};
