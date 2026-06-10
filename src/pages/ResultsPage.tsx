import React, { useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import confetti from 'canvas-confetti';
import { Award, RefreshCw, PlusCircle, Trophy, ShieldAlert, LogOut, Check } from 'lucide-react';

export const ResultsPage: React.FC = () => {
  const {
    players,
    impostorId,
    commonWord,
    impostorWord,
    chosenCategory,
    votes,
    winner,
    voteStats,
    restartGame,
    resetGame,
    isMultiplayer,
    isLobbyAdmin,
    leaveRoom,
    readyPlayers,
    setPlayerReady,
    myPlayerId,
  } = useGame();

  const impostorPlayer = players.find(p => p.id === impostorId);

  // Trigger confetti on mount
  useEffect(() => {
    // Standard explosive confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6366F1', '#D946EF', '#10B981', '#F59E0B']
    });

    // Side beams confetti for double impact
    const duration = 2 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#6366F1', '#D946EF']
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#6366F1', '#D946EF']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    
    frame();
  }, []);

  if (!impostorPlayer) return null;

  const crewmatesWin = winner === 'CREWMATES';

  return (
    <div className="w-full my-auto flex flex-col items-center px-6 py-8 relative">
      {/* Dynamic ambient glow based on who won */}
      <div className={`absolute w-[350px] h-[350px] rounded-full blur-[90px] pointer-events-none top-10 ${
        crewmatesWin ? 'bg-brand-accent/10 animate-float' : 'bg-brand-secondary/10 animate-float'
      }`} />

      <div className="w-full max-w-md flex flex-col gap-6 z-10">
        
        {/* Victory/Defeat Announcement */}
        <div className="text-center">
          <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4 border shadow-2xl ${
            crewmatesWin 
              ? 'bg-brand-accent/15 border-brand-accent/30 text-brand-accent shadow-brand-accent/10 animate-bounce' 
              : 'bg-brand-secondary/15 border-brand-secondary/30 text-brand-secondary shadow-brand-secondary/10 animate-pulse'
          }`}>
            {crewmatesWin ? <Trophy className="w-10 h-10" /> : <ShieldAlert className="w-10 h-10" />}
          </div>

          <h2 className={`text-4xl font-black tracking-wide ${
            crewmatesWin ? 'text-brand-accent' : 'text-brand-secondary'
          }`}>
            {crewmatesWin ? 'Crewmates Win!' : 'Impostor Wins!'}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {crewmatesWin 
              ? 'The crew successfully identified the impostor!' 
              : 'The impostor successfully evaded detection!'}
          </p>
        </div>

        {/* Word Reveal Cards */}
        <Card className="p-6 border-white/5 bg-brand-card/50">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 text-center">
            Word Breakdown &bull; Category: {chosenCategory}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-4 text-center">
              <span className="text-[10px] font-black text-brand-primary tracking-wider uppercase block mb-1">
                Crew Word
              </span>
              <span className="text-lg font-black text-white">{commonWord}</span>
            </div>

            <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-4 text-center">
              <span className="text-[10px] font-black text-brand-secondary tracking-wider uppercase block mb-1">
                Impostor Word
              </span>
              <span className="text-lg font-black text-white">{impostorWord}</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/5 text-center flex items-center justify-center gap-2">
            <span className="text-xs text-slate-400">
              The Impostor was:
            </span>
            <div className="inline-flex items-center gap-1.5 bg-white/5 border border-white/5 px-2.5 py-1 rounded-xl">
              <span>{impostorPlayer.avatar}</span>
              <span className="font-extrabold text-sm text-brand-secondary">{impostorPlayer.name}</span>
            </div>
          </div>
        </Card>

        {/* Vote Results Statistics Tally */}
        <Card className="p-6 border-white/5 bg-brand-card/45">
          <h3 className="text-sm font-bold text-slate-400 tracking-wider uppercase mb-4 flex items-center gap-2">
            <Award className="w-4.5 h-4.5 text-brand-primary" />
            Vote Statistics
          </h3>

          <div className="flex flex-col gap-3">
            {players.map(player => {
              const voteCount = voteStats[player.id] || 0;
              const isImpostor = player.id === impostorId;
              const percent = players.length > 0 ? (voteCount / players.length) * 100 : 0;

              return (
                <div key={player.id} className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-1.5">
                      <span>{player.avatar}</span>
                      <span className={`font-bold ${isImpostor ? 'text-brand-secondary' : 'text-slate-200'}`}>
                        {player.name}
                      </span>
                      {isImpostor && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-brand-secondary/15 text-brand-secondary uppercase border border-brand-secondary/20">
                          Impostor
                        </span>
                      )}
                    </div>
                    <span className="font-extrabold text-slate-300">
                      {voteCount} {voteCount === 1 ? 'vote' : 'votes'}
                    </span>
                  </div>

                  {/* Vote count visual bar */}
                  <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        isImpostor ? 'bg-brand-secondary' : 'bg-brand-primary'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Vote-by-vote Details */}
        <Card className="p-5 border-white/5 bg-brand-card/35">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Individual Ballots
          </h4>
          <div className="grid grid-cols-1 gap-2 max-h-[140px] overflow-y-auto pr-1">
            {Object.entries(votes).map(([voterId, votedId]) => {
              const voter = players.find(p => p.id === voterId);
              const voted = players.find(p => p.id === votedId);
              if (!voter || !voted) return null;

              return (
                <div 
                  key={voterId}
                  className="flex items-center justify-between text-xs py-2 px-3 bg-white/[0.01] border border-white/5 rounded-xl"
                >
                  <div className="flex items-center gap-1.5">
                    <span>{voter.avatar}</span>
                    <span className="font-bold text-slate-300">{voter.name}</span>
                  </div>
                  <span className="text-slate-500 font-semibold px-2">&rarr;</span>
                  <div className="flex items-center gap-1.5">
                    <span>{voted.avatar}</span>
                    <span className={`font-bold ${voted.id === impostorId ? 'text-brand-secondary' : 'text-slate-400'}`}>
                      {voted.name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Controls */}
        <div className="flex flex-col gap-3 w-full">
          {isMultiplayer && !isLobbyAdmin && (
            <div className="flex flex-col gap-2 mb-2 w-full">
              {readyPlayers.includes(myPlayerId) ? (
                <div className="text-center py-3.5 px-4 rounded-2xl bg-brand-accent/10 border border-brand-accent/20 text-brand-accent font-bold text-sm flex items-center justify-center gap-2 animate-pulse">
                  <Check className="w-4 h-4 text-brand-accent" />
                  Ready! Waiting for Host... ({readyPlayers.length}/{players.length} Ready)
                </div>
              ) : (
                <Button
                  variant="primary"
                  onClick={() => setPlayerReady(true)}
                  className="w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  I'm Ready for Next Round
                </Button>
              )}
            </div>
          )}

          <div className="flex gap-4 w-full">
            <Button 
              variant="glass" 
              onClick={isMultiplayer ? leaveRoom : resetGame} 
              className="flex-1 py-4 rounded-2xl font-bold text-sm"
            >
              {isMultiplayer ? <LogOut className="w-5 h-5 mr-2" /> : <PlusCircle className="w-5 h-5 mr-2" />}
              {isMultiplayer ? 'Leave Room' : 'New Game'}
            </Button>

            {(!isMultiplayer || isLobbyAdmin) && (
              <Button 
                variant="primary" 
                onClick={restartGame} 
                className="flex-[2] py-4 rounded-2xl font-bold text-sm"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                {isMultiplayer ? `Play Again (${readyPlayers.length}/${players.length} Ready)` : 'Play Again'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export {};
