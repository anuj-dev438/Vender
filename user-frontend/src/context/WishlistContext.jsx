import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from './ToastContext';

const WishlistContext = createContext(null);
const STORAGE_KEY = 'countrydrive_wishlist_v1';

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.warn('Failed to parse wishlist from local storage', e);
      return [];
    }
  });

  const { showToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
    } catch (e) {
      console.warn('Failed to save wishlist to local storage', e);
    }
  }, [wishlist]);

  const isInWishlist = useCallback(
    (vehicleId) => {
      return wishlist.some((v) => String(v.id) === String(vehicleId));
    },
    [wishlist]
  );

  const toggleWishlist = useCallback(
    (vehicle) => {
      if (!vehicle || !vehicle.id) return;
      const exists = wishlist.some((v) => String(v.id) === String(vehicle.id));
      if (exists) {
        setWishlist((prev) => prev.filter((v) => String(v.id) !== String(vehicle.id)));
        showToast('Removed from Saved Vehicles', 'info');
      } else {
        const item = {
          id: vehicle.id,
          name: vehicle.name,
          image: vehicle.image,
          price: vehicle.price,
          priceUnit: vehicle.priceUnit || 'hour',
          fuel: vehicle.fuel,
          transmission: vehicle.transmission,
          seats: vehicle.seats,
          rating: vehicle.rating,
          type: vehicle.type || vehicle.category,
        };
        setWishlist((prev) => [item, ...prev]);
        showToast('Added to Saved Vehicles ❤️', 'success');
      }
    },
    [wishlist, showToast]
  );

  const removeFromWishlist = useCallback(
    (vehicleId) => {
      setWishlist((prev) => prev.filter((v) => String(v.id) !== String(vehicleId)));
      showToast('Removed from Saved Vehicles', 'info');
    },
    [showToast]
  );

  const clearWishlist = useCallback(() => {
    setWishlist([]);
    showToast('Wishlist cleared', 'info');
  }, [showToast]);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        count: wishlist.length,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
};
