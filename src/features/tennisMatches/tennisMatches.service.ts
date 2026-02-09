import myEnv from "@/lib/env";
import { serverTennisMatchesToTennisMatches, tennisMatchesToServerTennisMatches, type ServerTennisMatches, type TennisMatches } from "./tennisMatches.type";
import { myFetch } from "@/lib/backend";


export class TennisMatchesService {

   static async list(tournamentId: number): Promise<TennisMatches[]> {
    // chiama la nuova route con tournament_id
    
    const matches = await myFetch<ServerTennisMatches[]>(
        `${myEnv.backendApiUrl}/tournaments/${tournamentId}/tennismatches`
    );

    // trasforma i dati del server in oggetti TennisMatches
    return matches.map(serverTennisMatchesToTennisMatches);
}

    static async create({ data }: { data: Omit<TennisMatches, 'id'> }): Promise<TennisMatches> {
        const match = await myFetch<ServerTennisMatches>(`${myEnv.backendApiUrl}/tennismatches`,
            {
                method: 'POST',
                body: JSON.stringify(tennisMatchesToServerTennisMatches(data))
            }
        )
        return serverTennisMatchesToTennisMatches(match)
    }
    static async update({ id, data }: { id: number, data: Partial<Omit<TennisMatches, 'id'>> }): Promise<TennisMatches> {

        const match = await myFetch<ServerTennisMatches>(`${myEnv.backendApiUrl}/tennismatches/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(tennisMatchesToServerTennisMatches(data as any))
        });
        return serverTennisMatchesToTennisMatches(match);
    }
}