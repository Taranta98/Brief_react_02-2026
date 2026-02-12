import myEnv from "@/lib/env";
import { serverTennisMatchesToTennisMatches, tennisMatchesToServerTennisMatches, type ServerTennisMatches, type TennisMatches } from "./tennisMatches.type";
import { myFetch } from "@/lib/backend";


export class TennisMatchesService {


  
  // chiama la nuova route con tournament_id per trovare le partite con quel tournament_id
  static async list(tournamentId: number): Promise<TennisMatches[]> {

    const matches = await myFetch<ServerTennisMatches[]>(
      `${myEnv.backendApiUrl}/tournaments/${tournamentId}/tennismatches`
    );
    return matches.map(serverTennisMatchesToTennisMatches);
  }
//funzione create per creare partite 
  static async create({ data }: { data: Omit<TennisMatches, 'id'> }): Promise<TennisMatches> {
    const match = await myFetch<ServerTennisMatches>(`${myEnv.backendApiUrl}/tennismatches`,
      {
        method: 'POST',
        body: JSON.stringify(tennisMatchesToServerTennisMatches(data))
      }
    )
    return serverTennisMatchesToTennisMatches(match)
  }

//Qui gestisco l'update delle partite che mi serve per aggiornare lo score del player1 e 2 
  static async update({ id, data,}: { id: number; data: Partial<Omit<TennisMatches, "id">>;}): Promise<TennisMatches> {
 
    const serverData: Partial<Omit<ServerTennisMatches, "id">> = {};

    if (data.player1Score !== undefined) {
      serverData.player1_score = data.player1Score;
    }

    if (data.player2Score !== undefined) {
      serverData.player2_score = data.player2Score;
    }

    if (data.tournamentId !== undefined) {
      serverData.tournament_id = data.tournamentId;
    }

    const updatedMatch = await myFetch<ServerTennisMatches>( `${myEnv.backendApiUrl}/tennismatches/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(serverData),
      }
    );

    return serverTennisMatchesToTennisMatches(updatedMatch);
  }

};
