import React from 'react';
import { useGame } from '../context/GameContext';
import { Button } from './Button';
import { X, ShieldAlert, UserMinus, VolumeX, Volume2, Shield, MicOff, Headphones } from 'lucide-react';
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
    isMultiplayer,
    onlinePlayers,
    kickVotes,
    banVotes,
    voteToKickPlayer,
    voteToBanPlayer,
    lobbyAdminId,
    micMuted, toggleMicMute, deafenAll, toggleDeafenAll, deafenedPlayerIds, toggleDeafenPlayer
  } = useGame();

  const isMe = playerId === myPlayerId;
  const isMuted = mutedPlayerIds.includes(playerId);
  const isHostTarget = playerId === lobbyAdminId;

  const handleToggleMute = () => {
    toggleMutePlayer(playerId);
  };

  const handleVoteKick = () => {
    voteToKickPlayer(playerId);
  };

  const handleVoteBan = () => {
    voteToBanPlayer(playerId);
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

        {/* Action Panel */}
        <div className="flex flex-col gap-2.5 mt-6 w-full">

          {/* Mute Chat — available to everyone for any non-self player */}
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

          {/* Democratic Vote Moderation — available to everyone; guests/host cannot vote on the host */}
          {!isMe && isMultiplayer && !isHostTarget && (
            <div className="border border-white/5 bg-white/[0.01] rounded-2xl p-3 flex flex-col gap-2.5 mb-2 text-center select-none">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">
                Democratic Vote Moderation
              </span>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {/* Vote Kick Button */}
                <button
                  disabled={onlinePlayers.length < 3}
                  onClick={handleVoteKick}
                  className={`py-2 px-3 text-[11px] font-bold rounded-xl border flex flex-col items-center justify-center gap-1 transition-all active:scale-[0.97] cursor-pointer disabled:opacity-40 disabled:pointer-events-none ${
                    kickVotes[playerId]?.includes(myPlayerId)
                      ? 'bg-brand-primary/20 border-brand-primary text-white'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-slate-200'
                  }`}
                >
                  <UserMinus className="w-3.5 h-3.5" />
                  <span>
                    {kickVotes[playerId]?.includes(myPlayerId) ? 'Retract Kick' : 'Vote Kick'}
                  </span>
                  <span className="text-[9px] opacity-75 font-semibold leading-none mt-0.5">
                    {onlinePlayers.length >= 3
                      ? `${kickVotes[playerId]?.length || 0} / ${Math.floor(onlinePlayers.length / 2) + 1} votes`
                      : 'Need 3+ players'}
                  </span>
                </button>

                {/* Vote Ban Button */}
                <button
                  disabled={onlinePlayers.length < 3}
                  onClick={handleVoteBan}
                  className={`py-2 px-3 text-[11px] font-bold rounded-xl border flex flex-col items-center justify-center gap-1 transition-all active:scale-[0.97] cursor-pointer disabled:opacity-40 disabled:pointer-events-none ${
                    banVotes[playerId]?.includes(myPlayerId)
                      ? 'bg-brand-danger/20 border-brand-danger text-white'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-slate-200'
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>
                    {banVotes[playerId]?.includes(myPlayerId) ? 'Retract Ban' : 'Vote Ban'}
                  </span>
                  <span className="text-[9px] opacity-75 font-semibold leading-none mt-0.5">
                    {onlinePlayers.length >= 3
                      ? `${banVotes[playerId]?.length || 0} / ${Math.floor(onlinePlayers.length / 2) + 1} votes`
                      : 'Need 3+ players'}
                  </span>
                </button>
              </div>

              {/* Host-target notice */}
              {isHostTarget && !isMe && (
                <p className="text-[10px] text-slate-600 font-semibold mt-1">
                  You cannot vote to remove the host.
                </p>
              )}
            </div>
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
