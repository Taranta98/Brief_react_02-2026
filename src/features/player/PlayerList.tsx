import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { useMutation, useQuery } from "@tanstack/react-query";
import { PackageOpen, Loader2, Trash2Icon } from "lucide-react";
import { PlayerService } from "./player.service";
import PlayerCreateButton from "./PlayerCreateButton";

const PlayerList = () => {
  const { data: players = [], isPending, isError, error, refetch } = useQuery({
    queryKey: ['players'],
    queryFn: PlayerService.list
  });

  const { mutate, isPending: isDeleting } = useMutation({
    mutationFn: PlayerService.delete,
    onSuccess: () => refetch()
  });

  if (isPending) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Loader2 className="animate-spin text-green-500" size={36} />
          </EmptyMedia>
          <EmptyTitle className="text-lg text-gray-800">Caricamento</EmptyTitle>
          <EmptyDescription className="text-gray-600">Attendi mentre vengono caricati i giocatori</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  if (isError) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <PackageOpen className="text-red-500" size={36} />
          </EmptyMedia>
          <EmptyTitle className="text-lg text-gray-800">Errore imprevisto</EmptyTitle>
          <EmptyDescription className="text-gray-600">{error.message}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <button
            onClick={() => refetch()}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all"
          >
            Riprova
          </button>
        </EmptyContent>
      </Empty>
    );
  }

  if (!players.length) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <PackageOpen className="text-green-500" size={36} />
          </EmptyMedia>
          <EmptyTitle className="text-lg text-gray-800">Nessun giocatore</EmptyTitle>
          <EmptyDescription className="text-gray-600">Puoi crearne uno subito!</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <PlayerCreateButton />
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {players.map((player) => (
        <Card key={player.id} className="group hover:shadow-2xl transition-shadow rounded-lg border border-gray-200 bg-white overflow-hidden">
          <CardHeader className="px-6 pt-4">
            <CardTitle className="text-lg font-semibold text-gray-900">
              👤 {player.firstName} {player.lastName}
            </CardTitle>
            <CardContent className="text-sm text-gray-700 mt-2">
              <p><strong>🪪 FITP N°:</strong> {player.fitpCard}</p>
            </CardContent>
          </CardHeader>

          <CardFooter className="flex justify-end px-6 pb-4 pt-2">
            <button
              onClick={() => mutate(player.id)}
              disabled={isDeleting}
              className="flex items-center gap-2 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
            >
              {isDeleting ? <Loader2 className="animate-spin h-4 w-4" /> : <Trash2Icon size={16} />}
              Elimina
            </button>
          </CardFooter>
        </Card>
      ))}

      {/* Pulsante creazione giocatore in fondo */}
      <div className="mt-4 col-span-full flex justify-center">
        <PlayerCreateButton />
      </div>
    </div>
  );
};

export default PlayerList;
