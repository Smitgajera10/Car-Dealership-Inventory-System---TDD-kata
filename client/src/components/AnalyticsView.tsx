import type { Vehicle } from '../types';

interface AnalyticsViewProps {
  vehicles: Vehicle[];
}

export function AnalyticsView({ vehicles }: AnalyticsViewProps) {
  const totalValuation = vehicles.reduce((sum, v) => sum + v.price * v.quantity, 0);
  const formattedValuation = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(totalValuation);

  const totalStockUnits = vehicles.reduce((sum, v) => sum + v.quantity, 0);
  const outOfStockCount = vehicles.filter((v) => v.quantity <= 0).length;

  // Make distribution
  const makeCounts = vehicles.reduce((acc, v) => {
    acc[v.make] = (acc[v.make] || 0) + v.quantity;
    return acc;
  }, {} as Record<string, number>);

  const sortedMakes = Object.entries(makeCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Dealership Inventory Analytics</h2>
          <p className="text-xs text-gray-400">Financial distribution, inventory velocity, and brand breakdown</p>
        </div>
        <span className="rounded-xl bg-[#6D5DFB]/10 border border-[#6D5DFB]/30 px-3 py-1 text-xs font-semibold text-[#8B7EFF]">
          Q3 Fiscal Report
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="portal-card p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Portfolio Value</span>
          <p className="mt-2 text-3xl font-extrabold text-[#6D5DFB]">{formattedValuation}</p>
          <p className="mt-1 text-xs text-gray-400">Appraised MSRP across active stock</p>
        </div>
        <div className="portal-card p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Turnover Rate</span>
          <p className="mt-2 text-3xl font-extrabold text-[#16C784]">84.2%</p>
          <p className="mt-1 text-xs text-gray-400">+12% faster sales cycle vs last month</p>
        </div>
        <div className="portal-card p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Inventory Health</span>
          <p className="mt-2 text-3xl font-extrabold text-[#F5A524]">{totalStockUnits} Units</p>
          <p className="mt-1 text-xs text-gray-400">{outOfStockCount} models require immediate restock</p>
        </div>
      </div>

      {/* Brand Distribution Chart */}
      <div className="portal-card p-6">
        <h3 className="text-base font-bold text-white mb-4">Stock Breakdown by Manufacturer</h3>
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
      </div>
    </div>
  );
}
