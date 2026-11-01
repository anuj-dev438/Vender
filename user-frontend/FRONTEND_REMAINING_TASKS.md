# COUNTRY DRIVE — FRONTEND REMAINING TASKS & ROADMAP

**Document Purpose**: Tracks remaining frontend roadmap tasks, future backend integrations, and required production configuration.

---

## 1. Current Frontend Implementation Status

- **Existing Backend Capabilities Integrated**: **100% Completed**
- **Customer Pages Implemented**: **14 / 14 Pages**
- **Production Build Status**: **Clean (0 errors, 0 warnings)**
- **Open Frontend Bugs**: **0 Critical, 0 High**

---

## 2. Blocked Features (Awaiting Backend Enhancements)

The following UI components have established frontend boundaries and will connect automatically once backend implements the corresponding endpoints:

| Feature | Missing Backend API | Frontend Prepared Component | Current Fallback |
|---|---|---|---|
| **Server-side Wishlist** | `POST /api/v1/wishlist/:id` | `WishlistPage.jsx`, `useWishlist` | LocalStorage persistence |
| **Server Fare Quote Dry-Run** | `POST /api/v1/bookings/quote` | `CheckoutPage.jsx`, `bookingService` | Client-side fare formula |
| **Notification Settings** | `PATCH /api/v1/notifications/preferences` | `ProfilePage.jsx` (Settings tab) | Default all enabled |
| **Itemized Refund Status** | `GET /api/v1/payments/:id/refunds` | `BookingDetailPage.jsx` (Refund card) | Overall booking cancellation status |
| **Batch Multi-document Upload**| `POST /api/v1/kyc/documents/upload` | `KycPage.jsx` | Sequential document upload |

---

## 3. Required Environment Configuration for Production

Before deploying `Frontend/User/` to production, set the following environment variables in `.env`:

```env
# Backend Base API URL (e.g. production domain or API gateway)
VITE_API_BASE_URL=https://api.countrydrive.in/api/v1

# Razorpay Production / Test Key ID for Checkout Modal
VITE_RAZORPAY_KEY_ID=rzp_live_...

# Google OAuth Client ID for One-Tap / Google Sign-In
VITE_GOOGLE_CLIENT_ID=...apps.googleusercontent.com
```

---

## 4. Recommended Post-Launch Enhancements (V2 Roadmap)

1. **Progressive Web App (PWA)**:
   - Add `manifest.json` and service worker for offline booking ticket caching and install-to-homescreen prompt.
2. **Multi-language Support (i18n)**:
   - Add Hindi and regional language toggles for Tier-2/Tier-3 city adoption.
3. **Turn-by-turn Navigation Integration**:
   - Provide a "Navigate to Pickup Hub" deep-link button opening Google Maps / Apple Maps from the booking confirmation card.
4. **Push Notification Service**:
   - Integrate Web Push / Firebase Cloud Messaging (FCM) for real-time ride reminders and return inspection approval alerts.
