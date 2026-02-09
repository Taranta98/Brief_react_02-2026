import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
      
      {/* Titolo principale */}
      <h1 className="text-6xl sm:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-green-500 mb-4">
        Benvenuto!
      </h1>

      {/* Sottotitolo / frase */}
      <p className="text-xl sm:text-2xl text-gray-700 max-w-xl mb-8">
        Gestisci facilmente tornei e giocatori, monitora lo stato delle partite e tieni tutto sotto controllo. 🎾
      </p>

      {/* Bottone principale */}
      <Button
        nativeButton={false}
        className="bg-gradient-to-r from-teal-400 to-green-500 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:scale-105 hover:brightness-110 transition-all"
      >
        <Link to="/tournaments">Vedi i tornei</Link>
      </Button>
    </div>
  )
}

export default HomePage
