import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ArrowRight, Loader2, OctagonAlert, PackageOpen } from "lucide-react";
import { Link } from "react-router";
import { TournamentService } from "./tournament.service";
import TournamentCreateButton from "./TournamentCreateButton";

//Componente per mostrare  tutti i tornei 


const TournamentList = () => {

    //useQueri per fare le chiamate del service e gestire il caricamento, gli errori e il refetch
    const { data: tournaments = [], isPending, isError, refetch, error } = useQuery({
        queryKey: ['tournaments'],
        queryFn: TournamentService.list
    });

    //mutation per eliminare un torneo
    // const { mutate, isPending: isDeleting } = useMutation({
    //     mutationFn: TournamentService.delete,
    //     onSuccess: () => refetch()
    // });

    //In caso di caricamento della lista torneo
    if (isPending) {
        return (
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <Loader2 className="animate-spin text-blue-500" size={36} />
                    </EmptyMedia>
                    <EmptyTitle className="text-lg text-white">Caricamento tornei</EmptyTitle>
                    <EmptyDescription className="text-gray-300">Attendi mentre carichiamo i tornei</EmptyDescription>
                </EmptyHeader>
            </Empty>
        );
    }

    //In caso di errore  
    if (isError) {
        return (
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <OctagonAlert className="text-red-500" size={36} />
                    </EmptyMedia>
                    <EmptyTitle className="text-lg text-white">Errore imprevisto</EmptyTitle>
                    <EmptyDescription className="text-gray-300">{error.message}</EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <Button onClick={() => refetch()} className="bg-blue-600 hover:bg-blue-700 text-white transition-all">Riprova</Button>
                </EmptyContent>
            </Empty>
        );
    }
//Se non c'è nessun torneo
    if (!tournaments.length) {
        return (
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <PackageOpen className="text-blue-500" size={36} />
                    </EmptyMedia>
                    <EmptyTitle className="text-lg text-white">Nessun torneo programmato</EmptyTitle>
                    <EmptyDescription className="text-gray-300">Crea subito il tuo torneo</EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <TournamentCreateButton />
                </EmptyContent>
            </Empty>
        );
    }

    return (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {tournaments.map(tournament => (
                <Card 
                    key={tournament.id} 
                    className="group relative rounded-xl overflow-hidden border border-blue-800 shadow-lg hover:shadow-2xl transition-all bg-linear-to-b from-blue-900 via-blue-950 to-black"
                >
                    <CardHeader className="px-6 pt-4">
                        <CardTitle className="text-2xl font-bold text-yellow-400 text-center truncate drop-shadow-md">
                            {tournament.name}
                        </CardTitle>
                        <CardContent className="px-6 py-4 space-y-2 text-gray-200">
                            <p className="flex items-center justify-between text-sm sm:text-base">
                                <span className="font-semibold">📅 Data:</span>
                                <span>{format(new Date(tournament.date), "dd MMM yyyy")}</span>
                            </p>
                            <p className="flex items-center justify-between text-sm sm:text-base">
                                <span className="font-semibold">🏃‍♂️ Stato:</span>
                                <span className={cn(
                                    "font-semibold px-2 py-1 rounded-full text-sm",
                                    tournament.state === "in programma" ? "bg-yellow-500/20 text-yellow-400" :
                                    tournament.state === "in corso" ? "bg-teal-500/20 text-teal-400" :
                                    "bg-green-600/20 text-green-400"
                                )}>
                                    {tournament.state === "in programma" ? "⏳ In programma" :
                                     tournament.state === "in corso" ? "🏃‍♂️ In corso" :
                                     "🏆 Completato"}
                                </span>
                            </p>
                            <p className="flex items-center justify-between text-sm sm:text-base">
                                <span className="font-semibold">📍 Luogo:</span>
                                <span>{tournament.location}</span>
                            </p>
                        </CardContent>
                    </CardHeader>

                    <CardFooter className="flex justify-between gap-2 px-6 pb-4 pt-2">
                        {/* <AlertDialog>
                            <AlertDialogTrigger render={<Button variant="destructive" className="flex items-center gap-1 text-sm px-3 py-1 rounded-md shadow-sm hover:shadow-md transition-all" />}>
                                <Trash2Icon />
                                Elimina
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Sei sicuro?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Questa azione eliminerà definitivamente il torneo.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel className="px-4 py-2">Annulla</AlertDialogCancel>
                                    <AlertDialogAction
                                        disabled={isDeleting}
                                        onClick={() => mutate(tournament.id)}
                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all flex items-center gap-1"
                                    >
                                        {isDeleting ? <Loader2 className="animate-spin h-4 w-4" /> : "Conferma"}
                                        <ChevronRight size={16} />
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog> */}

                        <Button
                            variant="secondary"
                            className="flex items-center gap-1 bg-linear-to-r from-teal-400 to-green-500 text-black font-semibold px-3 py-1 rounded-lg hover:brightness-110 transition-all"
                            nativeButton={false}
                            render={<Link to={`/tennismatches`} state={{ tournament }} />}
                        >
                            Visualizza
                            <ArrowRight size={16} />
                        </Button>
                    </CardFooter>
                </Card>
            ))}

            {/* Pulsante creazione torneo in fondo alla pagina */}
            <div className="mt-4 col-span-full flex justify-center">
                <TournamentCreateButton />
            </div>
        </div>
    );
};

export default TournamentList;
