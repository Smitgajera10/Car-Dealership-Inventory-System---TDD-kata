import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authApi } from '../services/api.service';
import Axios from 'axios';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const response = await authApi.login(email.trim(), password);
      if (response.data.success) {
        const { token, user } = response.data.data;
        login(token, user);
        navigate('/');
      }
    } catch (err: unknown) {
      if (Axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Invalid email or password');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-[#0B1020] px-4 py-12 text-[#F3F4F6]">
      {/* Glow accents */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-[#6D5DFB]/15 blur-3xl" />

      <div className="relative sm:mx-auto sm:w-full sm:max-w-md">
        {/* Branding Header */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#6D5DFB] to-[#8B7EFF] shadow-lg shadow-[#6D5DFB]/40">
            <svg
              className="h-8 w-8 text-white"
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
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-white">
            Auto<span className="text-[#6D5DFB]">Vault</span>
          </h2>
          <p className="mt-1.5 text-xs text-gray-400 font-medium">
            Luxury Automotive Dealership Inventory Management Portal
          </p>
        </div>

        {/* Login Form Card */}
        <div className="portal-card mt-8 p-8 shadow-2xl backdrop-blur-xl border-white/10">
          {error && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-[#F04438]/30 bg-[#F04438]/10 p-3.5 text-xs text-[#F04438] animate-fade-in">
              <span className="text-base">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="dealer@autovault.com"
                className="portal-input"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="portal-input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="portal-btn-primary w-full py-3 text-sm font-bold shadow-lg shadow-[#6D5DFB]/30"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </div>
              ) : (
                'Sign In to Portal'
              )}
            </button>
          </form>

          {/* Quick Demo Logins */}
          <div className="mt-6 border-t border-white/10 pt-5">
            <p className="text-center text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2.5">
              Quick Fill Credentials
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@dealership.com', 'AdminPass123!')}
                className="portal-btn-secondary py-2 text-xs hover:border-[#F5A524]/50 hover:text-[#F5A524]"
              >
                🔑 Admin Role
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('buyer@dealership.com', 'UserPass123!')}
                className="portal-btn-secondary py-2 text-xs hover:border-[#16C784]/50 hover:text-[#16C784]"
              >
                👤 User Role
              </button>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-gray-400">
            Need an account?{' '}
            <Link to="/register" className="font-semibold text-[#6D5DFB] hover:underline">
              Register new user
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
