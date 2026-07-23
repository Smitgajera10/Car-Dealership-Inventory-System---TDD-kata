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
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm text-red-500">Failed to load sales data. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Sales Ledger</h2>
          <p className="text-xs text-slate-400 mt-0.5">All completed vehicle purchases</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[#6D5DFB]/10 border border-[#6D5DFB]/20 px-3 py-1 text-xs font-semibold text-[#6D5DFB]">
            {purchases.length} transaction{purchases.length !== 1 ? 's' : ''}
          </span>
          <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-600">
            ${totalRevenue.toLocaleString()} revenue
          </span>
        </div>
      </div>

      {purchases.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 border border-slate-200">
            <svg className="h-8 w-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-slate-700 mb-1">No Sales Yet</h3>
          <p className="text-sm text-slate-400">Purchase transactions will appear here once customers buy vehicles.</p>
        </div>
      ) : (
        <div className="portal-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {['Purchase ID', 'Vehicle', 'Buyer', 'Amount', 'Date', 'Status'].map((h) => (
                    <th key={h} className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {purchases.map((purchase) => (
                  <tr key={purchase.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-mono font-semibold text-[#6D5DFB]">
                      {purchase.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      {purchase.vehicle.make} {purchase.vehicle.model}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {purchase.user?.email ?? 'Unknown'}
                    </td>
                    <td className="px-4 py-3 font-bold text-emerald-600">
                      ${purchase.purchasePrice.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {new Date(purchase.createdAt).toLocaleString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 px-2.5 py-0.5 text-[10px] font-bold uppercase">
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
