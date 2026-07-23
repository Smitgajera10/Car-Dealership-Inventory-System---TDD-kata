import React, { useState, useEffect } from 'react';
import type { Vehicle, AddVehiclePayload, UpdateVehiclePayload } from '../types';

interface VehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AddVehiclePayload | UpdateVehiclePayload) => Promise<void>;
  initialData?: Vehicle | null;
  isLoading?: boolean;
}

export function VehicleModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}: VehicleModalProps) {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [category, setCategory] = useState('Sedan');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!initialData;

  useEffect(() => {
    if (initialData) {
      setMake(initialData.make);
      setModel(initialData.model);
      setCategory(initialData.category);
      setPrice(String(initialData.price));
      setQuantity(String(initialData.quantity));
      setImageUrl(initialData.imageUrl || '');
    } else {
      setMake('');
      setModel('');
      setCategory('Sedan');
      setPrice('');
      setQuantity('1');
      setImageUrl('');
    }
    setError(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const numPrice = Number(price);
    const numQuantity = Number(quantity);

    if (!make.trim() || !model.trim() || !category.trim()) {
      setError('Make, Model, and Category are required');
      return;
    }

    if (Number.isNaN(numPrice) || numPrice <= 0) {
      setError('Price must be a valid number greater than 0');
      return;
    }

    if (Number.isNaN(numQuantity) || numQuantity < 0) {
      setError('Quantity must be a valid number 0 or greater');
      return;
    }

    try {
      await onSubmit({
        make: make.trim(),
        model: model.trim(),
        category: category.trim(),
        price: numPrice,
        quantity: numQuantity,
        imageUrl: imageUrl.trim() || null,
      });
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to save vehicle');
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-panel max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-surface-800 pb-4">
          <h3 className="text-xl font-bold text-white">
            {isEditing ? '✏️ Edit Vehicle Details' : '🚗 Add New Vehicle'}
          </h3>
          <button
            onClick={onClose}
            className="text-surface-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
            <span>⚠️ {error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Make *</label>
              <input
                type="text"
                required
                value={make}
                onChange={(e) => setMake(e.target.value)}
                placeholder="e.g. Toyota"
                className="input"
              />
            </div>
            <div>
              <label className="label">Model *</label>
              <input
                type="text"
                required
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g. Camry"
                className="input"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="label">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input bg-surface-800"
              >
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Coupe">Coupe</option>
                <option value="Luxury">Luxury</option>
                <option value="Electric">Electric</option>
                <option value="Truck">Truck</option>
              </select>
            </div>
            <div>
              <label className="label">Price ($) *</label>
              <input
                type="number"
                required
                min="1"
                step="any"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="25000"
                className="input"
              />
            </div>
            <div>
              <label className="label">Quantity *</label>
              <input
                type="number"
                required
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="5"
                className="input"
              />
            </div>
          </div>

          <div>
            <label className="label">Image URL (Optional)</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="input"
            />
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
                  <span>Saving...</span>
                </div>
              ) : isEditing ? (
                'Update Vehicle'
              ) : (
                'Add Vehicle'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
