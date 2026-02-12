
//Tipizzo il dati del torneo
export type Tournament = {
    id : number;  
    name : string;
    date : string;
    state : string;
    location :string;
    winnerId : number | null;
};
//Tipizzo i dati del torneo lato server
export type ServerTournament = {
    id : number;  
    name : string;
    date : string;
    state : string;
    location :string;
    winner_id : number | null;
};
 //converto i dati del server in quelli frontend
export function serverTournamentToTournament ( input : ServerTournament): Tournament {
    return {
        ...input,
        winnerId : input.winner_id
    }
};
//converto i dato del fornt end in quelli del server (e ometto l'id che non dovrebbe essere passato dal frontend)
export function tournamentToServerTournament(input: Omit<Tournament, 'id'>): Omit<ServerTournament, 'id'> {
  return {
    ...input,
    winner_id: input.winnerId,
  
  }
}