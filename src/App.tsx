import { GameProvider, useGame } from './context/GameContext';
import { Header } from './components/Header';
import { CustomCursor } from './components/CustomCursor';
import { ConfirmModal } from './components/ConfirmModal';
import { ChatDrawer } from './components/ChatDrawer';
import { HomePage } from './pages/HomePage';
import { CreateGamePage } from './pages/CreateGamePage';
import { RevealPage } from './pages/RevealPage';
import { CluePage } from './pages/CluePage';
import { VotingPage } from './pages/VotingPage';
import { ResultsPage } from './pages/ResultsPage';
import { RulesPage } from './pages/RulesPage';
import { AboutPage } from './pages/AboutPage';

function GameContent() {
  const { gameState } = useGame();

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
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-dark/10">
      {/* Dynamic Header */}
      <Header />
      
      {/* Primary Page Wrapper */}
      <main className="flex-1 w-full max-w-4xl mx-auto flex flex-col justify-center">
        {renderPage()}
      </main>

      {/* Global Custom Cursor */}
      <CustomCursor />

      {/* Global Custom Confirmation Modal */}
      <ConfirmModal />

      {/* Global Multiplayer Chat Panel */}
      <ChatDrawer />
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
