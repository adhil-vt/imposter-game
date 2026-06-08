import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Button } from '../components/Button';
import { RevealCard } from '../components/RevealCard';
import { Card } from '../components/Card';
import { ArrowRight, Eye, Sparkles } from 'lucide-react';

export const RevealPage: React.FC = () => {
  const {
    players,
    playerOrder,
    currentRevealIndex,
    isWordRevealed,
    revealWord,
    hideWord,
    nextReveal,
    impostorKnowsRole,
    activeWordPairHints,
    activePlayerVisualAid,
    hintsEnabled,
  } = useGame();

  // State to handle the "Pass device to Y" intermediary step
  const [passDeviceMode, setPassDeviceMode] = useState<boolean>(false);

  const activePlayerId = playerOrder[currentRevealIndex];
  const activePlayer = players.find(p => p.id === activePlayerId);
  
  const nextPlayerId = playerOrder[currentRevealIndex + 1];
  const nextPlayer = players.find(p => p.id === nextPlayerId);

  if (!activePlayer) return null;

  const handleHideWord = () => {
    hideWord();
    if (currentRevealIndex < playerOrder.length - 1) {
      setPassDeviceMode(true);
    } else {
      nextReveal();
    }
  };

  const handleNextPlayer = () => {
    setPassDeviceMode(false);
    nextReveal();
  };

  const isImpostor = activePlayer.role === 'IMPOSTOR';
  const roleBadge = isImpostor && impostorKnowsRole ? 'IMPOSTOR' : undefined;

  // 1. Render Intermediary "Pass Device" screen
  if (passDeviceMode && nextPlayer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6 py-6 text-center animate-fade-in">
        <div className="ambient-glow-1 top-20 right-10 animate-float" />
        <div className="w-full max-w-md flex flex-col gap-8 z-10">
          <Card className="p-8 border-brand-primary/10 bg-brand-card/60">
            <div className="w-20 h-20 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-3xl mx-auto mb-6 shadow-inner animate-pulse">
              {nextPlayer.avatar}
            </div>
            
            <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">
              Pass the Device
            </h2>
            <p className="text-sm text-slate-400 mb-6">
              Give the device to the next player.
            </p>

            <div className="py-4 px-6 rounded-2xl bg-white/[0.02] border border-white/5 inline-block mb-4">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Next Up</span>
              <span className="text-2xl font-black text-brand-secondary block mt-0.5">{nextPlayer.name}</span>
            </div>
          </Card>

          <Button 
            variant="primary" 
            size="lg" 
            fullWidth 
            onClick={handleNextPlayer}
            className="py-4 rounded-2xl font-bold"
          >
            I am {nextPlayer.name}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  // 2. Render active player screen
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6 py-6 text-center animate-fade-in">
      <div className="ambient-glow-2 bottom-20 left-10 animate-float-delayed" />
      
      <div className="w-full max-w-md flex flex-col gap-8 z-10">
        
        {/* Title indicating who should look */}
        <div className="flex flex-col items-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-primary/15 text-brand-primary border border-brand-primary/20 mb-4 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            Player {currentRevealIndex + 1} of {playerOrder.length}
          </div>
          
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-3xl mb-2">
            {activePlayer.avatar}
          </div>
          
          <h2 className="text-3xl font-black text-white tracking-wide">
            {activePlayer.name}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Reveal your secret word below.
          </p>
        </div>

        {/* 3D Flip Card with hints and visual aid context */}
        <RevealCard 
          word={activePlayer.word} 
          isRevealed={isWordRevealed} 
          onToggle={isWordRevealed ? handleHideWord : revealWord} 
          roleBadge={roleBadge}
          hints={activeWordPairHints}
          visualAid={activePlayerVisualAid}
          hintsEnabled={hintsEnabled}
        />

        {/* Buttons for ease of click */}
        <div className="w-full">
          {!isWordRevealed ? (
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={revealWord}
              className="py-4 rounded-2xl font-bold"
            >
              <Eye className="w-5 h-5 mr-2" />
              Reveal My Word
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="lg"
              fullWidth
              onClick={handleHideWord}
              className="py-4 rounded-2xl font-bold"
            >
              Hide Word & Continue
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
export {};
