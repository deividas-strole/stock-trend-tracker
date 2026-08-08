// Thin API layer. Every function returns a Promise so swapping the mock
// implementation below for real `fetch("/api/...")` calls against the
// Spring Boot backend later doesn't require touching any component.

import { SYMBOLS, generatePriceHistory, deriveTrendSignal } from "./mockData";

const LATENCY_MS = 250;

function delay(value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), LATENCY_MS));
}

export async function searchSymbols(query) {
  const q = query.trim().toUpperCase();
  if (!q) return delay(SYMBOLS);
  return delay(
    SYMBOLS.filter(
      (s) => s.symbol.includes(q) || s.name.toUpperCase().includes(q)
    )
  );
}

export async function getPriceHistory(symbol, range = "6M") {
  const daysByRange = { "1M": 30, "3M": 90, "6M": 180, "1Y": 365 };
  const days = daysByRange[range] ?? 180;
  const full = generatePriceHistory(symbol, 400); // generate extra so indicators have warm-up room
  const sliced = full.slice(-days);
  return delay(sliced);
}

export async function getTrendSignal(symbol, priceHistory) {
  // In production this hits POST /api/signal with the symbol (or the
  // backend just looks up its own stored history) and returns the
  // model's trend + confidence. Here we derive it client-side from the
  // same mock series so the UI has something real to react to.
  return delay(deriveTrendSignal(priceHistory));
}
