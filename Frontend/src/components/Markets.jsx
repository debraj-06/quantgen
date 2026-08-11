import { useEffect, useRef, useState } from "react";

import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  LoaderCircle,
  Search,
  X,
} from "lucide-react";

import {
  getMarketData,
  searchStocks,
} from "../services/marketApi";


const defaultStocks = [
  {
    symbol: "RELIANCE.NS",
    displaySymbol: "RELIANCE",
    name: "Reliance Industries",
  },
  {
    symbol: "TCS.NS",
    displaySymbol: "TCS",
    name: "Tata Consultancy Services",
  },
  {
    symbol: "INFY.NS",
    displaySymbol: "INFY",
    name: "Infosys",
  },
];


function MarketOverview() {

  const [stocks, setStocks] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [searchResults, setSearchResults] =
    useState([]);

  const [searching, setSearching] =
    useState(false);

  const [error, setError] =
    useState("");

  const searchRef = useRef(null);


  // -----------------------------------------
  // LOAD DEFAULT MARKET
  // -----------------------------------------

  useEffect(() => {

    loadDefaultStocks();

  }, []);


  async function loadDefaultStocks() {

    try {

      setLoading(true);
      setError("");

      const results =
        await Promise.all(
          defaultStocks.map(
            (stock) =>
              getMarketData(
                stock.symbol,
                "1mo",
                "1d"
              )
          )
        );


      const formatted =
        results.map(
          (result, index) => {

            return formatStock(
              result,
              defaultStocks[index]
            );

          }
        );


      setStocks(formatted);

    } catch (error) {

      console.error(error);

      setError(
        "Unable to load market data."
      );

    } finally {

      setLoading(false);

    }
  }


  // -----------------------------------------
  // SEARCH STOCKS
  // -----------------------------------------

  useEffect(() => {

    const timer =
      setTimeout(
        async () => {

          if (
            searchQuery.trim().length < 2
          ) {

            setSearchResults([]);

            return;

          }

          try {

            setSearching(true);

            const results =
              await searchStocks(
                searchQuery
              );

            setSearchResults(results);

          } catch (error) {

            console.error(error);

            setSearchResults([]);

          } finally {

            setSearching(false);

          }

        },
        400
      );


    return () =>
      clearTimeout(timer);

  }, [searchQuery]);


  // -----------------------------------------
  // SELECT STOCK
  // -----------------------------------------

  async function selectStock(stock) {

    try {

      setLoading(true);

      setError("");

      setSearchResults([]);

      setSearchQuery("");

      const result =
        await getMarketData(
          stock.symbol,
          "1mo",
          "1d"
        );


      const formatted =
        formatStock(
          result,
          {
            symbol: stock.symbol,
            displaySymbol:
              stock.symbol,
            name: stock.name,
          }
        );


      setStocks(
        (current) => {

          const exists =
            current.some(
              (item) =>
                item.rawSymbol ===
                stock.symbol
            );


          if (exists) {

            return current;

          }


          return [
            formatted,
            ...current,
          ];

        }
      );

    } catch (error) {

      console.error(error);

      setError(
        `Unable to load ${stock.symbol}`
      );

    } finally {

      setLoading(false);

    }
  }


  function removeStock(symbol) {

    setStocks(
      (current) =>
        current.filter(
          (stock) =>
            stock.rawSymbol !==
            symbol
        )
    );

  }


  return (

    <section
      id="markets"
      className="border-y border-white/[0.06] bg-[#09130f]"
    >

      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">


        {/* HEADER */}

        <div className="flex flex-col gap-6">

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

            <div>

              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">

                <Activity size={14} />

                Market Intelligence

              </div>


              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight">

                Explore the market.

              </h2>

            </div>


            <div className="text-xs text-white/30">

              Yahoo Finance · Live data

            </div>

          </div>


          {/* SEARCH */}

          <div
            ref={searchRef}
            className="relative max-w-2xl"
          >

            <div className="flex items-center rounded-2xl border border-white/[0.08] bg-[#0b1713] px-4 transition focus-within:border-emerald-300/30">

              <Search
                size={18}
                className="text-white/25"
              />


              <input
                type="text"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(
                    event.target.value
                  )
                }
                placeholder="Search stocks, companies or symbols..."
                className="w-full bg-transparent px-3 py-4 text-sm text-white outline-none placeholder:text-white/25"
              />


              {searching && (

                <LoaderCircle
                  size={18}
                  className="animate-spin text-emerald-300"
                />

              )}


              {searchQuery && !searching && (

                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
                  className="text-white/25 transition hover:text-white"
                >

                  <X size={17} />

                </button>

              )}

            </div>


            {/* SEARCH RESULTS */}

            {searchResults.length > 0 && (

              <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c1915] shadow-2xl shadow-black/50">

                {searchResults.map(
                  (result) => (

                    <button
                      key={`${result.symbol}-${result.exchange}`}
                      onClick={() =>
                        selectStock(
                          result
                        )
                      }
                      className="flex w-full items-center justify-between border-b border-white/[0.05] px-5 py-4 text-left transition last:border-0 hover:bg-white/[0.04]"
                    >

                      <div>

                        <div className="font-display text-sm font-bold">

                          {result.symbol}

                        </div>

                        <div className="mt-1 max-w-[400px] truncate text-xs text-white/30">

                          {result.name}

                        </div>

                      </div>


                      <div className="ml-4 shrink-0 rounded-md bg-white/[0.04] px-2 py-1 text-[9px] uppercase tracking-wider text-white/30">

                        {result.exchange ||
                          result.type}

                      </div>

                    </button>

                  )
                )}

              </div>

            )}


            {searchQuery.length >= 2 &&
              !searching &&
              searchResults.length === 0 && (

                <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 rounded-2xl border border-white/[0.08] bg-[#0c1915] p-5 text-sm text-white/30 shadow-2xl">

                  No matching stocks found.

                </div>

              )}

          </div>

        </div>


        {/* ERROR */}

        {error && (

          <div className="mt-8 rounded-2xl border border-red-300/10 bg-red-300/[0.04] p-5 text-sm text-red-300">

            {error}

          </div>

        )}


        {/* LOADING */}

        {loading && stocks.length === 0 && (

          <div className="mt-8 flex items-center justify-center rounded-2xl border border-white/[0.07] bg-[#0b1713] py-12">

            <LoaderCircle
              size={24}
              className="animate-spin text-emerald-300"
            />

            <span className="ml-3 text-sm text-white/40">

              Fetching market data...

            </span>

          </div>

        )}


        {/* STOCK CARDS */}

        {!loading &&
          stocks.length === 0 &&
          !error && (

            <div className="mt-8 rounded-2xl border border-white/[0.07] bg-[#0b1713] p-10 text-center">

              <p className="text-sm text-white/30">

                Search for a stock to add it to your market view.

              </p>

            </div>

          )}


        {stocks.length > 0 && (

          <div className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-3">

            {stocks.map(
              (stock) => (

                <MarketCard
                  key={stock.rawSymbol}
                  stock={stock}
                  onRemove={
                    removeStock
                  }
                />

              )
            )}

          </div>

        )}

      </div>

    </section>

  );
}


// -----------------------------------------
// FORMAT STOCK
// -----------------------------------------

function formatStock(
  result,
  original
) {

  const history =
    result.data;

  const latest =
    history[history.length - 1];

  const previous =
    history[history.length - 2];


  const currentPrice =
    latest.close;


  const change =
    previous
      ? ((currentPrice -
          previous.close) /
          previous.close) *
        100
      : 0;


  return {

    rawSymbol:
      original.symbol,

    symbol:
      original.displaySymbol ||
      original.symbol,

    name:
      original.name,

    price:
      currentPrice,

    change,

    history,

  };

}


// -----------------------------------------
// MARKET CARD
// -----------------------------------------

function MarketCard({
  stock,
  onRemove,
}) {

  const positive =
    stock.change >= 0;


  return (

    <div className="group rounded-2xl border border-white/[0.07] bg-[#0b1713] p-5 transition duration-300 hover:-translate-y-1 hover:border-emerald-300/20">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-xs font-bold tracking-wider text-white/30">

            NSE / MARKET

          </p>


          <h3 className="mt-1 font-display text-lg font-bold">

            {stock.symbol}

          </h3>


          <p className="mt-1 max-w-[220px] truncate text-xs text-white/30">

            {stock.name}

          </p>

        </div>


        <div className="flex items-center gap-2">

          <div
            className={`flex h-9 w-9 items-center justify-center rounded-lg ${
              positive
                ? "bg-emerald-300/10 text-emerald-300"
                : "bg-red-400/10 text-red-300"
            }`}
          >

            {positive ? (
              <ArrowUpRight
                size={17}
              />
            ) : (
              <ArrowDownRight
                size={17}
              />
            )}

          </div>


          <button
            onClick={() =>
              onRemove(
                stock.rawSymbol
              )
            }
            className="text-white/20 transition hover:text-white"
            title="Remove"
          >

            <X size={15} />

          </button>

        </div>

      </div>


      <div className="mt-7 flex items-end justify-between">

        <div className="font-display text-2xl font-bold">

          ₹
          {stock.price.toLocaleString(
            "en-IN",
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          )}

        </div>


        <div
          className={`text-sm font-bold ${
            positive
              ? "text-emerald-300"
              : "text-red-300"
          }`}
        >

          {positive ? "+" : ""}
          {stock.change.toFixed(2)}%

        </div>

      </div>


      <div className="mt-5 h-1 overflow-hidden rounded-full bg-white/[0.06]">

        <div
          className={`h-full rounded-full ${
            positive
              ? "bg-emerald-300"
              : "bg-red-300"
          }`}
          style={{
            width: `${Math.min(
              Math.abs(
                stock.change
              ) * 20 + 20,
              100
            )}%`,
          }}
        />

      </div>

    </div>

  );
}


export default MarketOverview;