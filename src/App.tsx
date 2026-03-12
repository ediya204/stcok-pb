import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Bell, 
  User, 
  LayoutGrid, 
  Clock, 
  ChevronUp, 
  ChevronDown,
  ArrowRightLeft,
  Info,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowUpRight,
  Star,
  Share2,
  Download,
  RefreshCw,
  Globe,
  Moon,
  ChevronRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { 
  HK_STOCKS, 
  generateChartData, 
  type Stock, 
  type TradeRequest, 
  type Position, 
  type RequestStatus,
  COUNTERPARTIES,
  MOCK_INCOMING_TRANSFERS,
  type IncomingTransfer,
  type IncomingTransferStatus
} from './constants';
import { alltickService, type AlltickTicker } from './services/alltickService';

const DashboardView = () => {
  const balanceData = useMemo(() => [
    { name: '02.00', value: 13500 },
    { name: '04.00', value: 13200 },
    { name: '06.00', value: 13800 },
    { name: '08.00', value: 13400 },
    { name: '10.00', value: 13900 },
    { name: '12.00', value: 13839 },
  ], []);

  const btcData = useMemo(() => {
    const data = [];
    let base = 42800;
    for (let i = 0; i < 24; i++) {
      base += (Math.random() - 0.45) * 200;
      data.push({
        time: `${i.toString().padStart(2, '0')}:00`,
        price: base,
        volume: Math.floor(Math.random() * 5000) + 2000
      });
    }
    return data;
  }, []);

  return (
    <div className="flex-1 overflow-y-auto bg-[#F3F4F6] p-4 md:p-8 custom-scrollbar">
      <div className="max-w-[1600px] mx-auto flex flex-col gap-8">
        


        {/* Hero Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-huobi-blue uppercase tracking-[0.2em] mb-2">Overview</span>
            <h1 className="text-5xl md:text-7xl font-bold text-huobi-text tracking-tighter leading-[0.85]">
              Market <br />
              <span className="text-huobi-muted/40">Dashboard</span>
            </h1>
          </div>
          <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-huobi-border shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
            <div className="w-12 h-12 rounded-xl bg-huobi-blue/10 flex items-center justify-center overflow-hidden border border-huobi-blue/20">
              <img src="https://picsum.photos/seed/user/100/100" alt="User" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black text-huobi-text">James Bond</span>
              <span className="text-[11px] text-huobi-muted">Securities Account</span>
            </div>
            <div className="ml-4 p-2 bg-gray-50 rounded-lg group-hover:bg-huobi-blue/5 transition-colors">
              <ChevronRight className="w-4 h-4 text-huobi-muted group-hover:text-huobi-blue" />
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column - Balance & Portfolio */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Total Balance Card */}
              <div className="bg-white p-8 rounded-[2rem] border border-huobi-border shadow-sm flex flex-col gap-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-huobi-blue/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-huobi-blue/10 transition-colors" />
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-huobi-blue/10 flex items-center justify-center">
                      <LayoutGrid className="w-4 h-4 text-huobi-blue" />
                    </div>
                    <span className="text-sm font-bold text-huobi-muted">Total Balance</span>
                  </div>
                  <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <ArrowUpRight className="w-4 h-4 text-huobi-muted" />
                  </button>
                </div>
                <div className="flex flex-col gap-1 relative z-10">
                  <span className="text-5xl font-bold text-huobi-text tracking-tighter">$13,839.82</span>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-huobi-up/10 text-huobi-up rounded-full text-[10px] font-black">
                      <TrendingUp className="w-3 h-3" />
                      +2.72%
                    </div>
                    <span className="text-[10px] text-huobi-muted font-bold uppercase tracking-wider">vs last month</span>
                  </div>
                </div>
                <div className="h-32 w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={balanceData}>
                      <defs>
                        <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0052ff" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#0052ff" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="value" stroke="#0052ff" fill="url(#colorBalance)" strokeWidth={3} dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Portfolio Breakdown Card */}
              <div className="bg-white p-8 rounded-[2rem] border border-huobi-border shadow-sm flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-huobi-up/10 flex items-center justify-center">
                      <Star className="w-4 h-4 text-huobi-up" />
                    </div>
                    <span className="text-sm font-bold text-huobi-muted">Portfolio (3)</span>
                  </div>
                  <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <ArrowUpRight className="w-4 h-4 text-huobi-muted" />
                  </button>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-5xl font-bold text-huobi-text tracking-tighter">$8,989.80</span>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-huobi-down/10 text-huobi-down rounded-full text-[10px] font-black">
                      <TrendingDown className="w-3 h-3" />
                      -0.72%
                    </div>
                    <span className="text-[10px] text-huobi-muted font-bold uppercase tracking-wider">24h change</span>
                  </div>
                </div>
                
                <div className="flex h-3 rounded-full overflow-hidden mt-2 bg-gray-100">
                  <div className="h-full bg-[#F59E0B]" style={{ width: '45%' }} />
                  <div className="h-full bg-[#10B981]" style={{ width: '25%' }} />
                  <div className="h-full bg-[#3B82F6]" style={{ width: '15%' }} />
                  <div className="h-full bg-[#EF4444]" style={{ width: '10%' }} />
                  <div className="h-full bg-[#6366F1]" style={{ width: '5%' }} />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-2">
                  {[
                    { name: 'Bitcoin', symbol: 'BTC', price: '$4,989.80', change: '+1.59%', color: '#F59E0B' },
                    { name: 'Tether', symbol: 'USDT', price: '$1,300.00', change: '-2.52%', color: '#10B981' },
                  ].map((asset, idx) => (
                    <div key={idx} className="flex flex-col gap-1 p-3 bg-gray-50 rounded-xl border border-huobi-border/50">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-huobi-text uppercase">{asset.symbol}</span>
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: asset.color }} />
                      </div>
                      <span className="text-sm font-bold text-huobi-text">{asset.price}</span>
                      <span className={cn("text-[10px] font-bold", asset.change.startsWith('+') ? "text-huobi-up" : "text-huobi-down")}>{asset.change}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Chart Section */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-huobi-border shadow-sm flex flex-col gap-8">
              <div className="flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#F59E0B] flex items-center justify-center p-3 shadow-lg shadow-orange-200">
                    <img src="https://cryptologos.cc/logos/bitcoin-btc-logo.png" alt="BTC" className="w-full h-full object-contain brightness-0 invert" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-black text-huobi-text tracking-tight">Bitcoin</h2>
                      <span className="px-2 py-0.5 bg-gray-100 text-huobi-muted text-[10px] font-bold rounded uppercase">BTC</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-bold text-huobi-text tracking-tighter">$42,715.35</span>
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-huobi-down/10 text-huobi-down rounded-full text-[10px] font-black uppercase">
                        <TrendingDown className="w-3 h-3" />
                        0.17%
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-6 py-3 bg-huobi-text text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-200">Trade Now</button>
                  <button className="p-3 bg-gray-50 border border-huobi-border rounded-2xl text-huobi-muted hover:text-huobi-text transition-all">
                    <Star className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between border-b border-huobi-border pb-6">
                <div className="flex bg-gray-100 p-1 rounded-xl">
                  {['Price', 'Market Cap', 'Volume'].map(tab => (
                    <button key={tab} className={cn("px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all", tab === 'Price' ? "bg-white text-huobi-text shadow-sm border border-huobi-border" : "text-huobi-muted hover:text-huobi-text")}>
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex bg-gray-100 p-1 rounded-xl">
                    {['1D', '7D', '1M', '1Y', 'ALL'].map(tf => (
                      <button key={tf} className={cn("px-4 py-2 text-[10px] font-black rounded-lg transition-all", tf === '1D' ? "bg-white text-huobi-text shadow-sm border border-huobi-border" : "text-huobi-muted hover:text-huobi-text")}>
                        {tf}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="h-[400px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={btcData}>
                    <defs>
                      <linearGradient id="colorBtc" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis dataKey="time" stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                    <YAxis domain={['auto', 'auto']} stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} orientation="right" dx={10} />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-huobi-text text-white p-4 rounded-2xl shadow-2xl border border-gray-800 backdrop-blur-xl bg-opacity-90">
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">Jan 23, 2024</p>
                              <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between gap-8">
                                  <span className="text-[10px] text-gray-400 font-bold uppercase">Price</span>
                                  <span className="text-sm font-black text-huobi-up">${payload[0].value?.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between gap-8">
                                  <span className="text-[10px] text-gray-400 font-bold uppercase">Volume</span>
                                  <span className="text-sm font-black">$17.92B</span>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area type="monotone" dataKey="price" stroke="#10B981" fill="url(#colorBtc)" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#10B981', stroke: '#fff', strokeWidth: 3 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Market Cap', value: '$13,441.07M', change: '+2.4%' },
                  { label: 'Volume (24h)', value: '$3,441.07M', change: '-1.2%' },
                  { label: 'Circulating Supply', value: '19.6M BTC', change: '0.0%' },
                ].map((stat, idx) => (
                  <div key={idx} className="bg-gray-50 p-5 rounded-[1.5rem] border border-huobi-border flex flex-col gap-1">
                    <span className="text-[10px] text-huobi-muted font-black uppercase tracking-widest">{stat.label}</span>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-huobi-text">{stat.value}</span>
                      <span className={cn("text-[10px] font-bold", stat.change.startsWith('+') ? "text-huobi-up" : stat.change.startsWith('-') ? "text-huobi-down" : "text-huobi-muted")}>{stat.change}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Prices & Converter */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            
            {/* Today's Prices List */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-huobi-border shadow-sm flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <h3 className="text-xl font-black text-huobi-text tracking-tight">Market Prices</h3>
                <p className="text-[11px] text-huobi-muted leading-relaxed">Global market cap is <span className="text-huobi-text font-bold">$1.67T</span>, up <span className="text-huobi-up font-bold">2.35%</span> today.</p>
              </div>
              <div className="flex flex-col gap-2">
                {[
                  { name: 'Bitcoin', symbol: 'BTC', price: '$42,715.35', change: '-0.17%', icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png' },
                  { name: 'Ethereum', symbol: 'ETH', price: '$2,310.29', change: '-0.05%', icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
                  { name: 'Solana', symbol: 'SOL', price: '$95.31', change: '-0.2%', icon: 'https://cryptologos.cc/logos/solana-sol-logo.png' },
                  { name: 'Tether', symbol: 'USDT', price: '$1.00', change: '0.00%', icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png' },
                  { name: 'BNB', symbol: 'BNB', price: '$300.85', change: '-0.20%', icon: 'https://cryptologos.cc/logos/bnb-bnb-logo.png' },
                  { name: 'Avalanche', symbol: 'AVAX', price: '$34.16', change: '+0.15%', icon: 'https://cryptologos.cc/logos/avalanche-avax-logo.png' },
                ].map((coin, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-all cursor-pointer group border border-transparent hover:border-huobi-border">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center p-2 border border-huobi-border group-hover:bg-white transition-colors">
                        <img src={coin.icon} alt={coin.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-huobi-text">{coin.name}</span>
                        <span className="text-[10px] text-huobi-muted font-black uppercase tracking-widest">{coin.symbol}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-bold text-huobi-text">{coin.price}</span>
                      <span className={cn("text-[10px] font-bold", coin.change.startsWith('+') ? "text-huobi-up" : coin.change.startsWith('-') ? "text-huobi-down" : "text-huobi-muted")}>{coin.change}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full py-4 bg-gray-50 text-huobi-muted text-[10px] font-black uppercase tracking-widest rounded-2xl border border-huobi-border hover:bg-gray-100 hover:text-huobi-text transition-all">View All Assets</button>
            </div>

            {/* Converter Card */}
            <div className="bg-huobi-text p-8 rounded-[2.5rem] shadow-2xl shadow-gray-400 flex flex-col gap-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-huobi-blue/20 to-transparent pointer-events-none" />
              <h4 className="text-lg font-black text-white tracking-tight relative z-10">Quick Converter</h4>
              <div className="flex flex-col gap-4 relative z-10">
                <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col gap-2">
                  <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest">From</span>
                  <div className="flex items-center justify-between">
                    <input type="text" defaultValue="1" className="bg-transparent border-none outline-none text-2xl font-bold text-white w-24" />
                    <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                      <img src="https://cryptologos.cc/logos/bitcoin-btc-logo.png" alt="BTC" className="w-4 h-4" />
                      <span className="text-xs font-bold text-white">BTC</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center -my-6 relative z-20">
                  <button className="w-10 h-10 bg-huobi-blue text-white rounded-full flex items-center justify-center shadow-xl border-4 border-huobi-text hover:scale-110 transition-transform">
                    <ArrowRightLeft className="w-4 h-4 rotate-90" />
                  </button>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col gap-2">
                  <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest">To</span>
                  <div className="flex items-center justify-between">
                    <input type="text" defaultValue="42,715.35" className="bg-transparent border-none outline-none text-2xl font-bold text-white w-32" />
                    <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                      <Globe className="w-4 h-4 text-white" />
                      <span className="text-xs font-bold text-white">USD</span>
                    </div>
                  </div>
                </div>
              </div>
              <button className="w-full py-4 bg-huobi-blue text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-huobi-blue/20 hover:bg-huobi-blue/90 transition-all relative z-10">Convert Now</button>
            </div>

            {/* Securities Notice */}
            <div className="bg-huobi-up/5 border border-huobi-up/20 p-6 rounded-[2rem] flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-huobi-up" />
                <span className="text-[10px] font-black text-huobi-up uppercase tracking-widest">Securities Service</span>
              </div>
              <p className="text-[11px] text-huobi-muted leading-relaxed">
                Your account is currently under securities tier. Enjoy lower fees and higher withdrawal limits. 
                <button className="text-huobi-up font-bold ml-1 hover:underline">Learn more</button>
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

const Header = ({ currentView, onViewChange }: { currentView: string, onViewChange: (v: any) => void }) => {
  const [isBrokerageOpen, setIsBrokerageOpen] = useState(false);
  const brokerageItems = [
    { id: 'TransferOut', label: 'Transfer Out' },
    { id: 'Incoming', label: 'Incoming' },
    { id: 'Records', label: 'History' }
  ];

  const isBrokerageActive = brokerageItems.some(item => item.id === currentView);

  return (
    <header className="h-20 border-b border-white/20 bg-white/70 backdrop-blur-xl flex items-center justify-between px-8 z-50 sticky top-0">
      <div className="flex items-center gap-12">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onViewChange('Market')}>
          <div className="w-10 h-10 bg-huobi-blue rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
            <TrendingUp className="text-white w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter text-huobi-text leading-none">VC Securities</span>
            <span className="text-[10px] font-black text-huobi-muted uppercase tracking-widest">Brokerage Platform</span>
          </div>
        </div>
        <nav className="hidden lg:flex items-center gap-1">
          {[
            { id: 'Dashboard', label: 'Dashboard' },
            { id: 'Market', label: 'Market' },
            { id: 'Trade', label: 'Trade' }
          ].map(item => (
            <button 
              key={item.id} 
              onClick={() => onViewChange(item.id)}
              className={cn(
                "px-4 py-2 text-xs font-black uppercase tracking-widest transition-all rounded-xl",
                currentView === item.id ? "bg-huobi-text text-white shadow-lg" : "text-huobi-muted hover:text-huobi-text hover:bg-gray-100"
              )}
            >
              {item.label}
            </button>
          ))}

          {/* Brokerage Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setIsBrokerageOpen(true)}
            onMouseLeave={() => setIsBrokerageOpen(false)}
          >
            <button 
              className={cn(
                "px-4 py-2 text-xs font-black uppercase tracking-widest transition-all rounded-xl flex items-center gap-1",
                isBrokerageActive ? "bg-huobi-text text-white shadow-lg" : "text-huobi-muted hover:text-huobi-text hover:bg-gray-100"
              )}
            >
              Brokerage
              <ChevronDown className={cn("w-3 h-3 transition-transform", isBrokerageOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
              {isBrokerageOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 mt-1 w-48 bg-white border border-huobi-border rounded-2xl shadow-2xl p-2 z-[60]"
                >
                  {brokerageItems.map(item => (
                    <button
                      key={item.id}
                      onClick={() => {
                        onViewChange(item.id);
                        setIsBrokerageOpen(false);
                      }}
                      className={cn(
                        "w-full px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                        currentView === item.id ? "bg-huobi-blue/10 text-huobi-blue" : "text-huobi-muted hover:bg-gray-50 hover:text-huobi-text"
                      )}
                    >
                      {item.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {[
            { id: 'Assets', label: 'Assets' }
          ].map(item => (
            <button 
              key={item.id} 
              onClick={() => onViewChange(item.id)}
              className={cn(
                "px-4 py-2 text-xs font-black uppercase tracking-widest transition-all rounded-xl",
                currentView === item.id ? "bg-huobi-text text-white shadow-lg" : "text-huobi-muted hover:text-huobi-text hover:bg-gray-100"
              )}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    <div className="flex items-center gap-6">
      <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-white border border-huobi-border rounded-2xl shadow-sm">
        <div className="w-2 h-2 bg-huobi-up rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
        <span className="text-[10px] font-black text-huobi-muted uppercase tracking-wider">HKEX: <span className="text-huobi-text">OPEN</span></span>
      </div>
      <div className="flex items-center gap-2">
        <button className="p-2.5 text-huobi-muted hover:text-huobi-blue hover:bg-huobi-blue/5 rounded-xl transition-all relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-huobi-down rounded-full border-2 border-white" />
        </button>
        <button className="flex items-center gap-3 p-1.5 pr-4 bg-white border border-huobi-border rounded-2xl hover:shadow-md transition-all">
          <div className="w-8 h-8 bg-huobi-blue/10 rounded-xl flex items-center justify-center overflow-hidden">
            <img src="https://picsum.photos/seed/user/100/100" alt="User" className="w-full h-full object-cover" />
          </div>
          <span className="text-xs font-black text-huobi-text hidden md:block">James Bond</span>
        </button>
      </div>
    </div>
  </header>
);
};

const MarketList = ({ onSelect, selectedSymbol }: { onSelect: (s: Stock) => void, selectedSymbol: string }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredStocks = HK_STOCKS.filter(s => 
    s.symbol.includes(searchTerm) || s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="hidden lg:flex w-80 bg-white/50 backdrop-blur-sm border-r border-huobi-border flex flex-col h-full shrink-0">
      <div className="p-6 border-b border-huobi-border">
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-black text-huobi-text tracking-tight">Market Assets</h3>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-huobi-muted" />
            <input 
              type="text" 
              placeholder="Search HK Stocks..." 
              className="w-full bg-white border border-huobi-border rounded-2xl py-3 pl-11 pr-4 text-xs font-bold focus:outline-none focus:border-huobi-blue focus:ring-4 focus:ring-huobi-blue/5 transition-all text-huobi-text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
        <div className="flex flex-col gap-1">
          {filteredStocks.map(stock => (
            <button
              key={stock.symbol}
              onClick={() => onSelect(stock)}
              className={cn(
                "w-full px-4 py-4 flex items-center justify-between rounded-[1.25rem] transition-all group",
                selectedSymbol === stock.symbol ? "bg-huobi-text text-white shadow-xl shadow-gray-200" : "hover:bg-white hover:shadow-md text-huobi-text"
              )}
            >
              <div className="flex flex-col items-start">
                <span className="text-sm font-black">{stock.symbol}.HK</span>
                <span className={cn("text-[10px] font-bold uppercase tracking-wider truncate max-w-[120px]", selectedSymbol === stock.symbol ? "text-white/60" : "text-huobi-muted")}>{stock.name}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className={cn("text-sm font-black", selectedSymbol === stock.symbol ? "text-white" : stock.change >= 0 ? "text-huobi-up" : "text-huobi-down")}>
                  {stock.price.toFixed(2)}
                </span>
                <div className={cn(
                  "flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black",
                  selectedSymbol === stock.symbol ? "bg-white/20 text-white" : stock.change >= 0 ? "bg-huobi-up/10 text-huobi-up" : "bg-huobi-down/10 text-huobi-down"
                )}>
                  {stock.change >= 0 ? <ChevronUp className="w-2 h-2" /> : <ChevronDown className="w-2 h-2" />}
                  {stock.changePercent.toFixed(2)}%
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const TradingChart = ({ stock }: { stock: Stock }) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchKline = async () => {
      const data = await alltickService.getKline(stock.symbol, '1min');
      if (isMounted) {
        if (data && data.length > 0) {
          setChartData(data);
        } else {
          // Fallback to mock data if API fails or no data
          setChartData(generateChartData(stock.price));
        }
        setLoading(false);
      }
    };

    fetchKline();

    // Subscribe to real-time updates to append to chart
    const unsubscribe = alltickService.subscribe(stock.symbol, (ticker) => {
      if (isMounted) {
        setChartData(prev => {
          const last = prev[prev.length - 1];
          const newPrice = parseFloat(ticker.last_price);
          const time = new Date(ticker.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          
          if (last && last.time === time) {
            // Update last point
            const updated = [...prev];
            updated[updated.length - 1] = { ...last, price: newPrice, close: newPrice };
            return updated;
          } else {
            // Add new point
            return [...prev, { time, price: newPrice, close: newPrice }].slice(-100);
          }
        });
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [stock.symbol]);
  
  return (
    <div className="flex-1 flex flex-col bg-white rounded-[2.5rem] border border-huobi-border shadow-sm overflow-hidden m-4 md:m-8">
      <div className="p-8 flex flex-wrap items-center justify-between gap-6 border-b border-huobi-border/50">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-huobi-blue/10 flex items-center justify-center p-3">
            <TrendingUp className="w-8 h-8 text-huobi-blue" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-black text-huobi-text tracking-tighter">{stock.symbol}.HK</h1>
              <span className="px-2 py-0.5 bg-gray-100 text-huobi-muted text-[10px] font-black rounded uppercase">{stock.name}</span>
            </div>
            <div className="flex items-center gap-4 mt-1">
              <span className={cn("text-4xl font-black tracking-tighter", stock.change >= 0 ? "text-huobi-up" : "text-huobi-down")}>
                {stock.price.toFixed(2)}
              </span>
              <div className={cn(
                "flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase",
                stock.change >= 0 ? "bg-huobi-up/10 text-huobi-up" : "bg-huobi-down/10 text-huobi-down"
              )}>
                {stock.change >= 0 ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                {stock.changePercent.toFixed(2)}%
              </div>
            </div>
          </div>
        </div>
        <div className="flex bg-gray-100 p-1.5 rounded-2xl">
          {['1M', '5M', '15M', '1H', '4H', '1D', '1W'].map(tf => (
            <button key={tf} className={cn(
              "px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
              tf === '15M' ? "bg-white text-huobi-text shadow-sm border border-huobi-border" : "text-huobi-muted hover:text-huobi-text"
            )}>
              {tf}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 min-h-[400px] p-8 relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10">
            <div className="w-10 h-10 border-4 border-huobi-blue border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0066FF" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#0066FF" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="time" stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} dy={10} />
            <YAxis domain={['auto', 'auto']} stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} orientation="right" dx={10} />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-huobi-text text-white p-4 rounded-2xl shadow-2xl border border-gray-800 backdrop-blur-xl bg-opacity-90">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">{payload[0].payload.time}</p>
                      <div className="flex items-center justify-between gap-8">
                        <span className="text-[10px] text-gray-400 font-bold uppercase">Price</span>
                        <span className="text-sm font-black text-huobi-up">${payload[0].value?.toLocaleString()}</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area type="monotone" dataKey="price" stroke="#0066FF" fillOpacity={1} fill="url(#colorPrice)" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#0066FF', stroke: '#fff', strokeWidth: 3 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 bg-gray-50/50 border-t border-huobi-border">
        {[
          { label: 'High', value: stock.high?.toFixed(2) },
          { label: 'Low', value: stock.low?.toFixed(2) },
          { label: '24h Vol', value: `${(stock.volume / 1000000).toFixed(2)}M` },
          { label: 'Market Cap', value: `${(stock.marketCap / 1000000000).toFixed(2)}B` },
        ].map((stat, idx) => (
          <div key={idx} className="flex flex-col gap-1">
            <span className="text-[10px] text-huobi-muted font-black uppercase tracking-widest">{stat.label}</span>
            <span className="text-lg font-bold text-huobi-text">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const OrderBook = ({ stock }: { stock: Stock }) => {
  const asks = Array.from({ length: 12 }, (_, i) => ({
    price: stock.price + (12 - i) * 0.1,
    amount: Math.floor(Math.random() * 50000) + 10000,
    total: 0
  })).reverse();

  const bids = Array.from({ length: 12 }, (_, i) => ({
    price: stock.price - (i + 1) * 0.1,
    amount: Math.floor(Math.random() * 50000) + 10000,
    total: 0
  }));

  return (
    <div className="w-80 bg-white rounded-[2.5rem] border border-huobi-border shadow-sm flex flex-col h-full overflow-hidden my-4 mr-4 md:my-8 md:mr-8">
      <div className="p-6 border-b border-huobi-border flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-lg font-black text-huobi-text tracking-tight">Order Book</span>
          <span className="text-[10px] font-black text-huobi-muted uppercase tracking-widest">Real-time Depth</span>
        </div>
        <div className="flex gap-1.5 p-1 bg-gray-100 rounded-lg">
          <div className="w-4 h-4 bg-huobi-up rounded shadow-sm" />
          <div className="w-4 h-4 bg-huobi-down rounded shadow-sm" />
        </div>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden text-[11px]">
        <div className="grid grid-cols-3 px-6 py-3 text-[9px] text-huobi-muted uppercase font-black tracking-widest border-b border-huobi-border/30">
          <span>Price</span>
          <span className="text-right">Amount</span>
          <span className="text-right">Total</span>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="flex flex-col-reverse">
            {asks.map((ask, i) => (
              <div key={i} className="grid grid-cols-3 px-6 py-1.5 relative group hover:bg-huobi-down/5 cursor-pointer transition-colors">
                <div className="absolute right-0 top-0 bottom-0 bg-huobi-down/5 transition-all" style={{ width: `${(ask.amount / 60000) * 100}%` }} />
                <span className="text-huobi-down font-bold z-10">{ask.price.toFixed(2)}</span>
                <span className="text-right text-huobi-text font-bold z-10">{ask.amount.toLocaleString()}</span>
                <span className="text-right text-huobi-muted font-bold z-10">{(ask.price * ask.amount / 1000).toFixed(1)}k</span>
              </div>
            ))}
          </div>

          <div className="px-6 py-6 border-y border-huobi-border/50 flex flex-col gap-1 bg-gray-50/50">
            <div className="flex items-center justify-between">
              <span className={cn("text-3xl font-black tracking-tighter", stock.change >= 0 ? "text-huobi-up" : "text-huobi-down")}>
                {stock.price.toFixed(2)}
              </span>
              <div className={cn(
                "flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black",
                stock.change >= 0 ? "bg-huobi-up/10 text-huobi-up" : "bg-huobi-down/10 text-huobi-down"
              )}>
                {stock.change >= 0 ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                {stock.changePercent.toFixed(2)}%
              </div>
            </div>
            <span className="text-[10px] text-huobi-muted font-bold uppercase tracking-widest">≈ {stock.price.toFixed(2)} HKD</span>
          </div>

          <div className="flex flex-col">
            {bids.map((bid, i) => (
              <div key={i} className="grid grid-cols-3 px-6 py-1.5 relative group hover:bg-huobi-up/5 cursor-pointer transition-colors">
                <div className="absolute right-0 top-0 bottom-0 bg-huobi-up/5 transition-all" style={{ width: `${(bid.amount / 60000) * 100}%` }} />
                <span className="text-huobi-up font-bold z-10">{bid.price.toFixed(2)}</span>
                <span className="text-right text-huobi-text font-bold z-10">{bid.amount.toLocaleString()}</span>
                <span className="text-right text-huobi-muted font-bold z-10">{(bid.price * bid.amount / 1000).toFixed(1)}k</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const RequestEntry = ({ stock, onStockChange, onCreateRequest, initialMode = 'Trade', showStockSelector = false, position, hideModeToggle = false }: { stock: Stock, onStockChange?: (s: Stock) => void, onCreateRequest: (req: any) => void, initialMode?: 'Trade' | 'Transfer', showStockSelector?: boolean, position?: Position, hideModeToggle?: boolean }) => {
  const [mode, setMode] = useState<'Trade' | 'Transfer'>(initialMode);
  const [side, setSide] = useState<'Open' | 'Close' | 'Inbound' | 'Outbound'>(
    initialMode === 'Trade' ? 'Open' : 'Outbound'
  );
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [counterpartyCode, setCounterpartyCode] = useState('');
  const [remarks, setRemarks] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isStockListOpen, setIsStockListOpen] = useState(false);

  useEffect(() => {
    if (initialMode === 'Transfer') {
      setSide('Outbound');
    }
  }, [initialMode]);

  const matchedCounterparty = COUNTERPARTIES.find(c => c.code === counterpartyCode);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    if (mode === 'Trade') {
      setSide(prev => (prev === 'Inbound' || prev === 'Outbound') ? 'Open' : prev);
    } else {
      setSide(prev => (prev === 'Open' || prev === 'Close') ? 'Inbound' : prev);
    }
  }, [mode]);

  const handleSubmit = () => {
    if (!agreed) return;
    const a = parseFloat(amount);
    if (!a || a <= 0) return;

    if (mode === 'Trade') {
      onCreateRequest({
        type: 'Trade',
        symbol: stock.symbol,
        side: side as 'Open' | 'Close',
        amount: a,
        price: parseFloat(price) || stock.price,
        remarks
      });
    } else {
      if (!counterpartyCode) return;
      onCreateRequest({
        type: 'Transfer',
        symbol: stock.symbol,
        side: side as 'Inbound' | 'Outbound',
        amount: a,
        counterpartyCode,
        counterpartyName: matchedCounterparty?.name || 'Unknown',
        remarks
      });
    }

    setAmount('');
    setPrice('');
    setCounterpartyCode('');
    setRemarks('');
    setAgreed(false);
  };

  return (
    <div className={cn(
      "bg-huobi-bg flex flex-col h-full", 
      showStockSelector ? "w-full max-w-4xl mx-auto border border-huobi-border rounded-2xl overflow-hidden shadow-2xl" : "w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-huobi-border"
    )}>
      {/* Header / Mode Selection */}
      {!hideModeToggle && (
        <div className="flex border-b border-huobi-border bg-huobi-card">
          {(['Trade', 'Transfer'] as const).map(m => (
            <button 
              key={m}
              onClick={() => setMode(m)}
              className={cn(
                "flex-1 py-4 text-sm font-bold transition-all border-b-2",
                mode === m ? "text-huobi-blue border-huobi-blue bg-huobi-blue/5" : "text-huobi-muted border-transparent hover:text-huobi-text"
              )}
            >
              {m === 'Trade' ? 'Broker Entrustment' : 'Stock Transfer'}
            </button>
          ))}
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 flex flex-col gap-6">
        {/* Risk Warning & Securities Notice */}
        <div className="p-4 bg-huobi-down/5 border border-huobi-down/20 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-huobi-down shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-huobi-down uppercase">Securities Service Notice</span>
              <p className="text-[11px] text-huobi-muted leading-relaxed">
                This is a controlled business application page. Submitting a request does not guarantee execution. 
                All applications are subject to broker review, risk control, and manual settlement.
              </p>
            </div>
          </div>
        </div>

        {/* Common Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-4">
            {/* Stock Selector / Info */}
            <div className="flex flex-col gap-1.5 relative">
              <label className="text-[10px] uppercase text-huobi-muted font-bold">Target Asset</label>
              {showStockSelector ? (
                <button 
                  onClick={() => setIsStockListOpen(!isStockListOpen)}
                  className="w-full bg-huobi-card border border-huobi-border rounded-lg py-3 px-4 flex items-center justify-between hover:border-huobi-blue transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-huobi-text">{stock.symbol}.HK</span>
                    <span className="text-sm text-huobi-muted">{stock.name}</span>
                  </div>
                  <ChevronDown className={cn("w-5 h-5 text-huobi-muted transition-transform", isStockListOpen && "rotate-180")} />
                </button>
              ) : (
                <div className="w-full bg-huobi-card border border-huobi-border rounded-lg py-3 px-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-huobi-text">{stock.symbol}.HK</span>
                    <span className="text-sm text-huobi-muted">{stock.name}</span>
                  </div>
                </div>
              )}
              
              <AnimatePresence>
                {isStockListOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-huobi-card border border-huobi-border rounded-xl shadow-2xl z-[60] max-h-64 overflow-y-auto custom-scrollbar"
                  >
                    {HK_STOCKS.map(s => (
                      <button
                        key={s.symbol}
                        onClick={() => {
                          onStockChange?.(s);
                          setIsStockListOpen(false);
                        }}
                        className="w-full px-4 py-3 flex items-center justify-between hover:bg-huobi-bg transition-colors border-b border-huobi-border/30 last:border-0"
                      >
                        <div className="flex flex-col items-start">
                          <span className="text-sm font-bold text-huobi-text">{s.symbol}.HK</span>
                          <span className="text-[10px] text-huobi-muted">{s.name}</span>
                        </div>
                        <span className="text-sm font-mono text-huobi-text">{s.price.toFixed(2)}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Position Info Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-huobi-card/50 border border-huobi-border p-3 rounded-lg">
                <span className="text-[10px] text-huobi-muted uppercase font-bold block mb-1">Current Position</span>
                <span className="text-sm font-mono text-huobi-text font-bold">{position?.total.toLocaleString() || '0'} Shares</span>
              </div>
              <div className="bg-huobi-card/50 border border-huobi-border p-3 rounded-lg">
                <span className="text-[10px] text-huobi-muted uppercase font-bold block mb-1">Available to Apply</span>
                <span className="text-sm font-mono text-huobi-up font-bold">{position?.available.toLocaleString() || '0'} Shares</span>
              </div>
              <div className="bg-huobi-card/50 border border-huobi-border p-3 rounded-lg">
                <span className="text-[10px] text-huobi-muted uppercase font-bold block mb-1">Frozen / Processing</span>
                <span className="text-sm font-mono text-huobi-down font-bold">{(position?.frozen || 0) + (position?.processing || 0)} Shares</span>
              </div>
              <div className="bg-huobi-card/50 border border-huobi-border p-3 rounded-lg">
                <span className="text-[10px] text-huobi-muted uppercase font-bold block mb-1">Market Price</span>
                <span className="text-sm font-mono text-huobi-blue font-bold">{stock.price.toFixed(2)} HKD</span>
              </div>
            </div>
          </div>

          {/* Form Fields Section */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase text-huobi-muted font-bold">Instruction Type</label>
              <div className="grid grid-cols-2 gap-2">
                {mode === 'Trade' ? (
                  <>
                    <button 
                      onClick={() => setSide('Open')}
                      className={cn("py-3 text-xs rounded-lg border transition-all font-bold", side === 'Open' ? "bg-huobi-up border-huobi-up text-white shadow-lg shadow-huobi-up/20" : "border-huobi-border text-huobi-muted hover:border-huobi-muted")}
                    >Entrust to Open</button>
                    <button 
                      onClick={() => setSide('Close')}
                      className={cn("py-3 text-xs rounded-lg border transition-all font-bold", side === 'Close' ? "bg-huobi-down border-huobi-down text-white shadow-lg shadow-huobi-down/20" : "border-huobi-border text-huobi-muted hover:border-huobi-muted")}
                    >Entrust to Close</button>
                  </>
                ) : (
                  <>
                    {!hideModeToggle ? (
                      <>
                        <button 
                          onClick={() => setSide('Inbound')}
                          className={cn("py-3 text-xs rounded-lg border transition-all font-bold", side === 'Inbound' ? "bg-huobi-blue border-huobi-blue text-white shadow-lg shadow-huobi-blue/20" : "border-huobi-border text-huobi-muted hover:border-huobi-muted")}
                        >Receive Transfer</button>
                        <button 
                          onClick={() => setSide('Outbound')}
                          className={cn("py-3 text-xs rounded-lg border transition-all font-bold", side === 'Outbound' ? "bg-huobi-down border-huobi-down text-white shadow-lg shadow-huobi-down/20" : "border-huobi-border text-huobi-muted hover:border-huobi-muted")}
                        >Deliver Transfer</button>
                      </>
                    ) : (
                      <div className="col-span-2 py-3 px-4 bg-huobi-down/10 border border-huobi-down/20 rounded-lg flex items-center justify-between">
                        <span className="text-xs font-bold text-huobi-down uppercase tracking-wider">Transfer Out (Deliver)</span>
                        <CheckCircle2 className="w-4 h-4 text-huobi-down" />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-end">
                <label className="text-[10px] uppercase text-huobi-muted font-bold">Application Volume (Shares)</label>
                <span className="text-[10px] text-huobi-muted">Lot Size: {stock.lotSize}</span>
              </div>
              <input 
                type="number" 
                placeholder={`Min ${stock.lotSize}`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-huobi-card border border-huobi-border rounded-lg py-3 px-4 text-sm focus:outline-none focus:border-huobi-blue font-mono"
              />
            </div>

            {mode === 'Trade' && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase text-huobi-muted font-bold">Reference Price (HKD)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    placeholder={stock.price.toFixed(2)}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-huobi-card border border-huobi-border rounded-lg py-3 px-4 text-sm focus:outline-none focus:border-huobi-blue font-mono"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-huobi-muted font-bold">LIMIT</span>
                </div>
              </div>
            )}

            {mode === 'Transfer' && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase text-huobi-muted font-bold">Counterparty Code (CCASS)</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="e.g. B01234"
                    value={counterpartyCode}
                    onChange={(e) => setCounterpartyCode(e.target.value.toUpperCase())}
                    className="w-full bg-huobi-card border border-huobi-border rounded-lg py-3 px-4 text-sm focus:outline-none focus:border-huobi-blue font-mono"
                  />
                  {matchedCounterparty && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <CheckCircle2 className="w-5 h-5 text-huobi-up" />
                    </div>
                  )}
                </div>
                {matchedCounterparty ? (
                  <div className="flex items-center gap-2 mt-1 px-3 py-2 bg-huobi-up/10 rounded-lg border border-huobi-up/20">
                    <span className="text-[10px] text-huobi-up font-bold uppercase">Verified Counterparty: {matchedCounterparty.name}</span>
                  </div>
                ) : counterpartyCode && (
                  <div className="flex items-center gap-2 mt-1 px-3 py-2 bg-huobi-down/10 rounded-lg border border-huobi-down/20">
                    <span className="text-[10px] text-huobi-down font-bold uppercase">Unrecognized Counterparty Code</span>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase text-huobi-muted font-bold">Special Instructions / Remarks</label>
              <textarea 
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full bg-huobi-card border border-huobi-border rounded-lg py-3 px-4 text-sm focus:outline-none focus:border-huobi-blue resize-none"
                placeholder="Provide additional context for the broker..."
              />
            </div>
          </div>
        </div>

        {/* Footer / Submission */}
        <div className="mt-4 pt-6 border-t border-huobi-border flex flex-col gap-4">
          <div className="flex items-start gap-3 cursor-pointer group" onClick={() => setAgreed(!agreed)}>
            <div className={cn(
              "w-5 h-5 rounded border flex items-center justify-center transition-all mt-0.5",
              agreed ? "bg-huobi-blue border-huobi-blue" : "border-huobi-border group-hover:border-huobi-blue"
            )}>
              {agreed && <CheckCircle2 className="w-4 h-4 text-white" />}
            </div>
            <span className="text-[11px] text-huobi-muted leading-tight">
              {mode === 'Trade' 
                ? "I understand this is a formal application and the final result is subject to broker approval and execution."
                : "I understand this is a formal transfer-out request and the final result is subject to broker approval and execution."
              }
            </span>
          </div>

          <div className="flex justify-between items-center p-4 bg-huobi-card rounded-xl border border-huobi-border">
            <div className="flex flex-col">
              <span className="text-[10px] text-huobi-muted font-bold uppercase">Estimated Value</span>
              <span className="text-xl font-mono text-huobi-text font-bold">
                {(parseFloat(amount) * (parseFloat(price) || stock.price) || 0).toLocaleString()} HKD
              </span>
            </div>
            <button 
              onClick={handleSubmit}
              disabled={!agreed || !amount || (mode === 'Transfer' && !matchedCounterparty)}
              className={cn(
                "px-8 py-4 rounded-xl font-bold text-lg text-white shadow-2xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100",
                mode === 'Trade' 
                  ? (side === 'Open' ? "bg-huobi-up hover:bg-huobi-up/90 shadow-huobi-up/20" : "bg-huobi-down hover:bg-huobi-down/90 shadow-huobi-down/20") 
                  : "bg-huobi-down hover:bg-huobi-down/90 shadow-huobi-down/20"
              )}
            >
              {mode === 'Trade' ? 'Submit Application' : 'Submit Transfer-Out Request'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PortfolioTabs = ({ requests, positions, onCancelRequest }: { requests: TradeRequest[], positions: Position[], onCancelRequest: (id: string) => void }) => {
  const [activeTab, setActiveTab] = useState('Positions');
  
  const getStatusInfo = (status: RequestStatus) => {
    switch (status) {
      case 'Pending': return { label: 'Submitted', color: 'text-huobi-muted', icon: Clock };
      case 'Auditing': return { label: 'Auditing', color: 'text-huobi-blue', icon: AlertCircle };
      case 'Accepted': return { label: 'Approved', color: 'text-huobi-up', icon: CheckCircle2 };
      case 'Processing': return { label: 'Processing', color: 'text-huobi-blue animate-pulse', icon: ArrowRightLeft };
      case 'Completed': return { label: 'Completed', color: 'text-huobi-up font-bold', icon: CheckCircle2 };
      case 'Rejected': return { label: 'Rejected', color: 'text-huobi-down', icon: XCircle };
      case 'Cancelled': return { label: 'Cancelled', color: 'text-huobi-muted line-through', icon: AlertCircle };
      default: return { label: status, color: 'text-huobi-text', icon: Info };
    }
  };

  return (
    <div className="h-72 border-t border-huobi-border bg-huobi-bg flex flex-col">
      <div className="flex border-b border-huobi-border px-4">
        {['Positions', 'Application History', 'Account Funds'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-6 py-3 text-xs font-bold transition-all border-b-2",
              activeTab === tab ? "text-huobi-blue border-huobi-blue" : "text-huobi-muted border-transparent hover:text-huobi-text"
            )}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-auto p-4 custom-scrollbar">
        {activeTab === 'Positions' && (
          <div className="h-full overflow-x-auto">
            <div className="min-w-[600px] lg:min-w-0">
            {positions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-huobi-muted gap-2">
                <LayoutGrid className="w-8 h-8 opacity-20" />
                <span className="text-sm">No positions found</span>
              </div>
            ) : (
              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="text-huobi-muted border-b border-huobi-border/50">
                    <th className="pb-2 font-medium">Asset</th>
                    <th className="pb-2 font-medium">Total</th>
                    <th className="pb-2 font-medium">Available</th>
                    <th className="pb-2 font-medium">Frozen</th>
                    <th className="pb-2 font-medium">Processing</th>
                    <th className="pb-2 font-medium">Avg Cost</th>
                    <th className="pb-2 font-medium">Market Value</th>
                    <th className="pb-2 font-medium">P&L</th>
                  </tr>
                </thead>
                <tbody>
                  {positions.map(pos => {
                    const marketValue = pos.currentPrice * pos.total;
                    const pnl = (pos.currentPrice - pos.avgPrice) * pos.total;
                    const pnlPercent = ((pos.currentPrice - pos.avgPrice) / pos.avgPrice) * 100;
                    return (
                      <tr key={pos.symbol} className="border-b border-huobi-border/30">
                        <td className="py-3 font-bold">{pos.symbol}.HK<br/><span className="text-[10px] font-normal text-huobi-muted">{pos.name}</span></td>
                        <td className="py-3 font-mono">{pos.total.toLocaleString()}</td>
                        <td className="py-3 font-mono text-huobi-up">{pos.available.toLocaleString()}</td>
                        <td className="py-3 font-mono text-huobi-down">{pos.frozen.toLocaleString()}</td>
                        <td className="py-3 font-mono text-huobi-blue">{pos.processing.toLocaleString()}</td>
                        <td className="py-3 font-mono text-huobi-muted">{pos.avgPrice.toFixed(2)}</td>
                        <td className="py-3 font-mono">{marketValue.toLocaleString()}</td>
                        <td className={cn("py-3 font-mono", pnl >= 0 ? "text-huobi-up" : "text-huobi-down")}>
                          {pnl >= 0 ? '+' : ''}{pnl.toLocaleString()} ({pnlPercent.toFixed(2)}%)
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
            </div>
          </div>
        )}
        {activeTab === 'Application History' && (
          <div className="h-full overflow-x-auto">
            <div className="min-w-[800px] lg:min-w-0">
            {requests.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-huobi-muted gap-2">
                <LayoutGrid className="w-8 h-8 opacity-20" />
                <span className="text-sm">No application records</span>
              </div>
            ) : (
              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="text-huobi-muted border-b border-huobi-border/50">
                    <th className="pb-2 font-medium text-left">Time / Ref No</th>
                    <th className="pb-2 font-medium text-left">Method</th>
                    <th className="pb-2 font-medium text-left">Asset</th>
                    <th className="pb-2 font-medium text-left">Instruction</th>
                    <th className="pb-2 font-medium text-left">Volume</th>
                    <th className="pb-2 font-medium text-left">Price/Counterparty</th>
                    <th className="pb-2 font-medium text-left">Status</th>
                    <th className="pb-2 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map(req => {
                    const statusInfo = getStatusInfo(req.status);
                    const StatusIcon = statusInfo.icon;
                    return (
                      <tr key={req.id} className="border-b border-huobi-border/30">
                        <td className="py-2">
                          <div className="text-huobi-muted">{req.time}</div>
                          <div className="text-[10px] font-mono">{req.refNo}</div>
                        </td>
                        <td className="py-2">
                          <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-bold uppercase", req.type === 'Trade' ? "bg-huobi-blue/10 text-huobi-blue" : "bg-huobi-muted/10 text-huobi-muted")}>
                            {req.type === 'Trade' ? 'Execution' : 'Transfer'}
                          </span>
                        </td>
                        <td className="py-2 font-bold">{req.symbol}.HK</td>
                        <td className="py-2">
                          <span className={cn(
                            (req.side === 'Open' || req.side === 'Inbound') ? "text-huobi-up" : "text-huobi-down"
                          )}>
                            {req.side === 'Open' ? 'Entrust Open' : 
                             req.side === 'Close' ? 'Entrust Close' : 
                             req.side === 'Inbound' ? 'Receive Transfer' : 
                             req.side === 'Outbound' ? 'Deliver Transfer' : req.side}
                          </span>
                        </td>
                        <td className="py-2 font-mono">{req.amount.toLocaleString()}</td>
                        <td className="py-2">
                          {req.type === 'Trade' ? (
                            <span className="font-mono">{req.price?.toFixed(2)}</span>
                          ) : (
                            <div className="flex flex-col">
                              <span className="font-bold">{req.counterpartyCode}</span>
                              <span className="text-[10px] text-huobi-muted">{req.counterpartyName}</span>
                            </div>
                          )}
                        </td>
                        <td className="py-2">
                          <div className={cn("flex items-center gap-1.5 font-bold", statusInfo.color)}>
                            <StatusIcon className="w-3 h-3" />
                            {statusInfo.label}
                          </div>
                        </td>
                        <td className="py-2 text-right">
                          <div className="flex justify-end gap-3">
                            {req.status === 'Pending' && (
                              <button 
                                onClick={() => onCancelRequest(req.id)}
                                className="text-huobi-down hover:underline text-[10px] font-bold uppercase"
                              >
                                Cancel
                              </button>
                            )}
                            <button className="text-huobi-blue hover:underline text-[10px] font-bold uppercase">Details</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
            </div>
          </div>
        )}
        {activeTab === 'Account Funds' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
            <div className="bg-huobi-card p-4 rounded-lg border border-huobi-border flex flex-col justify-between">
              <span className="text-xs text-huobi-muted uppercase font-bold">Total Equity (VCD)</span>
              <span className="text-2xl font-mono font-bold">1,436,200.00</span>
              <div className="flex justify-between text-[10px] text-huobi-muted">
                <span>≈ 183,657.60 USD</span>
                <span className="text-huobi-up">+2.4% Today</span>
              </div>
            </div>
            <div className="bg-huobi-card p-4 rounded-lg border border-huobi-border flex flex-col justify-between">
              <span className="text-xs text-huobi-muted uppercase font-bold">Available Cash</span>
              <span className="text-2xl font-mono font-bold">1,245,000.00</span>
              <button className="text-huobi-blue text-[10px] font-bold uppercase text-left hover:underline">Deposit Funds</button>
            </div>
            <div className="bg-huobi-card p-4 rounded-lg border border-huobi-border flex flex-col justify-between">
              <span className="text-xs text-huobi-muted uppercase font-bold">Frozen Margin</span>
              <span className="text-2xl font-mono font-bold">150,000.00</span>
              <span className="text-[10px] text-huobi-muted">Locked for processing requests</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main App ---

const IncomingTransfersView = ({ 
  transfers, 
  onAction 
}: { 
  transfers: IncomingTransfer[], 
  onAction: (id: string, action: 'Accept' | 'Reject') => void 
}) => {
  const [selectedTransfer, setSelectedTransfer] = useState<IncomingTransfer | null>(null);

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-huobi-bg">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl md:text-3xl font-bold text-huobi-text tracking-tight">Incoming Transfers</h2>
          <p className="text-huobi-muted text-sm">
            Review incoming stock transfer instructions and choose whether to accept them.
            Accepted transfers will be processed before being reflected in your holdings.
          </p>
        </div>

        <div className="bg-white border border-huobi-border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-huobi-border">
                  <th className="px-6 py-4 text-[10px] font-black text-huobi-muted uppercase tracking-widest">Instruction Info</th>
                  <th className="px-6 py-4 text-[10px] font-black text-huobi-muted uppercase tracking-widest">Asset</th>
                  <th className="px-6 py-4 text-[10px] font-black text-huobi-muted uppercase tracking-widest text-right">Quantity</th>
                  <th className="px-6 py-4 text-[10px] font-black text-huobi-muted uppercase tracking-widest">Counterparty</th>
                  <th className="px-6 py-4 text-[10px] font-black text-huobi-muted uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black text-huobi-muted uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-huobi-border">
                {transfers.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-huobi-text">{t.refNo}</span>
                        <span className="text-[10px] text-huobi-muted">{t.time}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-huobi-text">{t.symbol}.HK</span>
                        <span className="text-[10px] text-huobi-muted">{t.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-xs font-bold text-huobi-text">{t.amount.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-huobi-text">{t.counterpartyName}</span>
                        <span className="text-[10px] text-huobi-muted">{t.counterpartyCode}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
                        t.status === 'Pending Response' ? "bg-huobi-blue/10 text-huobi-blue" :
                        t.status === 'Accepted' || t.status === 'Processing' ? "bg-huobi-up/10 text-huobi-up" :
                        t.status === 'Completed' ? "bg-huobi-up text-white" :
                        "bg-huobi-down/10 text-huobi-down"
                      )}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setSelectedTransfer(t)}
                          className="p-2 text-huobi-muted hover:text-huobi-blue hover:bg-huobi-blue/5 rounded-lg transition-all"
                          title="View Details"
                        >
                          <Info className="w-4 h-4" />
                        </button>
                        {t.status === 'Pending Response' && (
                          <>
                            <button 
                              onClick={() => onAction(t.id, 'Accept')}
                              className="px-3 py-1.5 bg-huobi-up text-white text-[10px] font-bold uppercase tracking-wider rounded-lg hover:bg-huobi-up/90 transition-all"
                            >
                              Accept
                            </button>
                            <button 
                              onClick={() => onAction(t.id, 'Reject')}
                              className="px-3 py-1.5 bg-huobi-down/10 text-huobi-down text-[10px] font-bold uppercase tracking-wider rounded-lg hover:bg-huobi-down/20 transition-all"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedTransfer && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTransfer(null)}
              className="absolute inset-0 bg-huobi-text/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-xl font-bold text-huobi-text">Transfer Details</h3>
                    <span className="text-xs text-huobi-muted">Ref No: {selectedTransfer.refNo}</span>
                  </div>
                  <button 
                    onClick={() => setSelectedTransfer(null)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <XCircle className="w-6 h-6 text-huobi-muted" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6 p-6 bg-gray-50 rounded-2xl border border-huobi-border">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase text-huobi-muted font-bold tracking-widest">Asset</span>
                    <span className="text-sm font-bold text-huobi-text">{selectedTransfer.name} ({selectedTransfer.symbol}.HK)</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase text-huobi-muted font-bold tracking-widest">Quantity</span>
                    <span className="text-sm font-bold text-huobi-text">{selectedTransfer.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase text-huobi-muted font-bold tracking-widest">Counterparty</span>
                    <span className="text-sm font-bold text-huobi-text">{selectedTransfer.counterpartyName}</span>
                    <span className="text-[10px] text-huobi-muted">{selectedTransfer.counterpartyCode}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase text-huobi-muted font-bold tracking-widest">Initiated Time</span>
                    <span className="text-sm font-bold text-huobi-text">{selectedTransfer.time}</span>
                  </div>
                  {selectedTransfer.remarks && (
                    <div className="col-span-2 flex flex-col gap-1">
                      <span className="text-[10px] uppercase text-huobi-muted font-bold tracking-widest">Remarks</span>
                      <span className="text-sm text-huobi-text">{selectedTransfer.remarks}</span>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-huobi-blue/5 border border-huobi-blue/20 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-huobi-blue shrink-0 mt-0.5" />
                  <p className="text-[11px] text-huobi-muted leading-relaxed">
                    Incoming transfer instructions require your confirmation. Accepted transfers will be processed before being reflected in your holdings.
                  </p>
                </div>

                {selectedTransfer.status === 'Pending Response' && (
                  <div className="flex gap-3">
                    <button 
                      onClick={() => {
                        onAction(selectedTransfer.id, 'Accept');
                        setSelectedTransfer(null);
                      }}
                      className="flex-1 py-4 bg-huobi-up text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-huobi-up/20 hover:bg-huobi-up/90 transition-all"
                    >
                      Accept Transfer
                    </button>
                    <button 
                      onClick={() => {
                        onAction(selectedTransfer.id, 'Reject');
                        setSelectedTransfer(null);
                      }}
                      className="flex-1 py-4 bg-huobi-down/10 text-huobi-down text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-huobi-down/20 transition-all"
                    >
                      Reject Transfer
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState<'Dashboard' | 'Market' | 'Trade' | 'TransferOut' | 'Incoming' | 'Records' | 'Assets'>('Dashboard');
  const [selectedStock, setSelectedStock] = useState<Stock>(HK_STOCKS[0]);
  const [requests, setRequests] = useState<TradeRequest[]>([]);
  const [incomingTransfers, setIncomingTransfers] = useState<IncomingTransfer[]>(MOCK_INCOMING_TRANSFERS);
  const [positions, setPositions] = useState<Position[]>([
    { 
      symbol: '00700', 
      name: 'Tencent', 
      total: 1000, 
      available: 800, 
      frozen: 100, 
      processing: 100, 
      avgPrice: 375.2, 
      currentPrice: 382.4 
    }
  ]);
  const [toasts, setToasts] = useState<{id: number, message: string, type: 'success' | 'error'}[]>([]);

  const addToast = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const handleCreateRequest = (request: Omit<TradeRequest, 'id' | 'time' | 'status' | 'refNo'>) => {
    const newRequest: TradeRequest = {
      ...request,
      id: `REQ-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      time: new Date().toLocaleString(),
      status: 'Pending',
      refNo: `REF${Date.now().toString().slice(-6)}`
    };

    setRequests(prev => [newRequest, ...prev]);
    addToast(`Application ${newRequest.id} submitted. Waiting for broker review.`);
    
    // Simulate broker processing workflow
    setTimeout(() => {
      setRequests(prev => prev.map(r => r.id === newRequest.id ? { ...r, status: 'Auditing' } : r));
    }, 3000);

    setTimeout(() => {
      setRequests(prev => prev.map(r => r.id === newRequest.id ? { ...r, status: 'Accepted' } : r));
    }, 8000);
  };

  const handleCancelRequest = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Cancelled' } : r));
    addToast('Request cancelled', 'error');
  };

  const handleIncomingAction = (id: string, action: 'Accept' | 'Reject') => {
    setIncomingTransfers(prev => prev.map(t => {
      if (t.id === id) {
        const newStatus: IncomingTransferStatus = action === 'Accept' ? 'Accepted' : 'Rejected';
        addToast(`Transfer ${t.id} ${action.toLowerCase()}ed.`);
        
        if (action === 'Accept') {
          // Simulate processing to completed
          setTimeout(() => {
            setIncomingTransfers(curr => curr.map(item => 
              item.id === id ? { ...item, status: 'Processing' } : item
            ));
          }, 3000);
          
          setTimeout(() => {
            setIncomingTransfers(curr => curr.map(item => 
              item.id === id ? { ...item, status: 'Completed' } : item
            ));
            // When completed, it should affect holdings
            addToast(`Transfer ${t.id} completed. Holdings updated.`, 'success');
          }, 8000);
        }
        
        return { ...t, status: newStatus };
      }
      return t;
    }));
  };

  const handleViewChange = (newView: any) => {
    setView(newView);
  };

  const renderContent = () => {
    switch (view) {
      case 'Dashboard':
        return <DashboardView />;
      case 'Market':
        return (
          <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
            <MarketList 
              onSelect={setSelectedStock} 
              selectedSymbol={selectedStock.symbol} 
            />
            
            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto lg:overflow-hidden">
              <div className="flex-1 flex flex-col lg:flex-row min-h-0">
                <TradingChart stock={selectedStock} />
                <div className="hidden xl:flex">
                  <OrderBook stock={selectedStock} />
                </div>
              </div>
              <div className="lg:hidden">
                <RequestEntry 
                  stock={selectedStock} 
                  onCreateRequest={handleCreateRequest} 
                  initialMode="Trade"
                />
              </div>
              <PortfolioTabs 
                requests={requests} 
                positions={positions} 
                onCancelRequest={handleCancelRequest} 
              />
            </div>

            <div className="hidden lg:flex">
              <RequestEntry 
                stock={selectedStock} 
                onCreateRequest={handleCreateRequest} 
                initialMode="Trade"
              />
            </div>
          </div>
        );
      case 'Trade':
        return (
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-huobi-bg">
            <div className="max-w-5xl mx-auto flex flex-col gap-6">
              <div className="flex flex-col md:items-center md:flex-row justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <h2 className="text-2xl md:text-3xl font-bold text-huobi-text tracking-tight">Broker Entrustment</h2>
                  <p className="text-huobi-muted text-sm">
                    Submit your trading application to the broker. 
                    Final results are subject to broker review and execution results.
                  </p>
                </div>
              </div>

              <div className="bg-huobi-card border border-huobi-border rounded-2xl overflow-hidden shadow-2xl">
                <RequestEntry 
                  stock={selectedStock} 
                  onStockChange={setSelectedStock}
                  onCreateRequest={handleCreateRequest} 
                  initialMode="Trade"
                  hideModeToggle={true}
                  showStockSelector={true}
                  position={positions.find(p => p.symbol === selectedStock.symbol)}
                />
              </div>

              <div className="bg-huobi-card border border-huobi-border rounded-2xl p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-huobi-text">Recent Applications</h3>
                  <button 
                    onClick={() => setView('Records')}
                    className="text-huobi-blue text-xs font-bold hover:underline uppercase"
                  >View All Records</button>
                </div>
                <PortfolioTabs 
                  requests={requests.filter(r => r.type === 'Trade').slice(0, 5)} 
                  positions={positions} 
                  onCancelRequest={handleCancelRequest} 
                />
              </div>
            </div>
          </div>
        );
      case 'TransferOut':
        return (
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-huobi-bg">
            <div className="max-w-5xl mx-auto flex flex-col gap-6">
              <div className="flex flex-col md:items-center md:flex-row justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <h2 className="text-2xl md:text-3xl font-bold text-huobi-text tracking-tight">Stock Transfer Out</h2>
                  <p className="text-huobi-muted text-sm">
                    Submit a transfer-out application. Final result is subject to broker review and execution.
                  </p>
                </div>
              </div>

              <div className="bg-huobi-card border border-huobi-border rounded-2xl overflow-hidden shadow-2xl">
                <RequestEntry 
                  stock={selectedStock} 
                  onStockChange={setSelectedStock}
                  onCreateRequest={handleCreateRequest} 
                  initialMode="Transfer"
                  hideModeToggle={true}
                  showStockSelector={true}
                  position={positions.find(p => p.symbol === selectedStock.symbol)}
                />
              </div>

              <div className="bg-huobi-card border border-huobi-border rounded-2xl p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-huobi-text">Recent Applications</h3>
                  <button 
                    onClick={() => setView('Records')}
                    className="text-huobi-blue text-xs font-bold hover:underline uppercase"
                  >View All Records</button>
                </div>
                <PortfolioTabs 
                  requests={requests.filter(r => r.type === 'Transfer').slice(0, 5)} 
                  positions={positions} 
                  onCancelRequest={handleCancelRequest} 
                />
              </div>
            </div>
          </div>
        );
      case 'Incoming':
        return <IncomingTransfersView transfers={incomingTransfers} onAction={handleIncomingAction} />;
      case 'Records':
        return (
          <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-huobi-text flex items-center gap-3">
                  <Clock className="w-6 h-6 text-huobi-blue" />
                  Transaction Records
                </h2>
                <div className="flex gap-4">
                  <button className="px-4 py-2 bg-huobi-card border border-huobi-border rounded-lg text-sm hover:bg-huobi-border transition-colors">Export CSV</button>
                  <button className="px-4 py-2 bg-huobi-blue text-white rounded-lg text-sm hover:bg-huobi-blue/90 transition-colors">Refresh</button>
                </div>
              </div>
              <div className="bg-huobi-card border border-huobi-border rounded-xl p-6">
                <PortfolioTabs 
                  requests={requests} 
                  positions={positions} 
                  onCancelRequest={handleCancelRequest} 
                />
              </div>
            </div>
          </div>
        );
      case 'Assets':
        return (
          <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-huobi-text flex items-center gap-3">
                  <LayoutGrid className="w-6 h-6 text-huobi-blue" />
                  Asset Management
                </h2>
                <div className="flex gap-4">
                  <button className="px-4 py-2 bg-huobi-blue text-white rounded-lg text-sm hover:bg-huobi-blue/90 transition-colors">Deposit</button>
                  <button className="px-4 py-2 bg-huobi-card border border-huobi-border rounded-lg text-sm hover:bg-huobi-border transition-colors">Withdraw</button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-huobi-card p-6 rounded-xl border border-huobi-border">
                  <span className="text-sm text-huobi-muted uppercase font-bold block mb-2">Total Equity (HKD)</span>
                  <span className="text-3xl font-mono font-bold text-huobi-text">1,436,200.00</span>
                  <div className="mt-4 pt-4 border-t border-huobi-border flex justify-between items-center">
                    <span className="text-xs text-huobi-muted">≈ 183,657.60 USD</span>
                    <span className="text-xs text-huobi-up font-bold">+2.4% Today</span>
                  </div>
                </div>
                <div className="bg-huobi-card p-6 rounded-xl border border-huobi-border">
                  <span className="text-sm text-huobi-muted uppercase font-bold block mb-2">Available Cash</span>
                  <span className="text-3xl font-mono font-bold text-huobi-text">1,245,000.00</span>
                  <div className="mt-4 pt-4 border-t border-huobi-border">
                    <button className="text-huobi-blue text-xs font-bold hover:underline uppercase">Manage Bank Accounts</button>
                  </div>
                </div>
                <div className="bg-huobi-card p-6 rounded-xl border border-huobi-border">
                  <span className="text-sm text-huobi-muted uppercase font-bold block mb-2">Frozen Margin</span>
                  <span className="text-3xl font-mono font-bold text-huobi-text">150,000.00</span>
                  <div className="mt-4 pt-4 border-t border-huobi-border">
                    <span className="text-xs text-huobi-muted">Locked for 3 pending requests</span>
                  </div>
                </div>
              </div>

              <div className="bg-huobi-card border border-huobi-border rounded-xl p-6">
                <h3 className="text-lg font-bold text-huobi-text mb-4">Holdings Details</h3>
                <PortfolioTabs 
                  requests={requests} 
                  positions={positions} 
                  onCancelRequest={handleCancelRequest} 
                />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Price Simulation & Real-time Updates
  useEffect(() => {
    const unsubscribe = alltickService.subscribe(selectedStock.symbol, (ticker) => {
      const newPrice = parseFloat(ticker.last_price);
      const openPrice = parseFloat(ticker.open_price) || (newPrice - (Math.random() * 2)); // Fallback if open_price missing
      const change = newPrice - openPrice;
      const changePercent = (change / openPrice) * 100;

      setSelectedStock(prev => ({
        ...prev,
        price: newPrice,
        change: change,
        changePercent: changePercent,
        high: parseFloat(ticker.high_price) || prev.high,
        low: parseFloat(ticker.low_price) || prev.low,
        volume: parseFloat(ticker.volume) || prev.volume
      }));

      setPositions(prev => prev.map(p => {
        if (p.symbol === selectedStock.symbol) {
          return { ...p, currentPrice: newPrice };
        }
        return p;
      }));
    });

    return () => unsubscribe();
  }, [selectedStock.symbol]);

  return (
    <div className="flex flex-col h-screen overflow-hidden select-none bg-[#F3F4F6] text-huobi-text">
      <Header currentView={view} onViewChange={handleViewChange} />
      
      <main className="flex flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </main>
      
      {/* Toasts */}
      <div className="fixed bottom-20 right-8 z-[100] flex flex-col gap-3">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={cn(
                "px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl text-sm font-black uppercase tracking-widest min-w-[300px]",
                toast.type === 'success' ? "bg-huobi-up/90 border-emerald-400 text-white" : "bg-huobi-down/90 border-rose-400 text-white"
              )}
            >
              {toast.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Mobile Footer */}
      <div className="lg:hidden h-14 border-t border-huobi-border bg-huobi-card flex items-center justify-around px-4">
        <button 
          onClick={() => handleViewChange('Market')}
          className={cn("flex flex-col items-center gap-1", view === 'Market' ? "text-huobi-blue" : "text-huobi-muted")}
        >
          <LayoutGrid className="w-5 h-5" />
          <span className="text-[10px] font-bold">Market</span>
        </button>
        <button 
          onClick={() => handleViewChange('Trade')}
          className={cn("flex flex-col items-center gap-1", view === 'Trade' ? "text-huobi-blue" : "text-huobi-muted")}
        >
          <TrendingUp className="w-5 h-5" />
          <span className="text-[10px] font-bold">Trade</span>
        </button>
        <button 
          onClick={() => handleViewChange('Records')}
          className={cn("flex flex-col items-center gap-1", view === 'Records' ? "text-huobi-blue" : "text-huobi-muted")}
        >
          <Clock className="w-5 h-5" />
          <span className="text-[10px] font-bold">Records</span>
        </button>
        <button 
          onClick={() => handleViewChange('Assets')}
          className={cn("flex flex-col items-center gap-1", view === 'Assets' ? "text-huobi-blue" : "text-huobi-muted")}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-bold">Assets</span>
        </button>
      </div>
    </div>
  );
}
