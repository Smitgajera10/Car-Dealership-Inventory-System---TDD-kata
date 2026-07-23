import type { Vehicle } from '../types';

interface DashboardMetricsProps {
  vehicles: Vehicle[];
  isLoading?: boolean;
}

export function DashboardMetrics({ vehicles, isLoading = false }: DashboardMetricsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="portal-card p-4 space-y-2">
            <div className="skeleton h-3 w-20" />
            <div className="skeleton h-7 w-28" />
            <div className="skeleton h-2 w-16" />
          </div>
        ))}
      </div>
    );
  }

  // Calculate statistics
  const totalVehiclesCount = vehicles.length;
  const totalStockUnits = vehicles.reduce((sum, v) => sum + v.quantity, 0);
  const outOfStockCount = vehicles.filter((v) => v.quantity <= 0).length;
  const lowStockCount = vehicles.filter((v) => v.quantity > 0 && v.quantity <= 2).length;
  const availableCount = totalVehiclesCount - outOfStockCount;

  // Inventory Portfolio Total valuation calculation
  const totalValuation = vehicles.reduce((sum, v) => sum + v.price * v.quantity, 0);

  const formattedValuation = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(totalValuation);

  const metrics = [
    {
      title: 'Inventory Value',
      value: formattedValuation,
      subtext: `${totalStockUnits} Total Units`,
      accentColor: 'text-[#6D5DFB]',
      borderAccent: 'border-l-4 border-l-[#6D5DFB]',
      icon: (
        <svg className="h-5 w-5 text-[#6D5DFB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Total Models',
      value: totalVehiclesCount,
      subtext: 'Catalog Listings',
      accentColor: 'text-white',
      borderAccent: 'border-l-4 border-l-gray-400',
      icon: (
        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      title: 'Available',
      value: availableCount,
      subtext: 'Ready for Purchase',
      accentColor: 'text-[#16C784]',
      borderAccent: 'border-l-4 border-l-[#16C784]',
      icon: (
        <svg className="h-5 w-5 text-[#16C784]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Low Stock',
      value: lowStockCount,
      subtext: '≤ 2 Units Remaining',
      accentColor: 'text-[#F5A524]',
      borderAccent: 'border-l-4 border-l-[#F5A524]',
      icon: (
        <svg className="h-5 w-5 text-[#F5A524]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    {
      title: 'Out of Stock',
      value: outOfStockCount,
      subtext: 'Requires Restock',
      accentColor: 'text-[#F04438]',
      borderAccent: 'border-l-4 border-l-[#F04438]',
      icon: (
        <svg className="h-5 w-5 text-[#F04438]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "Today's Purchases",
      value: '4 Sold',
      subtext: '$890k Revenue Est.',
      accentColor: 'text-indigo-400',
      borderAccent: 'border-l-4 border-l-indigo-400',
      icon: (
        <svg className="h-5 w-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {metrics.map((m, idx) => (
        <div
          key={idx}
          className={`portal-card p-4 transition-transform hover:-translate-y-1 ${m.borderAccent}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              {m.title}
            </span>
            {m.icon}
          </div>
          <p className={`mt-2 text-xl font-extrabold tracking-tight ${m.accentColor}`}>
            {m.value}
          </p>
          <p className="mt-1 text-[11px] text-gray-500">{m.subtext}</p>
        </div>
      ))}
    </div>
  );
}
