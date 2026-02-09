import { Button } from "@/components/ui/button";
import PlayerCreateButton from "@/features/player/PlayerCreateButton";
import TournamentCreateButton from "@/features/tournament/TournamentCreateButton";
import { Home, Trophy, User } from "lucide-react";
import { Link, Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="flex h-screen bg-green-50">

      {/* Sidebar sinistra */}
      <aside className="w-72 flex flex-col h-screen p-6 shadow-lg"
             style={{
               background: "linear-gradient(180deg, #2a9d8f 0%, #52b788 60%, #d8f3dc 100%)"
             }}>
        
        {/* Logo Sidebar */}
        <div className="flex items-center gap-3 mb-8">
          <span className="text-4xl">🎾</span>
          <h2 className="text-2xl font-bold tracking-wide text-white drop-shadow-md">Tournament Manager</h2>
        </div>

        {/* Menu con scroll se necessario */}
        <nav className="flex-1 flex flex-col gap-4 overflow-y-auto">
          <Link
            to="/tournaments"
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/10 hover:bg-white/30 transition-colors font-semibold text-white"
          >
            <Home size={24}/> Tornei
          </Link>

          <Link
            to="/players"
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/10 hover:bg-white/30 transition-colors font-semibold text-white"
          >
            <User size={24}/> Giocatori
          </Link>

          <Link
            to="/tournaments"
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/10 hover:bg-white/30 transition-colors font-semibold text-white"
          >
            <Trophy size={24}/> Storico
          </Link>
        </nav>

        {/* Pulsanti azione sempre visibili */}
        <div className="mt-auto flex flex-col gap-3">
          <PlayerCreateButton />
          <TournamentCreateButton />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

    </div>
  );
};

export default MainLayout;
