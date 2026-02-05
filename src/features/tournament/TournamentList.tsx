
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowRight, ChevronRight, Loader2, OctagonAlert, PackageOpen, Trash2Icon } from "lucide-react";
import { Link } from "react-router";
import { TournamentService } from "./tournament.service";
import TournamentCreateButton from "./TournamentCreateButton";


const TournamentList = () => {


    const { data: tournaments = [], isPending, isError, refetch, error } = useQuery({
        queryKey: ['tournaments'],
        queryFn: TournamentService.list
    })

    const { mutate, isPending: isDeleting } = useMutation({
        mutationFn: TournamentService.delete,

        onSuccess: () => refetch()
    
    })

    

    if (isPending) {
        return (
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <Loader2 className=" animate-spin" />
                    </EmptyMedia>
                    <EmptyTitle>Caricamento</EmptyTitle>
                    <EmptyDescription>Attendi mentre vengono caricati i tornei</EmptyDescription>
                </EmptyHeader>
            </Empty>
        )
    }
    if (isError) {
        return (<Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <OctagonAlert />
                </EmptyMedia>
                <EmptyTitle>Errore imprevisto</EmptyTitle>
                <EmptyDescription>{error.message}</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <Button onClick={() => refetch()}> Riprova</Button>
            </EmptyContent>
        </Empty>)
    }

    if (!tournaments.length) {
        return (
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <PackageOpen />
                    </EmptyMedia>
                    <EmptyTitle>Nessun torneo pianificato</EmptyTitle>
                    <EmptyDescription></EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <TournamentCreateButton />
                </EmptyContent>
            </Empty>

        )
    }

    return (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {tournaments.map(tournament => (
                <Card key={tournament.id} className="group hover:shadow-xl transition-shadow bg-white border border-gray-200 relative">
                    <CardHeader>
                        <CardTitle className="text-lg text-center font-semibold text-gray-900 truncate">
                            {tournament.name}
                        </CardTitle>
                        <CardContent className="text-sm text-gray-700 space-y-1 px-4 pb-4">
                            <p><strong>Data:</strong> {tournament.date}</p>
                            <p><strong>Stato:</strong> {tournament.state}</p>
                            <p><strong>Luogo:</strong> {tournament.location}</p>
                        </CardContent>
                    </CardHeader>
                    <CardFooter className="flex justify-between gap-2 px-4 pb-4 pt-2">

                        <AlertDialog>
                            <AlertDialogTrigger render={<Button
                                variant={"destructive"}
                                className={' relative z-1 flex items-center gap-1 text-sm"'} />
                            }>
                                <Trash2Icon />
                                Elimina
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Sei assolutamente sicuro?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Questa azione è irreversibile. Se continuo cancelleremo il dai nostri server in modo definitivo
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Annulla</AlertDialogCancel>
                                    <AlertDialogAction disabled={isDeleting} onClick={() => mutate(tournament.id)}>
                                        Sono sicuro
                                        {isDeleting ? <Loader2 className=" animate-spin" /> : <ChevronRight />}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>



                        <Button
                            variant={"secondary"}
                            className=" flex items-center gap-1 "
                            nativeButton={false}
                            render={<Link to={'/tournaments/' + tournament.id} />}
                        >
                            Mostra torneo
                            <ArrowRight />
                        </Button>
                    </CardFooter>
                </Card>
            ))}
            <TournamentCreateButton/>
        </div>
    )
}



export default TournamentList