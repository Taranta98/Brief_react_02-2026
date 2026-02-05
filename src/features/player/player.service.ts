import { myFetch } from "@/lib/backend";
import { playerToServerPlayer, serverPlayerToPlayer, type Player, type ServerPlayer } from "./player.type";
import myEnv from "@/lib/env";

export class PlayerService {

    static async list():Promise<Player[]> {
        const players = await myFetch<ServerPlayer[]>(`${myEnv.backendApiUrl}/players`);
        return players.map(serverPlayerToPlayer);
    }

    static async create({data}: {data: Omit<Player, 'id'>}): Promise<Player> {
        const player = await myFetch<ServerPlayer>(`${myEnv.backendApiUrl}/players`,
            {
                method: 'POST',
                body: JSON.stringify(playerToServerPlayer(data))
            }
        )
        return serverPlayerToPlayer(player)
    }
    static async update({ id, data }: { id: number, data: Omit<Player, 'id'> }): Promise<Player> {

        const map = await myFetch<ServerPlayer>(`${myEnv.backendApiUrl}/players/${id}`, {
            method: 'PUT',
            body: JSON.stringify(playerToServerPlayer(data))
        });
        return serverPlayerToPlayer(map);
    }
     
    static async delete(id: number ) : Promise<void>{
      await myFetch<null>(`${myEnv.backendApiUrl}/players/${id}`, {
        method: 'DELETE'});
      }
}
