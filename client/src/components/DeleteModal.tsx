import type { Vehicle } from '../types';

interface DeleteModalProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
  isLoading?: boolean;
}

export function DeleteModal({ vehicle, isOpen, onClose, onConfirm, isLoading = false }: DeleteModalProps) {
  if (!isOpen || !vehicle) return null;

  const handleConfirm = async () => {
    await onConfirm(vehicle.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in" onClick={onClose}>
      <div className="portal-card max-w-md w-full p-6 shadow-2xl bg-white border border-red-200 rounded-3xl animate-scale-in" onClick={(e) => e.stopPropagation()}>

        <div className="flex items-center gap-3 border-b border-red-100 pb-4 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 border border-red-200 shrink-0">
            <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-serif font-bold text-[#024738]">Delete Vehicle Record</h3>
            <p className="text-xs text-[#47695F] font-medium">Permanent database removal</p>
          </div>
        </div>

        {/* Vehicle preview */}
        <div className="p-3.5 rounded-2xl bg-[#F7FDF9] border border-[#D1EFE0] mb-4 flex items-center gap-3">
          {vehicle.imageUrl ? (
            <img src={vehicle.imageUrl} alt={vehicle.model} className="h-12 w-16 object-cover rounded-xl border border-[#D1EFE0] shrink-0" />
          ) : (
            <div className="h-12 w-16 bg-[#E8F7ED] rounded-xl flex items-center justify-center text-xs font-bold text-[#024738] shrink-0">{vehicle.make}</div>
          )}
          <div>
            <h4 className="text-sm font-bold text-[#024738]">{vehicle.make} {vehicle.model}</h4>
            <p className="text-xs text-[#47695F]">{vehicle.category} · ${vehicle.price.toLocaleString()}</p>
          </div>
        </div>

        <p className="text-xs text-[#47695F] leading-relaxed mb-5 font-medium">
          Are you sure you want to permanently remove <span className="font-bold text-[#024738]">{vehicle.make} {vehicle.model}</span> from inventory? This operation cannot be undone.
        </p>

        <div className="flex items-center justify-end gap-3">
          <button type="button" onClick={onClose} className="portal-btn-secondary text-xs">Cancel</button>
          <button type="button" onClick={handleConfirm} disabled={isLoading} className="portal-btn-danger text-xs disabled:opacity-60">
            {isLoading ? 'Deleting...' : 'Delete Vehicle'}
          </button>
        </div>
      </div>
    </div>
  );
}
