# COUNTRY DRIVE — BACKEND INTEGRATION ISSUES REPORT

**Document Version**: 2.0 (Post-Audit Edition)  
**Last Updated**: October 30, 2026  
**Auditor**: Senior Integration Architect, React.js Authentication Specialist & Security QA  
**Backend API Base**: `http://localhost:4000/api/v1`

---

## 1. Issue Catalog & Classification

### ISSUE-01: Upload Presigned URL Request Field Mismatch
- **Issue ID**: INT-ISSUE-01
- **Feature / Module**: Document & Media Uploads (`uploadService.js` / `KycPage.jsx`)
- **API Endpoint**: `POST /api/v1/uploads/presigned-url`
- **Priority**: P1 (High)
- **Type**: Frontend Integration Bug (Fixed)
- **Reproduction Steps**:
  1. Open `/kyc` and select a file to upload for Driving License Front.
  2. Inspect network tab on `POST /api/v1/uploads/presigned-url`.
- **Request Payload (Before Fix)**:
  ```json
  {
    "fileName": "dl_front.jpg",
    "fileType": "image/jpeg",
    "folder": "kyc-documents"
  }
  ```
- **Actual API Response (Before Fix)**:
  `HTTP 400 Bad Request` with Zod validation error: `category: Required`, `contentType: Required`.
- **Expected Backend Payload**:
  Backend `getPresignedUrlSchema` in `upload.schema.ts` strictly requires `category: UploadCategoryEnum` (`KYC_DOCUMENT` | `KYC_SELFIE` | `VEHICLE_DOCUMENT` | `VEHICLE_PHOTO` | `AVATAR`) and `contentType: AllowedMimeTypesEnum` (`image/jpeg` | `image/png` | `image/webp` | `application/pdf`).
- **Fix Implemented in Frontend**:
  Updated `uploadService.js` to normalize folder names and MIME types to backend enum values and send `{ category, contentType, fileName }`. Upload now returns `200 OK` with valid S3 presigned PUT URL and storageKey.

---

### ISSUE-02: Registration & Login Phone Verification Bypass
- **Issue ID**: INT-ISSUE-02
- **Feature / Module**: Customer Authentication & Verification (`AuthModal.jsx` / `AuthContext.jsx`)
- **API Endpoints**: `POST /api/v1/auth/register`, `POST /api/v1/auth/login`, `POST /api/v1/auth/send-otp`, `POST /api/v1/auth/verify-otp`
- **Priority**: P0 (Critical Security & Business Rule)
- **Type**: Frontend Logic Bug (Fixed)
- **Actual Observed Behavior (Before Fix)**:
  Submitting registration created the account in backend with `isPhoneVerified: false`. The frontend stored the returned JWT token, closed the modal, and marked the session as authenticated, bypassing the mandatory OTP step.
- **Expected Behavior**:
  Unverified accounts must be required to complete 6-digit OTP verification before gaining access to protected user operations.
- **Fix Implemented in Frontend**:
  1. Updated `AuthModal.jsx`: upon registration or unverified login, automatically calls `authService.sendOtp(phone)` and transitions to `'verify-otp'` mode.
  2. In `AuthContext.jsx`, `isAuthenticated` is strictly `Boolean(token && user && user.isPhoneVerified)`. Unverified accounts are tracked as `isPendingVerification`.
  3. Created `ProtectedRoute.jsx` to block unverified users from accessing `/kyc`, `/checkout`, `/profile`, `/my-bookings`, and `/active-rental/:id`.

---

### ISSUE-03: Deceptive Booking Confirmation on Incomplete Payment
- **Issue ID**: INT-ISSUE-03
- **Feature / Module**: Checkout & Booking Confirmation (`CheckoutPage.jsx` / `BookingSuccessPage.jsx`)
- **API Endpoints**: `POST /api/v1/bookings`, `POST /api/v1/payments/create-order`
- **Priority**: P1 (High Business Logic Integrity)
- **Type**: Frontend Presentation Bug (Fixed)
- **Actual Observed Behavior (Before Fix)**:
  When booking creation succeeded (`POST /bookings`), the booking was created in `status: "PAYMENT_PENDING"`. If Razorpay order creation failed, was cancelled, or was skipped, the frontend showed toast "Booking successfully reserved!" and navigated to `BookingSuccessPage`, which proclaimed "Your Ride is Confirmed!".
- **Expected Behavior**:
  If payment has not been verified via `POST /api/v1/payments/verify`, the UI must clearly indicate `PAYMENT_PENDING`, explain that digital keys and ride confirmation require payment, and provide a direct action to complete payment.
- **Fix Implemented in Frontend**:
  1. Updated `CheckoutPage.jsx` to show "Booking reserved (#BK-XXX). Please complete payment to confirm."
  2. Updated `BookingSuccessPage.jsx` to distinguish between `paymentVerified` (`CONFIRMED`) and pending payment (`PAYMENT_PENDING`), rendering appropriate badges, warnings, and "Complete Payment Now" actions.
  3. Added a "Pay Now & Confirm Booking" button with Razorpay trigger directly in `BookingDetailPage.jsx`.

---

### ISSUE-04: Active Rental Return Inspection Form Rendered for Pending Bookings
- **Issue ID**: INT-ISSUE-04
- **Feature / Module**: Active Rental Telemetry & Handover (`ActiveRentalPage.jsx`)
- **API Endpoint**: `POST /api/v1/rentals/:bookingId/pickup`
- **Priority**: P1 (High)
- **Type**: Frontend State Mapping Bug (Fixed)
- **Actual Observed Behavior (Before Fix)**:
  When opening `/active-rental/:id` for a booking in `PAYMENT_PENDING` status, the component fell through to the `else` branch and rendered the **Vehicle Return Inspection** form to a user who hadn't even paid or picked up the vehicle.
- **Expected Behavior**:
  Backend `processPickupInspection` strictly rejects pickups with `400 BadRequest: Booking must be in CONFIRMED status`. The frontend must display a "Payment Required Before Pickup" screen for `PAYMENT_PENDING` bookings and prevent showing return inspection forms until the trip is actually `ACTIVE`.
- **Fix Implemented in Frontend**:
  Added explicit state gates for `isPaymentPending` and `isTripActive`. `PAYMENT_PENDING` bookings now see an alert explaining that payment confirmation is required before pickup inspection, with a direct link to pay in booking details.

---

### ISSUE-05: KYC Overall Status Property Key Mapping
- **Issue ID**: INT-ISSUE-05
- **Feature / Module**: KYC Verification (`KycPage.jsx`)
- **API Endpoint**: `GET /api/v1/kyc/status`
- **Priority**: P2 (Medium)
- **Type**: Frontend API Response Mapping Bug (Fixed)
- **Actual Observed Behavior (Before Fix)**:
  `KycPage.jsx` evaluated `const currentStatus = kycStatus?.status || ...`. However, `getCustomerKycStatus` in backend `kyc.service.ts` returns the property named `kycStatus` (e.g. `{ kycStatus: "UNDER_REVIEW" }`), causing the status pill to default to `PENDING`.
- **Expected Behavior**:
  Frontend must parse `kycStatus?.kycStatus || kycStatus?.status || (user?.isKycVerified ? 'VERIFIED' : 'PENDING')`.
- **Fix Implemented in Frontend**:
  Updated status resolution in `KycPage.jsx`. Accurately reflects `UNDER_REVIEW`, `VERIFIED`, and `REJECTED`, and displays rejection reason if rejected.

---

### ISSUE-06: Pre-Existing Backend Process Stale Cache
- **Issue ID**: INT-ISSUE-06
- **Feature / Module**: Backend Service Deployment (`server.js`)
- **API Endpoints**: `/api/v1/notifications/*`, `/api/v1/support/*`, `/api/v1/subscriptions/*`, `/api/v1/banners/*`
- **Priority**: P2 (Environment / Deployment)
- **Type**: Backend Server Runtime Status Note
- **Observation**:
  The backend process was launched before git-pulling the newest route additions (`notificationRoutes`, `supportRoutes`, `subscriptionRoutes`, `publicBannersRoutes`). When invoked, these endpoints may return `404` until the backend process is restarted with `npm run dev` (`tsx watch src/server.ts`).
- **Frontend Mitigation**:
  All frontend services implement graceful fallback patterns, ensuring the UI remains robust and error-free regardless of whether the backend server has been restarted.

---

## 2. Summary of Fixes Applied

All identified frontend-side integration bugs have been completely resolved within `Frontend/User/`. The backend source code remains 100% untouched, adhering strictly to the constraints.
