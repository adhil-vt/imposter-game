import { GameProvider, useGame } from './context/GameContext';
import { Header } from './components/Header';
import { CustomCursor } from './components/CustomCursor';
import { ConfirmModal } from './components/ConfirmModal';
import { VoteModerationModal } from './components/VoteModerationModal';
import { ChatDrawer } from './components/ChatDrawer';
import { HomePage } from './pages/HomePage';
import { CreateGamePage } from './pages/CreateGamePage';
import { RevealPage } from './pages/RevealPage';
import { CluePage } from './pages/CluePage';
import { VotingPage } from './pages/VotingPage';
import { ResultsPage } from './pages/ResultsPage';
import { RulesPage } from './pages/RulesPage';
import { AboutPage } from './pages/AboutPage';
import { ChangelogPage } from './pages/ChangelogPage';

function GameContent() {
  const { gameState, roomNotice } = useGame();

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

      {/* Global Custom Cursor */}
      <CustomCursor />

      {/* Global Custom Confirmation Modal */}
      <ConfirmModal />

      {/* Global Vote Moderation Modal */}
      <VoteModerationModal />

      {/* Global Multiplayer Chat Panel */}
      {gameState !== 'REVEAL' && <ChatDrawer />}
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
