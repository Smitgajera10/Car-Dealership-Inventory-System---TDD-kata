import React, { useState } from 'react';
import type { Vehicle } from '../types';

interface RestockModalProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, amount: number) => Promise<void>;
  isLoading?: boolean;
}

export function RestockModal({
  vehicle,
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: RestockModalProps) {
  const [amount, setAmount] = useState(5);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !vehicle) return null;

  const newStockTotal = vehicle.quantity + (Number(amount) || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (amount <= 0) {
      setError('Restock amount must be greater than 0');
      return;
    }

    try {
      await onSubmit(vehicle.id, amount);
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to restock vehicle');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in" onClick={onClose}>
      <div
        className="portal-card max-w-sm w-full p-6 shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-white">📦 Restock Inventory</h3>
            <p className="text-xs text-gray-400">
              {vehicle.make} {vehicle.model}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Current Stock vs New Stock Display */}
        <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-[#0B1020] border border-white/10 mb-4 text-center">
          <div className="border-r border-white/10 pr-2">
            <span className="text-[10px] uppercase font-semibold text-gray-500 block">Current Stock</span>
            <span className="text-lg font-bold text-gray-300">{vehicle.quantity} units</span>
          </div>
          <div className="pl-2">
            <span className="text-[10px] uppercase font-semibold text-[#16C784] block">New Stock Total</span>
            <span className="text-lg font-extrabold text-[#16C784]">{newStockTotal} units</span>
          </div>
        </div>

        {error && (
          <div className="mb-4 text-xs text-[#F04438] bg-[#F04438]/10 border border-[#F04438]/20 rounded-xl p-3">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
              Additional Quantity to Add *
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAmount(Math.max(1, amount - 1))}
                className="portal-btn-secondary py-2 px-3 text-sm font-bold"
              >
                -
              </button>
              <input
                type="number"
                required
                min="1"
                value={amount}
                onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 1))}
                className="portal-input text-center font-extrabold text-base py-2"
              />
              <button
                type="button"
                onClick={() => setAmount(amount + 1)}
                className="portal-btn-secondary py-2 px-3 text-sm font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* Preset Buttons (+5, +10, +25, +50) */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1.5">
              Quick Add Presets:
            </span>
            <div className="grid grid-cols-4 gap-1.5">
              {[5, 10, 25, 50].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAmount(preset)}
                  className={`portal-btn-secondary py-1.5 text-xs font-semibold ${
                    amount === preset ? 'border-[#16C784] text-[#16C784] bg-[#16C784]/10' : ''
                  }`}
                >
                  +{preset}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="portal-btn-secondary text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="portal-btn-primary text-xs"
            >
              {isLoading ? 'Updating...' : 'Confirm Restock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
