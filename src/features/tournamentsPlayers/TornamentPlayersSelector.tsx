import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from 'motion/react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import { PlayerService } from "../player/player.service";
import type { Player } from "../player/player.type";

interface TournamentPlayersSelectorProps {
  selectedPlayers: Player[];
  setSelectedPlayers: (players: Player[]) => void;
  maxPlayers?: number; 
}

const TournamentPlayersSelector: React.FC<TournamentPlayersSelectorProps> = ({
  selectedPlayers,
  setSelectedPlayers,
}) => {
  // Fetch di tutti i giocatori

  //useMemo serve a memorizzare (cachare) un valore calcolato, così React non lo ricalcola ad ogni render
  const { data: allPlayers = [], isLoading, isError } = useQuery({
    queryKey: ["players"],
    queryFn: PlayerService.list,
  });

//Use state per gestire la ricerca dei giocatori
  const [searchTerm, setSearchTerm] = useState("");

  // Filtra giocatori in base a nome/cognome
  const filteredPlayers = useMemo(() => {
    return allPlayers.filter(
      (p) =>
        p.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    );
      // useMemo ricalcola filteredPlayers solo quando cambiano allPlayers o searchTerm
  }, [allPlayers, searchTerm]);

  // Funzione per selezionare o deselezionare un giocatore
  const togglePlayer = (player: Player) => {
     // Controlla se il giocatore è già selezionato
    const isSelected = selectedPlayers.some((p) => p.id === player.id);
    if (isSelected) {
      // Se è già selezionato, lo rimuove dalla lista dei giocatori selezionati
      setSelectedPlayers(selectedPlayers.filter((p) => p.id !== player.id));
    } else {
       // Se non è selezionato e ci sono già 8 giocatori selezionati, return
      if (selectedPlayers.length >= 8) return;

        // Altrimenti aggiunge il giocatore alla lista dei selezionati
      setSelectedPlayers([...selectedPlayers, player]);
    }
  };

  return (
    <div className="my-4">
      <h3 className="font-bold mb-2 text-yellow-400">Seleziona giocatori (8)</h3>

      {/* Input ricerca */}
      <Input
        placeholder="Cerca giocatore..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-2 bg-slate-900 text-yellow-400 placeholder:text-yellow-300 border border-gray-700 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200"
      />

      {isLoading && <div className="text-yellow-400">Caricamento giocatori...</div>}
      {isError && <div className="text-red-500">Errore nel caricamento dei giocatori</div>}

      {!isLoading && !isError && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-64 overflow-y-auto">
          <AnimatePresence>
            {filteredPlayers.slice(0, 50).map((player) => {
              const isSelected = selectedPlayers.some((p) => p.id === player.id);

              return (
                <motion.div
                  key={player.id}
                  layout
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                >
                  <Button
                    variant={isSelected ? "secondary" : "outline"}
                    className={cn(
                      "flex justify-between items-center w-full bg-slate-950 border border-yellow-500 text-yellow-400 hover:bg-yellow-500/10 hover:text-yellow-300 transition-all rounded-lg",
                      selectedPlayers.length >= 8 && !isSelected
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    )}
                    onClick={() => togglePlayer(player)}
                    disabled={selectedPlayers.length >= 8 && !isSelected}
                  >
                    <span className="whitespace-normal">{player.firstName} {player.lastName}</span>
                    {isSelected && <CheckIcon className="w-4 h-4 text-green-500" />}
                  </Button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Riepilogo selezionati */}
      <div className="mt-3 text-sm">
        <p className={selectedPlayers.length !== 8 ? "text-red-500 font-medium" : "text-green-500 font-medium"}>
          Giocatori selezionati: {selectedPlayers.length} / 8{" "}
          {selectedPlayers.length !== 8 && "(Seleziona esattamente 8 giocatori)"}
        </p>

        <ul className="list-disc list-inside max-h-32 overflow-y-auto mt-1 text-yellow-400">
          {selectedPlayers.map((p) => (
            <li key={p.id}>
              {p.firstName} {p.lastName}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TournamentPlayersSelector;
