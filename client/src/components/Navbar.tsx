import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  onOpenAddModal?: () => void;
}

export function Navbar({ onOpenAddModal }: NavbarProps) {
  const { user, isAdmin, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-surface-800 bg-surface-950/80 backdrop-blur-md">
      <div className="container-app flex h-16 items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 shadow-lg shadow-brand-900/50">
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
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
              Auto<span className="gradient-text">Vault</span>
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs font-medium text-surface-400">
              Inventory & Purchasing
            </span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* User Badge */}
          {user && (
            <div className="flex items-center gap-2.5 rounded-xl border border-surface-800 bg-surface-900 px-3 py-1.5 text-xs font-medium text-surface-200">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-surface-800 text-xs uppercase text-brand-400 font-bold">
                {user.email.charAt(0)}
              </div>
              <span className="hidden sm:inline-block max-w-[140px] truncate">{user.email}</span>
              <span
                className={`rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase ${
                  isAdmin
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                }`}
              >
                {user.role}
              </span>
            </div>
          )}

          {/* Admin Add Vehicle Button */}
          {isAdmin && onOpenAddModal && (
            <button
              onClick={onOpenAddModal}
              className="btn-primary py-2 text-xs font-semibold shadow-brand-900/50"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>Add Vehicle</span>
            </button>
          )}

          {/* Logout Button */}
          <button
            onClick={logout}
            className="btn-ghost py-2 text-xs text-surface-400 hover:text-red-400 hover:bg-red-500/10"
            title="Sign out"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
