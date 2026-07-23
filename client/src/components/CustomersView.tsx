export function CustomersView() {
  const clients = [
    { name: 'Alexander Vance', email: 'buyer@dealership.com', purchases: 2, totalSpent: '$314,990', tier: 'VIP Collector' },
    { name: 'Sarah Miller', email: 'sarah.m@venture.com', purchases: 1, totalSpent: '$175,000', tier: 'Premium Client' },
    { name: 'David Kim', email: 'david.k@luxury.io', purchases: 3, totalSpent: '$420,000', tier: 'VIP Collector' },
    { name: 'Michael Taylor', email: 'michael.t@tech.co', purchases: 1, totalSpent: '$158,600', tier: 'Client' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Dealership Client Directory</h2>
          <p className="text-xs text-gray-400">Registered buyers, purchasing tiers, and lifetime value</p>
        </div>
        <span className="rounded-xl bg-[#6D5DFB]/10 border border-[#6D5DFB]/30 px-3 py-1 text-xs font-semibold text-[#8B7EFF]">
          4 Active Accounts
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {clients.map((c, i) => (
          <div key={i} className="portal-card p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6D5DFB]/20 text-[#6D5DFB] font-bold text-sm">
                {c.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">{c.name}</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#F5A524]">{c.tier}</span>
              </div>
            </div>
            <div className="pt-2 border-t border-white/5 space-y-1 text-xs">
              <p className="text-gray-400 font-mono text-[11px]">{c.email}</p>
              <div className="flex justify-between text-gray-300 pt-1">
                <span>Vehicles Bought:</span>
                <span className="font-bold text-white">{c.purchases}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Lifetime Value:</span>
                <span className="font-bold text-[#16C784]">{c.totalSpent}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
