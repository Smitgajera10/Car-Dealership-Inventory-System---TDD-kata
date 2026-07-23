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
  const [quantity, setQuantity] = useState(1);
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreviewError, setImagePreviewError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!initialData;

  useEffect(() => {
    if (initialData) {
      setMake(initialData.make);
      setModel(initialData.model);
      setCategory(initialData.category);
      setPrice(String(initialData.price));
      setQuantity(initialData.quantity);
      setImageUrl(initialData.imageUrl || '');
    } else {
      setMake('');
      setModel('');
      setCategory('Sedan');
      setPrice('');
      setQuantity(1);
      setImageUrl('');
    }
    setImagePreviewError(false);
    setError(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const numPrice = Number(price);

    if (!make.trim() || !model.trim() || !category.trim()) {
      setError('Make, Model, and Category are required');
      return;
    }

    if (Number.isNaN(numPrice) || numPrice <= 0) {
      setError('Price must be a valid number greater than 0');
      return;
    }

    if (quantity < 0) {
      setError('Quantity cannot be negative');
      return;
    }

    try {
      await onSubmit({
        make: make.trim(),
        model: model.trim(),
        category: category.trim(),
        price: numPrice,
        quantity: Number(quantity),
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

  const formattedPricePreview = price && !Number.isNaN(Number(price))
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(price))
    : '$0';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in" onClick={onClose}>
      <div
        className="portal-card max-w-lg w-full p-6 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#6D5DFB]/20 text-[#6D5DFB]">
              {isEditing ? '✏️' : '🚗'}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {isEditing ? 'Edit Vehicle Details' : 'Add New Inventory Vehicle'}
              </h3>
              <p className="text-xs text-gray-400">Dealership Management Portal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-[#F04438]/30 bg-[#F04438]/10 p-3 text-xs text-[#F04438]">
            <span>⚠️ {error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Live Image URL Preview Box */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
              Image URL Preview
            </label>
            <div className="relative h-36 w-full bg-[#0B1020] rounded-xl border border-white/10 overflow-hidden flex items-center justify-center mb-2">
              {imageUrl && !imagePreviewError ? (
                <img
                  src={imageUrl}
                  alt="Vehicle Preview"
                  onError={() => setImagePreviewError(true)}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="text-center text-xs text-gray-500 p-4">
                  <span className="block text-xl mb-1">🖼️</span>
                  <span>{imageUrl ? 'Invalid Image URL' : 'Enter Image URL below for live preview'}</span>
                </div>
              )}
            </div>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                setImagePreviewError(false);
              }}
              placeholder="https://images.unsplash.com/photo-..."
              className="portal-input text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                Make *
              </label>
              <input
                type="text"
                required
                value={make}
                onChange={(e) => setMake(e.target.value)}
                placeholder="e.g. Porsche"
                className="portal-input"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                Model *
              </label>
              <input
                type="text"
                required
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g. 911 GT3"
                className="portal-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="portal-input text-xs"
              >
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Coupe">Coupe</option>
                <option value="Luxury">Luxury</option>
                <option value="Electric">Electric</option>
                <option value="Truck">Truck</option>
                <option value="Supercar">Supercar</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                Price ($) *
              </label>
              <input
                type="number"
                required
                min="1"
                step="any"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="225000"
                className="portal-input text-xs"
              />
              <span className="text-[10px] text-[#6D5DFB] font-semibold mt-0.5 block truncate">
                Preview: {formattedPricePreview}
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                Quantity *
              </label>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(0, quantity - 1))}
                  className="portal-btn-secondary py-1 px-2.5 text-xs font-bold"
                >
                  -
                </button>
                <input
                  type="number"
                  required
                  min="0"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(0, parseInt(e.target.value) || 0))}
                  className="portal-input text-center font-bold text-xs py-1"
                />
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="portal-btn-secondary py-1 px-2.5 text-xs font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
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
              {isLoading ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
