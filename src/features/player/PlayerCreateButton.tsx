import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlayerService } from "@/features/player/player.service"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader2, PlusIcon } from "lucide-react"
import {Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogFooter} from "@/components/ui/dialog"




const PlayerCreateButton = () => {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [fitpCard, setFitpCard] = useState("")

  const queryClient = useQueryClient()

  
  const { mutate: createPlayer, isPending } = useMutation({
    mutationFn: PlayerService.create,
    onSuccess: (data) => {
      // AGGIORNA LISTA GIOCATORI
      queryClient.invalidateQueries({ queryKey: ["players"] })

      // ReSET CAMPO FORM
      setFirstName("")
      setLastName("")
      setFitpCard("")  
      },
  })

  return (
    <Dialog>
      <DialogTrigger>
        <div className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90 cursor-pointer select-none">
          <PlusIcon /> 
          Nuovo Giocatore
        </div>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Aggiungi nuovo giocatore
            </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <Input
            placeholder="Nome"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <Input
            placeholder="Cognome"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <Input
            placeholder="FITP Card"
            value={fitpCard}
            onChange={(e) => setFitpCard(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button
            disabled={isPending}
            onClick={() =>
              createPlayer({
      data: {
        firstName,
        lastName,
        fitpCard,
      },
    })
            }
          >
            {isPending ? <Loader2 className="animate-spin" /> : "Salva"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default PlayerCreateButton
