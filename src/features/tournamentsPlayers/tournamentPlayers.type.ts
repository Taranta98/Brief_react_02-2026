//Gestisco il tipo della tabella pivot (lato frontend)
export type TournamentPlayers = {
    playerId : number;
    tournamentId : number;
    eliminated?: string;
}

//Gestiscco il tipo della tabella pivot (lato backend)
export type ServerTournamentPlayers = {
    player_id : number;
    tournament_id : number;
    eliminated? : string;
}

//Converto i dati che mi arrivano dal server in quelli del frontend
export function serverTptoTournamentPlayers(input: ServerTournamentPlayers): TournamentPlayers {
    return {
        playerId: input.player_id,
        tournamentId: input.tournament_id,
        eliminated: input.eliminated, 
    }
}

//Converto i dati che mando lato frontend in quelli lato backend
export function TournamentPlayerstoTp(input : TournamentPlayers): ServerTournamentPlayers {

    return {
          player_id: input.playerId,
        tournament_id: input.tournamentId,
        eliminated: input.eliminated,
  
    }
}
         

