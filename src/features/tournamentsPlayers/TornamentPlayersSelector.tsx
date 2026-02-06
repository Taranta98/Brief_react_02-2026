import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from 'motion/react'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import { PlayerService } from "../player/player.service";
import type { Player } from "../player/player.type";

interface TournamentPlayersSelectorProps {
  selectedPlayers: Player[];
  setSelectedPlayers: (players: Player[]) => void;
}

const TournamentPlayersSelector: React.FC<TournamentPlayersSelectorProps> = ({
  selectedPlayers,
  setSelectedPlayers,
}) => {
  // Fetch di tutti i giocatori
  const { data: allPlayers = [], isLoading, isError } = useQuery({
    queryKey: ["players"],
    queryFn: PlayerService.list,
  });

  // Stato ricerca
  const [searchTerm, setSearchTerm] = useState("");

  // Filtra giocatori in base a nome/cognome
  const filteredPlayers = useMemo(() => {
    return allPlayers.filter(
      (p) =>
        p.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allPlayers, searchTerm]);

  // Toggle giocatore selezionato
  const togglePlayer = (player: Player) => {
    if (selectedPlayers.some((p) => p.id === player.id)) {
      setSelectedPlayers(selectedPlayers.filter((p) => p.id !== player.id));
    } else {
      setSelectedPlayers([...selectedPlayers, player]);
    }
  };

  // Funzione per verificare potenza di 2
  const isPowerOfTwo = (n: number) => n > 0 && (n & (n - 1)) === 0;

  return (
    <div className="my-4">
      <h3 className="font-semibold mb-2">Seleziona giocatori</h3>

      {/* Input ricerca */}
      <Input
        placeholder="Cerca giocatore..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-2"
      />

      {isLoading && <div>Caricamento giocatori...</div>}
      {isError && <div>Errore nel caricamento dei giocatori</div>}

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
                    className={cn("flex justify-between items-center w-full")}
                    onClick={() => togglePlayer(player)}
                  >
                    <span className=" wrap-break-word whitespace-normal">{player.firstName} {player.lastName}</span>
                    {isSelected && <CheckIcon className="w-4 h-4" />}
                  </Button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Riepilogo selezionati */}
      <div className="mt-3 text-sm">
        <p>
          Giocatori selezionati: {selectedPlayers.length}{" "}
          {!isPowerOfTwo(selectedPlayers.length) &&
            selectedPlayers.length > 0 &&
            "(Il numero deve essere potenza di 2)"}
        </p>
        <ul className="list-disc list-inside max-h-32 overflow-y-auto">
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
