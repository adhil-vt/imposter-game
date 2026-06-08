import React, { useState } from 'react';
import { Eye, ShieldAlert, Sparkles, HelpCircle, EyeOff } from 'lucide-react';

interface VisualAid {
  emojis: string;
  description: string;
}

interface RevealCardProps {
  word: string;
  isRevealed: boolean;
  onToggle: () => void;
  roleBadge?: string;
  hints?: string[];
  visualAid?: VisualAid;
  hintsEnabled?: boolean;
}

export const RevealCard: React.FC<RevealCardProps> = ({
  word,
  isRevealed,
  onToggle,
  roleBadge,
  hints,
  visualAid,
  hintsEnabled = true,
}) => {
  const [showHelp, setShowHelp] = useState<boolean>(false);

  const handleHelpToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card from flipping back
    setShowHelp(!showHelp);
  };

  return (
    <div 
      className="w-full max-w-[340px] sm:max-w-[360px] h-[540px] sm:h-[575px] perspective-1000 cursor-pointer select-none mx-auto"
      onClick={onToggle}
    >
      <div 
        className={`w-full h-full transition-transform duration-700 transform-style-3d relative ${
          isRevealed ? 'rotate-y-180' : ''
        }`}
      >
        {/* FRONT SIDE: Secret / Tap to Reveal */}
        <div className="absolute inset-0 w-full h-full backface-hidden glass-panel border border-brand-primary/20 hover:border-brand-primary/40 flex flex-col items-center justify-between p-6 sm:p-8 text-center bg-gradient-to-b from-brand-card to-brand-primary/5 shadow-2xl transition-all duration-300">
          <div className="w-full flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold tracking-widest text-brand-primary uppercase">Impostor Game</span>
            <ShieldAlert className="w-5 h-5 text-brand-primary animate-pulse" />
          </div>

          <div className="flex flex-col items-center gap-6 my-auto">
            <div className="w-20 h-20 rounded-full bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.2)] animate-pulse">
              <Eye className="w-10 h-10 text-brand-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-white mb-2">Tap to Reveal</h3>
              <p className="text-sm text-slate-400 max-w-[200px] mx-auto">
                Make sure no one is looking at your screen!
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            PASS & PLAY MODE
          </div>
        </div>

        {/* BACK SIDE: Word Revealed */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 glass-panel border border-brand-secondary/20 flex flex-col items-center justify-between p-6 sm:p-8 text-center bg-gradient-to-b from-brand-card to-brand-secondary/5 shadow-2xl overflow-y-auto">
          <div className="w-full flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold tracking-widest text-brand-secondary uppercase">Your Secret Word</span>
            <Sparkles className="w-5 h-5 text-brand-secondary animate-bounce" />
          </div>

          <div className="flex flex-col items-center gap-2.5 my-auto w-full">
            {roleBadge ? (
              <span className="px-3 py-0.5 rounded-full text-[10px] font-extrabold bg-brand-danger/20 text-brand-danger tracking-widest uppercase border border-brand-danger/30 animate-pulse flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-danger animate-ping" />
                ⚠️ {roleBadge}
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-secondary/15 text-brand-secondary tracking-widest uppercase border border-brand-secondary/20">
                Active Word
              </span>
            )}
            
            <div className="py-2.5 px-6 rounded-2xl bg-white/[0.02] border border-white/5 shadow-inner min-w-[180px]">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-brand-secondary animate-scale-in">
                {word}
              </h1>
            </div>
            
            <p className="text-[9px] text-brand-danger/90 font-bold max-w-[200px] mt-0.5">
              Memorize & tap card to hide!
            </p>

            {/* Collapsible hints & visual aid panel (only shown if hintsEnabled setting is active) */}
            {hintsEnabled && (hints || visualAid) && (
              <div className="w-full mt-2 pt-2 border-t border-white/5 flex flex-col items-center">
                <button
                  type="button"
                  onClick={handleHelpToggle}
                  className="text-[10px] font-black text-slate-500 hover:text-brand-primary uppercase tracking-widest flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {showHelp ? <EyeOff className="w-3.5 h-3.5 text-brand-primary" /> : <HelpCircle className="w-3.5 h-3.5" />}
                  {showHelp ? 'Hide Visual Aid' : 'Need Visual Aid?'}
                </button>
                
                {showHelp && (
                  <div className="w-full flex flex-col gap-2.5 mt-2.5 p-3 rounded-2xl bg-white/[0.02] border border-white/5 text-left animate-scale-in">
                    {/* Visual Emoji Representative */}
                    {visualAid?.emojis && (
                      <div className="flex items-center justify-center py-1 bg-white/5 border border-white/5 rounded-xl text-3xl animate-bounce">
                        {visualAid.emojis}
                      </div>
                    )}

                    {/* Visual Appearance Description text */}
                    {visualAid?.description && (
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] font-black text-brand-secondary uppercase tracking-wider">Appearance Visual</span>
                        <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                          {visualAid.description}
                        </p>
                      </div>
                    )}

                    {/* Context tags list */}
                    {hints && hints.length > 0 && (
                      <div className="flex flex-col gap-1 border-t border-white/5 pt-2">
                        <span className="text-[9px] font-black text-brand-primary uppercase tracking-wider">Keywords Context</span>
                        <div className="flex gap-1 flex-wrap">
                          {hints.map((hint, idx) => (
                            <span 
                              key={idx} 
                              className="px-1.5 py-0.5 rounded-lg text-[8px] font-bold bg-white/5 border border-white/10 text-slate-400 uppercase tracking-wide"
                            >
                              {hint}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="text-xs text-slate-500 font-medium mt-1">
            DO NOT SHARE WITH OTHERS
          </div>
        </div>
      </div>
    </div>
  );
};
export {};
