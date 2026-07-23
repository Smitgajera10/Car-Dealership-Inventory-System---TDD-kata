import type { Vehicle } from '../types';

interface DeleteModalProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
  isLoading?: boolean;
}

export function DeleteModal({
  vehicle,
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: DeleteModalProps) {
  if (!isOpen || !vehicle) return null;

  const handleConfirm = async () => {
    await onConfirm(vehicle.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in" onClick={onClose}>
      <div
        className="portal-card max-w-md w-full p-6 shadow-2xl animate-scale-in border-[#F04438]/30"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 text-[#F04438] border-b border-white/10 pb-4 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F04438]/20 border border-[#F04438]/40">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Delete Vehicle Entry</h3>
            <p className="text-xs text-gray-400">Action cannot be undone</p>
          </div>
        </div>

        {/* Vehicle Preview Card */}
        <div className="p-3.5 rounded-xl bg-[#0B1020] border border-white/10 mb-5 flex items-center gap-3">
          {vehicle.imageUrl ? (
            <img
              src={vehicle.imageUrl}
              alt={vehicle.model}
              className="h-12 w-16 object-cover rounded-lg border border-white/10"
            />
          ) : (
            <div className="h-12 w-16 bg-[#131B2F] rounded-lg flex items-center justify-center text-xs font-bold text-gray-400">
              {vehicle.make}
            </div>
          )}
          <div>
            <h4 className="text-sm font-bold text-white">
              {vehicle.make} {vehicle.model}
            </h4>
            <p className="text-xs text-gray-400">
              Category: {vehicle.category} • Price: ${vehicle.price.toLocaleString()}
            </p>
          </div>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed mb-6">
          Are you sure you want to permanently delete this vehicle from dealership inventory? This record will be erased from PostgreSQL database immediately.
        </p>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="portal-btn-secondary text-xs"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className="portal-btn-danger text-xs"
          >
            {isLoading ? 'Deleting...' : 'Yes, Delete Entry'}
          </button>
        </div>
      </div>
    </div>
  );
}
