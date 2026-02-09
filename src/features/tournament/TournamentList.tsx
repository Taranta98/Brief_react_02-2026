import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowRight, ChevronRight, Loader2, OctagonAlert, PackageOpen, Trash2Icon } from "lucide-react";
import { Link } from "react-router";
import { TournamentService } from "./tournament.service";
import TournamentCreateButton from "./TournamentCreateButton";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const TournamentList = () => {
    const { data: tournaments = [], isPending, isError, refetch, error } = useQuery({
        queryKey: ['tournaments'],
        queryFn: TournamentService.list
    });

    const { mutate, isPending: isDeleting } = useMutation({
        mutationFn: TournamentService.delete,
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
                    <EmptyDescription className="text-gray-600">Attendi mentre vengono caricati i tornei</EmptyDescription>
                </EmptyHeader>
            </Empty>
        );
    }

    if (isError) {
        return (
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <OctagonAlert className="text-red-500" size={36} />
                    </EmptyMedia>
                    <EmptyTitle className="text-lg text-gray-800">Errore imprevisto</EmptyTitle>
                    <EmptyDescription className="text-gray-600">{error.message}</EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <Button onClick={() => refetch()} className="bg-green-500 text-white hover:bg-green-600 transition-all">Riprova</Button>
                </EmptyContent>
            </Empty>
        );
    }

    if (!tournaments.length) {
        return (
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <PackageOpen className="text-green-500" size={36} />
                    </EmptyMedia>
                    <EmptyTitle className="text-lg text-gray-800">Nessun torneo pianificato</EmptyTitle>
                    <EmptyDescription className="text-gray-600">Puoi crearne uno subito!</EmptyDescription>
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
                <Card key={tournament.id} className="group hover:shadow-2xl transition-shadow rounded-lg border border-gray-200 bg-white relative overflow-hidden">
                    <CardHeader className="px-6 pt-4">
                        <CardTitle className="text-xl text-center font-semibold text-gray-900 truncate">
                            🎾 {tournament.name}
                        </CardTitle>
                        <CardContent className="px-6 py-4 space-y-2 text-gray-700">
                            <p className="text-sm sm:text-base flex items-center gap-2">
                                <span className="font-semibold text-gray-900">📅 Data:</span>
                                <span className="text-gray-600">{format(new Date(tournament.date), "dd/MM/yyyy")}</span>
                            </p>

                            <p className="text-sm sm:text-base flex items-center gap-2">
                                <span className="font-semibold text-gray-900">🏃‍♂️ Stato:</span>
                                <span className={cn(
                                    "font-medium",
                                    tournament.state === "in programma" ? "text-yellow-500" :
                                        tournament.state === "in corso" ? "text-teal-500" :
                                            "text-green-600"
                                )}>
                                    {tournament.state === "in programma" ? "⏳ In programma" :
                                        tournament.state === "in corso" ? "🏃‍♂️ In corso" :
                                            "🏆 Completato"}
                                </span>
                            </p>

                            <p className="text-sm sm:text-base flex items-center gap-2">
                                <span className="font-semibold text-gray-900">📍 Luogo:</span>
                                <span className="text-gray-600">{tournament.location}</span>
                            </p>
                        </CardContent>


                    </CardHeader>

                    <CardFooter className="flex justify-between gap-2 px-6 pb-4 pt-2">

                        <AlertDialog>
                            <AlertDialogTrigger render={<Button variant="destructive" className="flex items-center gap-1 text-sm px-3 py-1 rounded-md shadow-sm hover:shadow-md transition-all" />}>
                                <Trash2Icon />
                                Elimina
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Sei assolutamente sicuro?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Questa azione è irreversibile. Cancelleremo il torneo dai nostri server in modo definitivo.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel className="px-4 py-2">Annulla</AlertDialogCancel>
                                    <AlertDialogAction
                                        disabled={isDeleting}
                                        onClick={() => mutate(tournament.id)}
                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all flex items-center gap-1"
                                    >
                                        {isDeleting ? <Loader2 className="animate-spin h-4 w-4" /> : "Sono sicuro"}
                                        <ChevronRight size={16} />
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        <Button
                            variant="secondary"
                            className="flex items-center gap-1 bg-gradient-to-r from-teal-400 to-green-500 text-white px-3 py-1 rounded-lg hover:brightness-110 transition-all"
                            nativeButton={false}
                            render={<Link to={`/tennismatches`}  state={{ tournament }}/>}
                        >
                            Mostra torneo
                            <ArrowRight size={16} />
                        </Button>

                    </CardFooter>
                </Card>
            ))}

            {/* Pulsante creazione torneo in fondo */}
            <div className="mt-4 col-span-full flex justify-center">
                <TournamentCreateButton />
            </div>
        </div>
    );
};

export default TournamentList;
