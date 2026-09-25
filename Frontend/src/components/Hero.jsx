import {
  ArrowUpRight,
  Play,
  Sparkles,
  TrendingUp,
} from "lucide-react";

function Hero({ running, onRunOptimizer }) {
  return (
    <section className="relative overflow-hidden">

      {/* ================================================= */}
      {/* BACKGROUND GLOW */}
      {/* ================================================= */}

      <div className="pointer-events-none absolute left-1/2 top-[-100px] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-emerald-400/[0.06] blur-[120px] sm:h-[600px] sm:w-[850px] lg:h-[700px] lg:w-[1000px]" />

      <div className="pointer-events-none absolute right-[-250px] top-[35%] h-[400px] w-[400px] rounded-full bg-emerald-300/[0.025] blur-[120px] sm:h-[500px] sm:w-[500px]" />


      {/* ================================================= */}
      {/* HERO CONTAINER */}
      {/* ================================================= */}

      <div
        className="
          relative
          mx-auto
          flex
          min-h-[calc(100vh-145px)]
          max-w-[1500px]
          flex-col
          justify-center
          gap-14
          px-5
          py-16
          sm:px-8
          sm:py-20
          md:gap-16
          lg:grid
          lg:grid-cols-[1.05fr_0.95fr]
          lg:items-center
          lg:gap-14
          lg:px-10
          lg:py-20
          xl:gap-20
          xl:px-12
          xl:py-24
        "
      >

        {/* ================================================= */}
        {/* LEFT SIDE */}
        {/* ================================================= */}

        <div className="w-full max-w-4xl">


          {/* ================================================= */}
          {/* BADGE */}
          {/* ================================================= */}

          <div
            className="
              inline-flex
              max-w-full
              items-center
              gap-2
              rounded-full
              border
              border-emerald-300/20
              bg-emerald-300/[0.07]
              px-3
              py-2
              text-[9px]
              font-bold
              uppercase
              tracking-[0.15em]
              text-emerald-300
              sm:gap-2.5
              sm:px-4
              sm:text-[10px]
              sm:tracking-[0.18em]
              lg:text-[11px]
            "
          >

            <Sparkles
              size={13}
              className="shrink-0 sm:h-[15px] sm:w-[15px]"
            />

            <span className="truncate">
              AI Trading · Strategy Intelligence
            </span>

          </div>


          {/* ================================================= */}
          {/* MAIN HEADING */}
          {/* ================================================= */}

          <h1
            className="
              mt-6
              max-w-4xl
              font-display
              text-[46px]
              font-extrabold
              leading-[0.98]
              tracking-[-0.045em]
              sm:mt-7
              sm:text-6xl
              md:text-7xl
              lg:mt-8
              lg:text-[76px]
              xl:text-[92px]
              2xl:text-[100px]
            "
          >

            Trade with

            <span className="block text-emerald-300">
              better intelligence.
            </span>

          </h1>


          {/* ================================================= */}
          {/* DESCRIPTION */}
          {/* ================================================= */}

          <p
            className="
              mt-6
              max-w-2xl
              text-sm
              leading-6
              text-white/45
              sm:mt-7
              sm:text-base
              sm:leading-7
              md:text-lg
              md:leading-8
              lg:mt-8
            "
          >

            Explore market signals, analyze technical behavior,
            predict short-term returns and build optimized
            portfolios with a data-driven trading workspace.

          </p>


          {/* ================================================= */}
          {/* BUTTONS */}
          {/* ================================================= */}

          <div
            className="
              mt-8
              flex
              w-full
              flex-col
              gap-3
              sm:mt-9
              sm:flex-row
              sm:flex-wrap
            "
          >

            {/* PRIMARY */}

            <a
              href="#portfolio"
              onClick={onRunOptimizer}
              className="
                group
                flex
                min-h-[50px]
                w-full
                items-center
                justify-center
                gap-2.5
                rounded-xl
                bg-emerald-300
                px-5
                py-3.5
                text-sm
                font-bold
                text-[#07100d]
                transition-all
                duration-200
                hover:bg-emerald-200
                sm:w-auto
                sm:px-6
                sm:py-4
              "
            >

              <Play
                size={16}
                fill="currentColor"
                className="shrink-0"
              />

              <span>
                {running
                  ? "Optimizing..."
                  : "Launch Portfolio Lab"}
              </span>

              <ArrowUpRight
                size={17}
                className="
                  shrink-0
                  transition-transform
                  duration-200
                  group-hover:-translate-y-0.5
                  group-hover:translate-x-0.5
                "
              />

            </a>


            {/* SECONDARY */}

            <a
              href="#markets"
              className="
                flex
                min-h-[50px]
                w-full
                items-center
                justify-center
                rounded-xl
                border
                border-white/[0.09]
                bg-white/[0.02]
                px-5
                py-3.5
                text-sm
                font-semibold
                text-white/70
                transition
                hover:border-white/[0.16]
                hover:bg-white/[0.04]
                hover:text-white
                sm:w-auto
                sm:px-6
                sm:py-4
              "
            >

              Explore Markets

            </a>

          </div>


          {/* ================================================= */}
          {/* HERO STATS */}
          {/* ================================================= */}

          <div
            className="
              mt-10
              grid
              max-w-2xl
              grid-cols-3
              border-y
              border-white/[0.07]
              py-5
              sm:mt-12
              sm:py-6
              lg:mt-14
              lg:py-7
            "
          >

            <HeroStat
              value="5Y"
              label="Historical Data"
            />

            <HeroStat
              value="22+"
              label="ML Features"
            />

            <HeroStat
              value="50"
              label="GA Generations"
            />

          </div>

        </div>


        {/* ================================================= */}
        {/* RIGHT SIDE — PORTFOLIO CARD */}
        {/* ================================================= */}

        <div
          className="
            relative
            mx-auto
            w-full
            max-w-[570px]
            lg:max-w-[550px]
            xl:max-w-[590px]
          "
        >

          {/* OUTER GLOW */}

          <div
            className="
              pointer-events-none
              absolute
              inset-[-30px]
              rounded-full
              bg-emerald-300/[0.045]
              blur-[80px]
              sm:inset-[-50px]
              sm:blur-[100px]
            "
          />


          {/* ================================================= */}
          {/* CARD */}
          {/* ================================================= */}

          <div
            className="
              relative
              overflow-hidden
              rounded-[1.5rem]
              border
              border-white/[0.10]
              bg-[#0b1713]
              shadow-2xl
              shadow-black/50
              sm:rounded-[2rem]
              lg:rounded-[2.5rem]
            "
          >


            {/* ================================================= */}
            {/* CARD HEADER */}
            {/* ================================================= */}

            <div
              className="
                flex
                items-center
                justify-between
                gap-4
                border-b
                border-white/[0.07]
                px-5
                py-4
                sm:px-6
                sm:py-5
                lg:px-7
                lg:py-6
              "
            >

              <div className="min-w-0">

                <div
                  className="
                    text-[8px]
                    font-bold
                    uppercase
                    tracking-[0.18em]
                    text-white/25
                    sm:text-[9px]
                    lg:text-[10px]
                  "
                >
                  Portfolio Intelligence
                </div>

                <div
                  className="
                    mt-1
                    truncate
                    font-display
                    text-sm
                    font-bold
                    sm:text-base
                    lg:mt-2
                    lg:text-lg
                  "
                >
                  AI Optimized Portfolio
                </div>

              </div>


              {/* ACTIVE */}

              <div
                className="
                  flex
                  shrink-0
                  items-center
                  gap-1.5
                  rounded-full
                  border
                  border-emerald-300/10
                  bg-emerald-300/[0.08]
                  px-2.5
                  py-1.5
                  text-[8px]
                  font-bold
                  uppercase
                  tracking-[0.08em]
                  text-emerald-300
                  sm:px-3
                  sm:text-[9px]
                  lg:px-3.5
                  lg:py-2
                  lg:text-[10px]
                "
              >

                <span
                  className="
                    h-1.5
                    w-1.5
                    animate-pulse
                    rounded-full
                    bg-emerald-300
                    shadow-[0_0_10px_rgba(110,231,183,.8)]
                    sm:h-2
                    sm:w-2
                  "
                />

                ACTIVE

              </div>

            </div>


            {/* ================================================= */}
            {/* CARD INTRO */}
            {/* ================================================= */}

            <div className="px-5 pt-6 sm:px-6 sm:pt-7 lg:px-7 lg:pt-8">

              <div className="text-xs text-white/30 sm:text-sm">
                Portfolio Intelligence
              </div>


              <div className="mt-1 flex items-end gap-3 sm:mt-2 sm:gap-4">

                <div
                  className="
                    font-display
                    text-4xl
                    font-extrabold
                    tracking-tight
                    sm:text-5xl
                    lg:text-6xl
                  "
                >
                  AI
                </div>


                <div
                  className="
                    mb-1
                    flex
                    items-center
                    gap-1.5
                    text-xs
                    font-bold
                    text-emerald-300
                    sm:mb-2
                    sm:text-sm
                    lg:text-base
                  "
                >

                  <TrendingUp
                    size={14}
                    className="sm:h-[17px] sm:w-[17px]"
                  />

                  Data-driven

                </div>

              </div>

            </div>


            {/* ================================================= */}
            {/* PIPELINE */}
            {/* ================================================= */}

            <div className="px-5 pt-6 sm:px-6 sm:pt-7 lg:px-7 lg:pt-8">

              <div
                className="
                  mb-3
                  text-[8px]
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-white/25
                  sm:mb-4
                  sm:text-[9px]
                  lg:text-[10px]
                "
              >
                Analysis Pipeline
              </div>


              <div className="space-y-2 sm:space-y-3">

                <PipelineItem
                  number="01"
                  title="Market Data"
                  description="Historical price & volume"
                />

                <PipelineItem
                  number="02"
                  title="Technical Features"
                  description="RSI · MACD · Momentum · Volatility"
                />

                <PipelineItem
                  number="03"
                  title="Machine Learning"
                  description="Short-term return prediction"
                />

                <PipelineItem
                  number="04"
                  title="Genetic Algorithm"
                  description="Portfolio weight optimization"
                />

              </div>

            </div>


            {/* ================================================= */}
            {/* CHART */}
            {/* ================================================= */}

            <div
              className="
                relative
                mt-6
                h-32
                px-5
                sm:mt-7
                sm:h-40
                sm:px-6
                lg:mt-8
                lg:h-44
                lg:px-7
              "
            >

              <div
                className="
                  absolute
                  inset-x-5
                  inset-y-0
                  bg-[linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)]
                  bg-[size:20%_25%]
                  sm:inset-x-6
                  lg:inset-x-7
                "
              />


              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="
                  absolute
                  inset-x-5
                  h-full
                  w-[calc(100%-40px)]
                  sm:inset-x-6
                  sm:w-[calc(100%-48px)]
                  lg:inset-x-7
                  lg:w-[calc(100%-56px)]
                "
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
                      stopOpacity=".25"
                    />

                    <stop
                      offset="100%"
                      stopColor="#6ee7b7"
                      stopOpacity="0"
                    />

                  </linearGradient>

                </defs>


                <polygon
                  points="
                    0,100
                    0,80
                    8,76
                    16,79
                    24,67
                    32,70
                    40,58
                    48,61
                    56,48
                    64,52
                    72,39
                    80,42
                    88,27
                    94,30
                    100,16
                    100,100
                  "
                  fill="url(#heroGradient)"
                />


                <polyline
                  points="
                    0,80
                    8,76
                    16,79
                    24,67
                    32,70
                    40,58
                    48,61
                    56,48
                    64,52
                    72,39
                    80,42
                    88,27
                    94,30
                    100,16
                  "
                  fill="none"
                  stroke="#6ee7b7"
                  strokeWidth="1.4"
                  vectorEffect="non-scaling-stroke"
                />

              </svg>

            </div>


            {/* ================================================= */}
            {/* BOTTOM METRICS */}
            {/* ================================================= */}

            <div className="grid grid-cols-3 border-t border-white/[0.07]">

              <MiniStat
                label="ML Models"
                value="3"
              />

              <MiniStat
                label="Prediction"
                value="3 Days"
              />

              <MiniStat
                label="Optimization"
                value="50 Gen."
              />

            </div>

          </div>


          {/* ================================================= */}
          {/* FLOATING AI CARD */}
          {/* ================================================= */}

          <div
            className="
              absolute
              -bottom-5
              left-3
              rounded-xl
              border
              border-white/[0.10]
              bg-[#101d18]
              p-3
              shadow-2xl
              shadow-black/50
              sm:-bottom-6
              sm:left-4
              sm:rounded-2xl
              sm:p-4
              lg:-left-8
              lg:p-5
            "
          >

            <div
              className="
                text-[7px]
                font-bold
                uppercase
                tracking-[0.16em]
                text-white/25
                sm:text-[8px]
                lg:text-[9px]
              "
            >
              AI Engine
            </div>


            <div className="mt-1.5 flex items-center gap-2 sm:mt-2 sm:gap-3">

              <div
                className="
                  flex
                  h-7
                  w-7
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  bg-emerald-300/10
                  text-emerald-300
                  sm:h-9
                  sm:w-9
                  sm:rounded-xl
                "
              >

                <Sparkles
                  size={13}
                  className="sm:h-[17px] sm:w-[17px]"
                />

              </div>


              <div>

                <div
                  className="
                    whitespace-nowrap
                    text-[10px]
                    font-bold
                    sm:text-xs
                    lg:text-sm
                  "
                >
                  Optimization Ready
                </div>

                <div
                  className="
                    mt-0.5
                    whitespace-nowrap
                    text-[8px]
                    text-emerald-300
                    sm:text-[9px]
                    lg:text-[10px]
                  "
                >
                  ML + Genetic Algorithm
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}


// ========================================================
// HERO STAT
// ========================================================

function HeroStat({
  value,
  label,
}) {

  return (

    <div
      className="
        min-w-0
        border-r
        border-white/[0.07]
        px-2
        first:pl-0
        last:border-0
        sm:px-4
        lg:px-5
      "
    >

      <div
        className="
          font-display
          text-lg
          font-bold
          sm:text-xl
          lg:text-2xl
        "
      >
        {value}
      </div>


      <div
        className="
          mt-1
          truncate
          text-[7px]
          uppercase
          tracking-[0.10em]
          text-white/25
          sm:mt-2
          sm:text-[8px]
          sm:tracking-[0.12em]
          lg:text-[9px]
          lg:tracking-[0.14em]
        "
      >
        {label}
      </div>

    </div>

  );
}


// ========================================================
// PIPELINE ITEM
// ========================================================

function PipelineItem({
  number,
  title,
  description,
}) {

  return (

    <div
      className="
        flex
        items-center
        gap-3
        rounded-xl
        border
        border-white/[0.06]
        bg-white/[0.015]
        px-3
        py-2.5
        transition
        hover:border-emerald-300/15
        hover:bg-emerald-300/[0.02]
        sm:gap-4
        sm:rounded-2xl
        sm:px-4
        sm:py-3.5
      "
    >

      {/* NUMBER */}

      <div
        className="
          flex
          h-7
          w-7
          shrink-0
          items-center
          justify-center
          rounded-lg
          border
          border-emerald-300/10
          bg-emerald-300/[0.05]
          text-[8px]
          font-bold
          text-emerald-300
          sm:h-9
          sm:w-9
          sm:rounded-xl
          sm:text-[10px]
        "
      >
        {number}
      </div>


      {/* TEXT */}

      <div className="min-w-0 flex-1">

        <div
          className="
            truncate
            text-[10px]
            font-bold
            sm:text-xs
            lg:text-sm
          "
        >
          {title}
        </div>


        <div
          className="
            mt-0.5
            truncate
            text-[8px]
            text-white/30
            sm:text-[9px]
            lg:text-[10px]
          "
        >
          {description}
        </div>

      </div>


      {/* STATUS */}

      <div
        className="
          h-1.5
          w-1.5
          shrink-0
          rounded-full
          bg-emerald-300
          shadow-[0_0_10px_rgba(110,231,183,.7)]
          sm:h-2
          sm:w-2
        "
      />

    </div>

  );
}


// ========================================================
// MINI STAT
// ========================================================

function MiniStat({
  label,
  value,
}) {

  return (

    <div
      className="
        min-w-0
        px-3
        py-3.5
        sm:px-5
        sm:py-4
        lg:px-6
        lg:py-5
      "
    >

      <div
        className="
          truncate
          text-[7px]
          font-bold
          uppercase
          tracking-[0.12em]
          text-white/25
          sm:text-[8px]
          sm:tracking-[0.14em]
          lg:text-[9px]
        "
      >
        {label}
      </div>


      <div
        className="
          mt-1
          text-xs
          font-bold
          text-emerald-300
          sm:mt-2
          sm:text-sm
          lg:text-base
        "
      >
        {value}
      </div>

    </div>

  );
}


export default Hero;