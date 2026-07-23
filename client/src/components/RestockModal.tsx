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
  const [amount, setAmount] = useState('5');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !vehicle) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const numAmount = Number(amount);
    if (Number.isNaN(numAmount) || numAmount <= 0) {
      setError('Restock amount must be greater than 0');
      return;
    }

    try {
      await onSubmit(vehicle.id, numAmount);
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to restock vehicle');
      }
    }
  };

  const setPreset = (presetValue: number) => {
    setAmount(String(presetValue));
    setError(null);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-panel max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-surface-800 pb-3">
          <div>
            <h3 className="text-lg font-bold text-white">📦 Restock Stock</h3>
            <p className="text-xs text-surface-400">
              {vehicle.make} {vehicle.model}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-surface-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Current stock status */}
        <div className="mt-4 flex items-center justify-between rounded-xl bg-surface-950 p-3 border border-surface-800">
          <span className="text-xs text-surface-400 font-medium">Current Stock</span>
          <span className="text-sm font-bold text-brand-400">
            {vehicle.quantity} units
          </span>
        </div>

        {error && (
          <div className="mt-3 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-2.5">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="label">Additional Quantity to Add *</label>
            <input
              type="number"
              required
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 5"
              className="input text-base font-bold"
            />
          </div>

          {/* Quick preset buttons */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-surface-400 font-medium">Presets:</span>
            {[1, 5, 10, 25].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setPreset(preset)}
                className="btn-outline py-1 px-2 text-xs font-semibold text-surface-300 hover:text-brand-300 hover:border-brand-500/50"
              >
                +{preset}
              </button>
            ))}
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-surface-800">
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary py-2 text-xs"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="spinner h-3.5 w-3.5" />
                  <span>Updating...</span>
                </div>
              ) : (
                'Confirm Restock'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
