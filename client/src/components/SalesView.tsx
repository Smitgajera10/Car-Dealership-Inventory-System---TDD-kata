import { useQuery } from '@tanstack/react-query';
import { purchaseApi } from '../services/api.service';

export function SalesView() {
  const { data: purchasesRes, isLoading, error } = useQuery({
    queryKey: ['all-purchases'],
    queryFn: () => purchaseApi.getAllPurchases().then((res) => res.data),
  });

  const purchases = purchasesRes?.data ?? [];
  const totalRevenue = purchases.reduce((sum, p) => sum + p.purchasePrice, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#6D5DFB] border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-center">
        <p className="text-sm text-red-400">Failed to load sales data. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Dealership Sales Ledger</h2>
          <p className="text-xs text-gray-400">Verified vehicle purchases, invoicing, and buyer history</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-xl bg-[#6D5DFB]/10 border border-[#6D5DFB]/30 px-3 py-1 text-xs font-semibold text-[#6D5DFB]">
            {purchases.length} Transaction{purchases.length !== 1 ? 's' : ''}
          </span>
          <span className="rounded-xl bg-[#16C784]/10 border border-[#16C784]/30 px-3 py-1 text-xs font-bold text-[#16C784]">
            Revenue: ${totalRevenue.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Table */}
      {purchases.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#131B2F] border border-white/10">
            <svg className="h-8 w-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-white mb-1">No Sales Yet</h3>
          <p className="text-sm text-gray-400">Purchase transactions will appear here once customers buy vehicles.</p>
        </div>
      ) : (
        <div className="portal-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0B1020] text-gray-400 uppercase tracking-wider font-bold border-b border-white/10">
                <tr>
                  <th className="p-4">Purchase ID</th>
                  <th className="p-4">Vehicle</th>
                  <th className="p-4">Buyer Email</th>
                  <th className="p-4">Amount ($)</th>
                  <th className="p-4">Date & Time</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-200">
                {purchases.map((purchase) => (
                  <tr key={purchase.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-mono font-semibold text-[#6D5DFB]">
                      {purchase.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="p-4 font-bold text-white">
                      {purchase.vehicle.make} {purchase.vehicle.model}
                    </td>
                    <td className="p-4 text-gray-400">
                      {purchase.user?.email ?? 'Unknown'}
                    </td>
                    <td className="p-4 font-bold text-[#16C784]">
                      ${purchase.purchasePrice.toLocaleString()}
                    </td>
                    <td className="p-4 text-gray-400">
                      {new Date(purchase.createdAt).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="p-4">
                      <span className="rounded-full bg-[#16C784]/20 border border-[#16C784]/30 text-[#16C784] px-2.5 py-0.5 text-[10px] font-bold uppercase">
                        Completed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
