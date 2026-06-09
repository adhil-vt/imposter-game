/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { getRandomWordPair } from '../data/words';
import type { CategoryKey, WordPair, VisualAid, DifficultyKey } from '../data/words';
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
}

export type GameState = 'HOME' | 'RULES' | 'ABOUT' | 'SETUP' | 'REVEAL' | 'CLUES' | 'VOTING' | 'RESULTS';

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
  kickPlayer: (playerId: string) => void;
  isLobbyAdmin: boolean;
  lobbyAdminId: string;
  toggleMutePlayer: (playerId: string) => void;
  mutedPlayerIds: string[];
  banPlayer: (playerId: string) => void;
  transferHost: (playerId: string) => void;
  updatePlayerName: (newName: string) => void;
  roomNotice: {
    id: string;
    text: string;
  } | null;
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
  const [playersWhoRevealed, setPlayersWhoRevealed] = useState<string[]>([]);
  const [activeClueIndex, setActiveClueIndex] = useState<number>(0);
  const [timerSeconds, setTimerSeconds] = useState<number>(30);
  const [timerActive, setTimerActive] = useState<boolean>(false);

  const [lobbyAdminId, setLobbyAdminId] = useState<string>('');
  const isLobbyAdmin = isMultiplayer ? (onlinePlayers.find(p => p.id === myPlayerId)?.isAdmin || false) : true;
  const [mutedPlayerIds, setMutedPlayerIds] = useState<string[]>([]);
  
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

  // Sync lobby settings across multiplayer network if we are the admin
  useEffect(() => {
    if (isMultiplayer && isLobbyAdmin) {
      multiplayer.send({
        type: 'SETTINGS_UPDATE',
        difficulty,
        selectedCategories,
        impostorKnowsRole,
        randomizeOrder,
        hintsEnabled
      });
    }
  }, [difficulty, selectedCategories, impostorKnowsRole, randomizeOrder, hintsEnabled, isMultiplayer, isLobbyAdmin]);

  // Chat states
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [unreadChatCount, setUnreadChatCount] = useState<number>(0);
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
      setTimerSeconds(30);
      setTimerActive(false);
      setActiveClueIndex(0);

      if (isHost) {
        multiplayer.send({
          type: 'TIMER_SYNC',
          activeClueIndex: 0,
          timerSeconds: 30,
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
      text: text.trim(),
      timestamp: Date.now()
    };
    
    setChatMessages(prev => [...prev, msg]);
    
    if (isMultiplayer) {
      multiplayer.send({
        type: 'CHAT',
        message: msg
      });
    }
  };

  const kickPlayer = (playerId: string) => {
    if (isMultiplayer) {
      if (isHost) {
        const kickedPlayer = onlinePlayers.find(p => p.id === playerId);
        if (kickedPlayer) {
          kickedPlayersRef.current.add(playerId);
          multiplayer.kickPlayer(playerId);
          
          const systemMsg: ChatMessage = {
            id: `sys_${Date.now()}_${Math.random()}`,
            senderId: 'system',
            senderName: 'System',
            senderAvatar: '🤖',
            text: `${kickedPlayer.name} was kicked from the room.`,
            timestamp: Date.now(),
            isSystem: true
          };
          setChatMessages(prev => [...prev, systemMsg]);
          
          multiplayer.send({
            type: 'CHAT',
            message: systemMsg
          });
        }
      } else {
        multiplayer.send({
          type: 'KICK_REQUEST',
          targetId: playerId
        });
      }
    }
  };

  const banPlayer = (playerId: string) => {
    if (isMultiplayer) {
      if (isHost) {
        const bannedPlayer = onlinePlayers.find(p => p.id === playerId);
        if (bannedPlayer) {
          kickedPlayersRef.current.add(playerId);
          multiplayer.banPlayer(playerId);
          
          const systemMsg: ChatMessage = {
            id: `sys_${Date.now()}_${Math.random()}`,
            senderId: 'system',
            senderName: 'System',
            senderAvatar: '🚫',
            text: `${bannedPlayer.name} was banned from the room.`,
            timestamp: Date.now(),
            isSystem: true
          };
          setChatMessages(prev => [...prev, systemMsg]);
          
          multiplayer.send({
            type: 'CHAT',
            message: systemMsg
          });
        }
      } else {
        multiplayer.send({
          type: 'BAN_REQUEST',
          targetId: playerId
        });
      }
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
          senderAvatar: '👑',
          text: `${newAdminName} is now the Lobby Host.`,
          timestamp: Date.now(),
          isSystem: true
        };
        setChatMessages(prev => [...prev, systemMsg]);
        multiplayer.send({
          type: 'CHAT',
          message: systemMsg
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
    if (isMultiplayer) {
      if (isHost) {
        const oldPlayer = onlinePlayers.find(p => p.id === myPlayerId);
        const oldName = oldPlayer?.name || 'Host';
        
        setOnlinePlayers(prev => {
          const next = prev.map(p => p.id === myPlayerId ? { ...p, name: trimmed } : p);
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
          senderAvatar: '✏️',
          text: `${oldName} changed their name to ${trimmed}.`,
          timestamp: Date.now(),
          isSystem: true
        };
        setChatMessages(prev => [...prev, systemMsg]);
        multiplayer.send({
          type: 'CHAT',
          message: systemMsg
        });
      } else {
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
  const kickedPlayersRef = useRef<Set<string>>(new Set());

  useEffect(() => { isChatOpenRef.current = isChatOpen; }, [isChatOpen]);
  useEffect(() => { myPlayerIdRef.current = myPlayerId; }, [myPlayerId]);
  useEffect(() => { onlinePlayersRef.current = onlinePlayers; }, [onlinePlayers]);

  // Play tick sound whenever timerSeconds ticks down in active state
  useEffect(() => {
    if (timerActive && timerSeconds > 0 && timerSeconds < 30) {
      playTick();
    }
  }, [timerSeconds, timerActive]);

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
      setTimerActive(false);
      if (isMultiplayer && isHost) {
        multiplayer.send({
          type: 'TIMER_SYNC',
          activeClueIndex,
          timerSeconds: 0,
          timerActive: false
        });
      }
      playBuzzer();
    }

    return () => {
      if (timerRef) clearTimeout(timerRef);
    };
  }, [timerActive, timerSeconds, isMultiplayer, isHost, activeClueIndex]);

  // Handle incoming network messages
  const handleIncomingMessage = (_senderId: string, msg: NetworkMessage) => {
    switch (msg.type) {
      case 'RENAME_PLAYER':
        if (isHost) {
          const oldPlayer = onlinePlayersRef.current.find(p => p.id === msg.playerId);
          const oldName = oldPlayer?.name || 'Someone';
          const trimmedNewName = msg.name.trim();

          setOnlinePlayers(prev => {
            const next = prev.map(p => p.id === msg.playerId ? { ...p, name: trimmedNewName } : p);
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
            senderAvatar: '✏️',
            text: `${oldName} changed their name to ${trimmedNewName}.`,
            timestamp: Date.now(),
            isSystem: true
          };
          setChatMessages(prev => [...prev, systemMsg]);
          multiplayer.send({
            type: 'CHAT',
            message: systemMsg
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
            multiplayer.send(msg);
          }
        } else {
          setDifficulty(msg.difficulty);
          setSelectedCategories(msg.selectedCategories);
          setImpostorKnowsRole(msg.impostorKnowsRole);
          setRandomizeOrder(msg.randomizeOrder);
          setHintsEnabled(msg.hintsEnabled);
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
            senderAvatar: '👑',
            text: `${newAdminName} is now the Lobby Host.`,
            timestamp: Date.now(),
            isSystem: true
          };
          setChatMessages(prev => [...prev, systemMsg]);
        };

        if (isHost) {
          const sender = onlinePlayersRef.current.find(p => p.id === _senderId);
          if (_senderId === myPlayerId || sender?.isAdmin) {
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
            kickPlayer(msg.targetId);
          }
        }
        break;

      case 'BAN_REQUEST':
        if (isHost) {
          const sender = onlinePlayersRef.current.find(p => p.id === _senderId);
          if (sender?.isAdmin) {
            banPlayer(msg.targetId);
          }
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
        setGameState('SETUP');
        break;

      case 'STATE_CHANGE':
        const stateSender = onlinePlayersRef.current.find(p => p.id === _senderId);
        if (!isHost || stateSender?.isAdmin) {
          setGameState(msg.state as GameState);
        }
        break;

      case 'KICKED':
        leaveRoom();
        showConfirm({
          title: 'Kicked from Room',
          message: 'You have been kicked from the room by the host.',
          confirmText: 'OK',
          onConfirm: () => {}
        });
        break;

      case 'CHAT':
        let appended = false;
        setChatMessages(prev => {
          if (prev.some(m => m.id === msg.message.id)) return prev;

          appended = true;
          if (!isChatOpenRef.current && msg.message.senderId !== myPlayerIdRef.current) {
            setUnreadChatCount(c => c + 1);
            playNotification();
          } else if (msg.message.senderId !== myPlayerIdRef.current) {
            playNotification();
          }

          return [...prev, msg.message];
        });
        if (isHost && appended) {
          multiplayer.send(msg);
        }
        break;

      case 'ROOM_NOTICE':
        pushRoomNotice(msg.text);
        break;
    }
  };

  const handlePlayerJoined = (player: NetworkPlayer) => {
    setOnlinePlayers(prev => {
      const next = prev.some(p => p.id === player.id) ? prev : [...prev, player];
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
      senderAvatar: '🤖',
      text: `${player.name} joined the room.`,
      timestamp: Date.now(),
      isSystem: true
    };
    setChatMessages(prev => [...prev, systemMsg]);
    multiplayer.send({
      type: 'CHAT',
      message: systemMsg
    });
  };

  const handlePlayerDisconnected = (playerId: string) => {
    const wasKicked = kickedPlayersRef.current.has(playerId);
    if (wasKicked) {
      kickedPlayersRef.current.delete(playerId);
    }

    let disconnectedName = 'Someone';
    let nextOnlinePlayers: NetworkPlayer[] = [];
    setOnlinePlayers(prev => {
      const p = prev.find(player => player.id === playerId);
      if (p) disconnectedName = p.name;
      const next = prev.filter(player => player.id !== playerId);
      nextOnlinePlayers = next;
      multiplayer.send({
        type: 'LOBBY_UPDATE',
        players: next
      });
      return next;
    });

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
      senderAvatar: '🤖',
      text: `${disconnectedName} left the room.`,
      timestamp: Date.now(),
      isSystem: true
    };
    setChatMessages(prev => [...prev, systemMsg]);
    pushRoomNotice(`${disconnectedName} left the room.`);
    multiplayer.send({
      type: 'CHAT',
      message: systemMsg
    });
    multiplayer.send({
      type: 'ROOM_NOTICE',
      text: `${disconnectedName} left the room.`
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
      multiplayer.send({
        type: 'GAME_OVER',
        winner: 'CREWMATES',
        voteStats: counts,
        votes: {}
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

  const hostRoom = async (): Promise<string> => {
    setMultiplayerStatus('connecting');
    try {
      const code = await multiplayer.initHost(
        handleIncomingMessage,
        (status) => {
          if (status === 'connected') setMultiplayerStatus('connected');
          if (status === 'disconnected') setMultiplayerStatus('disconnected');
          if (status === 'error') setMultiplayerStatus('error');
        },
        handlePlayerJoined,
        handlePlayerDisconnected
      );
      setIsMultiplayer(true);
      setIsHost(true);
      setRoomCode(code);
      const hostPlayer: NetworkPlayer = {
        id: `host_${Date.now()}`,
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
      setMultiplayerStatus('error');
      throw err;
    }
  };

  const joinRoom = async (code: string, name: string, avatar: string): Promise<void> => {
    setMultiplayerStatus('connecting');
    try {
      await multiplayer.initGuest(
        code,
        name,
        avatar,
        handleIncomingMessage,
        (status) => {
          if (status === 'connected') setMultiplayerStatus('connected');
          if (status === 'disconnected') setMultiplayerStatus('disconnected');
          if (status === 'error') setMultiplayerStatus('error');
        }
      );
      setIsMultiplayer(true);
      setIsHost(false);
      setRoomCode(code);
      setMyPlayerId(multiplayer.myPeerId);
      setMultiplayerStatus('connected');
    } catch (err) {
      setMultiplayerStatus('error');
      throw err;
    }
  };

  const leaveRoom = () => {
    multiplayer.disconnect();
    setIsMultiplayer(false);
    setIsHost(false);
    setRoomCode('');
    setMyPlayerId('');
    setOnlinePlayers([]);
    setPlayersWhoRevealed([]);
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

    multiplayer.send({
      type: 'GAME_OVER',
      winner: gameWinner,
      voteStats: counts,
      votes: finalVotes
    });
  };

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
    if (isMultiplayer && !isHost) {
      multiplayer.send({ type: 'START_GAME_REQUEST' });
      return;
    }
    playClick();
    // 1. Select word pair
    const recentCommonWords = history.map(h => h.commonWord);
    const { pair, chosenCategory: cat } = getRandomWordPair(selectedCategories, difficulty, customWordPairs, recentCommonWords);
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
            activePlayerVisualAid: visualAid
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
          if (next.length === onlinePlayers.length) {
            setGameState('CLUES');
            setTimerSeconds(30);
            setTimerActive(false);
            setActiveClueIndex(0);
            multiplayer.send({
              type: 'TIMER_SYNC',
              activeClueIndex: 0,
              timerSeconds: 30,
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
        setGameState('SETUP');
        multiplayer.send({
          type: 'PLAY_AGAIN'
        });
      }
    } else {
      startGame();
    }
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
        roomCode,
        myPlayerId,
        multiplayerStatus,
        onlinePlayers,
        playersWhoRevealed,
        activeClueIndex,
        setActiveClueIndex,
        timerSeconds,
        setTimerSeconds,
        timerActive,
        setTimerActive,
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
        roomNotice,
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
