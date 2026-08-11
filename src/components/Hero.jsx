import {
  ArrowUpRight,
  Play,
  Sparkles,
  TrendingUp,
} from "lucide-react";

function Hero({ running, onRunOptimizer }) {
  return (
    <section className="relative overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-emerald-400/[0.06] blur-[120px]" />

      <div className="relative mx-auto grid min-h-[calc(100vh-72px)] max-w-7xl items-center gap-14 px-5 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">

        {/* LEFT */}
        <div>

          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/[0.06] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-300">
            <Sparkles size={13} />
            AI Trading · Strategy Intelligence
          </div>

          <h1 className="mt-7 max-w-3xl font-display text-5xl font-extrabold leading-[1.02] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
            Trade with
            <span className="block text-emerald-300">
              better intelligence.
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-base leading-7 text-white/45 sm:text-lg">
            Explore market signals, test trading strategies and build
            optimized portfolios with a data-driven trading workspace.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">

            <button
              onClick={onRunOptimizer}
              className="group flex items-center justify-center gap-2 rounded-xl bg-emerald-300 px-5 py-3.5 text-sm font-bold text-[#07100d] transition hover:bg-emerald-200"
            >
              <Play size={16} fill="currentColor" />
                  <a
  href="#strategy"
  className="group flex items-center justify-center gap-2 rounded-xl bg-emerald-300 px-5 py-3.5 text-sm font-bold text-[#07100d] transition hover:bg-emerald-200"
>
    {running ? "Optimizing..." : "Launch Strategy Lab"}
</a>
              

              <ArrowUpRight
                size={16}
                className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </button>

            <a
              href="#markets"
              className="flex items-center justify-center rounded-xl border border-white/[0.09] bg-white/[0.02] px-5 py-3.5 text-sm font-semibold text-white/70 transition hover:border-white/[0.16] hover:bg-white/[0.04] hover:text-white"
            >
              Explore Markets
            </a>

          </div>

          {/* Small stats */}

          <div className="mt-12 grid max-w-lg grid-cols-3 border-y border-white/[0.07] py-5">

            <HeroStat
              value="18.7%"
              label="Backtest Return"
            />

            <HeroStat
              value="0.91"
              label="Sharpe Ratio"
            />

            <HeroStat
              value="500+"
              label="Strategies"
            />

          </div>

        </div>

        {/* RIGHT — PORTFOLIO CARD */}

        <div className="relative mx-auto w-full max-w-[500px]">

          {/* Outer glow */}
          <div className="absolute inset-10 rounded-full bg-emerald-300/[0.08] blur-[80px]" />

          <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.09] bg-[#0b1713] shadow-2xl shadow-black/40">

            {/* Card header */}

            <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">

              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/25">
                  Portfolio
                </div>

                <div className="mt-1 font-display text-sm font-bold">
                  Strategy Alpha
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-full bg-emerald-300/10 px-2.5 py-1 text-[10px] font-bold text-emerald-300">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />
                ACTIVE
              </div>

            </div>

            {/* Value */}

            <div className="px-5 pt-7">

              <div className="text-xs text-white/30">
                Current value
              </div>

              <div className="mt-1 flex items-end gap-3">

                <div className="font-display text-4xl font-extrabold tracking-tight">
                  ₹59,350
                </div>

                <div className="mb-1 flex items-center gap-1 text-sm font-bold text-emerald-300">
                  <TrendingUp size={14} />
                  +18.7%
                </div>

              </div>

            </div>

            {/* Chart */}

            <div className="relative mt-8 h-56 px-5">

              <div className="absolute inset-x-5 inset-y-0 bg-[linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] bg-[size:20%_25%]" />

              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="absolute inset-x-5 h-full w-[calc(100%-40px)]"
              >
                <defs>
                  <linearGradient
                    id="heroGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#6ee7b7"
                      stopOpacity=".22"
                    />

                    <stop
                      offset="100%"
                      stopColor="#6ee7b7"
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>

                <polygon
                  points="0,100 0,82 7,79 14,81 21,69 28,72 35,61 42,64 49,50 56,54 63,43 70,45 77,34 84,38 91,22 100,15 100,100"
                  fill="url(#heroGradient)"
                />

                <polyline
                  points="0,82 7,79 14,81 21,69 28,72 35,61 42,64 49,50 56,54 63,43 70,45 77,34 84,38 91,22 100,15"
                  fill="none"
                  stroke="#6ee7b7"
                  strokeWidth="1.3"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>

            </div>

            {/* Bottom stats */}

            <div className="grid grid-cols-3 border-t border-white/[0.07]">

              <MiniStat
                label="Return"
                value="+18.7%"
              />

              <MiniStat
                label="Risk"
                value="11.4%"
              />

              <MiniStat
                label="Sharpe"
                value="0.91"
              />

            </div>

          </div>

          {/* Floating signal */}

          <div className="absolute -bottom-5 -left-4 rounded-2xl border border-white/[0.09] bg-[#101d18] p-4 shadow-xl shadow-black/40 sm:-left-8">

            <div className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/25">
              Latest Signal
            </div>

            <div className="mt-1 flex items-center gap-2">

              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-300/10 text-emerald-300">
                <TrendingUp size={14} />
              </div>

              <div>
                <div className="text-xs font-bold">
                  RELIANCE · BUY
                </div>

                <div className="text-[10px] text-emerald-300">
                  92% confidence
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

function HeroStat({ value, label }) {
  return (
    <div className="border-r border-white/[0.07] px-3 first:pl-0 last:border-0">

      <div className="font-display text-lg font-bold">
        {value}
      </div>

      <div className="mt-1 text-[9px] uppercase tracking-[0.12em] text-white/25">
        {label}
      </div>

    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="px-4 py-4">

      <div className="text-[9px] uppercase tracking-[0.14em] text-white/25">
        {label}
      </div>

      <div className="mt-1 text-sm font-bold text-emerald-300">
        {value}
      </div>

    </div>
  );
}

export default Hero;