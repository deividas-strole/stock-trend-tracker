# Stock Trend Tracker — Frontend Dashboard

React + Vite dashboard for the Stock Trend Tracker project. Implements the
user-facing dashboard described in the ticket: symbol search, price history
chart with indicator overlays, and the AI trend signal + confidence score,
all on one responsive screen.

## Stack

- React 19 + Vite
- Tailwind CSS
- Recharts (price chart, RSI mini chart)

## Getting started

```bash
cd frontend
npm install
npm run dev
```

## What's implemented

- **Symbol search/selection** — `src/components/SymbolSearch.jsx`. Debounced,
  keyboard-navigable combobox over a small symbol list (`src/api/mockData.js`).
- **Price history chart** — `src/components/PriceChart.jsx`, built with
  Recharts. Includes a 1M/3M/6M/1Y range selector.
- **Indicator overlays** — SMA 20, SMA 50, and EMA 12 toggle on/off directly
  on the price chart; RSI(14) is plotted separately in
  `src/components/IndicatorPanel.jsx` with overbought/oversold reference lines.
- **AI trend signal + confidence** — `src/components/SignalCard.jsx` shows
  the trend label (Bullish / Bearish / Neutral) and a confidence-score arc
  gauge, plus the inputs that produced it.
- **Responsive layout** — single column on mobile, chart + sidebar on
  desktop (`src/App.jsx`).

## Connecting the real backend

Right now all data comes from `src/api/mockData.js`, a deterministic mock
generator, wrapped by `src/api/stockApi.js`. That wrapper is the only file
that needs to change once the Spring Boot API exists:

```js
// src/api/stockApi.js — replace the mock calls with real fetches, e.g.
export async function getPriceHistory(symbol, range) {
  const res = await fetch(`/api/prices/${symbol}?range=${range}`);
  return res.json();
}

export async function getTrendSignal(symbol) {
  const res = await fetch(`/api/signal/${symbol}`);
  return res.json();
}
```

Every component consumes data through this file (or the indicator math in
`mockData.js`, which can stay client-side even after the backend ships if
you'd rather compute SMA/EMA/RSI in the browser). No component needs to
change.

## Indicator math

`src/api/mockData.js` also contains plain-JS implementations of SMA, EMA,
and RSI(14) used to draw the overlays — useful as a reference or a fallback
if the backend doesn't expose pre-computed indicators.
