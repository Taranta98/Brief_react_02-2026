import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { TournamentService } from "../tournament/tournament.service";
import { TennisMatchesService } from "../tennisMatches/tennisMatches.service";


const TournamentHistory = () => {
  const { data: tournaments = [], isLoading, isError } = useQuery({
    queryKey: ["tournaments"],
    queryFn: TournamentService.list,
  });

  if (isLoading) return <p>Caricamento storico tornei...</p>;
  if (isError) return <p>Errore nel caricamento storico.</p>;
  if (!tournaments.length) return <p>Nessun torneo completato.</p>;

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto mt-8">
      <h2 className="text-3xl font-bold text-yellow-400 text-center">
        Storico Tornei
      </h2>

      {tournaments
        .filter(t => t.winnerId) // solo tornei con vincitore
        .map(tournament => (
          <TournamentCard key={tournament.id} tournament={tournament} />
      ))}
    </div>
  );
};

const TournamentCard = ({ tournament }: { tournament: any }) => {
  // Fetch match finale per ottenere il vincitore popolato
  const { data: matches = [] } = useQuery({
    queryKey: ["tennis-matches", tournament.id],
    queryFn: () => TennisMatchesService.list(tournament.id),
  });

  const finalMatch = matches.find(m => m.matchNumber === 7);

  let winnerName = "TBD";

  if (finalMatch) {
    if (finalMatch.player1Id === tournament.winnerId) {
      winnerName = `${finalMatch.player1?.firstName} ${finalMatch.player1?.lastName}`;
    } else if (finalMatch.player2Id === tournament.winnerId) {
      winnerName = `${finalMatch.player2?.firstName} ${finalMatch.player2?.lastName}`;
    }
  }

  return (
    <Card className="bg-slate-900 border border-yellow-500/20">
      <CardHeader>
        <CardTitle className="text-yellow-400">{tournament.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-slate-200">
          🏆 Vincitore:{" "}
          <span className="font-semibold text-green-400">{winnerName}</span>
        </p>
      </CardContent>
    </Card>
  );
};

export default TournamentHistory;
