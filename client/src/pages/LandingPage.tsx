import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const features = [
  {
    title: 'Spec before code.',
    desc: 'The thinking happens before a line of code is written, so the build stays on target and rework stays small.',
    badge: 'Spec-driven',
  },
  {
    title: 'Test-first, always.',
    desc: 'A failing test sets the target. Code earns its way in by passing it, not by looking right.',
    badge: 'TDD Rigor',
  },
  {
    title: 'Clean code, by habit.',
    desc: 'We refactor as we go, so the codebase stays fast to work in long after we hand it over.',
    badge: 'Clean Architecture',
  },
];

const stats = [
  { label: 'Vehicles Tracked', value: '10,000+' },
  { label: 'Revenue Processed', value: '$2.4B+' },
  { label: 'Dealer Partners', value: '140+' },
  { label: 'TDD Test Pass Rate', value: '100%' },
];

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-[#F2FAF4] text-[#0A2B23] overflow-x-hidden font-sans">

      <nav className="sticky top-4 z-50 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 rounded-full border border-[#D1EFE0] bg-white/95 px-6 shadow-lg shadow-[#024738]/5 backdrop-blur-xl">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#024738] shadow-md shadow-[#024738]/20 transition-transform group-hover:scale-105">
              <svg className="h-5 w-5 text-[#C0F762]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-[#024738]">
              <span className="text-[#024738] font-light">Auto</span><span className="text-[#059669] font-bold">Vault</span>
            </span>
          </Link>

          {/* Links */}
          <div className="hidden md:flex items-center gap-6 text-xs font-bold text-[#47695F]">
            <span className="hover:text-[#024738] cursor-pointer transition-colors">Services</span>
            <span className="hover:text-[#024738] cursor-pointer transition-colors">About Us</span>
            <span className="hover:text-[#024738] cursor-pointer transition-colors">Resources</span>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="incubyte-btn-group">
                <Link to="/dashboard" className="rounded-full bg-[#024738] px-5 py-2 text-xs font-bold text-white shadow-md shadow-[#024738]/20 hover:bg-[#013328] transition-all">
                  Open Dashboard
                </Link>
                <Link to="/dashboard" className="rounded-full bg-[#C0F762] p-2 text-[#024738] shadow-md shadow-[#C0F762]/30 hover:scale-105 transition-transform">
                  ↗
                </Link>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-xs font-bold text-[#024738] hover:text-[#059669] transition-colors px-3 py-2">
                  Sign In
                </Link>
                <div className="incubyte-btn-group">
                  <Link to="/register" className="rounded-full bg-[#024738] px-5 py-2 text-xs font-bold text-white shadow-md shadow-[#024738]/20 hover:bg-[#013328] transition-all">
                    Talk to Us
                  </Link>
                  <Link to="/register" className="rounded-full bg-[#C0F762] p-2 text-[#024738] shadow-md shadow-[#C0F762]/30 hover:scale-105 transition-transform">
                    ↗
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden pt-20 pb-24 sm:pt-28 sm:pb-32">
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Editorial Title */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold tracking-tight text-[#024738] leading-[1.1] mb-6 animate-fade-in-up">
            The rigor of engineering,
            <br />
            <span className="italic font-normal text-[#059669]">at AI's pace.</span>
          </h1>

          <p className="mx-auto max-w-2xl text-base sm:text-lg text-[#47695F] leading-relaxed font-medium mb-8 animate-fade-in-up animation-delay-150">
            We embed craftsmanship, Test-Driven Development (TDD), and clean architecture into automotive inventory systems that are safe, compliant, and built to last.
          </p>

          {/* Incubyte Badge Chips */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            {['Spec-driven development', 'Test-driven development', 'Continuous delivery'].map((b) => (
              <span key={b} className="inline-flex items-center gap-1.5 rounded-full border border-[#D1EFE0] bg-white px-4 py-1.5 text-xs font-bold text-[#024738] shadow-sm">
                <span className="h-2 w-2 rounded-full bg-[#C0F762] border border-[#A3E635]" />
                {b}
              </span>
            ))}
          </div>

          {/* Double Pill CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animation-delay-300">
            <div className="incubyte-btn-group">
              <Link
                to={isAuthenticated ? '/dashboard' : '/login'}
                className="rounded-full bg-[#024738] px-8 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-[#024738]/25 hover:bg-[#013328] transition-all"
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Talk to an engineer'}
              </Link>
              <Link
                to={isAuthenticated ? '/dashboard' : '/login'}
                className="rounded-full bg-[#C0F762] p-3.5 text-[#024738] font-extrabold shadow-lg shadow-[#C0F762]/40 hover:scale-105 transition-transform"
              >
                ↗
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white border-y border-[#D1EFE0]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-[#024738] mb-3">
              Software is only as good as<br />the team using it.
            </h2>
            <p className="text-sm sm:text-base text-[#47695F] max-w-xl mx-auto font-medium">
              We spent years building the TDD discipline and engineering rigor that amplifies automotive inventory management.
            </p>
          </div>

          {/* 3 Incubyte Cards with Top Right Checkmark */}
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="relative rounded-3xl border border-[#D1EFE0] bg-[#F7FDF9] p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#A3E635]"
              >
                {/* Top Right Green Checkmark Badge */}
                <div className="absolute top-6 right-6 flex h-8 w-8 items-center justify-center rounded-full bg-[#C0F762] text-[#024738] shadow-sm border border-[#A3E635]">
                  <svg className="h-5 w-5 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <span className="inline-block rounded-full bg-[#E8FCC9] text-[#024738] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider border border-[#B2F348] mb-4">
                  {f.badge}
                </span>

                <h3 className="text-2xl font-serif font-bold text-[#024738] mb-3">{f.title}</h3>
                <p className="text-xs sm:text-sm text-[#47695F] leading-relaxed font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS SECTION ───────────────────────────── */}
      <section className="py-16 bg-[#E8F7ED] border-b border-[#D1EFE0]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-4xl sm:text-5xl font-serif font-bold text-[#024738]">{s.value}</div>
                <div className="mt-2 text-xs font-bold text-[#47695F] uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────── */}
      <footer className="border-t border-[#D1EFE0] py-10 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#024738]">
              <svg className="h-4 w-4 text-[#C0F762]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-sm font-bold text-[#024738]">
              Auto<span className="text-[#059669]">Vault</span>
            </span>
          </div>
          <p className="text-xs text-[#5E7E75] font-medium">
            © {new Date().getFullYear()} AutoVault. Car Dealership Inventory System.
          </p>
        </div>
      </footer>
    </div>
  );
}
