import { useEffect, useRef, useState } from "react";
import { searchSymbols } from "../api/stockApi";
import { useDebounce } from "../hooks/useDebounce";

export default function SymbolSearch({ selectedSymbol, onSelect }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);
  const debouncedQuery = useDebounce(query, 150);

  useEffect(() => {
    let cancelled = false;
    searchSymbols(debouncedQuery).then((res) => {
      if (!cancelled) {
        setResults(res);
        setActiveIndex(0);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function pick(item) {
    onSelect(item.symbol);
    setQuery("");
    setOpen(false);
  }

  function handleKeyDown(e) {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[activeIndex]) {
      pick(results[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={containerRef} className="relative w-full sm:w-80">
      <label htmlFor="symbol-search" className="sr-only">
        Search a stock symbol
      </label>
      <div className="flex items-center gap-2 rounded-lg border border-base-600 bg-base-800 px-3 py-2 focus-within:border-signal transition-colors">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          className="shrink-0 text-ink-500"
        >
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          id="symbol-search"
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={selectedSymbol ? `${selectedSymbol} — search another symbol` : "Search symbol or company"}
          className="w-full bg-transparent text-sm text-ink-100 placeholder:text-ink-500 outline-none font-mono tracking-wide"
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-controls="symbol-search-listbox"
        />
      </div>

      {open && results.length > 0 && (
        <ul
          id="symbol-search-listbox"
          role="listbox"
          className="absolute z-20 mt-1 w-full max-h-72 overflow-y-auto rounded-lg border border-base-600 bg-base-800 shadow-xl shadow-black/40"
        >
          {results.map((item, i) => (
            <li
              key={item.symbol}
              role="option"
              aria-selected={i === activeIndex}
              onMouseEnter={() => setActiveIndex(i)}
              onClick={() => pick(item)}
              className={`flex items-center justify-between px-3 py-2 cursor-pointer text-sm ${
                i === activeIndex ? "bg-base-700" : ""
              } ${item.symbol === selectedSymbol ? "text-signal" : "text-ink-100"}`}
            >
              <span className="font-mono font-semibold tracking-wide">{item.symbol}</span>
              <span className="text-ink-500 truncate ml-3">{item.name}</span>
            </li>
          ))}
        </ul>
      )}

      {open && debouncedQuery && results.length === 0 && (
        <div className="absolute z-20 mt-1 w-full rounded-lg border border-base-600 bg-base-800 px-3 py-3 text-sm text-ink-500">
          No symbols match "{debouncedQuery}".
        </div>
      )}
    </div>
  );
}
