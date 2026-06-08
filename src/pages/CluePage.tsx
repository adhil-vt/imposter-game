import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { playClick, playTick, playBuzzer } from '../utils/sounds';
import { Volume2, Play, Pause, RotateCcw, ShieldAlert, Check } from 'lucide-react';

export const CluePage: React.FC = () => {
  const {
    players,
    playerOrder,
    setGameState,
  } = useGame();

  // Track who is currently giving a clue
  const [activeClueIndex, setActiveClueIndex] = useState<number>(0);
  
  // Timer states
  const [timerSeconds, setTimerSeconds] = useState<number>(30);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerActive && timerSeconds > 0) {
      timerRef.current = setTimeout(() => {
        setTimerSeconds(prev => prev - 1);
        playTick(); // Play ticking sound every second!
      }, 1000);
    } else if (timerSeconds === 0) {
      if (timerActive) {
        setTimeout(() => {
          setTimerActive(false);
        }, 0);
      }
      playBuzzer(); // Play buzzer sound!
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timerActive, timerSeconds]);

  const handleNextSpeaker = () => {
    playClick();
    // Reset timer for next speaker
    setTimerSeconds(30);
    setTimerActive(false);
    
    if (activeClueIndex < playerOrder.length - 1) {
      setActiveClueIndex(prev => prev + 1);
    }
  };

  const handlePrevSpeaker = () => {
    playClick();
    setTimerSeconds(30);
    setTimerActive(false);
    if (activeClueIndex > 0) {
      setActiveClueIndex(prev => prev - 1);
    }
  };

  const toggleTimer = () => {
    playClick();
    setTimerActive(!timerActive);
  };

  const resetTimer = () => {
    playClick();
    setTimerActive(false);
    setTimerSeconds(30);
  };

  const handleProceedToVoting = () => {
    playClick();
    setGameState('VOTING');
  };

  const currentSpeakerId = playerOrder[activeClueIndex];
  const currentSpeaker = players.find(p => p.id === currentSpeakerId);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6 py-6 relative">
      <div className="ambient-glow-1 top-10 left-10 animate-float" />

      <div className="w-full max-w-md flex flex-col gap-6 z-10">
        
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-secondary/15 text-brand-secondary border border-brand-secondary/20 mb-3 uppercase tracking-widest">
            <Volume2 className="w-3.5 h-3.5" />
            Clue Phase
          </div>
          <h2 className="text-3xl font-black text-white tracking-wide">
            Give Your Clues
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Say ONE word or short phrase describing your word.
          </p>
        </div>

        {/* Current Speaker Display */}
        {currentSpeaker && (
          <Card className="p-6 border-brand-secondary/20 bg-gradient-to-b from-brand-card to-brand-secondary/[0.03] text-center shadow-xl animate-scale-in">
            <span className="text-[10px] font-black text-brand-secondary tracking-widest uppercase block mb-1">
              Active Speaker
            </span>
            
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-3xl">{currentSpeaker.avatar}</span>
              <h3 className="text-3xl font-black text-white tracking-wide">
                {currentSpeaker.name}
              </h3>
            </div>

            {/* Timer circle/box */}
            <div className="flex flex-col items-center justify-center mb-2">
              <div className={`w-24 h-24 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-300 ${
                timerSeconds <= 5 
                  ? 'border-brand-danger bg-brand-danger/10 text-brand-danger shadow-[0_0_15px_rgba(239,68,68,0.25)] animate-pulse'
                  : 'border-white/10 bg-white/[0.01] text-white'
              }`}>
                <span className="text-3xl font-black">{timerSeconds}s</span>
              </div>

              {/* Timer Controls */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={toggleTimer}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-200 text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  {timerActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  {timerActive ? 'Pause' : 'Start'}
                </button>
                <button
                  onClick={resetTimer}
                  className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-brand-danger/20 hover:text-brand-danger text-slate-400 transition-colors"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </Card>
        )}

        {/* Clue Giving List/Queue */}
        <Card className="p-5 border-white/5 bg-brand-card/40">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Speaker Rotation Order
          </h4>
          <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-1">
            {playerOrder.map((id, index) => {
              const player = players.find(p => p.id === id);
              if (!player) return null;
              
              const isSpeakerActive = index === activeClueIndex;
              const isSpeakerFinished = index < activeClueIndex;

              return (
                <div
                  key={id}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-300 ${
                    isSpeakerActive
                      ? 'bg-brand-secondary/10 border-brand-secondary/35 text-white shadow-[0_0_12px_rgba(217,70,239,0.1)]'
                      : isSpeakerFinished
                      ? 'bg-white/[0.01] border-white/5 text-slate-500 opacity-60'
                      : 'bg-white/[0.02] border-white/5 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-extrabold w-5 text-center">
                      {index + 1}
                    </span>
                    <span className="text-base">{player.avatar}</span>
                    <span className="text-sm font-bold">{player.name}</span>
                  </div>

                  {isSpeakerFinished ? (
                    <div className="w-5 h-5 rounded-full bg-brand-accent/20 border border-brand-accent/30 flex items-center justify-center text-brand-accent">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  ) : isSpeakerActive ? (
                    <span className="text-[10px] font-black text-brand-secondary uppercase animate-pulse">
                      Speaking
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Footer actions */}
        <div className="flex gap-4">
          {activeClueIndex > 0 && (
            <Button
              variant="glass"
              onClick={handlePrevSpeaker}
              className="flex-1 py-4 rounded-2xl"
            >
              Previous
            </Button>
          )}

          {activeClueIndex < playerOrder.length - 1 ? (
            <Button
              variant="secondary"
              onClick={handleNextSpeaker}
              className="flex-[2] py-4 rounded-2xl font-bold"
            >
              Next Speaker
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleProceedToVoting}
              className="flex-[2] py-4 rounded-2xl font-bold animate-pulse"
            >
              <ShieldAlert className="w-5 h-5 mr-2" />
              Proceed to Voting
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
export {};