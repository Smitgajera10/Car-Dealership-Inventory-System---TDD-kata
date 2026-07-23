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
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedMake,
  setSelectedMake,
  stockStatus,
  setStockStatus,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  sortBy,
  setSortBy,
  onReset,
  makesList,
}: SearchFiltersProps) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const categories = ['All', 'Sedan', 'SUV', 'Coupe', 'Luxury', 'Electric', 'Truck', 'Supercar'];

  const hasActiveFilters =
    searchTerm ||
    selectedCategory !== 'All' ||
    selectedMake !== 'All' ||
    stockStatus !== 'All' ||
    minPrice ||
    maxPrice;

  return (
    <div className="space-y-4">
      {/* Mobile Drawer Trigger Button */}
      <div className="flex items-center justify-between lg:hidden">
        <button
          onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
          className="portal-btn-secondary py-2 text-xs flex items-center gap-2"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span>Filters & Search</span>
        </button>

        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-xs text-[#F04438] font-semibold hover:underline"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Main Professional Search Panel */}
      <div
        className={`portal-card p-5 space-y-4 shadow-card-dark ${
          mobileDrawerOpen ? 'block' : 'hidden lg:block'
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Main Search Input */}
          <div className="md:col-span-4 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Make, Model, Category, or VIN..."
              className="portal-input pl-10"
            />
            <svg
              className="absolute left-3.5 top-3 h-4 w-4 text-gray-500"
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

          {/* Make Dropdown */}
          <div className="md:col-span-2">
            <select
              value={selectedMake}
              onChange={(e) => setSelectedMake(e.target.value)}
              className="portal-input"
            >
              <option value="All">All Makes</option>
              {makesList.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Status Dropdown */}
          <div className="md:col-span-2">
            <select
              value={stockStatus}
              onChange={(e) => setStockStatus(e.target.value)}
              className="portal-input"
            >
              <option value="All">All Stock Status</option>
              <option value="InStock">In Stock (&gt;0)</option>
              <option value="LowStock">Low Stock (1-2)</option>
              <option value="OutOfStock">Out of Stock (0)</option>
            </select>
          </div>

          {/* Min & Max Price */}
          <div className="md:col-span-2 flex items-center gap-1.5">
            <input
              type="number"
              min="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="Min $"
              className="portal-input text-xs"
            />
            <span className="text-gray-600 text-xs">-</span>
            <input
              type="number"
              min="0"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Max $"
              className="portal-input text-xs"
            />
          </div>

          {/* Sort Selector & Reset */}
          <div className="md:col-span-2 flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="portal-input text-xs"
            >
              <option value="newest">Sort: Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="stock-desc">Stock: High to Low</option>
              <option value="hp-desc">Power: High HP</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={onReset}
                className="portal-btn-secondary py-2 px-3 text-xs text-gray-400 hover:text-[#F04438] shrink-0"
                title="Reset Filters"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Pill Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-0.5 no-scrollbar">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 mr-1 shrink-0">
            Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-[#6D5DFB] text-white shadow-md shadow-[#6D5DFB]/30'
                  : 'bg-[#0B1020] border border-white/10 text-gray-400 hover:text-white hover:border-white/20'
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
