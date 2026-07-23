import { useQuery } from '@tanstack/react-query';
import { purchaseApi } from '../services/api.service';

export function MyPurchasesView() {
  const { data: purchasesRes, isLoading, error } = useQuery({
    queryKey: ['my-purchases'],
    queryFn: () => purchaseApi.getMyPurchases().then((res) => res.data),
  });

  const purchases = purchasesRes?.data ?? [];

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
        <p className="text-sm text-red-400">Failed to load your purchases. Please try again.</p>
      </div>
    );
  }

  if (purchases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#131B2F] border border-white/10">
          <svg className="h-8 w-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-white mb-1">No Purchases Yet</h3>
        <p className="text-sm text-gray-400 max-w-sm">
          You haven't purchased any vehicles yet. Browse our inventory and find your dream car.
        </p>
      </div>
    );
  }

  const totalSpent = purchases.reduce((sum, p) => sum + p.purchasePrice, 0);

  return (
    <div className="space-y-6">
      {/* Summary Header */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-[#131B2F] border border-white/10 p-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Total Purchases</p>
          <p className="text-2xl font-extrabold text-white">{purchases.length}</p>
        </div>
        <div className="rounded-2xl bg-[#131B2F] border border-white/10 p-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Total Spent</p>
          <p className="text-2xl font-extrabold text-[#6D5DFB]">
            ${totalSpent.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </p>
        </div>
        <div className="rounded-2xl bg-[#131B2F] border border-white/10 p-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Last Purchase</p>
          <p className="text-2xl font-extrabold text-white">
            {new Date(purchases[0].createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Purchase List */}
      <div className="rounded-2xl bg-[#131B2F] border border-white/10 overflow-hidden">
        <div className="border-b border-white/10 px-6 py-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">Purchase History</h3>
        </div>
        <div className="divide-y divide-white/5">
          {purchases.map((purchase) => (
            <div key={purchase.id} className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors">
              {/* Vehicle Image */}
              <div className="h-14 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-[#0B1020] border border-white/10">
                {purchase.vehicle.imageUrl ? (
                  <img
                    src={purchase.vehicle.imageUrl}
                    alt={`${purchase.vehicle.make} ${purchase.vehicle.model}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Vehicle Details */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">
                  {purchase.vehicle.make} {purchase.vehicle.model}
                </p>
                <p className="text-xs text-gray-400">{purchase.vehicle.category}</p>
              </div>

              {/* Purchase Price */}
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-extrabold text-[#16C784]">
                  ${purchase.purchasePrice.toLocaleString()}
                </p>
                <p className="text-[10px] text-gray-500">
                  {new Date(purchase.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
