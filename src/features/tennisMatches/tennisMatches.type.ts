
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
        state: input.state
    }
};

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
