import myEnv from "@/lib/env";
import { myFetch } from "@/lib/backend";
import { serverTptoTournamentPlayers, TournamentPlayerstoTp, type ServerTournamentPlayers, type TournamentPlayers } from "./tournamentPlayers.type";


export class TournamentPlayersService {

 

//CHIAMATA LIST / GET
    //id->vedere piu route api controllare
    static async list(tournamentId?: number): Promise<TournamentPlayers[]> {
        const torunamentPlayers = await myFetch<ServerTournamentPlayers[]>(`${myEnv.backendApiUrl}/tournaments/${tournamentId}/players`);
        return torunamentPlayers.map(serverTptoTournamentPlayers);
    }

//CHIAMATA CREATE / POST
    //id->vedere piu route api controllare
    static async create( data: Omit<TournamentPlayers, 'eliminated'> ): Promise<TournamentPlayers> {
        const newBoxMap = await myFetch<ServerTournamentPlayers>(`${myEnv.backendApiUrl}/tournaments/${data.tournamentId}/players`, {
            method: 'POST',
            body: JSON.stringify(TournamentPlayerstoTp(data))
        })
        return serverTptoTournamentPlayers(newBoxMap);
    }

}

