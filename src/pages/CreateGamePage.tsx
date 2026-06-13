import React, { useState, useEffect, useRef } from 'react';
import { useGame, AVATAR_POOL } from '../context/GameContext';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { playClick } from '../utils/sounds';
import { renderAvatarIcon } from '../utils/avatarHelper';
import type { CategoryKey, DifficultyKey } from '../data/words';
import { 
  Users, 
  Sparkles, 
  Shuffle, 
  Coffee, 
  Globe, 
  UserPlus,
  UserMinus,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  Clock,
  Eye,
  EyeOff,
  Settings,
  Trash2,
  Plus,
  HelpCircle,
  Gauge,
  Box,
  BookOpen,
  Laugh,
  Tv,
  Music,
  Trophy,
  Smartphone,
  TreePine,
  Palette,
  Heart,
  Briefcase,
  Car,
  MapPin,
  Gamepad2,
  Flame,
  Copy,
  Send,
  MessageSquare,
  Pencil,
  Wifi,
  ShieldAlert,
  Shield,
  MoreVertical,
  X,
  Mic,
  MicOff,
  Radio
} from 'lucide-react';

export const CreateGamePage: React.FC = () => {
  const {
    playerCount,
    setPlayerCount,
    selectedCategories,
    setSelectedCategories,
    difficulty,
    setDifficulty,
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
    clueTimerLimit,
    setClueTimerLimit,
    customWordPairs,
    addCustomWordPair,
    deleteCustomWordPair,
    startGame,
    resetGame,
    isMultiplayer,
    isHost,
    isSpectating,
    activeGameState,
    roomCode,
    myPlayerId,
    onlinePlayers,
    playerPings,
    kickVotes,
    banVotes,
    leaveRoom,
    isLobbyAdmin,
    mutedPlayerIds,
    chatMessages,
    sendChatMessage,
    unreadChatCount,
    setUnreadChatCount,
    updatePlayerName,
    kickPlayer,
    banPlayer,
    lobbyAdminId,
    toggleMutePlayer,
    transferHost,
    playersSpeaking,
    playersVolume,
    isVoiceActive,
    toggleVoice,
    micVolume,
    setMicVolume,
    speakerVolume,
    setSpeakerVolume,
    geminiApiKey,
    setGeminiApiKey,
  } = useGame();

  const [copied, setCopied] = useState(false);
  const [activeAvatarPicker, setActiveAvatarPicker] = useState<number | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState<boolean>(false);
  const [newCommonWord, setNewCommonWord] = useState<string>('');
  const [newImpostorWord, setNewImpostorWord] = useState<string>('');
  const [customWordError, setCustomWordError] = useState<string>('');
  const [customInputVal, setCustomInputVal] = useState<string>(String(clueTimerLimit));
  const [apiKeyInput, setApiKeyInput] = useState<string>(geminiApiKey);

  // Host lobby moderation state
  type HostActionMode = 'menu' | 'kick' | 'ban';
  const [hostActionTarget, setHostActionTarget] = useState<{ id: string; name: string; avatar: string } | null>(null);
  const [hostActionMode, setHostActionMode] = useState<HostActionMode>('menu');
  const [hostActionReason, setHostActionReason] = useState<string>('');

  useEffect(() => {
    setCustomInputVal(String(clueTimerLimit));
  }, [clueTimerLimit]);
  const [chatInput, setChatInput] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'voice'>('chat');
  const [isEditingName, setIsEditingName] = useState(false);
  const [editingNameVal, setEditingNameVal] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const [showScrollButton, setShowScrollButton] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const lobbyChat = document.getElementById('lobby-chat');
      if (lobbyChat) {
        const rect = lobbyChat.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
          setShowScrollButton(false);
          setUnreadChatCount(0);
        } else {
          setShowScrollButton(true);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setUnreadChatCount]);

  const handleCopyCode = () => {
    playClick();
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const categoriesList: { key: Exclude<CategoryKey, 'Mixed'>; label: string; icon: React.ReactNode; color: string }[] = [
    { key: 'Animals', label: 'Animals', icon: <Sparkles className="w-4 h-4" />, color: 'from-green-500/20 to-emerald-500/10 text-emerald-400' },
    { key: 'Food', label: 'Food', icon: <Coffee className="w-4 h-4" />, color: 'from-amber-500/20 to-orange-500/10 text-amber-400' },
    { key: 'Objects & Things', label: 'Objects & Things', icon: <Box className="w-4 h-4" />, color: 'from-cyan-500/20 to-blue-500/10 text-cyan-400' },
    { key: 'School & Learning', label: 'School & Learning', icon: <BookOpen className="w-4 h-4" />, color: 'from-indigo-500/20 to-violet-500/10 text-indigo-400' },
    { key: 'Silly & Random', label: 'Silly & Random', icon: <Laugh className="w-4 h-4" />, color: 'from-pink-500/20 to-rose-500/10 text-pink-400' },
    { key: 'Geography (Countries & Cities)', label: 'Geography', icon: <Globe className="w-4 h-4" />, color: 'from-teal-500/20 to-emerald-500/10 text-teal-400' },
    { key: 'Movies & TV', label: 'Movies & TV', icon: <Tv className="w-4 h-4" />, color: 'from-purple-500/20 to-fuchsia-500/10 text-purple-400' },
    { key: 'Music & Entertainment', label: 'Music & Show', icon: <Music className="w-4 h-4" />, color: 'from-rose-500/20 to-red-500/10 text-rose-400' },
    { key: 'Sports & Games', label: 'Sports & Games', icon: <Trophy className="w-4 h-4" />, color: 'from-yellow-500/20 to-amber-500/10 text-yellow-400' },
    { key: 'Technology & Gadgets', label: 'Tech & Gadgets', icon: <Smartphone className="w-4 h-4" />, color: 'from-blue-500/20 to-cyan-500/10 text-blue-400' },
    { key: 'Nature & Outdoors', label: 'Nature & Wild', icon: <TreePine className="w-4 h-4" />, color: 'from-emerald-500/20 to-green-500/10 text-emerald-400' },
    { key: 'Colors & Shapes', label: 'Colors & Shapes', icon: <Palette className="w-4 h-4" />, color: 'from-fuchsia-500/20 to-pink-500/10 text-fuchsia-400' },
    { key: 'Emotions & Feelings', label: 'Emotions', icon: <Heart className="w-4 h-4" />, color: 'from-red-500/20 to-rose-500/10 text-red-400' },
    { key: 'Jobs & Professions', label: 'Professions', icon: <Briefcase className="w-4 h-4" />, color: 'from-slate-500/20 to-zinc-500/10 text-slate-300' },
    { key: 'Vehicles & Transportation', label: 'Vehicles', icon: <Car className="w-4 h-4" />, color: 'from-sky-500/20 to-blue-500/10 text-sky-400' },
    { key: 'Places (Landmarks & Locations)', label: 'Places & Landmarks', icon: <MapPin className="w-4 h-4" />, color: 'from-orange-500/20 to-amber-500/10 text-orange-400' },
    { key: 'Video Games & Internet Culture', label: 'Games & Internet', icon: <Gamepad2 className="w-4 h-4" />, color: 'from-violet-500/20 to-indigo-500/10 text-violet-400' },
    { key: 'Fantasy & Mythical Creatures', label: 'Fantasy & Myths', icon: <Flame className="w-4 h-4" />, color: 'from-amber-600/20 to-orange-600/10 text-orange-500' }
  ];

  const handleNameChange = (index: number, value: string) => {
    const nextNames = [...customNames];
    nextNames[index] = value;
    setCustomNames(nextNames);
  };

  const handleAvatarChange = (index: number, emoji: string) => {
    playClick();
    const nextAvatars = [...customAvatars];
    nextAvatars[index] = emoji;
    setCustomAvatars(nextAvatars);
  };

  const resetNames = () => {
    playClick();
    setCustomNames(Array(16).fill('').map((_, i) => `Player ${i + 1}`));
    setCustomAvatars(Array(16).fill(null).map((_, i) => AVATAR_POOL[i % AVATAR_POOL.length]));
  };

  const selectPlayerCount = (num: number) => {
    playClick();
    setPlayerCount(num);
  };

  const handleAddCustomPair = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomWordError('');
    
    if (!newCommonWord.trim() || !newImpostorWord.trim()) {
      setCustomWordError('Both fields are required!');
      return;
    }

    if (newCommonWord.trim().toLowerCase() === newImpostorWord.trim().toLowerCase()) {
      setCustomWordError('Words cannot be identical!');
      return;
    }

    const success = addCustomWordPair(newCommonWord, newImpostorWord);
    if (success) {
      setNewCommonWord('');
      setNewImpostorWord('');
    }
  };

  const isCustomCategoryEmpty = selectedCategories.includes('Custom') && selectedCategories.length === 1 && customWordPairs.length === 0;

  const getActiveGameStatus = () => {
    switch (activeGameState) {
      case 'REVEAL':
        return {
          title: 'Reveal Phase',
          desc: 'Players are currently checking their secret words. Keep it quiet!',
          icon: <Eye className="w-5 h-5 text-brand-primary animate-pulse" />,
          color: 'border-brand-primary/30 bg-brand-primary/5 text-brand-primary'
        };
      case 'CLUES':
        return {
          title: 'Clue Sharing Phase',
          desc: 'Players are taking turns giving clues about their words. Listen closely!',
          icon: <Clock className="w-5 h-5 text-brand-secondary animate-spin-slow" />,
          color: 'border-brand-secondary/30 bg-brand-secondary/5 text-brand-secondary'
        };
      case 'VOTING':
        return {
          title: 'Voting Phase',
          desc: 'Players are voting to catch the Impostor. Who seems sus?',
          icon: <ShieldAlert className="w-5 h-5 text-brand-danger animate-bounce" />,
          color: 'border-brand-danger/30 bg-brand-danger/5 text-brand-danger'
        };
      case 'RESULTS':
        return {
          title: 'Results Phase',
          desc: 'The round has concluded. Check out who won!',
          icon: <Trophy className="w-5 h-5 text-yellow-400" />,
          color: 'border-yellow-500/30 bg-yellow-500/5 text-yellow-400'
        };
      default:
        return {
          title: 'Match in Progress',
          desc: 'The game is currently active. Waiting for the next round...',
          icon: <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />,
          color: 'border-indigo-500/30 bg-indigo-500/5 text-indigo-400'
        };
    }
  };

  const handleSaveName = () => {
    if (editingNameVal.trim()) {
      updatePlayerName(editingNameVal.trim());
    }
    setIsEditingName(false);
  };

  const playersRosterCard = (
    <Card className="p-6 border-white/5 bg-brand-card/50 flex flex-col">
      <div className="flex justify-between items-center mb-3">
        <label className="text-sm font-bold text-slate-400 tracking-wider uppercase flex items-center gap-2 flex-wrap">
          <UserPlus className="w-4 h-4 text-cyan-400" />
          <span>{isMultiplayer ? `Lobby Players (${onlinePlayers.length})` : 'Players & Avatars'}</span>
          {isSpectating && (
            <span className="text-[9px] bg-brand-warning/10 border border-brand-warning/30 text-brand-warning px-2 py-0.5 rounded-full font-black animate-pulse uppercase tracking-wider select-none shrink-0">
              Spectating
            </span>
          )}
        </label>
        {!isMultiplayer && (
          <button 
            onClick={resetNames}
            className="text-xs text-slate-500 hover:text-brand-secondary flex items-center gap-1 font-semibold transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reset Config
          </button>
        )}
      </div>

      <div className={`grid ${isMultiplayer ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'} gap-3 ${isMultiplayer ? 'max-h-[160px]' : 'max-h-[220px]'} overflow-y-auto pr-1 mt-2`}>
        {isMultiplayer ? (
          // Online Lobby Players Display
          onlinePlayers.map((player) => (
            <div 
              key={player.id} 
              onClick={() => {
                if (player.id === myPlayerId) {
                  playClick();
                  setEditingNameVal(player.name);
                  setIsEditingName(true);
                }
              }}
              className={`flex items-center justify-between bg-white/[0.02] border border-white/5 p-3 rounded-xl transition-all duration-300 ${player.id === myPlayerId ? 'hover:bg-white/[0.04] cursor-pointer' : ''}`}
            >
              <div className="flex items-center gap-2.5">
                {(() => {
                  const vol = playersVolume[player.id] || 0;
                  const ring = playersSpeaking[player.id] ? `ring-2 ring-emerald-400` : '';
                  const glow = playersSpeaking[player.id] ? { boxShadow: `0 0 ${8 + vol * 24}px rgba(52,211,153,${0.15 + vol * 0.6})` } : {};
                  return (
                    <span style={glow} className={`w-9 h-9 rounded-xl bg-white/5 border flex items-center justify-center text-lg shadow-sm transition-all duration-300 ${ring} ${playersSpeaking[player.id] ? 'border-emerald-400 animate-pulse' : 'border-white/10'}`}>
                      {player.avatar}
                    </span>
                  );
                })()}
                {player.id === myPlayerId ? (
                  isEditingName ? (
                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        maxLength={14}
                        value={editingNameVal}
                        onChange={(e) => setEditingNameVal(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSaveName();
                          } else if (e.key === 'Escape') {
                            setIsEditingName(false);
                          }
                        }}
                        autoFocus
                        className="bg-white/5 text-sm font-bold text-white border border-white/10 rounded-lg px-2 py-0.5 focus:outline-none focus:border-brand-primary w-24 sm:w-32"
                      />
                      <button
                        onClick={handleSaveName}
                        className="px-2 py-1 bg-brand-primary hover:bg-brand-primary/90 text-white text-[10px] font-black rounded-lg transition-colors cursor-pointer select-none"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setIsEditingName(false)}
                        className="px-2 py-1 bg-white/10 hover:bg-white/15 text-slate-300 text-[10px] font-black rounded-lg transition-colors cursor-pointer select-none"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <span 
                      className="text-sm font-bold text-slate-200 flex items-center gap-1.5 hover:text-white transition-colors"
                      title="Click to rename"
                    >
                      {player.name}
                      <span className="text-[10px] text-slate-500 font-bold italic">(You)</span>
                      <Pencil className="w-3.5 h-3.5 text-slate-400 hover:text-brand-secondary transition-colors" />
                    </span>
                  )
                ) : (
                  <span className="text-sm font-bold text-slate-200">
                    {player.name}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 select-none">
                {player.isVoiceActive && (
                  <span 
                    className={`text-[9px] border px-1.5 py-0.5 rounded-full font-black flex items-center gap-1 leading-none shrink-0 transition-all duration-300 ${
                      playersSpeaking[player.id]
                        ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.15)]'
                        : 'text-slate-400 bg-white/5 border-white/10'
                    }`} 
                    title={playersSpeaking[player.id] ? "Speaking" : "In Voice Chat"}
                  >
                    <Mic className={`w-2.5 h-2.5 shrink-0 ${playersSpeaking[player.id] ? 'animate-bounce' : ''}`} />
                    <span>{playersSpeaking[player.id] ? 'Speaking' : 'Voice'}</span>
                  </span>
                )}
                {isMultiplayer && (() => {
                  const kVotes = kickVotes[player.id]?.length || 0;
                  const bVotes = banVotes[player.id]?.length || 0;
                  if (kVotes === 0 && bVotes === 0) return null;
                  
                  return (
                    <div className="flex items-center gap-1 select-none shrink-0">
                      {kVotes > 0 && (
                        <span className="text-[9px] bg-brand-primary/10 border border-brand-primary/25 text-brand-primary px-1.5 py-0.5 rounded font-black uppercase tracking-wider flex items-center gap-0.5" title="Votes to kick">
                          <UserMinus className="w-2.5 h-2.5" />
                          {kVotes}
                        </span>
                      )}
                      {bVotes > 0 && (
                        <span className="text-[9px] bg-brand-danger/10 border border-brand-danger/25 text-brand-danger px-1.5 py-0.5 rounded font-black uppercase tracking-wider flex items-center gap-0.5" title="Votes to ban">
                          <ShieldAlert className="w-2.5 h-2.5" />
                          {bVotes}
                        </span>
                      )}
                    </div>
                  );
                })()}

                {(() => {
                  const pingVal = player.isHost || player.isAdmin
                    ? (isHost ? 0 : playerPings[`imposter-${roomCode}`])
                    : playerPings[player.id];
                  
                  if (pingVal === undefined) return null;
                  
                  let badgeColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
                  if (pingVal > 150) {
                    badgeColor = 'text-rose-400 bg-rose-500/10 border-rose-500/20';
                  } else if (pingVal > 80) {
                    badgeColor = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
                  }
                  
                  return (
                    <span className={`text-[9px] border px-1.5 py-0.5 rounded-full font-black flex items-center gap-0.5 leading-none shrink-0 ${badgeColor}`} title="Network Latency">
                      <Wifi className="w-2.5 h-2.5 shrink-0" />
                      {pingVal === 0 ? 'Local' : `${pingVal}ms`}
                    </span>
                  );
                })()}

                {/* Host-only moderation button */}
                {isHost && player.id !== myPlayerId && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playClick();
                      setHostActionTarget({ id: player.id, name: player.name, avatar: player.avatar });
                      setHostActionMode('menu');
                      setHostActionReason('');
                    }}
                    className="p-1 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:bg-white/15 hover:text-white transition-all cursor-pointer shrink-0"
                    title="Player options"
                  >
                    <MoreVertical className="w-3.5 h-3.5" />
                  </button>
                )}

                {player.isAdmin ? (
                  <span className="text-[9px] bg-brand-primary/20 border border-brand-primary/30 text-brand-primary px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider animate-pulse shrink-0">
                    Host
                  </span>
                ) : (
                  <span className="text-[9px] bg-white/5 border border-white/10 text-slate-500 px-2 py-0.5 rounded-full font-bold uppercase shrink-0">
                    Player
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          // Offline Player Configuration Cards
          Array(playerCount).fill(null).map((_, idx) => (
            <div key={idx} className="relative">
              <div 
                className="flex items-center gap-2 bg-white/[0.02] border border-white/5 p-2 rounded-xl focus-within:border-brand-primary/45 transition-colors"
              >
                {/* Avatar Picker Button */}
                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    setActiveAvatarPicker(activeAvatarPicker === idx ? null : idx);
                  }}
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center text-lg active:scale-95 transition-all"
                  title="Click to change avatar"
                >
                  {customAvatars[idx] || '🦊'}
                </button>

                <input
                  type="text"
                  maxLength={14}
                  value={customNames[idx] || ''}
                  onChange={(e) => handleNameChange(idx, e.target.value)}
                  placeholder={`Player ${idx + 1}`}
                  className="bg-transparent text-sm font-bold text-slate-200 w-full focus:outline-none placeholder-slate-600"
                />
              </div>

              {/* Inline Popover Selector for Avatars */}
              {activeAvatarPicker === idx && (
                <div className="absolute top-12 left-0 right-0 z-30 p-3.5 rounded-2xl glass-panel border border-brand-primary/25 bg-brand-dark/95 shadow-2xl">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">
                    <span>Select Avatar</span>
                    <button 
                      onClick={() => setActiveAvatarPicker(null)} 
                      className="text-slate-400 hover:text-brand-danger"
                    >
                      Close
                    </button>
                  </div>
                  <div className="grid grid-cols-6 gap-1.5 max-h-[120px] overflow-y-auto pr-1">
                    {AVATAR_POOL.map(emoji => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => {
                          handleAvatarChange(idx, emoji);
                          setActiveAvatarPicker(null);
                        }}
                        className={`w-9 h-9 flex items-center justify-center text-lg rounded-xl hover:bg-white/10 active:scale-90 transition-all ${
                          customAvatars[idx] === emoji ? 'bg-brand-primary/20 border border-brand-primary/30' : ''
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </Card>
  );

  const lobbyChatCard = (
    <Card id="lobby-chat" className="p-5 border-white/5 bg-brand-card/45 flex flex-col h-[350px] justify-between">
      {/* Header Tabs */}
      <div className="flex border-b border-white/5 bg-brand-dark/10 select-none -mx-5 -mt-5 rounded-t-2xl overflow-hidden shrink-0">
        <button
          type="button"
          onClick={() => { playClick(); setActiveTab('chat'); }}
          className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer ${
            activeTab === 'chat'
              ? 'border-brand-primary text-white bg-white/[0.02]'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5 text-brand-secondary" />
          Text Chat
        </button>
        <button
          type="button"
          onClick={() => { playClick(); setActiveTab('voice'); }}
          className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer ${
            activeTab === 'voice'
              ? 'border-brand-primary text-white bg-white/[0.02]'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          <Radio className="w-3.5 h-3.5 text-brand-primary" />
          Voice Chat
          {isVoiceActive && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.5)]" />
          )}
        </button>
      </div>

      {activeTab === 'chat' ? (
        <>
          {/* Messages list */}
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto py-3 pr-1 flex flex-col gap-3 custom-scrollbar">
            {chatMessages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40 p-4 select-none h-full">
                <MessageSquare className="w-8 h-8 text-slate-500 mb-2 stroke-[1.5]" />
                <span className="text-xs font-bold text-slate-400">No messages yet</span>
                <span className="text-[10px] text-slate-500 mt-0.5">Start typing to talk with other players!</span>
              </div>
            ) : (
              chatMessages
                .filter(msg => !mutedPlayerIds.includes(msg.senderId) && (!msg.chatScope || msg.chatScope === 'lobby'))
                .map((msg) => {
                  if (msg.isSystem) {
                    return (
                      <div
                        key={msg.id}
                        className="self-center bg-white/[0.02] border border-dashed border-white/10 rounded-xl px-3.5 py-1.5 text-[9px] text-slate-500 font-extrabold max-w-[85%] text-center animate-fade-in-up"
                      >
                        {msg.text}
                      </div>
                    );
                  }

                  const isMe = msg.senderId === myPlayerId;
                  const formatTime = (ts: number) => {
                    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  };

                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-2 max-w-[85%] animate-fade-in-up ${
                        isMe ? 'self-end flex-row-reverse' : 'self-start'
                      }`}
                    >
                      <span className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-sm shadow-sm select-none shrink-0 self-end">
                        {renderAvatarIcon(msg.senderAvatar)}
                      </span>
                      <div className={`flex flex-col min-w-0 ${isMe ? 'items-end' : 'items-start'}`}>
                        <div className="flex items-center gap-1 text-[8px] text-slate-500 font-extrabold mb-0.5 select-none">
                          <span>{msg.senderName}</span>
                          <span>&bull;</span>
                          <span>{formatTime(msg.timestamp)}</span>
                        </div>
                        <div
                          className={`px-3 py-2 rounded-xl text-xs break-words shadow-sm font-semibold select-text ${
                            isMe
                              ? 'bg-gradient-to-tr from-brand-secondary/80 to-brand-secondary border border-brand-secondary/20 text-white rounded-br-none'
                              : 'bg-white/5 border border-white/10 text-slate-200 rounded-bl-none'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  );
                })
            )}
          </div>

          {/* Form */}
          {(() => {
            const myOnlinePlayer = onlinePlayers.find(p => p.id === myPlayerId);
            const isRestricted = myOnlinePlayer?.isMuted || false;
            return (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!chatInput.trim() || isRestricted) return;
                  playClick();
                  sendChatMessage(chatInput);
                  setChatInput('');
                }}
                className="border-t border-white/5 pt-3 flex items-center gap-2 select-none"
              >
                <input
                  type="text"
                  maxLength={60}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  disabled={isRestricted}
                  placeholder={isRestricted ? "You are restricted from chatting by host" : "Type a message... (max 60 chars)"}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold text-slate-200 focus:outline-none focus:border-brand-secondary placeholder-slate-600 disabled:opacity-50 disabled:pointer-events-none"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim() || isRestricted}
                  className="p-2 rounded-xl bg-brand-secondary border border-brand-secondary text-white hover:scale-105 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-md shadow-brand-secondary/10 flex items-center justify-center cursor-pointer"
                  title="Send Message"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            );
          })()}
        </>
      ) : (
        /* Voice Panel */
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto pt-4 gap-4 custom-scrollbar">
          {/* Join/Leave Button */}
          <div className="flex flex-col gap-1.5 shrink-0">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block select-none">
              Voice Channel Status
            </span>
            <button
              type="button"
              onClick={() => toggleVoice()}
              className={`w-full py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-98 ${
                isVoiceActive
                  ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/40 shadow-rose-500/5'
                  : 'bg-brand-primary border border-brand-primary text-white hover:scale-[1.01] shadow-brand-primary/10'
              }`}
            >
              {isVoiceActive ? (
                <>
                  <MicOff className="w-3.5 h-3.5" />
                  Disconnect Voice Chat
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5 animate-pulse" />
                  Connect Voice Chat
                </>
              )}
            </button>
          </div>

          {isVoiceActive ? (
            <>
              {/* Sliders Container */}
              <div className="flex flex-col gap-3 bg-white/[0.01] border border-white/5 p-3 rounded-xl shrink-0">
                {/* Microphone Gain slider */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-[11px] select-none">
                    <span className="font-bold text-slate-300 flex items-center gap-1.5">
                      <Mic className="w-3 h-3 text-brand-primary" />
                      Microphone Gain
                    </span>
                    <span className="font-extrabold text-[10px] text-slate-500">
                      {Math.round(micVolume * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1.5"
                    step="0.05"
                    value={micVolume}
                    onChange={(e) => setMicVolume(parseFloat(e.target.value))}
                    className="w-full accent-brand-primary bg-white/5 h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Speaker Volume slider */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-[11px] select-none">
                    <span className="font-bold text-slate-300 flex items-center gap-1.5">
                      <Volume2 className="w-3 h-3 text-brand-secondary" />
                      Speaker Volume
                    </span>
                    <span className="font-extrabold text-[10px] text-slate-500">
                      {Math.round(speakerVolume * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={speakerVolume}
                    onChange={(e) => setSpeakerVolume(parseFloat(e.target.value))}
                    className="w-full accent-brand-secondary bg-white/5 h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Active Participants List */}
              <div className="flex flex-col gap-1.5 min-h-0 flex-1">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block select-none">
                  Active in Channel
                </span>
                <div className="flex flex-col gap-1.5 overflow-y-auto pr-1 flex-1 max-h-[85px] custom-scrollbar">
                  {onlinePlayers.map((player) => {
                    const isMe = player.id === myPlayerId;
                    const isSpeaking = isMe ? false : !!playersSpeaking[player.id];

                    return (
                      <div
                        key={player.id}
                        className="flex items-center justify-between p-2 rounded-xl bg-white/[0.01] border border-white/5 select-none"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {(() => {
                            const vol = playersVolume[player.id] || 0;
                            const glow = isSpeaking ? { boxShadow: `0 0 ${6 + vol * 20}px rgba(52,211,153,${0.12 + vol * 0.6})` } : {};
                            return (
                              <div style={glow} className={`relative transition-shadow duration-300 w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs shrink-0 ${isSpeaking ? 'ring-2 ring-emerald-400 animate-pulse' : ''}`}>
                                {player.avatar}
                              </div>
                            );
                          })()}
                          <span className="text-[11px] font-bold text-slate-200 truncate">
                            {player.name}
                            {isMe && <span className="text-[9px] text-slate-500 font-bold ml-1 italic">(You)</span>}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {player.isVoiceActive ? (
                            isSpeaking ? (
                              <span className="text-[8px] bg-emerald-400/10 border border-emerald-500/25 text-emerald-400 px-1.5 py-0.5 rounded font-black uppercase tracking-wider flex items-center gap-0.5 animate-pulse">
                                <Radio className="w-2 h-2 shrink-0" />
                                Speaking
                              </span>
                            ) : (
                              <span className="text-[8px] bg-white/5 border border-white/10 text-slate-400 px-1.5 py-0.5 rounded font-black uppercase tracking-wider flex items-center gap-0.5">
                                <Mic className="w-2 h-2 shrink-0 text-slate-500" />
                                Active
                              </span>
                            )
                          ) : (
                            <span className="text-[8px] bg-white/[0.01] border border-dashed border-white/5 text-slate-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-0.5">
                              <MicOff className="w-2 h-2 shrink-0 text-slate-700" />
                              Offline
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40 p-4 select-none">
              <Radio className="w-8 h-8 text-slate-500 mb-2 stroke-[1.5] animate-pulse" />
              <span className="text-xs font-bold text-slate-400">Voice is Disconnected</span>
              <span className="text-[10px] text-slate-500 mt-0.5">Connect to speak with players in real-time!</span>
            </div>
          )}
        </div>
      )}
    </Card>
  );

  return (
    <div className="w-full my-auto flex flex-col items-center px-4 sm:px-6 py-6 relative">
      <div className={`w-full ${isMultiplayer ? 'max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-6' : 'max-w-lg flex flex-col gap-6'} z-10`}>
        
        {/* Settings Column */}
        <div className="flex flex-col gap-6">
          {/* Title */}
          <div className="text-center">
            {isMultiplayer ? (
              <div className="flex flex-col items-center">
                <h2 className="text-3xl font-black text-white tracking-wide">
                  Multiplayer Lobby
                </h2>
                <button 
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-2.5 mt-3 px-4 py-2 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 text-slate-200 text-sm font-extrabold cursor-pointer active:scale-95 transition-all select-none hover:bg-brand-primary/15"
                >
                  <Users className="w-4 h-4 text-brand-primary" />
                  <span>Room Code: <strong className="text-brand-primary text-base tracking-wider">{roomCode}</strong></span>
                  {copied ? (
                    <span className="text-[10px] text-brand-accent uppercase font-black">Copied!</span>
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                  )}
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-black text-white tracking-wide">
                  Game Setup
                </h2>
                <p className="text-sm text-slate-400 mt-1">Customize details before beginning</p>
              </>
            )}
          </div>

          {isSpectating && (() => {
            const status = getActiveGameStatus();
            return (
              <Card className={`p-5 border-2 ${status.color} animate-fade-in-up flex items-start gap-4 shadow-xl shadow-black/30`}>
                <div className="p-3 bg-white/5 border border-white/10 rounded-2xl shadow-inner shrink-0">
                  {status.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-black tracking-wide flex items-center gap-2">
                    {status.title}
                    <span className="text-[9px] bg-white/10 border border-white/20 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider animate-pulse">
                      Live
                    </span>
                  </h3>
                  <p className="text-xs font-semibold text-slate-300 mt-1 leading-relaxed">
                    {status.desc}
                  </p>
                  <div className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Waiting in lobby...
                  </div>
                </div>
              </Card>
            );
          })()}

          {/* Player Count Selection (Local Only) */}
          {!isMultiplayer && (
            <Card className="p-6 border-white/5 bg-brand-card/50">
              <label className="text-sm font-bold text-slate-400 tracking-wider uppercase mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-brand-primary" />
                Number of Players
              </label>
              <div className="grid grid-cols-5 gap-2 mt-2">
                {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
                  <button
                    key={num}
                    onClick={() => selectPlayerCount(num)}
                    className={`py-2.5 rounded-xl font-bold transition-all duration-300 border ${
                      playerCount === num
                        ? 'bg-brand-primary border-brand-primary text-white shadow-lg shadow-brand-primary/25'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </Card>
          )}

          {/* Difficulty Selection */}
          <Card className="p-6 border-white/5 bg-brand-card/50">
            <label className="text-sm font-bold text-slate-400 tracking-wider uppercase mb-3 flex items-center gap-2">
              <Gauge className="w-4 h-4 text-brand-secondary" />
              Difficulty Level {!isLobbyAdmin && <span className="text-[10px] text-slate-500 font-semibold">(Set by Host)</span>}
            </label>
            <div className="grid grid-cols-3 gap-2.5 mt-2">
              {[
                { key: 'easy', label: 'Smooth Brain', sublabel: 'Easy Mode', emoji: '🧠', color: 'from-green-500/20 to-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:border-emerald-500/40' },
                { key: 'medium', label: 'Sweaty Casual', sublabel: 'Medium Mode', emoji: '💦', color: 'from-amber-500/20 to-orange-500/10 text-amber-400 border-amber-500/20 hover:border-amber-500/40' },
                { key: 'hard', label: "Einstein's Nightmare", sublabel: 'Hard Mode', emoji: '🤯', color: 'from-rose-500/20 to-pink-500/10 text-rose-400 border-rose-500/20 hover:border-rose-500/40' }
              ].map(level => {
                const isActive = difficulty === level.key;
                return (
                  <button
                    key={level.key}
                    disabled={!isLobbyAdmin}
                    onClick={() => {
                      playClick();
                      setDifficulty(level.key as DifficultyKey);
                    }}
                    className={`flex flex-col items-center justify-between p-3 rounded-2xl border bg-gradient-to-b transition-all duration-300 min-h-[105px] ${
                      !isLobbyAdmin ? 'cursor-default' : 'cursor-pointer select-none'
                    } ${
                      isActive 
                        ? 'border-white/30 text-white shadow-lg bg-white/10 scale-[1.02]' 
                        : `bg-brand-card/30 ${level.color} ${!isLobbyAdmin ? 'opacity-30' : ''}`
                    }`}
                  >
                    <span className="text-2xl mb-1">{level.emoji}</span>
                    <span className="text-xs font-black text-center leading-tight">{level.label}</span>
                    <span className="text-[9px] opacity-60 font-semibold mt-1">{level.sublabel}</span>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Category Selection Summary Card */}
          <Card className="p-6 border-white/5 bg-brand-card/50">
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-bold text-slate-400 tracking-wider uppercase flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-secondary" />
                Game Themes & Categories {!isLobbyAdmin && <span className="text-[10px] text-slate-500 font-semibold">(Set by Host)</span>}
              </label>
              <span className="text-[10px] bg-brand-primary/25 text-brand-primary px-2.5 py-0.5 rounded-full font-extrabold uppercase border border-brand-primary/30">
                {selectedCategories.includes('Mixed') 
                  ? 'All Selected' 
                  : `${selectedCategories.filter(c => c !== 'Custom').length} Selected`}
              </span>
            </div>

            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col gap-4">
              <div className="flex flex-wrap gap-1.5 max-h-[85px] overflow-y-auto pr-1">
                {selectedCategories.includes('Mixed') ? (
                  <span className="px-3 py-1.5 rounded-xl text-xs font-black bg-brand-primary/10 border border-brand-primary/20 text-brand-primary flex items-center gap-1.5">
                    <Shuffle className="w-3.5 h-3.5 animate-spin-slow" />
                    Mixed Mode Active (All Categories)
                  </span>
                ) : selectedCategories.filter(c => c !== 'Custom').length === 0 ? (
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider py-1.5 px-2">
                    No theme selected
                  </span>
                ) : (
                  selectedCategories
                    .filter(catKey => catKey !== 'Custom' && catKey !== 'Mixed')
                    .map(catKey => {
                      const info = categoriesList.find(c => c.key === catKey);
                      if (!info) return null;
                      return (
                        <span 
                          key={catKey}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white/5 border border-white/10 text-slate-300 flex items-center gap-1.5"
                        >
                          {info.icon}
                          {info.label}
                        </span>
                      );
                    })
                )}
              </div>

              {isLobbyAdmin && (
                <Button
                  variant="primary-glass"
                  onClick={() => {
                    playClick();
                    setIsCategoryModalOpen(true);
                  }}
                  className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 text-brand-primary hover:text-brand-primary/90 shadow-md shadow-brand-primary/5 cursor-pointer"
                >
                  <Settings className="w-4 h-4" />
                  Choose Categories & Themes
                </Button>
              )}
            </div>

            {/* Custom Words Toggle Switch (Local/Host Only) */}
            {isLobbyAdmin && (
              <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-yellow-400" />
                    Include Custom Word Pool
                  </span>
                  <span className="text-xs text-slate-500 max-w-[280px]">
                    Mix in your privately created word pairs during play
                  </span>
                </div>
                <button
                  onClick={() => {
                    playClick();
                    const isCustomActive = selectedCategories.includes('Custom');
                    if (isCustomActive) {
                      setSelectedCategories(selectedCategories.filter(c => c !== 'Custom'));
                    } else {
                      setSelectedCategories([...selectedCategories, 'Custom']);
                    }
                  }}
                  className={`w-12 h-6 rounded-full transition-colors relative border border-white/10 ${
                    selectedCategories.includes('Custom') ? 'bg-yellow-500 border-yellow-500' : 'bg-white/5'
                  }`}
                >
                  <span 
                    className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white transition-all duration-300 ${
                      selectedCategories.includes('Custom') ? 'left-[25px]' : 'left-[3px]'
                    }`}
                  />
                </button>
              </div>
            )}
          </Card>

          {/* Custom Word Pair Manager Card */}
          {isLobbyAdmin && selectedCategories.includes('Custom') && (
            <Card className="p-6 border-yellow-500/20 bg-brand-card/65 animate-fade-in-up">
              <h3 className="text-sm font-bold text-yellow-400 tracking-wider uppercase mb-4 flex items-center gap-2">
                <UserPlus className="w-4.5 h-4.5" />
                Manage Custom Word Pairs
              </h3>

              {/* Input Form */}
              <form onSubmit={handleAddCustomPair} className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Crew Word</span>
                    <input
                      type="text"
                      maxLength={20}
                      value={newCommonWord}
                      onChange={(e) => setNewCommonWord(e.target.value)}
                      placeholder="e.g. Cat"
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-200 focus:outline-none focus:border-brand-primary"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Impostor Word</span>
                    <input
                      type="text"
                      maxLength={20}
                      value={newImpostorWord}
                      onChange={(e) => setNewImpostorWord(e.target.value)}
                      placeholder="e.g. Dog"
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-200 focus:outline-none focus:border-brand-primary"
                    />
                  </div>
                </div>

                {customWordError && (
                  <span className="text-xs text-brand-danger font-semibold">{customWordError}</span>
                )}

                <Button
                  variant="primary"
                  type="submit"
                  size="sm"
                  className="py-2.5 rounded-xl text-sm font-bold self-end flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add Word Pair
                </Button>
              </form>

              {/* Words list */}
              <div className="mt-4 pt-4 border-t border-white/5">
                <div className="flex justify-between items-center text-xs text-slate-500 font-bold mb-2">
                  <span>YOUR WORD PAIRS ({customWordPairs.length})</span>
                </div>

                {customWordPairs.length === 0 ? (
                  <div className="text-center py-4 bg-white/[0.01] border border-dashed border-white/10 rounded-xl">
                    <span className="text-xs text-slate-600 font-bold">No custom word pairs added yet!</span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 max-h-[140px] overflow-y-auto pr-1">
                    {customWordPairs.map((pair, idx) => (
                      <div 
                        key={idx}
                        className="flex justify-between items-center bg-white/[0.02] border border-white/5 rounded-xl px-4 py-2.5 text-xs"
                      >
                        <div className="flex items-center gap-1.5 font-bold">
                          <span className="text-slate-200">{pair.common}</span>
                          <span className="text-slate-600">&bull;</span>
                          <span className="text-brand-secondary">{pair.impostor}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => deleteCustomWordPair(idx)}
                          className="text-slate-500 hover:text-brand-danger transition-colors p-1"
                          title="Delete word pair"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Gameplay Settings panel */}
          {isLobbyAdmin && (
            <Card className="p-5 border-white/5 bg-brand-card/50 flex flex-col gap-4">
              <label className="text-sm font-bold text-slate-400 tracking-wider uppercase mb-1 flex items-center gap-2">
                <Settings className="w-4 h-4 text-brand-secondary" />
                Gameplay Settings
              </label>

              {/* Toggle 1: Impostor Knows Role */}
              <div className="flex items-center justify-between py-1 border-b border-white/5 last:border-0">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                    {impostorKnowsRole ? <Eye className="w-4 h-4 text-brand-primary" /> : <EyeOff className="w-4 h-4 text-slate-500" />}
                    Impostor Knows Role
                  </span>
                  <span className="text-xs text-slate-500 max-w-[280px]">
                    {impostorKnowsRole 
                      ? "Impostor is warned immediately: '⚠️ YOU ARE THE IMPOSTOR'" 
                      : "Blind Mode: Impostor only sees their word and is blind to their role initially"}
                  </span>
                </div>
                <button
                  onClick={() => {
                    playClick();
                    setImpostorKnowsRole(!impostorKnowsRole);
                  }}
                  className={`w-12 h-6 rounded-full transition-colors relative border border-white/10 ${
                    impostorKnowsRole ? 'bg-brand-primary' : 'bg-white/5'
                  }`}
                >
                  <span 
                    className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white transition-all duration-300 ${
                      impostorKnowsRole ? 'left-[25px]' : 'left-[3px]'
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 2: Randomize Order */}
              <div className="flex items-center justify-between py-1 border-b border-white/5 last:border-0">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                    <Shuffle className="w-4 h-4 text-brand-secondary" />
                    Randomize Player Order
                  </span>
                  <span className="text-xs text-slate-500">
                    Shuffles turn sequence for card reveals and clue turns
                  </span>
                </div>
                <button
                  onClick={() => {
                    playClick();
                    setRandomizeOrder(!randomizeOrder);
                  }}
                  className={`w-12 h-6 rounded-full transition-colors relative border border-white/10 ${
                    randomizeOrder ? 'bg-brand-primary' : 'bg-white/5'
                  }`}
                >
                  <span 
                    className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white transition-all duration-300 ${
                      randomizeOrder ? 'left-[25px]' : 'left-[3px]'
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 3: Hints & Visual Aids */}
              <div className="flex items-center justify-between py-1 border-b border-white/5 last:border-0">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-brand-primary" />
                    Word Hints & Visual Aids
                  </span>
                  <span className="text-xs text-slate-500 max-w-[280px]">
                    Show descriptive emojis and visual illustrations for players on reveal cards
                  </span>
                </div>
                <button
                  onClick={() => {
                    playClick();
                    setHintsEnabled(!hintsEnabled);
                  }}
                  className={`w-12 h-6 rounded-full transition-colors relative border border-white/10 ${
                    hintsEnabled ? 'bg-brand-primary' : 'bg-white/5'
                  }`}
                >
                  <span 
                    className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white transition-all duration-300 ${
                      hintsEnabled ? 'left-[25px]' : 'left-[3px]'
                    }`}
                  />
                </button>
              </div>

              {/* Timer Duration Setting */}
              <div className="flex flex-col gap-2 py-3 border-b border-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-brand-secondary" />
                      Clue Timer Duration {!isLobbyAdmin && <span className="text-[10px] text-slate-500 font-semibold">(Set by Host)</span>}
                    </span>
                    <span className="text-xs text-slate-500">
                      Time limit per player to describe their clue
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-1.5 items-center">
                  {[30, 40, 50].map((sec) => (
                    <button
                      key={sec}
                      disabled={!isLobbyAdmin}
                      onClick={() => {
                        playClick();
                        setClueTimerLimit(sec);
                      }}
                      className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                        clueTimerLimit === sec
                          ? 'bg-brand-primary border-brand-primary text-white shadow-md shadow-brand-primary/20 scale-[1.03]'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-slate-200 disabled:opacity-50'
                      }`}
                    >
                      {sec}s
                    </button>
                  ))}

                  <div className="flex items-center gap-2">
                    <button
                      disabled={!isLobbyAdmin}
                      onClick={() => {
                        playClick();
                        if (clueTimerLimit === 30 || clueTimerLimit === 40 || clueTimerLimit === 50) {
                          setClueTimerLimit(60);
                        }
                      }}
                      className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                        clueTimerLimit !== 30 && clueTimerLimit !== 40 && clueTimerLimit !== 50
                          ? 'bg-brand-primary border-brand-primary text-white shadow-md shadow-brand-primary/20 scale-[1.03]'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-slate-200 disabled:opacity-50'
                      }`}
                    >
                      Custom
                    </button>

                    {clueTimerLimit !== 30 && clueTimerLimit !== 40 && clueTimerLimit !== 50 && (
                      <div className="flex flex-col gap-1 items-center animate-scale-in">
                        <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl px-2.5 py-1">
                          <input
                            type="text"
                            disabled={!isLobbyAdmin}
                            value={customInputVal}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, '');
                              setCustomInputVal(val);
                              const parsed = parseInt(val, 10);
                              if (!isNaN(parsed) && parsed >= 5 && parsed <= 300) {
                                setClueTimerLimit(parsed);
                              }
                            }}
                            onBlur={() => {
                              let parsed = parseInt(customInputVal, 10);
                              if (isNaN(parsed) || parsed < 5) {
                                parsed = 5;
                              } else if (parsed > 300) {
                                parsed = 300;
                              }
                              setCustomInputVal(String(parsed));
                              setClueTimerLimit(parsed);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.currentTarget.blur();
                              }
                            }}
                            className="bg-transparent text-xs font-black text-white w-9 focus:outline-none text-center"
                          />
                          <span className="text-[10px] font-black text-slate-500">s</span>
                        </div>
                        <span className="text-[9px] font-bold text-slate-500 block">Range: 5s - 300s</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Toggle 4: Sound Effects */}
              <div className="flex items-center justify-between py-1 last:border-0">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                    {soundEnabled ? <Volume2 className="w-4 h-4 text-brand-primary" /> : <VolumeX className="w-4 h-4 text-brand-danger" />}
                    Sound Effects
                  </span>
                  <span className="text-xs text-slate-500">
                    Play synthesized retro plucks and sweeps for game triggers
                  </span>
                </div>
                <button
                  onClick={() => {
                    playClick();
                    setSoundEnabled(!soundEnabled);
                  }}
                  className={`w-12 h-6 rounded-full transition-colors relative border border-white/10 ${
                    soundEnabled ? 'bg-brand-primary' : 'bg-white/5'
                  }`}
                >
                  <span 
                    className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white transition-all duration-300 ${
                      soundEnabled ? 'left-[25px]' : 'left-[3px]'
                    }`}
                  />
                </button>
              </div>
            </Card>
          )}

          {/* API Key Input Card (Host Only) */}
          {isHost && (
            <Card className="p-6 border-white/5 bg-brand-card/50">
              <label className="text-sm font-bold text-slate-400 tracking-wider uppercase flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Gemini API Key (Optional)
              </label>
              <p className="text-xs text-slate-400 mb-3">
                Provide your Google Gemini API key to enable AI-powered word generation. Your key is stored locally and never sent to our servers.
              </p>
              <div className="flex flex-col gap-2">
                <input
                  type="password"
                  placeholder="Enter your Gemini API key..."
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/30 transition-all"
                />
                <button
                  onClick={() => {
                    playClick();
                    setGeminiApiKey(apiKeyInput);
                  }}
                  className="bg-brand-primary/20 hover:bg-brand-primary/30 border border-brand-primary/30 hover:border-brand-primary/50 text-brand-primary text-xs font-bold py-2 px-3 rounded-lg transition-all"
                >
                  Save API Key
                </button>
                {geminiApiKey && (
                  <div className="text-[10px] text-emerald-400 flex items-center gap-1.5 mt-1">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                    API Key saved to local storage
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Roster list (if NOT multiplayer) */}
          {!isMultiplayer && playersRosterCard}

          {/* Footer Actions Column */}
          <div className="flex gap-4">
            {isMultiplayer ? (
              <>
                <Button 
                  variant="glass" 
                  onClick={() => leaveRoom()} 
                  className="flex-1 py-4 rounded-2xl border-white/10 hover:bg-brand-danger/10 hover:text-brand-danger hover:border-brand-danger/25 font-bold transition-all"
                >
                  {isHost ? 'Close Lobby' : 'Leave Lobby'}
                </Button>
                {isLobbyAdmin ? (
                  <Button 
                    variant="primary" 
                    onClick={startGame} 
                    disabled={onlinePlayers.length < 3 || selectedCategories.length === 0 || isCustomCategoryEmpty}
                    className="flex-[2] py-4 rounded-2xl font-bold disabled:opacity-40 disabled:pointer-events-none"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    {onlinePlayers.length < 3 
                      ? 'Need 3+ Players' 
                      : selectedCategories.length === 0
                        ? 'Select Theme'
                        : 'Start Game'}
                  </Button>
                ) : (
                  <div className="flex-[2] py-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center gap-2.5 animate-pulse select-none">
                    <span className={`w-2.5 h-2.5 rounded-full animate-ping ${isSpectating ? 'bg-brand-warning' : 'bg-brand-secondary'}`} />
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest leading-none">
                      {isSpectating ? 'Game In Progress - Spectating' : 'Waiting for Host...'}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <>
                <Button 
                  variant="glass" 
                  onClick={resetGame} 
                  className="flex-1 py-4 rounded-2xl"
                >
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  onClick={startGame} 
                  disabled={selectedCategories.length === 0 || isCustomCategoryEmpty}
                  className="flex-[2] py-4 rounded-2xl font-bold disabled:opacity-40 disabled:pointer-events-none"
                >
                  <Play className="w-5 h-5 mr-2" />
                  {selectedCategories.length === 0 
                    ? 'Select Theme' 
                    : isCustomCategoryEmpty 
                      ? 'Add Words First' 
                      : 'Start Game'}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Players & Chat Column (Multiplayer Only) */}
        {isMultiplayer && (
          <div className="flex flex-col gap-6">
            {playersRosterCard}
            {lobbyChatCard}
          </div>
        )}

      </div>

      {/* Mobile Floating Chat Shortcut Button */}
      {isMultiplayer && showScrollButton && (
        <button
          onClick={() => {
            playClick();
            document.getElementById('lobby-chat')?.scrollIntoView({ behavior: 'smooth' });
            setUnreadChatCount(0);
          }}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-tr from-brand-secondary to-pink-600 border border-white/10 hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center justify-center cursor-pointer glow-secondary select-none sm:hidden animate-fade-in-up"
          title="Scroll to Chat"
        >
          <MessageSquare className="w-6 h-6 text-white" />
          {unreadChatCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-brand-danger border border-brand-dark/20 text-white text-[10px] font-black w-5.5 h-5.5 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              {unreadChatCount}
            </span>
          )}
        </button>
      )}



      {/* Category Selector Modal Popup */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg max-h-[85vh] flex flex-col rounded-3xl glass-panel border border-white/10 bg-brand-card shadow-2xl overflow-hidden animate-scale-in">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-white/5 bg-brand-dark/20">
              <div>
                <h3 className="text-xl font-black text-white tracking-wide flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-brand-secondary" />
                  Categories & Themes
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Toggle categories to include in the word pool</p>
              </div>
              <button
                onClick={() => {
                  playClick();
                  setIsCategoryModalOpen(false);
                }}
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300"
              >
                &times;
              </button>
            </div>

            {/* Quick Select Toolbars */}
            <div className="flex gap-2.5 px-6 py-3 border-b border-white/5 bg-brand-dark/10">
              <button
                onClick={() => {
                  playClick();
                  setSelectedCategories([
                    'Animals', 'Food', 'Objects & Things', 'School & Learning', 'Silly & Random',
                    'Geography (Countries & Cities)', 'Movies & TV', 'Music & Entertainment',
                    'Sports & Games', 'Technology & Gadgets', 'Nature & Outdoors', 'Colors & Shapes',
                    'Emotions & Feelings', 'Jobs & Professions', 'Vehicles & Transportation',
                    'Places (Landmarks & Locations)', 'Video Games & Internet Culture', 'Fantasy & Mythical Creatures'
                  ]);
                }}
                className="flex-1 py-2 text-xs font-black rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
              >
                Select All
              </button>
              <button
                onClick={() => {
                  playClick();
                  const hasCustom = selectedCategories.includes('Custom');
                  setSelectedCategories(hasCustom ? ['Custom'] : []);
                }}
                className="flex-1 py-2 text-xs font-black rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
              >
                Clear All
              </button>
            </div>

            {/* Scrollable Categories List */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              {/* Mixed Mode Toggle Card */}
              {(() => {
                const isMixedActive = selectedCategories.includes('Mixed');
                return (
                  <div
                    onClick={() => {
                      playClick();
                      const hasCustom = selectedCategories.includes('Custom');
                      if (isMixedActive) {
                        setSelectedCategories(hasCustom ? ['Custom'] : []);
                      } else {
                        setSelectedCategories(hasCustom ? ['Mixed', 'Custom'] : ['Mixed']);
                      }
                    }}
                    className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer select-none transition-all duration-300 bg-gradient-to-r ${
                      isMixedActive
                        ? 'border-brand-primary/50 text-white from-brand-primary/25 to-brand-secondary/10 shadow-lg shadow-brand-primary/10 scale-[1.01]'
                        : 'bg-white/[0.02] border-white/10 text-slate-300 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all duration-200 ${
                        isMixedActive ? 'bg-brand-primary border-brand-primary text-white shadow-sm shadow-brand-primary/20' : 'border-slate-500'
                      }`}>
                        {isMixedActive && (
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                            <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                          </svg>
                        )}
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className={`p-2 rounded-xl bg-white/5 ${isMixedActive ? 'text-brand-secondary' : 'text-slate-400'}`}>
                          <Shuffle className={`w-5 h-5 ${isMixedActive ? 'animate-spin-slow' : ''}`} />
                        </div>
                        <div className="text-left">
                          <span className="text-sm font-black tracking-wide block">Mixed Mode (All Themes)</span>
                          <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">Draws a word pair randomly from any category</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Grid of Standard Categories */}
              <div className="grid grid-cols-2 gap-2.5">
                {categoriesList.map(cat => {
                  const isMixedActive = selectedCategories.includes('Mixed');
                  const isSelected = selectedCategories.includes(cat.key);
                  return (
                    <div
                      key={cat.key}
                      onClick={() => {
                        playClick();
                        const hasCustom = selectedCategories.includes('Custom');
                        if (isMixedActive) {
                          setSelectedCategories(hasCustom ? [cat.key, 'Custom'] : [cat.key]);
                        } else {
                          if (isSelected) {
                            setSelectedCategories(selectedCategories.filter(c => c !== cat.key));
                          } else {
                            setSelectedCategories([...selectedCategories, cat.key]);
                          }
                        }
                      }}
                      className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer select-none transition-all duration-300 ${
                        isSelected && !isMixedActive
                          ? 'border-brand-primary/45 text-white bg-brand-primary/10 shadow-lg shadow-brand-primary/5 scale-[1.01]'
                          : 'bg-brand-card/40 border-white/5 text-slate-400 hover:border-white/20 hover:text-slate-200'
                      }`}
                    >
                      <div className={`w-4.5 h-4.5 rounded border flex items-center justify-center transition-all duration-200 ${
                        isSelected && !isMixedActive
                          ? 'bg-brand-primary border-brand-primary text-white shadow-sm shadow-brand-primary/20' 
                          : 'border-slate-600'
                      }`}>
                        {isSelected && !isMixedActive && (
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                            <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                          </svg>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg bg-white/5 ${isSelected && !isMixedActive ? 'text-white' : ''}`}>
                          {cat.icon}
                        </div>
                        <span className="text-xs font-black tracking-wide leading-tight">{cat.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-white/5 bg-brand-dark/20 flex gap-3">
              <Button
                variant="primary"
                fullWidth
                onClick={() => {
                  playClick();
                  setIsCategoryModalOpen(false);
                }}
                disabled={selectedCategories.length === 0}
                className="py-3.5 rounded-xl font-extrabold text-sm shadow-lg shadow-brand-primary/25 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
              >
                Apply & Close ({selectedCategories.includes('Mixed') ? 'Mixed Mode' : `${selectedCategories.filter(c => c !== 'Custom').length} Selected`})
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Host Lobby Moderation Modal */}
      {hostActionTarget && isHost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl glass-panel border border-white/10 bg-brand-card p-6 shadow-2xl animate-scale-in relative">

            {/* Close Button */}
            <button
              onClick={() => {
                playClick();
                setHostActionTarget(null);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Player Avatar */}
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl mx-auto mb-3 shadow-inner">
              {hostActionTarget.avatar}
            </div>
            <h3 className="text-lg font-black text-white tracking-wide text-center">
              {hostActionTarget.name}
            </h3>
            <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest text-center mt-1 mb-5">
              Host Moderation Panel
            </p>

            {hostActionMode === 'menu' && (
              <div className="flex flex-col gap-2.5">
                {/* Mute / Unmute */}
                <button
                  onClick={() => {
                    playClick();
                    toggleMutePlayer(hostActionTarget.id);
                  }}
                  className="w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
                >
                  {mutedPlayerIds.includes(hostActionTarget.id) ? (
                    <>
                      <Volume2 className="w-4 h-4 text-brand-accent" />
                      Unmute Player Chat
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-4 h-4 text-brand-warning" />
                      Mute Player Chat
                    </>
                  )}
                </button>

                {/* Transfer Host */}
                {hostActionTarget.id !== lobbyAdminId && (
                  <button
                    onClick={() => {
                      playClick();
                      transferHost(hostActionTarget.id);
                      setHostActionTarget(null);
                    }}
                    className="w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
                  >
                    <Shield className="w-4 h-4 text-brand-secondary" />
                    Make Lobby Host
                  </button>
                )}

                {/* Kick Player */}
                {hostActionTarget.id !== lobbyAdminId && (
                  <button
                    onClick={() => {
                      playClick();
                      setHostActionMode('kick');
                      setHostActionReason('');
                    }}
                    className="w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 bg-brand-warning/10 border border-brand-warning/30 text-brand-warning hover:bg-brand-warning/20 transition-all cursor-pointer"
                  >
                    <UserMinus className="w-4 h-4" />
                    Kick Player
                  </button>
                )}

                {/* Ban Player */}
                {hostActionTarget.id !== lobbyAdminId && (
                  <button
                    onClick={() => {
                      playClick();
                      setHostActionMode('ban');
                      setHostActionReason('');
                    }}
                    className="w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 bg-brand-danger/10 border border-brand-danger/30 text-brand-danger hover:bg-brand-danger/20 transition-all cursor-pointer"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    Ban Player (Block re-entry)
                  </button>
                )}

                {/* Cancel */}
                <button
                  onClick={() => {
                    playClick();
                    setHostActionTarget(null);
                  }}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-300 transition-all cursor-pointer mt-1"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Reason Input for Kick */}
            {hostActionMode === 'kick' && (
              <div className="flex flex-col gap-3 animate-fade-in">
                <div className="bg-brand-warning/5 border border-brand-warning/20 rounded-xl p-3 text-center">
                  <span className="text-xs font-bold text-brand-warning flex items-center justify-center gap-1.5">
                    <UserMinus className="w-3.5 h-3.5" />
                    Kick {hostActionTarget.name}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">This player can rejoin the room after being kicked.</p>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">
                    Reason (optional)
                  </label>
                  <input
                    type="text"
                    value={hostActionReason}
                    onChange={(e) => setHostActionReason(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        kickPlayer(hostActionTarget.id, hostActionReason.trim() || undefined);
                        setHostActionTarget(null);
                      }
                    }}
                    placeholder="e.g. Disruptive behavior..."
                    maxLength={100}
                    autoFocus
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-brand-warning/50 transition-colors"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      playClick();
                      setHostActionMode('menu');
                    }}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      playClick();
                      kickPlayer(hostActionTarget.id, hostActionReason.trim() || undefined);
                      setHostActionTarget(null);
                    }}
                    className="flex-[2] py-2.5 rounded-xl text-xs font-extrabold bg-brand-warning border border-brand-warning text-brand-dark hover:bg-amber-500 transition-all cursor-pointer shadow-md shadow-brand-warning/25"
                  >
                    Confirm Kick
                  </button>
                </div>
              </div>
            )}

            {/* Reason Input for Ban */}
            {hostActionMode === 'ban' && (
              <div className="flex flex-col gap-3 animate-fade-in">
                <div className="bg-brand-danger/5 border border-brand-danger/20 rounded-xl p-3 text-center">
                  <span className="text-xs font-bold text-brand-danger flex items-center justify-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Ban {hostActionTarget.name}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">This player will be permanently blocked from rejoining.</p>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">
                    Reason (optional)
                  </label>
                  <input
                    type="text"
                    value={hostActionReason}
                    onChange={(e) => setHostActionReason(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        banPlayer(hostActionTarget.id, hostActionReason.trim() || undefined);
                        setHostActionTarget(null);
                      }
                    }}
                    placeholder="e.g. Cheating, toxic behavior..."
                    maxLength={100}
                    autoFocus
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-brand-danger/50 transition-colors"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      playClick();
                      setHostActionMode('menu');
                    }}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      playClick();
                      banPlayer(hostActionTarget.id, hostActionReason.trim() || undefined);
                      setHostActionTarget(null);
                    }}
                    className="flex-[2] py-2.5 rounded-xl text-xs font-extrabold bg-brand-danger border border-brand-danger text-white hover:bg-red-600 transition-all cursor-pointer shadow-md shadow-brand-danger/25"
                  >
                    Confirm Ban
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};
export {};
