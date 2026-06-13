import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Button } from '../components/Button';
import { RevealCard } from '../components/RevealCard';
import { Card } from '../components/Card';
import { ChatDrawer } from '../components/ChatDrawer';
import { ArrowRight, Eye, Sparkles, Wifi, Flag } from 'lucide-react';
import { playClick } from '../utils/sounds';

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
    isMultiplayer,
    myPlayerId,
    playersWhoRevealed,
    isLobbyAdmin,
    lobbyAdminId,
    setSelectedModerationPlayer,
    onlinePlayers,
    playerPings,
    roomCode,
    isHost
  } = useGame();

  // State to handle the "Pass device to Y" intermediary step (offline only)
  const [passDeviceMode, setPassDeviceMode] = useState<boolean>(false);
  const [hasCompletedReveal, setHasCompletedReveal] = useState<boolean>(false);

  // If online multiplayer, display the current user's player card; otherwise display sequential active player card
  const activePlayerId = isMultiplayer ? myPlayerId : playerOrder[currentRevealIndex];
  const activePlayer = players.find(p => p.id === activePlayerId);
  
  const nextPlayerId = isMultiplayer ? '' : playerOrder[currentRevealIndex + 1];
  const nextPlayer = isMultiplayer ? null : players.find(p => p.id === nextPlayerId);

  if (!activePlayer) return null;

  const renderPlayerRoster = () => {
    if (!isMultiplayer) return null;

    return (
      <Card className="p-5 border-white/5 bg-brand-card/40 text-left mt-4 animate-scale-in">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          Room Players
        </h4>
        <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-1">
          {players.map((player) => {
            const isMe = player.id === myPlayerId;
            const isFinished = playersWhoRevealed.includes(player.id);
            
            return (
              <div
                key={player.id}
                className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/[0.02] text-slate-300"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">{player.avatar}</span>
                  <span className="text-sm font-bold">{player.name}</span>
                  {isMe && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-slate-400 font-bold uppercase tracking-wider">
                      You
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 select-none">
                  {/* Network Latency Ping Indicator */}
                  {(() => {
                    const op = onlinePlayers.find(p => p.id === player.id);
                    const isHostPlayer = op ? (op.isHost || op.isAdmin) : false;
                    const pingVal = isHostPlayer
                      ? (isHost ? 0 : playerPings[`imposter-${roomCode}`])
                      : playerPings[player.id];
                    
                    if (pingVal === undefined) return null;
                    
                    let badgeColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
                    if (pingVal > 150) {
                      badgeColor = 'text-rose-400 bg-rose-500/10 border-rose-500/20';
                    } else if (pingVal > 80) {
                      badgeColor = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
                    }
                    
                    return (
                      <span className={`text-[9px] border px-1.5 py-0.5 rounded-full font-black flex items-center gap-0.5 leading-none shrink-0 ${badgeColor}`} title="Network Latency">
                        <Wifi className="w-2.5 h-2.5 shrink-0" />
                        {pingVal === 0 ? 'Local' : `${pingVal}ms`}
                      </span>
                    );
                  })()}

                  {/* Ready/Finished viewing card Indicator */}
                  {isFinished ? (
                    <span className="text-[9px] border border-brand-accent/20 bg-brand-accent/10 text-brand-accent px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      Ready
                    </span>
                  ) : (
                    <span className="text-[9px] border border-white/10 bg-white/5 text-slate-500 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider animate-pulse">
                      Viewing
                    </span>
                  )}

                  {/* Report button */}
                  {!isMe && (isLobbyAdmin || player.id !== lobbyAdminId) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playClick();
                        const targetOp = onlinePlayers.find(op => op.id === player.id);
                        if (targetOp) {
                          setSelectedModerationPlayer(targetOp);
                        }
                      }}
                      className="group p-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/25 hover:border-rose-500/50 hover:text-rose-300 hover:shadow-[0_0_6px_rgba(244,63,94,0.25)] transition-all duration-200 cursor-pointer"
                      title="Report Player"
                    >
                      <Flag className="w-3.5 h-3.5 group-hover:scale-110 transition-transform duration-150" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    );
  };

  const handleHideWord = () => {
    hideWord();
    if (isMultiplayer) {
      setHasCompletedReveal(true);
      nextReveal();
    } else {
      if (currentRevealIndex < playerOrder.length - 1) {
        setPassDeviceMode(true);
      } else {
        nextReveal();
      }
    }
  };

  const handleNextPlayer = () => {
    setPassDeviceMode(false);
    nextReveal();
  };

  const isImpostor = activePlayer.role === 'IMPOSTOR';
  const roleBadge = isImpostor && impostorKnowsRole ? 'IMPOSTOR' : undefined;

  // 1. Render Multiplayer Waiting View
  if (isMultiplayer && hasCompletedReveal) {
    return (
      <div className="w-full flex-1 flex flex-col lg:flex-row gap-6 px-6 py-6 text-center animate-fade-in">
        <div className="ambient-glow-1 top-20 right-10 animate-float" />

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md flex flex-col gap-6 z-10">
            <Card className="p-8 border-white/5 bg-brand-card/50">
              <div className="w-16 h-16 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-3xl mx-auto mb-4 animate-bounce">
                {activePlayer.avatar}
              </div>
              <h3 className="text-xl font-black text-white mb-2">Card Memorized!</h3>
              <p className="text-xs text-slate-400">
                Keep your word secret! Waiting for other players to finish viewing their cards...
              </p>
              <div className="mt-6 pt-4 border-t border-white/5 text-[10px] text-slate-500 font-extrabold uppercase tracking-widest">
                Progress: {playersWhoRevealed.length} / {players.length} Ready
              </div>
            </Card>
            {renderPlayerRoster()}
          </div>
        </div>

        <div className="hidden lg:flex w-full max-w-[380px] shrink-0">
          <ChatDrawer embedded />
        </div>

        <ChatDrawer hideFloatingOnDesktop />
      </div>
    );
  }

  // 2. Render Intermediary "Pass Device" screen (Offline Only)
  if (!isMultiplayer && passDeviceMode && nextPlayer) {
    return (
      <div className="w-full my-auto flex flex-col items-center px-6 py-6 text-center animate-fade-in">
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
    <div className="w-full flex-1 flex flex-col lg:flex-row gap-6 px-6 py-6 text-center animate-fade-in">
      <div className="ambient-glow-2 bottom-20 left-10 animate-float-delayed" />

      <div className="flex-1 flex items-center justify-center">
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
          {renderPlayerRoster()}
        </div>
      </div>

      <div className="hidden lg:flex w-full max-w-[380px] shrink-0">
        <ChatDrawer embedded />
      </div>

      <ChatDrawer hideFloatingOnDesktop />
    </div>
  );
};
export {};
