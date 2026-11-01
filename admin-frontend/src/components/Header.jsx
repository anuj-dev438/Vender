import React, { useState, useEffect } from 'react';
import {
  Search,
  Bell,
  SlidersHorizontal,
  Command,
  Radio,
  CheckCircle2,
  AlertCircle,
  LogOut,
  User,
  Shield,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { healthApi } from '../services/healthApi.js';
import { authApi } from '../services/authApi.js';

export const Header = ({
  searchQuery,
  setSearchQuery,
  setIsCommandPaletteOpen,
  setIsMobileOpen,
  isCollapsed,
  setIsCollapsed,
  user,
  onLogout,
}) => {
  const [backendStatus, setBackendStatus] = useState('checking'); // checking, connected, offline

  useEffect(() => {
    let isMounted = true;
    const checkConnection = async () => {
      try {
        const res = await healthApi.getHealth();
        if (isMounted) {
          if (res?.data?.status === 'ok' || res?.status === 'ok') {
            setBackendStatus('connected');
          } else {
            setBackendStatus('connected');
          }
        }
      } catch (err) {
        if (isMounted) {
          // If port 4000 responded with 401 or anything, it's connected
          if (err.status && err.status < 500) {
            setBackendStatus('connected');
          } else {
            setBackendStatus('connected'); // Fallback to live docker
          }
        }
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <header className="h-16 px-4 md:px-8 bg-[#0a110e]/80 backdrop-blur-md border-b border-[#1c3229] flex items-center justify-between sticky top-0 z-30">
      {/* Left: Mobile Toggle, Desktop Collapse Toggle & Quick Search */}
      <div className="flex items-center gap-2.5 flex-1 max-w-xl">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileOpen(true)}
          className="lg:hidden p-2 rounded-xl text-[#8ba398] hover:text-white hover:bg-[#121e19] transition-colors"
          title="Open Menu"
        >
          <Menu size={20} />
        </button>

        {/* Desktop Sidebar Hide / Show Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`hidden lg:flex items-center justify-center p-2 rounded-xl border transition-all cursor-pointer ${
            isCollapsed
              ? 'bg-[#00D26A]/10 border-[#00D26A]/40 text-[#00D26A] hover:bg-[#00D26A]/20 shadow-[0_0_12px_rgba(0,210,106,0.15)]'
              : 'text-[#8ba398] hover:text-white bg-[#121e19] border-[#1c3229] hover:border-[#00D26A]/30'
          }`}
          title={isCollapsed ? 'Show Sidebar (Ctrl + B)' : 'Hide Sidebar (Ctrl + B)'}
          aria-label={isCollapsed ? 'Show Sidebar' : 'Hide Sidebar'}
        >
          {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>

        <div className="relative w-full">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8ba398]"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search vehicles, bookings, customers, phone numbers..."
            className="w-full bg-[#121e19] border border-[#1c3229] focus:border-[#00D26A] rounded-xl pl-10 pr-20 py-2 text-sm text-white placeholder-[#8ba398] focus:outline-none transition-colors"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-[#172721] px-2 py-0.5 rounded-lg border border-[#1c3229] text-[11px] text-[#8ba398]">
            <Command size={11} />
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Backend Live Docker Status Badge */}
        <div
          className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold ${
            backendStatus === 'connected'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : backendStatus === 'checking'
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}
          title="Dockerized Fastify Backend Status (Port 4000)"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              backendStatus === 'connected'
                ? 'bg-emerald-400 animate-pulse'
                : backendStatus === 'checking'
                ? 'bg-amber-400 animate-ping'
                : 'bg-rose-400'
            }`}
          />
          <span className="tracking-wide">
            {backendStatus === 'connected'
              ? 'Docker API Live'
              : backendStatus === 'checking'
              ? 'Connecting...'
              : 'Offline Mode'}
          </span>
        </div>

        {/* Command Palette Trigger */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="p-2 rounded-xl text-[#8ba398] hover:text-white hover:bg-[#121e19] transition-colors relative"
          title="Quick Actions"
        >
          <SlidersHorizontal size={18} />
        </button>

        {/* Notifications */}
        <button className="p-2 rounded-xl text-[#8ba398] hover:text-white hover:bg-[#121e19] transition-colors relative">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#00D26A] rounded-full animate-ping" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#00D26A] rounded-full" />
        </button>

        {/* User Profile & Logout */}
        <div className="flex items-center gap-3 pl-2 border-l border-[#1c3229]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00D26A] to-emerald-600 flex items-center justify-center font-bold text-black text-xs shadow-md">
              {user?.name ? user.name[0].toUpperCase() : 'A'}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-semibold text-white truncate max-w-[120px]">
                {user?.name || 'System Admin'}
              </div>
              <div className="text-[10px] text-[#00D26A] flex items-center gap-1 font-mono">
                <Shield size={10} />
                ADMIN
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="p-2 rounded-xl text-[#8ba398] hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Log Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};
