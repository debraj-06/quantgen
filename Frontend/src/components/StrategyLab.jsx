import { useEffect, useState } from "react";
import {
  Check,
  ChevronDown,
  LoaderCircle,
  Search,
  Sparkles,
  X,
} from "lucide-react";

import { searchStocks } from "../services/marketApi";


function Strategy() {
  // ---------------------------------------
  // CONFIGURATION STATE
  // ---------------------------------------

  const [investmentAmount, setInvestmentAmount] =
    useState("50000");

  const [riskPreference, setRiskPreference] =
    useState("Medium");

  const [selectedAssets, setSelectedAssets] =
    useState([]);


  // ---------------------------------------
  // SEARCH STATE
  // ---------------------------------------

  const [searchQuery, setSearchQuery] =
    useState("");

  const [searchResults, setSearchResults] =
    useState([]);

  const [searching, setSearching] =
    useState(false);


  // ---------------------------------------
  // OPTIMIZATION STATE
  // ---------------------------------------

  const [optimizing, setOptimizing] =
    useState(false);


  // ---------------------------------------
  // SEARCH STOCKS
  // ---------------------------------------

  useEffect(() => {

    const timer = setTimeout(async () => {

      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      try {

        setSearching(true);

        const results =
          await searchStocks(searchQuery);

        setSearchResults(results);

      } catch (error) {

        console.error(
          "Stock search error:",
          error
        );

        setSearchResults([]);

      } finally {

        setSearching(false);

      }

    }, 400);


    return () => clearTimeout(timer);

  }, [searchQuery]);


  // ---------------------------------------
  // ADD STOCK
  // ---------------------------------------

  function addAsset(stock) {

    const exists =
      selectedAssets.some(
        (asset) =>
          asset.symbol === stock.symbol
      );


    if (exists) {
      return;
    }


    setSelectedAssets((current) => [
      ...current,
      {
        symbol: stock.symbol,
        name: stock.name,
        exchange: stock.exchange,
        type: stock.type,
      },
    ]);


    setSearchQuery("");
    setSearchResults([]);

  }


  // ---------------------------------------
  // REMOVE STOCK
  // ---------------------------------------

  function removeAsset(symbol) {

    setSelectedAssets((current) =>
      current.filter(
        (asset) =>
          asset.symbol !== symbol
      )
    );

  }


  // ---------------------------------------
  // RUN OPTIMIZER
  // ---------------------------------------

  async function handleOptimize() {

    if (selectedAssets.length === 0) {
      return;
    }


    setOptimizing(true);


    try {

      /*
       * Later this will call your Flask
       * Genetic Algorithm endpoint.
       *
       * Example payload:
       *
       * {
       *   investment_amount: 50000,
       *   risk_preference: "Medium",
       *   assets: [
       *     "RELIANCE.NS",
       *     "TCS.NS",
       *     "INFY.NS"
       *   ]
       * }
       */


      console.log({
        investment_amount:
          Number(investmentAmount),

        risk_preference:
          riskPreference,

        assets:
          selectedAssets.map(
            (asset) =>
              asset.symbol
          ),
      });


      // Temporary delay so the UI
      // shows the optimization state.
      await new Promise(
        (resolve) =>
          setTimeout(resolve, 1500)
      );


    } catch (error) {

      console.error(
        "Optimization error:",
        error
      );

    } finally {

      setOptimizing(false);

    }

  }


  return (

    <section
      id="strategy"
      className="border-y border-white/[0.06] bg-[#07100d]"
    >

      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">


        {/* ================================= */}
        {/* SECTION HEADER */}
        {/* ================================= */}

        <div className="mb-10">

          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">

            <Sparkles size={14} />

            Strategy Lab

          </div>


          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight">

            Build your strategy.

          </h2>


          <p className="mt-3 max-w-xl text-sm leading-6 text-white/35">

            Select the assets you want the optimizer
            to analyze, define your risk preference,
            and let the Genetic Algorithm search for
            a stronger strategy.

          </p>

        </div>


        {/* ================================= */}
        {/* MAIN GRID */}
        {/* ================================= */}

        <div className="grid gap-7 lg:grid-cols-[0.8fr_1.2fr]">


          {/* ================================= */}
          {/* LEFT — CONFIGURATION */}
          {/* ================================= */}

          <div
            className="
              rounded-[26px]
              border
              border-white/[0.08]
              bg-[#09140f]
              p-7
              lg:p-8
            "
          >

            <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/35">

              Configuration

            </div>


            {/* INVESTMENT AMOUNT */}

            <div className="mt-8">

              <label className="mb-3 block text-xs font-semibold text-white/45">

                Investment Amount

              </label>


              <div
                className="
                  flex
                  items-center
                  rounded-xl
                  border
                  border-white/[0.08]
                  bg-[#07100d]
                  px-4
                  transition
                  focus-within:border-emerald-300/30
                "
              >

                <span className="mr-3 text-lg text-white/30">
                  ₹
                </span>


                <input
                  type="number"
                  min="1000"
                  value={investmentAmount}
                  onChange={(e) =>
                    setInvestmentAmount(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    bg-transparent
                    py-4
                    text-sm
                    font-semibold
                    text-white
                    outline-none
                  "
                />

              </div>

            </div>


            {/* RISK */}

            <div className="mt-8">

              <label className="mb-3 block text-xs font-semibold text-white/45">

                Risk Preference

              </label>


              <div className="grid grid-cols-3 gap-2">

                {[
                  "Low",
                  "Medium",
                  "High",
                ].map((risk) => (

                  <button
                    key={risk}
                    onClick={() =>
                      setRiskPreference(
                        risk
                      )
                    }
                    className={`
                      rounded-xl
                      border
                      px-3
                      py-3
                      text-xs
                      font-bold
                      transition

                      ${
                        riskPreference ===
                        risk

                          ? `
                            border-emerald-300/40
                            bg-emerald-300/[0.08]
                            text-emerald-300
                          `

                          : `
                            border-white/[0.07]
                            text-white/30
                            hover:border-white/[0.14]
                            hover:text-white/60
                          `
                      }
                    `}
                  >

                    {risk}

                  </button>

                ))}

              </div>

            </div>


            {/* ================================= */}
            {/* STOCK SEARCH */}
            {/* ================================= */}

            <div className="mt-8">

              <label className="mb-3 block text-xs font-semibold text-white/45">

                Investment Basket

              </label>


              <div className="relative">

                {/* SEARCH INPUT */}

                <div
                  className="
                    flex
                    items-center
                    rounded-xl
                    border
                    border-white/[0.08]
                    bg-[#07100d]
                    px-4
                    transition
                    focus-within:border-emerald-300/30
                  "
                >

                  <Search
                    size={17}
                    className="shrink-0 text-white/25"
                  />


                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) =>
                      setSearchQuery(
                        e.target.value
                      )
                    }
                    placeholder="Search stocks or companies..."
                    className="
                      w-full
                      bg-transparent
                      px-3
                      py-4
                      text-sm
                      text-white
                      outline-none
                      placeholder:text-white/20
                    "
                  />


                  {searching && (

                    <LoaderCircle
                      size={16}
                      className="
                        animate-spin
                        text-emerald-300
                      "
                    />

                  )}


                  {searchQuery &&
                    !searching && (

                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setSearchResults([]);
                        }}
                        className="text-white/20 transition hover:text-white"
                      >

                        <X size={16} />

                      </button>

                    )}

                </div>


                {/* ================================= */}
                {/* SEARCH RESULTS */}
                {/* ================================= */}

                {searchQuery.length >= 2 &&
                  searchResults.length > 0 && (

                    <div
                      className="
                        absolute
                        left-0
                        right-0
                        top-[calc(100%+8px)]
                        z-50
                        max-h-72
                        overflow-y-auto
                        rounded-xl
                        border
                        border-white/[0.08]
                        bg-[#0b1713]
                        shadow-2xl
                        shadow-black/50
                      "
                    >

                      {searchResults.map(
                        (stock) => {

                          const alreadySelected =
                            selectedAssets.some(
                              (asset) =>
                                asset.symbol ===
                                stock.symbol
                            );


                          return (

                            <button
                              key={`${stock.symbol}-${stock.exchange}`}
                              onClick={() =>
                                addAsset(stock)
                              }
                              disabled={
                                alreadySelected
                              }
                              className="
                                flex
                                w-full
                                items-center
                                justify-between
                                border-b
                                border-white/[0.05]
                                px-4
                                py-3.5
                                text-left
                                transition
                                last:border-0
                                hover:bg-white/[0.04]
                                disabled:cursor-default
                              "
                            >

                              <div className="min-w-0">

                                <div className="text-sm font-bold text-white/80">

                                  {stock.symbol}

                                </div>


                                <div className="mt-1 truncate text-xs text-white/30">

                                  {stock.name}

                                </div>

                              </div>


                              <div className="ml-3 flex shrink-0 items-center gap-2">

                                <span className="rounded-md bg-white/[0.04] px-2 py-1 text-[9px] uppercase tracking-wider text-white/25">

                                  {stock.exchange ||
                                    stock.type}

                                </span>


                                {alreadySelected && (

                                  <Check
                                    size={15}
                                    className="text-emerald-300"
                                  />

                                )}

                              </div>

                            </button>

                          );

                        }
                      )}

                    </div>

                  )}


                {/* NO RESULTS */}

                {searchQuery.length >= 2 &&
                  !searching &&
                  searchResults.length ===
                    0 && (

                    <div
                      className="
                        absolute
                        left-0
                        right-0
                        top-[calc(100%+8px)]
                        z-50
                        rounded-xl
                        border
                        border-white/[0.08]
                        bg-[#0b1713]
                        p-5
                        text-center
                        text-xs
                        text-white/30
                      "
                    >

                      No matching stocks found.

                    </div>

                  )}

              </div>


              {/* ================================= */}
              {/* SELECTED STOCKS */}
              {/* ================================= */}

              <div className="mt-4">

                {selectedAssets.length === 0 ? (

                  <div
                    className="
                      rounded-xl
                      border
                      border-dashed
                      border-white/[0.08]
                      px-4
                      py-6
                      text-center
                    "
                  >

                    <p className="text-xs text-white/25">

                      Search and select the stocks
                      you want the optimizer to analyze.

                    </p>

                  </div>

                ) : (

                  <div className="space-y-2">

                    <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/25">

                      Selected Assets ·{" "}
                      {selectedAssets.length}

                    </div>


                    <div className="flex flex-wrap gap-2">

                      {selectedAssets.map(
                        (asset) => (

                          <div
                            key={asset.symbol}
                            className="
                              flex
                              items-center
                              gap-2
                              rounded-lg
                              border
                              border-emerald-300/15
                              bg-emerald-300/[0.06]
                              px-3
                              py-2
                            "
                          >

                            <div>

                              <div className="text-xs font-bold text-emerald-200">

                                {formatSymbol(
                                  asset.symbol
                                )}

                              </div>


                              <div className="max-w-[120px] truncate text-[9px] text-white/25">

                                {asset.name}

                              </div>

                            </div>


                            <button
                              onClick={() =>
                                removeAsset(
                                  asset.symbol
                                )
                              }
                              className="
                                text-white/20
                                transition
                                hover:text-white
                              "
                            >

                              <X size={14} />

                            </button>

                          </div>

                        )
                      )}

                    </div>

                  </div>

                )}

              </div>

            </div>


            {/* OPTIMIZE BUTTON */}

            <button
              onClick={
                handleOptimize
              }
              disabled={
                selectedAssets.length ===
                  0 ||
                optimizing
              }
              className="
                mt-8
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-emerald-300
                px-5
                py-4
                text-sm
                font-bold
                text-[#07100d]
                transition
                hover:bg-emerald-200
                disabled:cursor-not-allowed
                disabled:opacity-30
              "
            >

              {optimizing ? (

                <>
                  <LoaderCircle
                    size={17}
                    className="animate-spin"
                  />

                  Optimizing...

                </>

              ) : (

                <>
                  <Sparkles size={17} />

                  Run Genetic Optimizer

                </>

              )}

            </button>

          </div>


          {/* ================================= */}
          {/* RIGHT — OPTIMIZATION RESULT */}
          {/* ================================= */}

          <div
            className="
              min-h-[600px]
              rounded-[26px]
              border
              border-white/[0.08]
              bg-[#09140f]
              p-7
              lg:p-8
            "
          >

            <div className="flex items-start justify-between">

              <div>

                <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/35">

                  Optimization Result

                </div>


                <h3 className="mt-2 font-display text-lg font-bold">

                  Strategy Alpha

                </h3>

              </div>


              <span className="rounded-full bg-white/[0.04] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white/30">

                {optimizing
                  ? "Running"
                  : "Ready"}

              </span>

            </div>


            {/* EMPTY STATE */}

            {!optimizing && (

              <div className="flex min-h-[480px] flex-col items-center justify-center text-center">

                <div
                  className="
                    flex
                    h-20
                    w-20
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-emerald-300/15
                    bg-emerald-300/[0.04]
                  "
                >

                  <Sparkles
                    size={27}
                    className="text-emerald-200"
                  />

                </div>


                <h4 className="mt-7 font-display text-xl font-bold">

                  Ready to optimize

                </h4>


                <p className="mt-3 max-w-md text-sm leading-6 text-white/30">

                  Select the stocks you want to
                  analyze and configure your risk
                  preference to generate an optimized
                  trading strategy.

                </p>

              </div>

            )}


            {/* OPTIMIZING STATE */}

            {optimizing && (

              <div className="flex min-h-[480px] flex-col items-center justify-center text-center">

                <LoaderCircle
                  size={34}
                  className="
                    animate-spin
                    text-emerald-300
                  "
                />


                <h4 className="mt-7 font-display text-xl font-bold">

                  Evolving strategy...

                </h4>


                <p className="mt-3 max-w-md text-sm leading-6 text-white/30">

                  The Genetic Algorithm is evaluating
                  different strategy combinations.

                </p>

              </div>

            )}

          </div>

        </div>

      </div>

    </section>
  );
}


function formatSymbol(symbol) {

  return symbol
    .replace(".NS", "")
    .replace(".BO", "");

}


export default Strategy;