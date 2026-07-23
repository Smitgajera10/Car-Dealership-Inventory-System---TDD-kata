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
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#024738] border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm text-red-600 font-bold">Failed to load your purchases. Please try again.</p>
      </div>
    );
  }

  if (purchases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#E8F7ED] border border-[#D1EFE0]">
          <svg className="h-8 w-8 text-[#024738]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h3 className="text-2xl font-serif font-bold text-[#024738] mb-1">No Purchases Yet</h3>
        <p className="text-sm text-[#47695F] max-w-sm font-medium">
          You haven't acquired any vehicles yet. Explore our live catalog and find your next vehicle.
        </p>
      </div>
    );
  }

  const totalSpent = purchases.reduce((sum, p) => sum + p.purchasePrice, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Editorial Header */}
      <div className="flex items-center justify-between border-b border-[#D1EFE0] pb-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#059669] bg-[#E8FCC9] border border-[#B2F348] px-3 py-1 rounded-full">
            Customer Dashboard
          </span>
          <h2 className="text-3xl font-serif font-bold text-[#024738] mt-2">My Vehicle Purchases</h2>
          <p className="text-xs text-[#47695F] font-medium">Verified acquisition history and ownership records</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="portal-card p-5 bg-white">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#47695F] mb-1">Total Purchases</p>
          <p className="text-3xl font-extrabold text-[#024738] font-sans">{purchases.length}</p>
        </div>
        <div className="portal-card p-5 bg-[#E8FCC9] border-[#B2F348]">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#024738] mb-1">Total Capital Invested</p>
          <p className="text-3xl font-extrabold text-[#024738] font-sans">
            ${totalSpent.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </p>
        </div>
        <div className="portal-card p-5 bg-white">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#47695F] mb-1">Latest Acquisition</p>
          <p className="text-3xl font-extrabold text-[#024738] font-sans">
            {new Date(purchases[0].createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Purchase List */}
      <div className="portal-card overflow-hidden bg-white">
        <div className="border-b border-[#D1EFE0] px-6 py-4 bg-[#F7FDF9] flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#024738]">Ownership Audit Trail</h3>
          <span className="text-[10px] font-extrabold text-[#059669] bg-[#E8F7ED] border border-[#D1EFE0] px-2.5 py-0.5 rounded-full">
            Verified
          </span>
        </div>
        <div className="divide-y divide-[#E8F7ED]">
          {purchases.map((purchase) => (
            <div key={purchase.id} className="flex items-center gap-4 px-6 py-4 hover:bg-[#F2FAF4] transition-colors">
              {/* Vehicle Image */}
              <div className="h-14 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-[#E8F7ED] border border-[#D1EFE0]">
                {purchase.vehicle.imageUrl ? (
                  <img
                    src={purchase.vehicle.imageUrl}
                    alt={`${purchase.vehicle.make} ${purchase.vehicle.model}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <svg className="h-6 w-6 text-[#47695F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Vehicle Details */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-extrabold text-[#024738] truncate">
                  {purchase.vehicle.make} {purchase.vehicle.model}
                </p>
                <p className="text-xs text-[#47695F] font-medium">{purchase.vehicle.category}</p>
              </div>

              {/* Purchase Price */}
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-extrabold text-[#059669]">
                  ${purchase.purchasePrice.toLocaleString()}
                </p>
                <p className="text-[10px] text-[#5E7E75] font-medium">
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
