import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Markets from "./components/Markets";
import PortfolioOptimizer from "./components/PortfolioOptimizer";

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

        <PortfolioOptimizer />
      </main>
    </div>
  );
}

export default App;