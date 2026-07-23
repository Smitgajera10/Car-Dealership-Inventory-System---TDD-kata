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
          <div key={i} className="portal-card p-4 space-y-2">
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
      title: 'Inventory Value',
      value: formattedValuation,
      subtext: `${totalStockUnits} total units`,
      valueClass: 'text-[#6D5DFB]',
      accent: 'border-l-[#6D5DFB]',
      iconBg: 'bg-[#6D5DFB]/10',
      iconColor: 'text-[#6D5DFB]',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    },
    {
      title: 'Total Models',
      value: totalVehiclesCount,
      subtext: 'Catalog listings',
      valueClass: 'text-slate-800',
      accent: 'border-l-slate-300',
      iconBg: 'bg-slate-100',
      iconColor: 'text-slate-400',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />,
    },
    {
      title: 'Available',
      value: availableCount,
      subtext: 'Ready to purchase',
      valueClass: 'text-emerald-600',
      accent: 'border-l-emerald-400',
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-500',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
    },
    {
      title: 'Low Stock',
      value: lowStockCount,
      subtext: '≤ 2 units left',
      valueClass: 'text-amber-600',
      accent: 'border-l-amber-400',
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-500',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />,
    },
    {
      title: 'Out of Stock',
      value: outOfStockCount,
      subtext: 'Requires restock',
      valueClass: 'text-red-500',
      accent: 'border-l-red-400',
      iconBg: 'bg-red-50',
      iconColor: 'text-red-400',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {metrics.map((m, idx) => (
        <div key={idx} className={`portal-card p-4 border-l-4 ${m.accent} hover:-translate-y-0.5 transition-transform`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{m.title}</span>
            <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${m.iconBg}`}>
              <svg className={`h-4 w-4 ${m.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {m.icon}
              </svg>
            </div>
          </div>
          <p className={`text-xl font-extrabold tracking-tight ${m.valueClass}`}>{m.value}</p>
          <p className="mt-1 text-[11px] text-slate-400">{m.subtext}</p>
        </div>
      ))}
    </div>
  );
}
