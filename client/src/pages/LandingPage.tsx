import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const features = [
  {
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    title: 'Live Inventory',
    desc: 'Browse, search, and filter the full vehicle catalog in real time — by make, category, price, or stock status.',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: 'One-Click Purchase',
    desc: 'Acquire any available vehicle instantly. Your full purchase history is always one tap away.',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Admin Controls',
    desc: 'Full inventory management — add, edit, restock, or remove vehicles. Sales analytics for admins.',
  },
];

const stats = [
  { label: 'Vehicles Tracked', value: '10,000+' },
  { label: 'Revenue Processed', value: '$2.4B+' },
  { label: 'Dealer Staff', value: '500+' },
  { label: 'Uptime SLA', value: '99.9%' },
];

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">

      {/* ── NAV ─────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#6D5DFB] shadow-md shadow-[#6D5DFB]/25">
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-lg font-extrabold tracking-tight text-slate-900">
              Auto<span className="text-[#6D5DFB]">Vault</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link to="/dashboard" className="portal-btn-primary px-5 py-2 text-sm">
                Open Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-3 py-2">
                  Sign In
                </Link>
                <Link to="/register" className="portal-btn-primary px-5 py-2 text-sm">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white py-24 sm:py-32">
        {/* subtle grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(#6D5DFB 1px,transparent 1px),linear-gradient(90deg,#6D5DFB 1px,transparent 1px)',
            backgroundSize: '56px 56px',
          }}
        />
        {/* purple glow */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-96 w-[600px] rounded-full bg-[#6D5DFB]/8 blur-[80px]" />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#6D5DFB]/25 bg-[#6D5DFB]/8 px-4 py-1.5 text-xs font-semibold text-[#6D5DFB] mb-8 animate-fade-in">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6D5DFB] opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#6D5DFB]" />
            </span>
            Automotive Inventory Management
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-slate-900 leading-[1.05] mb-6 animate-fade-in-up">
            The Premier Platform
            <br />
            <span className="bg-gradient-to-r from-[#6D5DFB] to-[#8B5CF6] bg-clip-text text-transparent">
              for Auto Dealers
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-slate-500 leading-relaxed mb-10 animate-fade-in-up animation-delay-150">
            AutoVault gives your team real-time inventory visibility, seamless purchase processing, and powerful admin controls — all in one secure portal.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animation-delay-300">
            <Link
              to={isAuthenticated ? '/dashboard' : '/login'}
              className="portal-btn-primary px-8 py-3.5 text-base font-bold w-full sm:w-auto"
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Sign In to Portal'}
            </Link>
            {!isAuthenticated && (
              <Link to="/register" className="portal-btn-secondary px-8 py-3.5 text-base font-bold w-full sm:w-auto">
                Create Account
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ── STATS ───────────────────────────────────── */}
      <section className="border-y border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">{s.value}</div>
                <div className="mt-1 text-xs font-semibold text-slate-400 uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────── */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-[#6D5DFB] mb-3">What's Inside</p>
            <h2 className="text-4xl font-black tracking-tight text-slate-900">Everything your dealership needs</h2>
            <p className="mt-4 text-slate-500 max-w-xl mx-auto">
              Built around the actual capabilities of your system — no feature bloat, no mock data.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="group portal-card p-8 hover:border-[#6D5DFB]/50 hover:-translate-y-1 transition-all duration-200 hover:shadow-lg hover:shadow-[#6D5DFB]/10"
              >
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6D5DFB]/10 text-[#6D5DFB] group-hover:bg-[#6D5DFB]/15 transition-colors">
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROLE BREAKDOWN ──────────────────────────── */}
      <section className="py-20 bg-slate-50 border-y border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Buyer */}
            <div className="portal-card p-8 hover:border-emerald-300 transition-colors">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                  <svg className="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Buyer Role</p>
                  <h3 className="text-lg font-bold text-slate-900">For Vehicle Buyers</h3>
                </div>
              </div>
              <ul className="space-y-3">
                {['Browse full vehicle inventory', 'Filter by make, category & price', 'Purchase available vehicles', 'View your personal purchase history'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-slate-600">
                    <svg className="h-4 w-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Admin */}
            <div className="portal-card p-8 hover:border-amber-300 transition-colors">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
                  <svg className="h-5 w-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600">Admin Role</p>
                  <h3 className="text-lg font-bold text-slate-900">For Dealership Staff</h3>
                </div>
              </div>
              <ul className="space-y-3">
                {['Everything buyers can do', 'Add, edit & remove vehicles', 'Restock inventory quantities', 'Review all sales transactions', 'Inventory analytics from real data'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-slate-600">
                    <svg className="h-4 w-4 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────── */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <h2 className="text-4xl font-black tracking-tight text-slate-900 mb-4">
            Ready to access the portal?
          </h2>
          <p className="text-slate-500 mb-8">
            Sign in with your dealership credentials or create a new account to get started.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/login" className="portal-btn-primary px-10 py-3.5 text-base font-bold w-full sm:w-auto">
              Sign In
            </Link>
            <Link to="/register" className="portal-btn-secondary px-10 py-3.5 text-base font-bold w-full sm:w-auto">
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────── */}
      <footer className="border-t border-slate-200 py-8 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#6D5DFB]">
              <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-sm font-bold text-slate-500">
              Auto<span className="text-[#6D5DFB]">Vault</span>
            </span>
          </div>
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} AutoVault. Dealership Inventory Management System.
          </p>
        </div>
      </footer>
    </div>
  );
}
