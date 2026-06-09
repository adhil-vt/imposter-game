import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'glass' | 'danger' | 'success' | 'primary-glass' | 'secondary-glass';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  animateHover?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  animateHover = true,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:ring-offset-2 focus:ring-offset-brand-dark';
  
  const variants = {
    primary: 'bg-gradient-to-r from-brand-primary to-violet-600 text-white shadow-lg shadow-brand-primary/25 hover:shadow-brand-primary/40 hover:brightness-110 border border-white/10',
    secondary: 'bg-gradient-to-r from-brand-secondary to-pink-600 text-white shadow-lg shadow-brand-secondary/25 hover:shadow-brand-secondary/40 hover:brightness-110 border border-white/10',
    glass: 'bg-white/5 border border-white/10 text-slate-200 hover:bg-white/10 hover:text-white backdrop-blur-md',
    success: 'bg-gradient-to-r from-emerald-500 to-brand-accent text-white shadow-lg shadow-brand-accent/25 hover:shadow-brand-accent/40 border border-white/10',
    danger: 'bg-gradient-to-r from-red-500 to-brand-danger text-white shadow-lg shadow-brand-danger/25 hover:shadow-brand-danger/40 border border-white/10',
    'primary-glass': 'bg-brand-primary/10 border border-brand-primary/20 text-slate-200 hover:bg-brand-primary/20 hover:border-brand-primary/40 hover:text-white backdrop-blur-md',
    'secondary-glass': 'bg-brand-secondary/10 border border-brand-secondary/20 text-slate-200 hover:bg-brand-secondary/20 hover:border-brand-secondary/40 hover:text-white backdrop-blur-md',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-xl',
    md: 'px-6 py-3.5 text-base',
    lg: 'px-8 py-4 text-lg rounded-2xl',
  };

  const hoverAnimation = animateHover ? 'hover:-translate-y-0.5' : '';
  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${hoverAnimation} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
