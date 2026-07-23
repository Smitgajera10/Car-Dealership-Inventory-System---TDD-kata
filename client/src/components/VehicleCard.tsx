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

export function VehicleCard({ vehicle, onPurchase, onEdit, onRestock, onDelete, isPurchasing = false }: VehicleCardProps) {
  const { isAdmin } = useAuth();
  const [imageError, setImageError] = useState(false);

  const isOutOfStock = vehicle.quantity <= 0;
  const isLowStock = vehicle.quantity > 0 && vehicle.quantity <= 2;
  const imageUrl = getVehicleImage(vehicle);
  const specs = getVehicleSpecs(vehicle);

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0,
  }).format(vehicle.price);

  return (
    <div className="portal-card-hover group relative flex flex-col justify-between overflow-hidden bg-white border border-[#D1EFE0] rounded-[24px]">
      {/* Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#F2FAF4]">
        <img
          src={imageError ? 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80' : imageUrl}
          alt={`${vehicle.make} ${vehicle.model}`}
          onError={() => setImageError(true)}
          className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${isOutOfStock ? 'grayscale opacity-60' : ''}`}
        />

        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
            <span className="rounded-full bg-[#DC2626] text-white font-extrabold text-xs uppercase tracking-wider px-4 py-1.5 shadow-lg">
              Sold Out
            </span>
          </div>
        )}

        {/* Top Left: Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="rounded-full bg-white/95 backdrop-blur-md text-[10px] font-extrabold text-[#024738] uppercase tracking-wider px-3 py-1 shadow-sm border border-[#D1EFE0]">
            {vehicle.category}
          </span>
        </div>

        {!isOutOfStock && (
          <div className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-[#C0F762] text-[#024738] shadow-md border border-[#A3E635]" title="Verified Vehicle">
            <svg className="h-4 w-4 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}

        {/* Bottom Left: Stock Status */}
        <div className="absolute bottom-3 left-3">
          {isOutOfStock ? (
            <span className="rounded-full bg-red-100 border border-red-200 text-red-700 text-[10px] font-bold uppercase tracking-wider px-3 py-1">
              Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-[10px] font-bold uppercase tracking-wider px-3 py-1">
              Low Stock · {vehicle.quantity} left
            </span>
          ) : (
            <span className="rounded-full bg-[#E8FCC9] border border-[#B2F348] text-[#024738] text-[10px] font-bold uppercase tracking-wider px-3 py-1">
              In Stock · {vehicle.quantity}
            </span>
          )}
        </div>
      </div>

      {/* Card Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div>
          <h3 className="text-base font-extrabold text-[#024738] group-hover:text-[#059669] transition-colors line-clamp-1">
            {specs.year} {vehicle.make} {vehicle.model}
          </h3>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-extrabold text-[#024738]">{formattedPrice}</span>
            <span className="text-xs font-bold text-[#47695F]">{specs.hp} HP</span>
          </div>
        </div>

        {/* Specs Pill Grid */}
        <div className="grid grid-cols-2 gap-2 text-[11px] bg-[#F7FDF9] p-3 rounded-2xl border border-[#D1EFE0]">
          <div className="flex items-center gap-1.5 text-[#47695F] font-semibold">
            <svg className="h-3.5 w-3.5 text-[#024738] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{specs.transmission}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#47695F] font-semibold">
            <svg className="h-3.5 w-3.5 text-[#024738] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="truncate">{specs.fuelType}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#47695F] font-semibold">
            <svg className="h-3.5 w-3.5 text-[#024738] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <span>{specs.mileage.toLocaleString()} mi</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#5E7E75] font-mono text-[10px]">
            <span className="text-[#024738] font-bold">#</span>
            <span className="truncate">{specs.vin.slice(0, 10)}…</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-2 border-t border-[#E8F7ED] space-y-2 mt-auto">
          <button
            onClick={() => onPurchase(vehicle.id)}
            disabled={isOutOfStock || isPurchasing}
            className={`w-full flex items-center justify-between rounded-full px-5 py-2.5 text-xs font-bold transition-all shadow-md ${
              isOutOfStock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                : 'bg-[#024738] text-white hover:bg-[#013328] shadow-[#024738]/20'
            }`}
          >
            <span>
              {isPurchasing ? 'Processing Order...' : isOutOfStock ? 'Sold Out' : 'Purchase Vehicle'}
            </span>
            {!isOutOfStock && (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#C0F762] text-[#024738] font-extrabold text-xs">
                ↗
              </span>
            )}
          </button>

          {/* Admin Tools */}
          {isAdmin && (
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              {onEdit && (
                <button type="button" onClick={() => onEdit(vehicle)}
                  className="rounded-full bg-white border border-[#D1EFE0] py-1.5 text-[11px] font-bold text-[#024738] hover:bg-[#E8F7ED]">
                  Edit
                </button>
              )}
              {onRestock && (
                <button type="button" onClick={() => onRestock(vehicle)}
                  className="rounded-full bg-[#E8FCC9] border border-[#B2F348] py-1.5 text-[11px] font-bold text-[#024738] hover:bg-[#C0F762]">
                  Restock
                </button>
              )}
              {onDelete && (
                <button type="button" onClick={() => onDelete(vehicle.id)}
                  className="rounded-full bg-red-50 border border-red-200 py-1.5 text-[11px] font-bold text-red-600 hover:bg-red-100">
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
