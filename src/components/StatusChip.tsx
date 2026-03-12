import React from 'react';
import { cn } from '../lib/utils';

type StatusVariant =
  | 'pending'
  | 'auditing'
  | 'accepted'
  | 'processing'
  | 'completed'
  | 'rejected'
  | 'cancelled'
  | 'info'
  | 'warn'
  | 'success'
  | 'error';

const variantStyles: Record<StatusVariant, string> = {
  pending: 'bg-huobi-muted/10 text-huobi-muted',
  auditing: 'bg-huobi-blue/10 text-huobi-blue',
  accepted: 'bg-huobi-up/10 text-huobi-up',
  processing: 'bg-huobi-blue/10 text-huobi-blue animate-pulse',
  completed: 'bg-huobi-up/10 text-huobi-up font-bold',
  rejected: 'bg-huobi-down/10 text-huobi-down',
  cancelled: 'bg-huobi-muted/10 text-huobi-muted line-through',
  info: 'bg-sky-100 text-sky-700',
  warn: 'bg-amber-100 text-amber-700',
  success: 'bg-huobi-up/10 text-huobi-up',
  error: 'bg-huobi-down/10 text-huobi-down',
};

interface StatusChipProps {
  label: string;
  variant?: StatusVariant;
  className?: string;
}

export function StatusChip({ label, variant = 'pending', className }: StatusChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider',
        variantStyles[variant] || variantStyles.pending,
        className
      )}
    >
      {label}
    </span>
  );
}
