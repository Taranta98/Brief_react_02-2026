
export type TournamentPlayers = {
    playerId : number;
    tournamentId : number;
    eliminated?: string;
}

export type ServerTournamentPlayers = {
    player_id : number;
    tournament_id : number;
    eliminated? : string;
}

export function serverTptoTournamentPlayers(input: ServerTournamentPlayers): TournamentPlayers {
    return {
        playerId: input.player_id,
        tournamentId: input.tournament_id,
        eliminated: input.eliminated, 
    }
}


export function TournamentPlayerstoTp(input : TournamentPlayers): ServerTournamentPlayers {

    return {
          player_id: input.playerId,
        tournament_id: input.tournamentId,
        eliminated: input.eliminated,
  
    }
}
         

