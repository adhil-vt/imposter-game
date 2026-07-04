/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { getRandomWordPair, wordDatabase } from '../data/words';
import type { CategoryKey, WordPair, VisualAid, DifficultyKey } from '../data/words';
import { generateAiWordPair } from '../utils/gemini';
import {
  playClick,
  playFlip,
  playWin,
  playLose,
  playTick,
  playBuzzer,
  playNotification,
  setSoundEffectsEnabled
} from '../utils/sounds';
import { multiplayer, type NetworkPlayer, type NetworkMessage } from '../utils/multiplayer';
import { containsProfanity, cleanText } from '../utils/profanityFilter';

export interface Player {
  id: string;
  name: string;
  avatar: string;
  role: 'CREWMATE' | 'IMPOSTOR';
  word: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: number;
  isSystem?: boolean;
  chatScope?: 'lobby' | 'game';
}

function isBuiltInCommonWord(common: string, customPool: WordPair[]): boolean {
  const normalized = common.trim().toLowerCase();
  if (!normalized) return false;

  const isInBuiltIn = Object.values(wordDatabase).some(categoryList =>
    categoryList.some(pair => pair.common.trim().toLowerCase() === normalized)
  );

  if (isInBuiltIn) return true;

  return customPool.some(pair => pair.common.trim().toLowerCase() === normalized);
}

async function getAiWordPairOrNull(
  categories: CategoryKey[],
  difficulty: DifficultyKey,
  customPool: WordPair[],
  apiKey: string
): Promise<WordPair | null> {
  if (!apiKey) return null;

  const requestCategories: CategoryKey[] = categories.length > 0 ? categories : ['Mixed'];
  const attempts = 2;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const generated = await generateAiWordPair({ categories: requestCategories, difficulty }, apiKey);
      if (generated && !isBuiltInCommonWord(generated.common, customPool)) {
        return generated;
      }
    } catch (error) {
      console.error('AI word generation failed:', error);
      return null;
    }
  }

  return null;
}

export type GameState = 'HOME' | 'RULES' | 'ABOUT' | 'SETUP' | 'REVEAL' | 'CLUES' | 'VOTING' | 'RESULTS' | 'CHANGELOG';

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

export interface Palette {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
  };
  darkBg: string;
  lightBg: string;
}

export const PALETTES: Palette[] = [
  {
    id: 'cyber',
    name: 'Cyberpunk',
    colors: { primary: '#6366F1', secondary: '#D946EF' },
    darkBg: '#080A16',
    lightBg: '#FAF9FF'
  },
  {
    id: 'matrix',
    name: 'Matrix Green',
    colors: { primary: '#10B981', secondary: '#3B82F6' },
    darkBg: '#050906',
    lightBg: '#F6FBF8'
  },
  {
    id: 'crimson',
    name: 'Gothic Crimson',
    colors: { primary: '#EF4444', secondary: '#F97316' },
    darkBg: '#0C0404',
    lightBg: '#FFF8F8'
  },
  {
    id: 'sakura',
    name: 'Sakura Pink',
    colors: { primary: '#E11D48', secondary: '#EC4899' },
    darkBg: '#0F050C',
    lightBg: '#FFF5FA'
  },
  {
    id: 'ocean',
    name: 'Ocean Breeze',
    colors: { primary: '#2563EB', secondary: '#0D9488' },
    darkBg: '#040914',
    lightBg: '#F5F9FF'
  },
  {
    id: 'sunset',
    name: 'Sunset Gold',
    colors: { primary: '#F59E0B', secondary: '#EC4899' },
    darkBg: '#0A0704',
    lightBg: '#FFFDF5'
  }
];

const hexToRgb = (hex: string): string => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '99, 102, 241';
};

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

  clueTimerLimit: number;
  setClueTimerLimit: (limit: number) => void;

  // AI word generation
  useAiWordGeneration: boolean;
  setUseAiWordGeneration: (enabled: boolean) => void;
  aiGenerationError: string;
  setAiGenerationError: (error: string) => void;

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
  startGame: () => Promise<void>;
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
  themeMode: 'light' | 'dark';
  setThemeMode: (mode: 'light' | 'dark') => void;
  themePaletteId: string;
  setThemePaletteId: (id: string) => void;

  // Multiplayer online state variables
  isMultiplayer: boolean;
  isHost: boolean;
  roomCode: string;
  myPlayerId: string;
  multiplayerStatus: 'idle' | 'connecting' | 'connected' | 'disconnected' | 'error';
  onlinePlayers: NetworkPlayer[];
  playersWhoRevealed: string[];
  readyPlayers: string[];
  isSpectating: boolean;
  activeGameState: GameState | null;
  gameStartedAt: number;
  setPlayerReady: (ready: boolean) => void;
  activeClueIndex: number;
  setActiveClueIndex: (idx: number) => void;
  timerSeconds: number;
  setTimerSeconds: (s: number) => void;
  timerActive: boolean;
  setTimerActive: (a: boolean) => void;
  hostRoom: () => Promise<string>;
  joinRoom: (code: string, name: string, avatar: string) => Promise<void>;
  leaveRoom: () => void;
  chatMessages: ChatMessage[];
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  unreadChatCount: number;
  setUnreadChatCount: (count: number) => void;
  sendChatMessage: (text: string) => void;
  kickPlayer: (playerId: string, reason?: string) => void;
  isLobbyAdmin: boolean;
  lobbyAdminId: string;
  toggleMutePlayer: (playerId: string) => void;
  mutedPlayerIds: string[];
  banPlayer: (playerId: string, reason?: string) => void;
  transferHost: (playerId: string) => void;
  updatePlayerName: (newName: string) => void;
  playerPings: Record<string, number>;
  kickVotes: Record<string, string[]>;
  banVotes: Record<string, string[]>;
  surrenderVotes: string[];
  voteToKickPlayer: (targetId: string) => void;
  voteToBanPlayer: (targetId: string) => void;
  voteToSurrender: () => void;
  selectedModerationPlayer: NetworkPlayer | null;
  setSelectedModerationPlayer: (player: NetworkPlayer | null) => void;
  roomNotice: {
    id: string;
    text: string;
  } | null;

  // Vote moderation
  activeVote: {
    voteId: string;
    action: 'kick' | 'ban';
    targetId: string;
    targetName: string;
    initiatorId: string;
    initiatorName: string;
    reason?: string;
    votes: Record<string, 'yes' | 'no'>;
  } | null;
  startVoteKick: (playerId: string, reason?: string) => void;
  startVoteBan: (playerId: string, reason?: string) => void;
  castModerationVote: (vote: 'yes' | 'no') => void;

  // Vote notification toast
  voteNotification: {
    id: string;
    message: string;
    onAccept: () => void;
    onDismiss: () => void;
  } | null;

  // Voice chat
  isVoiceActive: boolean;
  toggleVoice: () => void;
  micVolume: number;
  setMicVolume: (v: number) => void;
  speakerVolume: number;
  setSpeakerVolume: (v: number) => void;
  playersSpeaking: Record<string, boolean>;
  playersVolume: Record<string, number>;
  micMuted: boolean;
  toggleMicMute: () => void;
  deafenAll: boolean;
  toggleDeafenAll: () => void;
  deafenedPlayerIds: string[];
  toggleDeafenPlayer: (playerId: string) => void;

  // Gemini API key
  geminiApiKey: string;
  setGeminiApiKey: (key: string) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Emojis list to select from
export const AVATAR_POOL = ['🦊', '🐙', '🥑', '🚀', '👻', '🐨', '🦄', '🐼', '🦁', '🐸', '🍕', '🎮', '🎭', '💎', '🍿', '🦖'];

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('whoisfake_theme_mode');
    return (saved as 'light' | 'dark') || 'dark';
  });

  const [themePaletteId, setThemePaletteId] = useState<string>(() => {
    const saved = localStorage.getItem('whoisfake_theme_palette');
    return saved || 'cyber';
  });

  useEffect(() => {
    const palette = PALETTES.find(p => p.id === themePaletteId) || PALETTES[0];
    localStorage.setItem('whoisfake_theme_mode', themeMode);
    localStorage.setItem('whoisfake_theme_palette', themePaletteId);

    // Apply CSS variables dynamically
    const root = document.documentElement;
    root.setAttribute('data-mode', themeMode);

    const isLight = themeMode === 'light';
    const darkBgColor = isLight ? palette.lightBg : palette.darkBg;
    const cardColor = isLight ? 'rgba(255, 255, 255, 0.75)' : 'rgba(17, 24, 48, 0.55)';
    const borderColor = isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)';

    const primaryRgb = hexToRgb(palette.colors.primary);
    const secondaryRgb = hexToRgb(palette.colors.secondary);

    const glowOpacity = isLight ? '0.08' : '0.15';
    const glow1 = `rgba(${primaryRgb}, ${glowOpacity})`;
    const glow2 = `rgba(${secondaryRgb}, ${glowOpacity})`;

    root.style.setProperty('--color-brand-dark', darkBgColor);
    root.style.setProperty('--color-brand-card', cardColor);
    root.style.setProperty('--color-brand-border', borderColor);
    root.style.setProperty('--color-brand-primary', palette.colors.primary);
    root.style.setProperty('--color-brand-secondary', palette.colors.secondary);
    root.style.setProperty('--glow-color-1', glow1);
    root.style.setProperty('--glow-color-2', glow2);
  }, [themeMode, themePaletteId]);

  const [gameState, setGameState] = useState<GameState>('HOME');
  const [playerCount, setPlayerCount] = useState<number>(4);
  const [selectedCategories, setSelectedCategories] = useState<CategoryKey[]>(() => {
    const saved = localStorage.getItem('impostor_selected_categories');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        void 0;
      }
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

  const [clueTimerLimit, setClueTimerLimit] = useState<number>(() => {
    const saved = localStorage.getItem('impostor_clue_timer_limit');
    return saved ? parseInt(saved, 10) : 30;
  });

  // Gemini API Key for AI word generation (stored in localStorage)
  const [geminiApiKey, setGeminiApiKey] = useState<string>(() => {
    const saved = localStorage.getItem('whoisfake_gemini_api_key');
    return saved || '';
  });

  const [useAiWordGeneration, setUseAiWordGeneration] = useState<boolean>(() => {
    const saved = localStorage.getItem('whoisfake_use_ai_word_generation');
    return saved !== null ? saved === 'true' : false;
  });

  const [aiGenerationError, setAiGenerationError] = useState<string>('');

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
    localStorage.setItem('impostor_clue_timer_limit', String(clueTimerLimit));
  }, [clueTimerLimit]);

  useEffect(() => {
    localStorage.setItem('whoisfake_gemini_api_key', geminiApiKey);
  }, [geminiApiKey]);

  useEffect(() => {
    localStorage.setItem('whoisfake_use_ai_word_generation', String(useAiWordGeneration));
  }, [useAiWordGeneration]);

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
      try { return JSON.parse(saved); } catch { void 0; }
    }
    return Array(16).fill('').map((_, i) => `Player ${i + 1}`);
  });

  const [customAvatars, setCustomAvatars] = useState<string[]>(() => {
    const saved = localStorage.getItem('impostor_saved_avatars');
    if (saved) {
      try { return JSON.parse(saved); } catch { void 0; }
    }
    return Array(16).fill(null).map((_, i) => AVATAR_POOL[i % AVATAR_POOL.length]);
  });

  // Custom Word Pairs
  const [customWordPairs, setCustomWordPairs] = useState<WordPair[]>(() => {
    const saved = localStorage.getItem('impostor_custom_word_pairs');
    if (saved) {
      try { return JSON.parse(saved); } catch { void 0; }
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
      try { return JSON.parse(saved); } catch { void 0; }
    }
    return { gamesPlayed: 0, crewmateWins: 0, impostorWins: 0 };
  });

  const [history, setHistory] = useState<GameHistoryItem[]>(() => {
    const saved = localStorage.getItem('impostor_game_history');
    if (saved) {
      try { return JSON.parse(saved); } catch { void 0; }
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

  // Multiplayer online state variables
  const [isMultiplayer, setIsMultiplayer] = useState<boolean>(false);
  const [isHost, setIsHost] = useState<boolean>(false);
  const [roomCode, setRoomCode] = useState<string>('');
  const [myPlayerId, setMyPlayerId] = useState<string>('');
  const [multiplayerStatus, setMultiplayerStatus] = useState<GameContextType['multiplayerStatus']>('idle');
  const [onlinePlayers, setOnlinePlayers] = useState<NetworkPlayer[]>([]);
  const [playerPings, setPlayerPings] = useState<Record<string, number>>({});
  const [kickVotes, setKickVotes] = useState<Record<string, string[]>>({});
  const [banVotes, setBanVotes] = useState<Record<string, string[]>>({});
  const [surrenderVotes, setSurrenderVotes] = useState<string[]>([]);
  const [selectedModerationPlayer, setSelectedModerationPlayer] = useState<NetworkPlayer | null>(null);
  const [playersWhoRevealed, setPlayersWhoRevealed] = useState<string[]>([]);
  const [isSpectating, setIsSpectating] = useState<boolean>(false);
  const [activeGameState, setActiveGameState] = useState<GameState | null>(null);
  const [gameStartedAt, setGameStartedAt] = useState<number>(0);

  useEffect(() => {
    multiplayer.registerPingCallback((pings) => {
      setPlayerPings({ ...pings });
    });
    return () => {
      multiplayer.registerPingCallback(null);
      cleanupVoice();
    };
  }, []);
  const [readyPlayers, setReadyPlayers] = useState<string[]>([]);
  const [activeClueIndex, setActiveClueIndex] = useState<number>(0);
  const [timerSeconds, setTimerSeconds] = useState<number>(clueTimerLimit);
  const [timerActive, setTimerActive] = useState<boolean>(false);

  const [lobbyAdminId, setLobbyAdminId] = useState<string>('');
  const isLobbyAdmin = isMultiplayer ? (onlinePlayers.find(p => p.id === myPlayerId)?.isAdmin || false) : true;
  const [mutedPlayerIds, setMutedPlayerIds] = useState<string[]>([]);
  const [micMuted, setMicMuted] = useState<boolean>(false);
  const [deafenAll, setDeafenAll] = useState<boolean>(false);
  const [deafenedPlayerIds, setDeafenedPlayerIds] = useState<string[]>([]); // local per-player deafen

  const toggleMicMute = () => {
    playClick();
    setMicMuted(prev => {
      const next = !prev;
      if (gainNodeRef.current) {
        gainNodeRef.current.gain.value = next ? 0 : micVolume;
      }
      return next;
    });
  };

  const toggleDeafenAll = () => {
    playClick();
    setDeafenAll(prev => {
      const next = !prev;
      Object.values(audioElementsRef.current).forEach(a => {
        try { a.muted = next; } catch (e) { }
      });
      return next;
    });
  };

  const toggleDeafenPlayer = (playerId: string) => {
    playClick();
    setDeafenedPlayerIds(prev => {
      const next = prev.includes(playerId) ? prev.filter(id => id !== playerId) : [...prev, playerId];
      const audio = audioElementsRef.current[playerId];
      if (audio) {
        try { audio.muted = next.includes(playerId); } catch (e) { }
      }
      return next;
    });
  };

  const toggleMutePlayer = (playerId: string) => {
    playClick();
    if (isLobbyAdmin) {
      setOnlinePlayers(prev => {
        const next = prev.map(p => p.id === playerId ? { ...p, isMuted: !p.isMuted } : p);
        multiplayer.send({
          type: 'LOBBY_UPDATE',
          players: next
        });
        return next;
      });
      setMutedPlayerIds(prev =>
        prev.includes(playerId) ? prev.filter(id => id !== playerId) : [...prev, playerId]
      );
    } else {
      setMutedPlayerIds(prev =>
        prev.includes(playerId) ? prev.filter(id => id !== playerId) : [...prev, playerId]
      );
    }
  };

  // Vote moderation state
  const [activeVote, setActiveVote] = useState<GameContextType['activeVote']>(null);
  const activeVoteRef = useRef<GameContextType['activeVote']>(null);
  useEffect(() => { activeVoteRef.current = activeVote; }, [activeVote]);

  const kickVotesRef = useRef<Record<string, string[]>>({});
  const banVotesRef = useRef<Record<string, string[]>>({});
  const surrenderVotesRef = useRef<string[]>([]);
  useEffect(() => { kickVotesRef.current = kickVotes; }, [kickVotes]);
  useEffect(() => { banVotesRef.current = banVotes; }, [banVotes]);
  useEffect(() => { surrenderVotesRef.current = surrenderVotes; }, [surrenderVotes]);

  // Sync lobby settings across multiplayer network if we are the admin
  useEffect(() => {
    if (isMultiplayer && isLobbyAdmin) {
      multiplayer.send({
        type: 'SETTINGS_UPDATE',
        difficulty,
        selectedCategories,
        impostorKnowsRole,
        randomizeOrder,
        hintsEnabled,
        clueTimerLimit
      });
    }
  }, [difficulty, selectedCategories, impostorKnowsRole, randomizeOrder, hintsEnabled, clueTimerLimit, isMultiplayer, isLobbyAdmin]);

  // Keep activeGameState synced for host/local play
  useEffect(() => {
    if (!isMultiplayer || isHost) {
      if (gameState === 'SETUP' || gameState === 'HOME') {
        setActiveGameState(null);
      } else {
        setActiveGameState(gameState);
      }
    }
  }, [gameState, isMultiplayer, isHost]);

  // Chat states
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [unreadChatCount, setUnreadChatCount] = useState<number>(0);

  // Voice states
  const [isVoiceActive, setIsVoiceActive] = useState<boolean>(false);
  const [micVolume, setMicVolume] = useState<number>(() => {
    const saved = localStorage.getItem('imposter_mic_volume');
    return saved !== null ? parseFloat(saved) : 0.8;
  });
  const [speakerVolume, setSpeakerVolume] = useState<number>(() => {
    const saved = localStorage.getItem('imposter_speaker_volume');
    return saved !== null ? parseFloat(saved) : 0.8;
  });
  const [playersSpeaking, setPlayersSpeaking] = useState<Record<string, boolean>>({});
  const [playersVolume, setPlayersVolume] = useState<Record<string, number>>({});

  // Audio Context and Stream Refs
  const localStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const localDestinationStreamRef = useRef<MediaStream | null>(null);
  const activeCallsRef = useRef<Record<string, any>>({});
  const audioElementsRef = useRef<Record<string, HTMLAudioElement>>({});
  const voiceSpeakingDetectorsRef = useRef<Record<string, { interval: any; analyser: AnalyserNode }>>({});

  // Persist volume settings
  useEffect(() => {
    localStorage.setItem('imposter_mic_volume', String(micVolume));
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = micVolume;
    }
  }, [micVolume]);

  useEffect(() => {
    localStorage.setItem('imposter_speaker_volume', String(speakerVolume));
    Object.values(audioElementsRef.current).forEach(audio => {
      audio.volume = speakerVolume;
    });
  }, [speakerVolume]);

  const appendChatMessage = (msg: ChatMessage): ChatMessage => {
    const scope = msg.chatScope || ((gameStateRef.current === 'SETUP' || isSpectatingRef.current) ? 'lobby' : 'game');
    const msgWithScope = {
      ...msg,
      chatScope: scope
    };

    setChatMessages(prev => {
      if (prev.some(m => m.id === msgWithScope.id)) return prev;

      const isMessageVisible = (() => {
        if (isSpectatingRef.current) {
          return !msgWithScope.chatScope || msgWithScope.chatScope === 'lobby';
        } else {
          return msgWithScope.chatScope === 'game' || msgWithScope.timestamp < gameStartedAtRef.current;
        }
      })();

      if (isMessageVisible && msgWithScope.senderId !== myPlayerIdRef.current) {
        if (!isChatOpenRef.current) {
          setUnreadChatCount(c => c + 1);
        }
        playNotification();
      }

      return [...prev, msgWithScope];
    });

    return msgWithScope;
  };

  const [roomNotice, setRoomNotice] = useState<GameContextType['roomNotice']>(null);
  const roomNoticeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pushRoomNotice = (text: string) => {
    if (roomNoticeTimerRef.current) {
      clearTimeout(roomNoticeTimerRef.current);
    }

    const notice = {
      id: `notice_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      text,
    };

    setRoomNotice(notice);
    roomNoticeTimerRef.current = setTimeout(() => {
      setRoomNotice(null);
    }, 4000);
  };

  // Non-blocking vote notification toast
  const [voteNotification, setVoteNotification] = useState<GameContextType['voteNotification']>(null);
  const voteNotificationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);



  const handleVoteKickRequest = (targetId: string, voterId: string) => {
    setKickVotes(prev => {
      const current = prev[targetId] || [];
      const isRetracting = current.includes(voterId);
      const nextVotes = isRetracting ? current.filter(id => id !== voterId) : [...current, voterId];
      const next = { ...prev, [targetId]: nextVotes };
      multiplayer.send({ type: 'VOTE_KICK_BAN_SYNC', kickVotes: next, banVotes: banVotesRef.current });
      return next;
    });
  };

  const handleVoteBanRequest = (targetId: string, voterId: string) => {
    setBanVotes(prev => {
      const current = prev[targetId] || [];
      const isRetracting = current.includes(voterId);
      const nextVotes = isRetracting ? current.filter(id => id !== voterId) : [...current, voterId];
      const next = { ...prev, [targetId]: nextVotes };
      multiplayer.send({ type: 'VOTE_KICK_BAN_SYNC', kickVotes: kickVotesRef.current, banVotes: next });
      return next;
    });
  };

  const handleVoteSurrenderRequest = (voterId: string) => {
    setSurrenderVotes(prev => {
      const isRetracting = prev.includes(voterId);
      const nextVotes = isRetracting ? prev.filter(id => id !== voterId) : [...prev, voterId];
      multiplayer.send({ type: 'VOTE_SURRENDER_SYNC', surrenderVotes: nextVotes });
      return nextVotes;
    });
  };

  const voteToKickPlayer = (targetId: string) => {
    playClick();
    if (!isMultiplayer) return;
    if (isHost) {
      handleVoteKickRequest(targetId, myPlayerId);
    } else {
      multiplayer.send({ type: 'VOTE_KICK_REQUEST', targetId, voterId: myPlayerId });
    }
  };

  const voteToBanPlayer = (targetId: string) => {
    playClick();
    if (!isMultiplayer) return;
    if (isHost) {
      handleVoteBanRequest(targetId, myPlayerId);
    } else {
      multiplayer.send({ type: 'VOTE_BAN_REQUEST', targetId, voterId: myPlayerId });
    }
  };

  const voteToSurrender = () => {
    playClick();
    if (!isMultiplayer) return;
    if (isHost) {
      handleVoteSurrenderRequest(myPlayerId);
    } else {
      multiplayer.send({ type: 'VOTE_SURRENDER_REQUEST', voterId: myPlayerId });
    }
  };

  useEffect(() => {
    if (isChatOpen) {
      setUnreadChatCount(0);
    }
  }, [isChatOpen]);

  useEffect(() => {
    return () => {
      if (roomNoticeTimerRef.current) {
        clearTimeout(roomNoticeTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isMultiplayer || gameState !== 'REVEAL' || players.length === 0) return;

    if (playersWhoRevealed.length === players.length) {
      setGameState('CLUES');
      setTimerSeconds(clueTimerLimit);
      setTimerActive(false);
      setActiveClueIndex(0);

      if (isHost) {
        multiplayer.send({
          type: 'TIMER_SYNC',
          activeClueIndex: 0,
          timerSeconds: clueTimerLimit,
          timerActive: false
        });
      }
    }
  }, [gameState, isMultiplayer, isHost, players.length, playersWhoRevealed.length]);

  useEffect(() => {
    if (!isMultiplayer || !isHost || gameState !== 'VOTING' || players.length === 0) return;

    if (Object.keys(votes).length === players.length) {
      tallyMultiplayerResults(votes);
    }
  }, [gameState, isHost, isMultiplayer, players.length, votes]);

  const sendChatMessage = (text: string) => {
    if (!text.trim()) return;
    const cleanedText = cleanText(text.trim());
    const senderName = isHost
      ? (customNames[0] || 'Host')
      : (onlinePlayers.find(p => p.id === myPlayerId)?.name || 'Guest');
    const senderAvatar = isHost
      ? (customAvatars[0] || '🦊')
      : (onlinePlayers.find(p => p.id === myPlayerId)?.avatar || '🦊');

    const msg: ChatMessage = {
      id: `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      senderId: myPlayerId,
      senderName,
      senderAvatar,
      text: cleanedText,
      timestamp: Date.now()
    };

    const msgWithScope = appendChatMessage(msg);

    if (isMultiplayer) {
      multiplayer.send({
        type: 'CHAT',
        message: msgWithScope
      });
    }
  };

  const kickPlayer = (playerId: string, reason?: string) => {
    if (isMultiplayer) {
      if (isHost) {
        const kickedPlayer = onlinePlayers.find(p => p.id === playerId);
        if (kickedPlayer) {
          kickedPlayersRef.current.add(playerId);
          multiplayer.kickPlayer(playerId, reason);
          
          const reasonText = reason ? ` Reason: ${reason}` : '';
          const systemMsg: ChatMessage = {
            id: `sys_${Date.now()}_${Math.random()}`,
            senderId: 'system',
            senderName: 'System',
            senderAvatar: '🤖',
            text: `${kickedPlayer.name} was kicked from the room.${reasonText}`,
            timestamp: Date.now(),
            isSystem: true
          };
          const msgWithScope = appendChatMessage(systemMsg);

          multiplayer.send({
            type: 'CHAT',
            message: msgWithScope
          });

          // Sync active game player list if game is in progress
          setPlayers(prev => {
            const next = prev.filter(p => p.id !== playerId);
            if (next.length !== prev.length) {
              setPlayerOrder(ord => {
                const nextOrd = ord.filter(id => id !== playerId);
                multiplayer.send({
                  type: 'GAME_PLAYERS_UPDATE',
                  players: next,
                  playerOrder: nextOrd
                });
                return nextOrd;
              });
            }
            return next;
          });
        }
      } else {
        multiplayer.send({
          type: 'KICK_REQUEST',
          targetId: playerId,
          reason
        });
      }
    }
  };

  const banPlayer = (playerId: string, reason?: string) => {
    if (isMultiplayer) {
      if (isHost) {
        const bannedPlayer = onlinePlayers.find(p => p.id === playerId);
        if (bannedPlayer) {
          kickedPlayersRef.current.add(playerId);
          multiplayer.banPlayer(playerId, reason);
          
          const reasonText = reason ? ` Reason: ${reason}` : '';
          const systemMsg: ChatMessage = {
            id: `sys_${Date.now()}_${Math.random()}`,
            senderId: 'system',
            senderName: 'System',
            senderAvatar: '🚫',
            text: `${bannedPlayer.name} was banned from the room.${reasonText}`,
            timestamp: Date.now(),
            isSystem: true
          };
          const msgWithScope = appendChatMessage(systemMsg);

          multiplayer.send({
            type: 'CHAT',
            message: msgWithScope
          });

          // Sync active game player list if game is in progress
          setPlayers(prev => {
            const next = prev.filter(p => p.id !== playerId);
            if (next.length !== prev.length) {
              setPlayerOrder(ord => {
                const nextOrd = ord.filter(id => id !== playerId);
                multiplayer.send({
                  type: 'GAME_PLAYERS_UPDATE',
                  players: next,
                  playerOrder: nextOrd
                });
                return nextOrd;
              });
            }
            return next;
          });
        }
      } else {
        multiplayer.send({
          type: 'BAN_REQUEST',
          targetId: playerId,
          reason
        });
      }
    }
  };

  const startVoteKick = (playerId: string, reason?: string) => {
    if (!isMultiplayer) return;
    const target = onlinePlayers.find(p => p.id === playerId);
    const me = onlinePlayers.find(p => p.id === myPlayerId);
    if (!target || !me) return;
    const voteId = `vote_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const voteMsg: NetworkMessage = {
      type: 'VOTE_MOD_START',
      voteId,
      action: 'kick',
      targetId: playerId,
      targetName: target.name,
      initiatorId: myPlayerId,
      initiatorName: me.name,
      reason
    };
    if (isHost) {
      multiplayer.send(voteMsg);
    } else {
      multiplayer.send(voteMsg);
    }
    setActiveVote({
      voteId,
      action: 'kick',
      targetId: playerId,
      targetName: target.name,
      initiatorId: myPlayerId,
      initiatorName: me.name,
      reason,
      votes: { [myPlayerId]: 'yes' }
    });
  };

  const startVoteBan = (playerId: string, reason?: string) => {
    if (!isMultiplayer) return;
    const target = onlinePlayers.find(p => p.id === playerId);
    const me = onlinePlayers.find(p => p.id === myPlayerId);
    if (!target || !me) return;
    const voteId = `vote_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const voteMsg: NetworkMessage = {
      type: 'VOTE_MOD_START',
      voteId,
      action: 'ban',
      targetId: playerId,
      targetName: target.name,
      initiatorId: myPlayerId,
      initiatorName: me.name,
      reason
    };
    if (isHost) {
      multiplayer.send(voteMsg);
    } else {
      multiplayer.send(voteMsg);
    }
    setActiveVote({
      voteId,
      action: 'ban',
      targetId: playerId,
      targetName: target.name,
      initiatorId: myPlayerId,
      initiatorName: me.name,
      reason,
      votes: { [myPlayerId]: 'yes' }
    });
  };

  const castModerationVote = (vote: 'yes' | 'no') => {
    if (!isMultiplayer || !activeVote) return;
    const voteMsg: NetworkMessage = {
      type: 'VOTE_MOD_CAST',
      voteId: activeVote.voteId,
      voterId: myPlayerId,
      vote
    };
    if (isHost) {
      multiplayer.send(voteMsg);
      handleModerationVoteCast(myPlayerId, activeVote.voteId, vote);
    } else {
      multiplayer.send(voteMsg);
      setActiveVote(prev => prev ? { ...prev, votes: { ...prev.votes, [myPlayerId]: vote } } : null);
    }
  };

  const handleModerationVoteCast = (voterId: string, voteId: string, vote: 'yes' | 'no') => {
    const currentVote = activeVoteRef.current;
    if (!currentVote || currentVote.voteId !== voteId) return;

    const updatedVotes = { ...currentVote.votes, [voterId]: vote };
    const eligibleVoters = onlinePlayersRef.current.filter(p => p.id !== currentVote.targetId);
    const totalEligible = eligibleVoters.length;
    const totalCast = Object.keys(updatedVotes).length;
    const yesCount = Object.values(updatedVotes).filter(v => v === 'yes').length;

    setActiveVote(prev => prev ? { ...prev, votes: updatedVotes } : null);

    if (totalCast >= totalEligible) {
      const passed = yesCount > totalEligible / 2;
      const resultMsg: NetworkMessage = {
        type: 'VOTE_MOD_RESULT',
        voteId,
        action: currentVote.action,
        targetId: currentVote.targetId,
        targetName: currentVote.targetName,
        passed,
        reason: currentVote.reason
      };
      multiplayer.send(resultMsg);

      if (passed) {
        if (currentVote.action === 'ban') {
          banPlayer(currentVote.targetId, currentVote.reason);
        } else {
          kickPlayer(currentVote.targetId, currentVote.reason);
        }
      }

      const actionWord = currentVote.action === 'ban' ? 'ban' : 'kick';
      const systemMsg: ChatMessage = {
        id: `sys_${Date.now()}_${Math.random()}`,
        senderId: 'system',
        senderName: 'System',
        senderAvatar: passed ? '⚖️' : '🗳️',
        text: passed
          ? `Vote to ${actionWord} ${currentVote.targetName} passed (${yesCount}/${totalEligible}).`
          : `Vote to ${actionWord} ${currentVote.targetName} failed (${yesCount}/${totalEligible}).`,
        timestamp: Date.now(),
        isSystem: true
      };
      setChatMessages(prev => [...prev, systemMsg]);
      multiplayer.send({ type: 'CHAT', message: systemMsg });

      setTimeout(() => setActiveVote(null), 2000);
    }
  };

  const transferHost = (playerId: string) => {
    if (isMultiplayer) {
      if (isHost) {
        setLobbyAdminId(playerId);
        setOnlinePlayers(prev => {
          const next = prev.map(p => ({
            ...p,
            isAdmin: p.id === playerId
          }));
          multiplayer.send({
            type: 'LOBBY_UPDATE',
            players: next
          });
          return next;
        });

        const newAdminName = onlinePlayers.find(p => p.id === playerId)?.name || 'Someone';
        const systemMsg: ChatMessage = {
          id: `sys_${Date.now()}_${Math.random()}`,
          senderId: 'system',
          senderName: 'System',
          senderAvatar: 'system-crown',
          text: `${newAdminName} is now the Lobby Host.`,
          timestamp: Date.now(),
          isSystem: true
        };
        const msgWithScope = appendChatMessage(systemMsg);
        multiplayer.send({
          type: 'CHAT',
          message: msgWithScope
        });

        multiplayer.send({
          type: 'TRANSFER_HOST',
          newAdminId: playerId
        });
      } else {
        multiplayer.send({
          type: 'TRANSFER_HOST',
          newAdminId: playerId
        });
      }
    }
  };

  const updatePlayerName = (newName: string) => {
    if (!newName.trim()) return;
    const trimmed = newName.trim();
    if (containsProfanity(trimmed)) {
      pushRoomNotice('Name contains vulgar or inappropriate language!');
      return;
    }
    if (isMultiplayer) {
      if (isHost) {
        const oldPlayer = onlinePlayersRef.current.find(p => p.id === myPlayerIdRef.current);
        const oldName = oldPlayer?.name || 'Host';

        if (oldName === trimmed) return;

        setOnlinePlayers(prev => {
          const next = prev.map(p => p.id === myPlayerIdRef.current ? { ...p, name: trimmed } : p);
          multiplayer.send({
            type: 'LOBBY_UPDATE',
            players: next
          });
          return next;
        });

        setCustomNames(prev => {
          const next = [...prev];
          next[0] = trimmed;
          return next;
        });

        const systemMsg: ChatMessage = {
          id: `sys_${Date.now()}_${Math.random()}`,
          senderId: 'system',
          senderName: 'System',
          senderAvatar: 'system-edit',
          text: `${oldName} changed their name to ${trimmed}.`,
          timestamp: Date.now(),
          isSystem: true
        };
        const msgWithScope = appendChatMessage(systemMsg);
        multiplayer.send({
          type: 'CHAT',
          message: msgWithScope
        });
      } else {
        const oldPlayer = onlinePlayersRef.current.find(p => p.id === myPlayerIdRef.current);
        const oldName = oldPlayer?.name || '';
        if (oldName === trimmed) return;

        multiplayer.send({
          type: 'RENAME_PLAYER',
          playerId: myPlayerId,
          name: trimmed
        });
      }
    } else {
      setCustomNames(prev => {
        const next = [...prev];
        next[0] = trimmed;
        return next;
      });
    }
  };

  const isChatOpenRef = useRef(isChatOpen);
  const myPlayerIdRef = useRef(myPlayerId);
  const onlinePlayersRef = useRef(onlinePlayers);
  const chatMessagesRef = useRef(chatMessages);
  const kickedPlayersRef = useRef<Set<string>>(new Set());
  const receivedHostLeftRef = useRef(false);
  // Set whenever THIS client deliberately leaves/closes the room. Used to
  // suppress the "Disconnected" modal on the player's own intentional leave
  // (the modal should only appear when the connection is genuinely lost or the
  // host ends the room). Reset on every fresh host/join.
  const intentionalLeaveRef = useRef(false);
  const isSpectatingRef = useRef(isSpectating);
  const gameStateRef = useRef(gameState);
  const gameStartedAtRef = useRef(gameStartedAt);

  useEffect(() => { isChatOpenRef.current = isChatOpen; }, [isChatOpen]);
  useEffect(() => { myPlayerIdRef.current = myPlayerId; }, [myPlayerId]);
  useEffect(() => { onlinePlayersRef.current = onlinePlayers; }, [onlinePlayers]);
  useEffect(() => { chatMessagesRef.current = chatMessages; }, [chatMessages]);
  useEffect(() => { isSpectatingRef.current = isSpectating; }, [isSpectating]);
  useEffect(() => { gameStateRef.current = gameState; }, [gameState]);
  useEffect(() => { gameStartedAtRef.current = gameStartedAt; }, [gameStartedAt]);

  // Play tick sound whenever timerSeconds ticks down in active state
  useEffect(() => {
    if (timerActive && timerSeconds > 0 && timerSeconds < clueTimerLimit) {
      playTick();
    }
  }, [timerSeconds, timerActive, clueTimerLimit]);

  // Broadcast state change to guests when gameState changes
  useEffect(() => {
    if (isMultiplayer && (isHost || isLobbyAdmin)) {
      multiplayer.send({
        type: 'STATE_CHANGE',
        state: gameState
      });
    }
  }, [gameState, isMultiplayer, isHost, isLobbyAdmin]);


  // Clue Phase Timer countdown logic
  useEffect(() => {
    let timerRef: any = null;
    if (timerActive && timerSeconds > 0 && (!isMultiplayer || isHost)) {
      timerRef = setTimeout(() => {
        setTimerSeconds(prev => {
          const next = prev - 1;
          if (isMultiplayer && isHost) {
            multiplayer.send({
              type: 'TIMER_SYNC',
              activeClueIndex,
              timerSeconds: next,
              timerActive: true
            });
          }
          return next;
        });
      }, 1000);
    } else if (timerSeconds === 0 && timerActive && (!isMultiplayer || isHost)) {
      playBuzzer();

      const nextIdx = activeClueIndex + 1;
      if (nextIdx < playerOrder.length) {
        // Automatically move to the next speaker and restart the countdown
        setActiveClueIndex(nextIdx);
        setTimerSeconds(clueTimerLimit);

        if (isMultiplayer && isHost) {
          multiplayer.send({
            type: 'TIMER_SYNC',
            activeClueIndex: nextIdx,
            timerSeconds: clueTimerLimit,
            timerActive: true
          });
        }
      } else {
        // Last speaker time is up, transition immediately to Voting
        setTimerActive(false);
        setGameState('VOTING');

        if (isMultiplayer && isHost) {
          multiplayer.send({
            type: 'TIMER_SYNC',
            activeClueIndex,
            timerSeconds: 0,
            timerActive: false
          });
        }
      }
    }

    return () => {
      if (timerRef) clearTimeout(timerRef);
    };
  }, [timerActive, timerSeconds, isMultiplayer, isHost, activeClueIndex, playerOrder, clueTimerLimit]);

  // Handle incoming network messages
  const handleIncomingMessage = (_senderId: string, msg: NetworkMessage) => {
    switch (msg.type) {
      case 'RENAME_PLAYER':
        if (isHost) {
          const oldPlayer = onlinePlayersRef.current.find(p => p.id === msg.playerId);
          const oldName = oldPlayer?.name || 'Someone';
          const sanitizedNewName = cleanText(msg.name.trim());

          if (oldName === sanitizedNewName) break;

          setOnlinePlayers(prev => {
            const next = prev.map(p => p.id === msg.playerId ? { ...p, name: sanitizedNewName } : p);
            multiplayer.send({
              type: 'LOBBY_UPDATE',
              players: next
            });
            return next;
          });

          const systemMsg: ChatMessage = {
            id: `sys_${Date.now()}_${Math.random()}`,
            senderId: 'system',
            senderName: 'System',
            senderAvatar: 'system-edit',
            text: `${oldName} changed their name to ${sanitizedNewName}.`,
            timestamp: Date.now(),
            isSystem: true
          };
          const msgWithScope = appendChatMessage(systemMsg);
          multiplayer.send({
            type: 'CHAT',
            message: msgWithScope
          });
        }
        break;

      case 'LOBBY_UPDATE':
        setOnlinePlayers(msg.players);
        const admin = msg.players.find(p => p.isAdmin);
        if (admin) {
          setLobbyAdminId(admin.id);
        }
        break;

      case 'SETTINGS_UPDATE':
        if (isHost) {
          const sender = onlinePlayersRef.current.find(p => p.id === _senderId);
          if (sender?.isAdmin) {
            setDifficulty(msg.difficulty);
            setSelectedCategories(msg.selectedCategories);
            setImpostorKnowsRole(msg.impostorKnowsRole);
            setRandomizeOrder(msg.randomizeOrder);
            setHintsEnabled(msg.hintsEnabled);
            setClueTimerLimit(msg.clueTimerLimit);
            multiplayer.send(msg);
          }
        } else {
          setDifficulty(msg.difficulty);
          setSelectedCategories(msg.selectedCategories);
          setImpostorKnowsRole(msg.impostorKnowsRole);
          setRandomizeOrder(msg.randomizeOrder);
          setHintsEnabled(msg.hintsEnabled);
          setClueTimerLimit(msg.clueTimerLimit);
        }
        break;

      case 'TRANSFER_HOST':
        const processTransferHost = (newAdminId: string) => {
          setLobbyAdminId(newAdminId);
          setOnlinePlayers(prev => {
            const next = prev.map(p => ({
              ...p,
              isAdmin: p.id === newAdminId
            }));
            return next;
          });
          const newAdminName = onlinePlayersRef.current.find(p => p.id === newAdminId)?.name || 'Someone';
          const systemMsg: ChatMessage = {
            id: `sys_${Date.now()}_${Math.random()}`,
            senderId: 'system',
            senderName: 'System',
            senderAvatar: 'system-crown',
            text: `${newAdminName} is now the Lobby Host.`,
            timestamp: Date.now(),
            isSystem: true
          };
          appendChatMessage(systemMsg);
        };

        if (isHost) {
          const sender = onlinePlayersRef.current.find(p => p.id === _senderId);
          if (_senderId === myPlayerIdRef.current || sender?.isAdmin) {
            processTransferHost(msg.newAdminId);
            multiplayer.send(msg);
          }
        } else {
          processTransferHost(msg.newAdminId);
        }
        break;

      case 'KICK_REQUEST':
        if (isHost) {
          const sender = onlinePlayersRef.current.find(p => p.id === _senderId);
          if (sender?.isAdmin) {
            kickPlayer(msg.targetId, msg.reason);
          }
        }
        break;

      case 'BAN_REQUEST':
        if (isHost) {
          const sender = onlinePlayersRef.current.find(p => p.id === _senderId);
          if (sender?.isAdmin) {
            banPlayer(msg.targetId, msg.reason);
          }
        }
        break;

      case 'VOTE_KICK_REQUEST':
        if (isHost) {
          handleVoteKickRequest(msg.targetId, msg.voterId);
        }
        break;

      case 'VOTE_BAN_REQUEST':
        if (isHost) {
          handleVoteBanRequest(msg.targetId, msg.voterId);
        }
        break;

      case 'VOTE_SURRENDER_REQUEST':
        if (isHost) {
          handleVoteSurrenderRequest(msg.voterId);
        }
        break;

      case 'VOTE_KICK_BAN_SYNC':
        if (!isHost) {
          setKickVotes(msg.kickVotes);
          setBanVotes(msg.banVotes);
        }
        break;

      case 'VOTE_SURRENDER_SYNC':
        if (!isHost) {
          setSurrenderVotes(msg.surrenderVotes);
        }
        break;

      case 'VOICE_TOGGLE':
        if (isHost) {
          setOnlinePlayers(prev => {
            const next = prev.map(p => p.id === _senderId ? { ...p, isVoiceActive: msg.active } : p);
            multiplayer.send({
              type: 'LOBBY_UPDATE',
              players: next
            });
            return next;
          });
        }
        break;

      case 'START_GAME_REQUEST':
        if (isHost) {
          const sender = onlinePlayersRef.current.find(p => p.id === _senderId);
          if (sender?.isAdmin) {
            startGame();
          }
        }
        break;

      case 'RESTART_GAME_REQUEST':
        if (isHost) {
          const sender = onlinePlayersRef.current.find(p => p.id === _senderId);
          if (sender?.isAdmin) {
            restartGame();
          }
        }
        break;

      case 'START_GAME':
        setMyPlayerId(msg.myPlayerId);
        setPlayers(msg.players);
        setPlayerOrder(msg.playerOrder);
        setCommonWord(msg.commonWord);
        setImpostorWord(msg.impostorWord);
        setChosenCategory(msg.chosenCategory);
        setActiveWordPairHints(msg.activeWordPairHints);
        setCommonVisual(msg.activePlayerVisualAid);
        setImpostorVisual(msg.activePlayerVisualAid);

        setCurrentRevealIndex(0);
        setIsWordRevealed(false);
        setPlayersWhoRevealed([]);
        setCurrentVoterIndex(0);
        setVotes({});
        setWinner(null);
        setVoteStats({});
        setIsSpectating(false);
        setGameStartedAt(msg.gameStartedAt || Date.now());
        setActiveGameState('REVEAL');
        setGameState('REVEAL');
        break;

      case 'REVEAL_COMPLETE':
        if (isHost) {
          setPlayersWhoRevealed(prev => {
            const next = prev.includes(msg.playerId) ? prev : [...prev, msg.playerId];
            multiplayer.send({
              type: 'REVEAL_PROGRESS',
              revealedPlayers: next
            });
            return next;
          });
        }
        break;

      case 'REVEAL_PROGRESS':
        setPlayersWhoRevealed(msg.revealedPlayers);
        break;

      case 'TIMER_SYNC':
        const timerSender = onlinePlayersRef.current.find(p => p.id === _senderId);
        if (!isHost || timerSender?.isAdmin) {
          setActiveClueIndex(msg.activeClueIndex);
          setTimerSeconds(msg.timerSeconds);
          setTimerActive(msg.timerActive);
          if (isHost) {
            multiplayer.send(msg);
          }
        }
        break;

      case 'VOTE_CAST':
        if (isHost) {
          setVotes(prev => {
            const next = { ...prev, [msg.voterId]: msg.votedId };
            if (Object.keys(next).length === onlinePlayersRef.current.length) {
              tallyMultiplayerResults(next);
            }
            return next;
          });
        }
        break;
      case 'GAME_OVER':
        setWinner(msg.winner);
        setVoteStats(msg.voteStats);
        setVotes(msg.votes);
        setImpostorId(msg.impostorId);
        setReadyPlayers([lobbyAdminId]);
        setGameState('RESULTS');
        if (msg.winner === 'CREWMATES') {
          playWin();
        } else {
          playLose();
        }
        break;

      case 'PLAY_AGAIN':
        setVotes({});
        setPlayersWhoRevealed([]);
        setWinner(null);
        setVoteStats({});
        setReadyPlayers([]);
        setIsSpectating(false);
        setActiveGameState(null);
        setGameState('SETUP');
        break;

      case 'STATE_CHANGE':
        const stateSender = onlinePlayersRef.current.find(p => p.id === _senderId);
        if (!isHost || stateSender?.isAdmin) {
          const targetState = msg.state as GameState;
          if (isSpectatingRef.current) {
            setActiveGameState(targetState);
            if (targetState === 'REVEAL' || targetState === 'CLUES' || targetState === 'VOTING') {
              break;
            }
          }
          if (targetState === 'SETUP') {
            setIsSpectating(false);
            setActiveGameState(null);
          }
          setGameState(targetState);
        }
        break;

      case 'GAME_IN_PROGRESS':
        setIsSpectating(msg.isStarted);
        if (msg.isStarted) {
          setActiveGameState(msg.currentGameState as GameState);
          showConfirm({
            title: 'Game In Progress',
            message: 'The room is already in a game. Please wait for the next match to start.',
            confirmText: 'OK',
            cancelText: '',
            onConfirm: () => { }
          });
        }
        break;

      case 'KICKED':
        leaveRoom();
        showConfirm({
          title: 'Kicked from Room',
          message: msg.reason
            ? `You have been kicked from the room. Reason: ${msg.reason}`
            : 'You have been kicked from the room by the host.',
          confirmText: 'OK',
          cancelText: '',
          onConfirm: () => { }
        });
        break;

      case 'BANNED':
        leaveRoom();
        showConfirm({
          title: 'Banned from Room',
          message: msg.reason
            ? `You have been banned from the room. Reason: ${msg.reason}`
            : 'You have been banned from the room by the host. You cannot rejoin.',
          confirmText: 'OK',
          onConfirm: () => {}
        });
        break;

      case 'VOTE_MOD_START':
        if (isHost) {
          multiplayer.broadcastExcept(_senderId, msg);
        }
        if (msg.initiatorId !== myPlayerIdRef.current) {
          setActiveVote({
            voteId: msg.voteId,
            action: msg.action,
            targetId: msg.targetId,
            targetName: msg.targetName,
            initiatorId: msg.initiatorId,
            initiatorName: msg.initiatorName,
            reason: msg.reason,
            votes: { [msg.initiatorId]: 'yes' }
          });
        }
        break;

      case 'VOTE_MOD_CAST':
        if (isHost) {
          multiplayer.broadcastExcept(_senderId, msg);
          handleModerationVoteCast(msg.voterId, msg.voteId, msg.vote);
        } else {
          setActiveVote(prev => {
            if (!prev || prev.voteId !== msg.voteId) return prev;
            return { ...prev, votes: { ...prev.votes, [msg.voterId]: msg.vote } };
          });
        }
        break;

      case 'VOTE_MOD_RESULT':
        if (!isHost) {
          const actionWord = msg.action === 'ban' ? 'ban' : 'kick';
          const sysMsg: ChatMessage = {
            id: `sys_${Date.now()}_${Math.random()}`,
            senderId: 'system',
            senderName: 'System',
            senderAvatar: msg.passed ? '⚖️' : '🗳️',
            text: msg.passed
              ? `Vote to ${actionWord} ${msg.targetName} passed.`
              : `Vote to ${actionWord} ${msg.targetName} failed.`,
            timestamp: Date.now(),
            isSystem: true
          };
          setChatMessages(prev => [...prev, sysMsg]);
          setTimeout(() => setActiveVote(null), 2000);
        }
        break;

      case 'CHAT':
        const cleanedMsgText = cleanText(msg.message.text);
        const processedMsg = {
          ...msg.message,
          text: cleanedMsgText
        };
        const isUnique = !chatMessagesRef.current.some(m => m.id === processedMsg.id);
        const msgWithScope = appendChatMessage(processedMsg);
        if (isHost && isUnique) {
          multiplayer.send({
            ...msg,
            message: msgWithScope
          });
        }
        break;

      case 'ROOM_NOTICE':
        pushRoomNotice(msg.text);
        break;

      case 'PLAYER_READY':
        if (isHost) {
          setReadyPlayers(prev => {
            const next = msg.isReady
              ? (prev.includes(msg.playerId) ? prev : [...prev, msg.playerId])
              : prev.filter(id => id !== msg.playerId);
            multiplayer.send({
              type: 'READY_STATUS_UPDATE',
              readyPlayers: next
            });
            return next;
          });
        }
        break;

      case 'READY_STATUS_UPDATE':
        setReadyPlayers(msg.readyPlayers);
        break;

      case 'LEAVE':
        if (multiplayer.isHost) {
          const senderPeerId = _senderId || msg.playerId;
          if (senderPeerId) {
            multiplayer.closeConnection(senderPeerId);
            handlePlayerDisconnected(senderPeerId);
          }
        }
        break;

      case 'HOST_LEFT':
        receivedHostLeftRef.current = true;
        leaveRoom(true);
        showConfirm({
          title: 'Lobby Ended',
          message: 'The host has left the lobby. The game session has ended.',
          confirmText: 'OK',
          onConfirm: () => { }
        });
        break;
    }
  };

  const handlePlayerJoined = (player: NetworkPlayer) => {
    const cleanedName = cleanText(player.name);
    const cleanedPlayer = {
      ...player,
      name: cleanedName
    };
    setOnlinePlayers(prev => {
      const next = prev.some(p => p.id === cleanedPlayer.id) ? prev : [...prev, cleanedPlayer];
      multiplayer.send({
        type: 'LOBBY_UPDATE',
        players: next
      });
      return next;
    });

    const systemMsg: ChatMessage = {
      id: `sys_${Date.now()}_${Math.random()}`,
      senderId: 'system',
      senderName: 'System',
      senderAvatar: 'system-info',
      text: `${cleanedName} joined the room.`,
      timestamp: Date.now(),
      isSystem: true
    };
    const msgWithScope = appendChatMessage(systemMsg);
    multiplayer.send({
      type: 'CHAT',
      message: msgWithScope
    });
    // Show the join banner to the host and every other player, but not to the
    // joiner themselves (they already see the lobby they just entered). Mirrors
    // the "<name> left the lobby" notice.
    const joinNotice = `${cleanedName} joined the lobby.`;
    pushRoomNotice(joinNotice);
    multiplayer.broadcastExcept(cleanedPlayer.id, {
      type: 'ROOM_NOTICE',
      text: joinNotice
    });

    // Sync current settings to the newly joined player
    multiplayer.sendTo(cleanedPlayer.id, {
      type: 'SETTINGS_UPDATE',
      difficulty,
      selectedCategories,
      impostorKnowsRole,
      randomizeOrder,
      hintsEnabled,
      clueTimerLimit
    });

    // If game is in progress, notify the new player
    if (gameStateRef.current !== 'SETUP') {
      multiplayer.sendTo(cleanedPlayer.id, {
        type: 'GAME_IN_PROGRESS',
        isStarted: true,
        currentGameState: gameStateRef.current
      });
    }
  };

  const handlePlayerDisconnected = (playerId: string) => {
    // Clear votes cast by or against the disconnected player
    setKickVotes(prev => {
      const next: Record<string, string[]> = {};
      Object.entries(prev).forEach(([targetId, voters]) => {
        if (targetId !== playerId) {
          next[targetId] = voters.filter(vId => vId !== playerId);
        }
      });
      if (isHost) {
        multiplayer.send({
          type: 'VOTE_KICK_BAN_SYNC',
          kickVotes: next,
          banVotes: banVotesRef.current
        });
      }
      return next;
    });
    setBanVotes(prev => {
      const next: Record<string, string[]> = {};
      Object.entries(prev).forEach(([targetId, voters]) => {
        if (targetId !== playerId) {
          next[targetId] = voters.filter(vId => vId !== playerId);
        }
      });
      if (isHost) {
        multiplayer.send({
          type: 'VOTE_KICK_BAN_SYNC',
          kickVotes: kickVotesRef.current,
          banVotes: next
        });
      }
      return next;
    });

    const wasKicked = kickedPlayersRef.current.has(playerId);
    if (wasKicked) {
      kickedPlayersRef.current.delete(playerId);
    }

    setReadyPlayers(prev => {
      const next = prev.filter(id => id !== playerId);
      if (isHost) {
        multiplayer.send({
          type: 'READY_STATUS_UPDATE',
          readyPlayers: next
        });
      }
      return next;
    });

    // Compute the leaving player and next list synchronously from the ref so
    // disconnectedName is available for the notice below. Reading it from inside
    // the setOnlinePlayers updater left it stale (the updater runs on a later
    // render), which made the early-return below fire and silently dropped the
    // "<player> left the lobby" notice.
    const prevOnlinePlayers = onlinePlayersRef.current;
    const leavingPlayerEntry = prevOnlinePlayers.find(player => player.id === playerId);
    const disconnectedName = leavingPlayerEntry ? leavingPlayerEntry.name : '';
    const nextOnlinePlayers = prevOnlinePlayers.filter(player => player.id !== playerId);
    // Update the ref synchronously so a duplicate call for the same player (e.g.
    // the LEAVE message followed by the peer 'close' event) early-returns below
    // instead of firing the notice twice.
    onlinePlayersRef.current = nextOnlinePlayers;
    setOnlinePlayers(nextOnlinePlayers);
    multiplayer.send({
      type: 'LOBBY_UPDATE',
      players: nextOnlinePlayers
    });

    if (!disconnectedName) return;

    if (wasKicked) return;

    const activeGameStates: GameState[] = ['REVEAL', 'CLUES', 'VOTING'];
    const isActiveGame = activeGameStates.includes(gameState);
    const leavingPlayer = players.find(player => player.id === playerId);
    const leavingIsImpostor = leavingPlayer?.role === 'IMPOSTOR' || impostorId === playerId;
    const remainingPlayers = nextOnlinePlayers.length;

    const systemMsg: ChatMessage = {
      id: `sys_${Date.now()}_${Math.random()}`,
      senderId: 'system',
      senderName: 'System',
      senderAvatar: 'system-info',
      text: `${disconnectedName} left the lobby.`,
      timestamp: Date.now(),
      isSystem: true
    };
    const msgWithScope = appendChatMessage(systemMsg);
    pushRoomNotice(`${disconnectedName} left the lobby.`);
    multiplayer.send({
      type: 'CHAT',
      message: msgWithScope
    });
    multiplayer.send({
      type: 'ROOM_NOTICE',
      text: `${disconnectedName} left the lobby.`
    });

    if (!isActiveGame) return;

    const shouldEndGame = leavingIsImpostor || remainingPlayers < 3;
    if (shouldEndGame) {
      const endReason = leavingIsImpostor
        ? `${disconnectedName} left the game. The impostor is gone, so the crewmates win.`
        : `${disconnectedName} left the game. Not enough players remain to continue, so the crewmates win.`;

      pushRoomNotice(endReason);
      multiplayer.send({
        type: 'ROOM_NOTICE',
        text: endReason
      });

      setWinner('CREWMATES');
      playWin();
      setStats(prev => ({
        gamesPlayed: prev.gamesPlayed + 1,
        crewmateWins: prev.crewmateWins + 1,
        impostorWins: prev.impostorWins,
      }));

      const activeImpostor = players.find(p => p.role === 'IMPOSTOR');
      const counts: Record<string, number> = {};
      players.forEach(p => {
        counts[p.id] = 0;
      });
      setVoteStats(counts);
      setVotes({});

      const newHistoryItem: GameHistoryItem = {
        id: `hist_${Date.now()}`,
        timestamp: Date.now(),
        category: chosenCategory,
        playerCount: players.length,
        winner: 'CREWMATES',
        impostorName: activeImpostor?.name || 'Impostor',
        impostorWord,
        commonWord,
      };
      setHistory(prev => [newHistoryItem, ...prev].slice(0, 10));

      setGameState('RESULTS');
      setReadyPlayers([myPlayerId]);
      multiplayer.send({
        type: 'GAME_OVER',
        winner: 'CREWMATES',
        voteStats: counts,
        votes: {},
        impostorId: impostorId
      });
      return;
    }

    setPlayers(prev => prev.filter(player => player.id !== playerId));
    setPlayerOrder(prev => prev.filter(id => id !== playerId));
    setPlayersWhoRevealed(prev => prev.filter(id => id !== playerId));
    setVotes(prev => {
      const next = { ...prev };
      delete next[playerId];
      Object.keys(next).forEach(voterId => {
        if (next[voterId] === playerId) {
          delete next[voterId];
        }
      });
      return next;
    });
  };
  const handleIncomingMessageRef = useRef(handleIncomingMessage);
  const handlePlayerJoinedRef = useRef(handlePlayerJoined);
  const handlePlayerDisconnectedRef = useRef(handlePlayerDisconnected);

  useEffect(() => {
    handleIncomingMessageRef.current = handleIncomingMessage;
  }, [handleIncomingMessage]);

  useEffect(() => {
    handlePlayerJoinedRef.current = handlePlayerJoined;
  }, [handlePlayerJoined]);

  useEffect(() => {
    handlePlayerDisconnectedRef.current = handlePlayerDisconnected;
  }, [handlePlayerDisconnected]);

  const hostRoom = async (): Promise<string> => {
    setMultiplayerStatus('connecting');
    receivedHostLeftRef.current = false;
    intentionalLeaveRef.current = false;
    try {
      const code = await multiplayer.initHost(
        (senderId, msg) => handleIncomingMessageRef.current(senderId, msg),
        (status) => {
          if (status === 'connected') setMultiplayerStatus('connected');
          if (status === 'disconnected') setMultiplayerStatus('disconnected');
          if (status === 'error') setMultiplayerStatus('error');
        },
        (player) => handlePlayerJoinedRef.current(player),
        (playerId) => handlePlayerDisconnectedRef.current(playerId)
      );
      setIsMultiplayer(true);
      setIsHost(true);
      setRoomCode(code);
      const hostPeerId = multiplayer.myPeerId || `host_${Date.now()}`;
      const hostPlayer: NetworkPlayer = {
        id: hostPeerId,
        name: customNames[0] || 'Host',
        avatar: customAvatars[0] || '🦊',
        isHost: true,
        isAdmin: true
      };
      setMyPlayerId(hostPlayer.id);
      setLobbyAdminId(hostPlayer.id);
      setOnlinePlayers([hostPlayer]);
      setMultiplayerStatus('connected');
      return code;
    } catch (err) {
      multiplayer.disconnect();
      setMultiplayerStatus('error');
      throw err;
    }
  };

  const joinRoom = async (code: string, name: string, avatar: string): Promise<void> => {
    setMultiplayerStatus('connecting');
    receivedHostLeftRef.current = false;
    intentionalLeaveRef.current = false;
    try {
      await multiplayer.initGuest(
        code,
        name,
        avatar,
        (senderId, msg) => handleIncomingMessageRef.current(senderId, msg),
        (status) => {
          if (status === 'connected') setMultiplayerStatus('connected');
          if (status === 'disconnected') {
            setMultiplayerStatus('disconnected');
            // Only surface the modal for a genuine connection loss / host
            // closing the room. A deliberate self-leave (intentionalLeaveRef)
            // or a received HOST_LEFT shows its own message, so skip here.
            if (!receivedHostLeftRef.current && !intentionalLeaveRef.current) {
              showConfirmRef.current({
                title: 'Disconnected',
                message: 'Connection to the host was lost or the host closed the room.',
                confirmText: 'OK',
                onConfirm: () => { }
              });
            }
            leaveRoomRef.current();
          }
          if (status === 'error') setMultiplayerStatus('error');
        }
      );
      setIsMultiplayer(true);
      setIsHost(false);
      setRoomCode(code);
      setMyPlayerId(multiplayer.myPeerId);
      setMultiplayerStatus('connected');
    } catch (err) {
      multiplayer.disconnect();
      setMultiplayerStatus('error');
      throw err;
    }
  };

  const leaveRoom = (isHostDisconnect = false) => {
    // This client is leaving on purpose, so its own peer teardown must not
    // trigger the "Disconnected" modal.
    intentionalLeaveRef.current = true;
    cleanupVoice();
    const wasMultiplayer = multiplayer.roomCode !== '';
    const wasHost = multiplayer.isHost;

    if (wasMultiplayer && !isHostDisconnect) {
      if (!wasHost) {
        multiplayer.send({
          type: 'LEAVE',
          playerId: multiplayer.myPeerId
        });
      } else {
        multiplayer.send({
          type: 'HOST_LEFT'
        });
      }
      setTimeout(() => {
        multiplayer.disconnect();
      }, 2000);
    } else {
      multiplayer.disconnect();
    }
    setIsMultiplayer(false);
    setIsHost(false);
    setRoomCode('');
    setMyPlayerId('');
    setOnlinePlayers([]);
    setPlayerPings({});
    setKickVotes({});
    setBanVotes({});
    setSelectedModerationPlayer(null);
    setPlayersWhoRevealed([]);
    setReadyPlayers([]);
    setIsSpectating(false);
    setMultiplayerStatus('idle');
    setGameState('HOME');
    setChatMessages([]);
    setIsChatOpen(false);
    setUnreadChatCount(0);
  };

  const tallyMultiplayerResults = (finalVotes: Record<string, string>) => {
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

    if (gameWinner === 'CREWMATES') {
      playWin();
    } else {
      playLose();
    }

    setStats(prev => ({
      gamesPlayed: prev.gamesPlayed + 1,
      crewmateWins: prev.crewmateWins + (gameWinner === 'CREWMATES' ? 1 : 0),
      impostorWins: prev.impostorWins + (gameWinner === 'IMPOSTOR' ? 1 : 0),
    }));

    const activeImpostor = players.find(p => p.role === 'IMPOSTOR');
    const newHistoryItem: GameHistoryItem = {
      id: `hist_${Date.now()}`,
      timestamp: Date.now(),
      category: chosenCategory,
      playerCount: players.length,
      winner: gameWinner,
      impostorName: activeImpostor?.name || 'Impostor',
      impostorWord,
      commonWord,
    };
    setHistory(prev => [newHistoryItem, ...prev].slice(0, 10));

    setGameState('RESULTS');
    setReadyPlayers([myPlayerId]);

    multiplayer.send({
      type: 'GAME_OVER',
      winner: gameWinner,
      voteStats: counts,
      votes: finalVotes,
      impostorId: impostorId
    });
  };

  const cleanupVoice = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(t => t.stop());
      localStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => { });
      audioContextRef.current = null;
    }
    gainNodeRef.current = null;
    localDestinationStreamRef.current = null;

    Object.values(activeCallsRef.current).forEach((call: any) => {
      try { call.close(); } catch (e) { }
    });
    activeCallsRef.current = {};

    Object.values(audioElementsRef.current).forEach((audio) => {
      try { audio.pause(); audio.srcObject = null; audio.remove(); } catch (e) { }
    });
    audioElementsRef.current = {};

    Object.values(voiceSpeakingDetectorsRef.current).forEach((detector) => {
      clearInterval(detector.interval);
    });
    voiceSpeakingDetectorsRef.current = {};

    setPlayersSpeaking({});
    setPlayersVolume({});
    setIsVoiceActive(false);
    setMicMuted(false);
    setDeafenAll(false);
  };

  useEffect(() => {
    Object.entries(audioElementsRef.current).forEach(([id, audio]) => {
      try {
        const shouldMute = deafenAll || deafenedPlayerIds.includes(id) || mutedPlayerIds.includes(id);
        audio.muted = !!shouldMute;
      } catch (e) { }
    });
  }, [deafenAll, deafenedPlayerIds, mutedPlayerIds]);

  const handleRemoteCallStream = (call: any, peerId: string) => {
    call.on('stream', (remoteStream: MediaStream) => {
      let audio = audioElementsRef.current[peerId];
      if (!audio) {
        audio = new Audio();
        audio.autoplay = true;
        audioElementsRef.current[peerId] = audio;
      }
      audio.srcObject = remoteStream;
      audio.volume = speakerVolume;
      // Apply local deafen / moderation mute rules
      try {
        const shouldMute = deafenAll || deafenedPlayerIds.includes(peerId) || mutedPlayerIds.includes(peerId);
        audio.muted = !!shouldMute;
      } catch (e) { }
      console.log(`[Voice Chat] ${isHost ? 'Host' : 'Guest'} ${myPlayerId}: Received remote stream from ${peerId}.`);
      console.log(`[Voice Chat] ${isHost ? 'Host' : 'Guest'} ${myPlayerId}: Received remote stream from ${peerId}.`);
      console.log(`[Voice Chat] ${isHost ? 'Host' : 'Guest'} ${myPlayerId}: Received remote stream from ${peerId}.`);
      audio.play().catch((e: any) => console.warn("Audio autoplay blocked or failed:", e));

      if (voiceSpeakingDetectorsRef.current[peerId]) {
        clearInterval(voiceSpeakingDetectorsRef.current[peerId].interval);
      }

      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const tempCtx = new AudioContextClass();
        const src = tempCtx.createMediaStreamSource(remoteStream);
        const analyser = tempCtx.createAnalyser();
        analyser.fftSize = 512;
        src.connect(analyser);

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const interval = setInterval(() => {
          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i] * dataArray[i];
          }
          const rms = Math.sqrt(sum / bufferLength) / 255;
          const isSpeakingNow = rms > 0.03;

          setPlayersSpeaking(prev => {
            if (prev[peerId] === isSpeakingNow) return prev;
            return { ...prev, [peerId]: isSpeakingNow };
          });
          setPlayersVolume(prev => ({ ...prev, [peerId]: rms }));
        }, 150);

        voiceSpeakingDetectorsRef.current[peerId] = {
          interval,
          analyser
        };
      } catch (err) {
        console.warn("Could not start volume analysis for player " + peerId, err);
      }
    });

    call.on('close', () => {
      cleanupRemotePeerCall(peerId);
    });

    call.on('error', () => {
      cleanupRemotePeerCall(peerId);
    });
  };

  const cleanupRemotePeerCall = (peerId: string) => {
    console.log(`[Voice Chat] ${isHost ? 'Host' : 'Guest'} ${myPlayerId}: Cleaning up remote peer call for ${peerId}.`);
    if (activeCallsRef.current[peerId]) {
      try { activeCallsRef.current[peerId].close(); } catch (e) { }
      delete activeCallsRef.current[peerId];
    }
    const audio = audioElementsRef.current[peerId];
    if (audio) {
      try { audio.pause(); audio.srcObject = null; audio.remove(); } catch (e) { }
      delete audioElementsRef.current[peerId];
    }
    const detector = voiceSpeakingDetectorsRef.current[peerId];
    if (detector) {
      clearInterval(detector.interval);
      delete voiceSpeakingDetectorsRef.current[peerId];
    }
    setPlayersSpeaking(prev => {
      if (prev[peerId] === undefined) return prev;
      const next = { ...prev };
      delete next[peerId];
      return next;
    });
    setPlayersVolume(prev => {
      if (prev[peerId] === undefined) return prev;
      const next = { ...prev };
      delete next[peerId];
      return next;
    });
  };

  const toggleVoice = async () => {
    if (isVoiceActive) {
      console.log(`[Voice Chat] ${isHost ? 'Host' : 'Guest'} ${myPlayerId}: Deactivating voice.`);
      cleanupVoice();
      if (isMultiplayer) {
        multiplayer.send({
          type: 'VOICE_TOGGLE',
          active: false
        });
        if (isHost) {
          setOnlinePlayers(prev => {
            const next = prev.map(p => p.id === myPlayerId ? { ...p, isVoiceActive: false } : p);
            multiplayer.send({
              type: 'LOBBY_UPDATE',
              players: next
            });
            return next;
          });
        }
      }
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });

        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        const source = ctx.createMediaStreamSource(stream);
        const gainNode = ctx.createGain();
        gainNode.gain.value = micVolume;
        const dest = ctx.createMediaStreamDestination();

        source.connect(gainNode);
        gainNode.connect(dest);

        localStreamRef.current = stream;
        audioContextRef.current = ctx;
        gainNodeRef.current = gainNode;
        localDestinationStreamRef.current = dest.stream;

        setIsVoiceActive(true);
        console.log(`[Voice Chat] ${isHost ? 'Host' : 'Guest'} ${myPlayerId}: Activated voice.`);

        if (isMultiplayer) {
          multiplayer.send({
            type: 'VOICE_TOGGLE',
            active: true
          });
          if (isHost) {
            setOnlinePlayers(prev => {
              const next = prev.map(p => p.id === myPlayerId ? { ...p, isVoiceActive: true } : p);
              multiplayer.send({
                type: 'LOBBY_UPDATE',
                players: next
              });
              return next;
            });
          }
        }
      } catch (err) {
        console.error('Failed to access microphone for voice chat:', err);
        showConfirm({
          title: 'Microphone Access Denied',
          message: 'Unable to access your microphone. Please check your browser permissions for this site and try again.',
          confirmText: 'OK',
          onConfirm: () => { }
        });
      }
    }
  };

  // Listen for incoming voice calls
  useEffect(() => {
    const peer = multiplayer.getPeer();
    if (!peer) return;

    const handleCall = (call: any) => {
      console.log(`[Voice Chat] ${isHost ? 'Host' : 'Guest'} ${myPlayerId}: Incoming call from ${call.peer}. isVoiceActive: ${isVoiceActive}, localDestinationStreamRef.current: ${!!localDestinationStreamRef.current}`);
      if (!isVoiceActive || !localDestinationStreamRef.current) {
        try {
          const emptyCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const emptyDest = emptyCtx.createMediaStreamDestination();
          call.answer(emptyDest.stream);
          setTimeout(() => call.close(), 100);
          console.log(`[Voice Chat] ${isHost ? 'Host' : 'Guest'} ${myPlayerId}: Answered incoming call from ${call.peer} with empty stream (voice not active or no local stream).`);
        } catch (e) {
          call.answer();
          console.error(`[Voice Chat] ${isHost ? 'Host' : 'Guest'} ${myPlayerId}: Error answering with empty stream:`, e);
        }
        return;
      }

      call.answer(localDestinationStreamRef.current);
      activeCallsRef.current[call.peer] = call;
      console.log(`[Voice Chat] ${isHost ? 'Host' : 'Guest'} ${myPlayerId}: Answered incoming call from ${call.peer} with local stream.`);
      handleRemoteCallStream(call, call.peer);
    };

    peer.on('call', handleCall);
    return () => {
      peer.off('call', handleCall);
    };
  }, [isVoiceActive, multiplayerStatus]);

  // Check player voice scopes and manage direct WebRTC calls
  useEffect(() => {
    if (!isVoiceActive || !isMultiplayer) {
      if (!isVoiceActive) {
        Object.keys(activeCallsRef.current).forEach(peerId => {
          cleanupRemotePeerCall(peerId);
        });
      }
      return;
    }

    const peer = multiplayer.getPeer();
    if (!peer) return;

    const getPlayerVoiceScope = (playerId: string) => {
      const p = onlinePlayers.find(pl => pl.id === playerId);
      if (!p) return 'lobby';
      const gameActive = gameState !== 'SETUP' && gameState !== 'HOME';
      if (gameActive && p.isSpectating) return 'lobby';
      if (gameActive && !p.isSpectating) return 'game';
      return 'lobby';
    };

    const myScope = getPlayerVoiceScope(myPlayerId);

    Object.keys(activeCallsRef.current).forEach(peerId => {
      const p = onlinePlayers.find(pl => pl.id === peerId);
      const targetScope = getPlayerVoiceScope(peerId);

      const shouldDisconnect = !p || !p.isVoiceActive || targetScope !== myScope;
      if (shouldDisconnect) {
        cleanupRemotePeerCall(peerId);
      }
    });

    if (localDestinationStreamRef.current) {
      onlinePlayers.forEach(p => {
        if (p.id === myPlayerId) return;
        if (!p.isVoiceActive) return;

        const targetScope = getPlayerVoiceScope(p.id);
        if (targetScope === myScope && myPlayerId < p.id) {
          if (!activeCallsRef.current[p.id]) {
            try {
              console.log(`[Voice Chat] ${isHost ? 'Host' : 'Guest'} ${myPlayerId}: Initiating call to peer ${p.id}.`);
              const call = peer.call(p.id, localDestinationStreamRef.current!);
              activeCallsRef.current[p.id] = call;
              handleRemoteCallStream(call, p.id);
            } catch (err) {
              console.error(`[Voice Chat] ${isHost ? 'Host' : 'Guest'} ${myPlayerId}: Failed to call peer ${p.id}:`, err);
            }
          }
        }
      });
    }
  }, [isVoiceActive, onlinePlayers, gameState, isSpectating, isMultiplayer, myPlayerId]);

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

  const leaveRoomRef = useRef(leaveRoom);
  const showConfirmRef = useRef(showConfirm);

  useEffect(() => {
    leaveRoomRef.current = leaveRoom;
  }, [leaveRoom]);

  useEffect(() => {
    showConfirmRef.current = showConfirm;
  }, [showConfirm]);

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

  const startGame = async () => {
    if (isMultiplayer && !isHost) {
      multiplayer.send({ type: 'START_GAME_REQUEST' });
      return;
    }

    if (!isMultiplayer) {
      for (let i = 0; i < playerCount; i++) {
        const name = customNames[i]?.trim() || `Player ${i + 1}`;
        if (containsProfanity(name)) {
          showConfirm({
            title: 'Inappropriate Name Detected',
            message: `Player ${i + 1}'s name contains vulgar language. Please use a clean name before starting.`,
            confirmText: 'OK',
            onConfirm: () => { }
          });
          return;
        }
      }
    }

    playClick();
    // 1. Select word pair
    const recentCommonWords = history.map(h => h.commonWord);
    let pair: WordPair;
    let cat: string;

    if (useAiWordGeneration && geminiApiKey) {
      const aiPair = await getAiWordPairOrNull(selectedCategories, difficulty, customWordPairs, geminiApiKey);
      if (aiPair) {
        pair = aiPair;
        cat = 'AI Generated';
        setAiGenerationError('');
      } else {
        const fallback = getRandomWordPair(selectedCategories, difficulty, customWordPairs, recentCommonWords);
        pair = fallback.pair;
        cat = fallback.chosenCategory;
        setAiGenerationError('AI generation did not return a usable pair; using built-in words instead.');
      }
    } else {
      const fallback = getRandomWordPair(selectedCategories, difficulty, customWordPairs, recentCommonWords);
      pair = fallback.pair;
      cat = fallback.chosenCategory;
      setAiGenerationError('');
    }

    setCommonWord(pair.common);
    setImpostorWord(pair.impostor);
    setChosenCategory(cat);
    setActiveWordPairHints(pair.hints || ['Party Game', 'Deluxe Edition', 'Secret Role']);
    setCommonVisual(pair.commonVisual || { emojis: '❔', description: 'Appearance details unknown.' });
    setImpostorVisual(pair.impostorVisual || { emojis: '❔', description: 'Appearance details unknown.' });

    // 2. Prepare players
    const gamePlayers: Player[] = [];
    const ids: string[] = [];

    if (isMultiplayer) {
      // Choose random impostor index from connected online players
      const impostorIndex = Math.floor(Math.random() * onlinePlayers.length);
      let chosenImpostorId = '';

      for (let i = 0; i < onlinePlayers.length; i++) {
        const op = onlinePlayers[i];
        const id = op.id;
        ids.push(id);

        const isImpostor = i === impostorIndex;
        if (isImpostor) {
          chosenImpostorId = id;
        }

        gamePlayers.push({
          id,
          name: op.name,
          avatar: op.avatar,
          role: isImpostor ? 'IMPOSTOR' : 'CREWMATE',
          word: isImpostor ? pair.impostor : pair.common,
        });
      }

      setPlayers(gamePlayers);
      setImpostorId(chosenImpostorId);

      let order = [...ids];
      if (randomizeOrder) {
        order = order.sort(() => Math.random() - 0.5);
      }
      setPlayerOrder(order);

      setCurrentRevealIndex(0);
      setIsWordRevealed(false);
      setPlayersWhoRevealed([]);
      setCurrentVoterIndex(0);
      setVotes({});

      const startTimestamp = Date.now();
      setGameStartedAt(startTimestamp);

      // Broadcast start signal to guests
      onlinePlayers.forEach((op) => {
        const gp = gamePlayers.find((p) => p.id === op.id)!;
        const visualAid = gp.role === 'IMPOSTOR' ? pair.impostorVisual : pair.commonVisual;

        if (op.id !== myPlayerId) {
          multiplayer.sendTo(op.id, {
            type: 'START_GAME',
            myPlayerId: op.id,
            players: gamePlayers,
            playerOrder: order,
            commonWord: pair.common,
            impostorWord: pair.impostor,
            chosenCategory: cat,
            activeWordPairHints: pair.hints || [],
            activePlayerVisualAid: visualAid,
            gameStartedAt: startTimestamp
          });
        }
      });

      setGameState('REVEAL');
    } else {
      // Local Pass & Play flow
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

      let order = [...ids];
      if (randomizeOrder) {
        order = order.sort(() => Math.random() - 0.5);
      }
      setPlayerOrder(order);

      setCurrentRevealIndex(0);
      setIsWordRevealed(false);
      setCurrentVoterIndex(0);
      setVotes({});
      setGameState('REVEAL');
    }
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
    if (isMultiplayer) {
      // Notify host that I finished revealing
      multiplayer.send({
        type: 'REVEAL_COMPLETE',
        playerId: myPlayerId
      });
      // Add local record if host
      if (isHost) {
        setPlayersWhoRevealed(prev => {
          const next = prev.includes(myPlayerId) ? prev : [...prev, myPlayerId];
          multiplayer.send({
            type: 'REVEAL_PROGRESS',
            revealedPlayers: next
          });
          if (next.length === onlinePlayers.length) {
            setGameState('CLUES');
            setTimerSeconds(clueTimerLimit);
            setTimerActive(false);
            setActiveClueIndex(0);
            multiplayer.send({
              type: 'TIMER_SYNC',
              activeClueIndex: 0,
              timerSeconds: clueTimerLimit,
              timerActive: false
            });
          }
          return next;
        });
      }
    } else {
      if (currentRevealIndex < playerOrder.length - 1) {
        setCurrentRevealIndex(prev => prev + 1);
      } else {
        setGameState('CLUES');
        setTimerSeconds(clueTimerLimit);
        setTimerActive(false);
      }
    }
  };

  const submitVote = (votedId: string) => {
    if (isMultiplayer) {
      if (isHost) {
        setVotes(prev => {
          const next = { ...prev, [myPlayerId]: votedId };
          if (Object.keys(next).length === onlinePlayers.length) {
            tallyMultiplayerResults(next);
          }
          return next;
        });
      } else {
        setVotes({ [myPlayerId]: votedId });
        multiplayer.send({
          type: 'VOTE_CAST',
          voterId: myPlayerId,
          votedId
        });
      }
    } else {
      const voterId = playerOrder[currentVoterIndex];
      const newVotes = { ...votes, [voterId]: votedId };
      setVotes(newVotes);

      if (currentVoterIndex < playerOrder.length - 1) {
        setCurrentVoterIndex(prev => prev + 1);
      } else {
        tallyResults(newVotes);
      }
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
    if (isMultiplayer && !isHost) {
      multiplayer.send({ type: 'RESTART_GAME_REQUEST' });
      return;
    }
    playClick();
    if (isMultiplayer) {
      if (isHost) {
        setVotes({});
        setPlayersWhoRevealed([]);
        setWinner(null);
        setVoteStats({});
        setReadyPlayers([]);
        setIsSpectating(false);
        setGameState('SETUP');
        multiplayer.send({
          type: 'PLAY_AGAIN'
        });
      }
    } else {
      startGame();
    }
  };

  const setPlayerReady = (ready: boolean) => {
    playClick();
    if (!isMultiplayer) return;

    if (isHost) {
      setReadyPlayers(prev => {
        const next = ready
          ? (prev.includes(myPlayerId) ? prev : [...prev, myPlayerId])
          : prev.filter(id => id !== myPlayerId);
        multiplayer.send({
          type: 'READY_STATUS_UPDATE',
          readyPlayers: next
        });
        return next;
      });
    } else {
      multiplayer.send({
        type: 'PLAYER_READY',
        playerId: myPlayerId,
        isReady: ready
      });
    }
  };

  const resetGame = () => {
    playClick();
    // Returning Home (e.g. header Home button) while in a multiplayer room must
    // tear down the peer connection so the other players are notified. Without
    // this, the host's peer stayed alive and guests never learned the host left
    // (the modal only appeared on a refresh, which destroys the peer on unload).
    // Host: destroy the peer immediately so guests get the "Disconnected" modal,
    // exactly like a refresh. Guest: notify the host it left.
    cleanupVoice();
    if (multiplayer.roomCode !== '') {
      leaveRoom(multiplayer.isHost);
    }
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
    setReadyPlayers([]);
    setIsSpectating(false);
    setActiveGameState(null);
    setGameState('HOME');
    setChatMessages([]);
    setIsChatOpen(false);
    setUnreadChatCount(0);
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
        themeMode,
        setThemeMode,
        themePaletteId,
        setThemePaletteId,
        isMultiplayer,
        isHost,
        useAiWordGeneration,
        setUseAiWordGeneration,
        aiGenerationError,
        setAiGenerationError,
        geminiApiKey,
        setGeminiApiKey,
        roomCode,
        myPlayerId,
        multiplayerStatus,
        onlinePlayers,
        playersWhoRevealed,
        readyPlayers,
        isSpectating,
        activeGameState,
        gameStartedAt,
        setPlayerReady,
        activeClueIndex,
        setActiveClueIndex,
        timerSeconds,
        setTimerSeconds,
        timerActive,
        setTimerActive,
        clueTimerLimit,
        setClueTimerLimit,
        hostRoom,
        joinRoom,
        leaveRoom,
        chatMessages,
        isChatOpen,
        setIsChatOpen,
        unreadChatCount,
        setUnreadChatCount,
        sendChatMessage,
        kickPlayer,
        isLobbyAdmin,
        lobbyAdminId,
        toggleMutePlayer,
        mutedPlayerIds,
        banPlayer,
        transferHost,
        updatePlayerName,
        playerPings,
        kickVotes,
        banVotes,
        voteToKickPlayer,
        voteToBanPlayer,
        selectedModerationPlayer,
        setSelectedModerationPlayer,
        roomNotice,
        activeVote,
        startVoteKick,
        startVoteBan,
        castModerationVote,
        voteNotification,
        isVoiceActive,
        toggleVoice,
        micVolume,
        setMicVolume,
        speakerVolume,
        setSpeakerVolume,
        playersSpeaking,
        playersVolume,
        micMuted,
        toggleMicMute,
        deafenAll,
        toggleDeafenAll,
        deafenedPlayerIds,
        toggleDeafenPlayer,
        surrenderVotes,
        voteToSurrender,
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
export { };
