import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authApi } from '../services/api.service';
import Axios from 'axios';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password) { setError('Please fill in all fields'); return; }
    setLoading(true);
    try {
      const response = await authApi.login(email.trim(), password);
      if (response.data.success) {
        const { token, user } = response.data.data;
        login(token, user);
        navigate('/dashboard');
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

  return (
    <div className="min-h-screen bg-[#F2FAF4] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md portal-card p-8 bg-white border border-[#D1EFE0] shadow-xl rounded-3xl animate-scale-in">
        
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#024738] shadow-md shadow-[#024738]/20 transition-transform group-hover:scale-105">
              <svg className="h-5 w-5 text-[#C0F762]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-[#024738]">
              <span className="text-[#024738] font-light">Auto</span><span className="text-[#059669] font-bold">Vault</span>
            </span>
          </Link>

          <h1 className="text-3xl font-serif font-bold text-[#024738]">Welcome Back</h1>
          <p className="text-xs text-[#47695F] font-medium mt-1">Sign in to your dealership control center</p>
        </div>

        {error && (
          <div className="mb-5 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-600 font-bold animate-fade-in">
            <span>⚠️</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#47695F] mb-1.5 uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@dealership.com"
              className="portal-input text-xs"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#47695F] mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="portal-input text-xs pr-10"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#47695F] hover:text-[#024738]"
                tabIndex={-1}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-between rounded-full bg-[#024738] px-6 py-3 text-xs font-extrabold text-white shadow-md shadow-[#024738]/25 hover:bg-[#013328] transition-all disabled:opacity-60 mt-2"
          >
            <span>{loading ? 'Signing in...' : 'Sign In to Portal'}</span>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#C0F762] text-[#024738] font-extrabold text-xs">
              ↗
            </span>
          </button>
        </form>

        {/* Demo Accounts */}
        <div className="mt-8 pt-5 border-t border-[#E8F7ED]">
          <p className="text-center text-[10px] font-extrabold uppercase tracking-widest text-[#47695F] mb-3">
            Quick Demo Access
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => { setEmail('admin@dealership.com'); setPassword('AdminPass123!'); setError(null); }}
              className="rounded-full bg-[#E8F7ED] border border-[#D1EFE0] py-2 text-xs font-bold text-[#024738] hover:bg-[#C0F762] transition-colors"
            >
              Admin Credentials
            </button>
            <button
              type="button"
              onClick={() => { setEmail('buyer@dealership.com'); setPassword('UserPass123!'); setError(null); }}
              className="rounded-full bg-[#E8F7ED] border border-[#D1EFE0] py-2 text-xs font-bold text-[#024738] hover:bg-[#C0F762] transition-colors"
            >
              Buyer Credentials
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-[#5E7E75] font-medium">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-[#024738] hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
