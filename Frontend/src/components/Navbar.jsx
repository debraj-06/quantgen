import {
  Activity,
  ArrowUpRight,
  Menu,
  X,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  getIndices,
} from "../services/marketApi";


function Navbar() {

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [indices, setIndices] =
    useState([]);

  const [indexError, setIndexError] =
    useState(false);


  // ======================================================
  // NAVIGATION LINKS
  // ======================================================

  const links = [
    {
      name: "Markets",
      href: "#markets",
    },
    {
      name: "Portfolio",
      href: "#portfolio",
    },
  ];


  // ======================================================
  // LOAD LIVE INDEX DATA
  // ======================================================

  async function loadIndices() {

    try {

      setIndexError(false);

      const data = await getIndices();

      setIndices(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.error(
        "Failed to load index data:",
        error
      );

      setIndexError(true);

    }

  }


  // ======================================================
  // INITIAL LOAD + AUTO REFRESH
  // ======================================================

  useEffect(() => {

    loadIndices();

    const interval = setInterval(
      loadIndices,
      30000
    );

    return () => {
      clearInterval(interval);
    };

  }, []);


  // ======================================================
  // FIND NIFTY
  // ======================================================

  const nifty =
    indices.find(
      (item) =>
        String(item?.name)
          .toUpperCase()
          .includes("NIFTY")
    );


  // ======================================================
  // FIND SENSEX
  // ======================================================

  const sensex =
    indices.find(
      (item) =>
        String(item?.name)
          .toUpperCase()
          .includes("SENSEX")
    );


  return (

    <header
      className="
        sticky
        top-0
        z-50
        w-full
        overflow-x-hidden
        border-b
        border-white/[0.07]
        bg-[#07100d]/95
        backdrop-blur-2xl
      "
    >

      {/* ================================================== */}
      {/* MAIN NAVBAR */}
      {/* ================================================== */}

      <div
        className="
          mx-auto
          w-full
          max-w-[1500px]
          px-4
          sm:px-6
          lg:px-10
        "
      >

        <div
          className="
            flex
            h-[72px]
            items-center
            justify-between
            gap-3
            sm:h-[80px]
            lg:h-[88px]
          "
        >

          {/* ================================================== */}
          {/* BRAND */}
          {/* ================================================== */}

          <a
            href="#top"
            className="
              flex
              min-w-0
              shrink
              items-center
            "
            onClick={() =>
              setMobileOpen(false)
            }
          >

            <div className="min-w-0">

              {/* BRAND NAME */}

              <div
                className="
                  whitespace-nowrap
                  text-[19px]
                  font-black
                  tracking-tight
                  sm:text-[22px]
                  lg:text-2xl
                "
              >

                QUANT
                <span className="text-emerald-300">
                  GEN
                </span>

              </div>


              {/* TAGLINE */}

              <div
                className="
                  mt-0.5
                  hidden
                  whitespace-nowrap
                  text-[7px]
                  font-semibold
                  uppercase
                  tracking-[0.20em]
                  text-white/25
                  sm:block
                  sm:text-[8px]
                  lg:text-[9px]
                  lg:tracking-[0.24em]
                "
              >

                Adaptive Trading Intelligence

              </div>

            </div>

          </a>


          {/* ================================================== */}
          {/* DESKTOP NAVIGATION */}
          {/* ================================================== */}

          <nav
            className="
              hidden
              items-center
              gap-1
              lg:flex
            "
          >

            {links.map(
              (link) => (

                <a
                  key={link.name}
                  href={link.href}
                  className="
                    rounded-xl
                    px-4
                    py-3
                    text-sm
                    font-semibold
                    text-white/45
                    transition
                    hover:bg-white/[0.04]
                    hover:text-white
                    xl:px-5
                  "
                >

                  {link.name}

                </a>

              )
            )}

          </nav>


          {/* ================================================== */}
          {/* RIGHT DESKTOP AREA */}
          {/* ================================================== */}

          <div
            className="
              hidden
              items-center
              gap-3
              lg:flex
            "
          >

            {/* LIVE MARKET STATUS */}

            <div
              className="
                flex
                items-center
                gap-2
                rounded-full
                border
                border-white/[0.08]
                bg-white/[0.025]
                px-3
                py-2
                xl:px-4
              "
            >

              <span
                className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-emerald-300
                  shadow-[0_0_10px_rgba(110,231,183,.8)]
                  xl:h-2
                  xl:w-2
                "
              />

              <span
                className="
                  text-[8px]
                  font-bold
                  uppercase
                  tracking-[0.10em]
                  text-white/40
                  xl:text-[10px]
                  xl:tracking-[0.14em]
                "
              >

                Live Market Data

              </span>

            </div>


            {/* NIFTY MINI */}

            <IndexMini
              index={nifty}
            />


            {/* LAUNCH LAB */}

            <a
              href="#portfolio"
              className="
                group
                flex
                items-center
                gap-2
                rounded-full
                bg-emerald-300
                px-5
                py-3
                text-xs
                font-bold
                text-[#07100d]
                transition
                hover:bg-emerald-200
                xl:px-6
                xl:text-sm
              "
            >

              Launch Lab

              <ArrowUpRight
                size={15}
                className="
                  transition-transform
                  group-hover:-translate-y-0.5
                  group-hover:translate-x-0.5
                "
              />

            </a>

          </div>


          {/* ================================================== */}
          {/* MOBILE HAMBURGER */}
          {/* ================================================== */}

          <button
            type="button"
            onClick={() =>
              setMobileOpen(
                (current) => !current
              )
            }
            aria-label={
              mobileOpen
                ? "Close navigation"
                : "Open navigation"
            }
            aria-expanded={mobileOpen}
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-white/[0.09]
              bg-white/[0.025]
              text-white/70
              transition
              hover:border-emerald-300/20
              hover:bg-emerald-300/[0.05]
              hover:text-emerald-300
              lg:hidden
              sm:h-11
              sm:w-11
            "
          >

            {mobileOpen ? (
              <X size={20} />
            ) : (
              <Menu size={20} />
            )}

          </button>

        </div>

      </div>


      {/* ================================================== */}
      {/* MOBILE MENU */}
      {/* ================================================== */}

      {mobileOpen && (

        <div
          className="
            border-t
            border-white/[0.07]
            bg-[#07100d]
            lg:hidden
          "
        >

          <div
            className="
              mx-auto
              w-full
              max-w-[1500px]
              px-4
              py-4
              sm:px-6
            "
          >

            <nav className="flex flex-col gap-1">

              {/* MARKETS */}

              <a
                href="#markets"
                onClick={() =>
                  setMobileOpen(false)
                }
                className="
                  flex
                  items-center
                  justify-between
                  rounded-xl
                  px-4
                  py-4
                  text-sm
                  font-semibold
                  text-white/60
                  transition
                  hover:bg-white/[0.04]
                  hover:text-white
                "
              >

                Markets

                <ArrowUpRight size={16} />

              </a>


              {/* PORTFOLIO */}

              <a
                href="#portfolio"
                onClick={() =>
                  setMobileOpen(false)
                }
                className="
                  flex
                  items-center
                  justify-between
                  rounded-xl
                  px-4
                  py-4
                  text-sm
                  font-semibold
                  text-white/60
                  transition
                  hover:bg-white/[0.04]
                  hover:text-white
                "
              >

                Portfolio

                <ArrowUpRight size={16} />

              </a>


              {/* LAUNCH LAB */}

              <a
                href="#portfolio"
                onClick={() =>
                  setMobileOpen(false)
                }
                className="
                  mt-2
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-emerald-300
                  px-4
                  py-3.5
                  text-sm
                  font-bold
                  text-[#07100d]
                  transition
                  hover:bg-emerald-200
                "
              >

                Launch Lab

                <ArrowUpRight size={16} />

              </a>


              {/* MOBILE LIVE STATUS */}

              <div
                className="
                  mt-2
                  flex
                  items-center
                  justify-center
                  gap-2
                  py-3
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.15em]
                  text-white/25
                "
              >

                <span
                  className="
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-emerald-300
                    shadow-[0_0_10px_rgba(110,231,183,.8)]
                  "
                />

                Live Market Data

              </div>

            </nav>

          </div>

        </div>

      )}


      {/* ================================================== */}
      {/* MARKET PULSE */}
      {/* ================================================== */}

      <div
        className="
          w-full
          border-t
          border-white/[0.06]
          bg-[#09130f]
        "
      >

        <div
          className="
            scrollbar-none
            mx-auto
            flex
            h-[58px]
            w-full
            max-w-[1500px]
            items-center
            gap-6
            overflow-x-auto
            overflow-y-hidden
            px-4
            sm:h-[64px]
            sm:gap-8
            sm:px-6
            lg:h-[72px]
            lg:gap-12
            lg:px-12
          "
        >

          {/* MARKET PULSE LABEL */}

          <div
            className="
              flex
              shrink-0
              items-center
              gap-2
              sm:gap-3
            "
          >

            <span
              className="
                h-2
                w-2
                shrink-0
                rounded-full
                bg-emerald-300
                shadow-[0_0_10px_rgba(110,231,183,.8)]
                sm:h-2.5
                sm:w-2.5
              "
            />

            <span
              className="
                text-[9px]
                font-bold
                uppercase
                tracking-[0.16em]
                text-white/40
                sm:text-[10px]
                sm:tracking-[0.20em]
                lg:text-[12px]
                lg:tracking-[0.22em]
              "
            >

              Market Pulse

            </span>

          </div>


          {/* DIVIDER */}

          <div
            className="
              h-7
              w-px
              shrink-0
              bg-white/[0.08]
              sm:h-8
            "
          />


          {/* NIFTY */}

          {nifty ? (

            <Ticker
              index={nifty}
            />

          ) : (

            <LoadingTicker
              name="NIFTY 50"
            />

          )}


          {/* DIVIDER */}

          <div
            className="
              h-7
              w-px
              shrink-0
              bg-white/[0.08]
              sm:h-8
            "
          />


          {/* SENSEX */}

          {sensex ? (

            <Ticker
              index={sensex}
            />

          ) : (

            <LoadingTicker
              name="SENSEX"
            />

          )}


          {/* ERROR */}

          {indexError && (

            <span
              className="
                shrink-0
                text-[9px]
                text-red-300/70
              "
            >

              Live data unavailable

            </span>

          )}

        </div>

      </div>

    </header>

  );
}


// ========================================================
// DESKTOP NIFTY MINI
// ========================================================

function IndexMini({
  index,
}) {

  if (
    !index ||
    index.price === null ||
    index.price === undefined
  ) {

    return null;

  }


  const positive =
    Number(
      index.change_percent
    ) >= 0;


  return (

    <div
      className="
        hidden
        items-center
        gap-2
        xl:flex
      "
    >

      <Activity
        size={15}
        className={
          positive
            ? "text-emerald-300"
            : "text-red-300"
        }
      />


      <div>

        <div
          className="
            text-[8px]
            font-bold
            uppercase
            tracking-[0.10em]
            text-white/25
          "
        >

          NIFTY 50

        </div>


        <div
          className={
            `text-[11px] font-bold ${
              positive
                ? "text-emerald-300"
                : "text-red-300"
            }`
          }
        >

          {positive ? "+" : ""}

          {Number(
            index.change_percent
          ).toFixed(2)}

          %

        </div>

      </div>

    </div>

  );
}


// ========================================================
// MARKET TICKER
// ========================================================

function Ticker({
  index,
}) {

  if (
    !index ||
    index.price === null ||
    index.price === undefined
  ) {

    return null;

  }


  const positive =
    Number(
      index.change_percent
    ) >= 0;


  return (

    <div
      className="
        flex
        shrink-0
        items-center
        gap-2
        sm:gap-3
        lg:gap-4
      "
    >

      {/* INDEX NAME */}

      <span
        className="
          text-[9px]
          font-bold
          uppercase
          tracking-[0.08em]
          text-white/40
          sm:text-[10px]
          sm:tracking-[0.10em]
          lg:text-[12px]
          lg:tracking-[0.12em]
        "
      >

        {index.name}

      </span>


      {/* INDEX VALUE */}

      <span
        className="
          text-[13px]
          font-bold
          text-white/75
          sm:text-[14px]
          lg:text-[16px]
        "
      >

        {formatNumber(
          index.price
        )}

      </span>


      {/* PERCENTAGE CHANGE */}

      <span
        className={
          `
            rounded-full
            px-2
            py-1
            text-[9px]
            font-bold
            sm:px-2.5
            sm:text-[10px]
            lg:text-[12px]
          ` +
          (
            positive
              ? " bg-emerald-300/10 text-emerald-300"
              : " bg-red-300/10 text-red-300"
          )
        }
      >

        {positive ? "+" : ""}

        {Number(
          index.change_percent
        ).toFixed(2)}

        %

      </span>

    </div>

  );
}


// ========================================================
// LOADING TICKER
// ========================================================

function LoadingTicker({
  name,
}) {

  return (

    <div
      className="
        flex
        shrink-0
        items-center
        gap-3
      "
    >

      <span
        className="
          text-[9px]
          font-bold
          uppercase
          tracking-[0.10em]
          text-white/30
          sm:text-[10px]
        "
      >

        {name}

      </span>


      <span
        className="
          text-[10px]
          text-white/20
        "
      >

        Loading...

      </span>

    </div>

  );
}


// ========================================================
// NUMBER FORMATTER
// ========================================================

function formatNumber(
  value
) {

  return new Intl.NumberFormat(
    "en-IN",
    {
      maximumFractionDigits: 2,
    }
  ).format(
    Number(value)
  );

}


export default Navbar;