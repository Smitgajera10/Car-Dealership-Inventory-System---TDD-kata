import { useState } from 'react';
import type { Vehicle } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { getVehicleImage, getVehicleSpecs } from '../utils/carHelpers';

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
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isOutOfStock = vehicle.quantity <= 0;
  const isLowStock = vehicle.quantity > 0 && vehicle.quantity <= 2;

  const imageUrl = getVehicleImage(vehicle);
  const specs = getVehicleSpecs(vehicle);

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(vehicle.price);

  return (
    <div className="portal-card-hover group relative flex flex-col justify-between overflow-hidden">
      {/* Top 16:9 Image Container */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#0B1020] border-b border-white/10">
        <img
          src={imageError ? 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80' : imageUrl}
          alt={`${vehicle.make} ${vehicle.model}`}
          onError={() => setImageError(true)}
          className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            isOutOfStock ? 'filter grayscale blur-[1px] opacity-60' : ''
          }`}
        />

        {/* Gray Overlay when Out of Stock */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-[#0B1020]/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="rounded-xl bg-[#F04438]/90 text-white font-extrabold text-xs uppercase tracking-wider px-3.5 py-1.5 shadow-lg shadow-[#F04438]/40 border border-[#F04438]">
              Sold Out
            </span>
          </div>
        )}

        {/* Favorite Heart Toggle Icon */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-xl bg-[#0B1020]/70 backdrop-blur-md border border-white/10 text-white hover:bg-[#0B1020] transition-colors"
          title="Favorite vehicle"
        >
          <svg
            className={`h-4 w-4 transition-colors ${
              isFavorite ? 'fill-[#F04438] text-[#F04438]' : 'text-gray-300'
            }`}
            fill={isFavorite ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>

        {/* Badges on Top Image */}
        <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-1.5">
          <span className="rounded-lg bg-[#0B1020]/80 backdrop-blur-md border border-white/10 text-[10px] font-bold text-[#6D5DFB] uppercase tracking-wider px-2.5 py-1">
            {vehicle.category}
          </span>
        </div>

        {/* Stock Status Badge */}
        <div className="absolute bottom-3 left-3 z-10">
          {isOutOfStock ? (
            <span className="rounded-lg bg-[#F04438]/20 border border-[#F04438]/40 text-[#F04438] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 backdrop-blur-md">
              Out of Stock (0)
            </span>
          ) : isLowStock ? (
            <span className="rounded-lg bg-[#F5A524]/20 border border-[#F5A524]/40 text-[#F5A524] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 backdrop-blur-md">
              Low Stock ({vehicle.quantity} left)
            </span>
          ) : (
            <span className="rounded-lg bg-[#16C784]/20 border border-[#16C784]/40 text-[#16C784] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 backdrop-blur-md">
              In Stock ({vehicle.quantity})
            </span>
          )}
        </div>
      </div>

      {/* Card Content & Spec Hierarchy */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-bold text-white group-hover:text-[#6D5DFB] transition-colors line-clamp-1">
              {specs.year} {vehicle.make} {vehicle.model}
            </h3>
          </div>

          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl font-extrabold text-[#6D5DFB]">
              {formattedPrice}
            </span>
            <span className="text-[11px] font-medium text-gray-400">
              {specs.hp} HP
            </span>
          </div>

          {/* Luxury Specifications Grid */}
          <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] bg-[#0B1020] p-2.5 rounded-xl border border-white/5">
            <div className="flex items-center gap-1.5 text-gray-300">
              <span className="text-gray-500">⚙️</span>
              <span className="truncate">{specs.transmission}</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-300">
              <span className="text-gray-500">⛽</span>
              <span className="truncate">{specs.fuelType}</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-300">
              <span className="text-gray-500">🛣️</span>
              <span>{specs.mileage} mi</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-400 font-mono text-[10px]">
              <span className="text-gray-500 font-sans">#</span>
              <span className="truncate" title={specs.vin}>{specs.vin.slice(0, 10)}...</span>
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="pt-3 border-t border-white/10 space-y-2">
          {/* Purchase Button */}
          <button
            onClick={() => onPurchase(vehicle.id)}
            disabled={isOutOfStock || isPurchasing}
            className={`w-full portal-btn text-xs font-bold uppercase tracking-wider ${
              isOutOfStock
                ? 'bg-gray-800/60 text-gray-500 border border-white/5 cursor-not-allowed'
                : 'portal-btn-primary'
            }`}
          >
            {isPurchasing ? (
              <div className="flex items-center gap-2">
                <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing Order...</span>
              </div>
            ) : isOutOfStock ? (
              'Sold Out'
            ) : (
              <div className="flex items-center gap-1.5">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Purchase Vehicle</span>
              </div>
            )}
          </button>

          {/* Admin-Only Management Action Toolbar (ONLY shown if user is ADMIN) */}
          {isAdmin && (
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              {onEdit && (
                <button
                  type="button"
                  onClick={() => onEdit(vehicle)}
                  className="portal-btn-secondary py-1.5 text-[11px] text-gray-300 hover:text-white"
                  title="Edit vehicle details"
                >
                  ✏️ Edit
                </button>
              )}
              {onRestock && (
                <button
                  type="button"
                  onClick={() => onRestock(vehicle)}
                  className="portal-btn-secondary py-1.5 text-[11px] text-[#16C784] hover:bg-[#16C784]/10 hover:border-[#16C784]/30"
                  title="Restock stock inventory"
                >
                  📦 Restock
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(vehicle.id)}
                  className="portal-btn-danger py-1.5 text-[11px]"
                  title="Delete vehicle entry"
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
