import React, { useState } from 'react';
import type { Vehicle } from '../types';

interface RestockModalProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, amount: number) => Promise<void>;
  isLoading?: boolean;
}

export function RestockModal({ vehicle, isOpen, onClose, onSubmit, isLoading = false }: RestockModalProps) {
  const [amount, setAmount] = useState(5);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !vehicle) return null;

  const newTotal = vehicle.quantity + (Number(amount) || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (amount <= 0) { setError('Restock amount must be greater than 0'); return; }
    try {
      await onSubmit(vehicle.id, amount);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to restock vehicle');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in" onClick={onClose}>
      <div className="portal-card max-w-sm w-full p-6 shadow-2xl bg-white border border-[#D1EFE0] rounded-3xl animate-scale-in" onClick={(e) => e.stopPropagation()}>

        <div className="flex items-center justify-between border-b border-[#E8F7ED] pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8FCC9] border border-[#B2F348]">
              <svg className="h-5 w-5 text-[#024738]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-serif font-bold text-[#024738]">Restock Inventory</h3>
              <p className="text-xs text-[#47695F] font-medium">{vehicle.make} {vehicle.model}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#47695F] hover:text-[#024738] p-1 rounded-full hover:bg-[#E8F7ED]">
            ✕
          </button>
        </div>

        {/* Stock display */}
        <div className="grid grid-cols-2 gap-2 p-3.5 rounded-2xl bg-[#F7FDF9] border border-[#D1EFE0] mb-4 text-center">
          <div className="border-r border-[#D1EFE0]">
            <span className="text-[10px] uppercase font-bold text-[#47695F] block">Current</span>
            <span className="text-lg font-bold text-[#024738]">{vehicle.quantity} units</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#059669] block">New Total</span>
            <span className="text-lg font-extrabold text-[#059669]">{newTotal} units</span>
          </div>
        </div>

        {error && (
          <div className="mb-4 text-xs font-bold text-red-600 bg-red-50 border border-red-200 rounded-2xl p-3">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#47695F] mb-1.5">
              Units to Add
            </label>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setAmount(Math.max(1, amount - 1))} className="portal-btn-secondary py-2 px-3 text-sm font-bold">−</button>
              <input type="number" required min="1" value={amount}
                onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 1))}
                className="portal-input text-center font-extrabold text-base py-2" />
              <button type="button" onClick={() => setAmount(amount + 1)} className="portal-btn-secondary py-2 px-3 text-sm font-bold">+</button>
            </div>
          </div>

          {/* Presets */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#47695F] block mb-1.5">Quick presets</span>
            <div className="grid grid-cols-4 gap-1.5">
              {[5, 10, 25, 50].map((p) => (
                <button key={p} type="button" onClick={() => setAmount(p)}
                  className={`rounded-full py-1.5 text-xs font-bold transition-all border ${
                    amount === p ? 'border-[#B2F348] text-[#024738] bg-[#E8FCC9]' : 'border-[#D1EFE0] text-[#47695F] bg-white hover:bg-[#E8F7ED]'
                  }`}>
                  +{p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8F7ED]">
            <button type="button" onClick={onClose} className="portal-btn-secondary text-xs">Cancel</button>
            <button type="submit" disabled={isLoading} className="portal-btn-primary text-xs disabled:opacity-60">
              {isLoading ? 'Updating...' : 'Confirm Restock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
