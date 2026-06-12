import React from 'react';
import { Bot, ShieldAlert, Crown, Edit3, UserMinus } from 'lucide-react';

/**
 * Renders a Lucide React icon instead of text/emoji for system actions,
 * while falling back to standard string display (for player emojis).
 */
export const renderAvatarIcon = (avatar: string, className = "w-4 h-4 text-brand-primary"): React.ReactNode => {
  switch (avatar) {
    case 'system-info':
    case '🤖':
      return <Bot className={className} />;
    case 'system-ban':
    case '🚫':
      return <ShieldAlert className={`${className} text-brand-danger`} />;
    case 'system-kick':
      return <UserMinus className={`${className} text-brand-warning`} />;
    case 'system-crown':
    case '👑':
      return <Crown className={`${className} text-brand-warning`} />;
    case 'system-edit':
    case '✏️':
      return <Edit3 className={className} />;
    default:
      return <span>{avatar}</span>;
  }
};
