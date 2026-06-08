import React, { useState } from 'react';
import { useGame, THEMES } from '../context/GameContext';
import { Home, HelpCircle, Volume2, VolumeX, User, Palette, Sun, Moon, Check } from 'lucide-react';
import { playClick } from '../utils/sounds';

interface HeaderProps {
  showHelp?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ showHelp = true }) => {
  const { 
    gameState, 
    setGameState, 
    resetGame, 
    soundEnabled, 
    setSoundEnabled, 
    showConfirm,
    currentThemeId,
    setCurrentThemeId
  } = useGame();

  const [showThemePanel, setShowThemePanel] = useState(false);

  const activeTheme = THEMES.find(t => t.id === currentThemeId) || THEMES[0];

  const handleModeToggle = (mode: 'light' | 'dark') => {
    playClick();
    if (mode === 'light') {
      setCurrentThemeId('light-pearl');
    } else {
      setCurrentThemeId('cyber');
    }
  };

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

  const handleAboutClick = () => {
    if (gameState !== 'HOME' && gameState !== 'RULES' && gameState !== 'ABOUT') {
      showConfirm({
        title: 'End Current Game?',
        message: 'Are you sure you want to view the about page? All active match progress will be lost.',
        confirmText: 'Go to About',
        cancelText: 'Keep Playing',
        onConfirm: () => {
          setGameState('ABOUT');
        }
      });
    } else {
      setGameState('ABOUT');
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

        {/* Theme Customizer Toggle */}
        <button
          onClick={() => {
            playClick();
            setShowThemePanel(!showThemePanel);
          }}
          className={`p-2.5 rounded-xl bg-white/5 border text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-300 relative ${
            showThemePanel ? 'border-brand-primary bg-white/10 text-white shadow-[0_0_10px_rgba(99,102,241,0.25)]' : 'border-white/10'
          }`}
          title="Themes & Styles"
        >
          <Palette className="w-4 h-4" />
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

        {gameState !== 'ABOUT' && (
          <button
            onClick={handleAboutClick}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            title="About Developer"
          >
            <User className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Floating Theme Customizer Panel */}
      {showThemePanel && (
        <div className="absolute right-6 top-20 z-50 w-72 p-5 rounded-3xl glass-panel border border-brand-primary/25 bg-brand-dark/95 shadow-2xl animate-scale-in">
          <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
            <span>Appearance & Themes</span>
            <button 
              onClick={() => {
                playClick();
                setShowThemePanel(false);
              }}
              className="text-slate-400 hover:text-brand-danger transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>

          {/* Mode Switcher */}
          <div className="flex flex-col gap-2 mb-5">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
              Mode
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleModeToggle('dark')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                  activeTheme.mode === 'dark'
                    ? 'bg-brand-primary border-brand-primary text-white shadow-md shadow-brand-primary/10'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                Dark
              </button>
              <button
                onClick={() => handleModeToggle('light')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                  activeTheme.mode === 'light'
                    ? 'bg-brand-primary border-brand-primary text-white shadow-md shadow-brand-primary/10'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                Light
              </button>
            </div>
          </div>

          {/* Palette List */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
              Color Palette
            </span>
            <div className="grid grid-cols-2 gap-2">
              {THEMES.map((t) => {
                const isSelected = t.id === currentThemeId;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      playClick();
                      setCurrentThemeId(t.id);
                    }}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white/10 border-brand-primary text-white scale-[1.01]'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-slate-200'
                    }`}
                  >
                    {/* Circle Color Dot */}
                    <div className="flex w-6 h-6 rounded-full overflow-hidden border border-white/10 relative">
                      <div className="w-1/2 h-full" style={{ backgroundColor: t.colors.primary }} />
                      <div className="w-1/2 h-full" style={{ backgroundColor: t.colors.secondary }} />
                      {isSelected && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[0.5px]">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <span className="text-[11px] font-extrabold truncate w-full">
                      {t.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
