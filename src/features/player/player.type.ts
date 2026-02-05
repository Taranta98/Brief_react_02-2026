

export type Player = {
    id: number;
    firstName: string;
    lastName: string;
    fitpCard: string;
};

export type ServerPlayer = {
    id: number;
    first_name: string;
    last_name: string;
    fitp_card: string;
};

export function serverPlayerToPlayer(
    input: ServerPlayer): Player {
    return {
        ...input,
        firstName: input.first_name,
        lastName: input.last_name,
        fitpCard: input.fitp_card
    }
};

export function playerToServerPlayer(input: Omit<Player, 'id'>): Omit<ServerPlayer, 'id'> {
  return {
    first_name: input.firstName,
    last_name: input.lastName,
    fitp_card: input.fitpCard
  }
}

