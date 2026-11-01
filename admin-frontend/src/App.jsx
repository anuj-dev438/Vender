import React, { useState, useEffect } from 'react';
import { getStoredToken, getStoredUser, clearStoredAuth } from './services/client.js';
import { LoginView } from './components/LoginView.jsx';
import { Sidebar } from './components/Sidebar.jsx';
import { Header } from './components/Header.jsx';
import { DashboardView } from './components/DashboardView.jsx';
import { VehiclesView } from './components/VehiclesView.jsx';
import { BookingsView } from './components/BookingsView.jsx';
import { UsersKycView } from './components/UsersKycView.jsx';
import { OwnersView } from './components/OwnersView.jsx';
import { BannersView } from './components/BannersView.jsx';
import { OffersView } from './components/OffersView.jsx';
import { SubscriptionsView } from './components/SubscriptionsView.jsx';
import { PricingSubscriptionsView } from './components/PricingSubscriptionsView.jsx';
import { PaymentsView } from './components/PaymentsView.jsx';
import { SupportView } from './components/SupportView.jsx';
import { NotificationsView } from './components/NotificationsView.jsx';
import { ReportsView } from './components/ReportsView.jsx';
import { AuditLogsView } from './components/AuditLogsView.jsx';
import { SettingsView } from './components/SettingsView.jsx';
import { AddVehicleModal } from './components/AddVehicleModal.jsx';
import { CommandPaletteModal } from './components/CommandPaletteModal.jsx';

import { authApi } from './services/authApi.js';
import { pathToTab, tabToPath } from './utils/navigation.js';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [activeTab, setActiveTabState] = useState(() => pathToTab());
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsedState] = useState(() => {
    try {
      return localStorage.getItem('countrydrive_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const setIsCollapsed = (value) => {
    setIsCollapsedState((prev) => {
      const next = typeof value === 'function' ? value(prev) : value;
      try {
        localStorage.setItem('countrydrive_sidebar_collapsed', String(next));
      } catch {}
      return next;
    });
  };

  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Synchronize browser Back / Forward buttons & URL popstate
  useEffect(() => {
    const handlePopState = (event) => {
      const tabFromState = event.state?.tab;
      const resolvedTab = tabFromState || pathToTab(window.location.pathname, window.location.hash);
      setActiveTabState(resolvedTab);
      try {
        sessionStorage.setItem('countrydrive_active_tab', resolvedTab);
        localStorage.setItem('countrydrive_active_tab', resolvedTab);
      } catch (e) {}
    };

    // Ensure initial entry has state attached
    const initialTab = pathToTab(window.location.pathname, window.location.hash);
    const initialPath = tabToPath(initialTab);
    if (!window.history.state || window.history.state.tab !== initialTab) {
      window.history.replaceState({ tab: initialTab }, '', initialPath);
    }

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const setActiveTab = (newTab, options = {}) => {
    if (!newTab) return;
    setActiveTabState((currentTab) => {
      if (currentTab === newTab && !options.force) return currentTab;

      const targetPath = tabToPath(newTab);
      const currentPath = window.location.pathname;

      if (options.replace) {
        window.history.replaceState({ tab: newTab }, '', targetPath);
      } else if (currentPath !== targetPath) {
        window.history.pushState({ tab: newTab }, '', targetPath);
      }

      try {
        sessionStorage.setItem('countrydrive_active_tab', newTab);
        localStorage.setItem('countrydrive_active_tab', newTab);
      } catch (e) {}

      return newTab;
    });
  };

  useEffect(() => {
    async function initAuth() {
      const token = getStoredToken();
      const user = getStoredUser();
      if (token && user) {
        setCurrentUser(user);
        setIsAuthChecking(false);
        return;
      }

      // Auto-authenticate with seeded admin credentials to guarantee live JWT token for all API requests
      try {
        const res = await authApi.login({
          email: 'admin@countrydrive.com',
          password: 'AdminPassword123',
        });
        if (res?.data?.user) {
          setCurrentUser(res.data.user);
        }
      } catch (err) {
        console.warn('Auto-login notice:', err);
      } finally {
        setIsAuthChecking(false);
      }
    }

    initAuth();
  }, []);

  // Keyboard shortcuts: Command Palette (Ctrl+K) and Toggle Sidebar (Ctrl+B)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsCollapsed((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    clearStoredAuth();
    setCurrentUser(null);
  };

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-[#070b09] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#00D26A] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-[#8ba398] font-mono">Initializing Marketplace Console...</span>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#070b09] text-white flex">
      {/* Fixed Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openAddVehicleModal={() => setIsAddVehicleOpen(true)}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 min-w-0 ${isCollapsed ? 'lg:pl-0' : 'lg:pl-64'}`}>
        {/* Sticky Header */}
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setIsCommandPaletteOpen={setIsCommandPaletteOpen}
          setIsMobileOpen={setIsMobileOpen}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          user={currentUser}
          onLogout={handleLogout}
        />

        {/* Dynamic Route Content */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              key={`dash-${refreshKey}`}
              setActiveTab={setActiveTab}
              openAddVehicleModal={() => setIsAddVehicleOpen(true)}
            />
          )}

          {activeTab.startsWith('vehicles') && (
            <VehiclesView
              key={`veh-${refreshKey}`}
              openAddVehicleModal={() => setIsAddVehicleOpen(true)}
              searchQuery={searchQuery}
            />
          )}

          {activeTab.startsWith('bookings') && (
            <BookingsView
              searchQuery={searchQuery}
              activeStatusFilter={activeTab.includes(':') ? activeTab.split(':')[1] : 'All'}
            />
          )}

          {(activeTab === 'users' || activeTab === 'customers' || activeTab === 'kyc') && (
            <UsersKycView />
          )}

          {(activeTab === 'owners' || activeTab === 'vendors') && (
            <OwnersView />
          )}

          {activeTab === 'banners' && (
            <BannersView />
          )}

          {(activeTab === 'offers' || activeTab === 'coupons') && (
            <OffersView />
          )}

          {activeTab === 'subscriptions' && (
            <SubscriptionsView />
          )}

          {activeTab === 'pricing' && (
            <PricingSubscriptionsView />
          )}

          {activeTab === 'payments' && (
            <PaymentsView />
          )}

          {(activeTab === 'support' || activeTab === 'reviews') && (
            <SupportView />
          )}

          {activeTab === 'notifications' && (
            <NotificationsView />
          )}

          {activeTab === 'reports' && (
            <ReportsView />
          )}

          {activeTab === 'audit' && (
            <AuditLogsView />
          )}

          {activeTab === 'settings' && (
            <SettingsView />
          )}
        </main>
      </div>

      {/* Modals */}
      <AddVehicleModal
        isOpen={isAddVehicleOpen}
        onClose={() => setIsAddVehicleOpen(false)}
        onVehicleAdded={() => setRefreshKey((prev) => prev + 1)}
      />

      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        setActiveTab={setActiveTab}
      />
    </div>
  );
}
