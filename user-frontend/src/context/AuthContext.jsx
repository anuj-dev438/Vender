import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { getStoredToken, getStoredUser } from '../services/apiClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());
  const [token, setToken] = useState(() => getStoredToken());
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');

  // Sync with backend /auth/me on mount if token exists
  const refreshUser = useCallback(async () => {
    if (!getStoredToken()) {
      setUser(null);
      setLoading(false);
      return null;
    }
    try {
      const liveUser = await authService.getMe();
      setUser(liveUser);
      return liveUser;
    } catch (err) {
      console.warn('Failed to refresh user profile from backend:', err.message);
      // If 401 Unauthorized, clear stale session
      if (err.status === 401) {
        authService.logout();
        setUser(null);
        setToken(null);
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    setUser(data.user);
    setToken(data.token);
    return data;
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    setUser(data.user);
    setToken(data.token);
    return data;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setToken(null);
    setAuthModalOpen(false);
    setAuthModalMode('login');
  };

  const updateProfile = async (profileData) => {
    const updated = await authService.updateProfile(profileData);
    setUser(updated);
    return updated;
  };

  const isPhoneVerified = Boolean(user?.isPhoneVerified);
  const isAuthenticated = Boolean(token && user && isPhoneVerified);
  const isPendingVerification = Boolean(token && user && !isPhoneVerified);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isPhoneVerified,
        isPendingVerification,
        loading,
        login,
        register,
        logout,
        refreshUser,
        updateProfile,
        authModalOpen,
        authModalMode,
        openAuthModal: (mode = 'login') => {
          setAuthModalMode(mode);
          setAuthModalOpen(true);
        },
        closeAuthModal: () => {
          setAuthModalOpen(false);
          setAuthModalMode('login');
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
