import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { playClick } from '../utils/sounds';
import { 
  ChevronLeft, 
  Calendar, 
  Tag, 
  Sparkles, 
  Wrench, 
  ShieldAlert, 
  Layers,
  CheckCircle2,
  Lock
} from 'lucide-react';

interface ChangelogItem {
  version: string;
  date: string;
  title: string;
  type: 'feature' | 'fix' | 'security';
  description: string;
  details: string[];
}

export const ChangelogPage: React.FC = () => {
  const { setGameState } = useGame();
  const [activeFilter, setActiveFilter] = useState<'all' | 'feature' | 'fix' | 'security'>('all');

  const logs: ChangelogItem[] = [
    {
      version: 'v1.5.0',
      date: 'June 12, 2026',
      title: 'Scoped Chat & Spectator Status Sync',
      type: 'feature',
      description: 'Implemented isolated lobby vs. game chat scopes, and live round progress screens for waiting players.',
      details: [
        'Partitioned room messaging into separate "lobby" and "game" channels so spectator chats do not leak into active gameplay.',
        'Preserved historical lobby history for active players when starting a new round.',
        'Created a dynamic active game phase panel in the lobby, allowing spectating guests to monitor player progress (Reveal, Clues, Voting, Results).',
        'Centralized visibility checks inside appendChatMessage to prevent unread notification badges from triggering for hidden chats.'
      ]
    },
    {
      version: 'v1.4.0',
      date: 'June 11, 2026',
      title: 'Moderation & Alerts Overhaul',
      type: 'security',
      description: 'Added host moderation reason boxes, persistent device-id bans, and non-blocking notification toasts.',
      details: [
        'Designed input fields for hosts to supply optional reasons when kicking/banning players, showing direct alerts to the targeted user.',
        'Enforced persistent device-id banning to block banned users from re-entering a lobby using the room code.',
        'Converted democratic voting overlays into non-blocking, clean chat-style toasts to keep gameplay smooth.',
        'Replaced standard text emojis with modern SVG icons (Lucide icons) inside system notices.',
        'Resolved state sync issues for immediate ready status badges during player card reveals.'
      ]
    },
    {
      version: 'v1.3.0',
      date: 'June 10, 2026',
      title: 'Chat & Name Moderation Update',
      type: 'security',
      description: 'Added word filtering to keep chat matches friendly, polite, and fun.',
      details: [
        'Automatically screens player names during room connection and blocks inappropriate names.',
        'Validates custom player names in offline Pass & Play lobbies before the game can begin.',
        'Recognizes and censors common vulgar variations, symbols, spaces, and repeated letters in chat.',
        'Masks inappropriate chat messages in real-time, keeping communication clean for all players.'
      ]
    },
    {
      version: 'v1.2.0',
      date: 'June 10, 2026',
      title: 'Results Screen & Ready States',
      type: 'feature',
      description: 'Synchronized the final game-over results page for all players and added round ready-up checks.',
      details: [
        'All players in multiplayer can now see who the impostor was, the word list, categories, and voting tallies.',
        'Added a "Ready for Next Round" check button for guest players to declare they are ready to proceed.',
        'Allows hosts to see exactly how many players have readied up before starting the next game.',
        'Refined button layouts and cleaned up the "Leave Room" screen transition.'
      ]
    },
    {
      version: 'v1.1.0',
      date: 'June 10, 2026',
      title: 'Multiplayer Lobby Chat Fix',
      type: 'fix',
      description: 'Resolved a connection issue preventing guest chat messages from reaching other lobby members.',
      details: [
        'Ensured that messages sent by guest players are instantly visible to all other connected players.',
        'Improved lobby communication stability between host and guests.'
      ]
    },
    {
      version: 'v1.0.0',
      date: 'June 9, 2026',
      title: 'Official Release',
      type: 'feature',
      description: 'First public release of WhoIsFake with real-time multiplayer and Pass & Play modes.',
      details: [
        'Local Pass & Play game loop for single-device offline group parties.',
        'Real-time P2P online multiplayer lobbies with customized rules, categories, and lobby chat.',
        'Dynamic visual aid cards, descriptive emojis, and custom player moderation tools (mute, kick, ban).',
        'Six gorgeous visual cyberpunk themes (Sakura Pink, Gothic Crimson, Sunset Gold, Matrix Green, etc.)'
      ]
    }
  ];

  const filteredLogs = logs.filter(log => activeFilter === 'all' || log.type === activeFilter);

  const getLogTypeMeta = (type: ChangelogItem['type']) => {
    switch (type) {
      case 'feature':
        return {
          label: 'New Feature',
          icon: <Sparkles className="w-3.5 h-3.5" />,
          color: 'text-brand-primary border-brand-primary/20 bg-brand-primary/10 shadow-brand-primary/5',
          bulletColor: 'text-brand-primary',
          glowDot: 'bg-brand-primary'
        };
      case 'fix':
        return {
          label: 'Bug Fix',
          icon: <Wrench className="w-3.5 h-3.5" />,
          color: 'text-amber-400 border-amber-500/20 bg-amber-500/10 shadow-amber-500/5',
          bulletColor: 'text-amber-400',
          glowDot: 'bg-amber-400'
        };
      case 'security':
        return {
          label: 'Security / Moderation',
          icon: <Lock className="w-3.5 h-3.5" />,
          color: 'text-rose-400 border-rose-500/20 bg-rose-500/10 shadow-rose-500/5',
          bulletColor: 'text-rose-400',
          glowDot: 'bg-rose-500'
        };
    }
  };

  const handleFilterClick = (filter: typeof activeFilter) => {
    playClick();
    setActiveFilter(filter);
  };

  return (
    <div className="w-full my-auto flex flex-col items-center px-4 sm:px-6 py-8 relative">
      <div className="ambient-glow-1 top-20 right-10 animate-float" />
      <div className="ambient-glow-2 bottom-20 left-10 animate-float-delayed" />

      <div className="w-full max-w-2xl flex flex-col gap-6 z-10">
        <div className="text-center">
          <h2 className="text-3xl font-black text-white tracking-wide">
            Update Changelogs
          </h2>
          <p className="text-sm text-slate-400 mt-1">Timeline of updates, features, and fixes implemented</p>
        </div>

        {/* Filter Navigation Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-white/[0.02] border border-white/5 shadow-inner">
          <button
            onClick={() => handleFilterClick('all')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-white/10 text-white border border-white/10 shadow'
                : 'text-slate-500 hover:text-slate-300 border border-transparent'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            All Updates
          </button>
          <button
            onClick={() => handleFilterClick('feature')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              activeFilter === 'feature'
                ? 'bg-brand-primary/25 text-brand-primary border border-brand-primary/30 shadow-md shadow-brand-primary/5'
                : 'text-slate-500 hover:text-slate-300 border border-transparent'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Features
          </button>
          <button
            onClick={() => handleFilterClick('fix')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              activeFilter === 'fix'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-md shadow-amber-500/5'
                : 'text-slate-500 hover:text-slate-300 border border-transparent'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            Fixes
          </button>
          <button
            onClick={() => handleFilterClick('security')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              activeFilter === 'security'
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-md shadow-rose-500/5'
                : 'text-slate-500 hover:text-slate-300 border border-transparent'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            Security
          </button>
        </div>

        {/* Timeline Log Container */}
        <div className="flex flex-col gap-6 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar relative pl-4 sm:pl-6">
          
          {/* Vertical Timeline Track */}
          <div className="absolute left-[7px] sm:left-[11px] top-4 bottom-4 w-0.5 bg-white/5 border-l border-white/5 border-dashed" />

          {filteredLogs.length === 0 ? (
            <div className="text-center py-12 bg-white/[0.01] border border-dashed border-white/5 rounded-3xl">
              <ShieldAlert className="w-10 h-10 text-slate-600 mx-auto mb-2.5 stroke-[1.5]" />
              <span className="text-sm font-bold text-slate-500 block">No matching logs found</span>
              <span className="text-xs text-slate-600 block mt-0.5">Try changing your filter above</span>
            </div>
          ) : (
            filteredLogs.map((log, idx) => {
              const meta = getLogTypeMeta(log.type);
              
              return (
                <div key={log.version} className="relative animate-fade-in-up" style={{ animationDelay: `${idx * 50}ms` }}>
                  
                  {/* Timeline Node Dot */}
                  <div className={`absolute -left-[14px] sm:-left-[20px] top-6 w-3 h-3 rounded-full border border-brand-dark flex items-center justify-center shadow-lg ${meta.glowDot} ring-4 ring-white/5`} />

                  <Card className="p-6 border-white/5 bg-brand-card/50 flex flex-col gap-4 hover:border-white/10 hover:bg-brand-card/65 transition-all duration-300 shadow-md">
                    
                    {/* Header Details */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-3.5 select-none">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black uppercase tracking-wider bg-white/5 border border-white/10 px-2.5 py-1 rounded-xl flex items-center gap-1.5 text-slate-300 shadow-sm">
                          <Tag className="w-3.5 h-3.5 text-slate-400" />
                          {log.version}
                        </span>
                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-xl border flex items-center gap-1 shadow-inner ${meta.color}`}>
                          {meta.icon}
                          {meta.label}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {log.date}
                      </span>
                    </div>

                    {/* Description */}
                    <div>
                      <h3 className="text-xl font-black text-white leading-tight tracking-wide">
                        {log.title}
                      </h3>
                      <p className="text-xs text-slate-300 mt-2 leading-relaxed font-semibold">
                        {log.description}
                      </p>
                    </div>

                    {/* Bullet Points Details */}
                    <ul className="flex flex-col gap-2 pt-1">
                      {log.details.map((detail, dIdx) => (
                        <li key={dIdx} className="text-xs text-slate-400 font-semibold leading-relaxed flex items-start gap-2.5">
                          <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${meta.bulletColor}`} />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>

                  </Card>
                </div>
              );
            })
          )}
        </div>

        <Button 
          variant="glass" 
          onClick={() => {
            playClick();
            setGameState('HOME');
          }} 
          className="w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 border-white/5 hover:border-white/10 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Home
        </Button>
      </div>
    </div>
  );
};
export {};
