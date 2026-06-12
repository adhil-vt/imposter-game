import React from 'react';
import { useGame } from '../context/GameContext';
import { Button } from './Button';
import { AlertTriangle, ShieldAlert, UserMinus, LogOut, Info } from 'lucide-react';

export const ConfirmModal: React.FC = () => {
  const { confirmConfig, closeConfirm } = useGame();

  if (!confirmConfig || !confirmConfig.isOpen) return null;

  const { title, message, confirmText = 'Confirm', cancelText = 'Cancel', onConfirm } = confirmConfig;

  // Determine if this is a destructive warning (e.g., contains 'clear', 'delete', 'end', 'reset', 'kick', 'ban')
  const isDestructive = 
    title.toLowerCase().includes('clear') || 
    title.toLowerCase().includes('delete') || 
    title.toLowerCase().includes('end') || 
    title.toLowerCase().includes('reset') ||
    title.toLowerCase().includes('kick') ||
    title.toLowerCase().includes('ban');

  const showCancel = cancelText !== '';

  // Select dynamic context-aware icon based on status
  const getIcon = () => {
    const t = title.toLowerCase();
    if (t.includes('ban')) {
      return <ShieldAlert className="w-7 h-7 text-brand-danger" />;
    }
    if (t.includes('kick')) {
      return <UserMinus className="w-7 h-7 text-brand-warning" />;
    }
    if (t.includes('disconnect') || t.includes('leave') || t.includes('end')) {
      return <LogOut className="w-7 h-7 text-slate-400" />;
    }
    if (t.includes('unable') || t.includes('progress')) {
      return <Info className="w-7 h-7 text-brand-primary" />;
    }
    return <AlertTriangle className="w-7 h-7 text-brand-warning" />;
  };

  const getIconContainerStyle = () => {
    const t = title.toLowerCase();
    if (t.includes('ban')) {
      return 'bg-brand-danger/10 border-brand-danger/30 text-brand-danger shadow-brand-danger/5';
    }
    if (t.includes('kick')) {
      return 'bg-brand-warning/10 border-brand-warning/30 text-brand-warning shadow-brand-warning/5';
    }
    if (t.includes('disconnect') || t.includes('leave') || t.includes('end')) {
      return 'bg-white/5 border-white/10 text-slate-400';
    }
    if (t.includes('unable') || t.includes('progress')) {
      return 'bg-brand-primary/10 border-brand-primary/30 text-brand-primary shadow-brand-primary/5';
    }
    return isDestructive
      ? 'bg-brand-danger/10 border-brand-danger/30 text-brand-danger shadow-brand-danger/5'
      : 'bg-brand-warning/10 border-brand-warning/30 text-brand-warning shadow-brand-warning/5';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-sm rounded-3xl glass-panel border border-white/10 bg-brand-card p-6 text-center shadow-2xl animate-scale-in">
        {/* Dynamic Context-Aware Icon Banner */}
        <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse border ${getIconContainerStyle()}`}>
          {getIcon()}
        </div>

        {/* Header Title */}
        <h3 className="text-xl font-black text-white tracking-wide">
          {title}
        </h3>

        {/* Descriptive message text — preserves newlines from \n in the message string */}
        <p className="text-xs text-slate-400 mt-2 px-2 leading-relaxed whitespace-pre-line">
          {message}
        </p>

        {/* Action Options Buttons */}
        <div className="flex gap-3 mt-6">
          {showCancel && (
            <Button
              variant="glass"
              onClick={closeConfirm}
              className="flex-1 py-3.5 rounded-xl font-bold text-xs cursor-pointer"
            >
              {cancelText}
            </Button>
          )}
          <Button
            variant="primary"
            onClick={onConfirm}
            className={`flex-1 py-3.5 rounded-xl font-extrabold text-xs cursor-pointer shadow-md ${
              isDestructive 
                ? 'bg-brand-danger border-brand-danger hover:bg-red-600 hover:border-red-600 shadow-brand-danger/25' 
                : 'bg-brand-primary border-brand-primary hover:bg-indigo-600 hover:border-indigo-600 shadow-brand-primary/25'
            }`}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};
