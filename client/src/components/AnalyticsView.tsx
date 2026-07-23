import { useQuery } from '@tanstack/react-query';
import type { Vehicle, Purchase } from '../types';
import { purchaseApi } from '../services/api.service';

interface AnalyticsViewProps {
  vehicles: Vehicle[];
}

export function AnalyticsView({ vehicles }: AnalyticsViewProps) {
  // Fetch real purchase data for revenue calculations
  const { data: purchasesRes } = useQuery({
    queryKey: ['all-purchases'],
    queryFn: () => purchaseApi.getAllPurchases().then((res) => res.data),
  });

  const purchases: Purchase[] = purchasesRes?.data ?? [];

  // ── Inventory Metrics ──
  const totalValuation = vehicles.reduce((sum, v) => sum + v.price * v.quantity, 0);
  const formattedValuation = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(totalValuation);

  const totalStockUnits = vehicles.reduce((sum, v) => sum + v.quantity, 0);
  const outOfStockCount = vehicles.filter((v) => v.quantity <= 0).length;

  // ── Revenue Metrics (from real purchases) ──
  const totalRevenue = purchases.reduce((sum, p) => sum + p.purchasePrice, 0);
  const formattedRevenue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(totalRevenue);

  const avgOrderValue = purchases.length > 0 ? totalRevenue / purchases.length : 0;
  const formattedAOV = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(avgOrderValue);

  // ── Brand Distribution ──
  const makeCounts = vehicles.reduce((acc, v) => {
    acc[v.make] = (acc[v.make] || 0) + v.quantity;
    return acc;
  }, {} as Record<string, number>);

  const sortedMakes = Object.entries(makeCounts).sort((a, b) => b[1] - a[1]);

  // ── Top Selling Models (from purchases) ──
  const modelSales = purchases.reduce((acc, p) => {
    const key = `${p.vehicle.make} ${p.vehicle.model}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topModels = Object.entries(modelSales).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Dealership Inventory Analytics</h2>
          <p className="text-xs text-gray-400">Financial distribution, inventory velocity, and brand breakdown</p>
        </div>
        <span className="rounded-xl bg-[#6D5DFB]/10 border border-[#6D5DFB]/30 px-3 py-1 text-xs font-semibold text-[#8B7EFF]">
          Live Dashboard
        </span>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="portal-card p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Portfolio Value</span>
          <p className="mt-2 text-3xl font-extrabold text-[#6D5DFB]">{formattedValuation}</p>
          <p className="mt-1 text-xs text-gray-400">Appraised MSRP across active stock</p>
        </div>
        <div className="portal-card p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Revenue</span>
          <p className="mt-2 text-3xl font-extrabold text-[#16C784]">{formattedRevenue}</p>
          <p className="mt-1 text-xs text-gray-400">From {purchases.length} completed sale{purchases.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="portal-card p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Avg. Order Value</span>
          <p className="mt-2 text-3xl font-extrabold text-white">{formattedAOV}</p>
          <p className="mt-1 text-xs text-gray-400">Average transaction amount</p>
        </div>
        <div className="portal-card p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Inventory Health</span>
          <p className="mt-2 text-3xl font-extrabold text-[#F5A524]">{totalStockUnits} Units</p>
          <p className="mt-1 text-xs text-gray-400">{outOfStockCount} model{outOfStockCount !== 1 ? 's' : ''} require restock</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Brand Distribution */}
        <div className="portal-card p-6">
          <h3 className="text-base font-bold text-white mb-4">Stock Breakdown by Manufacturer</h3>
          {sortedMakes.length === 0 ? (
            <p className="text-sm text-gray-400">No inventory data available.</p>
          ) : (
            <div className="space-y-3">
              {sortedMakes.map(([make, count]) => {
                const percentage = totalStockUnits > 0 ? Math.round((count / totalStockUnits) * 100) : 0;
                return (
                  <div key={make} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-gray-200">{make}</span>
                      <span className="text-gray-400">{count} units ({percentage}%)</span>
                    </div>
                    <div className="h-2 w-full bg-[#0B1020] rounded-full overflow-hidden border border-white/5">
                      <div
                        className="h-full bg-gradient-to-r from-[#6D5DFB] to-[#8B7EFF] rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(4, percentage)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top Selling Models */}
        <div className="portal-card p-6">
          <h3 className="text-base font-bold text-white mb-4">Top Selling Models</h3>
          {topModels.length === 0 ? (
            <p className="text-sm text-gray-400">No sales data yet. Purchases will appear here.</p>
          ) : (
            <div className="space-y-3">
              {topModels.map(([model, count], index) => (
                <div key={model} className="flex items-center gap-3 rounded-xl bg-[#0B1020] border border-white/5 p-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#6D5DFB]/20 text-xs font-extrabold text-[#6D5DFB]">
                    #{index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{model}</p>
                    <p className="text-[10px] text-gray-400">{count} unit{count !== 1 ? 's' : ''} sold</p>
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
