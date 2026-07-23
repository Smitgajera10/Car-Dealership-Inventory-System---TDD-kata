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
    <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-surface-950 px-4 py-12">
      {/* Background glow accents */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-brand-600/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-10 h-80 w-80 rounded-full bg-indigo-600/15 blur-3xl" />

      <div className="relative sm:mx-auto sm:w-full sm:max-w-md">
        {/* Header Branding */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 shadow-xl shadow-brand-900/50">
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
            Welcome to <span className="gradient-text">AutoVault</span>
          </h2>
          <p className="mt-2 text-sm text-surface-400">
            Sign in to access dealership inventory & stock management
          </p>
        </div>

        {/* Form Card */}
        <div className="card mt-8 p-8 shadow-2xl backdrop-blur-xl">
          {error && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300 animate-fade-in">
              <svg className="h-5 w-5 shrink-0 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@dealership.com"
                className="input"
              />
            </div>

            <div>
              <label className="label">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base shadow-brand-900/50"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="spinner h-4 w-4" />
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Quick Demo Logins */}
          <div className="mt-6 border-t border-surface-800 pt-6">
            <p className="text-center text-xs font-semibold uppercase tracking-wider text-surface-400 mb-3">
              Quick Fill Demo Credentials
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@dealership.com', 'AdminPass123!')}
                className="btn-outline py-2 text-xs hover:border-amber-500/50 hover:text-amber-300"
              >
                🔑 Admin Demo
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('buyer@dealership.com', 'UserPass123!')}
                className="btn-outline py-2 text-xs hover:border-brand-500/50 hover:text-brand-300"
              >
                👤 User Demo
              </button>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-surface-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-brand-400 hover:text-brand-300 underline">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
