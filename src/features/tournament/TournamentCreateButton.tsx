import { useMutation, useQueryClient } from "@tanstack/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"
import { CalendarIcon, Loader2, PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

import { TournamentService } from "@/features/tournament/tournament.service"


const tournamentSchema = z.object({
  name: z.string().min(1, "Nome obbligatorio"),
  location: z.string().min(1, "Location obbligatoria"),
  date: z.date(),
})

type TournamentForm = z.infer<typeof tournamentSchema>


const calculateState = (date: Date) => {
  const today = new Date()

  if (today < date) return "in programma"
  return "in corso"
}


const TournamentCreateButton = () => {
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<TournamentForm>({
    resolver: zodResolver(tournamentSchema),
  })

  const { mutate: createTournament, isPending } = useMutation({
    mutationFn: TournamentService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tournaments"] })
      reset()
    },
  })

  const onSubmit = (data: TournamentForm) => {
    createTournament({
      data: {
        name: data.name,
        location: data.location,
        date: data.date.toISOString(),
        state: calculateState(data.date),
      },
    })
  }

  return (
    <Dialog >
      <DialogTrigger >
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
          <Input placeholder="Nome torneo" {...register("name")} />
          {errors.name && (
            <span className="text-sm text-red-500">{errors.name.message}</span>
          )}

          <Input placeholder="Location" {...register("location")} />
          {errors.location && (
            <span className="text-sm text-red-500">
              {errors.location.message}
            </span>
          )}

          <Controller
            control={control}
            name="date"
            render={({ field }) => (
              <Popover>
                <PopoverTrigger >
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
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
            <span className="text-sm text-red-500">{errors.date.message}</span>
          )}

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Salva"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default TournamentCreateButton
