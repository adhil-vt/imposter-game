import React from 'react';
import { useGame } from '../context/GameContext';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { playClick } from '../utils/sounds';
import { 
  User, 
  BookOpen, 
  Calendar, 
  Mail, 
  Github, 
  ChevronLeft, 
  Code2, 
  Sparkles,
  Terminal,
  Heart
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { setGameState } = useGame();

  const handleBackClick = () => {
    playClick();
    setGameState('HOME');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6 py-10 relative overflow-hidden">
      {/* Floating Decorative Glow Backgrounds */}
      <div className="ambient-glow-1 top-10 left-10 animate-float" />
      <div className="ambient-glow-2 bottom-10 right-10 animate-float-delayed" />

      {/* Main Container */}
      <div className="w-full max-w-md flex flex-col gap-6 z-10">
        
        {/* Animated Header */}
        <div className="text-center flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-brand-secondary via-pink-500 to-brand-primary flex items-center justify-center shadow-[0_0_40px_rgba(236,72,153,0.4)] animate-float">
            <User className="w-11 h-11 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-wider text-white">
              ABOUT DEVELOPER
            </h2>
            <p className="text-sm text-slate-400 mt-1 font-medium tracking-wide">
              The creative mind behind WhoIsFake
            </p>
          </div>
        </div>

        {/* Profile Card */}
        <Card className="border-brand-secondary/10 p-6 flex flex-col gap-6 bg-brand-card/45">
          {/* Avatar and Name */}
          <div className="flex items-center gap-4 border-b border-white/5 pb-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center text-white text-2xl font-black shadow-[0_0_20px_rgba(99,102,241,0.2)]">
              AV
            </div>
            <div className="flex flex-col">
              <h3 className="text-xl font-bold text-white tracking-wide">
                Adhil VT
              </h3>
              <span className="text-xs text-brand-secondary font-semibold uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
                <Sparkles className="w-3.5 h-3.5" />
                Full Stack Developer
              </span>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col gap-1.5">
              <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase flex items-center gap-1">
                <Calendar className="w-3 h-3 text-brand-primary" /> Age
              </span>
              <span className="text-lg font-black text-white">20 Years Old</span>
            </div>
            
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col gap-1.5">
              <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase flex items-center gap-1">
                <BookOpen className="w-3 h-3 text-brand-accent" /> Education
              </span>
              <span className="text-sm font-black text-white truncate" title="B.Tech CSE">B.Tech CSE</span>
            </div>
          </div>

          {/* Detailed Info */}
          <div className="flex flex-col gap-4 text-sm text-slate-300 font-medium">
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-white/5 text-slate-400 mt-0.5">
                <Terminal className="w-4 h-4 text-brand-primary" />
              </div>
              <p className="leading-relaxed">
                An aspiring Full Stack Developer learning and crafting modern web experiences. Focused on clean layouts, elegant styling, and highly interactive user interfaces.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-white/5 text-slate-400 mt-0.5">
                <Code2 className="w-4 h-4 text-brand-secondary" />
              </div>
              <p className="leading-relaxed">
                Studying Computer Science & Engineering, bringing creative logic and technical design together to build premium software.
              </p>
            </div>
          </div>

          {/* Socials / Links */}
          <div className="flex items-center gap-3 pt-4 border-t border-white/5">
            <a 
              href="https://github.com/adhil-vt" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 py-3 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white flex items-center justify-center gap-2 transition-all duration-300 group"
            >
              <Github className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
              <span className="text-xs font-bold">GitHub Profile</span>
            </a>

            <a 
              href="mailto:adhilvt@example.com" 
              className="py-3 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-all duration-300 group"
              title="Send Email"
            >
              <Mail className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
            </a>
          </div>
        </Card>

        {/* Back Button */}
        <Button 
          variant="glass" 
          onClick={handleBackClick} 
          className="py-4 rounded-2xl group shadow-inner"
        >
          <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-0.5 transition-transform" />
          Back to Game
        </Button>

        {/* Footer Accent */}
        <div className="text-center text-[10px] text-slate-600 font-bold uppercase tracking-wider flex items-center justify-center gap-1 mt-4">
          <span>Made with</span>
          <Heart className="w-3 h-3 text-red-500 animate-pulse" />
          <span>by Adhil VT</span>
        </div>
      </div>
    </div>
  );
};
