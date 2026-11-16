import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Markets from "./components/Markets";
import PortfolioOptimizer from "./components/PortfolioOptimizer";
import Tracker from "./components/Tracker";
import AuthModal from "./components/AuthModal";
import { supabase } from "./lib/supabase";

function App() {
  const [session, setSession] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  useEffect(() => {
    let alive = true;
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) console.error("Supabase session error:", error);
      if (alive) { setSession(data?.session ?? null); setAuthReady(true); }
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession); setAuthReady(true);
    });
    return () => { alive = false; listener.subscription.unsubscribe(); };
  }, []);
  const user = session?.user ?? null;
  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split("@")[0] || user?.phone || "User";
  async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Logout failed:", error);
    else window.scrollTo({ top: 0, behavior: "smooth" });
  }
  return <div id="top" className="min-h-screen bg-[#07100d] text-white">
    <Navbar currentUser={user ? { name: userName } : null} onLogin={() => setAuthOpen(true)} onLogout={logout} />
    <main><Hero /><Markets /><PortfolioOptimizer />{authReady && user && <Tracker userId={user.id} />}</main>
    {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
  </div>;
}
export default App;
