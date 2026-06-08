import React, { createContext, useContext, useState, useEffect } from 'react';
import { getRandomWordPair } from '../data/words';
import type { CategoryKey, WordPair, VisualAid, DifficultyKey } from '../data/words';
import { 
  playClick, 
  playFlip, 
  playWin, 
  playLose, 
  setSoundEffectsEnabled 
} from '../utils/sounds';

export interface Player {
  id: string;
  name: string;
  avatar: string;
  role: 'CREWMATE' | 'IMPOSTOR';
  word: string;
}

export type GameState = 'HOME' | 'RULES' | 'SETUP' | 'REVEAL' | 'CLUES' | 'VOTING' | 'RESULTS';

export interface GameStats {
  gamesPlayed: number;
  crewmateWins: number;
  impostorWins: number;
}

export interface GameHistoryItem {
  id: string;
  timestamp: number;
  category: string;
  playerCount: number;
  winner: 'CREWMATES' | 'IMPOSTOR';
  impostorName: string;
  impostorWord: string;
  commonWord: string;
}

interface GameContextType {
  gameState: GameState;
  setGameState: (state: GameState) => void;
  playerCount: number;
  setPlayerCount: (count: number) => void;
  selectedCategories: CategoryKey[];
  setSelectedCategories: (categories: CategoryKey[]) => void;
  difficulty: DifficultyKey;
  setDifficulty: (difficulty: DifficultyKey) => void;
  players: Player[];
  playerOrder: string[]; // Order of player IDs for reveal and clues
  impostorId: string;
  commonWord: string;
  impostorWord: string;
  chosenCategory: string;
  randomizeOrder: boolean;
  setRandomizeOrder: (random: boolean) => void;
  
  // Customization settings
  customNames: string[];
  setCustomNames: (names: string[]) => void;
  customAvatars: string[];
  setCustomAvatars: (avatars: string[]) => void;
  
  // Impostor Knows Role Toggle
  impostorKnowsRole: boolean;
  setImpostorKnowsRole: (val: boolean) => void;
  
  // Sound Settings
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  
  // Hints & Visual Aids Toggle Settings
  hintsEnabled: boolean;
  setHintsEnabled: (val: boolean) => void;
  
  // Reveal flow state
  currentRevealIndex: number;
  isWordRevealed: boolean;
  revealWord: () => void;
  hideWord: () => void;
  nextReveal: () => void;
  
  // Voting flow state
  currentVoterIndex: number;
  votes: Record<string, string>; // voterId -> votedId
  submitVote: (votedId: string) => void;
  
  // Results
  winner: 'CREWMATES' | 'IMPOSTOR' | null;
  voteStats: Record<string, number>; // playerId -> count
  
  // Custom Word Pairs
  customWordPairs: WordPair[];
  addCustomWordPair: (common: string, impostor: string) => boolean;
  deleteCustomWordPair: (index: number) => void;
  
  // Game control
  initiateSetup: () => void;
  startGame: () => void;
  restartGame: () => void;
  resetGame: () => void;
  
  // Persistent stats & History
  stats: GameStats;
  clearStats: () => void;
  history: GameHistoryItem[];
  clearHistory: () => void;
  
  // Dynamic Reveal Helpers
  activeWordPairHints: string[];
  activePlayerVisualAid: VisualAid | undefined;

  // Global Confirmation Modal System
  confirmConfig: {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
  } | null;
  showConfirm: (config: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
  }) => void;
  closeConfirm: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Emojis list to select from
export const AVATAR_POOL = ['🦊', '🐙', '🥑', '🚀', '👻', '🐨', '🦄', '🐼', '🦁', '🐸', '🍕', '🎮', '🎭', '💎', '🍿', '🦖'];

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>('HOME');
  const [playerCount, setPlayerCount] = useState<number>(4);
  const [selectedCategories, setSelectedCategories] = useState<CategoryKey[]>(() => {
    const saved = localStorage.getItem('impostor_selected_categories');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return [
      'Animals', 'Food', 'Objects & Things', 'School & Learning', 'Silly & Random',
      'Geography (Countries & Cities)', 'Movies & TV', 'Music & Entertainment',
      'Sports & Games', 'Technology & Gadgets', 'Nature & Outdoors', 'Colors & Shapes',
      'Emotions & Feelings', 'Jobs & Professions', 'Vehicles & Transportation',
      'Places (Landmarks & Locations)', 'Video Games & Internet Culture', 'Fantasy & Mythical Creatures'
    ];
  });
  const [difficulty, setDifficulty] = useState<DifficultyKey>(() => {
    const saved = localStorage.getItem('impostor_difficulty');
    return (saved as DifficultyKey) || 'medium';
  });
  const [randomizeOrder, setRandomizeOrder] = useState<boolean>(true);
  
  // Custom Toggles
  const [impostorKnowsRole, setImpostorKnowsRole] = useState<boolean>(() => {
    const saved = localStorage.getItem('impostor_knows_role');
    return saved !== null ? saved === 'true' : true;
  });
  
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('impostor_sound_enabled');
    const enabled = saved !== null ? saved === 'true' : true;
    setSoundEffectsEnabled(enabled);
    return enabled;
  });

  const [hintsEnabled, setHintsEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('impostor_hints_enabled');
    return saved !== null ? saved === 'true' : true;
  });

  // Sync toggles with LocalStorage
  useEffect(() => {
    setSoundEffectsEnabled(soundEnabled);
    localStorage.setItem('impostor_sound_enabled', String(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('impostor_knows_role', String(impostorKnowsRole));
  }, [impostorKnowsRole]);

  useEffect(() => {
    localStorage.setItem('impostor_hints_enabled', String(hintsEnabled));
  }, [hintsEnabled]);

  useEffect(() => {
    localStorage.setItem('impostor_difficulty', difficulty);
  }, [difficulty]);

  useEffect(() => {
    localStorage.setItem('impostor_selected_categories', JSON.stringify(selectedCategories));
  }, [selectedCategories]);

  // Setup inputs - read from localstorage for convenience
  const [customNames, setCustomNames] = useState<string[]>(() => {
    const saved = localStorage.getItem('impostor_saved_names');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return Array(16).fill('').map((_, i) => `Player ${i + 1}`);
  });

  const [customAvatars, setCustomAvatars] = useState<string[]>(() => {
    const saved = localStorage.getItem('impostor_saved_avatars');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return Array(16).fill(null).map((_, i) => AVATAR_POOL[i % AVATAR_POOL.length]);
  });

  // Custom Word Pairs
  const [customWordPairs, setCustomWordPairs] = useState<WordPair[]>(() => {
    const saved = localStorage.getItem('impostor_custom_word_pairs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('impostor_custom_word_pairs', JSON.stringify(customWordPairs));
  }, [customWordPairs]);

  // Active game session state
  const [players, setPlayers] = useState<Player[]>([]);
  const [playerOrder, setPlayerOrder] = useState<string[]>([]);
  const [impostorId, setImpostorId] = useState<string>('');
  const [commonWord, setCommonWord] = useState<string>('');
  const [impostorWord, setImpostorWord] = useState<string>('');
  const [chosenCategory, setChosenCategory] = useState<string>('');
  
  // Context visual states
  const [commonVisual, setCommonVisual] = useState<VisualAid | undefined>(undefined);
  const [impostorVisual, setImpostorVisual] = useState<VisualAid | undefined>(undefined);
  const [activeWordPairHints, setActiveWordPairHints] = useState<string[]>([]);
  
  // Reveal state
  const [currentRevealIndex, setCurrentRevealIndex] = useState<number>(0);
  const [isWordRevealed, setIsWordRevealed] = useState<boolean>(false);
  
  // Voting state
  const [currentVoterIndex, setCurrentVoterIndex] = useState<number>(0);
  const [votes, setVotes] = useState<Record<string, string>>({});
  
  // Persistent stats & history
  const [stats, setStats] = useState<GameStats>(() => {
    const saved = localStorage.getItem('impostor_game_stats');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return { gamesPlayed: 0, crewmateWins: 0, impostorWins: 0 };
  });

  const [history, setHistory] = useState<GameHistoryItem[]>(() => {
    const saved = localStorage.getItem('impostor_game_history');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  // Save stats when changed
  useEffect(() => {
    localStorage.setItem('impostor_game_stats', JSON.stringify(stats));
  }, [stats]);

  // Save history when changed
  useEffect(() => {
    localStorage.setItem('impostor_game_history', JSON.stringify(history));
  }, [history]);

  // Confirm Modal state
  const [confirmConfig, setConfirmConfig] = useState<GameContextType['confirmConfig']>(null);

  const showConfirm = (config: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
  }) => {
    setConfirmConfig({
      isOpen: true,
      title: config.title,
      message: config.message,
      confirmText: config.confirmText,
      cancelText: config.cancelText,
      onConfirm: () => {
        config.onConfirm();
        closeConfirm();
      },
    });
  };

  const closeConfirm = () => {
    setConfirmConfig(null);
  };

  // Save custom names & avatars when modified
  useEffect(() => {
    localStorage.setItem('impostor_saved_names', JSON.stringify(customNames));
  }, [customNames]);

  useEffect(() => {
    localStorage.setItem('impostor_saved_avatars', JSON.stringify(customAvatars));
  }, [customAvatars]);

  const addCustomWordPair = (common: string, impostor: string): boolean => {
    playClick();
    if (!common.trim() || !impostor.trim()) return false;
    
    // Auto-generate some simple hints based on the custom category tag
    const newPair: WordPair = {
      common: common.trim(),
      impostor: impostor.trim(),
      hints: ['Custom Word', 'User Created', 'Private Pool'],
      commonVisual: { emojis: '🎨📝🖌️', description: `User-created custom word: "${common.trim()}".` },
      impostorVisual: { emojis: '🎨📝🛡️', description: `User-created custom word: "${impostor.trim()}".` },
      difficulty: 'medium'
    };
    
    setCustomWordPairs(prev => [newPair, ...prev]);
    return true;
  };

  const deleteCustomWordPair = (index: number) => {
    playClick();
    setCustomWordPairs(prev => prev.filter((_, i) => i !== index));
  };

  const initiateSetup = () => {
    playClick();
    setGameState('SETUP');
  };

  const startGame = () => {
    playClick();
    // 1. Select word pair
    const { pair, chosenCategory: cat } = getRandomWordPair(selectedCategories, difficulty, customWordPairs);
    setCommonWord(pair.common);
    setImpostorWord(pair.impostor);
    setChosenCategory(cat);
    setActiveWordPairHints(pair.hints || ['Party Game', 'Deluxe Edition', 'Secret Role']);
    setCommonVisual(pair.commonVisual || { emojis: '❔', description: 'Appearance details unknown.' });
    setImpostorVisual(pair.impostorVisual || { emojis: '❔', description: 'Appearance details unknown.' });

    // 2. Prepare players
    const gamePlayers: Player[] = [];
    const ids: string[] = [];
    
    // Choose random impostor index
    const impostorIndex = Math.floor(Math.random() * playerCount);
    let chosenImpostorId = '';

    for (let i = 0; i < playerCount; i++) {
      const id = `player_${Date.now()}_${i}`;
      ids.push(id);
      
      const name = customNames[i]?.trim() || `Player ${i + 1}`;
      const avatar = customAvatars[i] || '🦊';
      const isImpostor = i === impostorIndex;
      
      if (isImpostor) {
        chosenImpostorId = id;
      }

      gamePlayers.push({
        id,
        name,
        avatar,
        role: isImpostor ? 'IMPOSTOR' : 'CREWMATE',
        word: isImpostor ? pair.impostor : pair.common,
      });
    }

    setPlayers(gamePlayers);
    setImpostorId(chosenImpostorId);

    // 3. Set reveal order (can be randomized or sequential)
    let order = [...ids];
    if (randomizeOrder) {
      order = order.sort(() => Math.random() - 0.5);
    }
    setPlayerOrder(order);

    // Reset loop indicators
    setCurrentRevealIndex(0);
    setIsWordRevealed(false);
    setCurrentVoterIndex(0);
    setVotes({});
    setGameState('REVEAL');
  };

  const revealWord = () => {
    playFlip();
    setIsWordRevealed(true);
  };
  
  const hideWord = () => {
    playFlip();
    setIsWordRevealed(false);
  };

  const nextReveal = () => {
    playClick();
    setIsWordRevealed(false);
    if (currentRevealIndex < playerOrder.length - 1) {
      setCurrentRevealIndex(prev => prev + 1);
    } else {
      setGameState('CLUES');
    }
  };

  const submitVote = (votedId: string) => {
    const voterId = playerOrder[currentVoterIndex];
    const newVotes = { ...votes, [voterId]: votedId };
    setVotes(newVotes);

    if (currentVoterIndex < playerOrder.length - 1) {
      setCurrentVoterIndex(prev => prev + 1);
    } else {
      tallyResults(newVotes);
    }
  };

  // Tally winner
  const [winner, setWinner] = useState<'CREWMATES' | 'IMPOSTOR' | null>(null);
  const [voteStats, setVoteStats] = useState<Record<string, number>>({});

  const tallyResults = (finalVotes: Record<string, string>) => {
    // Count votes for each player
    const counts: Record<string, number> = {};
    players.forEach(p => {
      counts[p.id] = 0;
    });

    Object.values(finalVotes).forEach(votedId => {
      if (counts[votedId] !== undefined) {
        counts[votedId]++;
      }
    });

    setVoteStats(counts);

    // Determine if crewmates win:
    // Impostor must receive strictly the most votes.
    const impostorVoteCount = counts[impostorId] || 0;
    
    let isImpostorMostVoted = true;
    for (const [playerId, count] of Object.entries(counts)) {
      if (playerId !== impostorId && count >= impostorVoteCount) {
        isImpostorMostVoted = false;
        break;
      }
    }

    const gameWinner = isImpostorMostVoted ? 'CREWMATES' : 'IMPOSTOR';
    setWinner(gameWinner);

    // Play synthesized Win/Loss theme
    if (gameWinner === 'CREWMATES') {
      playWin();
    } else {
      playLose();
    }

    // Update statistics
    setStats(prev => ({
      gamesPlayed: prev.gamesPlayed + 1,
      crewmateWins: prev.crewmateWins + (gameWinner === 'CREWMATES' ? 1 : 0),
      impostorWins: prev.impostorWins + (gameWinner === 'IMPOSTOR' ? 1 : 0),
    }));

    // Update match history logs
    const activeImpostor = players.find(p => p.role === 'IMPOSTOR');
    const newHistoryItem: GameHistoryItem = {
      id: `hist_${Date.now()}`,
      timestamp: Date.now(),
      category: chosenCategory,
      playerCount,
      winner: gameWinner,
      impostorName: activeImpostor?.name || 'Impostor',
      impostorWord,
      commonWord,
    };
    setHistory(prev => [newHistoryItem, ...prev].slice(0, 10)); // cap history to latest 10 items

    setGameState('RESULTS');
  };

  const restartGame = () => {
    playClick();
    startGame();
  };

  const resetGame = () => {
    playClick();
    setPlayers([]);
    setPlayerOrder([]);
    setImpostorId('');
    setCommonWord('');
    setImpostorWord('');
    setChosenCategory('');
    setCommonVisual(undefined);
    setImpostorVisual(undefined);
    setActiveWordPairHints([]);
    setCurrentRevealIndex(0);
    setIsWordRevealed(false);
    setCurrentVoterIndex(0);
    setVotes({});
    setWinner(null);
    setVoteStats({});
    setGameState('HOME');
  };

  const clearStats = () => {
    playClick();
    setStats({ gamesPlayed: 0, crewmateWins: 0, impostorWins: 0 });
  };

  const clearHistory = () => {
    playClick();
    setHistory([]);
  };

  // Compute active visual aid dynamically
  const activePlayer = players.find(p => p.id === playerOrder[currentRevealIndex]);
  const activePlayerVisualAid = activePlayer?.role === 'IMPOSTOR' ? impostorVisual : commonVisual;

  return (
    <GameContext.Provider
      value={{
        gameState,
        setGameState,
        playerCount,
        setPlayerCount,
        selectedCategories,
        setSelectedCategories,
        difficulty,
        setDifficulty,
        players,
        playerOrder,
        impostorId,
        commonWord,
        impostorWord,
        chosenCategory,
        randomizeOrder,
        setRandomizeOrder,
        customNames,
        setCustomNames,
        customAvatars,
        setCustomAvatars,
        impostorKnowsRole,
        setImpostorKnowsRole,
        soundEnabled,
        setSoundEnabled,
        hintsEnabled,
        setHintsEnabled,
        currentRevealIndex,
        isWordRevealed,
        revealWord,
        hideWord,
        nextReveal,
        currentVoterIndex,
        votes,
        submitVote,
        winner,
        voteStats,
        customWordPairs,
        addCustomWordPair,
        deleteCustomWordPair,
        initiateSetup,
        startGame,
        restartGame,
        resetGame,
        stats,
        clearStats,
        history,
        clearHistory,
        activeWordPairHints,
        activePlayerVisualAid,
        confirmConfig,
        showConfirm,
        closeConfirm,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
export {};
