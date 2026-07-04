import { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { Header } from './components/Header';
import { CustomCursor } from './components/CustomCursor';
import { ConfirmModal } from './components/ConfirmModal';
import { VoteModerationModal } from './components/VoteModerationModal';
import { ChatDrawer } from './components/ChatDrawer';
import { PlayerModerationModal } from './components/PlayerModerationModal';
import { HomePage } from './pages/HomePage';
import { CreateGamePage } from './pages/CreateGamePage';
import { RevealPage } from './pages/RevealPage';
import { CluePage } from './pages/CluePage';
import { VotingPage } from './pages/VotingPage';
import { ResultsPage } from './pages/ResultsPage';
import { RulesPage } from './pages/RulesPage';
import { AboutPage } from './pages/AboutPage';
import { ChangelogPage } from './pages/ChangelogPage';

import { Button } from './components/Button';
import { playClick } from './utils/sounds';
import { Mic, Flag } from 'lucide-react';

function GameContent() {
  const [showSurrenderPanel, setShowSurrenderPanel] = useState(false);
  const {
    gameState,
    roomNotice,
    voteNotification,
    selectedModerationPlayer,
    setSelectedModerationPlayer,
    isVoiceActive,
    playersSpeaking,
    playersVolume,
    onlinePlayers,
    myPlayerId,
    isMultiplayer,
    surrenderVotes,
    voteToSurrender,
  } = useGame();

  const renderPage = () => {
    switch (gameState) {
      case 'HOME':
        return <HomePage />;
      case 'RULES':
        return <RulesPage />;
      case 'ABOUT':
        return <AboutPage />;
      case 'SETUP':
        return <CreateGamePage />;
      case 'REVEAL':
        return <RevealPage />;
      case 'CLUES':
        return <CluePage />;
      case 'VOTING':
        return <VotingPage />;
      case 'RESULTS':
        return <ResultsPage />;
      case 'CHANGELOG':
        return <ChangelogPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-dark/10">
      {/* Dynamic Header */}
      <Header />
      
      {/* Primary Page Wrapper */}
      <main className="flex-1 w-full max-w-4xl mx-auto flex flex-col">
        {renderPage()}
      </main>

      {roomNotice && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-lg animate-fade-in-up">
          <div className="glass-panel border-white/10 bg-brand-dark/95 shadow-2xl px-4 py-3 text-center">
            <div className="flex items-center justify-center gap-2 text-sm font-bold text-slate-100">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-warning animate-pulse" />
              {roomNotice.text}
            </div>
          </div>
        </div>
      )}

      {/* Non-blocking Vote Notification Toast */}
      {voteNotification && (
        <div className={`fixed ${roomNotice ? 'top-36' : 'top-20'} left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-lg animate-fade-in-up`}>
          <div className="glass-panel border-brand-secondary/20 bg-brand-dark/95 shadow-2xl px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-bold text-slate-200 flex-1 leading-snug">
                {voteNotification.message}
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => {
                    playClick();
                    voteNotification.onAccept();
                  }}
                  className="px-3 py-1.5 rounded-lg text-[11px] font-extrabold bg-brand-primary/90 text-white hover:bg-brand-primary transition-colors cursor-pointer active:scale-95"
                >
                  Yes
                </button>
                <button
                  onClick={() => {
                    playClick();
                    voteNotification.onDismiss();
                  }}
                  className="px-3 py-1.5 rounded-lg text-[11px] font-extrabold bg-white/10 text-slate-400 hover:bg-white/15 hover:text-white transition-colors cursor-pointer active:scale-95"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Custom Cursor */}
      <CustomCursor />

      {/* Global Custom Confirmation Modal */}
      <ConfirmModal />

      {/* Global Vote Moderation Modal */}
      <VoteModerationModal />

      {/* Global Multiplayer Chat Panel */}
      {gameState !== 'REVEAL' && <ChatDrawer />}

      {/* Global Surrender Vote Control - Collapsible */}
      {isMultiplayer && ['REVEAL', 'CLUES', 'VOTING'].includes(gameState) && (
        <div className="fixed bottom-6 right-6 z-40">
          {/* Small Toggle Button */}
          <button
            onClick={() => {
              playClick();
              setShowSurrenderPanel(!showSurrenderPanel);
            }}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-orange-500/80 to-red-500/80 border border-orange-400/50 shadow-lg hover:shadow-xl hover:from-orange-500 hover:to-red-500 transition-all duration-300 active:scale-95 cursor-pointer relative"
            title="Surrender Vote"
          >
            <Flag className="w-5 h-5 text-white" />
            {surrenderVotes.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-danger rounded-full flex items-center justify-center text-[10px] font-black text-white">
                {surrenderVotes.length}
              </span>
            )}
          </button>

          {/* Expanded Panel - Hidden by Default */}
          {showSurrenderPanel && (
            <div className="absolute bottom-16 right-0 w-80 glass-panel border-white/10 bg-brand-dark/95 shadow-2xl p-5 backdrop-blur-xl rounded-2xl animate-scale-in">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white">Vote to Surrender</h3>
                  <p className="text-xs text-slate-400">Agree with your team to end the round and return to the lobby.</p>
                </div>
                <button
                  onClick={() => {
                    playClick();
                    setShowSurrenderPanel(false);
                  }}
                  className="text-slate-400 hover:text-white transition-colors shrink-0"
                  title="Close"
                >
                  ✕
                </button>
              </div>
              <div className="flex items-center justify-between gap-2 mb-4 p-3 rounded-lg bg-white/5 border border-white/10">
                <span className="text-xs font-bold text-slate-300">
                  {onlinePlayers.length >= 3
                    ? `${surrenderVotes.length} / ${Math.floor(onlinePlayers.length / 2) + 1} votes`
                    : 'Need 3+ players'}
                </span>
                {onlinePlayers.length >= 3 && (
                  <div className="flex gap-1">
                    {Array.from({ length: Math.floor(onlinePlayers.length / 2) + 1 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i < surrenderVotes.length ? 'bg-brand-primary' : 'bg-white/10'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
              <Button
                variant={surrenderVotes.includes(myPlayerId) ? 'secondary' : 'primary'}
                onClick={() => {
                  playClick();
                  voteToSurrender();
                }}
                disabled={onlinePlayers.length < 3}
                className="w-full py-3 rounded-xl text-sm"
              >
                {surrenderVotes.includes(myPlayerId) ? '✓ Voted' : 'Vote Now'}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Active Speakers Overlay */}
      {isMultiplayer && isVoiceActive && ['REVEAL', 'CLUES', 'VOTING', 'RESULTS'].includes(gameState) && (
        <div className="fixed top-24 left-4 z-40 flex flex-col gap-2 pointer-events-none select-none">
          {onlinePlayers.filter(p => playersSpeaking[p.id] && p.id !== myPlayerId).length > 0 ? (
            onlinePlayers
              .filter(p => playersSpeaking[p.id] && p.id !== myPlayerId)
              .map(p => {
                const vol = playersVolume[p.id] || 0;
                const dotSize = Math.max(6, Math.min(18, 6 + vol * 30));
                const pulseSize = Math.max(16, Math.min(44, 16 + vol * 120));
                const intensity = Math.min(1, 0.15 + vol * 1.5);
                return (
                <div
                  key={p.id}
                  className="flex items-center gap-2 px-3 py-2 rounded-2xl border border-emerald-500/20 bg-brand-dark/80 backdrop-blur-md shadow-[0_0_15px_rgba(52,211,153,0.15)] animate-fade-in-right"
                >
                  <div className="relative flex items-center justify-center" style={{ width: pulseSize, height: pulseSize }}>
                    <span style={{ width: dotSize, height: dotSize, borderRadius: '9999px', background: `rgba(52,211,153,${0.9})`, boxShadow: `0 0 ${8 + vol * 20}px rgba(52,211,153,${intensity})` }} />
                    <span className="absolute rounded-full bg-emerald-400/35" style={{ width: pulseSize, height: pulseSize, opacity: Math.min(0.9, vol * 1.6), transform: 'translate(-50%, -50%)', left: '50%', top: '50%' }} />
                  </div>
                  <span className="text-[15px]">{p.avatar}</span>
                  <span className="text-xs font-black text-slate-100 tracking-wide pr-1">
                    {p.name}
                  </span>
                  <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-black uppercase tracking-wider scale-90 animate-pulse">
                    Speaking
                  </span>
                </div>
              )})
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-white/5 bg-brand-dark/60 backdrop-blur-sm shadow-md text-slate-400">
              <Mic className="w-3.5 h-3.5 text-brand-secondary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Voice Connected</span>
            </div>
          )}
        </div>
      )}

      {/* Global Moderation Overlay popup */}
      {selectedModerationPlayer && (
        <PlayerModerationModal
          playerId={selectedModerationPlayer.id}
          playerName={selectedModerationPlayer.name}
          playerAvatar={selectedModerationPlayer.avatar}
          playerIsAdmin={selectedModerationPlayer.isAdmin || selectedModerationPlayer.isHost || false}
          onClose={() => setSelectedModerationPlayer(null)}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}

export default App;
export {};
