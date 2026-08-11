import { useState } from "react";

function StrategyLab() {
  const [investment, setInvestment] = useState("50000");
  const [risk, setRisk] = useState("Medium");
  const [stocks, setStocks] = useState(["RELIANCE", "TCS"]);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(false);

  const toggleStock = (stock) => {
    setStocks((current) =>
      current.includes(stock)
        ? current.filter((item) => item !== stock)
        : [...current, stock]
    );
  };

  const runOptimizer = () => {
    setRunning(true);
    setCompleted(false);

    setTimeout(() => {
      setRunning(false);
      setCompleted(true);
    }, 1800);
  };

  return (
    <section
      id="strategy"
      className="border-t border-white/[0.07] bg-[#07100d] px-5 py-24 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="max-w-2xl">
          <div className="inline-flex rounded-full border border-emerald-300/15 bg-emerald-300/[0.06] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-300">
            Strategy Lab
          </div>

          <h2 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
            Build your
            <span className="text-emerald-300">
              {" "}optimized strategy.
            </span>
          </h2>

          <p className="mt-5 leading-7 text-white/40">
            Configure your investment preferences and let the optimization
            engine search for a stronger trading strategy.
          </p>
        </div>

        {/* CONTENT */}

        <div className="mt-12 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">

          {/* CONFIGURATION */}

          <div className="rounded-3xl border border-white/[0.08] bg-[#0a1511] p-6">

            <div className="text-xs font-bold uppercase tracking-[0.15em] text-white/30">
              Configuration
            </div>

            {/* INVESTMENT */}

            <div className="mt-7">

              <label className="text-xs font-semibold text-white/45">
                Investment Amount
              </label>

              <div className="mt-2 flex items-center rounded-xl border border-white/[0.08] bg-black/10 px-4">

                <span className="text-white/30">
                  ₹
                </span>

                <input
                  type="number"
                  value={investment}
                  onChange={(e) => setInvestment(e.target.value)}
                  className="w-full bg-transparent px-3 py-3 text-sm font-semibold text-white outline-none"
                />

              </div>

            </div>

            {/* RISK */}

            <div className="mt-6">

              <label className="text-xs font-semibold text-white/45">
                Risk Preference
              </label>

              <div className="mt-3 grid grid-cols-3 gap-2">

                {["Low", "Medium", "High"].map((item) => (
                  <button
                    key={item}
                    onClick={() => setRisk(item)}
                    className={`rounded-xl border px-3 py-3 text-xs font-semibold transition ${
                      risk === item
                        ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-300"
                        : "border-white/[0.07] text-white/35 hover:bg-white/[0.03]"
                    }`}
                  >
                    {item}
                  </button>
                ))}

              </div>

            </div>

            {/* STOCKS */}

            <div className="mt-6">

              <label className="text-xs font-semibold text-white/45">
                Select Assets
              </label>

              <div className="mt-3 grid grid-cols-2 gap-2">

                {["RELIANCE", "TCS", "INFOSYS", "HDFC"].map((stock) => (
                  <button
                    key={stock}
                    onClick={() => toggleStock(stock)}
                    className={`rounded-xl border px-3 py-3 text-left text-xs font-semibold transition ${
                      stocks.includes(stock)
                        ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-300"
                        : "border-white/[0.07] text-white/35 hover:bg-white/[0.03]"
                    }`}
                  >
                    {stocks.includes(stock) ? "✓ " : ""}
                    {stock}
                  </button>
                ))}

              </div>

            </div>

            {/* RUN */}

            <button
              onClick={runOptimizer}
              disabled={running || stocks.length === 0}
              className="mt-8 w-full rounded-xl bg-emerald-300 px-5 py-4 text-sm font-bold text-[#07100d] transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {running
                ? "Optimizing Strategy..."
                : "Run Genetic Optimizer"}
            </button>

          </div>

          {/* RESULT */}

          <div className="rounded-3xl border border-white/[0.08] bg-[#0a1511] p-6">

            <div className="flex items-center justify-between">

              <div>
                <div className="text-xs font-bold uppercase tracking-[0.15em] text-white/30">
                  Optimization Result
                </div>

                <div className="mt-1 text-sm font-semibold">
                  Strategy Alpha
                </div>
              </div>

              <div
                className={`rounded-full px-3 py-1 text-[10px] font-bold ${
                  completed
                    ? "bg-emerald-300/10 text-emerald-300"
                    : "bg-white/[0.05] text-white/30"
                }`}
              >
                {completed ? "OPTIMIZED" : "READY"}
              </div>

            </div>

            {!completed && !running && (
              <div className="flex min-h-[380px] items-center justify-center">

                <div className="max-w-sm text-center">

                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.06] text-2xl">
                    ✦
                  </div>

                  <h3 className="mt-5 text-lg font-bold">
                    Ready to optimize
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-white/30">
                    Configure your investment preferences and run the
                    optimizer to generate a strategy.
                  </p>

                </div>

              </div>
            )}

            {running && (
              <div className="flex min-h-[380px] items-center justify-center">

                <div className="text-center">

                  <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-white/10 border-t-emerald-300" />

                  <p className="mt-6 text-sm font-semibold">
                    Searching strategy combinations...
                  </p>

                  <p className="mt-2 text-xs text-white/30">
                    Evaluating parameters and portfolio allocations
                  </p>

                </div>

              </div>
            )}

            {completed && (
              <div className="mt-8">

                <div className="grid grid-cols-3 gap-3">

                  <Metric
                    label="Expected Return"
                    value="+18.7%"
                  />

                  <Metric
                    label="Risk"
                    value="11.4%"
                  />

                  <Metric
                    label="Sharpe"
                    value="0.91"
                  />

                </div>

                <div className="mt-5 rounded-2xl border border-white/[0.06] bg-black/10 p-5">

                  <div className="text-xs font-bold uppercase tracking-widest text-white/25">
                    Recommended Allocation
                  </div>

                  <Allocation
                    name="RELIANCE"
                    value="40%"
                  />

                  <Allocation
                    name="TCS"
                    value="35%"
                  />

                  <Allocation
                    name="INFOSYS"
                    value="25%"
                  />

                </div>

                <div className="mt-5 rounded-2xl bg-emerald-300/[0.06] p-4">

                  <div className="text-xs font-bold text-emerald-300">
                    Strategy generated successfully
                  </div>

                  <p className="mt-1 text-xs leading-5 text-white/35">
                    Best parameters found using the selected risk profile
                    and assets.
                  </p>

                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-black/10 p-4">
      <div className="text-[9px] uppercase tracking-widest text-white/25">
        {label}
      </div>

      <div className="mt-2 text-lg font-black text-emerald-300">
        {value}
      </div>
    </div>
  );
}

function Allocation({ name, value }) {
  return (
    <div className="mt-5">

      <div className="flex items-center justify-between text-xs">

        <span className="font-semibold text-white/60">
          {name}
        </span>

        <span className="font-bold text-emerald-300">
          {value}
        </span>

      </div>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">

        <div
          className="h-full rounded-full bg-emerald-300"
          style={{ width: value }}
        />

      </div>

    </div>
  );
}

export default StrategyLab;