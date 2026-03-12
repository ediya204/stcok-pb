import React from 'react';
import { cn } from '../lib/utils';

export interface PageHeaderAction {
  label: string;
  onClick: () => void;
  primary?: boolean;
  disabled?: boolean;
}

interface PageHeaderProps {
  /** Section label (small caps, e.g. "Trading Workspace") */
  sectionLabel?: string;
  /** Main page title */
  title: string;
  /** Optional subtitle / description */
  subtitle?: string;
  /** Optional actions (buttons) on the right */
  actions?: PageHeaderAction[];
  /** Optional right-side content (e.g. stats strip) */
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  sectionLabel,
  title,
  subtitle,
  actions,
  children,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col md:flex-row md:items-center md:justify-between gap-4',
        className
      )}
    >
      <div className="flex flex-col gap-1 min-w-0">
        {sectionLabel && (
          <div className="ty-label-lg text-huobi-blue">
            {sectionLabel}
          </div>
        )}
        <h1 className="ty-headline-lg md:ty-display-sm text-huobi-text">
          {title}
        </h1>
        {subtitle && (
          <p className="ty-body-md text-huobi-muted max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>
      {(actions?.length || children) && (
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {actions?.map((action, i) => (
            <button
              key={i}
              type="button"
              onClick={action.onClick}
              disabled={action.disabled}
              className={cn(
                'px-4 py-2.5 rounded-xl ty-title-sm tracking-[0.12em] uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed',
                action.primary
                  ? 'bg-huobi-blue text-white hover:bg-huobi-blue/90'
                  : 'bg-huobi-card border border-huobi-border text-huobi-text hover:bg-huobi-border'
              )}
            >
              {action.label}
            </button>
          ))}
          {children}
        </div>
      )}
    </div>
  );
}
