import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export type NavTab = 'inventory' | 'analytics' | 'sales' | 'customers' | 'my-purchases';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  globalSearch: string;
  setGlobalSearch: (q: string) => void;
  onOpenAddModal?: () => void;
}

export function Navbar({
  activeTab,
  setActiveTab,
  globalSearch,
  setGlobalSearch,
  onOpenAddModal,
}: NavbarProps) {
  const { user, isAdmin, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notificationsList = [
    { id: 1, text: '2024 Porsche 911 GT3 purchased by Client #402', time: '10m ago', unread: true },
    { id: 2, text: 'Stock alert: BMW M4 Competition is Low (1 left)', time: '1h ago', unread: true },
    { id: 3, text: 'Admin restocked 5 units of Tesla Model S Plaid', time: '3h ago', unread: false },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0B1020]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#6D5DFB] to-[#8B7EFF] shadow-lg shadow-[#6D5DFB]/30">
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-white">
              Auto<span className="text-[#6D5DFB]">Vault</span>
            </span>
            <span className="hidden md:inline-block ml-2 text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">
              Dealer Portal
            </span>
          </div>
        </div>

        {/* Center: Navigation Tabs — role-based */}
        <nav className="hidden lg:flex items-center gap-1 rounded-xl bg-[#131B2F] p-1 border border-white/10">
          {(isAdmin
            ? (['inventory', 'analytics', 'sales', 'customers'] as const)
            : (['inventory', 'my-purchases'] as const)
          ).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                activeTab === tab
                  ? 'bg-[#6D5DFB] text-white shadow-md shadow-[#6D5DFB]/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab === 'my-purchases' ? 'My Purchases' : tab}
            </button>
          ))}
        </nav>

        {/* Right: Search, Notifications, Admin Add, User Profile */}
        <div className="flex items-center gap-3">
          {/* Global Quick Search Input */}
          <div className="relative hidden sm:block w-48 lg:w-64">
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Global Search (Make, VIN)..."
              className="portal-input py-1.5 pl-9 text-xs"
            />
            <svg
              className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-500"
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

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl border border-white/10 transition-colors"
              title="Notifications"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16C784] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#16C784]"></span>
              </span>
            </button>

            {/* Notifications Popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#131B2F] border border-white/10 p-4 shadow-2xl z-50 animate-slide-up">
                <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                    Dealership Activity
                  </h4>
                  <span className="text-[10px] font-semibold text-[#16C784] bg-[#16C784]/10 border border-[#16C784]/20 px-2 py-0.5 rounded-full">
                    Live
                  </span>
                </div>
                <div className="space-y-2.5">
                  {notificationsList.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-xl bg-[#0B1020] border border-white/5 text-xs flex flex-col gap-1"
                    >
                      <p className="text-gray-200 font-medium">{item.text}</p>
                      <span className="text-[10px] text-gray-500">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Admin Add Vehicle CTA */}
          {isAdmin && onOpenAddModal && (
            <button
              onClick={onOpenAddModal}
              className="portal-btn-primary py-2 text-xs"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">Add Vehicle</span>
            </button>
          )}

          {/* Current User Profile dropdown */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#131B2F] p-1.5 pr-3 hover:border-white/20 transition-all"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#6D5DFB] text-xs font-bold text-white uppercase shadow-md shadow-[#6D5DFB]/30">
                  {user.email.charAt(0)}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-semibold text-gray-200 truncate max-w-[110px]">
                    {user.email.split('@')[0]}
                  </span>
                  <span
                    className={`text-[9px] font-extrabold uppercase tracking-wider ${
                      isAdmin ? 'text-[#F5A524]' : 'text-[#16C784]'
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
                <svg className="h-3.5 w-3.5 text-gray-400 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#131B2F] border border-white/10 p-2 shadow-2xl z-50 animate-slide-up">
                  <div className="p-3 border-b border-white/10 mb-1">
                    <p className="text-xs font-semibold text-white">{user.email}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Role: <span className="font-bold text-[#6D5DFB] uppercase">{user.role}</span></p>
                  </div>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                    }}
                    className="w-full text-left rounded-xl px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
