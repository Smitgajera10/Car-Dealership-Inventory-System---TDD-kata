import type { Vehicle } from '../types';

interface DashboardMetricsProps {
  vehicles: Vehicle[];
  isLoading?: boolean;
}

export function DashboardMetrics({ vehicles, isLoading = false }: DashboardMetricsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="portal-card p-5 space-y-3">
            <div className="skeleton h-3 w-20" />
            <div className="skeleton h-7 w-28" />
            <div className="skeleton h-2 w-16" />
          </div>
        ))}
      </div>
    );
  }

  const totalVehiclesCount = vehicles.length;
  const totalStockUnits = vehicles.reduce((sum, v) => sum + v.quantity, 0);
  const outOfStockCount = vehicles.filter((v) => v.quantity <= 0).length;
  const lowStockCount = vehicles.filter((v) => v.quantity > 0 && v.quantity <= 2).length;
  const availableCount = totalVehiclesCount - outOfStockCount;
  const totalValuation = vehicles.reduce((sum, v) => sum + v.price * v.quantity, 0);

  const formattedValuation = new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0,
  }).format(totalValuation);

  const metrics = [
    {
      title: 'Inventory Valuation',
      value: formattedValuation,
      subtext: `${totalStockUnits} total stock units`,
      valueClass: 'text-[#024738]',
      cardBg: 'bg-white',
      badge: '✓ Live',
    },
    {
      title: 'Total Models',
      value: totalVehiclesCount,
      subtext: 'Catalog listings',
      valueClass: 'text-[#0A2B23]',
      cardBg: 'bg-white',
      badge: 'Catalog',
    },
    {
      title: 'Available Stock',
      value: availableCount,
      subtext: 'Ready to purchase',
      valueClass: 'text-[#059669]',
      cardBg: 'bg-[#F7FDF9]',
      badge: '✓ Ready',
    },
    {
      title: 'Low Stock Alerts',
      value: lowStockCount,
      subtext: '≤ 2 units left',
      valueClass: 'text-[#D97706]',
      cardBg: 'bg-white',
      badge: 'Attention',
    },
    {
      title: 'Out of Stock',
      value: outOfStockCount,
      subtext: 'Requires restock',
      valueClass: 'text-[#DC2626]',
      cardBg: 'bg-white',
      badge: 'Action Needed',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {metrics.map((m, idx) => (
        <div
          key={idx}
          className={`portal-card-hover p-5 ${m.cardBg} flex flex-col justify-between relative overflow-hidden group`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#47695F]">{m.title}</span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#E8FCC9] text-[#024738] border border-[#B2F348]">
              {m.badge}
            </span>
          </div>

          <div>
            <p className={`text-2xl font-extrabold tracking-tight ${m.valueClass} font-sans`}>{m.value}</p>
            <p className="mt-1 text-[11px] text-[#5E7E75] font-medium">{m.subtext}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
