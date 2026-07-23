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

  // ── Revenue Metrics ──
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

  // ── Top Selling Models ──
  const modelSales = purchases.reduce((acc, p) => {
    const key = `${p.vehicle.make} ${p.vehicle.model}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topModels = Object.entries(modelSales).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Editorial Header */}
      <div className="flex items-center justify-between border-b border-[#D1EFE0] pb-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#059669] bg-[#E8FCC9] border border-[#B2F348] px-3 py-1 rounded-full">
            Executive Insights
          </span>
          <h2 className="text-3xl font-serif font-bold text-[#024738] mt-2">Inventory Velocity & Analytics</h2>
          <p className="text-xs text-[#47695F] font-medium">Financial distribution, stock velocity, and brand market share</p>
        </div>
        <span className="rounded-full bg-[#024738] px-4 py-1.5 text-xs font-extrabold text-[#C0F762] shadow-sm">
          Live Telemetry
        </span>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="portal-card p-5 bg-white">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#47695F]">Total Portfolio Value</span>
          <p className="mt-2 text-3xl font-extrabold text-[#024738] font-sans">{formattedValuation}</p>
          <p className="mt-1 text-xs text-[#5E7E75] font-medium">Appraised MSRP across active stock</p>
        </div>
        <div className="portal-card p-5 bg-[#E8FCC9] border-[#B2F348]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#024738]">Total Revenue Realized</span>
          <p className="mt-2 text-3xl font-extrabold text-[#024738] font-sans">{formattedRevenue}</p>
          <p className="mt-1 text-xs text-[#024738] font-medium">From {purchases.length} completed sale{purchases.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="portal-card p-5 bg-white">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#47695F]">Avg. Order Value</span>
          <p className="mt-2 text-3xl font-extrabold text-[#024738] font-sans">{formattedAOV}</p>
          <p className="mt-1 text-xs text-[#5E7E75] font-medium">Average transaction amount</p>
        </div>
        <div className="portal-card p-5 bg-white">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#47695F]">Inventory Health</span>
          <p className="mt-2 text-3xl font-extrabold text-[#D97706] font-sans">{totalStockUnits} Units</p>
          <p className="mt-1 text-xs text-[#5E7E75] font-medium">{outOfStockCount} model{outOfStockCount !== 1 ? 's' : ''} require restock</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Brand Distribution */}
        <div className="portal-card p-6 bg-white">
          <h3 className="text-xl font-serif font-bold text-[#024738] mb-4">Stock Breakdown by Manufacturer</h3>
          {sortedMakes.length === 0 ? (
            <p className="text-sm text-[#47695F]">No inventory data available.</p>
          ) : (
            <div className="space-y-4">
              {sortedMakes.map(([make, count]) => {
                const percentage = totalStockUnits > 0 ? Math.round((count / totalStockUnits) * 100) : 0;
                return (
                  <div key={make} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-[#024738]">{make}</span>
                      <span className="text-[#47695F]">{count} units ({percentage}%)</span>
                    </div>
                    <div className="h-3 w-full bg-[#E8F7ED] rounded-full overflow-hidden border border-[#D1EFE0]">
                      <div
                        className="h-full bg-gradient-to-r from-[#024738] to-[#059669] rounded-full transition-all duration-500"
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
        <div className="portal-card p-6 bg-white">
          <h3 className="text-xl font-serif font-bold text-[#024738] mb-4">Top Performing Models</h3>
          {topModels.length === 0 ? (
            <p className="text-sm text-[#47695F]">No sales data recorded yet. Customer orders will render here.</p>
          ) : (
            <div className="space-y-3">
              {topModels.map(([model, count], index) => (
                <div key={model} className="flex items-center gap-3 rounded-2xl bg-[#F7FDF9] border border-[#D1EFE0] p-3.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#024738] text-xs font-extrabold text-[#C0F762]">
                    #{index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-extrabold text-[#024738] truncate">{model}</p>
                    <p className="text-xs text-[#47695F] font-medium">{count} unit{count !== 1 ? 's' : ''} sold</p>
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
