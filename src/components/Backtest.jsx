import {
  BarChart3,
  CalendarDays,
  TrendingUp,
} from "lucide-react";

function Backtest() {
  return (
    <section
      id="backtest"
      className="border-y border-white/[0.06] bg-[#09130f]"
    >
      <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">

        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">
              <BarChart3 size={14} />
              Backtest
            </div>

            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              See how the strategy performed.
            </h2>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-white/[0.07] px-3 py-2 text-xs text-white/35">
            <CalendarDays size={14} />
            Jan 2025 — Jun 2026
          </div>

        </div>

        {/* METRICS */}

        <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

          <Metric
            label="Initial Capital"
            value="₹50,000"
          />

          <Metric
            label="Final Value"
            value="₹59,350"
            positive
          />

          <Metric
            label="Total Return"
            value="+18.7%"
            positive
          />

          <Metric
            label="Max Drawdown"
            value="-7.2%"
          />

        </div>

        {/* CHART */}

        <div className="mt-5 rounded-3xl border border-white/[0.07] bg-[#0b1713] p-5 sm:p-7">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs uppercase tracking-[0.15em] text-white/30">
                Portfolio Growth
              </p>

              <div className="mt-1 flex items-center gap-2">
                <span className="font-display text-xl font-bold">
                  ₹59,350
                </span>

                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-300">
                  <TrendingUp size={13} />
                  18.7%
                </span>
              </div>
            </div>

            <div className="hidden gap-2 sm:flex">
              {["1M", "3M", "6M", "1Y"].map((item, index) => (
                <button
                  key={item}
                  className={`rounded-lg px-3 py-1.5 text-xs ${
                    index === 2
                      ? "bg-emerald-300/10 text-emerald-300"
                      : "text-white/30"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

          </div>

          <PerformanceChart />

        </div>

      </div>
    </section>
  );
}

function Metric({
  label,
  value,
  positive,
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[#0b1713] p-5">

      <div className="text-[10px] uppercase tracking-[0.15em] text-white/30">
        {label}
      </div>

      <div
        className={`mt-2 font-display text-xl font-bold ${
          positive ? "text-emerald-300" : ""
        }`}
      >
        {value}
      </div>

    </div>
  );
}

function PerformanceChart() {
  const points =
    "0,82 5,78 10,80 15,72 20,74 25,65 30,68 35,59 40,63 45,53 50,55 55,47 60,50 65,40 70,43 75,34 80,38 85,28 90,31 95,21 100,15";

  return (
    <div className="relative mt-7 h-72 overflow-hidden rounded-2xl border border-white/[0.05] bg-[#08110e]">

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] bg-[size:10%_25%]" />

      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full p-5"
      >
        <defs>
          <linearGradient
            id="performanceFill"
            x1="0"
            x2="0"
            y1="0"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="#6ee7b7"
              stopOpacity=".18"
            />

            <stop
              offset="100%"
              stopColor="#6ee7b7"
              stopOpacity="0"
            />
          </linearGradient>
        </defs>

        <polygon
          points={`0,100 ${points} 100,100`}
          fill="url(#performanceFill)"
        />

        <polyline
          points={points}
          fill="none"
          stroke="#6ee7b7"
          strokeWidth="1.2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className="absolute bottom-3 left-4 text-[10px] text-white/20">
        JAN
      </div>

      <div className="absolute bottom-3 left-1/4 text-[10px] text-white/20">
        APR
      </div>

      <div className="absolute bottom-3 left-1/2 text-[10px] text-white/20">
        JUL
      </div>

      <div className="absolute bottom-3 right-1/4 text-[10px] text-white/20">
        OCT
      </div>

      <div className="absolute bottom-3 right-4 text-[10px] text-white/20">
        JAN
      </div>

    </div>
  );
}

export default Backtest;