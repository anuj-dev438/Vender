import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { WishlistProvider } from './context/WishlistContext';

// Common Layout
import Navbar from './components/common/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import VehiclesPage from './pages/VehiclesPage';
import VehicleDetailPage from './pages/VehicleDetailPage';
import BookingPage from './pages/BookingPage';
import CheckoutPage from './pages/CheckoutPage';
import BookingSuccessPage from './pages/BookingSuccessPage';
import MyBookingsPage from './pages/MyBookingsPage';
import BookingDetailPage from './pages/BookingDetailPage';
import ProfilePage from './pages/ProfilePage';
import KycPage from './pages/KycPage';
import ActiveRentalPage from './pages/ActiveRentalPage';
import HowItWorksPage from './pages/HowItWorksPage';
import FaqPage from './pages/FaqPage';
import ContactPage from './pages/ContactPage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import SupportPage from './pages/SupportPage';
import WishlistPage from './pages/WishlistPage';
import NotFoundPage from './pages/NotFoundPage';

// Modals
import SearchModal from './components/SearchModal';
import AuthModal from './components/AuthModal';
import AppModal from './components/AppModal';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function MainLayout() {
  const { authModalOpen, closeAuthModal } = useAuth();
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [appModalOpen, setAppModalOpen] = useState(false);

  return (
    <div className="app-root">
      <ScrollToTop />

      {/* Global Navigation Header */}
      <Navbar
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenAppModal={() => setAppModalOpen(true)}
      />

      {/* Page Content Router */}
      <main className="main-content-flow">
        <Routes>
          <Route path="/" element={<HomePage onOpenAppModal={() => setAppModalOpen(true)} />} />
          <Route path="/vehicles" element={<VehiclesPage />} />
          <Route path="/vehicles/:id" element={<VehicleDetailPage />} />
          <Route path="/vehicles/:vehicleId" element={<VehicleDetailPage />} />
          <Route path="/booking/:vehicleId" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
          <Route path="/booking" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
          <Route path="/booking-success/:id" element={<ProtectedRoute><BookingSuccessPage /></ProtectedRoute>} />
          <Route path="/my-bookings" element={<ProtectedRoute><MyBookingsPage /></ProtectedRoute>} />
          <Route path="/my-bookings/:id" element={<ProtectedRoute><BookingDetailPage /></ProtectedRoute>} />
          <Route path="/active-rental/:id" element={<ProtectedRoute><ActiveRentalPage /></ProtectedRoute>} />
          <Route path="/subscriptions" element={<SubscriptionsPage />} />
          <Route path="/support" element={<ProtectedRoute><SupportPage /></ProtectedRoute>} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/kyc" element={<KycPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/faqs" element={<FaqPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* Global Footer */}
      <Footer onNavClick={(url) => {}} />

      {/* Global Interactive Modals */}
      {searchModalOpen && (
        <SearchModal
          onClose={() => setSearchModalOpen(false)}
          onSelectVehicle={(v) => {
            setSearchModalOpen(false);
            window.location.href = `/vehicles/${v.id}`;
          }}
        />
      )}

      {authModalOpen && (
        <AuthModal onClose={closeAuthModal} />
      )}

      {appModalOpen && (
        <AppModal onClose={() => setAppModalOpen(false)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <WishlistProvider>
            <MainLayout />
          </WishlistProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
