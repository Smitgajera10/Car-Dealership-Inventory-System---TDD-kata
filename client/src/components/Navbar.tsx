import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export type NavTab = 'inventory' | 'analytics' | 'sales' | 'my-purchases';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  globalSearch: string;
  setGlobalSearch: (q: string) => void;
  onOpenAddModal?: () => void;
}

const adminTabs: { id: NavTab; label: string; icon: React.ReactNode }[] = [
  {
    id: 'inventory',
    label: 'Inventory',
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    id: 'sales',
    label: 'Sales',
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
];

const userTabs: { id: NavTab; label: string; icon: React.ReactNode }[] = [
  {
    id: 'inventory',
    label: 'Inventory',
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
  {
    id: 'my-purchases',
    label: 'My Purchases',
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
];

export function Navbar({
  activeTab,
  setActiveTab,
  globalSearch,
  setGlobalSearch,
  onOpenAddModal,
}: NavbarProps) {
  const { user, isAdmin, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = isAdmin ? adminTabs : userTabs;

  const initials = user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : '??';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/8 bg-[#0B1020]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

        {/* ── Brand ─────────────────────────────────────────── */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#6D5DFB] to-[#A78BFA] shadow-lg shadow-[#6D5DFB]/25">
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-lg font-extrabold tracking-tight text-white">
            Auto<span className="text-[#6D5DFB]">Vault</span>
          </span>
        </Link>

        {/* ── Desktop Nav Tabs ──────────────────────────────── */}
        <nav className="hidden lg:flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-150 ${
                activeTab === tab.id
                  ? 'bg-[#6D5DFB]/15 text-[#A78BFA] border border-[#6D5DFB]/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className={activeTab === tab.id ? 'text-[#6D5DFB]' : 'text-gray-500'}>
                {tab.icon}
              </span>
              {tab.label}
            </button>
          ))}
        </nav>

        {/* ── Right cluster ─────────────────────────────────── */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative hidden sm:block">
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Search vehicles…"
              className="portal-input py-2 pl-9 pr-4 text-sm w-44 lg:w-56"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {globalSearch && (
              <button
                onClick={() => setGlobalSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Admin: Add Vehicle */}
          {isAdmin && onOpenAddModal && (
            <button
              onClick={onOpenAddModal}
              className="portal-btn-primary py-2 px-3.5 text-sm hidden sm:flex"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden md:inline">Add Vehicle</span>
            </button>
          )}

          {/* User avatar / profile dropdown */}
          {user && (
            <div className="relative">
              <button
                onClick={() => { setShowProfileMenu(!showProfileMenu); setMobileMenuOpen(false); }}
                className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-[#131B2F] px-2.5 py-1.5 hover:border-white/20 transition-all"
              >
                <div className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-white uppercase ${isAdmin ? 'bg-gradient-to-tr from-[#F5A524] to-[#FF9500]' : 'bg-gradient-to-tr from-[#6D5DFB] to-[#A78BFA]'}`}>
                  {initials}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-semibold text-gray-200 leading-tight truncate max-w-[100px]">
                    {user.email.split('@')[0]}
                  </span>
                  <span className={`text-[9px] font-bold uppercase tracking-widest leading-tight ${isAdmin ? 'text-[#F5A524]' : 'text-[#16C784]'}`}>
                    {user.role}
                  </span>
                </div>
                <svg className="h-3.5 w-3.5 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showProfileMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-[#131B2F] border border-white/10 p-1.5 shadow-2xl shadow-black/50 z-50 animate-slide-up">
                    <div className="px-3 py-2.5 border-b border-white/8 mb-1">
                      <p className="text-xs font-semibold text-white truncate">{user.email}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        Role: <span className={`font-bold ${isAdmin ? 'text-[#F5A524]' : 'text-[#16C784]'}`}>{user.role}</span>
                      </p>
                    </div>
                    <button
                      onClick={() => { setShowProfileMenu(false); logout(); }}
                      className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => { setMobileMenuOpen(!mobileMenuOpen); setShowProfileMenu(false); }}
            className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl border border-white/10 transition-colors"
          >
            {mobileMenuOpen ? (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ───────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/8 bg-[#0B1020] px-4 pb-4 pt-3 animate-slide-up">
          {/* Mobile search */}
          <div className="relative mb-3 sm:hidden">
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Search vehicles…"
              className="portal-input py-2.5 pl-9 text-sm"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Mobile tabs */}
          <div className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#6D5DFB]/15 text-[#A78BFA] border border-[#6D5DFB]/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className={activeTab === tab.id ? 'text-[#6D5DFB]' : 'text-gray-500'}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}

            {/* Mobile: Admin add vehicle */}
            {isAdmin && onOpenAddModal && (
              <button
                onClick={() => { onOpenAddModal(); setMobileMenuOpen(false); }}
                className="w-full portal-btn-primary py-3 text-sm mt-2"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Vehicle
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
