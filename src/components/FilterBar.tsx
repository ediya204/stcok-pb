import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '../lib/utils';

export interface FilterTab<T extends string = string> {
  id: T;
  label: string;
  count?: number;
}

interface FilterBarProps<T extends string = string> {
  tabs: FilterTab<T>[];
  activeTab: T;
  onTabChange: (id: T) => void;
  /** Optional search placeholder */
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  /** Optional right-side slot (e.g. Export, Refresh) */
  right?: React.ReactNode;
  className?: string;
}

export function FilterBar<T extends string = string>({
  tabs,
  activeTab,
  onTabChange,
  searchPlaceholder,
  searchValue = '',
  onSearchChange,
  right,
  className,
}: FilterBarProps<T>) {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-center justify-between gap-4',
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all',
              activeTab === tab.id
                ? 'bg-huobi-text text-white shadow-lg'
                : 'bg-huobi-card border border-huobi-border text-huobi-muted hover:text-huobi-text hover:bg-huobi-border'
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={cn(
                  'ml-1.5',
                  activeTab === tab.id ? 'opacity-90' : 'text-huobi-muted'
                )}
              >
                ({tab.count})
              </span>
            )}
          </button>
        ))}
        {onSearchChange && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-huobi-muted" />
            <input
              type="search"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl border border-huobi-border bg-huobi-card text-[11px] font-bold placeholder:text-huobi-muted focus:outline-none focus:border-huobi-blue min-w-[180px]"
            />
          </div>
        )}
      </div>
      {right && <div className="flex items-center gap-2">{right}</div>}
    </div>
  );
}
