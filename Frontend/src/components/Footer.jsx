import {
  BrainCircuit,
  Github,
  Linkedin,
} from "lucide-react";

function Footer() {
  return (
    <footer className="border-t border-white/[0.07]">

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-8 sm:flex-row sm:items-center sm:justify-between lg:px-8">

        <div className="flex items-center gap-3">

          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-300/10 text-emerald-300">
            <BrainCircuit size={18} />
          </div>

          <div>
            <div className="font-display text-sm font-bold">
              QUANT<span className="text-emerald-300">GEN</span>
            </div>

            <div className="text-[10px] text-white/25">
              Adaptive trading intelligence
            </div>
          </div>

        </div>

        <div className="text-xs text-white/25">
          Built with React · Tailwind · Python
        </div>

        <div className="flex items-center gap-3">

          <a
            href="#"
            className="text-white/30 transition hover:text-white"
          >
            <Github size={17} />
          </a>

          <a
            href="#"
            className="text-white/30 transition hover:text-white"
          >
            <Linkedin size={17} />
          </a>

        </div>

      </div>

    </footer>
  );
}

export default Footer;