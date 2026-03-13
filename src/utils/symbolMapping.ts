/**
 * Maps internal symbols to TradingView widget symbols and display names.
 * HK stocks: internal "00700" -> TV "HKEX:700", display "Tencent"
 * Crypto: internal "BTCUSDT" -> TV "BINANCE:BTCUSDT", display "Bitcoin"
 */

export interface SymbolInfo {
  name: string;
  tvSymbol: string;
  /** e.g. "HKD" for HK, "USDT" for crypto */
  quoteCurrency?: string;
}

const HK_MAP: Record<string, SymbolInfo> = {
  '02442': { name: 'Easy Smart Group', tvSymbol: 'HKEX:2442', quoteCurrency: 'HKD' },
  '09988': { name: 'Alibaba', tvSymbol: 'HKEX:9988', quoteCurrency: 'HKD' },
  '03690': { name: 'Meituan', tvSymbol: 'HKEX:3690', quoteCurrency: 'HKD' },
  '01211': { name: 'BYD Company', tvSymbol: 'HKEX:1211', quoteCurrency: 'HKD' },
  '00005': { name: 'HSBC Holdings', tvSymbol: 'HKEX:5', quoteCurrency: 'HKD' },
  '02318': { name: 'Ping An', tvSymbol: 'HKEX:2318', quoteCurrency: 'HKD' },
  '00388': { name: 'HKEX', tvSymbol: 'HKEX:388', quoteCurrency: 'HKD' },
  '01810': { name: 'Xiaomi', tvSymbol: 'HKEX:1810', quoteCurrency: 'HKD' },
};

const CRYPTO_MAP: Record<string, SymbolInfo> = {
  BTCUSDT: { name: 'Bitcoin', tvSymbol: 'BINANCE:BTCUSDT', quoteCurrency: 'USDT' },
};

export function getSymbolInfo(symbol: string): SymbolInfo {
  const normalized = symbol.toUpperCase();
  return (
    HK_MAP[normalized] ??
    CRYPTO_MAP[normalized] ?? {
      name: symbol,
      tvSymbol: normalized.includes('USDT') ? `BINANCE:${normalized}` : `HKEX:${normalized.replace(/^0+/, '')}`,
    }
  );
}

export function getTradingViewSymbol(symbol: string): string {
  return getSymbolInfo(symbol).tvSymbol;
}

export function getSymbolDisplayName(symbol: string): string {
  return getSymbolInfo(symbol).name;
}
