import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vehicleApi } from '../services/api.service';
import type { Vehicle, AddVehiclePayload, UpdateVehiclePayload } from '../types';
import { Navbar } from '../components/Navbar';
import { VehicleCard } from '../components/VehicleCard';
import { VehicleModal } from '../components/VehicleModal';
import { RestockModal } from '../components/RestockModal';
import Axios from 'axios';

export default function CatalogPage() {
  const queryClient = useQueryClient();

  // Search & Filter local state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'stock'>('newest');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [restockingVehicle, setRestockingVehicle] = useState<Vehicle | null>(null);

  // Notification Banner
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // ── 1. Fetch Vehicles ─────────────────────────────
  const { data: vehicles = [], isLoading, isError } = useQuery<Vehicle[]>({
    queryKey: ['vehicles'],
    queryFn: async () => {
      const res = await vehicleApi.getAll();
      return res.data.data;
    },
  });

  // ── 2. Purchase Mutation (Step 6.4) ────────────────
  const purchaseMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await vehicleApi.purchase(id);
      return res.data.data;
    },
    onSuccess: (updatedVehicle) => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      showNotification(
        `🎉 Successfully purchased ${updatedVehicle.make} ${updatedVehicle.model}!`
      );
    },
    onError: (err: unknown) => {
      if (Axios.isAxiosError(err)) {
        showNotification(err.response?.data?.message || 'Purchase failed', 'error');
      } else {
        showNotification('Failed to purchase vehicle', 'error');
      }
    },
  });

  // ── 3. Add Vehicle Mutation (Step 6.5) ─────────────
  const addMutation = useMutation({
    mutationFn: async (payload: AddVehiclePayload) => {
      const res = await vehicleApi.add(payload);
      return res.data.data;
    },
    onSuccess: (newVehicle) => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      showNotification(`✨ Added new vehicle ${newVehicle.make} ${newVehicle.model}!`);
      setIsAddModalOpen(false);
    },
    onError: (err: unknown) => {
      if (Axios.isAxiosError(err)) {
        throw new Error(err.response?.data?.message || 'Failed to add vehicle');
      }
      throw err;
    },
  });

  // ── 4. Update Vehicle Mutation (Step 6.5) ──────────
  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateVehiclePayload }) => {
      const res = await vehicleApi.update(id, payload);
      return res.data.data;
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      showNotification(`✏️ Updated ${updated.make} ${updated.model} details!`);
      setEditingVehicle(null);
    },
    onError: (err: unknown) => {
      if (Axios.isAxiosError(err)) {
        throw new Error(err.response?.data?.message || 'Failed to update vehicle');
      }
      throw err;
    },
  });

  // ── 5. Restock Mutation (Step 6.5) ─────────────────
  const restockMutation = useMutation({
    mutationFn: async ({ id, amount }: { id: string; amount: number }) => {
      const res = await vehicleApi.restock(id, amount);
      return res.data.data;
    },
    onSuccess: (restocked) => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      showNotification(
        `📦 Restocked ${restocked.make} ${restocked.model}! New stock: ${restocked.quantity}`
      );
      setRestockingVehicle(null);
    },
    onError: (err: unknown) => {
      if (Axios.isAxiosError(err)) {
        throw new Error(err.response?.data?.message || 'Failed to restock vehicle');
      }
      throw err;
    },
  });

  // ── 6. Delete Mutation (Step 6.5) ──────────────────
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await vehicleApi.delete(id);
      return res.data.data;
    },
    onSuccess: (deleted) => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      showNotification(`🗑️ Removed ${deleted.make} ${deleted.model} from inventory.`);
    },
    onError: (err: unknown) => {
      if (Axios.isAxiosError(err)) {
        showNotification(err.response?.data?.message || 'Failed to delete vehicle', 'error');
      }
    },
  });

  const handleDelete = (id: string) => {
    const target = vehicles.find((v) => v.id === id);
    const confirmName = target ? `${target.make} ${target.model}` : 'this vehicle';
    if (window.confirm(`Are you sure you want to delete ${confirmName}? This action cannot be undone.`)) {
      deleteMutation.mutate(id);
    }
  };

  // Filter & Sort Logic
  const categories = ['All', 'Sedan', 'SUV', 'Coupe', 'Luxury', 'Electric', 'Truck'];

  const filteredVehicles = useMemo(() => {
    let result = [...vehicles];

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (v) =>
          v.make.toLowerCase().includes(term) ||
          v.model.toLowerCase().includes(term) ||
          v.category.toLowerCase().includes(term)
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter(
        (v) => v.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Price range filters
    if (minPrice !== '') {
      const min = Number(minPrice);
      if (!Number.isNaN(min)) {
        result = result.filter((v) => v.price >= min);
      }
    }

    if (maxPrice !== '') {
      const max = Number(maxPrice);
      if (!Number.isNaN(max)) {
        result = result.filter((v) => v.price <= max);
      }
    }

    // Sort order
    result.sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'stock') return b.quantity - a.quantity;
      // Default: newest
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  }, [vehicles, searchTerm, selectedCategory, minPrice, maxPrice, sortBy]);

  // Total inventory stats
  const totalStockCount = vehicles.reduce((sum, v) => sum + v.quantity, 0);

  return (
    <div className="min-h-screen bg-surface-950 text-surface-50 pb-20">
      {/* Top Navigation */}
      <Navbar onOpenAddModal={() => setIsAddModalOpen(true)} />

      {/* Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
          <div
            className={`flex items-center gap-3 rounded-2xl px-5 py-3.5 text-sm font-medium shadow-2xl backdrop-blur-md border ${
              notification.type === 'success'
                ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/40 shadow-emerald-950/50'
                : 'bg-red-950/90 text-red-200 border-red-500/40 shadow-red-950/50'
            }`}
          >
            <span>{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="text-surface-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <section className="relative overflow-hidden border-b border-surface-800 bg-surface-900/40 py-10">
        <div className="pointer-events-none absolute -top-24 left-10 h-72 w-72 rounded-full bg-brand-600/10 blur-3xl" />

        <div className="container-app">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-500/10 border border-brand-500/20 px-3 py-1 text-xs font-semibold text-brand-300 mb-3">
                <span className="h-2 w-2 rounded-full bg-brand-400 animate-pulse" />
                Live Showroom Inventory
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Explore Vehicle <span className="gradient-text">Catalog</span>
              </h1>
              <p className="mt-1 text-sm text-surface-400 max-w-xl">
                Browse our curated selection of luxury cars, sedans, SUVs, and electric vehicles.
              </p>
            </div>

            {/* Inventory Quick Stats */}
            <div className="flex items-center gap-4">
              <div className="card p-4 text-center min-w-[120px] bg-surface-900/80">
                <span className="block text-2xl font-bold text-white">
                  {vehicles.length}
                </span>
                <span className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider">
                  Models
                </span>
              </div>
              <div className="card p-4 text-center min-w-[120px] bg-surface-900/80">
                <span className="block text-2xl font-bold text-brand-400">
                  {totalStockCount}
                </span>
                <span className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider">
                  In Stock
                </span>
              </div>
            </div>
          </div>

          {/* Search & Filter Bar (Step 6.3) */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-3 card p-4 bg-surface-900/90 shadow-2xl">
            {/* Search Input */}
            <div className="md:col-span-4 relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search make, model, or category..."
                className="input pl-10"
              />
              <svg
                className="absolute left-3.5 top-3 h-4 w-4 text-surface-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Min Price */}
            <div className="md:col-span-2">
              <input
                type="number"
                min="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Min Price ($)"
                className="input"
              />
            </div>

            {/* Max Price */}
            <div className="md:col-span-2">
              <input
                type="number"
                min="0"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Max Price ($)"
                className="input"
              />
            </div>

            {/* Sort Order */}
            <div className="md:col-span-4 flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="input bg-surface-800"
              >
                <option value="newest">Sort: Newest Arrival</option>
                <option value="price-asc">Sort: Price Low to High</option>
                <option value="price-desc">Sort: Price High to Low</option>
                <option value="stock">Sort: Stock Quantity</option>
              </select>

              {(searchTerm || selectedCategory !== 'All' || minPrice || maxPrice) && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                    setMinPrice('');
                    setMaxPrice('');
                  }}
                  className="btn-ghost py-2.5 px-3 text-xs text-surface-400 hover:text-white shrink-0"
                  title="Reset filters"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Category Pill Chips */}
          <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-900/40'
                    : 'bg-surface-900 border border-surface-800 text-surface-400 hover:bg-surface-800 hover:text-surface-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Vehicle Grid Section */}
      <main className="container-app mt-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="spinner h-10 w-10 border-4 mb-4" />
            <p className="text-sm font-medium text-surface-400">Loading dealership inventory...</p>
          </div>
        ) : isError ? (
          <div className="card p-8 text-center max-w-md mx-auto my-12 border-red-500/30">
            <span className="text-3xl mb-2 block">⚠️</span>
            <h3 className="text-lg font-bold text-white">Failed to Load Inventory</h3>
            <p className="text-xs text-surface-400 mt-1">Please check server connection and try refreshing.</p>
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="card p-12 text-center max-w-lg mx-auto my-12 border-surface-800">
            <svg
              className="mx-auto h-12 w-12 text-surface-500 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <h3 className="text-lg font-bold text-white">No Vehicles Found</h3>
            <p className="text-xs text-surface-400 mt-1">
              No vehicles match your current search criteria or category filter.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setMinPrice('');
                setMaxPrice('');
              }}
              className="btn-outline mt-4 text-xs py-2"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onPurchase={(id) => purchaseMutation.mutate(id)}
                onEdit={(v) => setEditingVehicle(v)}
                onRestock={(v) => setRestockingVehicle(v)}
                onDelete={handleDelete}
                isPurchasing={
                  purchaseMutation.isPending &&
                  purchaseMutation.variables === vehicle.id
                }
              />
            ))}
          </div>
        )}
      </main>

      {/* Admin Add/Edit Vehicle Modal (Step 6.5) */}
      <VehicleModal
        isOpen={isAddModalOpen || !!editingVehicle}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingVehicle(null);
        }}
        initialData={editingVehicle}
        isLoading={addMutation.isPending || updateMutation.isPending}
        onSubmit={async (payload) => {
          if (editingVehicle) {
            await updateMutation.mutateAsync({
              id: editingVehicle.id,
              payload: payload as UpdateVehiclePayload,
            });
          } else {
            await addMutation.mutateAsync(payload as AddVehiclePayload);
          }
        }}
      />

      {/* Admin Restock Modal (Step 6.5) */}
      <RestockModal
        isOpen={!!restockingVehicle}
        vehicle={restockingVehicle}
        onClose={() => setRestockingVehicle(null)}
        isLoading={restockMutation.isPending}
        onSubmit={async (id, amount) => {
          await restockMutation.mutateAsync({ id, amount });
        }}
      />
    </div>
  );
}
