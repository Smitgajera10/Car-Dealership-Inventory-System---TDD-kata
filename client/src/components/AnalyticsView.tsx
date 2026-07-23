import { useQuery } from '@tanstack/react-query';
import type { Vehicle, Purchase } from '../types';
import { purchaseApi } from '../services/api.service';

interface AnalyticsViewProps {
  vehicles: Vehicle[];
}

export function AnalyticsView({ vehicles }: AnalyticsViewProps) {
  const { data: purchasesRes } = useQuery({
    queryKey: ['all-purchases'],
    queryFn: () => purchaseApi.getAllPurchases().then((res) => res.data),
  });

  const purchases: Purchase[] = purchasesRes?.data ?? [];

  const totalValuation = vehicles.reduce((sum, v) => sum + v.price * v.quantity, 0);
  const totalStockUnits = vehicles.reduce((sum, v) => sum + v.quantity, 0);
  const outOfStockCount = vehicles.filter((v) => v.quantity <= 0).length;

  const totalRevenue = purchases.reduce((sum, p) => sum + p.purchasePrice, 0);
  const avgOrderValue = purchases.length > 0 ? totalRevenue / purchases.length : 0;

  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  const makeCounts = vehicles.reduce((acc, v) => {
    acc[v.make] = (acc[v.make] || 0) + v.quantity;
    return acc;
  }, {} as Record<string, number>);
  const sortedMakes = Object.entries(makeCounts).sort((a, b) => b[1] - a[1]);

  const modelSales = purchases.reduce((acc, p) => {
    const key = `${p.vehicle.make} ${p.vehicle.model}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topModels = Object.entries(modelSales).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const kpis = [
    { label: 'Portfolio Value', value: fmt(totalValuation), sub: 'Active stock MSRP', color: 'text-[#6D5DFB]', bg: 'bg-[#6D5DFB]/8', border: 'border-[#6D5DFB]/20' },
    { label: 'Total Revenue', value: fmt(totalRevenue), sub: `${purchases.length} completed sale${purchases.length !== 1 ? 's' : ''}`, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    { label: 'Avg. Order Value', value: fmt(avgOrderValue), sub: 'Per transaction', color: 'text-slate-800', bg: 'bg-slate-50', border: 'border-slate-200' },
    { label: 'Inventory Health', value: `${totalStockUnits} units`, sub: `${outOfStockCount} model${outOfStockCount !== 1 ? 's' : ''} need restock`, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Inventory Analytics</h2>
          <p className="text-xs text-slate-400 mt-0.5">Financial overview and brand breakdown — from real data</p>
        </div>
        <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-600">
          Live
        </span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className={`portal-card p-5 border ${k.border}`}>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{k.label}</span>
            <p className={`mt-2 text-2xl font-extrabold ${k.color}`}>{k.value}</p>
            <p className="mt-1 text-xs text-slate-400">{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Brand distribution */}
        <div className="portal-card p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Stock by Manufacturer</h3>
          {sortedMakes.length === 0 ? (
            <p className="text-sm text-slate-400">No inventory data yet.</p>
          ) : (
            <div className="space-y-3">
              {sortedMakes.map(([make, count]) => {
                const pct = totalStockUnits > 0 ? Math.round((count / totalStockUnits) * 100) : 0;
                return (
                  <div key={make} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-slate-700">{make}</span>
                      <span className="text-slate-400">{count} units ({pct}%)</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#6D5DFB] to-[#8B5CF6] rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(4, pct)}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top selling models */}
        <div className="portal-card p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Top Selling Models</h3>
          {topModels.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <svg className="h-10 w-10 text-slate-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-sm text-slate-400">No sales yet. Purchases will appear here.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {topModels.map(([model, count], index) => (
                <div key={model} className="flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-100 p-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#6D5DFB]/10 text-xs font-extrabold text-[#6D5DFB] shrink-0">
                    #{index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{model}</p>
                    <p className="text-[10px] text-slate-400">{count} unit{count !== 1 ? 's' : ''} sold</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
