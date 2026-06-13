import React, { useEffect, useRef, useState } from 'react';
import { useGame } from '../context/GameContext';
import { MessageSquare, Send, X, Users, Mic, MicOff, Volume2, Radio } from 'lucide-react';
import { playClick } from '../utils/sounds';
import { renderAvatarIcon } from '../utils/avatarHelper';

interface ChatDrawerProps {
  embedded?: boolean;
  hideFloatingOnDesktop?: boolean;
}

type ToastMessage = {
  id: string;
  senderName: string;
  senderAvatar: string;
  text: string;
};

export const ChatDrawer: React.FC<ChatDrawerProps> = ({ embedded = false, hideFloatingOnDesktop = false }) => {
  const {
    isMultiplayer,
    gameState,
    myPlayerId,
    onlinePlayers,
    roomCode,
    chatMessages,
    isChatOpen,
    setIsChatOpen,
    unreadChatCount,
    sendChatMessage,
    mutedPlayerIds,
    isSpectating,
    gameStartedAt,
    isVoiceActive,
    toggleVoice,
    micVolume,
    setMicVolume,
    speakerVolume,
    setSpeakerVolume,
    playersSpeaking,
    micMuted,
    toggleMicMute,
    deafenAll,
    toggleDeafenAll,
    deafenedPlayerIds,
    toggleDeafenPlayer,
  } = useGame();

  const [inputText, setInputText] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'voice'>('chat');
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [mobileToast, setMobileToast] = useState<ToastMessage | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastMessageIdRef = useRef<string | null>(null);

  const activeGameStates = ['REVEAL', 'CLUES', 'VOTING', 'RESULTS'];
  const isActiveGameState = activeGameStates.includes(gameState);

  useEffect(() => {
    const updateViewport = () => {
      setIsMobileViewport(window.matchMedia('(max-width: 1023px)').matches);
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior });
    }
  };

  useEffect(() => {
    if (embedded || isChatOpen) {
      const timer = setTimeout(() => {
        scrollToBottom('auto');
      }, 50);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [embedded, isChatOpen]);

  useEffect(() => {
    if (!chatMessages.length) return;

    const latestMessage = chatMessages[chatMessages.length - 1];
    if (!latestMessage || latestMessage.id === lastMessageIdRef.current) return;
    lastMessageIdRef.current = latestMessage.id;

    const isMessageVisible = (() => {
      if (isSpectating) {
        return !latestMessage.chatScope || latestMessage.chatScope === 'lobby';
      } else {
        return latestMessage.chatScope === 'game' || latestMessage.timestamp < gameStartedAt;
      }
    })();

    if (!isMessageVisible) return;

    if (embedded || isChatOpen) {
      scrollToBottom('smooth');
    }

    if (!embedded && isMobileViewport && latestMessage.senderId !== myPlayerId) {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }

      setMobileToast({
        id: latestMessage.id,
        senderName: latestMessage.senderName,
        senderAvatar: latestMessage.senderAvatar,
        text: latestMessage.text,
      });

      toastTimerRef.current = setTimeout(() => {
        setMobileToast(null);
      }, 3500);
    }
  }, [chatMessages, embedded, isChatOpen, isMobileViewport, myPlayerId, isSpectating, gameStartedAt]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  if (!isMultiplayer || !isActiveGameState) return null;

  const handleToggle = () => {
    playClick();
    setIsChatOpen(!isChatOpen);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    playClick();
    sendChatMessage(inputText);
    setInputText('');
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderMessages = () => {
    const visibleMessages = chatMessages.filter(msg => {
      if (mutedPlayerIds.includes(msg.senderId)) return false;
      if (isSpectating) {
        return !msg.chatScope || msg.chatScope === 'lobby';
      } else {
        return msg.chatScope === 'game' || msg.timestamp < gameStartedAt;
      }
    });

    if (visibleMessages.length === 0) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40 p-4 select-none">
          <MessageSquare className="w-8 h-8 text-slate-500 mb-2 stroke-[1.5]" />
          <span className="text-xs font-bold text-slate-400">No messages yet</span>
          <span className="text-[10px] text-slate-500 mt-0.5">Discuss and chat with other players here!</span>
        </div>
      );
    }

    return visibleMessages.map((msg) => {
      if (msg.isSystem) {
        return (
          <div
            key={msg.id}
            className="self-center bg-white/[0.02] border border-dashed border-white/10 rounded-xl px-3.5 py-1.5 text-[10px] text-slate-500 font-extrabold max-w-[85%] text-center animate-fade-in-up"
          >
            {msg.text}
          </div>
        );
      }

      const isMe = msg.senderId === myPlayerId;

      return (
        <div
          key={msg.id}
          className={`flex gap-2.5 max-w-[85%] animate-fade-in-up ${
            isMe ? 'self-end flex-row-reverse' : 'self-start'
          }`}
        >
          <span className="w-7.5 h-7.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-sm shadow-sm select-none shrink-0 self-end">
            {renderAvatarIcon(msg.senderAvatar)}
          </span>

          <div className={`flex flex-col min-w-0 ${isMe ? 'items-end' : 'items-start'}`}>
            <div className="flex items-center gap-1.5 text-[9px] text-slate-500 font-extrabold mb-1 select-none">
              <span>{msg.senderName}</span>
              <span>&bull;</span>
              <span>{formatTime(msg.timestamp)}</span>
            </div>

            <div
              className={`px-3.5 py-2.5 rounded-2xl text-xs break-words shadow-sm font-semibold select-text ${
                isMe
                  ? 'bg-gradient-to-tr from-brand-primary/80 to-brand-primary border border-brand-primary/20 text-white rounded-br-none'
                  : 'bg-white/5 border border-white/10 text-slate-200 rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        </div>
      );
    });
  };

  const renderVoicePanel = () => {
    return (
      <div className="flex-1 flex flex-col min-h-0 overflow-y-auto p-5 gap-5 custom-scrollbar bg-brand-dark/10">
        
        {/* Join/Leave Button */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">
            Channel Status
          </span>
          <button
            onClick={() => toggleVoice()}
            className={`w-full py-3.5 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-98 ${
              isVoiceActive
                ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/40 shadow-rose-500/5'
                : 'bg-brand-primary border border-brand-primary text-white hover:scale-[1.01] shadow-brand-primary/10'
            }`}
          >
            {isVoiceActive ? (
              <>
                <MicOff className="w-4 h-4" />
                Disconnect Voice Chat
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 animate-pulse" />
                Connect Voice Chat
              </>
            )}
          </button>
        </div>

        {isVoiceActive && (
          <>
            {/* Mic & Deafen Controls */}
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => toggleMicMute()}
                  className={`py-2.5 px-3 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                    micMuted
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                  title={micMuted ? 'Unmute microphone' : 'Mute microphone'}
                >
                  <MicOff className="w-3.5 h-3.5" />
                  {micMuted ? 'Muted' : 'Mute'}
                </button>

                <button
                  onClick={() => toggleDeafenAll()}
                  className={`py-2.5 px-3 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                    deafenAll
                      ? 'bg-brand-warning/10 border-brand-warning/30 text-brand-warning'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                  title={deafenAll ? 'Undeafen all' : 'Deafen all'}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  {deafenAll ? 'Deafened' : 'Deafen'}
                </button>
              </div>
            </div>

            {/* Input & Output Sliders */}
            <div className="flex flex-col gap-4 bg-white/[0.01] border border-white/5 p-4 rounded-2xl">
              {/* Mic Volume */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs select-none">
                  <span className="font-bold text-slate-300 flex items-center gap-1.5">
                    <Mic className="w-3.5 h-3.5 text-brand-primary" />
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

              {/* Speaker Volume */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs select-none">
                  <span className="font-bold text-slate-300 flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-brand-secondary" />
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

            {/* Active Voice Speakers */}
            <div className="flex flex-col gap-2.5">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block select-none">
                Active in Channel
              </span>
              <div className="flex flex-col gap-2">
                {onlinePlayers.map((player) => {
                  const isMe = player.id === myPlayerId;
                  const isSpeaking = isMe ? false : !!playersSpeaking[player.id];
                  const isDeafened = deafenedPlayerIds.includes(player.id);

                  return (
                    <div
                      key={player.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/[0.01] border border-white/5 select-none"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* Glowing Avatar */}
                        <div className={`relative transition-shadow duration-300 w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-base shrink-0 ${
                          isSpeaking ? 'ring-2 ring-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.3)] animate-pulse' : ''
                        }`}>
                          {player.avatar}
                        </div>
                        <span className="text-xs font-bold text-slate-200 truncate">
                          {player.name}
                          {isMe && <span className="text-[9px] text-slate-500 font-bold ml-1 italic">(You)</span>}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {!isMe && (
                          <button
                            onClick={() => toggleDeafenPlayer(player.id)}
                            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                              isDeafened
                                ? 'bg-rose-500/20 border border-rose-500/40 text-rose-400'
                                : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10'
                            }`}
                            title={isDeafened ? 'Undeafen player' : 'Deafen player'}
                          >
                            <Volume2 className="w-3 h-3" />
                          </button>
                        )}

                        {player.isVoiceActive ? (
                          isSpeaking ? (
                            <span className="text-[9px] bg-emerald-400/10 border border-emerald-500/25 text-emerald-400 px-2 py-0.5 rounded font-black uppercase tracking-wider flex items-center gap-0.5 animate-pulse">
                              <Radio className="w-2.5 h-2.5 shrink-0" />
                              Speaking
                            </span>
                          ) : (
                            <span className="text-[9px] bg-white/5 border border-white/10 text-slate-400 px-2 py-0.5 rounded font-black uppercase tracking-wider flex items-center gap-0.5">
                              <Mic className="w-2.5 h-2.5 shrink-0 text-slate-500" />
                              Active
                            </span>
                          )
                        ) : (
                          <span className="text-[9px] bg-white/[0.01] border border-dashed border-white/5 text-slate-600 px-2 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-0.5">
                            <MicOff className="w-2.5 h-2.5 shrink-0 text-slate-700" />
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
        )}
        
        {!isVoiceActive && (
          <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40 p-4 select-none h-full mt-8">
            <Radio className="w-10 h-10 text-slate-500 mb-2 stroke-[1.5] animate-pulse" />
            <span className="text-xs font-bold text-slate-400">Voice Chat is Offline</span>
            <span className="text-[10px] text-slate-500 mt-1 max-w-[200px] leading-relaxed">
              Connect to chat with other lobby members in real-time over P2P!
            </span>
          </div>
        )}

      </div>
    );
  };

  const renderInput = () => {
    const myOnlinePlayer = onlinePlayers.find(p => p.id === myPlayerId);
    const isRestricted = myOnlinePlayer?.isMuted || false;

    return (
      <form
        onSubmit={handleSend}
        className="p-4 border-t border-white/5 bg-brand-dark/40 flex items-center gap-2 select-none shrink-0 pb-[calc(1rem+env(safe-area-inset-bottom))]"
      >
        <input
          type="text"
          maxLength={60}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isRestricted}
          placeholder={isRestricted ? 'You are restricted from chatting by host' : 'Type a message... (max 60 chars)'}
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-200 focus:outline-none focus:border-brand-primary placeholder-slate-600 disabled:opacity-50 disabled:pointer-events-none"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isRestricted}
          className="p-2.5 rounded-xl bg-brand-primary border border-brand-primary text-white hover:scale-105 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-md shadow-brand-primary/10 flex items-center justify-center cursor-pointer shrink-0"
          title="Send Message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    );
  };

  if (embedded) {
    return (
      <div className="glass-panel border-white/5 bg-brand-card/45 flex flex-col h-[calc(100vh-8rem)] min-h-0 overflow-hidden">
        <div className="p-4 border-b border-white/5 bg-brand-dark/20 flex justify-between items-center select-none shrink-0">
          <div className="flex flex-col">
            <span className="text-sm font-black text-white tracking-wide flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-brand-primary" />
              Room Chat ({roomCode})
            </span>
            <span className="text-[10px] text-slate-500 font-extrabold uppercase flex items-center gap-1 mt-0.5">
              <Users className="w-3 h-3 text-slate-500" />
              {onlinePlayers.length} Participants
            </span>
          </div>
        </div>

        {/* Tab Headers */}
        <div className="flex border-b border-white/5 bg-brand-dark/10 shrink-0 select-none">
          <button
            onClick={() => { playClick(); setActiveTab('chat'); }}
            className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'chat'
                ? 'border-brand-primary text-white bg-white/[0.02]'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Text Chat
            {unreadChatCount > 0 && activeTab !== 'chat' && (
              <span className="bg-brand-danger text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center animate-pulse">
                {unreadChatCount}
              </span>
            )}
          </button>
          <button
            onClick={() => { playClick(); setActiveTab('voice'); }}
            className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'voice'
                ? 'border-brand-primary text-white bg-white/[0.02]'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            Voice Chat
            {isVoiceActive && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            )}
          </button>
        </div>

        {activeTab === 'chat' ? (
          <>
            <div
              ref={messagesContainerRef}
              className="flex-1 min-h-0 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar"
            >
              {renderMessages()}
              <div ref={messagesEndRef} />
            </div>
            {renderInput()}
          </>
        ) : (
          renderVoicePanel()
        )}
      </div>
    );
  }

  return (
    <>
      {isMobileViewport && mobileToast && !isChatOpen && (
        <div className="fixed bottom-24 right-4 left-4 sm:left-auto sm:w-[22rem] z-50 animate-fade-in-up pointer-events-none">
          <div className="glass-panel border-white/10 bg-brand-dark/95 shadow-2xl px-4 py-3 flex items-start gap-3">
            <span className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-lg shrink-0">
              {renderAvatarIcon(mobileToast.senderAvatar)}
            </span>
            <div className="min-w-0 flex-1 text-left">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-black text-white truncate">{mobileToast.senderName}</span>
                <span className="text-[9px] uppercase tracking-widest text-slate-500 shrink-0">New message</span>
              </div>
              <p className="text-xs text-slate-300 mt-1 line-clamp-2 break-words">{mobileToast.text}</p>
            </div>
          </div>
        </div>
      )}

      {(!hideFloatingOnDesktop || isMobileViewport) && (
        <button
          onClick={handleToggle}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-tr from-brand-secondary to-pink-600 border border-white/10 hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center justify-center cursor-pointer glow-secondary select-none animate-fade-in-up"
          title="Open Chat"
        >
          <MessageSquare className="w-6 h-6 text-white" />
          {unreadChatCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-brand-danger border border-brand-dark/20 text-white text-[10px] font-black w-5.5 h-5.5 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              {unreadChatCount}
            </span>
          )}
        </button>
      )}

      {(!hideFloatingOnDesktop || isMobileViewport) && isChatOpen && (
        <div
          onClick={handleToggle}
          className="fixed inset-0 z-45 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300"
        />
      )}

      {(!hideFloatingOnDesktop || isMobileViewport) && (
      <div
        className={`fixed right-0 top-0 bottom-0 z-50 h-[100dvh] w-80 sm:w-96 glass-panel border-y-0 border-r-0 rounded-none bg-brand-dark/95 shadow-2xl flex flex-col overflow-hidden transition-transform duration-300 ease-out ${
          isChatOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-white/5 bg-brand-dark/20 flex justify-between items-center select-none shrink-0">
          <div className="flex flex-col">
            <span className="text-sm font-black text-white tracking-wide flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-brand-primary" />
              Room Chat ({roomCode})
            </span>
            <span className="text-[10px] text-slate-500 font-extrabold uppercase flex items-center gap-1 mt-0.5">
              <Users className="w-3 h-3 text-slate-500" />
              {onlinePlayers.length} Participants
            </span>
          </div>
          <button
            onClick={handleToggle}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            title="Close Chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Headers */}
        <div className="flex border-b border-white/5 bg-brand-dark/10 shrink-0 select-none">
          <button
            onClick={() => { playClick(); setActiveTab('chat'); }}
            className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'chat'
                ? 'border-brand-primary text-white bg-white/[0.02]'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Text Chat
            {unreadChatCount > 0 && activeTab !== 'chat' && (
              <span className="bg-brand-danger text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center animate-pulse">
                {unreadChatCount}
              </span>
            )}
          </button>
          <button
            onClick={() => { playClick(); setActiveTab('voice'); }}
            className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'voice'
                ? 'border-brand-primary text-white bg-white/[0.02]'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            Voice Chat
            {isVoiceActive && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            )}
          </button>
        </div>

        {activeTab === 'chat' ? (
          <>
            <div
              ref={messagesContainerRef}
              className="flex-1 min-h-0 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar"
            >
              {renderMessages()}
              <div ref={messagesEndRef} />
            </div>
            {renderInput()}
          </>
        ) : (
          renderVoicePanel()
        )}
      </div>
      )}
    </>
  );
};
