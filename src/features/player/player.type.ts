
//Tipizzo il giocatore
export type Player = {
    id: number;
    firstName: string;
    lastName: string;
    fitpCard: string;
};
//Tipizzo il giocatore lato server
export type ServerPlayer = {
    id: number;
    first_name: string;
    last_name: string;
    fitp_card: string;
};
//Funzione per convertire dati server in quelli frontend
export function serverPlayerToPlayer(
    input: ServerPlayer): Player {
    return {
        ...input,
        firstName: input.first_name,
        lastName: input.last_name,
        fitpCard: input.fitp_card
    }
};

//Funzione per convertire dati frontend in quelli lato server
export function playerToServerPlayer(input: Omit<Player, 'id'>): Omit<ServerPlayer, 'id'> {
  return {
    first_name: input.firstName,
    last_name: input.lastName,
    fitp_card: input.fitpCard
  }
}

