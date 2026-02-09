import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PlayerService } from "@/features/player/player.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Loader2, PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";


// --------------------
// ZOD SCHEMA
// --------------------
const playerSchema = z.object({
  firstName: z.string().min(1, "Il nome è obbligatorio"),
  lastName: z.string().min(1, "Il cognome è obbligatorio"),
  fitpCard: z
    .string()
    .length(10, "La FITP Card deve essere di 10 cifre")
    .regex(/^\d+$/, "Sono ammessi solo numeri"),
});

type PlayerForm = z.infer<typeof playerSchema>;


// --------------------
// COMPONENT
// --------------------
const PlayerCreateButton = () => {
  const [open, setOpen] = useState(false);
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

  const { mutate, isPending } = useMutation({
    mutationFn: PlayerService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["players"] });

      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        setOpen(false);
        reset();
      }, 1200);
    },
  });

  const onSubmit = (data: PlayerForm) => {
    mutate({ data });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger nativeButton={false}>
        <div className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-400 to-green-500 text-white font-semibold px-4 py-2 shadow-md cursor-pointer select-none transition-all hover:scale-105 hover:brightness-110">
          <PlusIcon size={20} />
          Nuovo Giocatore
        </div>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            ➕ Aggiungi nuovo giocatore
          </DialogTitle>
        </DialogHeader>

        {showSuccess ? (
          <div className="flex flex-col items-center justify-center gap-2 py-8 animate-fade-in">
            <CheckCircle2 className="text-green-500" size={48} />
            <p className="text-green-600 font-semibold">
              Giocatore aggiunto con successo
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-3 mt-2"
          >
            {/* Nome */}
            <div>
              <Input placeholder="Nome" {...register("firstName")} />
              {errors.firstName && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            {/* Cognome */}
            <div>
              <Input placeholder="Cognome" {...register("lastName")} />
              {errors.lastName && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>

            {/* FITP CARD */}
            <div>
              <Input
                placeholder="FITP Card (10 cifre)"
                inputMode="numeric"
                {...register("fitpCard")}
                onChange={(e) => {
                  const numericOnly = e.target.value.replace(/\D/g, "");
                  const limited = numericOnly.slice(0, 10);
                  setValue("fitpCard", limited, { shouldValidate: true });
                }}
              />
              {errors.fitpCard && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.fitpCard.message}
                </p>
              )}
            </div>

            <DialogFooter className="mt-4">
              <Button
                type="submit"
                disabled={isPending}
                className="bg-gradient-to-r from-yellow-400 to-yellow-300 text-green-900 font-semibold px-4 py-2 rounded-lg shadow-md hover:scale-105 transition-transform"
              >
                {isPending ? (
                  <Loader2 className="animate-spin" />
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

export default PlayerCreateButton;
