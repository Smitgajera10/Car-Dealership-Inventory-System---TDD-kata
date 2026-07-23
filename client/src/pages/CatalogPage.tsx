import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vehicleApi } from '../services/api.service';
import type { Vehicle, AddVehiclePayload, UpdateVehiclePayload } from '../types';
import { Navbar, type NavTab } from '../components/Navbar';
import { DashboardMetrics } from '../components/DashboardMetrics';
import { SearchFilters } from '../components/SearchFilters';
import { VehicleCard } from '../components/VehicleCard';
import { VehicleModal } from '../components/VehicleModal';
import { RestockModal } from '../components/RestockModal';
import { DeleteModal } from '../components/DeleteModal';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { AnalyticsView } from '../components/AnalyticsView';
import { SalesView } from '../components/SalesView';  
import { CustomersView } from '../components/CustomersView';
import { MyPurchasesView } from '../components/MyPurchasesView';
import { getVehicleSpecs } from '../utils/carHelpers';
import Axios from 'axios';

export default function CatalogPage() {
  const queryClient = useQueryClient();

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<NavTab>('inventory');

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [globalSearch, setGlobalSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedMake, setSelectedMake] = useState<string>('All');
  const [stockStatus, setStockStatus] = useState<string>('All');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [restockingVehicle, setRestockingVehicle] = useState<Vehicle | null>(null);
  const [deletingVehicle, setDeletingVehicle] = useState<Vehicle | null>(null);

  // Toast Notification State
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

  // Extract unique makes for dropdown filter
  const makesList = useMemo(() => {
    const set = new Set<string>();
    vehicles.forEach((v) => set.add(v.make));
    return Array.from(set).sort();
  }, [vehicles]);

  // ── 2. Purchase Mutation ──────────────────────────
  const purchaseMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await vehicleApi.purchase(id);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['my-purchases'] });
      queryClient.invalidateQueries({ queryKey: ['all-purchases'] });
      showNotification(
        `🎉 Purchase Successful! Your order has been processed.`
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

  // ── 3. Add Vehicle Mutation ───────────────────────
  const addMutation = useMutation({
    mutationFn: async (payload: AddVehiclePayload) => {
      const res = await vehicleApi.add(payload);
      return res.data.data;
    },
    onSuccess: (newVehicle) => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      showNotification(`✨ Vehicle Added! ${newVehicle.make} ${newVehicle.model} added to inventory.`);
      setIsAddModalOpen(false);
    },
    onError: (err: unknown) => {
      if (Axios.isAxiosError(err)) {
        throw new Error(err.response?.data?.message || 'Failed to add vehicle');
      }
      throw err;
    },
  });

  // ── 4. Update Vehicle Mutation ─────────────────────
  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateVehiclePayload }) => {
      const res = await vehicleApi.update(id, payload);
      return res.data.data;
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      showNotification(`✏️ Vehicle Updated! ${updated.make} ${updated.model} details updated.`);
      setEditingVehicle(null);
    },
    onError: (err: unknown) => {
      if (Axios.isAxiosError(err)) {
        throw new Error(err.response?.data?.message || 'Failed to update vehicle');
      }
      throw err;
    },
  });

  // ── 5. Restock Mutation ────────────────────────────
  const restockMutation = useMutation({
    mutationFn: async ({ id, amount }: { id: string; amount: number }) => {
      const res = await vehicleApi.restock(id, amount);
      return res.data.data;
    },
    onSuccess: (restocked) => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      showNotification(
        `📦 Inventory Restocked! ${restocked.make} ${restocked.model} stock updated to ${restocked.quantity} units.`
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

  // ── 6. Delete Mutation ─────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await vehicleApi.delete(id);
      return res.data.data;
    },
    onSuccess: (deleted) => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      showNotification(`🗑️ Delete Successful! Removed ${deleted.make} ${deleted.model} from inventory.`);
      setDeletingVehicle(null);
    },
    onError: (err: unknown) => {
      if (Axios.isAxiosError(err)) {
        showNotification(err.response?.data?.message || 'Failed to delete vehicle', 'error');
      }
    },
  });

  const handleResetFilters = () => {
    setSearchTerm('');
    setGlobalSearch('');
    setSelectedCategory('All');
    setSelectedMake('All');
    setStockStatus('All');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('newest');
  };

  // Filter & Sort Logic
  const filteredVehicles = useMemo(() => {
    let result = [...vehicles];

    // Global Search or local search
    const query = (globalSearch || searchTerm).trim().toLowerCase();
    if (query) {
      result = result.filter((v) => {
        const specs = getVehicleSpecs(v);
        return (
          v.make.toLowerCase().includes(query) ||
          v.model.toLowerCase().includes(query) ||
          v.category.toLowerCase().includes(query) ||
          specs.vin.toLowerCase().includes(query)
        );
      });
    }

    // Make Filter
    if (selectedMake !== 'All') {
      result = result.filter((v) => v.make.toLowerCase() === selectedMake.toLowerCase());
    }

    // Category Filter
    if (selectedCategory !== 'All') {
      result = result.filter((v) => v.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Stock Status Filter
    if (stockStatus === 'InStock') {
      result = result.filter((v) => v.quantity > 0);
    } else if (stockStatus === 'LowStock') {
      result = result.filter((v) => v.quantity > 0 && v.quantity <= 2);
    } else if (stockStatus === 'OutOfStock') {
      result = result.filter((v) => v.quantity <= 0);
    }

    // Price Range Filter
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

    // Sort Logic
    result.sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'stock-desc') return b.quantity - a.quantity;
      if (sortBy === 'hp-desc') {
        const hpA = getVehicleSpecs(a).hp;
        const hpB = getVehicleSpecs(b).hp;
        return hpB - hpA;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  }, [vehicles, searchTerm, globalSearch, selectedCategory, selectedMake, stockStatus, minPrice, maxPrice, sortBy]);

  return (
    <div className="min-h-screen bg-[#0B1020] text-[#F3F4F6] pb-24">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        globalSearch={globalSearch}
        setGlobalSearch={setGlobalSearch}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {/* Floating Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-20 z-50 animate-slide-up">
          <div
            className={`flex items-center gap-3 rounded-2xl px-5 py-3.5 text-xs font-semibold shadow-2xl backdrop-blur-md border ${
              notification.type === 'success'
                ? 'bg-[#16C784]/15 text-[#16C784] border-[#16C784]/40 shadow-[#16C784]/20'
                : 'bg-[#F04438]/15 text-[#F04438] border-[#F04438]/40 shadow-[#F04438]/20'
            }`}
          >
            <span>{notification.message}</span>
            <button onClick={() => setNotification(null)} className="text-gray-400 hover:text-white ml-2">
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Container Content Area */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* Render Tab Views */}
        {activeTab === 'analytics' ? (
          <AnalyticsView vehicles={vehicles} />
        ) : activeTab === 'sales' ? (
          <SalesView />
        ) : activeTab === 'customers' ? (
          <CustomersView />
        ) : activeTab === 'my-purchases' ? (
          <MyPurchasesView />
        ) : (
          /* Inventory Tab View */
          <>
            {/* Dashboard Hero Statistics Cards */}
            <DashboardMetrics vehicles={vehicles} isLoading={isLoading} />

            {/* Professional Search & Filters Panel */}
            <SearchFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedMake={selectedMake}
              setSelectedMake={setSelectedMake}
              stockStatus={stockStatus}
              setStockStatus={setStockStatus}
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              sortBy={sortBy}
              setSortBy={setSortBy}
              onReset={handleResetFilters}
              makesList={makesList}
            />

            {/* Vehicle Grid Header */}
            <div className="flex items-center justify-between pt-2">
              <h2 className="text-lg font-extrabold tracking-tight text-white flex items-center gap-2">
                <span>Vehicle Inventory</span>
                <span className="text-xs font-bold text-gray-400 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full">
                  {filteredVehicles.length} Listed
                </span>
              </h2>
            </div>

            {/* Vehicles Grid / Skeleton / Empty State */}
            {isLoading ? (
              /* Skeleton Cards Loader Grid (Desktop 4 col, Laptop 3 col, Tablet 2 col, Mobile 1 col) */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="portal-card overflow-hidden space-y-3 p-4">
                    <div className="skeleton aspect-[16/9] w-full" />
                    <div className="skeleton h-5 w-3/4" />
                    <div className="skeleton h-6 w-1/2" />
                    <div className="skeleton h-12 w-full" />
                    <div className="skeleton h-9 w-full" />
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div className="portal-card p-8 text-center max-w-md mx-auto my-12 border-[#F04438]/30">
                <span className="text-3xl block mb-2">⚠️</span>
                <h3 className="text-base font-bold text-white">Database Connection Failure</h3>
                <p className="text-xs text-gray-400 mt-1">Check backend server running at http://localhost:3000</p>
              </div>
            ) : filteredVehicles.length === 0 ? (
              /* Empty State Illustration */
              <div className="portal-card p-12 text-center max-w-md mx-auto my-12 border-white/10 space-y-3 animate-fade-in">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#6D5DFB]/10 border border-[#6D5DFB]/20 text-[#6D5DFB]">
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white">No Vehicles Match Your Query</h3>
                <p className="text-xs text-gray-400">
                  Try broadening your search term, adjusting price bounds, or resetting category filters.
                </p>
                <button onClick={handleResetFilters} className="portal-btn-secondary text-xs mt-2">
                  Clear All Filters
                </button>
              </div>
            ) : (
              /* Responsive Vehicles Grid: Desktop (4 cols), Laptop (3 cols), Tablet (2 cols), Mobile (1 col) */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredVehicles.map((vehicle) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    onPurchase={(id) => purchaseMutation.mutate(id)}
                    onEdit={(v) => setEditingVehicle(v)}
                    onRestock={(v) => setRestockingVehicle(v)}
                    onDelete={(id) => setDeletingVehicle(vehicles.find((v) => v.id === id) || null)}
                    isPurchasing={
                      purchaseMutation.isPending && purchaseMutation.variables === vehicle.id
                    }
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Floating Action Button (FAB) for Admin */}
      <FloatingActionButton onClick={() => setIsAddModalOpen(true)} />

      {/* Add / Edit Vehicle Modal */}
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

      {/* Restock Inventory Modal */}
      <RestockModal
        isOpen={!!restockingVehicle}
        vehicle={restockingVehicle}
        onClose={() => setRestockingVehicle(null)}
        isLoading={restockMutation.isPending}
        onSubmit={async (id, amount) => {
          await restockMutation.mutateAsync({ id, amount });
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={!!deletingVehicle}
        vehicle={deletingVehicle}
        onClose={() => setDeletingVehicle(null)}
        isLoading={deleteMutation.isPending}
        onConfirm={async (id) => {
          await deleteMutation.mutateAsync(id);
        }}
      />
    </div>
  );
}
