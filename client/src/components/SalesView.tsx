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
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#024738] border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm text-red-600 font-bold">Failed to load sales data. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Editorial Header */}
      <div className="flex items-center justify-between border-b border-[#D1EFE0] pb-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#024738] bg-[#E8FCC9] border border-[#B2F348] px-3 py-1 rounded-full">
            Admin Governance
          </span>
          <h2 className="text-3xl font-serif font-bold text-[#024738] mt-2">Dealership Sales Audit Ledger</h2>
          <p className="text-xs text-[#47695F] font-medium">Verified vehicle acquisitions, transaction logs, and buyer audit trail</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-white border border-[#D1EFE0] px-4 py-1.5 text-xs font-bold text-[#024738] shadow-sm">
            {purchases.length} Transaction{purchases.length !== 1 ? 's' : ''}
          </span>
          <span className="rounded-full bg-[#024738] px-4 py-1.5 text-xs font-extrabold text-[#C0F762] shadow-sm">
            Total Revenue: ${totalRevenue.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Audit Table */}
      {purchases.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#E8F7ED] border border-[#D1EFE0]">
            <svg className="h-8 w-8 text-[#024738]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-2xl font-serif font-bold text-[#024738] mb-1">No Sales Executed Yet</h3>
          <p className="text-sm text-[#47695F] font-medium">Completed customer purchase transactions will be logged in real time here.</p>
        </div>
      ) : (
        <div className="portal-card overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7FDF9] text-[#024738] uppercase tracking-wider font-extrabold border-b border-[#D1EFE0]">
                <tr>
                  <th className="p-4">Transaction ID</th>
                  <th className="p-4">Vehicle Purchased</th>
                  <th className="p-4">Buyer Account</th>
                  <th className="p-4">Amount ($)</th>
                  <th className="p-4">Date & Time</th>
                  <th className="p-4">Audit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8F7ED] text-[#0A2B23] font-medium">
                {purchases.map((purchase) => (
                  <tr key={purchase.id} className="hover:bg-[#F2FAF4] transition-colors">
                    <td className="p-4 font-mono font-bold text-[#024738]">
                      #{purchase.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="p-4 font-extrabold text-[#024738]">
                      {purchase.vehicle.make} {purchase.vehicle.model}
                    </td>
                    <td className="p-4 text-[#47695F] font-semibold">
                      {purchase.user?.email ?? 'Unknown'}
                    </td>
                    <td className="p-4 font-extrabold text-[#059669]">
                      ${purchase.purchasePrice.toLocaleString()}
                    </td>
                    <td className="p-4 text-[#5E7E75]">
                      {new Date(purchase.createdAt).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="p-4">
                      <span className="rounded-full bg-[#E8FCC9] border border-[#B2F348] text-[#024738] px-3 py-0.5 text-[10px] font-extrabold uppercase">
                        ✓ Verified
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
