import myEnv from "@/lib/env";
import { serverTournamentToTournament, tournamentToServerTournament, type ServerTournament, type Tournament } from "./tournament.type";
import { myFetch } from "@/lib/backend";


export class TournamentService {

    //Gestisco la chiamata list del torneo per tornare la lista dei tornei
     static async list():Promise<Tournament[]> {
        const tournaments = await myFetch<ServerTournament[]>(`${myEnv.backendApiUrl}/tournaments`);
        return tournaments.map(serverTournamentToTournament);
    }

    //Gestisco la chiamata create del torneo per creare un torneo
static async create({data}: {data: any}): Promise<Tournament> {

    //Qui passo dei dati forzatamente per gestire durantte la create di tournament anche quella per la tabella pivot
    const serverData = {
        name: data.name,
        location: data.location,
        date: data.date,
        state: data.state,
        winner_id: data.winnerId || null,
        //Qua passo dei dati che saranno poi intesi come id/giocatori da parte del backend
        player_ids: data.player_ids 
    };

    const response = await myFetch<ServerTournament>(`${myEnv.backendApiUrl}/tournaments`,
        {
            method: 'POST',
            body: JSON.stringify(serverData)
        }
    );
    return serverTournamentToTournament(response);
}
//Gestisco l'update di un torneo
    static async update({ id, data }: { id: number, data: Omit<Tournament, 'id'> }): Promise<Tournament> {

        const tournament = await myFetch<ServerTournament>(`${myEnv.backendApiUrl}/tournaments/${id}`, {
            method: 'PUT',
            body: JSON.stringify(tournamentToServerTournament(data))
        });
        return serverTournamentToTournament(tournament);
    }
     
    //Gestisco la delete di un torneo ( )
    static async delete(id: number ) : Promise<void>{
      await myFetch<null>(`${myEnv.backendApiUrl}/tournaments/${id}`, {
        method: 'DELETE'});
      }
}


