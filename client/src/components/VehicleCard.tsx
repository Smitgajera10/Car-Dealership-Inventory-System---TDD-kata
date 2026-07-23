import { useState } from 'react';
import type { Vehicle } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface VehicleCardProps {
  vehicle: Vehicle;
  onPurchase: (id: string) => void;
  onEdit?: (vehicle: Vehicle) => void;
  onRestock?: (vehicle: Vehicle) => void;
  onDelete?: (id: string) => void;
  isPurchasing?: boolean;
}

export function VehicleCard({
  vehicle,
  onPurchase,
  onEdit,
  onRestock,
  onDelete,
  isPurchasing = false,
}: VehicleCardProps) {
  const { isAdmin } = useAuth();
  const [imageError, setImageError] = useState(false);

  const isOutOfStock = vehicle.quantity <= 0;
  const isLowStock = vehicle.quantity > 0 && vehicle.quantity <= 2;

  // Format currency: $25,000
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(vehicle.price);

  return (
    <div className="card-hover overflow-hidden flex flex-col justify-between group">
      {/* Top Image Section */}
      <div className="relative h-48 w-full bg-surface-950 overflow-hidden border-b border-surface-800">
        {vehicle.imageUrl && !imageError ? (
          <img
            src={vehicle.imageUrl}
            alt={`${vehicle.make} ${vehicle.model}`}
            onError={() => setImageError(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-surface-900 to-surface-950 text-surface-400 p-4">
            <svg
              className="h-12 w-12 text-surface-400/50 mb-2 group-hover:scale-110 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 17a2 2 0 100 4 2 2 0 000-4zm8 0a2 2 0 100 4 2 2 0 000-4zM3 9l2-3h11l2 3M3 9v7a1 1 0 001 1h1m12-8v7a1 1 0 01-1 1h-1M3 9h18"
              />
            </svg>
            <span className="text-xs font-semibold uppercase tracking-wider text-surface-400">
              {vehicle.make} {vehicle.model}
            </span>
          </div>
        )}

        {/* Badges on Top Image */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
          <span className="badge-blue backdrop-blur-md shadow-md">
            {vehicle.category}
          </span>
        </div>

        {/* Stock Badge */}
        <div className="absolute top-3 right-3 z-10">
          {isOutOfStock ? (
            <span className="badge-red shadow-md backdrop-blur-md">
              Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="badge bg-amber-900/80 text-amber-300 border border-amber-700 shadow-md backdrop-blur-md">
              Low Stock ({vehicle.quantity})
            </span>
          ) : (
            <span className="badge-green shadow-md backdrop-blur-md">
              In Stock ({vehicle.quantity})
            </span>
          )}
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-lg font-bold text-white group-hover:text-brand-300 transition-colors truncate">
              {vehicle.make} {vehicle.model}
            </h3>
          </div>
          <p className="mt-1 text-2xl font-extrabold text-brand-400">
            {formattedPrice}
          </p>
        </div>

        {/* Purchase Action Button (Step 6.4) */}
        <div className="pt-2 border-t border-surface-800 flex flex-col gap-2">
          <button
            onClick={() => onPurchase(vehicle.id)}
            disabled={isOutOfStock || isPurchasing}
            className={`w-full py-2.5 text-xs font-bold uppercase tracking-wider ${
              isOutOfStock
                ? 'btn bg-surface-800 text-surface-500 cursor-not-allowed border border-surface-700'
                : 'btn-primary'
            }`}
          >
            {isPurchasing ? (
              <div className="flex items-center justify-center gap-2">
                <div className="spinner h-4 w-4" />
                <span>Processing...</span>
              </div>
            ) : isOutOfStock ? (
              'Sold Out'
            ) : (
              <div className="flex items-center justify-center gap-1.5">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Purchase Vehicle</span>
              </div>
            )}
          </button>

          {/* Admin Management Toolbar (Step 6.5) */}
          {isAdmin && (
            <div className="grid grid-cols-3 gap-1.5 pt-2">
              {onEdit && (
                <button
                  type="button"
                  onClick={() => onEdit(vehicle)}
                  className="btn-outline py-1.5 text-[11px] font-semibold text-surface-300 hover:text-white"
                  title="Edit details"
                >
                  ✏️ Edit
                </button>
              )}
              {onRestock && (
                <button
                  type="button"
                  onClick={() => onRestock(vehicle)}
                  className="btn-outline py-1.5 text-[11px] font-semibold text-emerald-400 hover:border-emerald-500/50 hover:bg-emerald-500/10"
                  title="Restock stock"
                >
                  📦 Restock
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(vehicle.id)}
                  className="btn-outline py-1.5 text-[11px] font-semibold text-red-400 hover:border-red-500/50 hover:bg-red-500/10"
                  title="Delete vehicle"
                >
                  🗑️ Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
