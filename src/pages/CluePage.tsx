import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { playClick, playTick } from '../utils/sounds';
import { Volume2, ShieldAlert, Flag, Check, Wifi } from 'lucide-react';
import { multiplayer } from '../utils/multiplayer';

export const CluePage: React.FC = () => {
  const {
    players,
    playerOrder,
    setGameState,
    isMultiplayer,
    isLobbyAdmin,
    activeClueIndex,
    setActiveClueIndex,
    timerSeconds,
    setTimerSeconds,
    setTimerActive,
    clueTimerLimit,
    playerPings,
    onlinePlayers,
    roomCode,
    isHost,
    myPlayerId,
    lobbyAdminId,
    setSelectedModerationPlayer,
  } = useGame();

  const handleNextSpeaker = () => {
    playClick();
    const nextIdx = activeClueIndex < playerOrder.length - 1 ? activeClueIndex + 1 : activeClueIndex;
    setActiveClueIndex(nextIdx);
    setTimerSeconds(clueTimerLimit);
    setTimerActive(false);
    
    if (isMultiplayer && isLobbyAdmin) {
      multiplayer.send({
        type: 'TIMER_SYNC',
        activeClueIndex: nextIdx,
        timerSeconds: clueTimerLimit,
        timerActive: false
      });
    }
  };

  const handlePrevSpeaker = () => {
    playClick();
    const prevIdx = activeClueIndex > 0 ? activeClueIndex - 1 : activeClueIndex;
    setActiveClueIndex(prevIdx);
    setTimerSeconds(clueTimerLimit);
    setTimerActive(false);
    
    if (isMultiplayer && isLobbyAdmin) {
      multiplayer.send({
        type: 'TIMER_SYNC',
        activeClueIndex: prevIdx,
        timerSeconds: clueTimerLimit,
        timerActive: false
      });
    }
  };


  const handleProceedToVoting = () => {
    playClick();
    setGameState('VOTING');
  };

  const [prepSeconds, setPrepSeconds] = useState<number>(3);
  const [isPrepActive, setIsPrepActive] = useState<boolean>(true);

  // Trigger preparation countdown when activeClueIndex changes
  useEffect(() => {
    setPrepSeconds(3);
    setIsPrepActive(true);
    
    if (isLobbyAdmin || !isMultiplayer) {
      setTimerActive(false);
      setTimerSeconds(clueTimerLimit);
    }
  }, [activeClueIndex]);

  // Local prep timer countdown
  useEffect(() => {
    let interval: any = null;
    if (isPrepActive && prepSeconds > 0) {
      interval = setInterval(() => {
        setPrepSeconds(prev => {
          if (prev <= 1) {
            setIsPrepActive(false);
            clearInterval(interval);
            if (isLobbyAdmin || !isMultiplayer) {
              setTimerActive(true);
            }
            return 0;
          }
          try {
            playTick();
          } catch (e) {}
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPrepActive, prepSeconds, isLobbyAdmin, isMultiplayer, setTimerActive, setTimerSeconds, clueTimerLimit]);

  const currentSpeakerId = playerOrder[activeClueIndex];
  const currentSpeaker = players.find(p => p.id === currentSpeakerId);

  return (
    <div className="w-full my-auto flex flex-col items-center px-6 py-6 relative">
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
          isPrepActive ? (
            <Card className="p-8 border-brand-secondary/35 bg-gradient-to-b from-brand-card to-brand-secondary/[0.03] text-center shadow-2xl animate-scale-in flex flex-col items-center justify-center min-h-[220px]">
              {isMultiplayer && currentSpeakerId === myPlayerId ? (
                <div className="animate-bounce mb-2">
                  <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-brand-danger/20 border border-brand-danger/30 text-brand-danger uppercase tracking-widest animate-pulse">
                    🚨 IT'S YOUR TURN! 🚨
                  </span>
                </div>
              ) : (
                <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase block mb-2">
                  Next Speaker Preparing
                </span>
              )}
              
              <div className="flex items-center justify-center gap-3 mb-4 mt-2">
                <span className="text-3xl animate-pulse">{currentSpeaker.avatar}</span>
                <h3 className="text-3xl font-black text-white tracking-wide">
                  {currentSpeaker.name}
                </h3>
                {isMultiplayer && currentSpeakerId !== myPlayerId && (isLobbyAdmin || currentSpeakerId !== lobbyAdminId) && (
                  <button
                    onClick={() => {
                      playClick();
                      const targetOp = onlinePlayers.find(p => p.id === currentSpeakerId);
                      if (targetOp) {
                        setSelectedModerationPlayer(targetOp);
                      }
                    }}
                    className="group p-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/25 hover:border-rose-500/50 hover:text-rose-300 hover:shadow-[0_0_8px_rgba(244,63,94,0.3)] transition-all duration-200 cursor-pointer"
                    title="Report Player"
                  >
                    <Flag className="w-3.5 h-3.5 group-hover:scale-110 transition-transform duration-150" />
                  </button>
                )}
              </div>

              <span className="text-xs text-slate-400 font-semibold mb-5 animate-pulse">
                {isMultiplayer && currentSpeakerId === myPlayerId 
                  ? "Prepare to speak! Your turn starts in..." 
                  : "Turn starting in..."}
              </span>

              <div className="w-20 h-20 rounded-full bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center text-4xl font-black text-brand-primary animate-pulse shadow-lg shadow-brand-primary/10">
                {prepSeconds}
              </div>
            </Card>
          ) : (
            <Card className="p-6 border-brand-secondary/20 bg-gradient-to-b from-brand-card to-brand-secondary/[0.03] text-center shadow-xl animate-scale-in">
              <span className="text-[10px] font-black text-brand-secondary tracking-widest uppercase block mb-1">
                Active Speaker
              </span>
              
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="text-3xl">{currentSpeaker.avatar}</span>
                <h3 className="text-3xl font-black text-white tracking-wide">
                  {currentSpeaker.name}
                </h3>
                {isMultiplayer && currentSpeakerId !== myPlayerId && (isLobbyAdmin || currentSpeakerId !== lobbyAdminId) && (
                  <button
                    onClick={() => {
                      playClick();
                      const targetOp = onlinePlayers.find(p => p.id === currentSpeakerId);
                      if (targetOp) {
                        setSelectedModerationPlayer(targetOp);
                      }
                    }}
                    className="group p-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/25 hover:border-rose-500/50 hover:text-rose-300 hover:shadow-[0_0_8px_rgba(244,63,94,0.3)] transition-all duration-200 cursor-pointer"
                    title="Report Player"
                  >
                    <Flag className="w-4 h-4 group-hover:scale-110 transition-transform duration-150" />
                  </button>
                )}
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

              </div>
            </Card>
          )
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

                  <div className="flex items-center gap-2 select-none">
                    {isMultiplayer && id !== myPlayerId && (isLobbyAdmin || id !== lobbyAdminId) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          playClick();
                          const targetOp = onlinePlayers.find(p => p.id === id);
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
                    {isMultiplayer && (() => {
                      const op = onlinePlayers.find(p => p.id === id);
                      const isHostPlayer = op ? (op.isHost || op.isAdmin) : false;
                      const pingVal = isHostPlayer
                        ? (isHost ? 0 : playerPings[`imposter-${roomCode}`])
                        : playerPings[id];
                      
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

                    {isSpeakerFinished ? (
                      <div className="w-5 h-5 rounded-full bg-brand-accent/20 border border-brand-accent/30 flex items-center justify-center text-brand-accent shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    ) : isSpeakerActive ? (
                      <span className="text-[10px] font-black text-brand-secondary uppercase animate-pulse shrink-0">
                        Speaking
                      </span>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Footer actions */}
        {(!isMultiplayer || isLobbyAdmin) && (
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
        )}
      </div>
    </div>
  );
};
export {};