import React from 'react';
import { cn } from '../lib/utils';

export interface SummaryItem {
  label: string;
  value: string | number;
  tone?: 'up' | 'down' | 'neutral';
}

interface SummaryBarProps {
  items: SummaryItem[];
  className?: string;
}

export function SummaryBar({ items, className }: SummaryBarProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-6 py-3 px-4 rounded-xl bg-huobi-card/60 border border-huobi-border',
        className
      )}
    >
      {items.map((item, i) => (
        <div key={i} className="flex items-baseline gap-2">
          <span className="text-[10px] font-bold text-huobi-muted uppercase tracking-wider">
            {item.label}
          </span>
          <span
            className={cn(
              'text-sm font-bold font-mono',
              item.tone === 'up' && 'text-huobi-up',
              item.tone === 'down' && 'text-huobi-down',
              item.tone === 'neutral' && 'text-huobi-text'
            )}
          >
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}
