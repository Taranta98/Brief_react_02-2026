import type { Player } from "../player/player.type";

export type Tournament = {
    id : number;  
    name : string;
    date : string;
    state : string;
    location :string;
    winnerId : number | null;
};

export type ServerTournament = {
    id : number;  
    name : string;
    date : string;
    state : string;
    location :string;
    winner_id : number | null;
};

export function serverTournamentToTournament ( input : ServerTournament): Tournament {
    return {
        ...input,
        winnerId : input.winner_id
    }
};

export function tournamentToServerTournament(input: Omit<Tournament, 'id'>): Omit<ServerTournament, 'id'> {
  return {
    ...input,
    winner_id: input.winnerId,
  
  }
}