import React from 'react';
import { useGame } from '../context/GameContext';
import { Button } from './Button';
import { Vote, ShieldAlert, UserMinus, ThumbsUp, ThumbsDown } from 'lucide-react';
import { playClick } from '../utils/sounds';

export const VoteModerationModal: React.FC = () => {
  const { activeVote, castModerationVote, myPlayerId, onlinePlayers } = useGame();

  if (!activeVote) return null;

  const alreadyVoted = myPlayerId in activeVote.votes;
  const isTarget = myPlayerId === activeVote.targetId;
  const eligibleVoters = onlinePlayers.filter(p => p.id !== activeVote.targetId);
  const totalEligible = eligibleVoters.length;
  const totalCast = Object.keys(activeVote.votes).length;
  const yesCount = Object.values(activeVote.votes).filter(v => v === 'yes').length;
  const noCount = Object.values(activeVote.votes).filter(v => v === 'no').length;

  const handleVoteYes = () => {
    playClick();
    castModerationVote('yes');
  };

  const handleVoteNo = () => {
    playClick();
    castModerationVote('no');
  };

  const actionLabel = activeVote.action === 'ban' ? 'Ban' : 'Kick';
  const ActionIcon = activeVote.action === 'ban' ? ShieldAlert : UserMinus;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-sm rounded-3xl glass-panel border border-white/10 bg-brand-card p-6 shadow-2xl animate-scale-in">
        
        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            activeVote.action === 'ban' 
              ? 'bg-brand-danger/15 border border-brand-danger/30' 
              : 'bg-brand-warning/15 border border-brand-warning/30'
          }`}>
            <Vote className={`w-5 h-5 ${activeVote.action === 'ban' ? 'text-brand-danger' : 'text-brand-warning'}`} />
          </div>
        </div>

        <h3 className="text-lg font-black text-white tracking-wide text-center">
          Vote to {actionLabel}
        </h3>

        <p className="text-sm text-slate-300 text-center mt-2 font-semibold">
          <ActionIcon className="w-4 h-4 inline mr-1" />
          {activeVote.targetName}
        </p>

        <p className="text-xs text-slate-400 text-center mt-1">
          Started by <span className="text-white font-semibold">{activeVote.initiatorName}</span>
        </p>

        {activeVote.reason && (
          <div className="mt-3 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Reason</p>
            <p className="text-xs text-slate-300">{activeVote.reason}</p>
          </div>
        )}

        {/* Progress */}
        <div className="mt-4 flex items-center justify-center gap-4 text-xs">
          <span className="text-brand-accent font-bold">{yesCount} Yes</span>
          <span className="text-slate-500">•</span>
          <span className="text-brand-danger font-bold">{noCount} No</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400">{totalCast}/{totalEligible} voted</span>
        </div>

        {/* Vote Buttons */}
        {!isTarget && !alreadyVoted && (
          <div className="flex gap-3 mt-5">
            <Button
              variant="glass"
              onClick={handleVoteNo}
              className="flex-1 py-3.5 rounded-xl font-bold text-xs cursor-pointer flex items-center justify-center gap-2 border border-brand-danger/20 hover:bg-brand-danger/10 text-brand-danger"
            >
              <ThumbsDown className="w-4 h-4" />
              No
            </Button>
            <Button
              variant="primary"
              onClick={handleVoteYes}
              className="flex-1 py-3.5 rounded-xl font-extrabold text-xs cursor-pointer flex items-center justify-center gap-2 shadow-md"
            >
              <ThumbsUp className="w-4 h-4" />
              Yes
            </Button>
          </div>
        )}

        {/* Already voted */}
        {!isTarget && alreadyVoted && (
          <div className="mt-5 text-center py-3 bg-white/[0.02] border border-dashed border-white/10 rounded-xl">
            <span className="text-xs text-slate-400 font-bold">
              You voted {activeVote.votes[myPlayerId] === 'yes' ? '👍 Yes' : '👎 No'} — waiting for others...
            </span>
          </div>
        )}

        {/* Target player view */}
        {isTarget && (
          <div className="mt-5 text-center py-3 bg-brand-danger/5 border border-brand-danger/15 rounded-xl">
            <span className="text-xs text-brand-danger font-bold">
              A vote has been started against you. Waiting for results...
            </span>
          </div>
        )}

      </div>
    </div>
  );
};
