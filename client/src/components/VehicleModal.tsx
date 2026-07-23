import React, { useState, useEffect } from 'react';
import type { Vehicle, AddVehiclePayload, UpdateVehiclePayload } from '../types';

interface VehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AddVehiclePayload | UpdateVehiclePayload) => Promise<void>;
  initialData?: Vehicle | null;
  isLoading?: boolean;
}

export function VehicleModal({ isOpen, onClose, onSubmit, initialData, isLoading = false }: VehicleModalProps) {
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
      setMake(initialData.make); setModel(initialData.model); setCategory(initialData.category);
      setPrice(String(initialData.price)); setQuantity(initialData.quantity);
      setImageUrl(initialData.imageUrl || '');
    } else {
      setMake(''); setModel(''); setCategory('Sedan'); setPrice(''); setQuantity(1); setImageUrl('');
    }
    setImagePreviewError(false); setError(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const numPrice = Number(price);
    if (!make.trim() || !model.trim() || !category.trim()) { setError('Make, Model, and Category are required'); return; }
    if (Number.isNaN(numPrice) || numPrice <= 0) { setError('Price must be a valid number greater than 0'); return; }
    if (quantity < 0) { setError('Quantity cannot be negative'); return; }
    try {
      await onSubmit({ make: make.trim(), model: model.trim(), category: category.trim(), price: numPrice, quantity: Number(quantity), imageUrl: imageUrl.trim() || null });
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save vehicle');
    }
  };

  const formattedPricePreview = price && !Number.isNaN(Number(price))
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(price))
    : '$0';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 animate-fade-in" onClick={onClose}>
      <div className="portal-card max-w-lg w-full p-6 shadow-2xl shadow-slate-200 animate-fade-in-up max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#6D5DFB]/10">
              <svg className="h-5 w-5 text-[#6D5DFB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isEditing
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />}
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{isEditing ? 'Edit Vehicle' : 'Add New Vehicle'}</h3>
              <p className="text-xs text-slate-400">Inventory management</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600">
            <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image preview */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Image URL</label>
            <div className="relative h-32 w-full bg-slate-100 rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center mb-2">
              {imageUrl && !imagePreviewError ? (
                <img src={imageUrl} alt="Preview" onError={() => setImagePreviewError(true)} className="h-full w-full object-cover" />
              ) : (
                <div className="text-center text-xs text-slate-400">
                  <svg className="h-8 w-8 mx-auto mb-1 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {imageUrl ? 'Invalid image URL' : 'Enter URL below for preview'}
                </div>
              )}
            </div>
            <input type="url" value={imageUrl} onChange={(e) => { setImageUrl(e.target.value); setImagePreviewError(false); }}
              placeholder="https://images.unsplash.com/…" className="portal-input text-xs" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Make *</label>
              <input type="text" required value={make} onChange={(e) => setMake(e.target.value)} placeholder="e.g. Porsche" className="portal-input" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Model *</label>
              <input type="text" required value={model} onChange={(e) => setModel(e.target.value)} placeholder="e.g. 911 GT3" className="portal-input" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Category *</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="portal-input text-xs">
                {['Sedan','SUV','Coupe','Luxury','Electric','Truck','Supercar'].map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Price ($) *</label>
              <input type="number" required min="1" step="any" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="225000" className="portal-input text-xs" />
              <span className="text-[10px] text-[#6D5DFB] font-semibold mt-0.5 block">{formattedPricePreview}</span>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Quantity *</label>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => setQuantity(Math.max(0, quantity - 1))} className="portal-btn-secondary py-1 px-2.5 text-xs font-bold">−</button>
                <input type="number" required min="0" value={quantity}
                  onChange={(e) => setQuantity(Math.max(0, parseInt(e.target.value) || 0))}
                  className="portal-input text-center font-bold text-xs py-1" />
                <button type="button" onClick={() => setQuantity(quantity + 1)} className="portal-btn-secondary py-1 px-2.5 text-xs font-bold">+</button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose} className="portal-btn-secondary text-xs">Cancel</button>
            <button type="submit" disabled={isLoading} className="portal-btn-primary text-xs disabled:opacity-60">
              {isLoading ? 'Saving…' : isEditing ? 'Save Changes' : 'Add Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
