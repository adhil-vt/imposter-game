import React from 'react';
import { useGame } from '../context/GameContext';
import { Card } from '../components/Card';
import { playClick } from '../utils/sounds';
import { UserCheck } from 'lucide-react';

export const VotingPage: React.FC = () => {
  const {
    players,
    playerOrder,
    currentVoterIndex,
    submitVote,
  } = useGame();

  const voterId = playerOrder[currentVoterIndex];
  const voter = players.find(p => p.id === voterId);

  if (!voter) return null;

  // Filter out the active voter to prevent self-voting
  const candidates = players.filter(p => p.id !== voterId);

  const handleSelectCandidate = (candidateId: string) => {
    // Play button click pluck
    playClick();
    
    // Instantly submit vote (direct voting)
    submitVote(candidateId);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6 py-6 animate-fade-in">
      <div className="ambient-glow-2 bottom-20 left-10 animate-float-delayed" />

      <div className="w-full max-w-md flex flex-col gap-6 z-10">
        
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-primary/15 text-brand-primary border border-brand-primary/20 mb-3 uppercase tracking-widest">
            <UserCheck className="w-3.5 h-3.5" />
            Voter {currentVoterIndex + 1} of {playerOrder.length}
          </div>
          
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="text-2xl">{voter.avatar}</span>
            <h2 className="text-3xl font-black text-white tracking-wide">
              {voter.name}
            </h2>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Who is the Impostor? Tap a suspect to vote.
          </p>
        </div>

        {/* Candidate List Card */}
        <Card className="p-5 border-white/5 bg-brand-card/50">
          <div className="grid grid-cols-1 gap-2.5">
            {candidates.map(candidate => (
              <button
                key={candidate.id}
                onClick={() => handleSelectCandidate(candidate.id)}
                className="w-full text-left p-4 rounded-2xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white hover:border-brand-primary/30 active:scale-[0.99] transition-all duration-300 flex items-center justify-between font-bold"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-lg">
                    {candidate.avatar}
                  </div>
                  <span>{candidate.name}</span>
                </div>

                <div className="w-5 h-5 rounded-full border border-white/20 hover:border-brand-primary flex items-center justify-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-transparent hover:bg-brand-primary/30" />
                </div>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
export {};
