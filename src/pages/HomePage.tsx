import React, { useState } from 'react';
import { useGame, AVATAR_POOL } from '../context/GameContext';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { playClick } from '../utils/sounds';
import { 
  ShieldAlert, 
  BookOpen, 
  Play, 
  BarChart2, 
  Trash2, 
  History, 
  Calendar,
  Layers,
  Lock,
  CheckCircle2,
  Users,
  UserPlus,
  Globe
} from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  color: string;
}

export const HomePage: React.FC = () => {
  const { 
    initiateSetup, 
    setGameState, 
    stats, 
    clearStats, 
    history, 
    clearHistory,
    showConfirm,
    hostRoom,
    joinRoom,
    multiplayerStatus
  } = useGame();

  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [joinRoomCode, setJoinRoomCode] = useState('');
  const [joinName, setJoinName] = useState('');
  const [joinAvatar, setJoinAvatar] = useState(AVATAR_POOL[0]);
  const [joinError, setJoinError] = useState('');
  const [activeAvatarPicker, setActiveAvatarPicker] = useState(false);

  const winRate = stats.gamesPlayed > 0 
    ? Math.round((stats.crewmateWins / stats.gamesPlayed) * 100) 
    : 0;

  const handleRulesClick = () => {
    playClick();
    setGameState('RULES');
  };

  const handleHostClick = async () => {
    playClick();
    try {
      await hostRoom();
      setGameState('SETUP');
    } catch (err: any) {
      console.error(err);
      alert('Failed to host room: ' + err.message);
    }
  };

  const handleJoinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    setJoinError('');

    if (!joinRoomCode.trim()) {
      setJoinError('Room code is required!');
      return;
    }
    if (!joinName.trim()) {
      setJoinError('Player name is required!');
      return;
    }

    try {
      await joinRoom(joinRoomCode.trim(), joinName.trim(), joinAvatar);
      setIsJoinModalOpen(false);
      setGameState('SETUP');
    } catch (err: any) {
      setJoinError(err.message || 'Failed to connect to room. Check the code.');
    }
  };

  const formatTime = (timestamp: number) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' - ' + date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return 'Recent Game';
    }
  };

  // Achievements Logic
  const hasImpostorWin = history.some(item => item.winner === 'IMPOSTOR');
  
  const achievements: Achievement[] = [
    {
      id: 'detective',
      name: 'Master Detective',
      description: 'Win 5 games as Crewmate',
      icon: '🔍',
      isUnlocked: stats.crewmateWins >= 5,
      color: 'from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/20 glow-accent',
    },
    {
      id: 'deception',
      name: 'Deception Master',
      description: 'Win 3 games as Impostor',
      icon: '🎭',
      isUnlocked: stats.impostorWins >= 3,
      color: 'from-fuchsia-500/20 to-pink-500/10 text-fuchsia-400 border-fuchsia-500/20 glow-secondary',
    },
    {
      id: 'ghost',
      name: 'Ghost Agent',
      description: 'Win 1 game as Impostor',
      icon: '👻',
      isUnlocked: hasImpostorWin,
      color: 'from-blue-500/20 to-indigo-500/10 text-indigo-400 border-indigo-500/20 glow-primary',
    },
    {
      id: 'host',
      name: 'Trophy Host',
      description: 'Host 10 total matches',
      icon: '⏱️',
      isUnlocked: stats.gamesPlayed >= 10,
      color: 'from-amber-500/20 to-orange-500/10 text-amber-400 border-amber-500/20 glow-secondary',
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6 py-10 relative overflow-hidden">
      {/* Floating Decorative Glow Backgrounds */}
      <div className="ambient-glow-1 top-10 left-10 animate-float" />
      <div className="ambient-glow-2 bottom-10 right-10 animate-float-delayed" />

      {/* Main Container */}
      <div className="w-full max-w-md flex flex-col gap-6 z-10">
        
        {/* Animated Hero Header */}
        <div className="text-center flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-brand-primary via-indigo-500 to-brand-secondary flex items-center justify-center shadow-[0_0_40px_rgba(99,102,241,0.4)] animate-float">
            <ShieldAlert className="w-11 h-11 text-white" />
          </div>
          <div>
            <h1 className="text-5xl font-black tracking-wider text-white bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
              WHOISFAKE
            </h1>
            <p className="text-sm text-slate-400 mt-2 font-medium tracking-wide">
              The ultimate party game &bull; Offline & Online
            </p>
          </div>
        </div>

        {/* Buttons Menu */}
        <Card className="flex flex-col gap-3 p-6 border-brand-primary/10">
          <Button 
            variant="primary" 
            size="lg" 
            fullWidth 
            onClick={initiateSetup}
            className="group py-3.5 rounded-2xl font-bold"
          >
            <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            Pass & Play (Offline)
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="primary-glass" 
              size="md" 
              onClick={handleHostClick}
              disabled={multiplayerStatus === 'connecting'}
              className="py-3 rounded-2xl text-xs font-black"
            >
              <Users className="w-4 h-4 mr-1.5 text-brand-primary" />
              Host Online
            </Button>
            <Button 
              variant="secondary-glass" 
              size="md" 
              onClick={() => {
                playClick();
                setIsJoinModalOpen(true);
              }}
              className="py-3 rounded-2xl text-xs font-black"
            >
              <UserPlus className="w-4 h-4 mr-1.5 text-brand-secondary" />
              Join Room
            </Button>
          </div>

          <Button 
            variant="glass" 
            size="lg" 
            fullWidth 
            onClick={handleRulesClick}
            className="group py-3.5 rounded-2xl font-bold"
          >
            <BookOpen className="w-5 h-5 mr-2 text-brand-secondary group-hover:scale-110 transition-transform" />
            How to Play
          </Button>
        </Card>

        {/* Join Modal Overlay */}
        {isJoinModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/85 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-brand-card p-6 shadow-2xl animate-scale-in">
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/5">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-brand-secondary animate-pulse" />
                  Join Online Room
                </h3>
                <button 
                  onClick={() => setIsJoinModalOpen(false)}
                  className="text-slate-400 hover:text-white text-xl p-1"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleJoinSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">5-Digit Room Code</span>
                  <input
                    type="text"
                    maxLength={5}
                    placeholder="e.g. 18462"
                    value={joinRoomCode}
                    onChange={(e) => setJoinRoomCode(e.target.value.replace(/\D/g, ''))}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-200 focus:outline-none focus:border-brand-secondary"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Your Screen Name</span>
                  <input
                    type="text"
                    maxLength={14}
                    placeholder="Enter name"
                    value={joinName}
                    onChange={(e) => setJoinName(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-200 focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <div className="flex flex-col gap-1 relative">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Select Avatar</span>
                  <button
                    type="button"
                    onClick={() => setActiveAvatarPicker(!activeAvatarPicker)}
                    className="w-full py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-lg flex items-center justify-center gap-2"
                  >
                    <span>{joinAvatar}</span>
                    <span className="text-xs text-slate-500 font-semibold">(Change)</span>
                  </button>

                  {activeAvatarPicker && (
                    <div className="absolute top-16 left-0 right-0 z-40 p-3 rounded-2xl border border-brand-primary/20 bg-brand-dark shadow-2xl">
                      <div className="grid grid-cols-6 gap-1.5 max-h-[100px] overflow-y-auto">
                        {AVATAR_POOL.map(emoji => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => {
                              setJoinAvatar(emoji);
                              setActiveAvatarPicker(false);
                            }}
                            className={`w-8 h-8 flex items-center justify-center text-lg rounded-lg hover:bg-white/10 ${
                              joinAvatar === emoji ? 'bg-brand-primary/20' : ''
                            }`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {joinError && (
                  <span className="text-xs text-brand-danger font-semibold">{joinError}</span>
                )}

                <Button
                  variant="primary"
                  type="submit"
                  fullWidth
                  disabled={multiplayerStatus === 'connecting'}
                  className="py-3 rounded-xl font-bold"
                >
                  {multiplayerStatus === 'connecting' ? 'Connecting...' : 'Connect to Room'}
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* Statistics Board */}
        {stats.gamesPlayed > 0 && (
          <Card className="p-5 border-white/5 bg-brand-card/45 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold tracking-wider text-slate-400 uppercase flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-brand-secondary" />
                Game Statistics
              </h3>
              <button 
                onClick={() => {
                  playClick();
                  showConfirm({
                    title: 'Clear Statistics?',
                    message: 'Are you sure you want to reset all game stats? Your games played and win records will be permanently deleted.',
                    confirmText: 'Clear Stats',
                    cancelText: 'Keep Stats',
                    onConfirm: () => {
                      clearStats();
                    }
                  });
                }}
                className="p-1.5 text-slate-500 hover:text-brand-danger transition-colors"
                title="Clear Statistics"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3">
                <div className="text-2xl font-extrabold text-white">{stats.gamesPlayed}</div>
                <div className="text-[10px] font-bold text-slate-500 tracking-wider uppercase mt-1">Played</div>
              </div>
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3">
                <div className="text-2xl font-extrabold text-brand-accent">{stats.crewmateWins}</div>
                <div className="text-[10px] font-bold text-slate-500 tracking-wider uppercase mt-1">Crew Wins</div>
              </div>
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3">
                <div className="text-2xl font-extrabold text-brand-secondary">{stats.impostorWins}</div>
                <div className="text-[10px] font-bold text-slate-500 tracking-wider uppercase mt-1">Imp Wins</div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-xs text-slate-400">
              <span className="font-semibold">Crewmate Win Rate</span>
              <span className="font-extrabold text-brand-accent">{winRate}%</span>
            </div>
          </Card>
        )}

        {/* Trophy Room Achievements Card */}
        {stats.gamesPlayed > 0 && (
          <Card className="p-5 border-white/5 bg-brand-card/45 animate-fade-in flex flex-col">
            <h3 className="text-sm font-bold tracking-wider text-slate-400 uppercase mb-4 flex items-center gap-2">
              🏆 Trophy Room
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {achievements.map(badge => (
                <div 
                  key={badge.id}
                  className={`flex flex-col items-center text-center p-3.5 rounded-2xl border transition-all duration-500 bg-gradient-to-b relative ${
                    badge.isUnlocked 
                      ? badge.color 
                      : 'bg-white/[0.01] border-white/5 text-slate-600 opacity-40'
                  }`}
                >
                  <div className="text-2xl mb-1.5">{badge.icon}</div>
                  <span className="text-xs font-black tracking-wide block truncate w-full">
                    {badge.name}
                  </span>
                  <span className="text-[9px] text-slate-400 font-semibold block mt-0.5 leading-tight">
                    {badge.description}
                  </span>

                  {/* Status Indicator */}
                  {badge.isUnlocked ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-accent absolute top-1.5 right-1.5" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-600 absolute top-1.5 right-1.5" />
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Match History Log */}
        {history.length > 0 && (
          <Card className="p-5 border-white/5 bg-brand-card/45 animate-fade-in flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold tracking-wider text-slate-400 uppercase flex items-center gap-2">
                <History className="w-4.5 h-4.5 text-brand-primary" />
                Match History
              </h3>
              <button 
                onClick={() => {
                  playClick();
                  showConfirm({
                    title: 'Clear Match History?',
                    message: 'Are you sure you want to delete your recent match history log? This cannot be undone.',
                    confirmText: 'Clear Log',
                    cancelText: 'Keep Log',
                    onConfirm: () => {
                      clearHistory();
                    }
                  });
                }}
                className="p-1.5 text-slate-500 hover:text-brand-danger transition-colors"
                title="Clear History"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-3 max-h-[200px] overflow-y-auto pr-1">
              {history.map(item => {
                const isCrewWin = item.winner === 'CREWMATES';
                return (
                  <div 
                    key={item.id} 
                    className="p-3.5 rounded-2xl bg-white/[0.01] border border-white/5 flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-black px-2 py-0.5 rounded border uppercase tracking-wider ${
                        isCrewWin 
                          ? 'bg-brand-accent/10 text-brand-accent border-brand-accent/20' 
                          : 'bg-brand-secondary/10 text-brand-secondary border-brand-secondary/20'
                      }`}>
                        {isCrewWin ? 'Crew Win 🏆' : 'Impostor Win 🎭'}
                      </span>
                      <span className="text-[9px] text-slate-500 font-bold flex items-center gap-1">
                        <Calendar className="w-2.5 h-2.5" />
                        {formatTime(item.timestamp)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs text-slate-400 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-slate-500" />
                        <span>Category: <strong className="text-white">{item.category}</strong></span>
                      </div>
                      <span>{item.playerCount} Players</span>
                    </div>

                    <div className="pt-2 border-t border-white/5 text-[10px] text-slate-500 flex flex-wrap justify-between items-center gap-1">
                      <span>Impostor: <strong className="text-brand-secondary">{item.impostorName}</strong></span>
                      <span>Words: <strong className="text-slate-300">{item.commonWord}</strong> vs <strong className="text-brand-secondary">{item.impostorWord}</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
export {};
