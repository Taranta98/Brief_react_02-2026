import myEnv from "@/lib/env";
import { serverTournamentToTournament, tournamentToServerTournament, type ServerTournament, type Tournament } from "./tournament.type";
import { myFetch } from "@/lib/backend";


export class TournamentService {

     static async list():Promise<Tournament[]> {
        const players = await myFetch<ServerTournament[]>(`${myEnv.backendApiUrl}/tournaments`);
        return players.map(serverTournamentToTournament);
    }

     static async create({data}: {data: Omit<Tournament, 'id'>}): Promise<Tournament> {
        const player = await myFetch<ServerTournament>(`${myEnv.backendApiUrl}/tournaments`,
            {
                method: 'POST',
                body: JSON.stringify(tournamentToServerTournament(data))
            }
        )
        return serverTournamentToTournament(player)
    }
    static async update({ id, data }: { id: number, data: Omit<Tournament, 'id'> }): Promise<Tournament> {

        const player = await myFetch<ServerTournament>(`${myEnv.backendApiUrl}/tournaments/${id}`, {
            method: 'PUT',
            body: JSON.stringify(tournamentToServerTournament(data))
        });
        return serverTournamentToTournament(player);
    }
     
    static async delete(id: number ) : Promise<void>{
      await myFetch<null>(`${myEnv.backendApiUrl}/tournaments/${id}`, {
        method: 'DELETE'});
      }
}


