import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { Trophy, User } from "lucide-react"

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 text-slate-100">

      {/* Titolo principale */}
      <h1 className="text-6xl sm:text-7xl font-extrabold uppercase tracking-wide text-yellow-400 drop-shadow-lg mb-4">
        Benvenuto su ATP Manager
      </h1>
      {/* Bottone principale */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          nativeButton={false}
          className="flex items-center gap-2 bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-400 font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-200 hover:scale-105"
        >
          <Trophy size={20} /> Tornei
          <Link to="/tournaments" className="absolute "/>
        </Button>

        <Button
          nativeButton={false}
          className="flex items-center gap-2 bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-400 font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-200 hover:scale-105"
        >
          <User size={20} /> Giocatori
          <Link to="/players" className="absolute "/>
        </Button>
      </div>

      {/* Sfondo decorativo */}
      <div className="absolute  -z-10 bg-linear-to-br from-slate-900 via-slate-950 to-black opacity-60"></div>
    </div>
  )
}

export default HomePage
