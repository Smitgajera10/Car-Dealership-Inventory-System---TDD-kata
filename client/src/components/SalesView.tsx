export function SalesView() {
  const transactions = [
    { id: 'INV-9042', vehicle: '2024 Porsche 911 GT3', buyer: 'buyer@dealership.com', price: '$225,000', date: 'Today, 14:32', status: 'Completed' },
    { id: 'INV-9041', vehicle: '2024 Tesla Model S Plaid', buyer: 'alex.v@client.org', price: '$89,990', date: 'Today, 11:15', status: 'Completed' },
    { id: 'INV-9040', vehicle: '2024 BMW M4 Competition', buyer: 'david.k@luxury.io', price: '$79,100', date: 'Yesterday, 16:45', status: 'Completed' },
    { id: 'INV-9039', vehicle: '2024 Mercedes-AMG GT R', buyer: 'sarah.m@venture.com', price: '$175,000', date: 'Jul 21, 2026', status: 'Completed' },
    { id: 'INV-9038', vehicle: '2023 Audi R8 V10 Performance', buyer: 'michael.t@tech.co', price: '$158,600', date: 'Jul 20, 2026', status: 'Completed' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Dealership Sales Ledger</h2>
          <p className="text-xs text-gray-400">Verified vehicle purchases, invoicing, and buyer history</p>
        </div>
        <span className="rounded-xl bg-[#16C784]/10 border border-[#16C784]/30 px-3 py-1 text-xs font-semibold text-[#16C784]">
          Real-time Audit Log
        </span>
      </div>

      <div className="portal-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B1020] text-gray-400 uppercase tracking-wider font-bold border-b border-white/10">
              <tr>
                <th className="p-4">Invoice ID</th>
                <th className="p-4">Vehicle Purchased</th>
                <th className="p-4">Buyer Email</th>
                <th className="p-4">Amount ($)</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-200">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-mono font-semibold text-[#6D5DFB]">{tx.id}</td>
                  <td className="p-4 font-bold text-white">{tx.vehicle}</td>
                  <td className="p-4 text-gray-400">{tx.buyer}</td>
                  <td className="p-4 font-bold text-[#16C784]">{tx.price}</td>
                  <td className="p-4 text-gray-400">{tx.date}</td>
                  <td className="p-4">
                    <span className="rounded-full bg-[#16C784]/20 border border-[#16C784]/30 text-[#16C784] px-2.5 py-0.5 text-[10px] font-bold uppercase">
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
