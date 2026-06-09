import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ShieldAlert, Users, Eye, HelpCircle, Award, ChevronLeft, ChevronRight } from 'lucide-react';

interface RuleStep {
  title: string;
  icon: React.ReactNode;
  content: string;
  badge: string;
  color: string;
}

export const RulesPage: React.FC = () => {
  const { setGameState } = useGame();
  const [currentStep, setCurrentStep] = useState(0);

  const steps: RuleStep[] = [
    {
      title: "The Concept",
      icon: <Users className="w-10 h-10" />,
      content: "WhoIsFake is a local party game for 3 to 12 players. Most players receive a common secret word, but one player (the Impostor) receives a different but closely related word.",
      badge: "Step 1 of 5",
      color: "from-blue-500 to-indigo-500",
    },
    {
      title: "Secret Reveal",
      icon: <Eye className="w-10 h-10" />,
      content: "Pass the device around. Each player taps to reveal their word privately on the screen, memorizes it, hides it, and passes it to the next player until everyone knows their word.",
      badge: "Step 2 of 5",
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Give Clues",
      icon: <HelpCircle className="w-10 h-10" />,
      content: "One by one, players give a single verbal clue about their word. The clue should be clever enough to signal to other crewmates that you know the word, but not so obvious that the Impostor guesses it!",
      badge: "Step 3 of 5",
      color: "from-amber-500 to-orange-500",
    },
    {
      title: "Secret Voting",
      icon: <ShieldAlert className="w-10 h-10" />,
      content: "After clues are given, pass the device around again to vote. Each player secretly votes for the person they suspect is the Impostor. Self-voting is not allowed.",
      badge: "Step 4 of 5",
      color: "from-red-500 to-rose-500",
    },
    {
      title: "Reveal Winner",
      icon: <Award className="w-10 h-10" />,
      content: "If the Impostor receives the absolute most votes, the Crewmates win! If there is a tie or someone else gets the most votes, the Impostor successfully escapes and wins!",
      badge: "Step 5 of 5",
      color: "from-emerald-500 to-teal-500",
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setGameState('HOME');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const activeStep = steps[currentStep];

  return (
    <div className="w-full my-auto flex flex-col items-center px-6 py-8 relative">
      <div className="ambient-glow-1 top-20 right-10 animate-float" />
      <div className="ambient-glow-2 bottom-20 left-10 animate-float-delayed" />

      <div className="w-full max-w-md flex flex-col gap-6 z-10">
        <div className="text-center">
          <h2 className="text-3xl font-black text-white tracking-wide">
            How to Play
          </h2>
          <p className="text-sm text-slate-400 mt-1">Learn the ropes of WhoIsFake</p>
        </div>

        {/* Dynamic Carousel Slide */}
        <Card className="p-8 min-h-[340px] flex flex-col justify-between border-brand-primary/10 bg-brand-card/70 relative">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xs font-bold text-brand-primary tracking-widest uppercase">
              {activeStep.badge}
            </span>
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${activeStep.color} flex items-center justify-center text-white shadow-lg`}>
              {activeStep.icon}
            </div>
          </div>

          <div className="my-auto">
            <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">
              {activeStep.title}
            </h3>
            <p className="text-base text-slate-300 leading-relaxed font-normal">
              {activeStep.content}
            </p>
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-1.5 mt-8">
            {steps.map((_, i) => (
              <span 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentStep ? 'w-6 bg-brand-primary' : 'w-1.5 bg-white/10'
                }`}
              />
            ))}
          </div>
        </Card>

        {/* Navigation buttons */}
        <div className="flex gap-4">
          {currentStep > 0 ? (
            <Button 
              variant="glass" 
              onClick={handleBack} 
              className="flex-1 py-3.5 rounded-2xl"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back
            </Button>
          ) : (
            <Button 
              variant="glass" 
              onClick={() => setGameState('HOME')} 
              className="flex-1 py-3.5 rounded-2xl"
            >
              Skip
            </Button>
          )}

          <Button 
            variant="primary" 
            onClick={handleNext} 
            className="flex-1 py-3.5 rounded-2xl"
          >
            {currentStep === steps.length - 1 ? 'Got it!' : 'Next'}
            {currentStep < steps.length - 1 && <ChevronRight className="w-5 h-5 ml-1" />}
          </Button>
        </div>
      </div>
    </div>
  );
};
