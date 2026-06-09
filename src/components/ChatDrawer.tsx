import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { MessageSquare, Send, X, Users } from 'lucide-react';
import { playClick } from '../utils/sounds';

export const ChatDrawer: React.FC = () => {
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
  } = useGame();

  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior });
    }
  };

  useEffect(() => {
    if (isChatOpen) {
      // Small timeout to allow transition to finish
      const timer = setTimeout(() => {
        scrollToBottom('auto');
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isChatOpen]);

  useEffect(() => {
    if (isChatOpen) {
      scrollToBottom('smooth');
    }
  }, [chatMessages]);

  const activeGameStates = ['REVEAL', 'CLUES', 'VOTING', 'RESULTS'];
  if (!isMultiplayer || !activeGameStates.includes(gameState)) return null;

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

  return (
    <>
      {/* Floating Toggle Button */}
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

      {/* Backdrop Overlay */}
      {isChatOpen && (
        <div
          onClick={handleToggle}
          className="fixed inset-0 z-45 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300"
        />
      )}

      {/* Sliding Chat Drawer */}
      <div
        className={`fixed right-0 top-0 bottom-0 z-50 h-screen w-80 sm:w-96 glass-panel border-y-0 border-r-0 rounded-none bg-brand-dark/95 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isChatOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-white/5 bg-brand-dark/20 flex justify-between items-center select-none">
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

        {/* Message History */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 scrollbar-thin"
        >
          {chatMessages.filter(msg => !mutedPlayerIds.includes(msg.senderId)).length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40 p-4 select-none">
              <MessageSquare className="w-8 h-8 text-slate-500 mb-2 stroke-[1.5]" />
              <span className="text-xs font-bold text-slate-400">No messages yet</span>
              <span className="text-[10px] text-slate-500 mt-0.5">Discuss and chat with other players here!</span>
            </div>
          ) : (
            chatMessages
              .filter(msg => !mutedPlayerIds.includes(msg.senderId))
              .map((msg) => {
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
                  {/* Sender Avatar */}
                  <span className="w-7.5 h-7.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-sm shadow-sm select-none shrink-0 self-end">
                    {msg.senderAvatar}
                  </span>

                  {/* Message Bubble Column */}
                  <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
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
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Panel */}
        {(() => {
          const myOnlinePlayer = onlinePlayers.find(p => p.id === myPlayerId);
          const isRestricted = myOnlinePlayer?.isMuted || false;
          return (
            <form
              onSubmit={handleSend}
              className="p-4 border-t border-white/5 bg-brand-dark/40 flex items-center gap-2 select-none"
            >
              <input
                type="text"
                maxLength={100}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isRestricted}
                placeholder={isRestricted ? "You are restricted from chatting by host" : "Type a message..."}
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
        })()}
      </div>
    </>
  );
};
