
class AlltickService {
  private ws: WebSocket | null = null;
  private heartbeatTimer: number | null = null;
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
    // 股票专用 websocket 通道
    const url = `wss://quote.alltick.co/quote-stock-b-ws-api?token=${this.token}`;
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      console.log('Alltick stock WebSocket connected');
      this.reconnectAttempts = 0;

      // 启动心跳（官方要求 10s 一次，30s 内无心跳会断开）
      if (this.heartbeatTimer !== null) {
        clearInterval(this.heartbeatTimer);
      }
      this.heartbeatTimer = window.setInterval(() => {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
        const heartbeat = {
          cmd_id: 22000,
          seq_id: Date.now(),
          trace: `hb-${Date.now()}`,
          data: {},
        };
        this.ws.send(JSON.stringify(heartbeat));
      }, 10_000);

      // Re-subscribe to existing symbols
      if (this.subscribedSymbols.size > 0) {
        this.sendSubscription(Array.from(this.subscribedSymbols));
      }
    };

    this.ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        // 股票 tick 推送（示例协议：cmd_id 22998，data.code / data.price 等）
        if (msg.cmd_id === 22998 && msg.data && msg.data.code && msg.data.price) {
          const code: string = msg.data.code; // 例如 "2442.HK"
          const last = String(msg.data.price);
          const open = String(msg.data.open_price ?? last);
          const high = String(msg.data.high_price ?? last);
          const low = String(msg.data.low_price ?? last);
          const prevClose = String(msg.data.prev_close_price ?? open);
          const volume = String(msg.data.volume ?? '0');
          const ts = Number(msg.data.tick_time ?? Date.now() / 1000);

          const symbolCallbacks = this.callbacks.get(code);
          if (symbolCallbacks && symbolCallbacks.length > 0) {
            symbolCallbacks.forEach(cb =>
              cb({
                symbol: code,
                last_price: last,
                open_price: open,
                high_price: high,
                low_price: low,
                prev_close_price: prevClose,
                volume,
                timestamp: ts,
              }),
            );
          }
        }
      } catch (e) {
        console.error('Error parsing Alltick message:', e);
      }
    };

    this.ws.onclose = () => {
      console.log('Alltick stock WebSocket closed');
      if (this.heartbeatTimer !== null) {
        clearInterval(this.heartbeatTimer);
        this.heartbeatTimer = null;
      }
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
    this.sendSubscription([symbol]);
  }

  private sendSubscription(symbols: string[]) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN || symbols.length === 0) return;

    const payload = {
      cmd_id: 22004,
      seq_id: Date.now(),
      trace: `sub-${Date.now()}`,
      data: {
        symbol_list: symbols.map(code => ({ code })),
      },
    };

    this.ws.send(JSON.stringify(payload));
  }

  subscribe(symbol: string, callback: TickerCallback) {
    const formattedSymbol = this.formatSymbol(symbol);
    
    const existing = this.callbacks.get(formattedSymbol) ?? [];
    existing.push(callback);
    this.callbacks.set(formattedSymbol, existing);

    if (!this.subscribedSymbols.has(formattedSymbol)) {
      this.subscribedSymbols.add(formattedSymbol);
      this.sendSubscription([formattedSymbol]);
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
    // 纯数字按港股代码处理，使用实际交易代码 + .HK，例如 "02442" -> "2442.HK"
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
    // 股票 K 线接口：quote-stock-b-api/kline
    const klineTypeMap: Record<string, number> = {
      '1min': 1,
      '5min': 5,
      '15min': 15,
      '60min': 60,
      '1d': 1440,
    };
    const kType = klineTypeMap[type] ?? 1;

    const query = encodeURIComponent(
      JSON.stringify({
        trace: `k-${Date.now()}`,
        data: {
          code: formattedSymbol, // 例如 "2442.HK"
          kline_type: kType,
          kline_timestamp_end: 0,
          query_kline_num: 200,
          adjust_type: 0,
        },
      }),
    );

    const url = `https://quote.alltick.co/quote-stock-b-api/kline?token=${this.token}&query=${query}`;
    
    try {
      const response = await fetch(url);
      const result = await response.json();
      if (result.ret === 200 && result.data && Array.isArray(result.data.kline_list)) {
        return result.data.kline_list.map((item: any) => ({
          time: new Date(Number(item.timestamp) * 1000).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          open: parseFloat(item.open_price),
          close: parseFloat(item.close_price),
          high: parseFloat(item.high_price),
          low: parseFloat(item.low_price),
          volume: parseFloat(item.volume ?? '0'),
        }));
      }
    } catch (e) {
      console.error('Error fetching Alltick kline:', e);
    }
    return [];
  }
}

export const alltickService = new AlltickService();
