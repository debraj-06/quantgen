import {
  Activity,
  ArrowUpRight,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    ["Markets", "#markets"],
    ["Strategy Lab", "#strategy"],
    ["Signals", "#signals"],
    ["Portfolio", "#portfolio"],
    ["Backtest", "#backtest"],
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#07100d]/95 backdrop-blur-xl">

      <div className="mx-auto max-w-[1440px] px-5 lg:px-8">

        <div className="flex h-[72px] items-center justify-between">

          {/* LOGO */}

          <a href="#top" className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-300/40 bg-emerald-300/[0.08]">
              <div className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(94,234,212,0.9)]" />
            </div>

            <div>
              <div className="text-xl font-black tracking-tight">
                QUANT<span className="text-emerald-300">GEN</span>
              </div>

              <div className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.22em] text-white/25">
                Adaptive Trading Intelligence
              </div>
            </div>

          </a>

          {/* DESKTOP NAV */}

          <nav className="hidden items-center gap-1 xl:flex">

            {links.map(([name, href]) => (
              <a
                key={name}
                href={href}
                className="rounded-lg px-4 py-2.5 text-xs font-semibold text-white/45 transition hover:bg-white/[0.05] hover:text-white"
              >
                {name}
              </a>
            ))}

          </nav>

          {/* RIGHT */}

          <div className="flex items-center gap-3">

            {/* MARKET STATUS */}

            <div className="hidden items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-2 2xl:flex">

              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,.8)]" />

              <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/35">
                Market Open
              </span>

            </div>

            {/* NIFTY */}

            <div className="hidden items-center gap-2 md:flex">

              <Activity
                size={14}
                className="text-emerald-300"
              />

              <div>
                <div className="text-[8px] uppercase tracking-widest text-white/25">
                  NIFTY 50
                </div>

                <div className="text-[11px] font-bold text-emerald-300">
                  +0.84%
                </div>
              </div>

            </div>

            {/* CTA */}

            <a
              href="#strategy"
              className="group flex items-center gap-2 rounded-full bg-emerald-300 px-5 py-2.5 text-xs font-bold text-[#07100d] transition hover:bg-emerald-200"
            >
              Launch Lab

              <ArrowUpRight
                size={14}
                className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>

            {/* MOBILE BUTTON */}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.09] text-white/70 xl:hidden"
            >
              {mobileOpen ? (
                <X size={20} />
              ) : (
                <Menu size={20} />
              )}
            </button>

          </div>

        </div>

      </div>

      {/* MOBILE MENU */}

      {mobileOpen && (
        <div className="border-t border-white/[0.07] bg-[#07100d] xl:hidden">

          <nav className="mx-auto grid max-w-[1440px] gap-1 px-5 py-4">

            {links.map(([name, href]) => (
              <a
                key={name}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-white/50 hover:bg-white/[0.04] hover:text-white"
              >
                {name}
              </a>
            ))}

          </nav>

        </div>
      )}

      {/* MARKET TICKER */}

      <div className="hidden border-t border-white/[0.04] xl:block">

        <div className="mx-auto flex h-8 max-w-[1440px] items-center gap-7 overflow-hidden px-5 lg:px-8">

          <span className="shrink-0 text-[9px] font-bold uppercase tracking-[0.2em] text-white/20">
            Market Pulse
          </span>

          <Ticker symbol="NIFTY 50" value="24,580" change="+0.84%" />
          <Ticker symbol="SENSEX" value="80,450" change="+0.61%" />
          <Ticker symbol="RELIANCE" value="₹1,468" change="+2.84%" />
          <Ticker symbol="TCS" value="₹3,892" change="+1.18%" />
          <Ticker symbol="INFY" value="₹1,742" change="-0.62%" negative />

        </div>

      </div>

    </header>
  );
}

function Ticker({
  symbol,
  value,
  change,
  negative = false,
}) {
  return (
    <div className="flex shrink-0 items-center gap-2">

      <span className="text-[9px] font-bold text-white/30">
        {symbol}
      </span>

      <span className="text-[10px] font-semibold text-white/55">
        {value}
      </span>

      <span
        className={`text-[9px] font-bold ${
          negative
            ? "text-red-300"
            : "text-emerald-300"
        }`}
      >
        {change}
      </span>

    </div>
  );
}

export default Navbar;