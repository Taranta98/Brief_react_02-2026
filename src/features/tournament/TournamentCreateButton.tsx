import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon, Loader2, PlusIcon } from "lucide-react";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { TournamentService } from "@/features/tournament/tournament.service";
import { TournamentPlayersService } from "@/features/tournamentsPlayers/tournamentPlayers.service";

import type { Player } from "@/features/player/player.type";
import TournamentPlayersSelector from "../tournamentsPlayers/TornamentPlayersSelector";

// ---------------- Schema form
const tournamentSchema = z.object({
  name: z.string().min(1, "Nome obbligatorio"),
  location: z.string().min(1, "Location obbligatoria"),
  date: z.date(),
});
type TournamentForm = z.infer<typeof tournamentSchema>;

// ---------------- Funzione per calcolare stato torneo
const calculateState = (date: Date) => {
  const today = new Date();
  return today < date ? "in programma" : "in corso";
};

// ---------------- Component
const TournamentCreateButton: React.FC = () => {
  const queryClient = useQueryClient();

  // Stato per i giocatori selezionati
  const [selectedPlayers, setSelectedPlayers] = React.useState<Player[]>([]);

  // React Hook Form
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<TournamentForm>({
    resolver: zodResolver(tournamentSchema),
  });

  // ---------------- Mutation per creare torneo + pivot giocatori
  const { mutate: createTournament, isPending } = useMutation({
    mutationFn: async (data: TournamentForm) => {

      const playerIds = selectedPlayers.map(player => player.id);
      // 1️⃣ Creo il torneo
      const tournament = await TournamentService.create({
        data: {
          name: data.name,
          location: data.location,
          date: data.date.toISOString(),
          state: calculateState(data.date),
          player_ids: playerIds, // <- qui usi i playerId dalla pivot
        } as any,
      });

      // 2️⃣ Creo i record pivot per i giocatori selezionati
      for (const player of selectedPlayers) {
        await TournamentPlayersService.create({
          tournamentId: tournament.id,
          playerId: player.id,
        });
      }

      return tournament;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tournaments"] });
      reset();
      setSelectedPlayers([]);
    },
  });

  // ---------------- Submit handler
  const onSubmit = (data: TournamentForm) => {
    if (selectedPlayers.length === 0) {
      alert("Seleziona almeno un giocatore");
      return;
    }

    // Verifica potenza di 2
    if ((selectedPlayers.length & (selectedPlayers.length - 1)) !== 0) {
      alert("Il numero di giocatori deve essere potenza di 2");
      return;
    }

    createTournament(data);
  };

  return (
    <Dialog>
      <DialogTrigger>
        <div className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90 cursor-pointer select-none">
          <PlusIcon size={18} />
          Nuovo Torneo
        </div>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Aggiungi nuovo torneo</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          {/* Nome torneo */}
          <Input placeholder="Nome torneo" {...register("name")} />
          {errors.name && <span className="text-sm text-red-500">{errors.name.message}</span>}

          {/* Location */}
          <Input placeholder="Location" {...register("location")} />
          {errors.location && <span className="text-sm text-red-500">{errors.location.message}</span>}

          {/* Data torneo */}
          <Controller
            control={control}
            name="date"
            render={({ field }) => (
              <Popover>
                <PopoverTrigger>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? format(field.value, "dd/MM/yyyy") : "Scegli la data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )}
          />
          {errors.date && <span className="text-sm text-red-500">{errors.date.message}</span>}

          {/* Selettore giocatori */}
          <TournamentPlayersSelector
            selectedPlayers={selectedPlayers}
            setSelectedPlayers={setSelectedPlayers}
          />

          {/* Footer */}
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? <Loader2 className="animate-spin" /> : "Salva"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TournamentCreateButton;
