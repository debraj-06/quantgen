import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Markets from "./components/Markets";
import StrategyLab from "./components/StrategyLab";

function App() {
  return (
    <div
      id="top"
      className="min-h-screen bg-[#07100d] text-white"
    >
      <Navbar />

      <main>
        <Hero />
        <Markets />
        <StrategyLab />
      </main>
    </div>
  );
}

export default App;