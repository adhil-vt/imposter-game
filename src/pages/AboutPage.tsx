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
    <div className="w-full my-auto flex flex-col items-center px-6 py-10 relative">
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
          <div className="flex items-center gap-2.5 pt-4 border-t border-white/5">
            {/* GitHub */}
            <a 
              href="https://github.com/adhil-vt" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 py-3 px-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] text-slate-300 hover:text-white flex items-center justify-center gap-2 transition-all duration-300 group cursor-pointer"
            >
              <svg 
                role="img" 
                viewBox="0 0 24 24" 
                className="w-4 h-4 fill-slate-400 group-hover:fill-white transition-colors duration-300"
              >
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
              <span className="text-[11px] font-bold tracking-wide">GitHub</span>
            </a>

            {/* LinkedIn */}
            <a 
              href="https://www.linkedin.com/in/adhil-v-t-81588b337/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 py-3 px-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 hover:shadow-[0_0_15px_rgba(10,102,194,0.2)] text-slate-300 hover:text-white flex items-center justify-center gap-2 transition-all duration-300 group cursor-pointer"
            >
              <svg 
                role="img" 
                viewBox="0 0 24 24" 
                className="w-4 h-4 fill-slate-400 group-hover:fill-[#0A66C2] transition-colors duration-300"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z"/>
              </svg>
              <span className="text-[11px] font-bold tracking-wide">LinkedIn</span>
            </a>

            {/* Email */}
            <a 
              href="mailto:adhilvt369@gmail.com" 
              className="py-3 px-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 hover:text-white flex items-center justify-center transition-all duration-300 group cursor-pointer"
              title="Send Email"
            >
              <Mail className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors duration-300" />
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
