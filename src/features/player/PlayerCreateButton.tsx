import { Button } from "@/components/ui/button"; 
import {Dialog,DialogContent,DialogFooter, DialogHeader,DialogTitle, DialogTrigger,} from "@/components/ui/dialog"; 
import { Input } from "@/components/ui/input"; 
import { PlayerService } from "@/features/player/player.service"; 
import { zodResolver } from "@hookform/resolvers/zod"; 
import { useMutation, useQueryClient } from "@tanstack/react-query"; 
import { CheckCircle2, Loader2, PlusIcon } from "lucide-react"; 
import { useState } from "react"; 
import { useForm } from "react-hook-form"; 
import { z } from "zod"; 

// Schema di validazione dei dati del form con Zod
const playerSchema = z.object({
  firstName: z.string().min(1, "Il nome è obbligatorio"), 
  lastName: z.string().min(1, "Il cognome è obbligatorio"), 
  fitpCard: z
    .string()
    .length(10, "La FITP Card deve essere di 10 cifre") 
    //regex per ammettere solo numeri 
    .regex(/^\d+$/, "Sono ammessi solo numeri"),
});

//Assegno il tipo di zod
type PlayerForm = z.infer<typeof playerSchema>;

const PlayerCreateButton = () => {

  //Assegno uno state per capire quando aprire e non il dialog
  const [open, setOpen] = useState(false); 

  //Assegno uno state per mostrare il messaggio di errore
  const [showSuccess, setShowSuccess] = useState(false); 

  const queryClient = useQueryClient(); 


  const {
    register, 
    handleSubmit, 
    reset, 
    setValue, 
    formState: { errors }, 
  } = useForm<PlayerForm>({
    resolver: zodResolver(playerSchema), 
  });

  // Mutazione per creare un nuovo giocatore tramite PlayerService.create
  const { mutate, isPending } = useMutation({
    mutationFn: PlayerService.create, 
    onSuccess: () => {
      //Aggiorni daati del giocatore
      queryClient.invalidateQueries({ queryKey: ["players"] }); 
        //Mostro il messaggio di success
      setShowSuccess(true); 
      // Assegno un timeout dopo 1,2 secondi e resetta i dati
      setTimeout(() => {
        setShowSuccess(false);
        setOpen(false);
        reset();
      }, 1200);
    },
  });

 //Funzione per inviare i dati 
  const onSubmit = (data: PlayerForm) => {
    mutate({ data }); 
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger del dialog... gestisco quando deve apparire il dialog */}
      <DialogTrigger nativeButton={false}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-linear-to-br from-slate-900 via-slate-950 to-black text-yellow-400 font-semibold shadow-lg cursor-pointer select-none transition-transform hover:scale-105 hover:brightness-110">
          <PlusIcon size={20} /> {/* Icona "+" */}
          Nuovo Giocatore
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md rounded-xl bg-linear-to-br from-slate-950 via-slate-900 to-black text-yellow-400 shadow-2xl p-6 border border-yellow-500/30">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-yellow-400 flex items-center gap-2">
            ➕ Aggiungi nuovo giocatore
          </DialogTitle>
        </DialogHeader>

        {/* Mostro il messasggio di successo per confermare il fatto che sia aggiunto o no un giocatore */}
        {showSuccess ? (
          <div className="flex flex-col items-center justify-center gap-2 py-8 animate-fade-in">
            <CheckCircle2 className="text-green-500" size={48} /> 
            <p className="text-green-400 font-semibold">Giocatore aggiunto con successo</p>
          </div>
        ) : (
          // Form di creazione giocatore
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 mt-2">
          
            <Input
              placeholder="Nome"
              {...register("firstName")} 
              className="bg-slate-900 text-yellow-400 border border-yellow-500/40 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 placeholder:text-yellow-300"
            />
            {errors.firstName && (
              <p className="text-xs text-red-500">{errors.firstName.message}</p> 
            )}
            <Input
              placeholder="Cognome"
              {...register("lastName")}
              className="bg-slate-900 text-yellow-400 border border-yellow-500/40 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 placeholder:text-yellow-300"
            />
            {errors.lastName && (
              <p className="text-xs text-red-500">{errors.lastName.message}</p>
            )}

            <Input
              placeholder="FITP Card (10 cifre)"
              {...register("fitpCard")}
              onChange={(e) => {
                const numericOnly = e.target.value.replace(/\D/g, ""); // Filtra solo numeri
                const limited = numericOnly.slice(0, 10); // Limita a 10 cifre
                setValue("fitpCard", limited, { shouldValidate: true }); // Aggiorna il form
              }}
              className="bg-slate-900 text-yellow-400 border border-yellow-500/40 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 placeholder:text-yellow-300"
            />
            {errors.fitpCard && (
              <p className="text-xs text-red-500">{errors.fitpCard.message}</p>
            )}

            <DialogFooter className="mt-4">
              <Button
                type="submit"
                disabled={isPending} 
                className="w-full bg-linear-to-br from-yellow-400 to-yellow-300 text-slate-950 font-semibold px-5 py-3 rounded-xl shadow-lg hover:scale-105 hover:brightness-110 transition-transform"
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

export default PlayerCreateButton;
