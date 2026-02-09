import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TennisMatchesService } from "./tennisMatches.service";
import type { Tournament } from "@/features/tournament/tournament.type";
import type { TennisMatches } from "./tennisMatches.type";

const TournamentBracket: React.FC = () => {
  const location = useLocation();
  const tournament: Tournament | undefined = location.state?.tournament;

  const queryClient = useQueryClient();
  const [matches, setMatches] = useState<TennisMatches[]>([]);

  if (!tournament) return <p>Seleziona un torneo...</p>;

  const { data: fetchedMatches = [], isLoading, isError } = useQuery<TennisMatches[]>({
    queryKey: ["tennis-matches", tournament.id],
    queryFn: () => TennisMatchesService.list(tournament.id),
    retry: false,
  });

  useEffect(() => {
    setMatches(fetchedMatches);
  }, [fetchedMatches]);

  const updateMatchMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Omit<TennisMatches, "id">> }) =>
      TennisMatchesService.update({ id, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tennis-matches", tournament.id] });
    },
  });

  const handleScoreChange = (matchId: number, player: 1 | 2, value: string) => {
    const numericValue = value === "" ? 0 : Number(value);
    setMatches((prev) =>
      prev.map((m) =>
        m.id === matchId
          ? player === 1
            ? { ...m, player1Score: numericValue }
            : { ...m, player2Score: numericValue }
          : m
      )
    );

    const match = matches.find((m) => m.id === matchId);
    if (match) {
      const updatedData = player === 1 ? { player1Score: numericValue } : { player2Score: numericValue };
      updateMatchMutation.mutate({ id: match.id, data: updatedData });
    }
  };

  if (isLoading) return <p>Caricamento match...</p>;
  if (isError) return <p>Errore nel caricamento dei match</p>;
  if (!fetchedMatches.length) return <p>Nessuna partita trovata per questo torneo.</p>;

  const quarti = matches.filter((m) => m.matchNumber <= 4);
  const semi = matches.filter((m) => m.matchNumber > 4 && m.matchNumber <= 6);
  const finale = matches.filter((m) => m.matchNumber === 7);

  const cardSize = "w-72 h-40"; // Tutte le card hanno le stesse dimensioni

  return (
    <div className="flex flex-col items-center gap-6 mt-6">
      {/* Info torneo */}
      <div className="mb-6 p-4 bg-gradient-to-r from-teal-500 to-green-500 text-white rounded-lg shadow-lg w-full max-w-sm text-center">
        <h2 className="text-lg font-bold truncate">{tournament.name}</h2>
        <p className="text-sm mt-1">
          Stato:{" "}
          <span
            className={cn(
              tournament.state === "in corso" ? "text-green-200" : "text-yellow-200",
              "font-semibold"
            )}
          >
            {tournament.state}
          </span>
        </p>
      </div>

      {/* Quarti di finale */}
      <div className="flex justify-center gap-8">
        {quarti.map((match) => (
          <Card key={match.id} className={cardSize}>
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-center">Quarti</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {[1, 2].map((playerNumber) => {
                const player = playerNumber === 1 ? match.player1 : match.player2;
                const score = playerNumber === 1 ? match.player1Score : match.player2Score;
                return (
                  <div key={playerNumber} className="flex justify-between items-center gap-4">
                    <span className="font-medium text-lg truncate">{player?.firstName} {player?.lastName}</span>
                    <Input
                      type="number"
                      value={score}
                      onChange={(e) => handleScoreChange(match.id, playerNumber as 1 | 2, e.target.value)}
                      className="w-20 text-center"
                      placeholder="0"
                    />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Semifinali */}
      <div className="flex justify-center gap-24 mt-10">
        {semi.map((match) => (
          <Card key={match.id} className={cardSize}>
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-center">Semifinale</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {[1, 2].map((playerNumber) => {
                const player = playerNumber === 1 ? match.player1 : match.player2;
                const score = playerNumber === 1 ? match.player1Score : match.player2Score;
                return (
                  <div key={playerNumber} className="flex justify-between items-center gap-4">
                    <span className="font-medium text-lg truncate">{player?.firstName} {player?.lastName}</span>
                    <Input
                      type="number"
                      value={score}
                      onChange={(e) => handleScoreChange(match.id, playerNumber as 1 | 2, e.target.value)}
                      className="w-20 text-center"
                      placeholder="0"
                    />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Finale */}
      <div className="flex justify-center mt-12">
        {finale.map((match) => (
          <Card key={match.id} className={cardSize}>
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-center">Finale</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {[1, 2].map((playerNumber) => {
                const player = playerNumber === 1 ? match.player1 : match.player2;
                const score = playerNumber === 1 ? match.player1Score : match.player2Score;
                return (
                  <div key={playerNumber} className="flex justify-between items-center gap-4">
                    <span className="font-medium text-lg truncate">{player?.firstName} {player?.lastName}</span>
                    <Input
                      type="number"
                      value={score}
                      onChange={(e) => handleScoreChange(match.id, playerNumber as 1 | 2, e.target.value)}
                      className="w-20 text-center"
                      placeholder="0"
                    />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TournamentBracket;
