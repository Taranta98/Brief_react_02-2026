import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { useMutation, useQuery } from "@tanstack/react-query";
import { PackageOpen } from "lucide-react";
import { PlayerService } from "./player.service";
import PlayerCreateButton from "./PlayerCreateButton";


const PlayerList = () => {

    const { data: players = [], isPending, isError, error, refetch } = useQuery({
        queryKey: ['players'],
        queryFn: PlayerService.list
    })

    const { mutate, isPending: isDeleting } = useMutation({
        mutationFn: PlayerService.delete,
        onSuccess: () => refetch()
    })

    if (isPending) { }

    if (isError) { }

    if (!players.length) {
        return (
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <PackageOpen />
                    </EmptyMedia>
                    <EmptyTitle>Nessuna mappa</EmptyTitle>
                    <EmptyDescription></EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <PlayerCreateButton />
                </EmptyContent>
            </Empty>
        )
    }


    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {players.map((player) => (
                <Card key={player.id}>
                    <CardHeader>
                        <CardTitle>{player.firstName} {player.lastName}</CardTitle>
                        <CardContent><p><strong>FITP N°:</strong> {player.fitpCard}</p></CardContent>
                    </CardHeader>
                    <CardFooter>
                        <button
                            className="text-red-500 hover:text-red-700"
                            onClick={() => mutate(player.id)}
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Eliminazione..." : "Elimina"}
                        </button>
                    </CardFooter>
                </Card>
            ))}
            <PlayerCreateButton/>
        </div>
    )



}
export default PlayerList