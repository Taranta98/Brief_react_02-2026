import { zodResolver } from "@hookform/resolvers/zod"; 
import { useMutation, useQueryClient } from "@tanstack/react-query"; 
import { format } from "date-fns"; 
import { CalendarIcon, Loader2, PlusIcon, CheckCircle2 } from "lucide-react"; 
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form"; 
import { z } from "zod"; 
import { Button } from "@/components/ui/button"; 
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"; 
import { cn } from "@/lib/utils"; 
import { TournamentService } from "@/features/tournament/tournament.service"; 
import type { Player } from "@/features/player/player.type"; 
import TournamentPlayersSelector from "../tournamentsPlayers/TornamentPlayersSelector"; 

// SCHEMA ZOD PER VALIDAZIONE FORM TORNEO
const tournamentSchema = z.object({
  name: z.string().min(1, "Nome obbligatorio"), 
  location: z.string().min(1, "Location obbligatoria"), 
  date: z.date("Data obbligatoria"), 
});

// Tipizzazione form basata sullo schema Zod
type TournamentForm = z.infer<typeof tournamentSchema>;

// FUNZIONE PER CALCOLARE LO STATO DEL TORNEO (in corso o in programma)
const calculateState = (date: Date) => {
  const today = new Date();
  return today < date ? "in programma" : "in corso"; 
};

const TournamentCreateButton = () => {
   // Client React Query per invalidare cache
  const queryClient = useQueryClient();

  // Apri/chiudi dialog
  const [open, setOpen] = useState(false); 
  const [showSuccess, setShowSuccess] = useState(false); 
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]); 
  const [playersError, setPlayersError] = useState<string | null>(null); 

  //Form
  const {
    register, 
    handleSubmit, 
    control, 
    reset, 
    formState: { errors }, 
  } = useForm<TournamentForm>({
    resolver: zodResolver(tournamentSchema), 
  });

  // MUTAZIONE PER CREARE TORNEO
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: TournamentForm) => {
      // Estraggo solo gli ID dei giocatori selezionati
      const playerIds = selectedPlayers.map((p) => p.id); 
      return TournamentService.create({
        data: {
          ...data,
          //Trasformo la data in stringa
          date: data.date.toISOString(), 
          state: calculateState(data.date), 
         // Qui aggiungo i giocatori tramite player_ids
          player_ids: playerIds, 
        } as any,
        //Ho usato any perche avevo problemi di tipizzazione data
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tournaments"] }); 
      setShowSuccess(true); 
      setTimeout(() => {
         // Nascondo il messaggio dopo 1.3 econdi
        setShowSuccess(false);
        setOpen(false); 
        reset(); 
        setSelectedPlayers([]); 
        setPlayersError(null); 
      }, 1300);
    },
  });

  // FUNZIONE CHIAMATA AL SUBMIT
  const onSubmit = (data: TournamentForm) => {
    if (selectedPlayers.length !== 8) {
      //I giocatori devono essere esattamente 8 !!!
      setPlayersError("Devi selezionare esattamente 8 giocatori"); 
      return;
    }
    setPlayersError(null);
    //creo torneo con mutazione
    mutate(data); 
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Qua uso un dialog trigger che funge come Pulsante per 'Nuovo Torneo' */}
      <DialogTrigger nativeButton={false}>
        <div className="inline-flex items-center gap-2 rounded-lg bg-linear-to-br from-slate-900 via-slate-950 to-black text-yellow-400 font-bold px-5 py-2 shadow-lg cursor-pointer select-none transition-all hover:scale-105 hover:brightness-110">
          <PlusIcon size={20} />
          Nuovo Torneo
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg rounded-xl bg-linear-to-br from-slate-950 via-slate-900 to-black shadow-2xl p-6 border border-yellow-500/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-yellow-400">
            🎾 Aggiungi nuovo torneo
          </DialogTitle>
        </DialogHeader>

        {/* Se showsucces cambia in true, mostro il messaggio di successo */}
        {showSuccess ? (
          <div className="flex flex-col items-center justify-center gap-2 py-10 animate-fade-in">
            <CheckCircle2 className="text-green-500" size={48} />
            <p className="text-green-400 font-semibold text-lg">
              Torneo creato con successo
            </p>
          </div>
        ) : (
          /* Qua uso la form per creazione successo */
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-4">
            {/* Input per il nome del torneo */}
            <div>
              <Input
                placeholder="Nome torneo"
                {...register("name")}
                className="border-gray-700 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 hover:border-yellow-300 bg-slate-900 text-yellow-400 transition-all"
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Input per il luogo del torneo */}
            <div>
              <Input
                placeholder="Location"
                {...register("location")}
                className="border-gray-700 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 hover:border-yellow-300 bg-slate-900 text-yellow-400 transition-all"
              />
              {errors.location && (
                <p className="text-sm text-red-500 mt-1">{errors.location.message}</p>
              )}
            </div>

            {/*  uso Controller che è un componente  che  permette di collegare input complessi o controllaticome un calendario*/}
            <Controller
              control={control}
              name="date"
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger nativeButton={false}>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left w-full font-normal border-gray-700 text-yellow-400 hover:border-yellow-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, "dd/MM/yyyy") : "Scegli la data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-slate-900">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      className="bg-slate-950 text-yellow-400"
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.date && <p className="text-sm text-red-500">{errors.date.message}</p>}

            {/* Qua uso il mio componente che ho creato per sceglier i giocatori da affiancare al torneo */}
            <div>
              <TournamentPlayersSelector
                selectedPlayers={selectedPlayers}
                setSelectedPlayers={setSelectedPlayers}
                maxPlayers={8}
              />
              {playersError && (
                <p className="text-sm text-red-500 mt-1">{playersError}</p>
              )}
            </div>

            <DialogFooter className="mt-4">
              <Button
                type="submit"
                //Disabilita nel momento in cui è in caricamento e i giocatori selezionati non sono esattamente 8 
                disabled={isPending || selectedPlayers.length !== 8} 
                className="bg-linear-to-r from-yellow-400 to-yellow-300 text-slate-950 font-bold px-5 py-2 rounded-lg shadow-md hover:scale-105 transition-transform"
              >
                {isPending ? <Loader2 className="animate-spin h-5 w-5" /> : "Salva"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TournamentCreateButton;
