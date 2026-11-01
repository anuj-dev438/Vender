
import React, { useState } from 'react';
import {
  Shield,
  Lock,
  Phone,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

import { authApi } from '../services/authApi.js';
import { clearStoredAuth } from '../services/client.js';

export const LoginView = ({ onLoginSuccess }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const digits = identifier.replace(/\D/g, '');

      const phone = identifier.trim().startsWith('+')
        ? `+${digits}`
        : `+91${digits}`;

      const res = await authApi.login({
        phone,
        password,
      });

      if (!res?.data?.token || !res?.data?.user) {
        throw new Error('Login failed. Token or user missing.');
      }

      // Verify that the logged-in account is actually an Admin.
      await authApi.verifyAdminAccess();

      onLoginSuccess(res.data.user);
    } catch (err) {
      clearStoredAuth();

      console.error('Admin login failed:', err);

      setError(
        err.message ||
        'Login failed. Please check your mobile number and password.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b09] text-white flex items-center justify-center p-4 relative overflow-hidden">

      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-[#00D26A]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#00D26A] to-emerald-600 text-black shadow-lg shadow-[#00D26A]/20 mb-4">
            <Shield size={28} />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white">
            CountryDrive Admin
          </h1>

          <p className="text-sm text-[#8ba398] mt-1">
            Self-Drive Vehicle Marketplace Administration
          </p>

          <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#121e19] border border-[#1c3229] text-xs text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Connected to Backend (Port 4000)</span>
          </div>
        </div>

        <div className="bg-[#0e1713]/90 border border-[#1c3229] rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">

          <form onSubmit={handleSubmit} className="space-y-4">

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#8ba398] uppercase tracking-wider mb-1.5">
                Admin Mobile Number
              </label>

              <div className="relative">
                <Phone
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8ba398]"
                />

                <input
                  type="tel"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter registered mobile number"
                  className="w-full bg-[#121e19] border border-[#1c3229] focus:border-[#00D26A] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#8ba398] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#8ba398] uppercase tracking-wider mb-1.5">
                Password
              </label>

              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8ba398]"
                />

                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-[#121e19] border border-[#1c3229] focus:border-[#00D26A] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#8ba398] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-glossy btn-glossy-emerald py-3 rounded-xl font-bold text-black flex items-center justify-center gap-2 text-sm shadow-lg shadow-[#00D26A]/20 transition-transform active:scale-[0.99] disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Admin Console</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};
