import React, { useState, useMemo } from 'react';
import { LayoutGrid, Info, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { PageHeader, EmptyState, StatusChip, DetailDrawer } from '../components/index';
import type { Position } from '../constants';

type AssetKpi = {
  label: string;
  primary: string;
  secondary: string;
  trend: string;
  tone: 'up' | 'down' | 'neutral';
};

type AssetAllocationItem = {
  key: string;
  label: string;
  value: number;
  pct: number;
  dayPct: number;
  color: string;
};

type CashBucket = {
  label: string;
  available: number;
  frozen: number;
  processing: number;
  settling: number;
  ccy?: string;
};

type PendingApplication = {
  id: string;
  type: string;
  asset: string;
  amount: string;
  status: string;
  submittedAt: string;
  eta: string;
};

type FundHistoryItem = {
  time: string;
  type: string;
  ccy: string;
  amount: number;
  status: string;
  ref: string;
};

type AssetActivityItem = {
  time: string;
  title: string;
  detail: string;
  tag: string;
};

type AssetAlertItem = {
  title: string;
  detail: string;
  severity: 'info' | 'warn' | 'critical';
};

function AssetHeaderActions({ baseCurrency, accountType, lastUpdated }: { baseCurrency: string; accountType: string; lastUpdated: string }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="px-2 py-0.5 rounded-full bg-gray-100 text-huobi-text text-[11px] font-bold">{accountType}</span>
      <span className="text-[11px] text-huobi-muted">Base: <span className="text-huobi-text">{baseCurrency}</span></span>
      <span className="text-[11px] text-huobi-muted">Updated: <span className="text-huobi-text">{lastUpdated}</span></span>
    </div>
  );
}

const AssetKpiCards = ({ items }: { items: AssetKpi[] }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5 mb-6">
    {items.map((item) => (
      <div
        key={item.label}
        className="bg-white p-5 rounded-2xl border border-huobi-border shadow-sm flex flex-col gap-2 relative overflow-hidden"
      >
        <div className="absolute -top-10 right-0 w-24 h-24 bg-huobi-blue/5 rounded-full blur-2xl" />
        <div className="flex items-center justify-between relative z-10">
          <span className="text-[10px] font-black text-huobi-muted uppercase tracking-[0.2em]">{item.label}</span>
          <span
            className={cn(
              'text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full',
              item.tone === 'up' && 'text-huobi-up bg-huobi-up/10',
              item.tone === 'down' && 'text-huobi-down bg-huobi-down/10',
              item.tone === 'neutral' && 'text-huobi-muted bg-gray-100'
            )}
          >
            {item.trend}
          </span>
        </div>
        <div className="relative z-10">
          <div className="text-xl md:text-2xl font-black text-huobi-text tracking-tight">{item.primary}</div>
          <div className="mt-1 text-[11px] text-huobi-muted font-bold">{item.secondary}</div>
        </div>
      </div>
    ))}
  </div>
);

const AssetAllocationCard = ({ items }: { items: AssetAllocationItem[] }) => {
  const total = items.reduce((acc, cur) => acc + cur.value, 0) || 1;
  return (
    <div className="bg-white rounded-2xl border border-huobi-border p-5 flex flex-col gap-4">
      <div>
        <h3 className="text-sm font-bold text-huobi-text">Asset Allocation</h3>
        <p className="text-[11px] text-huobi-muted mt-1">Snapshot of holdings vs cash across categories.</p>
      </div>
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="w-full md:w-1/2 h-8 rounded-full bg-gray-100 flex overflow-hidden">
          {items.map((item) => (
            <div key={item.key} style={{ width: `${(item.value / total) * 100}%`, backgroundColor: item.color }} className="h-full" />
          ))}
        </div>
        <div className="w-full md:w-1/2 space-y-2">
          {items.map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs font-bold text-huobi-text">{item.label}</span>
              </div>
              <div className="flex items-center gap-4 text-[11px] font-bold">
                <span className="text-huobi-text">{item.value.toLocaleString()} HKD</span>
                <span className="text-huobi-muted">{item.pct.toFixed(1)}%</span>
                <span className={cn(item.dayPct >= 0 ? 'text-huobi-up' : 'text-huobi-down')}>
                  {item.dayPct >= 0 ? '+' : ''}{item.dayPct.toFixed(2)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CashBreakdownCard = ({ buckets }: { buckets: CashBucket[] }) => (
  <div className="bg-white rounded-2xl border border-huobi-border p-5 flex flex-col gap-4">
    <div>
      <h3 className="text-sm font-bold text-huobi-text">Cash & Digital Asset Breakdown</h3>
      <p className="text-[11px] text-huobi-muted mt-1">Available, frozen, processing and settling balances by currency / asset.</p>
    </div>
    <div className="space-y-3">
      {buckets.map((b) => {
        const total = b.available + b.frozen + b.processing + b.settling || 1;
        return (
          <div key={b.label} className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-bold">
              <span className="text-huobi-text">{b.label} {b.ccy ? `· ${b.ccy}` : ''}</span>
              <span className="text-huobi-muted">Total {total.toLocaleString()} {b.ccy ?? 'HKD'}</span>
            </div>
            <div className="h-2 rounded-full bg-gray-100 flex overflow-hidden">
              <div className="h-full bg-huobi-up/80" style={{ width: `${(b.available / total) * 100}%` }} />
              <div className="h-full bg-amber-400/70" style={{ width: `${(b.processing / total) * 100}%` }} />
              <div className="h-full bg-huobi-down/70" style={{ width: `${(b.frozen / total) * 100}%` }} />
              <div className="h-full bg-sky-400/60" style={{ width: `${(b.settling / total) * 100}%` }} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-huobi-muted font-bold">
              <span>Avail: <span className="text-huobi-text">{b.available.toLocaleString()}</span></span>
              <span>Frozen: <span className="text-huobi-text">{b.frozen.toLocaleString()}</span></span>
              <span>Processing: <span className="text-huobi-text">{b.processing.toLocaleString()}</span></span>
              <span>Settling: <span className="text-huobi-text">{b.settling.toLocaleString()}</span></span>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

const PositionsTable = ({ positions }: { positions: Position[] }) => {
  const totalMv = positions.reduce((acc, p) => acc + p.total * p.currentPrice, 0) || 1;
  if (positions.length === 0) {
    return <EmptyState icon={LayoutGrid} title="No positions" description="Holdings will appear here after trades are executed." compact />;
  }
  return (
    <div className="overflow-auto custom-scrollbar">
      <div className="flex flex-wrap items-center gap-4 mb-3 text-[10px] font-bold text-huobi-muted uppercase tracking-wider">
        <span>{positions.length} position{positions.length !== 1 ? 's' : ''}</span>
        <span>Total market value: {totalMv.toLocaleString()} HKD</span>
      </div>
      <table className="min-w-full text-xs">
        <thead className="sticky top-0 bg-white z-10 text-[10px] text-huobi-muted uppercase tracking-[0.18em]">
          <tr className="text-left border-b border-huobi-border">
            <th className="py-2 pr-4 font-bold">Asset</th>
            <th className="py-2 pr-4 font-bold text-right">Qty</th>
            <th className="py-2 pr-4 font-bold text-right">Available</th>
            <th className="py-2 pr-4 font-bold text-right">Frozen</th>
            <th className="py-2 pr-4 font-bold text-right">Processing</th>
            <th className="py-2 pr-4 font-bold text-right">Avg Cost</th>
            <th className="py-2 pr-4 font-bold text-right">Mkt Price</th>
            <th className="py-2 pr-4 font-bold text-right">Mkt Value</th>
            <th className="py-2 pr-4 font-bold text-right">Unreal. P&L</th>
            <th className="py-2 pr-4 font-bold text-right">Weight</th>
          </tr>
        </thead>
        <tbody className="text-[11px] text-huobi-text">
          {positions.map((p) => {
            const marketValue = p.total * p.currentPrice;
            const pnl = (p.currentPrice - p.avgPrice) * p.total;
            const weight = (marketValue / totalMv) * 100;
            return (
              <tr key={p.symbol} className="border-t border-huobi-border/60 hover:bg-huobi-card/50 transition-colors">
                <td className="py-2 pr-4">
                  <div className="flex flex-col">
                    <span className="font-bold">{p.name}</span>
                    <span className="text-[10px] text-huobi-muted font-mono">{p.symbol}</span>
                  </div>
                </td>
                <td className="py-2 pr-4 text-right font-mono">{p.total.toLocaleString()}</td>
                <td className="py-2 pr-4 text-right font-mono">{p.available.toLocaleString()}</td>
                <td className="py-2 pr-4 text-right font-mono text-huobi-down">{p.frozen.toLocaleString()}</td>
                <td className="py-2 pr-4 text-right font-mono text-amber-600">{p.processing.toLocaleString()}</td>
                <td className="py-2 pr-4 text-right font-mono">{p.avgPrice.toFixed(2)}</td>
                <td className="py-2 pr-4 text-right font-mono">{p.currentPrice.toFixed(2)}</td>
                <td className="py-2 pr-4 text-right font-mono">{marketValue.toLocaleString()}</td>
                <td className={cn('py-2 pr-4 text-right font-mono', pnl >= 0 ? 'text-huobi-up' : 'text-huobi-down')}>
                  {pnl >= 0 ? '+' : ''}{pnl.toFixed(0)}
                </td>
                <td className="py-2 pr-4 text-right font-mono">{weight.toFixed(1)}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const PendingApplicationsTable = ({ items }: { items: PendingApplication[] }) => {
  if (items.length === 0) {
    return <EmptyState icon={Clock} title="No pending applications" description="Applications you submit will appear here." compact />;
  }
  return (
    <div className="overflow-auto custom-scrollbar">
      <div className="mb-3 text-[10px] font-bold text-huobi-muted uppercase tracking-wider">{items.length} application{items.length !== 1 ? 's' : ''}</div>
      <table className="min-w-full text-xs">
        <thead className="sticky top-0 bg-white z-10 text-[10px] text-huobi-muted uppercase tracking-[0.18em]">
          <tr className="text-left border-b border-huobi-border">
            <th className="py-2 pr-4 font-bold">Application ID</th>
            <th className="py-2 pr-4 font-bold">Type</th>
            <th className="py-2 pr-4 font-bold">Asset / Currency</th>
            <th className="py-2 pr-4 font-bold text-right">Amount / Qty</th>
            <th className="py-2 pr-4 font-bold">Status</th>
            <th className="py-2 pr-4 font-bold">Submitted</th>
            <th className="py-2 pr-4 font-bold">ETA</th>
          </tr>
        </thead>
        <tbody className="text-[11px] text-huobi-text">
          {items.map((item) => (
            <tr key={item.id} className="border-t border-huobi-border/60 hover:bg-huobi-card/50 transition-colors">
              <td className="py-2 pr-4 font-mono">{item.id}</td>
              <td className="py-2 pr-4">{item.type}</td>
              <td className="py-2 pr-4">{item.asset}</td>
              <td className="py-2 pr-4 text-right font-mono">{item.amount}</td>
              <td className="py-2 pr-4">
                <StatusChip label={item.status} variant={item.status === 'Pending' ? 'pending' : item.status === 'Processing' ? 'processing' : item.status === 'Accepted' ? 'completed' : 'rejected'} />
              </td>
              <td className="py-2 pr-4 text-huobi-muted">{item.submittedAt}</td>
              <td className="py-2 pr-4 text-huobi-muted">{item.eta}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const FundHistoryTable = ({ items }: { items: FundHistoryItem[] }) => {
  if (items.length === 0) {
    return <EmptyState icon={LayoutGrid} title="No fund history" description="Deposits, withdrawals and fees will appear here." compact />;
  }
  return (
    <div className="overflow-auto custom-scrollbar">
      <div className="mb-3 text-[10px] font-bold text-huobi-muted uppercase tracking-wider">{items.length} record{items.length !== 1 ? 's' : ''}</div>
      <table className="min-w-full text-xs">
        <thead className="sticky top-0 bg-white z-10 text-[10px] text-huobi-muted uppercase tracking-[0.18em]">
          <tr className="text-left border-b border-huobi-border">
            <th className="py-2 pr-4 font-bold">Time</th>
            <th className="py-2 pr-4 font-bold">Type</th>
            <th className="py-2 pr-4 font-bold">Currency</th>
            <th className="py-2 pr-4 font-bold text-right">Amount</th>
            <th className="py-2 pr-4 font-bold">Status</th>
            <th className="py-2 pr-4 font-bold">Reference</th>
          </tr>
        </thead>
        <tbody className="text-[11px] text-huobi-text">
          {items.map((item, idx) => (
            <tr key={idx} className="border-t border-huobi-border/60 hover:bg-huobi-card/50 transition-colors">
              <td className="py-2 pr-4 text-huobi-muted">{item.time}</td>
              <td className="py-2 pr-4">{item.type}</td>
              <td className="py-2 pr-4">{item.ccy}</td>
              <td className="py-2 pr-4 text-right font-mono">{item.amount.toLocaleString()}</td>
              <td className="py-2 pr-4">
                <StatusChip label={item.status} variant={item.status === 'Completed' ? 'completed' : item.status === 'Processing' ? 'processing' : 'rejected'} />
              </td>
              <td className="py-2 pr-4 font-mono text-huobi-muted">{item.ref}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const RecentActivityCard = ({ items, onViewAll }: { items: AssetActivityItem[]; onViewAll?: () => void }) => {
  return (
    <div className="bg-white rounded-2xl border border-huobi-border p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-huobi-text">Recent Activity</h3>
        <button
          type="button"
          onClick={onViewAll}
          className="text-[11px] text-huobi-blue font-bold hover:underline disabled:text-huobi-muted disabled:cursor-default"
          disabled={!onViewAll}
        >
          View all
        </button>
      </div>
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] text-huobi-text font-bold">{item.title}</span>
              <span className="text-[10px] text-huobi-muted">{item.detail}</span>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-[10px] text-huobi-muted">{item.time}</span>
              <span className="px-2 py-0.5 rounded-full bg-gray-100 text-[10px] font-black uppercase tracking-widest text-huobi-muted">
                {item.tag}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AssetAlertsCard = ({ items }: { items: AssetAlertItem[] }) => (
  <div className="bg-white rounded-2xl border border-huobi-border p-5 flex flex-col gap-3">
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-bold text-huobi-text">Alerts & Notices</h3>
      <span className="text-[10px] text-huobi-muted font-bold uppercase tracking-[0.2em]">Controlled business</span>
    </div>
    <div className="space-y-2.5">
      {items.map((item, idx) => (
        <div key={idx} className={cn('p-3 rounded-2xl border flex items-start gap-3 text-[11px]', item.severity === 'info' && 'bg-sky-50 border-sky-100', item.severity === 'warn' && 'bg-amber-50 border-amber-100', item.severity === 'critical' && 'bg-rose-50 border-rose-100')}>
          <div className="mt-0.5 shrink-0">
            {item.severity === 'info' && <Info className="w-4 h-4 text-sky-500" />}
            {(item.severity === 'warn' || item.severity === 'critical') && <AlertCircle className="w-4 h-4 text-amber-500" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-huobi-text">{item.title}</span>
              <span className="text-[10px] text-huobi-muted font-mono uppercase shrink-0">{item.severity}</span>
            </div>
            <p className="text-[10px] text-huobi-muted mt-1">{item.detail}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

type TabId = 'Positions' | 'Pending' | 'History';

const AssetManagementTabs = ({
  positions,
  pendingApplications,
  fundHistory,
}: {
  positions: Position[];
  pendingApplications: PendingApplication[];
  fundHistory: FundHistoryItem[];
}) => {
  const [activeTab, setActiveTab] = useState<TabId>('Positions');
  return (
    <div className="bg-white rounded-2xl border border-huobi-border p-5 flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap">
        {(['Positions', 'Pending', 'History'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn('px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-[0.18em] transition-all', activeTab === tab ? 'bg-huobi-text text-white shadow-lg' : 'bg-huobi-card text-huobi-muted hover:bg-huobi-border')}
          >
            {tab === 'Positions' ? 'Positions' : tab === 'Pending' ? 'Pending Applications' : 'Fund History'}
          </button>
        ))}
      </div>
      <div className="border-t border-huobi-border/70 pt-4 -mx-5 px-5">
        {activeTab === 'Positions' && <PositionsTable positions={positions} />}
        {activeTab === 'Pending' && <PendingApplicationsTable items={pendingApplications} />}
        {activeTab === 'History' && <FundHistoryTable items={fundHistory} />}
      </div>
    </div>
  );
};

export default function AssetsView({ positions }: { positions: Position[] }) {
  const kpis: AssetKpi[] = useMemo(
    () => [
      { label: 'Total Equity', primary: '1,586,200 HKD', secondary: 'Including HKD cash, securities, USDT & token balances', trend: '+2.4% Today', tone: 'up' },
      { label: 'Available Cash', primary: '1,245,000 HKD', secondary: 'Excluding frozen / processing', trend: 'Stable', tone: 'neutral' },
      { label: 'Holdings Market Value', primary: '191,200 HKD', secondary: 'Equity holdings', trend: '+1.9% Today', tone: 'up' },
      { label: 'Digital Assets', primary: '100,000 HKD', secondary: 'USDT holdings only', trend: '+0.8% 1D', tone: 'up' },
      { label: 'Unrealized P&L', primary: '34,560 HKD', secondary: 'Across all open positions', trend: '+2.47% 1D', tone: 'up' },
    ],
    []
  );

  const allocation: AssetAllocationItem[] = useMemo(
    () => [
      { key: 'Cash', label: 'Cash', value: 1_245_000, pct: 86.7, dayPct: 0.12, color: '#0052ff' },
      { key: 'HK', label: 'Hong Kong Stocks', value: 160_800, pct: 11.2, dayPct: 1.85, color: '#10B981' },
      { key: 'US', label: 'US Stocks', value: 21_500, pct: 1.5, dayPct: -0.42, color: '#6366F1' },
      { key: 'USDT', label: 'USDT', value: 100_000, pct: 6.3, dayPct: 0.35, color: '#22C55E' },
    ],
    []
  );

  const cashBuckets: CashBucket[] = useMemo(
    () => [
      { label: 'HKD Ledger', ccy: 'HKD', available: 980_000, frozen: 120_000, processing: 18_000, settling: 10_000 },
      { label: 'USD Ledger', ccy: 'USD', available: 210_000, frozen: 25_000, processing: 12_000, settling: 7_800 },
      { label: 'CNY Ledger', ccy: 'CNY', available: 55_000, frozen: 5_000, processing: 2_000, settling: 1_400 },
      { label: 'USDT Balance', ccy: 'USDT', available: 100_000, frozen: 10_000, processing: 0, settling: 0 },
    ],
    []
  );

  const [pendingApplications, setPendingApplications] = useState<PendingApplication[]>([
    { id: 'APP-230184', type: 'Withdrawal', asset: 'HKD', amount: '100,000', status: 'Processing', submittedAt: 'Today 10:24', eta: 'T+1' },
    { id: 'APP-230183', type: 'USDT Deposit', asset: 'USDT', amount: '20,000', status: 'Pending', submittedAt: 'Today 09:58', eta: 'Awaiting network confirmations' },
    { id: 'APP-230172', type: 'Transfer Out', asset: '00700.HK', amount: '500 shares', status: 'Pending', submittedAt: 'Yesterday 14:18', eta: 'Broker review' },
    { id: 'APP-230165', type: 'Deposit', asset: 'USD', amount: '5,000', status: 'Accepted', submittedAt: 'Mar 10 09:05', eta: 'Completed' },
  ]);

  const [fundHistory, setFundHistory] = useState<FundHistoryItem[]>([
    { time: 'Today 10:01', type: 'USDT Deposit', ccy: 'USDT', amount: 20_000, status: 'Processing', ref: 'USDT-DP-882913' },
    { time: 'Today 09:15', type: 'Fee', ccy: 'HKD', amount: -120, status: 'Completed', ref: 'FEE-829103' },
    { time: 'Yesterday 16:30', type: 'Dividend', ccy: 'HKD', amount: 2_600, status: 'Completed', ref: 'DIV-233712' },
    { time: 'Mar 10 14:12', type: 'Withdrawal', ccy: 'HKD', amount: -10_000, status: 'Processing', ref: 'WD-993817' },
    { time: 'Mar 02 11:05', type: 'Deposit', ccy: 'USD', amount: 5_000, status: 'Completed', ref: 'DP-117389' },
  ]);

  const recentActivity: AssetActivityItem[] = useMemo(
    () => [
      { time: '10:42', title: 'Dividend credited · 00700.HK', detail: 'HKD 2,600 credited to cash ledger.', tag: 'Income' },
      { time: '10:01', title: 'USDT deposit detected', detail: '20,000 USDT pending confirmations on TRC20.', tag: 'Digital Asset' },
    ],
    []
  );

  const alerts: AssetAlertItem[] = useMemo(
    () => [
      { title: 'Pending risk disclosure acknowledgement', detail: 'Your risk disclosure confirmation was last updated 30 days ago. Certain products may be temporarily restricted.', severity: 'warn' },
      { title: 'Frozen margin for 3 pending requests', detail: 'HKD 150,000 is locked as settlement margin for transfer-out and withdrawal requests.', severity: 'info' },
      { title: 'Controlled business reminder', detail: 'Please ensure all fund movements are within permitted controlled business scope and duly documented.', severity: 'critical' },
    ],
    []
  );

  const account = useMemo(
    () => ({ accountType: 'Securities', baseCurrency: 'HKD', lastUpdated: new Date().toLocaleString() }),
    []
  );

  const [openAction, setOpenAction] = useState<'deposit' | 'withdraw' | 'transfer' | 'export' | null>(null);
  const [depositAssetKind, setDepositAssetKind] = useState<'Fiat' | 'USDT' | 'Token'>('Fiat');
  const [depositCurrency, setDepositCurrency] = useState<'HKD' | 'USD' | 'CNY'>('HKD');
  const [depositAmount, setDepositAmount] = useState('');
  const [depositStep, setDepositStep] = useState<'form' | 'summary' | 'submitted'>('form');
  const [depositError, setDepositError] = useState<string | null>(null);
  const [depositRef, setDepositRef] = useState<string | null>(null);
  const [depositSubmittedAt, setDepositSubmittedAt] = useState<string | null>(null);

  const [withdrawAssetKind, setWithdrawAssetKind] = useState<'Fiat' | 'USDT' | 'Token'>('Fiat');
  const [withdrawCurrency, setWithdrawCurrency] = useState<'HKD' | 'USD' | 'CNY'>('HKD');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawError, setWithdrawError] = useState<string | null>(null);
  const [withdrawStep, setWithdrawStep] = useState<'form' | 'submitted'>('form');
  const [withdrawRef, setWithdrawRef] = useState<string | null>(null);
  const [withdrawSubmittedAt, setWithdrawSubmittedAt] = useState<string | null>(null);

  const [transferFrom, setTransferFrom] = useState<'USDT' | 'HKD'>('USDT');
  const [transferTo, setTransferTo] = useState<'USDT' | 'HKD'>('HKD');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferError, setTransferError] = useState<string | null>(null);

  const resetActionState = () => {
    setDepositAssetKind('Fiat');
    setDepositCurrency('HKD');
    setWithdrawAssetKind('Fiat');
    setDepositAmount('');
    setDepositStep('form');
    setDepositError(null);
    setDepositRef(null);
    setDepositSubmittedAt(null);
    setWithdrawCurrency('HKD');
    setWithdrawAmount('');
    setWithdrawError(null);
    setWithdrawStep('form');
    setWithdrawRef(null);
    setWithdrawSubmittedAt(null);
    setTransferFrom('USDT');
    setTransferTo('HKD');
    setTransferAmount('');
    setTransferError(null);
  };

  const closeDrawer = () => {
    setOpenAction(null);
    resetActionState();
  };

  const validatePositiveAmount = (raw: string, min: number) => {
    const value = Number(raw);
    if (!raw || Number.isNaN(value)) return 'Please enter a valid amount';
    if (value <= 0) return 'Amount must be greater than 0';
    if (value < min) return `Minimum amount is ${min.toLocaleString()} `;
    return null;
  };

  const handleConfirmDeposit = () => {
    const minAmount = depositAssetKind === 'Fiat' ? 1000 : 100; // digital assets can have smaller minimum
    const error = validatePositiveAmount(depositAmount, minAmount);
    setDepositError(error);
    if (error) {
      setDepositStep('form');
      return;
    }
    if (depositAssetKind === 'Fiat') {
      if (depositStep === 'form') {
        setDepositStep('summary');
        return;
      }
      if (depositStep === 'summary') {
        const amountNumber = Number(depositAmount);
        const ref = `DP-${Date.now().toString().slice(-6)}`;
        const now = new Date();
        const time = now.toLocaleString();
        setPendingApplications(prev => [
          {
            id: `APP-${Date.now().toString().slice(-6)}`,
            type: 'Deposit',
            asset: depositCurrency,
            amount: amountNumber.toLocaleString(),
            status: 'Pending',
            submittedAt: time,
            eta: 'T+1',
          },
          ...prev,
        ]);
        setFundHistory(prev => [
          {
            time,
            type: 'Deposit',
            ccy: depositCurrency,
            amount: amountNumber,
            status: 'Pending',
            ref,
          },
          ...prev,
        ]);
        setDepositRef(ref);
        setDepositSubmittedAt(time);
        setDepositStep('submitted');
      }
      return;
    }

    // Digital asset deposit (USDT) – single-step confirmation
    const amountNumber = Number(depositAmount);
    const now = new Date();
    const time = now.toLocaleString();
    const ref = `USDT-DP-${Date.now().toString().slice(-6)}`;
    const assetLabel = 'USDT';
    const typeLabel = 'USDT Deposit';
    setPendingApplications(prev => [
      {
        id: `APP-${Date.now().toString().slice(-6)}`,
        type: typeLabel,
        asset: assetLabel,
        amount: amountNumber.toLocaleString(),
        status: 'Pending',
        submittedAt: time,
        eta: 'Awaiting network confirmations',
      },
      ...prev,
    ]);
    setFundHistory(prev => [
      {
        time,
        type: typeLabel,
        ccy: assetLabel,
        amount: amountNumber,
        status: 'Processing',
        ref,
      },
      ...prev,
    ]);
    setDepositRef(ref);
    setDepositSubmittedAt(time);
    setDepositStep('submitted');
  };

  const handleSubmitWithdraw = () => {
    const minAmount = withdrawAssetKind === 'Fiat' ? 1000 : 100;
    const error = validatePositiveAmount(withdrawAmount, minAmount);
    setWithdrawError(error);
    if (error) return;
    const amountNumber = Number(withdrawAmount);
    const now = new Date();
    const time = now.toLocaleString();
    const ref = `WD-${Date.now().toString().slice(-6)}`;
    const isDigital = withdrawAssetKind !== 'Fiat';
    const assetLabel = isDigital ? 'USDT' : withdrawCurrency;
    const typeLabel = isDigital ? 'USDT Withdrawal' : 'Withdrawal';
    const eta = isDigital ? 'Within 1 hour (network)' : 'T+1';

    setPendingApplications(prev => [
      {
        id: `APP-${Date.now().toString().slice(-6)}`,
        type: typeLabel,
        asset: assetLabel,
        amount: amountNumber.toLocaleString(),
        status: 'Processing',
        submittedAt: time,
        eta,
      },
      ...prev,
    ]);
    setFundHistory(prev => [
      {
        time,
        type: typeLabel,
        ccy: assetLabel,
        amount: -amountNumber,
        status: 'Processing',
        ref,
      },
      ...prev,
    ]);
    setWithdrawRef(ref);
    setWithdrawSubmittedAt(time);
    setWithdrawStep('submitted');
  };

  const handleSubmitTransfer = () => {
    if (transferFrom === transferTo) {
      setTransferError('Source and target assets must be different');
      return;
    }
    const error = validatePositiveAmount(transferAmount, 1);
    setTransferError(error);
    if (error) return;
    const amountNumber = Number(transferAmount);
    const now = new Date();
    const time = now.toLocaleString();
    setPendingApplications(prev => [
      {
        id: `APP-${Date.now().toString().slice(-6)}`,
        type: `Exchange ${transferFrom} → ${transferTo}`,
        asset: `${transferFrom} → ${transferTo}`,
        amount: amountNumber.toLocaleString(),
        status: 'Processing',
        submittedAt: time,
        eta: 'Within minutes',
      },
      ...prev,
    ]);
    setFundHistory(prev => [
      {
        time,
        type: `Exchange ${transferFrom} → ${transferTo}`,
        ccy: transferFrom,
        amount: -amountNumber,
        status: 'Processing',
        ref,
      },
      ...prev,
    ]);
    closeDrawer();
  };

  const actionConfig = {
    deposit: { title: 'Deposit Assets', subtitle: 'Add fiat or digital assets to your account' },
    withdraw: { title: 'Withdraw Assets', subtitle: 'Submit a withdrawal request' },
    transfer: { title: 'Exchange', subtitle: 'Exchange between USDT and HKD inside your account' },
    export: { title: 'Export Statement', subtitle: 'Download your account statement' },
  };

  return (
    <div className="flex-1 p-6 md:p-8 overflow-y-auto custom-scrollbar bg-[#F3F4F6]">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        <PageHeader
          sectionLabel="Asset Management"
          title="Asset Overview"
          subtitle="Centralized view of your total equity, cash, digital assets and recent fund activities across the account."
          actions={[
            { label: 'Deposit', onClick: () => setOpenAction('deposit'), primary: true },
            { label: 'Withdraw', onClick: () => setOpenAction('withdraw') },
            { label: 'Exchange', onClick: () => setOpenAction('transfer') },
            { label: 'Export Statement', onClick: () => setOpenAction('export') },
          ]}
        >
          <AssetHeaderActions baseCurrency={account.baseCurrency} accountType={account.accountType} lastUpdated={account.lastUpdated} />
        </PageHeader>
        <AssetKpiCards items={kpis} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <AssetAllocationCard items={allocation} />
          <CashBreakdownCard buckets={cashBuckets} />
        </div>
        <AssetManagementTabs positions={positions} pendingApplications={pendingApplications} fundHistory={fundHistory} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            <RecentActivityCard
              items={recentActivity}
              onViewAll={() => {
                const el = document.getElementById('asset-history');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
            />
          </div>
          <AssetAlertsCard items={alerts} />
        </div>
      </div>

      {/* Action modals: Deposit / Withdraw / Transfer / Export */}
      {openAction && (
        <DetailDrawer
          open={!!openAction}
          onClose={closeDrawer}
          title={actionConfig[openAction].title}
          subtitle={actionConfig[openAction].subtitle}
          footer={
            openAction === 'export' ? (
              <button
                type="button"
                onClick={closeDrawer}
                className="w-full py-3 rounded-xl bg-huobi-blue text-white text-xs font-bold uppercase tracking-widest hover:bg-huobi-blue/90"
              >
                Download
              </button>
            ) : (
              <button
                type="button"
                onClick={closeDrawer}
                className="w-full py-3 rounded-xl border border-huobi-border text-huobi-text text-xs font-bold uppercase tracking-widest hover:bg-huobi-card"
              >
                Cancel
              </button>
            )
          }
        >
          {openAction === 'deposit' && (
            <div className="flex flex-col gap-4">
              {depositStep === 'form' && (
                <>
                  <p className="text-[11px] text-huobi-muted">
                    Select asset type and amount to deposit. Fiat deposits follow bank instructions, while USDT / token deposits use on-chain
                    addresses.
                  </p>
                  <div>
                    <label className="block text-[10px] font-bold text-huobi-muted uppercase tracking-wider mb-1">Asset type</label>
                    <div className="inline-flex rounded-xl bg-huobi-card p-1">
                      {(['Fiat', 'USDT'] as const).map(kind => (
                        <button
                          key={kind}
                          type="button"
                          onClick={() => setDepositAssetKind(kind)}
                          className={cn(
                            'px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-widest',
                            depositAssetKind === kind ? 'bg-huobi-text text-white' : 'text-huobi-muted'
                          )}
                        >
                          {kind === 'Fiat' ? 'Fiat' : 'USDT'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-huobi-muted uppercase tracking-wider mb-1">Asset</label>
                    {depositAssetKind === 'Fiat' ? (
                      <select
                        className="w-full px-4 py-3 rounded-xl border border-huobi-border bg-white text-sm font-bold focus:outline-none focus:border-huobi-blue"
                        value={depositCurrency}
                        onChange={(e) => setDepositCurrency(e.target.value as 'HKD' | 'USD' | 'CNY')}
                      >
                        <option value="HKD">HKD</option>
                        <option value="USD">USD</option>
                        <option value="CNY">CNY</option>
                      </select>
                    ) : (
                      <input
                        disabled
                        value="USDT · TRON (TRC20)"
                        className="w-full px-4 py-3 rounded-xl border border-huobi-border bg-gray-50 text-sm font-bold text-huobi-text"
                      />
                    )}
                  </div>
                  {depositAssetKind === 'Fiat' && (
                    <div>
                      <label className="block text-[10px] font-bold text-huobi-muted uppercase tracking-wider mb-1">Amount</label>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={depositAmount}
                        onChange={(e) => {
                          setDepositAmount(e.target.value);
                          if (depositError) setDepositError(null);
                        }}
                        className="w-full px-4 py-3 rounded-xl border border-huobi-border font-mono focus:outline-none focus:border-huobi-blue"
                      />
                      {depositError && <p className="mt-1 text-[10px] text-huobi-down">{depositError}</p>}
                    </div>
                  )}
                  {depositAssetKind === 'Fiat' ? (
                    <div className="p-3 rounded-xl bg-huobi-card border border-huobi-border text-[11px] text-huobi-muted">
                      Minimum online deposit is 1,000.00. After confirming, you will receive funding instructions and a reference code for your bank
                      transfer.
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <div className="p-3 rounded-xl bg-huobi-card border border-huobi-border text-[11px] text-huobi-muted">
                        USDT deposits are credited via the TRON (TRC20) network. Send USDT only to the address below. Do not deposit other tokens or
                        use non‑TRON networks, otherwise your assets may be permanently lost.
                      </div>
                      <div className="rounded-2xl border border-huobi-border bg-white p-3 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-huobi-muted uppercase tracking-wider">Network</span>
                          <span className="px-2 py-0.5 rounded-full bg-sky-50 text-[10px] font-bold text-sky-700 uppercase tracking-widest">
                            TRON · TRC20
                          </span>
                        </div>
                      </div>
                      <div className="rounded-2xl border border-huobi-border bg-white p-3 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-huobi-muted uppercase tracking-wider">Deposit address</span>
                          <button
                            type="button"
                            className="px-2 py-1 rounded-md border border-huobi-border text-[10px] font-bold uppercase tracking-widest text-huobi-muted hover:bg-huobi-card"
                            onClick={() => {
                              const addr = 'TUSDTdemoAddress1234567890ABCDEF';
                              navigator.clipboard?.writeText(addr).catch(() => {});
                            }}
                          >
                            Copy
                          </button>
                        </div>
                        <div className="font-mono text-[11px] text-huobi-text break-all">
                          TUSDTdemoAddress1234567890ABCDEF
                        </div>
                        <div className="mt-2 flex items-center justify-center">
                          {/* Demo QR placeholder – replace with real QR when backend is ready */}
                          <div className="w-28 h-28 rounded-2xl bg-[radial-gradient(circle_at_20%_20%,#22c55e_0,#22c55e_35%,#0f172a_36%,#0f172a_100%)] border border-huobi-border/40 shadow-sm" />
                        </div>
                      </div>
                    </div>
                  )}
                  {depositAssetKind === 'Fiat' && (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleConfirmDeposit}
                        className="px-6 py-2 rounded-xl bg-huobi-blue text-white text-xs font-bold uppercase tracking-widest hover:bg-huobi-blue/90 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!depositAmount}
                      >
                        Continue
                      </button>
                    </div>
                  )}
                </>
              )}
              {depositStep === 'summary' && depositAssetKind === 'Fiat' && (
                <>
                  <p className="text-[11px] text-huobi-muted">
                    Please review the deposit details below. Use the provided bank information and reference when initiating the transfer.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-[11px]">
                    <div>
                      <div className="text-huobi-muted uppercase font-bold">Currency</div>
                      <div className="mt-1 font-bold text-huobi-text">{depositCurrency}</div>
                    </div>
                    <div>
                      <div className="text-huobi-muted uppercase font-bold">Amount</div>
                      <div className="mt-1 font-mono text-huobi-text">{Number(depositAmount || 0).toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-huobi-muted uppercase font-bold">Funding method</div>
                      <div className="mt-1 text-huobi-text">Bank transfer</div>
                    </div>
                    <div>
                      <div className="text-huobi-muted uppercase font-bold">Expected credit</div>
                      <div className="mt-1 text-huobi-text">T+1 after funds received</div>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-huobi-card border border-huobi-border text-[11px] text-huobi-muted">
                    Bank: VC Securities Client Trust<br />
                    Account: 123-456789-001<br />
                    Reference: will be generated after you confirm and used to match your incoming transfer.
                  </div>
                  <div className="flex justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setDepositStep('form')}
                      className="px-4 py-2 rounded-xl border border-huobi-border text-xs font-bold uppercase tracking-widest text-huobi-text hover:bg-huobi-card"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmDeposit}
                      className="px-6 py-2 rounded-xl bg-huobi-blue text-white text-xs font-bold uppercase tracking-widest hover:bg-huobi-blue/90"
                    >
                      Confirm & Generate Reference
                    </button>
                  </div>
                </>
              )}
              {depositStep === 'submitted' && depositAssetKind === 'Fiat' && (
                <div className="flex flex-col gap-5">
                  <div className="p-4 rounded-2xl bg-huobi-up/10 border border-huobi-up/40 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-huobi-up mt-0.5" />
                    <div className="text-[11px] text-huobi-text">
                      <div className="font-black uppercase tracking-widest text-huobi-up mb-1">Deposit request submitted</div>
                      <p className="text-huobi-muted">
                        Your deposit instruction has been created and is currently{' '}
                        <span className="font-mono font-bold text-huobi-up">PENDING FUNDS</span>. Please complete the bank transfer using the
                        reference below so we can match your payment.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-[11px]">
                    <div>
                      <div className="text-huobi-muted uppercase font-bold">Reference</div>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="font-mono text-huobi-text">{depositRef}</span>
                        {depositRef && (
                          <button
                            type="button"
                            onClick={() => {
                              if (depositRef) {
                                navigator.clipboard?.writeText(depositRef).catch(() => {});
                              }
                            }}
                            className="px-2 py-1 rounded-md border border-huobi-border text-[10px] font-bold uppercase tracking-widest text-huobi-muted hover:bg-huobi-card"
                          >
                            Copy
                          </button>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-huobi-muted uppercase font-bold">Status</div>
                      <div className="mt-1 font-bold text-huobi-up">
                        {depositAssetKind === 'Fiat' ? 'Pending bank transfer' : 'Awaiting on-chain confirmations'}
                      </div>
                    </div>
                    <div>
                      <div className="text-huobi-muted uppercase font-bold">Asset</div>
                      <div className="mt-1 font-bold text-huobi-text">
                        {depositAssetKind === 'Fiat' ? depositCurrency : 'USDT'}
                      </div>
                    </div>
                    <div>
                      <div className="text-huobi-muted uppercase font-bold">Amount</div>
                      <div className="mt-1 font-mono text-huobi-text">
                        {Number(depositAmount || 0).toLocaleString()}{' '}
                        {depositAssetKind === 'Fiat' ? depositCurrency : 'USDT'}
                      </div>
                    </div>
                    <div>
                      <div className="text-huobi-muted uppercase font-bold">Funding method</div>
                      <div className="mt-1 text-huobi-text">
                        {depositAssetKind === 'Fiat' ? 'Bank transfer' : 'On-chain transfer'}
                      </div>
                    </div>
                    <div>
                      <div className="text-huobi-muted uppercase font-bold">Expected credit</div>
                      <div className="mt-1 text-huobi-text">T+1 after funds received</div>
                    </div>
                    <div>
                      <div className="text-huobi-muted uppercase font-bold">Submitted at</div>
                      <div className="mt-1 text-huobi-text">{depositSubmittedAt}</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-huobi-card border border-huobi-border text-[11px] text-huobi-muted">
                    {depositAssetKind === 'Fiat'
                      ? 'Bank: VC Finance Client Trust · Account: 123-456789-001. Use the reference above in your bank transfer remark so we can match and credit the funds to your account.'
                      : 'Send your USDT from your external wallet to the dedicated deposit address shown in your email / notification. Transfers will be credited after sufficient network confirmations.'}
                  </div>

                  <div className="flex flex-wrap justify-between gap-3 text-[11px]">
                    <button
                      type="button"
                      onClick={() => {
                        const el = document.getElementById('asset-history');
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                        closeDrawer();
                      }}
                      className="px-4 py-2 rounded-xl border border-huobi-border text-xs font-bold uppercase tracking-widest text-huobi-text hover:bg-huobi-card"
                    >
                      View in history
                    </button>
                    <button
                      type="button"
                      onClick={closeDrawer}
                      className="px-6 py-2 rounded-xl bg-huobi-blue text-white text-xs font-bold uppercase tracking-widest hover:bg-huobi-blue/90"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          {openAction === 'withdraw' && (
            <div className="flex flex-col gap-4">
              {withdrawStep === 'form' && (
                <>
                  <p className="text-[11px] text-huobi-muted">
                    Submit a withdrawal request. Only available balance can be withdrawn; fiat withdrawals go to your registered bank, while USDT /
                    token withdrawals go to the wallet address you provide.
                  </p>
                  <div>
                    <label className="block text-[10px] font-bold text-huobi-muted uppercase tracking-wider mb-1">Asset type</label>
                    <div className="inline-flex rounded-xl bg-huobi-card p-1">
                      {(['Fiat', 'USDT', 'Token'] as const).map(kind => (
                        <button
                          key={kind}
                          type="button"
                          onClick={() => setWithdrawAssetKind(kind)}
                          className={cn(
                            'px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-widest',
                            withdrawAssetKind === kind ? 'bg-huobi-text text-white' : 'text-huobi-muted'
                          )}
                        >
                          {kind === 'Fiat' ? 'Fiat' : 'USDT'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-huobi-muted uppercase tracking-wider mb-1">Currency</label>
                    {withdrawAssetKind === 'Fiat' ? (
                      <select
                        className="w-full px-4 py-3 rounded-xl border border-huobi-border bg-white text-sm font-bold focus:outline-none focus:border-huobi-blue"
                        value={withdrawCurrency}
                        onChange={(e) => setWithdrawCurrency(e.target.value as 'HKD' | 'USD' | 'CNY')}
                      >
                        <option value="HKD">HKD</option>
                        <option value="USD">USD</option>
                        <option value="CNY">CNY</option>
                      </select>
                    ) : (
                      <input
                        disabled
                        value="USDT"
                        className="w-full px-4 py-3 rounded-xl border border-huobi-border bg-gray-50 text-sm font-bold text-huobi-text"
                      />
                    )}
                  </div>
                  {withdrawAssetKind === 'Fiat' ? null : (
                    <div>
                      <label className="block text-[10px] font-bold text-huobi-muted uppercase tracking-wider mb-1">Withdrawal address</label>
                      <input
                        type="text"
                        placeholder="Paste the receiving wallet address"
                        className="w-full px-4 py-3 rounded-xl border border-huobi-border text-[11px] font-mono focus:outline-none focus:border-huobi-blue"
                      />
                      <p className="mt-1 text-[10px] text-huobi-muted">
                        Ensure the address matches the selected asset network (e.g. TRC20 for USDT). Incorrect addresses may result in irreversible
                        loss of funds.
                      </p>
                    </div>
                  )}
                  <div>
                    <label className="block text-[10px] font-bold text-huobi-muted uppercase tracking-wider mb-1">Amount</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={withdrawAmount}
                      onChange={(e) => {
                        setWithdrawAmount(e.target.value);
                        if (withdrawError) setWithdrawError(null);
                      }}
                      className="w-full px-4 py-3 rounded-xl border border-huobi-border font-mono focus:outline-none focus:border-huobi-blue"
                    />
                    {withdrawError && <p className="mt-1 text-[10px] text-huobi-down">{withdrawError}</p>}
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800">
                    {withdrawAssetKind === 'Fiat'
                      ? 'Withdrawals are subject to broker review. Ensure your registered bank details are up to date in account settings.'
                      : 'Digital asset withdrawals are subject to network congestion and on-chain fees. Double‑check the destination address and network before submitting.'}
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleSubmitWithdraw}
                      className="px-6 py-2 rounded-xl bg-huobi-blue text-white text-xs font-bold uppercase tracking-widest hover:bg-huobi-blue/90 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!withdrawAmount}
                    >
                      Submit withdrawal request
                    </button>
                  </div>
                </>
              )}
              {withdrawStep === 'submitted' && (
                <div className="flex flex-col gap-5">
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div className="text-[11px] text-huobi-text">
                      <div className="font-black uppercase tracking-widest text-amber-700 mb-1">Withdrawal request submitted</div>
                      <p className="text-huobi-muted">
                        Your withdrawal instruction has been sent to the broker and is currently <span className="font-mono font-bold">UNDER REVIEW</span>.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-[11px]">
                    <div>
                      <div className="text-huobi-muted uppercase font-bold">Reference</div>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="font-mono text-huobi-text">{withdrawRef}</span>
                        {withdrawRef && (
                          <button
                            type="button"
                            onClick={() => {
                              if (withdrawRef) {
                                navigator.clipboard?.writeText(withdrawRef).catch(() => {});
                              }
                            }}
                            className="px-2 py-1 rounded-md border border-huobi-border text-[10px] font-bold uppercase tracking-widest text-huobi-muted hover:bg-huobi-card"
                          >
                            Copy
                          </button>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-huobi-muted uppercase font-bold">Status</div>
                      <div className="mt-1 font-bold text-amber-700">Under review</div>
                    </div>
                    <div>
                      <div className="text-huobi-muted uppercase font-bold">Asset</div>
                      <div className="mt-1 font-bold text-huobi-text">
                        {withdrawAssetKind === 'Fiat' ? withdrawCurrency : 'USDT'}
                      </div>
                    </div>
                    <div>
                      <div className="text-huobi-muted uppercase font-bold">Amount</div>
                      <div className="mt-1 font-mono text-huobi-text">
                        {Number(withdrawAmount || 0).toLocaleString()} {withdrawAssetKind === 'Fiat' ? withdrawCurrency : 'USDT'}
                      </div>
                    </div>
                    <div>
                      <div className="text-huobi-muted uppercase font-bold">Submitted at</div>
                      <div className="mt-1 text-huobi-text">{withdrawSubmittedAt}</div>
                    </div>
                    <div>
                      <div className="text-huobi-muted uppercase font-bold">Expected credit</div>
                      <div className="mt-1 text-huobi-text">T+1 after approval</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-huobi-card border border-huobi-border text-[11px] text-huobi-muted">
                    Once approved, funds will be released to your registered bank account. You can monitor this request under{' '}
                    <span className="font-bold">Assets &gt; Pending Applications</span> and related cash movements under{' '}
                    <span className="font-bold">Fund History</span>.
                  </div>

                  <div className="flex flex-wrap justify-between gap-3 text-[11px]">
                    <button
                      type="button"
                      onClick={() => {
                        const el = document.getElementById('asset-history');
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                        closeDrawer();
                      }}
                      className="px-4 py-2 rounded-xl border border-huobi-border text-xs font-bold uppercase tracking-widest text-huobi-text hover:bg-huobi-card"
                    >
                      View in history
                    </button>
                    <button
                      type="button"
                      onClick={closeDrawer}
                      className="px-6 py-2 rounded-xl bg-huobi-blue text-white text-xs font-bold uppercase tracking-widest hover:bg-huobi-blue/90"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          {openAction === 'transfer' && (
            <div className="flex flex-col gap-4">
              <p className="text-[11px] text-huobi-muted">
                Exchange between USDT and HKD inside your account. Balances update after the exchange is processed.
              </p>
              <div>
                <label className="block text-[10px] font-bold text-huobi-muted uppercase tracking-wider mb-1">From</label>
                <select
                  className="w-full px-4 py-3 rounded-xl border border-huobi-border bg-white text-sm font-bold focus:outline-none focus:border-huobi-blue"
                  value={transferFrom}
                  onChange={(e) => setTransferFrom(e.target.value as 'USDT' | 'HKD')}
                >
                  <option value="USDT">USDT</option>
                  <option value="HKD">HKD</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-huobi-muted uppercase tracking-wider mb-1">To</label>
                <select
                  className="w-full px-4 py-3 rounded-xl border border-huobi-border bg-white text-sm font-bold focus:outline-none focus:border-huobi-blue"
                  value={transferTo}
                  onChange={(e) => setTransferTo(e.target.value as 'USDT' | 'HKD')}
                >
                  <option value="USDT">USDT</option>
                  <option value="HKD">HKD</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-huobi-muted uppercase tracking-wider mb-1">Amount</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={transferAmount}
                  onChange={(e) => {
                    setTransferAmount(e.target.value);
                    if (transferError) setTransferError(null);
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-huobi-border font-mono focus:outline-none focus:border-huobi-blue"
                />
                {transferError && <p className="mt-1 text-[10px] text-huobi-down">{transferError}</p>}
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSubmitTransfer}
                  className="px-6 py-2 rounded-xl bg-huobi-blue text-white text-xs font-bold uppercase tracking-widest hover:bg-huobi-blue/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!transferAmount}
                >
                  Confirm exchange
                </button>
              </div>
            </div>
          )}
          {openAction === 'export' && (
            <div className="flex flex-col gap-4">
              <p className="text-[11px] text-huobi-muted">Choose date range and format to download your statement.</p>
              <div>
                <label className="block text-[10px] font-bold text-huobi-muted uppercase tracking-wider mb-1">From date</label>
                <input type="date" className="w-full px-4 py-3 rounded-xl border border-huobi-border focus:outline-none focus:border-huobi-blue" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-huobi-muted uppercase tracking-wider mb-1">To date</label>
                <input type="date" className="w-full px-4 py-3 rounded-xl border border-huobi-border focus:outline-none focus:border-huobi-blue" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-huobi-muted uppercase tracking-wider mb-1">Format</label>
                <select className="w-full px-4 py-3 rounded-xl border border-huobi-border bg-white text-sm font-bold focus:outline-none focus:border-huobi-blue">
                  <option>CSV</option>
                  <option>PDF</option>
                </select>
              </div>
            </div>
          )}
        </DetailDrawer>
      )}
    </div>
  );
}
