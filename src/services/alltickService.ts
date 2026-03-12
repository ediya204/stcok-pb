
export interface AlltickTicker {
  symbol: string;
  last_price: string;
  open_price: string;
  high_price: string;
  low_price: string;
  prev_close_price: string;
  volume: string;
  timestamp: number;
}

type TickerCallback = (data: AlltickTicker) => void;

class AlltickService {
  private ws: WebSocket | null = null;
  // 优先使用 VITE_ALLTICK_API_KEY，其次兼容 VITE_TICKAPI（对应你在平台上配置的 tickapi）
  private token: string =
    (import.meta as any).env.VITE_ALLTICK_API_KEY ||
    (import.meta as any).env.VITE_TICKAPI ||
    '';
  private callbacks: Map<string, TickerCallback[]> = new Map();
  private subscribedSymbols: Set<string> = new Set();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor() {
    if (this.token) {
      this.connect();
    }
  }

  private connect() {
    const url = `wss://quote.alltick.co/quote-b-ws-api?token=${this.token}`;
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      console.log('Alltick WebSocket connected');
      this.reconnectAttempts = 0;
      // Re-subscribe to existing symbols
      this.subscribedSymbols.forEach(symbol => {
        this.sendSubscription(symbol);
      });
    };

    this.ws.onmessage = (event) => {
      try {
        const response = JSON.parse(event.data);
        if (response.cmd === 'push' && response.msg_type === 'ticker') {
          const data = response.data as AlltickTicker;
          const symbolCallbacks = this.callbacks.get(data.symbol);
          if (symbolCallbacks) {
            symbolCallbacks.forEach(cb => cb(data));
          }
        }
      } catch (e) {
        console.error('Error parsing Alltick message:', e);
      }
    };

    this.ws.onclose = () => {
      console.log('Alltick WebSocket closed');
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        setTimeout(() => this.connect(), 2000 * this.reconnectAttempts);
      }
    };

    this.ws.onerror = (error) => {
      console.error('Alltick WebSocket error:', error);
    };
  }

  private sendSubscription(symbol: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const msg = {
        cmd: 'subscribe',
        args: [`ticker.${symbol}`]
      };
      this.ws.send(JSON.stringify(msg));
    }
  }

  subscribe(symbol: string, callback: TickerCallback) {
    const formattedSymbol = this.formatSymbol(symbol);
    
    if (!this.callbacks.has(formattedSymbol)) {
      this.callbacks.set(formattedSymbol, []);
    }
    this.callbacks.get(formattedSymbol)?.push(callback);

    if (!this.subscribedSymbols.has(formattedSymbol)) {
      this.subscribedSymbols.add(formattedSymbol);
      this.sendSubscription(formattedSymbol);
    }

    return () => this.unsubscribe(symbol, callback);
  }

  unsubscribe(symbol: string, callback: TickerCallback) {
    const formattedSymbol = this.formatSymbol(symbol);
    const symbolCallbacks = this.callbacks.get(formattedSymbol);
    if (symbolCallbacks) {
      const index = symbolCallbacks.indexOf(callback);
      if (index !== -1) {
        symbolCallbacks.splice(index, 1);
      }
      if (symbolCallbacks.length === 0) {
        this.callbacks.delete(formattedSymbol);
        this.subscribedSymbols.delete(formattedSymbol);
        // Alltick might not have an explicit unsubscribe cmd in some versions, 
        // but we can stop processing it locally.
      }
    }
  }

  private formatSymbol(symbol: string): string {
    // 纯数字按港股代码处理，例如 "00700" -> "700.HK"
    if (/^\d+$/.test(symbol)) {
      const num = parseInt(symbol, 10);
      if (!Number.isNaN(num)) {
        return `${num}.HK`;
      }
    }
    // 其他（如 BTCUSDT）按原始符号大写使用
    return symbol.toUpperCase();
  }

  async getKline(symbol: string, type: string = '1min'): Promise<any[]> {
    const formattedSymbol = this.formatSymbol(symbol);
    const url = `https://quote.alltick.co/quote-b-api/kline?token=${this.token}&symbol=${formattedSymbol}&kline_type=${type}`;
    
    try {
      const response = await fetch(url);
      const result = await response.json();
      if (result.code === 200 && result.data) {
        return result.data.map((item: any) => ({
          time: new Date(item.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          open: parseFloat(item.open),
          close: parseFloat(item.close),
          high: parseFloat(item.high),
          low: parseFloat(item.low),
          volume: parseFloat(item.volume)
        }));
      }
    } catch (e) {
      console.error('Error fetching Alltick kline:', e);
    }
    return [];
  }
}

export const alltickService = new AlltickService();
