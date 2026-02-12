import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">

      {/* Codice 404 grande con gradiente coerente al layout */}
      <h1 className="text-[10rem] sm:text-[12rem] font-extrabold tracking-widest 
                     text-transparent bg-clip-text 
                     bg-linear-to-r from-yellow-400 via-yellow-500 to-yellow-600 
                     drop-shadow-lg">
        404
      </h1>

      {/* Icona di supporto visivo */}
      <AlertTriangle size={48} className="text-yellow-500 mt-2" />

      {/* Messaggio principale */}
      <h2 className="mt-6 text-2xl sm:text-3xl font-bold text-slate-100">
        Pagina non trovata
      </h2>

      <p className="mt-3 text-slate-400 max-w-md">
        La risorsa che stai cercando non esiste oppure è stata rimossa.
        Controlla l'URL oppure torna alla dashboard principale.
      </p>

      {/* Pulsante coerente con il design del progetto */}
      <div className="mt-8">
        <Button
          nativeButton={false}
          className="bg-yellow-500 text-slate-950 font-semibold 
                     hover:bg-yellow-400 transition-all px-6 py-3"
        >
          <Link to="/tournaments">
            Torna ai Tornei
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
