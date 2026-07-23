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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 animate-fade-in" onClick={onClose}>
      <div className="portal-card max-w-sm w-full p-6 shadow-2xl shadow-slate-200 animate-fade-in-up" onClick={(e) => e.stopPropagation()}>

        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50">
              <svg className="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Restock Inventory</h3>
              <p className="text-xs text-slate-400">{vehicle.make} {vehicle.model}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Stock display */}
        <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 mb-4 text-center">
          <div className="border-r border-slate-200">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Current</span>
            <span className="text-lg font-bold text-slate-700">{vehicle.quantity} units</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-emerald-600 block">New Total</span>
            <span className="text-lg font-extrabold text-emerald-600">{newTotal} units</span>
          </div>
        </div>

        {error && (
          <div className="mb-4 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
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
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">Quick presets</span>
            <div className="grid grid-cols-4 gap-1.5">
              {[5, 10, 25, 50].map((p) => (
                <button key={p} type="button" onClick={() => setAmount(p)}
                  className={`portal-btn-secondary py-1.5 text-xs font-semibold transition-colors ${amount === p ? 'border-emerald-300 text-emerald-600 bg-emerald-50' : ''}`}>
                  +{p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose} className="portal-btn-secondary text-xs">Cancel</button>
            <button type="submit" disabled={isLoading} className="portal-btn-primary text-xs disabled:opacity-60">
              {isLoading ? 'Updating…' : 'Confirm Restock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
