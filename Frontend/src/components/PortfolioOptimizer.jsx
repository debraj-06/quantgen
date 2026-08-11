import { useState } from "react";
import {
  CircleDollarSign,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

function PortfolioOptimizer({
  running,
  onRunOptimizer,
}) {
  const [risk, setRisk] = useState("Balanced");

  const allocations = {
    Conservative: [
      ["Reliance", 30],
      ["TCS", 45],
      ["Infosys", 25],
    ],

    Balanced: [
      ["Reliance", 40],
      ["TCS", 35],
      ["Infosys", 25],
    ],

    Aggressive: [
      ["Reliance", 55],
      ["TCS", 20],
      ["Infosys", 25],
    ],
  };

  return (
    <section
      id="portfolio"
      className="mx-auto max-w-7xl px-5 py-20 lg:px-8"
    >

      <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">

        {/* ALLOCATION */}

        <div className="rounded-3xl border border-white/[0.08] bg-[#0b1713] p-6 sm:p-8">

          <div className="flex items-start justify-between">

            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
                <CircleDollarSign size={15} />
                Portfolio Optimizer
              </div>

              <h2 className="mt-3 font-display text-2xl font-extrabold sm:text-3xl">
                ₹50,000 allocation.
              </h2>
            </div>

            <div className="hidden rounded-xl bg-emerald-300/10 p-3 text-emerald-300 sm:block">
              <Sparkles size={19} />
            </div>

          </div>

          <div className="mt-8 space-y-5">
            {allocations[risk].map(([name, percentage]) => (
              <Allocation
                key={name}
                name={name}
                percentage={percentage}
              />
            ))}
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3">

            <Metric
              label="Expected Return"
              value={
                risk === "Conservative"
                  ? "11.2%"
                  : risk === "Balanced"
                  ? "18.7%"
                  : "27.4%"
              }
            />

            <Metric
              label="Portfolio Risk"
              value={
                risk === "Conservative"
                  ? "6.8%"
                  : risk === "Balanced"
                  ? "11.4%"
                  : "19.2%"
              }
            />

          </div>

        </div>

        {/* CONTROLS */}

        <div className="rounded-3xl border border-white/[0.08] bg-[#0b1713] p-6 sm:p-8">

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/30">
            Optimization Profile
          </p>

          <h3 className="mt-3 font-display text-2xl font-extrabold">
            How much risk?
          </h3>

          <p className="mt-3 text-sm leading-6 text-white/40">
            Choose your preference and compare how the allocation changes.
          </p>

          <div className="mt-7 space-y-2">

            {["Conservative", "Balanced", "Aggressive"].map(
              (item) => (
                <button
                  key={item}
                  onClick={() => setRisk(item)}
                  className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition ${
                    risk === item
                      ? "border-emerald-300/25 bg-emerald-300/10"
                      : "border-white/[0.07] bg-white/[0.015] hover:border-white/[0.14]"
                  }`}
                >
                  <span className="text-sm font-semibold">
                    {item}
                  </span>

                  {risk === item && (
                    <ShieldCheck
                      size={17}
                      className="text-emerald-300"
                    />
                  )}
                </button>
              )
            )}

          </div>

          <button
            onClick={onRunOptimizer}
            className="mt-7 w-full rounded-xl bg-emerald-300 py-3.5 text-sm font-bold text-[#07100d] transition hover:bg-emerald-200"
          >
            {running
              ? "Optimizing Portfolio..."
              : "Optimize Portfolio"}
          </button>

        </div>

      </div>

    </section>
  );
}

function Allocation({
  name,
  percentage,
}) {
  return (
    <div>

      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-semibold">
          {name}
        </span>

        <span className="text-white/40">
          {percentage}%
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full bg-emerald-300 transition-all duration-500"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>

    </div>
  );
}

function Metric({
  label,
  value,
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">

      <div className="text-[10px] uppercase tracking-[0.15em] text-white/30">
        {label}
      </div>

      <div className="mt-2 font-display text-lg font-bold">
        {value}
      </div>

    </div>
  );
}

export default PortfolioOptimizer;