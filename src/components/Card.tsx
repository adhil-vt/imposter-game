import React from 'react';

interface CardProps {
  children: React.ReactNode;
  hoverable?: boolean;
  animateEntrance?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverable = false,
  animateEntrance = true,
  className = '',
  onClick,
}) => {
  const entranceClass = animateEntrance ? 'animate-fade-in-up' : '';
  const hoverClass = hoverable ? 'glass-panel-hover cursor-pointer' : '';

  return (
    <div
      onClick={onClick}
      className={`glass-panel ${entranceClass} ${hoverClass} p-6 md:p-8 ${className}`}
    >
      {children}
    </div>
  );
};
