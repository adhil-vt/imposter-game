import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Button } from './Button';
import { X, ShieldAlert, UserMinus, VolumeX, Volume2, Shield, Vote, MicOff, Headphones } from 'lucide-react';
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
    mutedPlayerIds,
    toggleMutePlayer,
    kickPlayer,
    banPlayer,
    startVoteKick,
    startVoteBan,
    gameState,
    isLobbyAdmin,
    micMuted,
    toggleMicMute,
    deafenAll,
    toggleDeafenAll,
  } = useGame();

  const isMe = playerId === myPlayerId;
  const isMuted = mutedPlayerIds.includes(playerId);
  const isInLobby = gameState === 'SETUP';

  // Reason input state for host direct actions in lobby
  const [showReasonInput, setShowReasonInput] = useState<'kick' | 'ban' | null>(null);
  const [reason, setReason] = useState('');

  const handleToggleMute = () => {
    toggleMutePlayer(playerId);
  };

  const handleVoteKick = () => {
    playClick();
    startVoteKick(playerId);
    onClose();
  };

  const handleVoteBan = () => {
    playClick();
    startVoteBan(playerId);
    onClose();
  };

  const handleDirectKick = () => {
    playClick();
    setShowReasonInput('kick');
  };

  const handleDirectBan = () => {
    playClick();
    setShowReasonInput('ban');
  };

  const handleConfirmAction = () => {
    playClick();
    if (showReasonInput === 'kick') {
      kickPlayer(playerId, reason.trim() || undefined);
    } else if (showReasonInput === 'ban') {
      banPlayer(playerId, reason.trim() || undefined);
    }
    onClose();
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
          {isMe && (
            <div className="flex flex-col gap-2.5 mt-2">
              <Button
                variant="glass"
                onClick={() => toggleMicMute()}
                className="w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-white/10 hover:bg-white/10"
              >
                {micMuted ? (
                  <>
                    <MicOff className="w-4 h-4 text-brand-warning" />
                    Unmute Microphone
                  </>
                ) : (
                  <>
                    <MicOff className="w-4 h-4 text-slate-300" />
                    Mute Microphone
                  </>
                )}
              </Button>

              <Button
                variant="glass"
                onClick={() => toggleDeafenAll()}
                className="w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-white/10 hover:bg-white/10"
              >
                {deafenAll ? (
                  <>
                    <Headphones className="w-4 h-4 text-brand-accent animate-pulse" />
                    Undeafen
                  </>
                ) : (
                  <>
                    <Headphones className="w-4 h-4 text-slate-300" />
                    Deafen All
                  </>
                )}
              </Button>
            </div>
          )}
        <h3 className="text-xl font-black text-white tracking-wide text-center">
          {playerName}
        </h3>
        <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest text-center mt-1">
          {isMe ? 'You' : playerIsAdmin ? 'Lobby Host / Admin' : 'Lobby Member'}
        </p>

        {/* Reason Input Panel */}
        {showReasonInput && (
          <div className="flex flex-col gap-3 mt-6 w-full animate-fade-in">
            <p className="text-xs text-slate-300 font-bold text-center">
              {showReasonInput === 'ban' ? 'Ban' : 'Kick'} Reason (optional)
            </p>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason..."
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/30"
              autoFocus
            />
            <div className="flex gap-2">
              <Button
                variant="glass"
                onClick={() => {
                  playClick();
                  setShowReasonInput(null);
                  setReason('');
                }}
                className="flex-1 py-3 rounded-xl text-xs font-bold cursor-pointer"
              >
                Back
              </Button>
              <Button
                variant={showReasonInput === 'ban' ? 'danger' : 'primary'}
                onClick={handleConfirmAction}
                className={`flex-1 py-3 rounded-xl text-xs font-bold cursor-pointer ${
                  showReasonInput === 'ban' ? 'shadow-md shadow-brand-danger/10' : ''
                }`}
              >
                Confirm {showReasonInput === 'ban' ? 'Ban' : 'Kick'}
              </Button>
            </div>
          </div>
        )}

        {/* Action Panel */}
        {!showReasonInput && (
          <div className="flex flex-col gap-2.5 mt-6 w-full">
            {/* Mute - available to everyone */}
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

            {/* Democratic Vote Moderation - available to all players during gameplay */}
            {!isMe && !isInLobby && (
              <>
                <div className="mt-2 mb-1">
                  <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest text-center">
                    Democratic Vote Moderation
                  </p>
                  <div className="w-12 h-px bg-white/10 mx-auto mt-1.5" />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleVoteKick}
                    className="flex-1 py-3 text-xs font-bold flex flex-col items-center justify-center gap-1.5 bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-all cursor-pointer rounded-2xl active:scale-[0.98]"
                  >
                    <Vote className="w-4 h-4" />
                    Vote Kick
                    <span className="text-[9px] text-slate-500">Need 3 to pass</span>
                  </button>
                  <button
                    onClick={handleVoteBan}
                    className="flex-1 py-3 text-xs font-bold flex flex-col items-center justify-center gap-1.5 bg-brand-danger/5 border border-brand-danger/15 text-brand-danger hover:bg-brand-danger/10 hover:border-brand-danger/25 transition-all cursor-pointer rounded-2xl active:scale-[0.98]"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    Vote Ban
                    <span className="text-[9px] text-slate-500">Need 3+ votes</span>
                  </button>
                </div>
              </>
            )}

            {/* Host-only direct actions in lobby */}
            {!isMe && isInLobby && isLobbyAdmin && (
              <>
                <div className="mt-2 mb-1">
                  <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest text-center">
                    Host Actions
                  </p>
                  <div className="w-12 h-px bg-white/10 mx-auto mt-1.5" />
                </div>

                <button
                  onClick={handleDirectKick}
                  className="w-full py-3 text-xs font-bold flex items-center justify-center gap-2 bg-brand-warning/10 border border-brand-warning/20 text-brand-warning hover:bg-brand-warning/20 hover:border-brand-warning/30 transition-all cursor-pointer rounded-2xl active:scale-[0.98]"
                >
                  <UserMinus className="w-4 h-4" />
                  Kick Player
                </button>

                <Button
                  variant="danger"
                  onClick={handleDirectBan}
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
        )}

      </div>
    </div>
  );
};
