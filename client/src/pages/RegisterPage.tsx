import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authApi } from '../services/api.service';
import Axios from 'axios';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.register(email.trim(), password);
      if (response.data.success) {
        const { token, user } = response.data.data;
        login(token, user);
        navigate('/dashboard');
      }
    } catch (err: unknown) {
      if (Axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Registration failed.');
      } else {
        setError('An error occurred during registration.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060B18] flex">
      {/* ── LEFT PANEL — branding ───────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center p-12 overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-[#6D5DFB]/12 blur-[100px]" />
          <div className="absolute bottom-1/4 left-1/4 h-[300px] w-[300px] rounded-full bg-[#A78BFA]/8 blur-[80px]" />
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
              backgroundSize: '50px 50px',
            }}
          />
        </div>

        <div className="relative text-center max-w-md">
          <Link to="/" className="inline-flex items-center gap-3 mb-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#6D5DFB] to-[#A78BFA] shadow-xl shadow-[#6D5DFB]/30">
              <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-2xl font-black tracking-tight text-white">
              Auto<span className="text-[#6D5DFB]">Vault</span>
            </span>
          </Link>

          <h2 className="text-4xl font-black tracking-tight text-white leading-tight mb-4">
            Join the network<br />
            <span className="text-[#A78BFA]">of top dealers.</span>
          </h2>
          <p className="text-gray-400 leading-relaxed text-sm">
            Create your account and get instant access to the AutoVault inventory portal. Browse vehicles, make purchases, and track your history.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {['Instant Access', 'Browse Inventory', 'Purchase Vehicles', 'Track History'].map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-gray-300"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL — form ──────────────────────────────── */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center px-6 py-12 bg-[#0B1020]">
        {/* Mobile logo */}
        <Link to="/" className="lg:hidden flex items-center gap-2 mb-10">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#6D5DFB] to-[#A78BFA]">
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-xl font-black text-white">Auto<span className="text-[#6D5DFB]">Vault</span></span>
        </Link>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-black text-white tracking-tight">Create an account</h1>
            <p className="mt-1 text-sm text-gray-400">Get access to the AutoVault portal</p>
          </div>

          {error && (
            <div className="mb-5 flex items-center gap-3 rounded-xl border border-[#F04438]/30 bg-[#F04438]/10 p-3.5 text-sm text-[#F04438] animate-fade-in">
              <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@dealership.com"
                className="portal-input"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="portal-input pr-10"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
                Confirm Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                className="portal-input"
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="portal-btn-primary w-full py-3 text-sm font-bold mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating account…</span>
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-[#6D5DFB] hover:text-[#A78BFA] transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
