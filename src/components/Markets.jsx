function Markets() {
  const stocks = [
    {
      name: "RELIANCE",
      company: "Reliance Industries",
      price: "₹1,468",
      change: "+2.84%",
      signal: "BUY",
    },
    {
      name: "TCS",
      company: "Tata Consultancy Services",
      price: "₹3,892",
      change: "+1.18%",
      signal: "BUY",
    },
    {
      name: "INFOSYS",
      company: "Infosys Limited",
      price: "₹1,742",
      change: "-0.62%",
      signal: "HOLD",
    },
    {
      name: "HDFC",
      company: "HDFC Bank",
      price: "₹1,890",
      change: "+0.43%",
      signal: "HOLD",
    },
  ];

  return (
    <section
      id="markets"
      className="border-t border-white/[0.07] bg-[#07100d] px-5 py-24 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">

        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

          <div>
            <div className="inline-flex rounded-full border border-emerald-300/15 bg-emerald-300/[0.06] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-300">
              Market Intelligence
            </div>

            <h2 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
              Explore the
              <span className="text-emerald-300">
                {" "}market.
              </span>
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-6 text-white/35">
              Review market movement and technical signals before building
              your optimized strategy.
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-300" />

              <span className="text-xs font-semibold text-white/50">
                Market Data
              </span>

              <span className="text-xs font-bold text-emerald-300">
                LIVE
              </span>
            </div>
          </div>

        </div>

        <div className="mt-10 overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0a1511]">

          <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] border-b border-white/[0.07] px-5 py-4 text-[9px] font-bold uppercase tracking-[0.16em] text-white/25 md:px-7">
            <span>Asset</span>
            <span>Price</span>
            <span>Change</span>
            <span>Signal</span>
          </div>

          {stocks.map((stock) => (
            <div
              key={stock.name}
              className="grid grid-cols-[1.5fr_1fr_1fr_1fr] items-center border-b border-white/[0.05] px-5 py-5 transition last:border-0 hover:bg-white/[0.025] md:px-7"
            >

              <div>
                <div className="text-sm font-bold">
                  {stock.name}
                </div>

                <div className="mt-1 text-[10px] text-white/25">
                  {stock.company}
                </div>
              </div>

              <div className="text-sm font-semibold text-white/70">
                {stock.price}
              </div>

              <div
                className={`text-sm font-bold ${
                  stock.change.startsWith("-")
                    ? "text-red-300"
                    : "text-emerald-300"
                }`}
              >
                {stock.change}
              </div>

              <div>
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-[9px] font-bold ${
                    stock.signal === "BUY"
                      ? "bg-emerald-300/10 text-emerald-300"
                      : "bg-white/[0.06] text-white/40"
                  }`}
                >
                  {stock.signal}
                </span>
              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Markets;