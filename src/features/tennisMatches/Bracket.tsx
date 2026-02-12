
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Tournament } from "@/features/tournament/tournament.type";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { TennisMatchesService } from "./tennisMatches.service";
import type { TennisMatches } from "./tennisMatches.type";


/**
 * TournamentBracket:
 * - Mostra il tabellone di un torneo (quarti, semifinali, finale)
 */

const TournamentBracket = () => {
  // Recupero i dati per trovare l'id del torneo in base alla pagina in cui mi trovo
  const location = useLocation();
  // Il torneo viene passato nello state della navigazione
  const tournament: Tournament | undefined = location.state?.tournament;
  const [editingMatches, setEditingMatches] = useState<number[]>([]);


  const queryClient = useQueryClient();

  // useState per memorizzare quali match sono stati confermati
  const [confirmedMatches, setConfirmedMatches] = useState<number[]>([]);

  // Se non c'è un torneo selezionato, return e mostra di selezionare un torneo
  if (!tournament)
    return <p className="text-center mt-10 text-yellow-400 font-semibold">
      Seleziona un torneo...
    </p>;


  // FETCH DEI MATCH

  const { data: matches = [], isLoading, isError } = useQuery<TennisMatches[]>({
    queryKey: ["tennis-matches", tournament.id],
    queryFn: () => TennisMatchesService.list(tournament.id),
    //imposto il retry su false cosi non ritenta di farlo
    retry: false,
  });



  // MUTATION PER AGGIORNARE UN MATCH

  const updateMatchMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Omit<TennisMatches, "id">> }) =>
      TennisMatchesService.update({ id, data }),


    onMutate: async ({ id, data }) => {
      // Cancello evantuali  fetch che sono in  corso
      await queryClient.cancelQueries({ queryKey: ["tennis-matches", tournament.id] });

      //
      const previousMatches = queryClient.getQueryData<TennisMatches[]>([
        "tennis-matches",
        tournament.id,
      ]);

      // Aggiorno la cache
      queryClient.setQueryData<TennisMatches[]>(["tennis-matches", tournament.id], (old = []) =>
        old.map((m) => (m.id === id ? { ...m, ...data } : m))
      );

      return { previousMatches };
    },

    // Nel caso un cui c'è un errore resetto allo stato precedente, _err = l’errore generato dalla mutation  vars=le variabili passate alla mutate ctx= { previousMatches })

    onError: (_err, _vars, ctx) => {
      if (ctx?.previousMatches) {
        queryClient.setQueryData(["tennis-matches", tournament.id], ctx.previousMatches);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tennis-matches", tournament.id] });
    },
  });


  /**
   * GESTIONE MODIFICA SCORE
   */

  const handleScoreChange = (match: TennisMatches, player: 1 | 2, value: string) => {
  // Permetto solo numeri da 0 a 2
  if (value !== "" && (!/^\d$/.test(value) || Number(value) > 2)) return;

  const numericValue = value === "" ? null : Number(value);

  // Aggiorna cache
  queryClient.setQueryData<TennisMatches[]>(["tennis-matches", tournament.id], (old = []) =>
    old.map((m) =>
      m.id === match.id
        ? player === 1
          ? { ...m, player1Score: numericValue }
          : { ...m, player2Score: numericValue }
        : m
    )
  );

  // Setta il match come in modifica
  if (!editingMatches.includes(match.id)) {
    setEditingMatches(prev => [...prev, match.id]);
  }
};

  /**
   * CONFERMA SCORE

   */
  const handleConfirmScore = (match: TennisMatches) => {

    const { player1Score, player2Score } = match;

    // VValido che tutti gli score siano inseriti
    if (player1Score === null || player2Score === null) {
      alert("Inserisci entrambi gli score prima di confermare!");
      return;
    }

    // Valido il lfatto che 2 giocatori non possano pareggiare
    if (player1Score === player2Score) {
      alert("Errore: uno dei due giocatori deve vincere (score diverso)!");
      return;
    }

    // Mutation per mandare i dati
    updateMatchMutation.mutate({
      id: match.id,
      data: {
        player1Score,
        player2Score,
        tournamentId: tournament.id,
      },
    });

    // Setto il match come confeermato
     setConfirmedMatches(prev => [...prev, match.id]);
  setEditingMatches(prev => prev.filter(id => id !== match.id));
  };


  /**
   * ANNULLA MODIFICA
   */
const handleCancelScore = (matchId: number) => {
  queryClient.invalidateQueries({ queryKey: ["tennis-matches", tournament.id] });
  setEditingMatches(prev => prev.filter(id => id !== matchId));
};

const isTournamentCompleted = (matches: TennisMatches[]) => {
  // Controlla il match finale (matchNumber === 7)
  const finalMatch = matches.find(m => m.matchNumber === 7);
  return finalMatch ? finalMatch.player1Score !== null && finalMatch.player2Score !== null : false;
};










  //In ccaso di caricamento
  if (isLoading)
    return <p className="text-center mt-10 text-yellow-400 font-semibold">
      Caricamento match...
    </p>;
  //in caso di errore
  if (isError)
    return <p className="text-center mt-10 text-red-500 font-semibold">
      Errore nel caricamento dei match
    </p>;
  //in caso in cui non ci sia nessuna partita
  if (!matches.length)
    return <p className="text-center mt-10 text-slate-400 font-medium">
      Nessuna partita trovata.
    </p>;


  /**
   * SUDDIVISIONE MATCH PER FASE IN BASE AL NUMERO DI PARTITA
   */

  //Assegno a quarti/semifinale/finale in base al numero di match
  const quarti = matches.filter((m) => m.matchNumber >= 1 && m.matchNumber <= 4);
  const semi = matches.filter((m) => m.matchNumber >= 5 && m.matchNumber <= 6);
  const finale = matches.filter((m) => m.matchNumber === 7);



  const renderMatchCard = (match: TennisMatches, title: string) => {

    const hasPlayers = match.player1Id && match.player2Id;

    // Mostra bottone conferma solo in alcune condizioni

 const showConfirm = editingMatches.includes(match.id) && !confirmedMatches.includes(match.id);
 


    return (
      <div key={match.id} className="flex flex-col gap-3">
        <Card
          className={cn(
            "w-72 border border-yellow-500/20 bg-linear-to-b from-slate-900 via-slate-950 to-black shadow-lg",
            showConfirm && "ring-2 ring-green-500",
            !hasPlayers && "opacity-50"
          )}
        >
          <CardHeader>
            {/* Titolo del matchE */}
            <CardTitle className="text-sm text-center text-yellow-400 font-bold">
              {title}
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col gap-3">

            {/* Ciclo su [1,2] per generare dinamicamente
            la riga del Player 1 e del Player 2 */}
            {[1, 2].map((p) => {

              // Determino se sto gestendo il Player 1
              const isP1 = p === 1;

              // Seleziono dinamicamente il giocatore corretto
              const player = isP1 ? match.player1 : match.player2;

              // Seleziono dinamicamente il punteggio corretto
              const score = isP1 ? match.player1Score : match.player2Score;

              return (
                <div key={p} className="flex justify-between items-center gap-4">

                  {/* Nome del giocatore
                  Se non presente mostro un placeholder */}
                  <span className="font-medium truncate flex-1 text-slate-100">
                    {player
                      ? `${player.firstName} ${player.lastName}`
                      : "TBD (aspettando il giocatore)"}
                  </span>

                  {/* Input numerico 
                  - min=0 e max=2 per vincolare il valore
                  - value controllato (controlled component)
                  - onChange richiama la funzione che aggiorna lo stato
                  - disabilitato se:
                    1) non ci sono entrambi i giocatori
                    2) è in corso una mutation (evita doppie richieste) */}
                  <Input
                    type="number"
                    min={0}
                    max={2}
                    value={score ?? ""}
                    onChange={(e) =>
                      handleScoreChange(match, p as 1 | 2, e.target.value)
                    }
                    className="w-20 text-center bg-slate-800 text-yellow-400 border border-yellow-500/20"
                      disabled={updateMatchMutation.isPending}
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Se showConfirm è true mostro i pulsanti di azione */}
        {showConfirm && (
          <div className="flex gap-2">

            {/* Bottone Conferma:
            - Salva definitivamente il punteggio
            - Richiama handleConfirmScore */}
            <Button
              onClick={() => handleConfirmScore(match)}
              className="flex-1 bg-yellow-500 text-slate-950 font-semibold hover:bg-yellow-400 transition-all gap-2"
            >
              <CheckCircle2 size={16} /> Conferma
            </Button>

            {/* Bottone Annulla:
            - Ripristina lo stato precedente
            - Richiama handleCancelScore passando l'id del match */}
            <Button
              onClick={() => handleCancelScore(match.id)}
              variant="destructive"
              className="flex-1 gap-2"
            >
              <XCircle size={16} /> Annulla
            </Button>
          </div>
        )}
      </div>
    );

  };



  return (
    <div className="flex flex-col items-center gap-10 mt-6 pb-10">
      <h2 className="text-3xl font-extrabold text-yellow-400 drop-shadow-lg">
        {tournament.name}
      </h2>

      <div className="flex flex-col gap-8 w-full max-w-7xl">

        <div>
          <h3 className="text-center text-xl font-bold text-yellow-300 mb-4">
            Quarti
          </h3>
          <div className="flex gap-8 flex-wrap justify-center">
            {quarti.map((m) =>
              renderMatchCard(m, `Quarto ${m.matchNumber}`)
            )}
          </div>
        </div>

        <div>
          <h3 className="text-center text-xl font-bold text-yellow-300 mb-4">
            Semifinali
          </h3>
          <div className="flex gap-24 flex-wrap justify-center">
            {semi.map((m) =>
              renderMatchCard(m, `Semifinale ${m.matchNumber - 4}`)
            )}
          </div>
        </div>

        <div>
          <h3 className="text-center text-xl font-bold text-yellow-300 mb-4">
            Finale
          </h3>
          <div className="flex justify-center">
            {finale.map((m) =>
              renderMatchCard(m, "Finale")
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default TournamentBracket;
