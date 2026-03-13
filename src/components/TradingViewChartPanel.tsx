import React, { useEffect, useRef } from 'react';
import { getTradingViewSymbol } from '../utils/symbolMapping';

const TV_SCRIPT_SRC = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';

export interface TradingViewChartPanelProps {
  /** Internal symbol e.g. "00700" or "BTCUSDT" */
  symbol: string;
  interval?: '1' | '5' | '15' | '30' | '60' | '240' | 'D' | 'W';
  theme?: 'light' | 'dark';
  height?: number | string;
  className?: string;
}

export function TradingViewChartPanel({
  symbol,
  interval = 'D',
  theme = 'light',
  height = 400,
  className = '',
}: TradingViewChartPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const tvSymbol = getTradingViewSymbol(symbol);
    const config = {
      autosize: true,
      symbol: tvSymbol,
      interval,
      timezone: 'Asia/Hong_Kong',
      theme,
      style: '1',
      locale: 'en',
      toolbar_bg: '#ffffff',
      enable_publishing: false,
      hide_side_toolbar: false,
      allow_symbol_change: false,
      save_image: false,
    };

    const widgetWrap = document.createElement('div');
    widgetWrap.className = 'tradingview-widget-container__widget';
    widgetWrap.style.height = typeof height === 'number' ? `${height}px` : height;
    widgetWrap.style.width = '100%';

    const script = document.createElement('script');
    script.src = TV_SCRIPT_SRC;
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify(config);

    container.innerHTML = '';
    container.appendChild(widgetWrap);
    container.appendChild(script);

    return () => {
      container.innerHTML = '';
    };
  }, [symbol, interval, theme, height]);

  return (
    <div
      ref={containerRef}
      className={`tradingview-widget-container ${className}`}
      style={{ minHeight: typeof height === 'number' ? height : 400 }}
    />
  );
}
