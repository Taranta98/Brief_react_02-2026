import myEnv from "@/lib/env";
import { serverTennisMatchesToTennisMatches, tennisMatchesToServerTennisMatches, type ServerTennisMatches, type TennisMatches } from "./tennisMatches.type";
import { myFetch } from "@/lib/backend";


export class TennisMatchesService {

    static async list(): Promise<TennisMatches[]> {
        const match = await myFetch<ServerTennisMatches[]>(`${myEnv.backendApiUrl}/tennismatches`);
        return match.map(serverTennisMatchesToTennisMatches);
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
    static async update({ id, data }: { id: number, data: Omit<TennisMatches, 'id'> }): Promise<TennisMatches> {

        const match = await myFetch<ServerTennisMatches>(`${myEnv.backendApiUrl}/tennismatches/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(tennisMatchesToServerTennisMatches(data))
        });
        return serverTennisMatchesToTennisMatches(match);
    }
}