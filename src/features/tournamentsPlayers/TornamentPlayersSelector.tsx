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
  const { data: allPlayers = [], isLoading, isError } = useQuery({
    queryKey: ["players"],
    queryFn: PlayerService.list,
  });

  const [searchTerm, setSearchTerm] = useState("");

  // Filtra giocatori in base a nome/cognome
  const filteredPlayers = useMemo(() => {
    return allPlayers.filter(
      (p) =>
        p.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allPlayers, searchTerm]);

  // Toggle giocatore selezionato con limite massimo di 8
  const togglePlayer = (player: Player) => {
    const isSelected = selectedPlayers.some((p) => p.id === player.id);

    if (isSelected) {
      // Deseleziona
      setSelectedPlayers(selectedPlayers.filter((p) => p.id !== player.id));
    } else {
      // Non aggiungere se siamo già a 8
      if (selectedPlayers.length >= 8) return;
      setSelectedPlayers([...selectedPlayers, player]);
    }
  };

  return (
    <div className="my-4">
      <h3 className="font-semibold mb-2">Seleziona giocatori (8)</h3>

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
                    className={cn(
                      "flex justify-between items-center w-full",
                      selectedPlayers.length >= 8 && !isSelected
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    )}
                    onClick={() => togglePlayer(player)}
                    disabled={selectedPlayers.length >= 8 && !isSelected}
                  >
                    <span className="whitespace-normal">{player.firstName} {player.lastName}</span>
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
        <p className={selectedPlayers.length !== 8 ? "text-red-500 font-medium" : "text-green-600 font-medium"}>
          Giocatori selezionati: {selectedPlayers.length} / 8{" "}
          {selectedPlayers.length !== 8 && "(Seleziona esattamente 8 giocatori)"}
        </p>

        <ul className="list-disc list-inside max-h-32 overflow-y-auto mt-1">
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
