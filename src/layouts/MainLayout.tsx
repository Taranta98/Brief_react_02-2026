

import PlayerCreateButton from "@/features/player/PlayerCreateButton";
import TournamentCreateButton from "@/features/tournament/TournamentCreateButton";
import { Home, Trophy, User } from "lucide-react";
import { Link, Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="flex h-screen bg-slate-950 text-slate-100">

    {/*Gestisco la sibar a sinistra*/}
      <aside
        className="w-72 flex flex-col h-screen p-8 shadow-2xl border-r border-yellow-500/20"
        style={{
          background:
            "linear-gradient(180deg, #0b132b 0%, #1c2541 50%, #3a506b 100%)"
        }}
      >
        
        {/* Logo sidebar */}
        <div className="flex items-center gap-4 mb-12">
          <span className="text-4xl drop-shadow-lg">🎾</span>
          <h2 className="text-2xl font-extrabold tracking-widest uppercase text-yellow-400">
            ATP Manager
          </h2>
        </div>

        {/* Menu dove gestisco i collegamenti alle diverse pagine*/}
        <nav className="flex-1 flex flex-col gap-5 overflow-y-auto">
          <Link
            to="/tournaments"
            className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/5 hover:bg-yellow-500/10 hover:text-yellow-400 transition-all duration-200 font-semibold tracking-wide border border-transparent hover:border-yellow-500/40"
          >
            <Home size={22}/> Tornei
          </Link>

          <Link
            to="/players"
            className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/5 hover:bg-yellow-500/10 hover:text-yellow-400 transition-all duration-200 font-semibold tracking-wide border border-transparent hover:border-yellow-500/40"
          >
            <User size={22}/> Giocatori
          </Link>

          <Link
            to="/history"
            className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/5 hover:bg-yellow-500/10 hover:text-yellow-400 transition-all duration-200 font-semibold tracking-wide border border-transparent hover:border-yellow-500/40"
          >
            <Trophy size={22}/> Storico
          </Link>
        </nav>

        {/* Pulsanti di creazione Giocatore e Torneo (rimangono visibili) */}
        <div className="mt-auto flex flex-col gap-4 pt-6 border-t border-yellow-500/20">
          <PlayerCreateButton />
          <TournamentCreateButton />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-10 overflow-auto bg-linear-to-b from-slate-900 via-slate-950 to-black">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

    </div>
  );
};

export default MainLayout;
