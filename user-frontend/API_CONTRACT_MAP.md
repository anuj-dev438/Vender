# CountryDrive User Frontend — API Contract Map

This document maps all backend REST endpoints to their respective frontend services and UI pages.

## Base URL Configuration
- **Development**: `http://localhost:4000/api/v1` (configured via `VITE_API_BASE_URL` in `.env`)
- **Headers**:
  - `Accept: application/json`
  - `Content-Type: application/json` (omitted for FormData uploads)
  - `Authorization: Bearer <cd_user_token>` (injected automatically when authenticated)

---

## Endpoint Mapping Table

| Domain | Backend Route | Method | Required Role | Frontend Service Function | Consuming UI Pages / Components |
|---|---|---|---|---|---|
| **Health** | `/api/v1/health` | GET | Public | `apiClient.get('/health')` | Diagnostics / System Check |
| **Auth** | `/api/v1/auth/register` | POST | Public | `authService.register` | `AuthModal.jsx` |
| **Auth** | `/api/v1/auth/login` | POST | Public | `authService.login` | `AuthModal.jsx` |
| **Auth** | `/api/v1/auth/me` | GET | Protected | `authService.getMe` | `AuthContext.jsx`, `Navbar.jsx`, `ProfilePage.jsx` |
| **Auth** | `/api/v1/auth/me` | PATCH | Protected | `authService.updateProfile` | `ProfilePage.jsx`, `CheckoutPage.jsx` |
| **Auth** | `/api/v1/auth/change-password` | POST | Protected | `authService.changePassword` | `ProfilePage.jsx` |
| **Auth** | `/api/v1/auth/logout` | POST | Protected | `authService.logout` | `Navbar.jsx` |
| **Auth** | `/api/v1/auth/send-otp` | POST | Public | `authService.sendOtp` | `AuthModal.jsx` |
| **Auth** | `/api/v1/auth/verify-otp` | POST | Public | `authService.verifyOtp` | `AuthModal.jsx` |
| **Auth** | `/api/v1/auth/forgot-password` | POST | Public | `authService.forgotPassword` | `AuthModal.jsx` |
| **Auth** | `/api/v1/auth/reset-password` | POST | Public | `authService.resetPassword` | `AuthModal.jsx` |
| **Vehicles** | `/api/v1/vehicles` | GET | Public | `vehicleService.getVehicles` | `HomePage.jsx`, `VehiclesPage.jsx` |
| **Vehicles** | `/api/v1/vehicles/:id` | GET | Public | `vehicleService.getVehicleById` | `VehicleDetailPage.jsx`, `CheckoutPage.jsx` |
| **Bookings** | `/api/v1/bookings` | POST | CUSTOMER | `bookingService.createBooking` | `CheckoutPage.jsx`, `BookingModal.jsx` |
| **Bookings** | `/api/v1/bookings` | GET | Protected | `bookingService.getBookings` | `MyBookingsPage.jsx` |
| **Bookings** | `/api/v1/bookings/:id` | GET | Protected | `bookingService.getBookingById` | `BookingDetailPage.jsx`, `ActiveRentalPage.jsx` |
| **KYC** | `/api/v1/kyc/status` | GET | CUSTOMER | `kycService.getStatus` | `KycPage.jsx`, `ProfilePage.jsx` |
| **KYC** | `/api/v1/kyc/submit` | POST | CUSTOMER | `kycService.submitKyc` | `KycPage.jsx` |
| **KYC** | `/api/v1/kyc/documents` | POST | CUSTOMER | `kycService.uploadDocument` | `KycPage.jsx` |
| **KYC** | `/api/v1/kyc/documents` | GET | CUSTOMER | `kycService.listDocuments` | `KycPage.jsx` |
| **KYC** | `/api/v1/kyc/documents/:docId` | DELETE | CUSTOMER | `kycService.deleteDocument` | `KycPage.jsx` |
| **KYC** | `/api/v1/kyc/details` | POST | CUSTOMER | `kycService.saveDetails` | `KycPage.jsx`, `CheckoutPage.jsx` |
| **KYC** | `/api/v1/kyc/details` | GET | CUSTOMER | `kycService.getDetails` | `KycPage.jsx`, `ProfilePage.jsx` |
| **KYC** | `/api/v1/kyc/selfie` | POST | CUSTOMER | `kycService.uploadSelfie` | `KycPage.jsx` |
| **KYC** | `/api/v1/kyc/selfie` | GET | CUSTOMER | `kycService.getSelfie` | `KycPage.jsx` |
| **KYC** | `/api/v1/kyc/check-eligibility` | POST | CUSTOMER | `kycService.checkEligibility` | `CheckoutPage.jsx`, `VehicleDetailPage.jsx` |
| **Uploads** | `/api/v1/uploads/presigned-url` | POST | Protected | `uploadService.getPresignedUrl` | `uploadService.uploadFile` |
| **Uploads** | `/api/v1/uploads/view-url` | POST | Protected | `uploadService.getViewUrl` | `VehicleGallery.jsx`, `KycPage.jsx` |

---

## Calculation Rules Matched with Backend

### Rental Pricing Formula (`bookingService.calculateFareQuote` vs Backend `booking.service.ts`)
```js
rentalHours = Math.max(1, Math.ceil((endAt - startAt) / (1000 * 60 * 60)));
baseRentalAmount = rentalHours * hourlyRate;
platformFee = 99; // Facilitation fee
taxAmount = (baseRentalAmount + platformFee) * 0.18; // 18% GST
totalAmount = baseRentalAmount + platformFee + taxAmount;
securityDepositAmount = vehicle.securityDeposit || 3000;
grandTotal = totalAmount + securityDepositAmount;
```
