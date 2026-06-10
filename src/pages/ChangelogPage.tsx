import React from 'react';
import { useGame } from '../context/GameContext';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ChevronLeft, Calendar, Tag } from 'lucide-react';

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

  const logs: ChangelogItem[] = [
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
      description: 'First public release of WhoIsFake with multiplayer and Pass & Play modes.',
      details: [
        'Local Pass & Play game loop for single-device offline group parties.',
        'Real-time P2P online multiplayer lobbies with customized rules, categories, and lobby chat.',
        'Dynamic visual aid cards, descriptive emojis, and custom player moderation tools (mute, kick, ban).',
        'Six gorgeous visual cyberpunk themes (Sakura Pink, Gothic Crimson, Sunset Gold, Matrix Green, etc.)'
      ]
    }
  ];

  return (
    <div className="w-full my-auto flex flex-col items-center px-6 py-8 relative">
      <div className="ambient-glow-1 top-20 right-10 animate-float" />
      <div className="ambient-glow-2 bottom-20 left-10 animate-float-delayed" />

      <div className="w-full max-w-md flex flex-col gap-6 z-10">
        <div className="text-center">
          <h2 className="text-3xl font-black text-white tracking-wide">
            Update Changelogs
          </h2>
          <p className="text-sm text-slate-400 mt-1">Timeline of updates, features, and fixes implemented</p>
        </div>

        <div className="flex flex-col gap-4 max-h-[55vh] overflow-y-auto pr-1 custom-scrollbar">
          {logs.map((log) => {
            const badgeColor = 
              log.type === 'security' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
              log.type === 'fix' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
              'bg-brand-primary/10 border-brand-primary/20 text-brand-primary';

            return (
              <Card key={log.version} className="p-5 border-white/5 bg-brand-card/50 flex flex-col gap-3">
                <div className="flex justify-between items-center select-none">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-white/5 border border-white/10 px-2 py-0.5 rounded-md flex items-center gap-1 text-slate-300">
                    <Tag className="w-3 h-3" />
                    {log.version}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {log.date}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-black text-white leading-tight">
                    {log.title}
                  </h3>
                  <span className={`inline-block text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border mt-1.5 ${badgeColor}`}>
                    {log.type}
                  </span>
                  <p className="text-xs text-slate-300 mt-2 font-medium">
                    {log.description}
                  </p>
                </div>

                <ul className="border-t border-white/5 pt-2 flex flex-col gap-1.5 list-disc pl-4">
                  {log.details.map((detail, idx) => (
                    <li key={idx} className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                      {detail}
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </div>

        <Button 
          variant="glass" 
          onClick={() => setGameState('HOME')} 
          className="w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Home
        </Button>
      </div>
    </div>
  );
};
