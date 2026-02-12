import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { useMutation, useQuery } from "@tanstack/react-query";
import { PackageOpen, Loader2, Trash2Icon } from "lucide-react";
import { PlayerService } from "./player.service";
import PlayerCreateButton from "./PlayerCreateButton";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { useState } from "react";

//COMPONENTE PER IL RECUPERO DEI GIOCATORI


const PlayerList = () => {

  //uso useQuery per poter usare il service Di player e per gestire eventuali errori e caricamenti
  const { data: players = [], isPending, isError, error, refetch } = useQuery({
    queryKey: ['players'],
    queryFn: PlayerService.list
  });
//Uso uno state per gestire l'apertura del dialog di errore
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  //Uso uno state per gestiire la sezione del player(id)
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);


  //uso la mutation per gestire l'eliminazione del player e chiude tutti i dialog 
  const { mutate, isPending: isDeleting } = useMutation({
    mutationFn: PlayerService.delete,
    onSuccess: () => {
      refetch(); 
      setConfirmDialogOpen(false); 
    },
    onError: () => {
      setErrorDialogOpen(true); 
      setConfirmDialogOpen(false); 
    }
  });

  //Gestisco se la lista giocatori è in caricamento
  if (isPending) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Loader2 className="animate-spin text-blue-500" size={36} />
          </EmptyMedia>
          <EmptyTitle className="text-lg text-white">Caricamento giocatori</EmptyTitle>
          <EmptyDescription className="text-gray-300">Attendi mentre carichiamo i profili ATP...</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  //Gestisco se c'è un errore nel recupero ddei giocatori
  if (isError) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <PackageOpen className="text-red-500" size={36} />
          </EmptyMedia>
          <EmptyTitle className="text-lg text-white">Errore imprevisto</EmptyTitle>
          <EmptyDescription className="text-gray-300">{error.message}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <button
            onClick={() => refetch()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
          >
            Riprova
          </button>
        </EmptyContent>
      </Empty>
    );
  }

  //se non ci sono giocatori nella lista torno direttamente un messaggio
  if (!players.length) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <PackageOpen className="text-blue-500" size={36} />
          </EmptyMedia>
          <EmptyTitle className="text-lg text-white">Nessun giocatore</EmptyTitle>
          <EmptyDescription className="text-gray-300">Creane uno subito!</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <PlayerCreateButton />
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/**Faccio un ciclo in base ai giocatori per creare una card con tutte le descrizioni dei giocatori */}
        {players.map((player) => (
          <Card
            key={player.id}
            className="group relative rounded-xl overflow-hidden border border-blue-800 shadow-lg hover:shadow-2xl transition-all bg-linear-to-b from-blue-900 via-blue-950 to-black"
          >
            <CardHeader className="px-6 pt-4">
              <CardTitle className="text-xl font-bold text-yellow-400 truncate drop-shadow-md">
                👤 {player.firstName} {player.lastName}
              </CardTitle>
              <CardContent className="text-gray-200 mt-2">
                <span className="px-2 py-1 bg-blue-700/20 rounded-full text-sm font-semibold">
                  🪪 FITP N°: {player.fitpCard}
                </span>
              </CardContent>
            </CardHeader>

            <CardFooter className="flex justify-end px-6 pb-4 pt-2">
              {/* Pulsante elimina giocatori */}
              <button
                className="flex items-center gap-2 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                onClick={() => {
                  setSelectedPlayerId(player.id);
                  setConfirmDialogOpen(true);
                }}
              >
                <Trash2Icon size={16} /> Elimina
              </button>
            </CardFooter>
          </Card>
        ))}

        <div className="mt-4 col-span-full flex justify-center">
          <PlayerCreateButton />
        </div>
      </div>

      {/* Creo un dialog per la  conferma eliminazione */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sei sicuro di eliminare questo giocatore?</AlertDialogTitle>
            <AlertDialogDescription>
              Questo giocatore potrebbe essere presente in alcune partite. L'azione rimuoverà il giocatore dall'elenco attivo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="px-4 py-2">Annulla</AlertDialogCancel>
            <AlertDialogAction
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              onClick={() => {
                if (selectedPlayerId) mutate(selectedPlayerId);
              }}
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="animate-spin h-4 w-4" /> : "Conferma"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog errore se non si può eliminare in caso del giocatore che è iscritto in qualche torneo dove vengono mostrati match con lui */}
      <AlertDialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Impossibile eliminare il giocatore</AlertDialogTitle>
            <AlertDialogDescription>
              Questo giocatore è presente nello storico dei tornei e non può essere eliminato.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setErrorDialogOpen(false)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Chiudi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PlayerList;
