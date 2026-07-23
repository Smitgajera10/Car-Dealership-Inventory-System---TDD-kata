import { useState } from 'react';

interface SearchFiltersProps {
  searchTerm: string;
  setSearchTerm: (s: string) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  selectedMake: string;
  setSelectedMake: (m: string) => void;
  stockStatus: string;
  setStockStatus: (s: string) => void;
  minPrice: string;
  setMinPrice: (p: string) => void;
  maxPrice: string;
  setMaxPrice: (p: string) => void;
  sortBy: string;
  setSortBy: (s: string) => void;
  onReset: () => void;
  makesList: string[];
}

export function SearchFilters({
  searchTerm, setSearchTerm, selectedCategory, setSelectedCategory,
  selectedMake, setSelectedMake, stockStatus, setStockStatus,
  minPrice, setMinPrice, maxPrice, setMaxPrice, sortBy, setSortBy,
  onReset, makesList,
}: SearchFiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const categories = ['All', 'Sedan', 'SUV', 'Coupe', 'Luxury', 'Electric', 'Truck', 'Supercar'];

  const hasActiveFilters =
    searchTerm || selectedCategory !== 'All' || selectedMake !== 'All' ||
    stockStatus !== 'All' || minPrice || maxPrice;

  return (
    <div className="space-y-3">
      {/* Mobile trigger */}
      <div className="flex items-center justify-between lg:hidden">
        <button onClick={() => setMobileOpen(!mobileOpen)} className="portal-btn-secondary py-2 text-xs flex items-center gap-2">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters & Search
          {hasActiveFilters && <span className="flex h-2 w-2 rounded-full bg-[#6D5DFB]" />}
        </button>
        {hasActiveFilters && (
          <button onClick={onReset} className="text-xs text-red-500 font-semibold hover:underline">
            Reset
          </button>
        )}
      </div>

      {/* Main filter panel */}
      <div className={`portal-card p-4 space-y-4 ${mobileOpen ? 'block' : 'hidden lg:block'}`}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search */}
          <div className="md:col-span-4 relative">
            <input
              type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Make, Model, Category…" className="portal-input pl-10"
            />
            <svg className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Make */}
          <div className="md:col-span-2">
            <select value={selectedMake} onChange={(e) => setSelectedMake(e.target.value)} className="portal-input">
              <option value="All">All Makes</option>
              {makesList.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          {/* Stock status */}
          <div className="md:col-span-2">
            <select value={stockStatus} onChange={(e) => setStockStatus(e.target.value)} className="portal-input">
              <option value="All">All Stock</option>
              <option value="InStock">In Stock</option>
              <option value="LowStock">Low Stock (1–2)</option>
              <option value="OutOfStock">Out of Stock</option>
            </select>
          </div>

          {/* Price range */}
          <div className="md:col-span-2 flex items-center gap-1.5">
            <input type="number" min="0" value={minPrice} onChange={(e) => setMinPrice(e.target.value)}
              placeholder="Min $" className="portal-input text-xs" />
            <span className="text-slate-400 text-xs shrink-0">–</span>
            <input type="number" min="0" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Max $" className="portal-input text-xs" />
          </div>

          {/* Sort + Reset */}
          <div className="md:col-span-2 flex items-center gap-2">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="portal-input text-xs">
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="stock-desc">Stock: High → Low</option>
              <option value="hp-desc">Highest HP</option>
            </select>
            {hasActiveFilters && (
              <button onClick={onReset} title="Reset filters"
                className="portal-btn-secondary py-2 px-2.5 text-xs text-slate-400 hover:text-red-500 shrink-0">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Category pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 shrink-0">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-[#6D5DFB] text-white shadow-sm shadow-[#6D5DFB]/30'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
