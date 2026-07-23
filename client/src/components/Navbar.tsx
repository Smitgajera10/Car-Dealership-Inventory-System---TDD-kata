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
    id: 'inventory', label: 'Inventory',
    icon: <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
  },
  {
    id: 'analytics', label: 'Analytics',
    icon: <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  },
  {
    id: 'sales', label: 'Sales Ledger',
    icon: <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
  },
];

const userTabs: { id: NavTab; label: string; icon: React.ReactNode }[] = [
  {
    id: 'inventory', label: 'Inventory',
    icon: <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
  },
  {
    id: 'my-purchases', label: 'My Purchases',
    icon: <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
  },
];

export function Navbar({ activeTab, setActiveTab, globalSearch, setGlobalSearch, onOpenAddModal }: NavbarProps) {
  const { user, isAdmin, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = isAdmin ? adminTabs : userTabs;
  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : '??';

  return (
    <header className="sticky top-3 z-40 w-full px-4 sm:px-6 lg:px-8 mb-6">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 rounded-full border border-[#D1EFE0] bg-white/95 px-6 shadow-lg shadow-[#024738]/5 backdrop-blur-xl">

        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#024738] shadow-md shadow-[#024738]/20 transition-transform group-hover:scale-105">
            <svg className="h-5 w-5 text-[#C0F762]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-[#024738] font-sans">
            <span className="text-[#024738] font-light">Auto</span><span className="text-[#059669] font-bold">Vault</span>
          </span>
        </Link>

        {/* Desktop Nav Tabs */}
        <nav className="hidden lg:flex items-center gap-1.5 rounded-full bg-[#F2FAF4] p-1 border border-[#D1EFE0]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-[#024738] text-white shadow-md shadow-[#024738]/20'
                  : 'text-[#47695F] hover:text-[#024738] hover:bg-white'
              }`}
            >
              <span className={activeTab === tab.id ? 'text-[#C0F762]' : 'text-[#6A8D83]'}>
                {tab.icon}
              </span>
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Right Cluster */}
        <div className="flex items-center gap-3">
          {/* Global Search Bar */}
          <div className="relative hidden md:block">
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Search catalog..."
              className="portal-input py-2 pl-9 pr-4 text-xs w-44 lg:w-56 rounded-full bg-[#F7FDF9] border-[#D1EFE0] focus:bg-white"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#47695F] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {globalSearch && (
              <button onClick={() => setGlobalSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                ✕
              </button>
            )}
          </div>

          {/* Admin Add Vehicle Double-Pill Button */}
          {isAdmin && onOpenAddModal && (
            <div className="incubyte-btn-group hidden sm:inline-flex">
              <button
                onClick={onOpenAddModal}
                className="rounded-full bg-[#024738] px-4 py-2 text-xs font-bold text-white shadow-md shadow-[#024738]/20 hover:bg-[#013328] transition-all flex items-center gap-1.5"
              >
                <span>Add Vehicle</span>
              </button>
              <button
                onClick={onOpenAddModal}
                className="rounded-full bg-[#C0F762] p-2 text-[#024738] shadow-md shadow-[#C0F762]/30 hover:scale-105 transition-transform"
                title="Add New Vehicle"
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          )}

          {/* User Profile Menu */}
          {user && (
            <div className="relative">
              <button
                onClick={() => { setShowProfileMenu(!showProfileMenu); setMobileMenuOpen(false); }}
                className="flex items-center gap-2 rounded-full border border-[#D1EFE0] bg-[#F7FDF9] p-1.5 pr-3 hover:border-[#024738] transition-all"
              >
                <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-[#024738] ${isAdmin ? 'bg-[#C0F762]' : 'bg-[#D1EFE0]'}`}>
                  {initials}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold text-[#024738] truncate max-w-[100px]">
                    {user.email.split('@')[0]}
                  </span>
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#059669]">
                    {user.role}
                  </span>
                </div>
                <svg className="h-3.5 w-3.5 text-[#47695F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showProfileMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
                  <div className="absolute right-0 mt-2 w-56 rounded-3xl bg-white border border-[#D1EFE0] p-2 shadow-2xl z-50 animate-slide-up">
                    <div className="p-3 border-b border-[#E8F7ED] mb-1">
                      <p className="text-xs font-bold text-[#024738]">{user.email}</p>
                      <p className="text-[10px] text-[#47695F] mt-0.5">
                        Role: <span className="font-bold text-[#059669] uppercase">{user.role}</span>
                      </p>
                    </div>
                    <button
                      onClick={() => { setShowProfileMenu(false); logout(); }}
                      className="w-full flex items-center gap-2 rounded-2xl px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#024738] hover:bg-[#F2FAF4] rounded-full border border-[#D1EFE0]"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 rounded-3xl border border-[#D1EFE0] bg-white p-4 shadow-xl animate-slide-up">
          <div className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-xs font-bold transition-all ${
                  activeTab === tab.id ? 'bg-[#024738] text-white' : 'text-[#47695F] hover:bg-[#F2FAF4]'
                }`}
              >
                <span className={activeTab === tab.id ? 'text-[#C0F762]' : 'text-[#6A8D83]'}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
            {isAdmin && onOpenAddModal && (
              <button
                onClick={() => { onOpenAddModal(); setMobileMenuOpen(false); }}
                className="w-full portal-btn-lime py-3 text-xs font-bold mt-2"
              >
                Add Vehicle ↗
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
