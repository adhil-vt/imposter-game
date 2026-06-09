import React, { useState, useEffect, useRef } from 'react';
import { useGame, AVATAR_POOL } from '../context/GameContext';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { playClick } from '../utils/sounds';
import { PlayerModerationModal } from '../components/PlayerModerationModal';
import type { CategoryKey, DifficultyKey } from '../data/words';
import { 
  Users, 
  Sparkles, 
  Shuffle, 
  Coffee, 
  Globe, 
  UserPlus,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
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
  MessageSquare
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
    customWordPairs,
    addCustomWordPair,
    deleteCustomWordPair,
    startGame,
    resetGame,
    isMultiplayer,
    isHost,
    roomCode,
    myPlayerId,
    onlinePlayers,
    leaveRoom,
    isLobbyAdmin,
    mutedPlayerIds,
    chatMessages,
    sendChatMessage,
    unreadChatCount
  } = useGame();

  const [copied, setCopied] = useState(false);
  const [activeAvatarPicker, setActiveAvatarPicker] = useState<number | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState<boolean>(false);
  const [newCommonWord, setNewCommonWord] = useState<string>('');
  const [newImpostorWord, setNewImpostorWord] = useState<string>('');
  const [customWordError, setCustomWordError] = useState<string>('');
  
  const [selectedModerationPlayer, setSelectedModerationPlayer] = useState<any | null>(null);
  const [chatInput, setChatInput] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

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

  const playersRosterCard = (
    <Card className="p-6 border-white/5 bg-brand-card/50 flex flex-col">
      <div className="flex justify-between items-center mb-3">
        <label className="text-sm font-bold text-slate-400 tracking-wider uppercase flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-cyan-400" />
          {isMultiplayer ? `Lobby Players (${onlinePlayers.length})` : 'Players & Avatars'}
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
                playClick();
                setSelectedModerationPlayer(player);
              }}
              className="flex items-center justify-between bg-white/[0.02] border border-white/5 p-3 rounded-xl transition-all duration-300 hover:bg-white/[0.04] cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-lg shadow-sm">
                  {player.avatar}
                </span>
                <span className="text-sm font-bold text-slate-200">
                  {player.name} {player.id === myPlayerId && <span className="text-[10px] text-slate-500 font-bold italic">(You)</span>}
                </span>
              </div>
              {player.isAdmin ? (
                <span className="text-[9px] bg-brand-primary/20 border border-brand-primary/30 text-brand-primary px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider animate-pulse">
                  Host
                </span>
              ) : (
                <div className="flex items-center gap-2 select-none">
                  <span className="text-[9px] bg-white/5 border border-white/10 text-slate-500 px-2 py-0.5 rounded-full font-bold uppercase">
                    Player
                  </span>
                </div>
              )}
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
    <Card id="lobby-chat" className="p-5 border-white/5 bg-brand-card/45 flex flex-col h-[320px] justify-between">
      {/* Header */}
      <div className="border-b border-white/5 pb-2.5 flex justify-between items-center select-none">
        <span className="text-xs font-bold text-slate-400 tracking-wider uppercase flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-brand-secondary" />
          Room Chat
        </span>
      </div>

      {/* Messages list */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto py-3 pr-1 flex flex-col gap-3 scrollbar-thin max-h-[190px]">
        {chatMessages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40 p-4 select-none h-full">
            <MessageSquare className="w-8 h-8 text-slate-500 mb-2 stroke-[1.5]" />
            <span className="text-xs font-bold text-slate-400">No messages yet</span>
            <span className="text-[10px] text-slate-500 mt-0.5">Start typing to talk with other players!</span>
          </div>
        ) : (
          chatMessages
            .filter(msg => !mutedPlayerIds.includes(msg.senderId))
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
                    {msg.senderAvatar}
                  </span>
                  <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
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
        {/* Auto scrolled */}
      </div>

      {/* Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!chatInput.trim()) return;
          playClick();
          sendChatMessage(chatInput);
          setChatInput('');
        }}
        className="border-t border-white/5 pt-3 flex items-center gap-2 select-none"
      >
        <input
          type="text"
          maxLength={100}
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold text-slate-200 focus:outline-none focus:border-brand-secondary placeholder-slate-600"
        />
        <button
          type="submit"
          disabled={!chatInput.trim()}
          className="p-2 rounded-xl bg-brand-secondary border border-brand-secondary text-white hover:scale-105 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-md shadow-brand-secondary/10 flex items-center justify-center cursor-pointer"
          title="Send Message"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </Card>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 sm:px-6 py-6 relative">
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

          {/* Roster list (if NOT multiplayer) */}
          {!isMultiplayer && playersRosterCard}

          {/* Footer Actions Column */}
          <div className="flex gap-4">
            {isMultiplayer ? (
              <>
                <Button 
                  variant="glass" 
                  onClick={leaveRoom} 
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
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-secondary animate-ping" />
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest leading-none">
                      Waiting for Host...
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
      {isMultiplayer && (
        <button
          onClick={() => {
            playClick();
            document.getElementById('lobby-chat')?.scrollIntoView({ behavior: 'smooth' });
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

      {/* Moderation Overlay popup */}
      {selectedModerationPlayer && (
        <PlayerModerationModal
          playerId={selectedModerationPlayer.id}
          playerName={selectedModerationPlayer.name}
          playerAvatar={selectedModerationPlayer.avatar}
          playerIsAdmin={selectedModerationPlayer.isAdmin || false}
          onClose={() => setSelectedModerationPlayer(null)}
        />
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
    </div>
  );
};
export {};
