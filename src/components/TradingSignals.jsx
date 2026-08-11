import {
  ArrowDown,
  ArrowUp,
  Minus,
  Radio,
} from "lucide-react";

import { tradingSignals } from "../data/marketData";

function TradingSignals() {
  return (
    <section
      id="signals"
      className="border-y border-white/[0.06] bg-[#09130f]"
    >
      <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">
              <Radio size={14} />
              AI Signals
            </div>

            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              Today's market signals.
            </h2>
          </div>

          <div className="rounded-full border border-white/[0.07] px-3 py-1.5 text-xs text-white/30">
            Updated 2 min ago
          </div>

        </div>

        <div className="mt-10 grid gap-3 md:grid-cols-3">
          {tradingSignals.map((item) => (
            <SignalCard
              key={item.symbol}
              signal={item}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

function SignalCard({ signal }) {
  const buy = signal.signal === "BUY";
  const sell = signal.signal === "SELL";

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[#0b1713] p-5 transition hover:border-white/[0.14]">

      <div className="flex items-center justify-between">

        <div>
          <div className="font-display text-lg font-bold">
            {signal.symbol}
          </div>

          <div className="mt-1 text-xs text-white/30">
            Technical signal
          </div>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            buy
              ? "bg-emerald-300/10 text-emerald-300"
              : sell
              ? "bg-red-300/10 text-red-300"
              : "bg-yellow-300/10 text-yellow-200"
          }`}
        >
          {buy ? (
            <ArrowUp size={19} />
          ) : sell ? (
            <ArrowDown size={19} />
          ) : (
            <Minus size={19} />
          )}
        </div>

      </div>

      <div className="mt-7 flex items-end justify-between">

        <div>
          <div
            className={`text-2xl font-extrabold ${
              buy
                ? "text-emerald-300"
                : sell
                ? "text-red-300"
                : "text-yellow-200"
            }`}
          >
            {signal.signal}
          </div>

          <p className="mt-2 max-w-[210px] text-xs leading-5 text-white/35">
            {signal.reason}
          </p>
        </div>

        <div className="text-right">
          <div className="text-[10px] uppercase tracking-wider text-white/25">
            Confidence
          </div>

          <div className="mt-1 font-display text-lg font-bold">
            {signal.strength}%
          </div>
        </div>

      </div>

      <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full bg-emerald-300"
          style={{
            width: `${signal.strength}%`,
          }}
        />
      </div>

    </div>
  );
}

export default TradingSignals;