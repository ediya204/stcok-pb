import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';
import { cn } from '../lib/utils';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  /** Optional primary action */
  actionLabel?: string;
  onAction?: () => void;
  /** Optional secondary hint */
  hint?: string;
  className?: string;
  compact?: boolean;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  hint,
  className,
  compact = false,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center rounded-2xl border border-huobi-border bg-huobi-card/50',
        compact ? 'py-8 px-6' : 'py-12 md:py-16 px-6',
        className
      )}
    >
      <div className="w-12 h-12 rounded-2xl bg-huobi-muted/10 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-huobi-muted" />
      </div>
      <h3 className="text-sm font-bold text-huobi-text">{title}</h3>
      {description && (
        <p className="mt-1 text-[11px] text-huobi-muted max-w-sm leading-relaxed">
          {description}
        </p>
      )}
      {hint && (
        <p className="mt-2 text-[10px] text-huobi-muted/80 uppercase tracking-wider font-bold">
          {hint}
        </p>
      )}
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 px-5 py-2.5 bg-huobi-blue text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-huobi-blue/90 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
