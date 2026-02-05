import { Button } from "@/components/ui/button";
import PlayerCreateButton from "@/features/player/PlayerCreateButton";
import TournamentCreateButton from "@/features/tournament/TournamentCreateButton";
import { Home, Trophy, User } from "lucide-react"; // icone lucide
import { Link, Outlet } from "react-router-dom";

const MainLayout = () => {


  return (
    <div className="min-h-screen flex flex-col bg-gray-100">


      <header className="bg-blue-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">🏆  Tournament Manager</h1>
          <div className="flex items-center gap-4">
            <PlayerCreateButton />
          <TournamentCreateButton/>
          </div>
        </div>
      </header>

      <div className="flex flex-1">

        <aside className="w-64 bg-white shadow-md p-4 flex flex-col gap-3">
          <Button

            nativeButton={false}
            render={<Link to="/tournaments" />}
            className="w-full flex items-center gap-2 text-left"
          >
            <Home/> Tornei
          </Button>

          <Button
            nativeButton={false}
            render={<Link to="/players" />}
            className="w-full flex items-center gap-2 text-left"
          >
            <User/> Giocatori
          </Button>

          <Button
            nativeButton={false}
            render={<Link to="/tournaments" />}
            className="w-full flex items-center gap-2 text-left"
          >
            <Trophy/> Storico
          </Button>
        </aside>

        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
