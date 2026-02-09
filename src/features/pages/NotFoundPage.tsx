import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-50 to-green-100 px-4">
      
      {/* Codice 404 grande e moderno */}
      <h1 className="text-[12rem] sm:text-[14rem] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-green-500 animate-bounce">
        404
      </h1>

      {/* Messaggio */}
      <p className="mt-4 text-xl sm:text-2xl text-gray-700 font-semibold text-center max-w-md">
        Ops! La pagina che stai cercando non esiste.
      </p>

      {/* Bottone moderno */}
      <div className="mt-8">
        <Button
          nativeButton={false}
          className="bg-gradient-to-r from-teal-400 to-green-500 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:scale-105 hover:brightness-110 transition-all"
        >
          <Link to="/">Torna alla Home</Link>
        </Button>
      </div>
    </div>
  )
}

export default NotFoundPage
