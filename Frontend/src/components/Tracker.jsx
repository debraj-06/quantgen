
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  Minus,
  Newspaper,
  BrainCircuit,
  ShieldCheck,
  RefreshCw,
  Search,
} from "lucide-react";

import {
  analyzeTracker,
  searchStocks,
} from "../services/marketApi";

function formatMoney(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

// Handles common search response formats from different providers.
function getStockDetails(stock) {
  if (typeof stock === "string") {
    return {
      symbol: stock,
      name: stock,
      exchange: "",
    };
  }

  const symbol =
    stock?.symbol ||
    stock?.ticker ||
    stock?.stock_symbol ||
    "";

  const name =
    stock?.shortname ||
    stock?.shortName ||
    stock?.longname ||
    stock?.longName ||
    stock?.name ||
    symbol;

  return {
    symbol: String(symbol).toUpperCase(),
    name: String(name || symbol),
    exchange: stock?.exchange || stock?.exchDisp || "",
  };
}

function Tracker() {
  const [holdings, setHoldings] = useState([
    {
      id: 1,
      symbol: "",
      purchase_date: "",
      purchase_time: "",
      invested_amount: "",
    },
  ]);

  const [activeSearchId, setActiveSearchId] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const activeHolding = useMemo(
    () => holdings.find((item) => item.id === activeSearchId),
    [holdings, activeSearchId]
  );

  const searchQuery = activeHolding?.symbol?.trim() || "";

  // Search stocks as the user types.
  useEffect(() => {
    if (!activeSearchId || searchQuery.length < 2) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    let cancelled = false;

    const timer = setTimeout(async () => {
      try {
        setSearchLoading(true);

        const results = await searchStocks(searchQuery);

        if (!cancelled) {
          setSearchResults(
            Array.isArray(results) ? results : []
          );
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Stock search failed:", err);
          setSearchResults([]);
        }
      } finally {
        if (!cancelled) {
          setSearchLoading(false);
        }
      }
    }, 350);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [activeSearchId, searchQuery]);

  const addHolding = () => {
    setHoldings((previous) => [
      ...previous,
      {
        id: Date.now(),
        symbol: "",
        purchase_date: "",
        purchase_time: "",
        invested_amount: "",
      },
    ]);

    setResult(null);
    setError("");
  };

  const removeHolding = (id) => {
    setHoldings((previous) =>
      previous.filter((item) => item.id !== id)
    );

    if (activeSearchId === id) {
      setActiveSearchId(null);
      setSearchResults([]);
    }

    setResult(null);
  };

  const updateHolding = (id, field, value) => {
    setHoldings((previous) =>
      previous.map((item) =>
        item.id === id
          ? { ...item, [field]: value }
          : item
      )
    );

    setResult(null);
  };

  const selectStock = (holdingId, stock) => {
    const details = getStockDetails(stock);

    if (!details.symbol) return;

    updateHolding(
      holdingId,
      "symbol",
      details.symbol
    );

    setActiveSearchId(null);
    setSearchResults([]);
  };

  const handleAnalyze = async () => {
    setError("");
    setResult(null);

    const validHoldings = holdings.map((item) => ({
      symbol: item.symbol.trim().toUpperCase(),
      purchase_date: item.purchase_date,
      purchase_time: item.purchase_time,
      invested_amount: Number(item.invested_amount),
    }));

    const invalid = validHoldings.some(
      (item) =>
        !item.symbol ||
        !item.purchase_date ||
        !item.purchase_time ||
        !Number.isFinite(item.invested_amount) ||
        item.invested_amount <= 0
    );

    if (invalid) {
      setError(
        "Please select a stock and enter its purchase date, purchase time, and a valid investment amount for every holding."
      );
      return;
    }

    setLoading(true);

    try {
      const data = await analyzeTracker(validHoldings);
      setResult(data);
    } catch (err) {
      setError(
        err.message || "Unable to analyze your portfolio."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="tracker"
      className="border-t border-white/[0.06] bg-[#07100d]"
    >
      <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        {/* HEADER */}
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">
              <Activity size={15} />
              Portfolio Tracker
            </div>

            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              Track your investments.
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">
              Add your stock investments and get model-based
              BUY, HOLD, or SELL suggestions using market data,
              technical indicators, and available news sentiment.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/[0.06] px-4 py-2 text-xs text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-300" />
            AI analysis
          </div>
        </div>

        {/* INPUT + RESULTS */}
        <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          {/* INPUT PANEL */}
          <div className="rounded-3xl border border-white/[0.07] bg-[#0b1713] p-5 sm:p-7">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-xl font-bold">
                  Your holdings
                </h3>

                <p className="mt-1 text-xs text-white/35">
                  Enter your purchase details.
                </p>
              </div>

              <div className="rounded-xl bg-emerald-300/10 p-3 text-emerald-300">
                <Activity size={19} />
              </div>
            </div>

            <div className="mt-7 space-y-4">
              {holdings.map((holding, index) => (
                <div
                  key={holding.id}
                  className="relative rounded-2xl border border-white/[0.07] bg-[#07110d] p-4"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                      Stock {index + 1}
                    </span>

                    {holdings.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeHolding(holding.id)}
                        className="rounded-lg p-2 text-white/35 transition hover:bg-red-400/10 hover:text-red-300"
                        aria-label="Remove holding"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* STOCK SEARCH */}
                    <div className="relative sm:col-span-2">
                      <label className="mb-2 block text-xs text-white/45">
                        Stock name or symbol
                      </label>

                      <div className="relative">
                        <input
                          type="text"
                          autoComplete="off"
                          value={holding.symbol}
                          onFocus={() => {
                            setActiveSearchId(holding.id);
                          }}
                          onChange={(event) => {
                            updateHolding(
                              holding.id,
                              "symbol",
                              event.target.value
                            );
                            setActiveSearchId(holding.id);
                          }}
                          onKeyDown={(event) => {
                            if (event.key === "Escape") {
                              setActiveSearchId(null);
                              setSearchResults([]);
                            }

                            if (
                              event.key === "Enter" &&
                              searchResults.length > 0
                            ) {
                              event.preventDefault();
                              selectStock(
                                holding.id,
                                searchResults[0]
                              );
                            }
                          }}
                          placeholder="Search company name or symbol..."
                          className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 pr-11 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-emerald-300/50"
                        />

                        <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/35">
                          {searchLoading ? (
                            <RefreshCw
                              size={16}
                              className="animate-spin"
                            />
                          ) : (
                            <Search size={16} />
                          )}
                        </div>
                      </div>

                      {/* SEARCH DROPDOWN */}
                      {activeSearchId === holding.id &&
                        searchQuery.length >= 2 && (
                          <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-64 overflow-y-auto rounded-xl border border-emerald-300/20 bg-[#102019] shadow-2xl">
                            {searchLoading && (
                              <div className="px-4 py-3 text-xs text-white/45">
                                Searching stocks...
                              </div>
                            )}

                            {!searchLoading &&
                              searchResults.length > 0 && (
                                <div className="py-1">
                                  {searchResults.map((stock, stockIndex) => {
                                    const details =
                                      getStockDetails(stock);

                                    if (!details.symbol) return null;

                                    return (
                                      <button
                                        key={`${details.symbol}-${stockIndex}`}
                                        type="button"
                                        onMouseDown={(event) => {
                                          event.preventDefault();
                                          selectStock(
                                            holding.id,
                                            stock
                                          );
                                        }}
                                        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-emerald-300/10"
                                      >
                                        <div className="min-w-0">
                                          <p className="truncate text-sm font-semibold text-white">
                                            {details.name}
                                          </p>
                                          <p className="mt-1 text-[10px] text-white/40">
                                            {details.symbol}
                                          </p>
                                        </div>

                                        {details.exchange && (
                                          <span className="shrink-0 rounded-md bg-white/[0.06] px-2 py-1 text-[9px] text-white/45">
                                            {details.exchange}
                                          </span>
                                        )}
                                      </button>
                                    );
                                  })}
                                </div>
                              )}

                            {!searchLoading &&
                              searchResults.length === 0 && (
                                <div className="px-4 py-3 text-xs text-white/45">
                                  No matching stocks found.
                                </div>
                              )}
                          </div>
                        )}

                      <p className="mt-2 text-[10px] text-white/25">
                        Type at least 2 letters and select a result.
                        NSE symbols usually end in .NS.
                      </p>
                    </div>

                    {/* PURCHASE DATE */}
                    <div>
                      <label className="mb-2 block text-xs text-white/45">
                        Purchase date
                      </label>

                      <input
                        type="date"
                        value={holding.purchase_date}
                        max={new Date().toISOString().slice(0, 10)}
                        onChange={(event) =>
                          updateHolding(
                            holding.id,
                            "purchase_date",
                            event.target.value
                          )
                        }
                        className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-3 text-sm text-white outline-none focus:border-emerald-300/50"
                      />
                    </div>

                    {/* PURCHASE TIME */}
                    <div>
                      <label className="mb-2 block text-xs text-white/45">
                        Purchase time (IST)
                      </label>

                      <input
                        type="time"
                        value={holding.purchase_time}
                        onChange={(event) =>
                          updateHolding(
                            holding.id,
                            "purchase_time",
                            event.target.value
                          )
                        }
                        className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-3 text-sm text-white outline-none focus:border-emerald-300/50"
                      />

                      <p className="mt-1 text-[10px] text-white/25">
                        Enter the time in Indian market time.
                      </p>
                    </div>

                    {/* INVESTMENT */}
                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-xs text-white/45">
                        Amount invested (₹)
                      </label>

                      <input
                        type="number"
                        min="1"
                        value={holding.invested_amount}
                        onChange={(event) =>
                          updateHolding(
                            holding.id,
                            "invested_amount",
                            event.target.value
                          )
                        }
                        placeholder="50000"
                        className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-emerald-300/50"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addHolding}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-emerald-300/30 py-3 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-300/[0.06]"
            >
              <Plus size={16} />
              Add another stock
            </button>

            {error && (
              <div className="mt-5 rounded-xl border border-red-400/20 bg-red-400/[0.06] p-3 text-xs leading-5 text-red-300">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={handleAnalyze}
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-300 px-5 py-4 text-sm font-bold text-[#07100d] transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw size={17} className="animate-spin" />
                  Analyzing your holdings...
                </>
              ) : (
                <>
                  <BrainCircuit size={17} />
                  Analyze My Portfolio
                </>
              )}
            </button>

            <p className="mt-3 text-center text-[10px] text-white/25">
              Prices depend on the latest market data available from
              the provider.
            </p>
          </div>

          {/* RESULTS PANEL */}
          <div className="rounded-3xl border border-white/[0.07] bg-[#0b1713] p-5 sm:p-7">
            {!result && !loading && (
              <div className="flex min-h-[450px] flex-col items-center justify-center text-center">
                <div className="rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.06] p-5 text-emerald-300">
                  <BrainCircuit size={30} />
                </div>

                <h3 className="mt-5 font-display text-xl font-bold">
                  Your analysis will appear here
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-white/35">
                  Add your stocks and purchase details, then run the
                  analysis to see current values and recommendations.
                </p>
              </div>
            )}

            {loading && (
              <div className="flex min-h-[450px] flex-col items-center justify-center text-center">
                <RefreshCw
                  size={30}
                  className="animate-spin text-emerald-300"
                />

                <h3 className="mt-5 font-display text-xl font-bold">
                  Analyzing your portfolio
                </h3>

                <p className="mt-2 text-sm text-white/35">
                  Fetching market data, indicators, and available news.
                </p>
              </div>
            )}

            {result && (
              <div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
                    Analysis overview
                  </div>

                  <h3 className="mt-2 font-display text-2xl font-extrabold">
                    Your portfolio report
                  </h3>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <SummaryCard
                    label="Total invested"
                    value={formatMoney(result.total_invested)}
                  />

                  <SummaryCard
                    label="Current value"
                    value={formatMoney(result.total_current_value)}
                  />

                  <SummaryCard
                    label="Profit / Loss"
                    value={formatMoney(result.total_profit_loss)}
                    positive={Number(result.total_profit_loss) >= 0}
                  />
                </div>

                <div className="mt-7 space-y-4">
                  {(result.holdings || []).map((item, index) => (
                    <HoldingCard
                      key={`${item.symbol}-${index}`}
                      item={item}
                    />
                  ))}
                </div>

                {result.errors?.length > 0 && (
                  <div className="mt-5 rounded-xl border border-yellow-300/20 bg-yellow-300/[0.05] p-4">
                    <p className="text-xs font-bold text-yellow-200">
                      Some stocks could not be analyzed
                    </p>

                    {result.errors.map((item, index) => (
                      <p
                        key={index}
                        className="mt-2 text-xs text-white/45"
                      >
                        {item.symbol}: {item.error}
                      </p>
                    ))}
                  </div>
                )}

                <p className="mt-6 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-[11px] leading-5 text-white/35">
                  These are model-based estimates, not guaranteed
                  returns or personalized financial advice. Verify
                  prices and market conditions before making
                  investment decisions.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function SummaryCard({ label, value, positive }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#07110d] p-4">
      <p className="text-[10px] uppercase tracking-wider text-white/35">
        {label}
      </p>

      <p
        className={`mt-2 break-words font-display text-lg font-extrabold ${
          positive === undefined
            ? "text-white"
            : positive
            ? "text-emerald-300"
            : "text-red-300"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function HoldingCard({ item }) {
  const recommendation = item.recommendation || {};
  const signal = recommendation.signal || "HOLD";

  const signalStyle = {
    BUY: "border-emerald-300/20 bg-emerald-300/10 text-emerald-300",
    HOLD: "border-yellow-300/20 bg-yellow-300/10 text-yellow-200",
    SELL: "border-red-300/20 bg-red-300/10 text-red-300",
  };

  const SignalIcon =
    signal === "BUY"
      ? TrendingUp
      : signal === "SELL"
      ? TrendingDown
      : Minus;

  const technical = item.technical_indicators || {};
  const additional = item.additional_investment || {};
  const news = item.news || {};
  const articles = Array.isArray(news.articles)
    ? news.articles
    : [];

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[#07110d] p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="font-display text-lg font-bold">
            {item.symbol}
          </h4>

          <p className="mt-1 text-[10px] text-white/30">
            Purchase date: {item.matched_purchase_date || "—"}
            {item.matched_purchase_time
              ? ` at ${item.matched_purchase_time}`
              : ""}
          </p>
        </div>

        <div
          className={`flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold ${
            signalStyle[signal] || signalStyle.HOLD
          }`}
        >
          <SignalIcon size={14} />
          {signal}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Metric
          label="Invested"
          value={formatMoney(item.invested_amount)}
        />

        <Metric
          label="Current value"
          value={formatMoney(item.current_value)}
        />

        <Metric
          label="Profit / Loss"
          value={`${formatMoney(item.profit_loss)} (${item.profit_loss_percent ?? 0}%)`}
          color={
            Number(item.profit_loss) >= 0
              ? "text-emerald-300"
              : "text-red-300"
          }
        />

        <Metric
          label="Estimated shares"
          value={item.estimated_shares ?? "—"}
        />

        <Metric
          label="Current price"
          value={formatMoney(item.current_price)}
        />

        <Metric
          label="Predicted 3-day return"
          value={`${Number(item.predicted_return_percent) > 0 ? "+" : ""}${item.predicted_return_percent ?? 0}%`}
          color={
            Number(item.predicted_return_percent) >= 0
              ? "text-emerald-300"
              : "text-red-300"
          }
        />
      </div>

      <div className="mt-5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
          <BrainCircuit size={14} />
          Model and technical analysis
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <Metric
            label="RSI"
            value={technical.rsi ?? "—"}
          />

          <Metric
            label="Volatility"
            value={
              item.recent_volatility_percent != null
                ? `${item.recent_volatility_percent}%`
                : "—"
            }
          />

          <Metric
            label="Model agreement"
            value={
              item.model_agreement_percent != null
                ? `${item.model_agreement_percent}%`
                : "—"
            }
          />
        </div>

        <div className="mt-3 text-[10px] leading-5 text-white/30">
          Model agreement measures how closely the regression models
          agree with one another. It is not a probability of profit.
        </div>
      </div>

      <div className="mt-5">
        <p className="text-xs font-bold text-white/65">
          Why this recommendation?
        </p>

        <ul className="mt-3 space-y-2">
          {(recommendation.reasons || []).map((reason, index) => (
            <li
              key={index}
              className="flex gap-2 text-xs leading-5 text-white/40"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-300" />
              {reason}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 rounded-xl border border-emerald-300/15 bg-emerald-300/[0.04] p-4">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
          <ShieldCheck size={14} />
          Additional investment suggestion
        </div>

        {additional.suggested ? (
          <>
            <p className="mt-3 font-display text-xl font-extrabold text-emerald-300">
              {formatMoney(additional.suggested_amount)}
            </p>

            <p className="mt-2 text-xs leading-5 text-white/40">
              {additional.reason}
            </p>
          </>
        ) : (
          <p className="mt-3 text-xs leading-5 text-white/40">
            {additional.reason ||
              "No additional investment is suggested by the current rules."}
          </p>
        )}
      </div>

      <div className="mt-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-bold text-white/70">
            <Newspaper size={14} className="text-emerald-300" />
            Recent stock news
          </div>

          <span className="text-[10px] text-white/35">
            Sentiment: {news.label || "Unavailable"}
          </span>
        </div>

        {articles.length > 0 ? (
          <div className="mt-3 space-y-3">
            {articles.slice(0, 4).map((article, index) => (
              <div
                key={index}
                className="border-b border-white/[0.05] pb-3 last:border-0"
              >
                {article.url ? (
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs leading-5 text-white/60 transition hover:text-emerald-300"
                  >
                    {article.title || "Read news article"}
                  </a>
                ) : (
                  <p className="text-xs leading-5 text-white/60">
                    {article.title || "News article"}
                  </p>
                )}

                <p className="mt-1 text-[10px] text-white/25">
                  {article.publisher || ""}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-xs text-white/35">
            No recent news was available from the news provider.
          </p>
        )}
      </div>
    </div>
  );
}

function Metric({ label, value, color = "text-white" }) {
  return (
    <div className="min-w-0">
      <p className="text-[9px] uppercase tracking-wider text-white/30">
        {label}
      </p>

      <p className={`mt-1 break-words text-xs font-bold ${color}`}>
        {value}
      </p>
    </div>
  );
}

export default Tracker;
