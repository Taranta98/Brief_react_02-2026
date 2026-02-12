import { myFetch } from "@/lib/backend";
import { playerToServerPlayer, serverPlayerToPlayer, type Player, type ServerPlayer } from "./player.type";
import myEnv from "@/lib/env";

export class PlayerService {

    //Gestisco la chiamata list per ricevere la lista dei giocatori
    static async list():Promise<Player[]> {
        const players = await myFetch<ServerPlayer[]>(`${myEnv.backendApiUrl}/players`);
        return players.map(serverPlayerToPlayer);
    }

     //Gestisco la chiamata create per gestire la creazione di un  giocatore
    static async create({data}: {data: Omit<Player, 'id'>}): Promise<Player> {
        const player = await myFetch<ServerPlayer>(`${myEnv.backendApiUrl}/players`,
            {
                method: 'POST',
                body: JSON.stringify(playerToServerPlayer(data))
            }
        )
        return serverPlayerToPlayer(player)
    }

    //Gestisco la chiamata update per l'aggiornamento di un giocatore specifico
    static async update({ id, data }: { id: number, data: Omit<Player, 'id'> }): Promise<Player> {

        const player = await myFetch<ServerPlayer>(`${myEnv.backendApiUrl}/players/${id}`, {
            method: 'PUT',
            body: JSON.stringify(playerToServerPlayer(data))
        });
        return serverPlayerToPlayer(player);
    }
     
    //Gestisco la chiamata delete per eliminare un giocatore. ( Avevo inizialmente gestito una soft delete a livello di backend ma ho preferito non farlo eliminare nel caso presente in un torneo)
    static async delete(id: number ) : Promise<void>{
      await myFetch<null>(`${myEnv.backendApiUrl}/players/${id}`, {
        method: 'DELETE'});
      }
}
