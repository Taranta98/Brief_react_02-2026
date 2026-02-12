import { TournamentService } from "./tournament.service";

import type { Tournament } from "./tournament.type";

export class TournamentHistoryService {
  static async list(): Promise<Tournament[]> {
    const tournaments = await TournamentService.list();
    // filtra solo tornei completati
    return tournaments.filter(t => t.winnerId);
  }
}
