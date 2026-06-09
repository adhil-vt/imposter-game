import React from 'react';
import { useGame } from '../context/GameContext';
import { Button } from './Button';
import { X, ShieldAlert, UserMinus, ShieldCheck, VolumeX, Volume2, Shield } from 'lucide-react';
import { playClick } from '../utils/sounds';

interface PlayerModerationModalProps {
  playerId: string;
  playerName: string;
  playerAvatar: string;
  playerIsAdmin: boolean;
  onClose: () => void;
}

export const PlayerModerationModal: React.FC<PlayerModerationModalProps> = ({
  playerId,
  playerName,
  playerAvatar,
  playerIsAdmin,
  onClose,
}) => {
  const {
    myPlayerId,
    isLobbyAdmin,
    mutedPlayerIds,
    toggleMutePlayer,
    kickPlayer,
    banPlayer,
    transferHost,
  } = useGame();

  const isMe = playerId === myPlayerId;
  const isMuted = mutedPlayerIds.includes(playerId);

  const handleKick = () => {
    playClick();
    kickPlayer(playerId);
    onClose();
  };

  const handleBan = () => {
    playClick();
    banPlayer(playerId);
    onClose();
  };

  const handlePassHost = () => {
    playClick();
    transferHost(playerId);
    onClose();
  };

  const handleToggleMute = () => {
    toggleMutePlayer(playerId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-sm rounded-3xl glass-panel border border-white/10 bg-brand-card p-6 shadow-2xl animate-scale-in relative">
        
        {/* Close Button */}
        <button
          onClick={() => {
            playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Player Avatar */}
        <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl mx-auto mb-4 relative shadow-inner">
          {playerAvatar}
          {playerIsAdmin && (
            <div className="absolute -top-1.5 -right-1.5 bg-brand-warning text-brand-dark rounded-full p-1 border border-brand-card">
              <Shield className="w-3.5 h-3.5 fill-current" />
            </div>
          )}
        </div>

        {/* Profile Details */}
        <h3 className="text-xl font-black text-white tracking-wide text-center">
          {playerName}
        </h3>
        <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest text-center mt-1">
          {isMe ? 'You' : playerIsAdmin ? 'Lobby Host / Admin' : 'Lobby Member'}
        </p>

        {/* Action Panel */}
        <div className="flex flex-col gap-2.5 mt-6 w-full">
          {!isMe && (
            <Button
              variant="glass"
              onClick={handleToggleMute}
              className="w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-white/10 hover:bg-white/10"
            >
              {isMuted ? (
                <>
                  <Volume2 className="w-4 h-4 text-brand-accent animate-pulse" />
                  Unmute Player Chat
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-brand-warning" />
                  Mute Player Chat
                </>
              )}
            </Button>
          )}

          {!isMe && isLobbyAdmin && (
            <>
              {/* Pass Host */}
              <Button
                variant="primary-glass"
                onClick={handlePassHost}
                className="w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-brand-primary" />
                Make Lobby Host
              </Button>

              {/* Kick player */}
              <button
                onClick={handleKick}
                className="w-full py-3 text-xs font-bold flex items-center justify-center gap-2 bg-brand-danger/10 border border-brand-danger/20 text-brand-danger hover:bg-brand-danger/20 hover:border-brand-danger/30 transition-all cursor-pointer inline-flex items-center justify-center rounded-2xl active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:ring-offset-2 focus:ring-offset-brand-dark"
              >
                <UserMinus className="w-4 h-4" />
                Kick Player
              </button>

              {/* Ban player */}
              <Button
                variant="danger"
                onClick={handleBan}
                className="w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-brand-danger/10"
              >
                <ShieldAlert className="w-4 h-4" />
                Ban Player (Block re-entry)
              </Button>
            </>
          )}

          {isMe && (
            <div className="text-center py-4 bg-white/[0.01] border border-dashed border-white/10 rounded-xl mt-2 select-none">
              <span className="text-xs text-slate-500 font-bold">You cannot moderate yourself!</span>
            </div>
          )}

          <Button
            variant="glass"
            onClick={() => {
              playClick();
              onClose();
            }}
            className="w-full py-3 rounded-xl text-xs font-bold mt-2"
          >
            Cancel
          </Button>
        </div>

      </div>
    </div>
  );
};
