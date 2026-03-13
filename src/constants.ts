export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  lotSize: number;
  high: number;
  low: number;
  marketCap: number;
  pe: number;
}

export const HK_STOCKS: Stock[] = [
  { symbol: "02442", name: "Easy Smart Group", price: 1.28, change: 0.03, changePercent: 2.40, volume: 2500000, lotSize: 2000, high: 1.30, low: 1.20, marketCap: 640000000, pe: 10.5 },
  { symbol: "09988", name: "Alibaba", price: 72.15, change: -1.2, changePercent: -1.64, volume: 45200000, lotSize: 100, high: 74.0, low: 71.5, marketCap: 1400000000000, pe: 12.8 },
  { symbol: "03690", name: "Meituan", price: 115.8, change: 2.3, changePercent: 2.03, volume: 18100000, lotSize: 100, high: 118.5, low: 112.4, marketCap: 720000000000, pe: 45.2 },
  { symbol: "01211", name: "BYD Company", price: 215.6, change: 4.8, changePercent: 2.28, volume: 5400000, lotSize: 500, high: 218.0, low: 210.5, marketCap: 620000000000, pe: 18.5 },
  { symbol: "00005", name: "HSBC Holdings", price: 62.35, change: 0.15, changePercent: 0.24, volume: 22800000, lotSize: 400, high: 63.1, low: 62.0, marketCap: 1200000000000, pe: 7.2 },
  { symbol: "02318", name: "Ping An", price: 35.45, change: -0.55, changePercent: -1.53, volume: 15900000, lotSize: 500, high: 36.2, low: 35.1, marketCap: 640000000000, pe: 6.8 },
  { symbol: "00388", name: "HKEX", price: 245.2, change: 3.1, changePercent: 1.28, volume: 2100000, lotSize: 100, high: 248.5, low: 242.0, marketCap: 310000000000, pe: 32.1 },
  { symbol: "01810", name: "Xiaomi", price: 15.24, change: 0.12, changePercent: 0.79, volume: 88400000, lotSize: 200, high: 15.5, low: 15.1, marketCap: 380000000000, pe: 22.4 },
];

export type RequestStatus = 
  | 'Pending' 
  | 'Auditing' 
  | 'Accepted' 
  | 'Processing'
  | 'Executed' 
  | 'Completed' 
  | 'Rejected' 
  | 'Cancelled';

export type IncomingTransferStatus = 
  | 'Pending Response'
  | 'Accepted'
  | 'Rejected'
  | 'Processing'
  | 'Completed';

export interface IncomingTransfer {
  id: string;
  symbol: string;
  name: string;
  amount: number;
  counterpartyCode: string;
  counterpartyName: string;
  time: string;
  status: IncomingTransferStatus;
  remarks?: string;
  refNo: string;
}

export const MOCK_INCOMING_TRANSFERS: IncomingTransfer[] = [
  {
    id: 'INC-001',
    symbol: '02442',
    name: 'Easy Smart Group',
    amount: 500,
    counterpartyCode: 'CP8801',
    counterpartyName: 'Goldman Sachs HK',
    time: '2024-03-12 09:30:00',
    status: 'Pending Response',
    refNo: 'ITR99281',
    remarks: 'Settlement for Q1 trade'
  },
  {
    id: 'INC-002',
    symbol: '09988',
    name: 'Alibaba',
    amount: 1200,
    counterpartyCode: 'CP8802',
    counterpartyName: 'Morgan Stanley Asia',
    time: '2024-03-12 10:15:00',
    status: 'Pending Response',
    refNo: 'ITR99282'
  }
];

export interface TradeRequest {
  id: string;
  symbol: string;
  type: 'Trade' | 'Transfer';
  side: 'Open' | 'Close' | 'Inbound' | 'Outbound';
  amount: number;
  price?: number;
  counterpartyCode?: string;
  counterpartyName?: string;
  status: RequestStatus;
  time: string;
  remarks?: string;
  refNo?: string;
}

export interface Position {
  symbol: string;
  name: string;
  total: number;
  available: number;
  frozen: number;
  processing: number;
  avgPrice: number;
  currentPrice: number;
}

export interface Counterparty {
  code: string;
  name: string;
  type: string;
}

export const COUNTERPARTIES: Counterparty[] = [
  { code: "CP8801", name: "Goldman Sachs HK", type: "Securities" },
  { code: "CP8802", name: "Morgan Stanley Asia", type: "Securities" },
  { code: "CP8803", name: "UBS Securities HK", type: "Securities" },
  { code: "CP9901", name: "CITIC Securities", type: "Broker" },
  { code: "CP9902", name: "CICC HK", type: "Broker" },
];

export const generateChartData = (basePrice: number) => {
  const data = [];
  let currentPrice = basePrice;
  const now = new Date();
  for (let i = 100; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60000);
    const change = (Math.random() - 0.5) * (basePrice * 0.01);
    const open = currentPrice;
    const close = currentPrice + change;
    const high = Math.max(open, close) + Math.random() * (basePrice * 0.002);
    const low = Math.min(open, close) - Math.random() * (basePrice * 0.002);
    data.push({
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      open,
      close,
      high,
      low,
      volume: Math.floor(Math.random() * 10000),
    });
    currentPrice = close;
  }
  return data;
};
