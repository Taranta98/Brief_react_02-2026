import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  CalendarIcon,
  Loader2,
  PlusIcon,
  CheckCircle2,
} from "lucide-react";
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

// --------------------
// SCHEMA
// --------------------
const tournamentSchema = z.object({
  name: z.string().min(1, "Nome obbligatorio"),
  location: z.string().min(1, "Location obbligatoria"),
  date: z.date( "Data obbligatoria" ),
});

type TournamentForm = z.infer<typeof tournamentSchema>;

// --------------------
// UTILS
// --------------------
const calculateState = (date: Date) => {
  const today = new Date();
  return today < date ? "in programma" : "in corso";
};

// --------------------
// COMPONENT
// --------------------
const TournamentCreateButton: React.FC = () => {
  const queryClient = useQueryClient();

  const [open, setOpen] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [selectedPlayers, setSelectedPlayers] = React.useState<Player[]>([]);
  const [playersError, setPlayersError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<TournamentForm>({
    resolver: zodResolver(tournamentSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: TournamentForm) => {
      const playerIds = selectedPlayers.map((p) => p.id);

      const tournament = await TournamentService.create({
        data: {
          ...data,
          date: data.date.toISOString(),
          state: calculateState(data.date),
          player_ids: playerIds,
        } as any,
      });

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

      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        setOpen(false);
        reset();
        setSelectedPlayers([]);
        setPlayersError(null);
      }, 1300);
    },
  });

  const onSubmit = (data: TournamentForm) => {
    if (selectedPlayers.length !== 8) {
      setPlayersError("Devi selezionare esattamente 8 giocatori");
      return;
    }

    setPlayersError(null);
    mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger */}
      <DialogTrigger nativeButton={false}>
        <div className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-500 to-green-500 text-white font-bold px-5 py-2 shadow-lg cursor-pointer select-none transition-all hover:scale-105 hover:brightness-110">
          <PlusIcon size={20} />
          Nuovo Torneo
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg rounded-xl bg-white shadow-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            🎾 Aggiungi nuovo torneo
          </DialogTitle>
        </DialogHeader>

        {showSuccess ? (
          <div className="flex flex-col items-center justify-center gap-2 py-10 animate-fade-in">
            <CheckCircle2 className="text-green-500" size={48} />
            <p className="text-green-600 font-semibold">
              Torneo creato con successo
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 mt-4"
          >
            {/* Nome */}
            <div>
              <Input
                placeholder="Nome torneo"
                {...register("name")}
                className="border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 hover:border-green-400 transition-all"
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Location */}
            <div>
              <Input
                placeholder="Location"
                {...register("location")}
                className="border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 hover:border-green-400 transition-all"
              />
              {errors.location && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.location.message}
                </p>
              )}
            </div>

            {/* Data */}
            <Controller
              control={control}
              name="date"
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger nativeButton={false}>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left w-full font-normal border-gray-300 hover:border-green-400 focus:border-green-500 focus:ring-2 focus:ring-green-200",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value
                        ? format(field.value, "dd/MM/yyyy")
                        : "Scegli la data"}
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
            {errors.date && (
              <p className="text-sm text-red-500">{errors.date.message}</p>
            )}

            {/* Giocatori */}
            <div>
              <TournamentPlayersSelector
                selectedPlayers={selectedPlayers}
                setSelectedPlayers={setSelectedPlayers}
                maxPlayers={8} // Opzionale: se vuoi limitare la selezione
              />
              {playersError && (
                <p className="text-sm text-red-500 mt-1">{playersError}</p>
              )}
            </div>

            {/* Footer */}
            <DialogFooter className="mt-4">
              <Button
                type="submit"
                disabled={isPending || selectedPlayers.length !== 8}
                className="bg-gradient-to-r from-yellow-400 to-yellow-300 text-green-900 font-semibold px-5 py-2 rounded-lg shadow-md hover:scale-105 transition-transform"
              >
                {isPending ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  "Salva"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TournamentCreateButton;
