
export type PlayerData = {
  id: number;
  firstName: string;
  lastName: string;
};


export type TennisMatches = {
    id: number;
    tournamentId: number;
    player1Id: number;
    player2Id: number;
    player1Score: number;
    player2Score: number;
    winnerId: number;
    nextMatchId: number;
    matchNumber: number;
    state: string;
      player1?: PlayerData; // <-- aggiunto
  player2?: PlayerData; 
}

export type ServerTennisMatches = {
    id: number;
    tournament_id: number;
    player1_id: number;
    player2_id: number;
    player1_score: number;
    player2_score: number;
    winner_id: number;
    next_match_id: number;
    match_number: number;
    state: string;
    player1?: { id: number, first_name: string, last_name: string };
    player2?: { id: number, first_name: string, last_name: string };
}

export function serverTennisMatchesToTennisMatches(input: ServerTennisMatches): TennisMatches {
    return {
        id: input.id,
        tournamentId: input.tournament_id,
        player1Id: input.player1_id,
        player2Id: input.player2_id,
        player1Score: input.player1_score,
        player2Score: input.player2_score,
        winnerId: input.winner_id,
        nextMatchId: input.next_match_id,
        matchNumber: input.match_number,
        state: input.state,
        player1: input.player1 ? {
            id: input.player1.id,
            firstName: input.player1.first_name,
            lastName: input.player1.last_name
        } : undefined,
        player2: input.player2 ? {
            id: input.player2.id,
            firstName: input.player2.first_name,
            lastName: input.player2.last_name
        } : undefined
    };
}


export function tennisMatchesToServerTennisMatches(input: Omit<TennisMatches, 'id'>): Omit<ServerTennisMatches, 'id'> {
    return {
       tournament_id : input.tournamentId ?? null,
      player1_id : input.player1Id ?? null,
      player2_id : input.player2Id ?? null,
      player1_score: input.player1Score ?? null,
      player2_score: input.player2Score ?? null,
      winner_id: input.winnerId ?? null,
      next_match_id: input.nextMatchId ?? null,
      match_number: input.matchNumber ?? 0,
      state: input.state ?? 'scheduled'

    }
} 
