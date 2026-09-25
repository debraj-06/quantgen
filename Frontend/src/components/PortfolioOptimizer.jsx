import { useEffect, useState } from "react";

import {
  CircleDollarSign,
  Search,
  Sparkles,
  ShieldCheck,
  LoaderCircle,
  X,
  TrendingUp,
  Activity,
  Brain,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

import {
  searchStocks,
  optimizePortfolio
} from "../services/marketApi";


const DEFAULT_STOCKS = [
  {
    symbol: "RELIANCE.NS",
    name: "Reliance Industries",
    displaySymbol: "RELIANCE"
  },
  {
    symbol: "TCS.NS",
    name: "Tata Consultancy Services",
    displaySymbol: "TCS"
  },
  {
    symbol: "INFY.NS",
    name: "Infosys",
    displaySymbol: "INFY"
  },
  {
    symbol: "HDFCBANK.NS",
    name: "HDFC Bank",
    displaySymbol: "HDFCBANK"
  },
  {
    symbol: "ICICIBANK.NS",
    name: "ICICI Bank",
    displaySymbol: "ICICIBANK"
  },
  {
    symbol: "SBIN.NS",
    name: "State Bank of India",
    displaySymbol: "SBIN"
  },
  {
    symbol: "ITC.NS",
    name: "ITC",
    displaySymbol: "ITC"
  },
  {
    symbol: "LT.NS",
    name: "Larsen & Toubro",
    displaySymbol: "LT"
  }
];


function PortfolioOptimizer() {

  // ----------------------------------------------------
  // INPUT STATE
  // ----------------------------------------------------

  const [
    investmentAmount,
    setInvestmentAmount
  ] = useState("50000");

  const [
    risk,
    setRisk
  ] = useState("medium");

  const [
    searchQuery,
    setSearchQuery
  ] = useState("");

  const [
    searchResults,
    setSearchResults
  ] = useState([]);

  const [
    selectedStocks,
    setSelectedStocks
  ] = useState([]);

  // ----------------------------------------------------
  // UI STATE
  // ----------------------------------------------------

  const [
    searching,
    setSearching
  ] = useState(false);

  const [
    running,
    setRunning
  ] = useState(false);

  const [
    result,
    setResult
  ] = useState(null);

  const [
    error,
    setError
  ] = useState("");


  // ----------------------------------------------------
  // SEARCH STOCKS
  // ----------------------------------------------------

  useEffect(() => {

    const query =
      searchQuery.trim();

    if (query.length < 2) {

      setSearchResults([]);

      return;
    }

    const timer =
      setTimeout(
        async () => {

          try {

            setSearching(true);

            setError("");

            const results =
              await searchStocks(query);

            setSearchResults(
              results || []
            );

          } catch (searchError) {

            console.error(
              searchError
            );

            setSearchResults([]);

          } finally {

            setSearching(false);
          }

        },
        350
      );

    return () =>
      clearTimeout(timer);

  }, [searchQuery]);


  // ----------------------------------------------------
  // SELECT STOCK
  // ----------------------------------------------------

  function addStock(stock) {

    const symbol =
      (
        stock.symbol ||
        ""
      ).toUpperCase();

    if (!symbol) {
      return;
    }

    const alreadySelected =
      selectedStocks.some(
        item =>
          item.symbol === symbol
      );

    if (alreadySelected) {

      setSearchQuery("");

      setSearchResults([]);

      return;
    }

    setSelectedStocks(
      current => [
        ...current,
        {
          symbol,
          name:
            stock.name ||
            stock.longname ||
            symbol,
          displaySymbol:
            getDisplaySymbol(symbol)
        }
      ]
    );

    setSearchQuery("");

    setSearchResults([]);

    setResult(null);

    setError("");
  }


  // ----------------------------------------------------
  // REMOVE STOCK
  // ----------------------------------------------------

  function removeStock(symbol) {

    setSelectedStocks(
      current =>
        current.filter(
          stock =>
            stock.symbol !== symbol
        )
    );

    setResult(null);
  }


  // ----------------------------------------------------
  // RUN OPTIMIZER
  // ----------------------------------------------------

  async function handleOptimize() {

    setError("");

    setResult(null);

    if (
      selectedStocks.length === 0
    ) {

      setError(
        "Select at least one stock."
      );

      return;
    }

    if (
      !investmentAmount ||
      Number(investmentAmount) <= 0
    ) {

      setError(
        "Enter a valid investment amount."
      );

      return;
    }

    try {

      setRunning(true);

      const symbols =
        selectedStocks.map(
          stock => stock.symbol
        );

      const data =
        await optimizePortfolio({
          symbols,
          investmentAmount,
          risk
        });

      setResult(data);

    } catch (optimizerError) {

      console.error(
        optimizerError
      );

      setError(
        optimizerError.message ||
        "Portfolio optimization failed."
      );

    } finally {

      setRunning(false);
    }
  }


  // ----------------------------------------------------
  // FORMAT MONEY
  // ----------------------------------------------------

  function formatMoney(value) {

    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2
      }
    ).format(
      Number(value || 0)
    );
  }


  return (

    <section
      id="portfolio"
      className="mx-auto max-w-7xl px-5 py-20 lg:px-8"
    >

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-10">

        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">

          <CircleDollarSign
            size={15}
          />

          Portfolio Intelligence

        </div>


        <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">

          Build your portfolio.

        </h2>


        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">

          Select the assets you want analyzed, set your
          investment amount and risk preference, then let
          the optimization engine determine the allocation.

        </p>

      </div>


      {/* =================================================
          MAIN GRID
      ================================================= */}

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">


        {/* =================================================
            LEFT — CONFIGURATION
        ================================================= */}

        <div className="rounded-3xl border border-white/[0.08] bg-[#0b1713] p-6 sm:p-8">

          <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/30">

            Configuration

          </div>


          {/* INVESTMENT */}

          <div className="mt-7">

            <label className="text-xs font-semibold text-white/50">

              Investment Amount

            </label>


            <div className="mt-2 flex items-center rounded-xl border border-white/[0.08] bg-[#09130f] px-4">

              <span className="text-white/40">

                ₹

              </span>


              <input
                type="number"
                min="1"
                value={investmentAmount}
                onChange={event =>
                  setInvestmentAmount(
                    event.target.value
                  )
                }
                className="w-full bg-transparent px-3 py-4 text-sm font-semibold text-white outline-none"
                placeholder="50000"
              />

            </div>

          </div>


          {/* RISK */}

          <div className="mt-7">

            <label className="text-xs font-semibold text-white/50">

              Risk Preference

            </label>


            <div className="mt-2 grid grid-cols-3 gap-2">

              {[
                ["low", "Low"],
                ["medium", "Medium"],
                ["high", "High"]
              ].map(
                ([value, label]) => (

                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setRisk(value);
                      setResult(null);
                    }}
                    className={`rounded-xl border px-3 py-3 text-xs font-bold transition ${
                      risk === value
                        ? "border-emerald-300/40 bg-emerald-300/10 text-emerald-300"
                        : "border-white/[0.07] bg-white/[0.015] text-white/40 hover:border-white/[0.15]"
                    }`}
                  >

                    {label}

                  </button>

                )
              )}

            </div>

          </div>


          {/* SEARCH */}

          <div className="mt-7">

            <label className="text-xs font-semibold text-white/50">

              Investment Basket

            </label>


            <div className="relative mt-2">

              <div className="flex items-center rounded-xl border border-white/[0.08] bg-[#09130f] px-4">

                <Search
                  size={17}
                  className="shrink-0 text-white/25"
                />


                <input
                  type="text"
                  value={searchQuery}
                  onChange={event =>
                    setSearchQuery(
                      event.target.value
                    )
                  }
                  placeholder="Search stocks or companies..."
                  className="w-full bg-transparent px-3 py-4 text-sm text-white outline-none placeholder:text-white/25"
                />


                {searching && (

                  <LoaderCircle
                    size={17}
                    className="animate-spin text-emerald-300"
                  />

                )}

              </div>


              {/* SEARCH RESULTS */}

              {searchQuery.length >= 2 && (

                <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0c1915] shadow-2xl">

                  {searchResults.length > 0 ? (

                    searchResults.map(
                      stock => (

                        <button
                          key={`${stock.symbol}-${stock.exchange || ""}`}
                          type="button"
                          onClick={() =>
                            addStock(stock)
                          }
                          className="flex w-full items-center justify-between border-b border-white/[0.05] px-4 py-3 text-left last:border-0 hover:bg-white/[0.04]"
                        >

                          <div>

                            <div className="text-sm font-bold text-white">

                              {stock.symbol}

                            </div>

                            <div className="mt-1 text-xs text-white/35">

                              {stock.name ||
                                stock.longname ||
                                "Stock"}

                            </div>

                          </div>


                          <div className="text-[9px] uppercase tracking-wider text-white/25">

                            {stock.exchange ||
                              stock.type ||
                              "MARKET"}

                          </div>

                        </button>

                      )
                    )

                  ) : !searching ? (

                    <div className="p-4 text-center text-xs text-white/30">

                      No matching stocks found.

                    </div>

                  ) : (

                    <div className="p-4 text-center text-xs text-white/30">

                      Searching...

                    </div>

                  )}

                </div>

              )}

            </div>


            {/* SELECTED STOCKS */}

            <div className="mt-3 min-h-[70px] rounded-xl border border-dashed border-white/[0.08] bg-white/[0.01] p-3">

              {selectedStocks.length === 0 ? (

                <div className="flex min-h-[45px] items-center justify-center text-center text-xs text-white/25">

                  Search and select the stocks you
                  want the optimizer to analyze.

                </div>

              ) : (

                <div className="flex flex-wrap gap-2">

                  {selectedStocks.map(
                    stock => (

                      <div
                        key={stock.symbol}
                        className="flex items-center gap-2 rounded-lg border border-emerald-300/15 bg-emerald-300/[0.06] px-3 py-2"
                      >

                        <div>

                          <div className="text-xs font-bold text-emerald-200">

                            {stock.displaySymbol}

                          </div>

                          <div className="text-[9px] text-white/30">

                            {stock.name}

                          </div>

                        </div>


                        <button
                          type="button"
                          onClick={() =>
                            removeStock(
                              stock.symbol
                            )
                          }
                          className="text-white/25 hover:text-white"
                        >

                          <X size={14} />

                        </button>

                      </div>

                    )
                  )}

                </div>

              )}

            </div>

          </div>


          {/* ERROR */}

          {error && (

            <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-300/10 bg-red-300/[0.04] p-4">

              <AlertCircle
                size={17}
                className="mt-0.5 shrink-0 text-red-300"
              />

              <p className="text-xs leading-5 text-red-300">

                {error}

              </p>

            </div>

          )}


          {/* RUN BUTTON */}

          <button
            type="button"
            disabled={
              running ||
              selectedStocks.length === 0
            }
            onClick={handleOptimize}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-300 py-4 text-sm font-bold text-[#07100d] transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-40"
          >

            {running ? (

              <>
                <LoaderCircle
                  size={17}
                  className="animate-spin"
                />

                Analyzing portfolio...

              </>

            ) : (

              <>
                <Sparkles
                  size={17}
                />

                Run Portfolio Optimizer

              </>

            )}

          </button>


          {selectedStocks.length > 0 && (

            <p className="mt-3 text-center text-[10px] text-white/25">

              {selectedStocks.length} stock
              {selectedStocks.length !== 1
                ? "s"
                : ""}{" "}
              selected ·{" "}
              {risk} risk profile

            </p>

          )}

        </div>


        {/* =================================================
            RIGHT — RESULT
        ================================================= */}

        <div className="min-h-[620px] rounded-3xl border border-white/[0.08] bg-[#0b1713] p-6 sm:p-8">

          {!result ? (

            <EmptyResult
              running={running}
              selectedCount={
                selectedStocks.length
              }
            />

          ) : (

            <OptimizationResult
              result={result}
              formatMoney={formatMoney}
            />

          )}

        </div>

      </div>

    </section>
  );
}


// ======================================================
// EMPTY RESULT
// ======================================================

function EmptyResult({
  running,
  selectedCount
}) {

  return (

    <div className="flex h-full min-h-[550px] flex-col items-center justify-center text-center">

      <div className="rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.04] p-5 text-emerald-300">

        {running ? (

          <LoaderCircle
            size={30}
            className="animate-spin"
          />

        ) : (

          <Sparkles
            size={30}
          />

        )}

      </div>


      <h3 className="mt-6 font-display text-2xl font-extrabold">

        {running
          ? "Optimizing your portfolio..."
          : selectedCount > 0
          ? "Ready to analyze"
          : "Build your portfolio"}

      </h3>


      <p className="mt-3 max-w-md text-sm leading-6 text-white/35">

        {running

          ? "The ML models and optimization engine are analyzing the selected assets."

          : selectedCount > 0

          ? "Your selected assets are ready. Run the optimizer to calculate the allocation."

          : "Select the stocks you want analyzed, configure your investment amount and risk preference."}

      </p>

    </div>

  );
}


// ======================================================
// OPTIMIZATION RESULT
// ======================================================

function OptimizationResult({
  result,
  formatMoney
}) {

  const portfolio =
    result.portfolio || [];


  const totalReturn =
    Number(
      result.total_expected_3d_return_percent ||
      0
    );


  const investment =
    Number(
      result.investment_amount ||
      0
    );


  return (

    <div>

      {/* RESULT HEADER */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">

        <div>

          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">

            <CheckCircle2
              size={15}
            />

            Optimization Result

          </div>


          <h3 className="mt-3 font-display text-2xl font-extrabold">

            Portfolio allocation

          </h3>


          <p className="mt-2 text-xs text-white/35">

            AI analysis across{" "}
            {result.stocks_analyzed || portfolio.length}{" "}
            selected asset
            {(result.stocks_analyzed ||
              portfolio.length) !== 1
              ? "s"
              : ""}

          </p>

        </div>


        <div className="rounded-full bg-emerald-300/10 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-emerald-300">

          {result.risk || "medium"} risk

        </div>

      </div>


      {/* SUMMARY */}

      <div className="mt-7 grid gap-3 sm:grid-cols-3">

        <SummaryMetric
          icon={CircleDollarSign}
          label="Investment"
          value={formatMoney(investment)}
        />

        <SummaryMetric
          icon={TrendingUp}
          label="Expected 3D Return"
          value={`${totalReturn.toFixed(2)}%`}
        />

        <SummaryMetric
          icon={Activity}
          label="Prediction Horizon"
          value={`${result.prediction_horizon_days || 3} days`}
        />

      </div>


      {/* ALLOCATIONS */}

      <div className="mt-8">

        <div className="mb-4 flex items-center justify-between">

          <div>

            <div className="text-xs font-bold uppercase tracking-[0.18em] text-white/30">

              Recommended Allocation

            </div>

            <div className="mt-1 text-xs text-white/25">

              Based on model forecasts, risk and diversification

            </div>

          </div>

        </div>


        <div className="space-y-4">

          {portfolio.map(
            stock => (

              <AllocationRow
                key={stock.symbol}
                stock={stock}
                formatMoney={formatMoney}
              />

            )
          )}

        </div>

      </div>


      {/* MODEL INFORMATION */}

      <div className="mt-8 grid gap-3 sm:grid-cols-2">

        <InfoCard
          icon={Brain}
          label="Model Agreement"
          value={`${getAverageAgreement(portfolio).toFixed(1)}%`}
          description="Agreement between the ensemble models."
        />

        <InfoCard
          icon={ShieldCheck}
          label="Optimization"
          value={`${result.ga_generations || 50} generations`}
          description="Genetic algorithm search iterations."
        />

      </div>


      {/* NOTE */}

      <div className="mt-6 rounded-xl border border-white/[0.06] bg-white/[0.015] p-4">

        <p className="text-[10px] leading-5 text-white/25">

          Expected return is a model estimate for the selected
          prediction horizon. It is not a guaranteed return.

        </p>

      </div>

    </div>
  );
}


// ======================================================
// ALLOCATION ROW
// ======================================================

function AllocationRow({
  stock,
  formatMoney
}) {

  const percentage =
    Number(
      stock.weight_percent ||
      stock.weight ||
      0
    );

  const amount =
    Number(
      stock.amount ||
      0
    );

  const expectedReturn =
    Number(
      stock.predicted_return_percent ||
      0
    );

  const agreement =
    Number(
      stock.model_agreement_percent ||
      0
    );


  return (

    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.015] p-4">

      <div className="flex items-start justify-between gap-4">

        <div className="min-w-0">

          <div className="flex items-center gap-2">

            <span className="font-display text-sm font-bold">

              {stock.symbol?.replace(
                ".NS",
                ""
              )}

            </span>

          </div>


          <div className="mt-1 truncate text-xs text-white/30">

            {formatMoney(amount)}

          </div>

        </div>


        <div className="shrink-0 text-right">

          <div className="font-display text-lg font-extrabold text-emerald-300">

            {percentage.toFixed(2)}%

          </div>

          <div className="text-[10px] text-white/25">

            allocation

          </div>

        </div>

      </div>


      {/* BAR */}

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/[0.06]">

        <div
          className="h-full rounded-full bg-emerald-300 transition-all duration-700"
          style={{
            width: `${Math.min(
              percentage,
              100
            )}%`
          }}
        />

      </div>


      {/* DETAILS */}

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">

        <MiniMetric
          label="Expected"
          value={`${
            expectedReturn >= 0
              ? "+"
              : ""
          }${expectedReturn.toFixed(2)}%`}
        />

        <MiniMetric
          label="Volatility"
          value={`${Number(
            stock.recent_volatility_percent ||
            0
          ).toFixed(1)}%`}
        />

        <MiniMetric
          label="Agreement"
          value={`${agreement.toFixed(1)}%`}
        />

      </div>

    </div>
  );
}


// ======================================================
// SUMMARY METRIC
// ======================================================

function SummaryMetric({
  icon: Icon,
  label,
  value
}) {

  return (

    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">

      <div className="flex items-center gap-2 text-white/25">

        <Icon
          size={14}
        />

        <span className="text-[9px] font-bold uppercase tracking-wider">

          {label}

        </span>

      </div>


      <div className="mt-2 font-display text-lg font-bold">

        {value}

      </div>

    </div>
  );
}


// ======================================================
// INFO CARD
// ======================================================

function InfoCard({
  icon: Icon,
  label,
  value,
  description
}) {

  return (

    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">

      <div className="flex items-center gap-2 text-emerald-300">

        <Icon
          size={15}
        />

        <span className="text-[9px] font-bold uppercase tracking-wider text-white/30">

          {label}

        </span>

      </div>


      <div className="mt-2 font-display text-lg font-bold">

        {value}

      </div>


      <p className="mt-1 text-[10px] leading-4 text-white/25">

        {description}

      </p>

    </div>
  );
}


// ======================================================
// MINI METRIC
// ======================================================

function MiniMetric({
  label,
  value
}) {

  return (

    <div>

      <div className="text-[9px] uppercase tracking-wider text-white/20">

        {label}

      </div>

      <div className="mt-1 text-xs font-semibold text-white/55">

        {value}

      </div>

    </div>
  );
}


// ======================================================
// HELPERS
// ======================================================

function getDisplaySymbol(
  symbol
) {

  return symbol
    .replace(".NS", "")
    .replace(".BO", "");
}


function getAverageAgreement(
  portfolio
) {

  if (
    !portfolio ||
    portfolio.length === 0
  ) {

    return 0;
  }

  const values =
    portfolio
      .map(
        item =>
          Number(
            item.model_agreement_percent ||
            0
          )
      )
      .filter(
        value =>
          Number.isFinite(value)
      );

  if (values.length === 0) {
    return 0;
  }

  return (
    values.reduce(
      (sum, value) =>
        sum + value,
      0
    ) / values.length
  );
}


export default PortfolioOptimizer;