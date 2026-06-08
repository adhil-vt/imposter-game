import React from 'react';
import { useGame } from '../context/GameContext';
import { Home, HelpCircle, Volume2, VolumeX } from 'lucide-react';

interface HeaderProps {
  showHelp?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ showHelp = true }) => {
  const { gameState, setGameState, resetGame, soundEnabled, setSoundEnabled, showConfirm } = useGame();

  const handleHomeClick = () => {
    if (gameState !== 'HOME' && gameState !== 'RULES') {
      showConfirm({
        title: 'End Current Game?',
        message: 'Are you sure you want to end the current game? All active match progress will be lost.',
        confirmText: 'End Game',
        cancelText: 'Keep Playing',
        onConfirm: () => {
          resetGame();
        }
      });
    } else {
      resetGame();
    }
  };

  return (
    <header className="w-full flex items-center justify-between py-4 px-6 md:px-8 border-b border-brand-border backdrop-blur-md sticky top-0 z-40 bg-brand-dark/40">
      <div 
        className="flex items-center gap-2.5 cursor-pointer group"
        onClick={handleHomeClick}
      >
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.3)] group-hover:scale-105 transition-transform duration-300">
          <span className="text-white font-extrabold text-lg tracking-wider">W</span>
        </div>
        <h1 className="text-xl font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300">
          WHOISFAKE
        </h1>
      </div>

      <div className="flex items-center gap-2.5">
        {/* Sound FX Toggle */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
          title={soundEnabled ? "Mute Sound FX" : "Unmute Sound FX"}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-brand-primary" /> : <VolumeX className="w-4 h-4 text-brand-danger" />}
        </button>

        {gameState !== 'HOME' && (
          <button
            onClick={handleHomeClick}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            title="Return to Home"
          >
            <Home className="w-4 h-4" />
          </button>
        )}

        {showHelp && gameState !== 'RULES' && (
          <button
            onClick={() => setGameState('RULES')}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            title="How to Play"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
};
