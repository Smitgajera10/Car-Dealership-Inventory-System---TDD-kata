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
    <div className="portal-card-hover group relative flex flex-col justify-between overflow-hidden">
      {/* Image */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
        <img
          src={imageError ? 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80' : imageUrl}
          alt={`${vehicle.make} ${vehicle.model}`}
          onError={() => setImageError(true)}
          className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${isOutOfStock ? 'grayscale opacity-60' : ''}`}
        />

        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center">
            <span className="rounded-xl bg-red-500 text-white font-bold text-xs uppercase tracking-wider px-3.5 py-1.5 shadow-lg">
              Sold Out
            </span>
          </div>
        )}

        {/* Category badge */}
        <div className="absolute top-2.5 left-2.5">
          <span className="rounded-lg bg-white/90 backdrop-blur-sm text-[10px] font-bold text-[#6D5DFB] uppercase tracking-wider px-2.5 py-1 shadow-sm border border-white/60">
            {vehicle.category}
          </span>
        </div>

        {/* Stock badge */}
        <div className="absolute bottom-2.5 left-2.5">
          {isOutOfStock ? (
            <span className="rounded-lg bg-red-50 border border-red-200 text-red-600 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1">
              Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1">
              Low Stock · {vehicle.quantity} left
            </span>
          ) : (
            <span className="rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1">
              In Stock · {vehicle.quantity}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#6D5DFB] transition-colors line-clamp-1">
            {specs.year} {vehicle.make} {vehicle.model}
          </h3>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-lg font-extrabold text-[#6D5DFB]">{formattedPrice}</span>
            <span className="text-xs text-slate-400">{specs.hp} HP</span>
          </div>
        </div>

        {/* Specs grid */}
        <div className="grid grid-cols-2 gap-1.5 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <div className="flex items-center gap-1.5 text-slate-500">
            <svg className="h-3.5 w-3.5 text-slate-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{specs.transmission}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500">
            <svg className="h-3.5 w-3.5 text-slate-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="truncate">{specs.fuelType}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500">
            <svg className="h-3.5 w-3.5 text-slate-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <span>{specs.mileage.toLocaleString()} mi</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[10px]">
            <span className="text-slate-300 font-sans">#</span>
            <span className="truncate">{specs.vin.slice(0, 10)}…</span>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 border-t border-slate-100 space-y-2 mt-auto">
          <button
            onClick={() => onPurchase(vehicle.id)}
            disabled={isOutOfStock || isPurchasing}
            className={`w-full portal-btn text-xs font-bold uppercase tracking-wide ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                : 'portal-btn-primary'
            }`}
          >
            {isPurchasing ? (
              <div className="flex items-center gap-2">
                <div className="h-3.5 w-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Processing…
              </div>
            ) : isOutOfStock ? 'Sold Out' : (
              <div className="flex items-center gap-1.5">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Purchase Vehicle
              </div>
            )}
          </button>

          {isAdmin && (
            <div className="grid grid-cols-3 gap-1.5">
              {onEdit && (
                <button type="button" onClick={() => onEdit(vehicle)}
                  className="portal-btn-secondary py-1.5 text-[11px] text-slate-500 hover:text-slate-800">
                  Edit
                </button>
              )}
              {onRestock && (
                <button type="button" onClick={() => onRestock(vehicle)}
                  className="portal-btn-secondary py-1.5 text-[11px] text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200">
                  Restock
                </button>
              )}
              {onDelete && (
                <button type="button" onClick={() => onDelete(vehicle.id)}
                  className="portal-btn-danger py-1.5 text-[11px]">
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
