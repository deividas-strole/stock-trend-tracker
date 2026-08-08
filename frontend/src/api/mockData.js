// Deterministic mock market data.
// Every function here is written so the ONLY thing that needs to change
// when the real Spring Boot API exists is stockApi.js — this file can be
// deleted once /api/symbols, /api/prices, /api/signal are live.

export const SYMBOLS = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "MSFT", name: "Microsoft Corporation" },
  { symbol: "GOOGL", name: "Alphabet Inc." },
  { symbol: "AMZN", name: "Amazon.com Inc." },
  { symbol: "NVDA", name: "NVIDIA Corporation" },
  { symbol: "TSLA", name: "Tesla Inc." },
  { symbol: "META", name: "Meta Platforms Inc." },
  { symbol: "NFLX", name: "Netflix Inc." },
  { symbol: "JPM", name: "JPMorgan Chase & Co." },
  { symbol: "DIS", name: "The Walt Disney Company" },
];

// small seeded RNG so the same symbol always renders the same "history"
function seedFromString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(31, h) + str.charCodeAt(i);
  }
  return h >>> 0;
}

function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const BASE_PRICE = {
  AAPL: 210, MSFT: 425, GOOGL: 178, AMZN: 195, NVDA: 128,
  TSLA: 245, META: 590, NFLX: 680, JPM: 215, DIS: 112,
};

export function generatePriceHistory(symbol, days = 180) {
  const rand = mulberry32(seedFromString(symbol));
  let price = BASE_PRICE[symbol] ?? 150;
  // give each symbol a mild drift bias so trends look real
  const drift = (rand() - 0.45) * 0.06;

  const data = [];
  const today = new Date();
  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    const noise = (rand() - 0.5) * 0.028;
    const change = drift + noise;
    price = Math.max(1, price * (1 + change));

    const open = price * (1 + (rand() - 0.5) * 0.01);
    const close = price;
    const high = Math.max(open, close) * (1 + rand() * 0.01);
    const low = Math.min(open, close) * (1 - rand() * 0.01);
    const volume = Math.round(3_000_000 + rand() * 9_000_000);

    data.push({
      date: date.toISOString().slice(0, 10),
      open: +open.toFixed(2),
      high: +high.toFixed(2),
      low: +low.toFixed(2),
      close: +close.toFixed(2),
      volume,
    });
  }
  return data;
}

// --- Technical indicators -------------------------------------------------

export function sma(data, period, key = "close") {
  return data.map((point, i) => {
    if (i < period - 1) return { date: point.date, value: null };
    const slice = data.slice(i - period + 1, i + 1);
    const avg = slice.reduce((sum, p) => sum + p[key], 0) / period;
    return { date: point.date, value: +avg.toFixed(2) };
  });
}

export function ema(data, period, key = "close") {
  const k = 2 / (period + 1);
  let prevEma = null;
  return data.map((point, i) => {
    if (i < period - 1) return { date: point.date, value: null };
    if (prevEma === null) {
      const slice = data.slice(0, period);
      prevEma = slice.reduce((sum, p) => sum + p[key], 0) / period;
    } else {
      prevEma = point[key] * k + prevEma * (1 - k);
    }
    return { date: point.date, value: +prevEma.toFixed(2) };
  });
}

export function rsi(data, period = 14, key = "close") {
  const out = data.map(() => ({ value: null }));
  let gains = 0;
  let losses = 0;
  for (let i = 1; i < data.length; i++) {
    const change = data[i][key] - data[i - 1][key];
    const gain = Math.max(change, 0);
    const loss = Math.max(-change, 0);

    if (i <= period) {
      gains += gain;
      losses += loss;
      if (i === period) {
        const avgGain = gains / period;
        const avgLoss = losses / period;
        const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
        out[i].value = +(100 - 100 / (1 + rs)).toFixed(2);
        out[i]._avgGain = avgGain;
        out[i]._avgLoss = avgLoss;
      }
      continue;
    }

    const prev = out[i - 1];
    const avgGain = (prev._avgGain * (period - 1) + gain) / period;
    const avgLoss = (prev._avgLoss * (period - 1) + loss) / period;
    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    out[i].value = +(100 - 100 / (1 + rs)).toFixed(2);
    out[i]._avgGain = avgGain;
    out[i]._avgLoss = avgLoss;
  }
  return out.map((p, i) => ({ date: data[i].date, value: p.value }));
}

// --- Mock "AI" trend signal -------------------------------------------------
// Stand-in for the real trend/estimate service. Combines short vs long SMA
// slope with the latest RSI reading into a trend label + confidence score.
// Replace this with a call to the backend's /api/signal/{symbol} endpoint.
export function deriveTrendSignal(priceData) {
  const closes = priceData.map((p) => p.close);
  const sma20 = sma(priceData, 20).at(-1)?.value;
  const sma50 = sma(priceData, 50).at(-1)?.value;
  const latestRsi = rsi(priceData, 14).at(-1)?.value ?? 50;
  const last = closes.at(-1);
  const prior = closes.at(-15) ?? closes[0];
  const momentum = (last - prior) / prior;

  let score = 0;
  if (sma20 && sma50) score += sma20 > sma50 ? 1 : -1;
  score += momentum > 0.01 ? 1 : momentum < -0.01 ? -1 : 0;
  score += latestRsi > 55 ? 1 : latestRsi < 45 ? -1 : 0;

  let trend = "Neutral";
  if (score >= 2) trend = "Bullish";
  else if (score <= -2) trend = "Bearish";

  const confidence = Math.min(97, Math.max(38, 55 + score * 14 + Math.abs(momentum) * 300));

  return {
    trend,
    confidence: Math.round(confidence),
    rsi: latestRsi,
    momentum: +(momentum * 100).toFixed(2),
    sma20,
    sma50,
    asOf: priceData.at(-1)?.date,
  };
}
