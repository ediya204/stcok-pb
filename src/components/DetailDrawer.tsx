import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { cn } from '../lib/utils';

interface DetailDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function DetailDrawer({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  className,
}: DetailDrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[90] bg-huobi-text/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ type: 'tween', duration: 0.2 }}
            className={cn(
              'fixed right-0 top-0 bottom-0 z-[100] w-full max-w-md bg-white border-l border-huobi-border shadow-2xl flex flex-col',
              className
            )}
          >
            <div className="p-6 border-b border-huobi-border flex items-start justify-between gap-4">
              <div className="flex flex-col gap-0.5 min-w-0">
                <h3 className="text-lg font-bold text-huobi-text">{title}</h3>
                {subtitle && (
                  <span className="text-[11px] text-huobi-muted">{subtitle}</span>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-gray-100 text-huobi-muted hover:text-huobi-text transition-colors shrink-0"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              {children}
            </div>
            {footer && (
              <div className="p-6 border-t border-huobi-border bg-huobi-card/30">
                {footer}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
