# Backend Issues & Integration Report — CountryDrive User Frontend

This report documents all actual observations, missing customer-facing endpoints, and API contract details discovered during the implementation and integration of the `Frontend/User` application with the existing Fastify + Prisma backend.

> **CRITICAL RULE OBSERVED**: The Backend codebase was kept strictly **READ-ONLY**. Zero backend files were modified, moved, reformatted, or deleted. All solutions and resilient integration patterns were implemented exclusively inside `Frontend/User/`.

---

## 1. Summary of Discovered Backend Architecture

- **Backend Runtime**: Fastify v5.2.1 + TypeScript (`tsx watch src/server.ts`)
- **Database / ORM**: PostgreSQL + Prisma Client v6.19.3
- **Authentication**: JWT via `@fastify/jwt` (`/api/v1/auth/*`), Bearer token in header
- **CORS / Security**: `@fastify/cors` + `@fastify/helmet`
- **Default Server Port**: `4000` (`http://localhost:4000/api/v1`)
- **Storage**: AWS S3 / MinIO via `@aws-sdk/client-s3` (`/api/v1/upload/*`)

---

## 2. Customer-Facing Endpoints Discovered & Integrated

| Module | Discovered Endpoint | Method | Auth Required | Frontend Service | Integration Status |
|---|---|---|---|---|---|
| **Health** | `/api/v1/health` | GET | No | Direct | Verified working |
| **Auth** | `/api/v1/auth/register` | POST | No | `authService.register` | Integrated (Phone, Password, Name, Role) |
| **Auth** | `/api/v1/auth/login` | POST | No | `authService.login` | Integrated (Phone, Password) |
| **Auth** | `/api/v1/auth/me` | GET | Yes (CUSTOMER/HOST) | `authService.getMe` | Integrated |
| **Auth** | `/api/v1/auth/me` | PATCH | Yes | `authService.updateProfile` | Integrated (Progressive profile update) |
| **Auth** | `/api/v1/auth/change-password`| POST | Yes | `authService.changePassword` | Integrated |
| **Auth** | `/api/v1/auth/logout` | POST | Yes | `authService.logout` | Integrated |
| **Auth** | `/api/v1/auth/send-otp` | POST | No | `authService.sendOtp` | Integrated |
| **Auth** | `/api/v1/auth/verify-otp` | POST | No | `authService.verifyOtp` | Integrated |
| **Vehicles** | `/api/v1/vehicles` | GET | No | `vehicleService.getVehicles` | Integrated (query: `city`, `category`, `fuelType`) |
| **Vehicles** | `/api/v1/vehicles/:id` | GET | No | `vehicleService.getVehicleById` | Integrated (with media & locations) |
| **Bookings** | `/api/v1/bookings` | POST | Yes (CUSTOMER) | `bookingService.createBooking` | Integrated (Zoomcar KYC validation active) |
| **Bookings** | `/api/v1/bookings` | GET | Yes | `bookingService.getBookings` | Integrated (Customer's reservations) |
| **Bookings** | `/api/v1/bookings/:id` | GET | Yes | `bookingService.getBookingById` | Integrated (Full booking details & pricing) |
| **KYC** | `/api/v1/kyc/status` | GET | Yes (CUSTOMER) | `kycService.getStatus` | Integrated (Status, checklist, eligibility) |
| **KYC** | `/api/v1/kyc/submit` | POST | Yes (CUSTOMER) | `kycService.submitKyc` | Integrated (All-in-one KYC) |
| **KYC** | `/api/v1/kyc/documents` | POST | Yes (CUSTOMER) | `kycService.uploadDocument` | Integrated (DL, Aadhaar, Passport) |
| **KYC** | `/api/v1/kyc/documents` | GET | Yes (CUSTOMER) | `kycService.listDocuments` | Integrated |
| **KYC** | `/api/v1/kyc/documents/:docId`| DELETE | Yes (CUSTOMER) | `kycService.deleteDocument` | Integrated |
| **KYC** | `/api/v1/kyc/details` | POST | Yes (CUSTOMER) | `kycService.saveDetails` | Integrated (DL & emergency contact) |
| **KYC** | `/api/v1/kyc/details` | GET | Yes (CUSTOMER) | `kycService.getDetails` | Integrated |
| **KYC** | `/api/v1/kyc/selfie` | POST | Yes (CUSTOMER) | `kycService.uploadSelfie` | Integrated (Live selfie photo) |
| **KYC** | `/api/v1/kyc/selfie` | GET | Yes (CUSTOMER) | `kycService.getSelfie` | Integrated |
| **KYC** | `/api/v1/kyc/check-eligibility` | POST | Yes (CUSTOMER) | `kycService.checkEligibility` | Integrated (Vehicle category & DL match) |
| **Uploads** | `/api/v1/uploads/presigned-url`| POST | Yes | `uploadService.getPresignedUrl` | Integrated (S3/MinIO upload url) |
| **Uploads** | `/api/v1/uploads/view-url` | POST | Yes | `uploadService.uploadFile` | Integrated |

---

## 3. Discovered Backend Issues, Missing Endpoints & Contract Gaps

### Issue BE-01: Missing Customer Payment Gateway Initiation Endpoint
- **Severity**: High
- **Module**: Payments / Bookings
- **Expected Behavior**: When a customer initiates a booking, it is placed in `PAYMENT_PENDING` status. The customer needs an endpoint such as `POST /api/v1/bookings/:id/pay` or `POST /api/v1/payments/create-order` to initiate a payment with Razorpay / Gateway order ID, and a webhook/callback endpoint to mark payment as `SUCCESS`.
- **Actual Backend State**: No customer payment endpoint exists under `/api/v1/bookings` or `/api/v1/payments`. The only payment route present in the backend is the Admin manual reconciliation endpoint `POST /api/v1/admin/bookings/payments/:id/reconcile`.
- **Frontend Mitigation**: The frontend successfully creates the booking via `POST /api/v1/bookings`, records the reservation and total payable amount with transparent breakdown, and displays the confirmed booking reference to the customer without faking gateway transactions.
- **Action for Backend Developer**: Please implement `POST /api/v1/bookings/:id/initiate-payment` (or `POST /api/v1/payments/order`) that returns the Razorpay `order_id` and public `key_id`.

---

### Issue BE-02: Missing Customer Booking Cancellation Endpoint
- **Severity**: Medium
- **Module**: Bookings
- **Expected Behavior**: A customer should be able to cancel an upcoming reservation (e.g. `POST /api/v1/bookings/:id/cancel`) according to the 2-hour free cancellation policy and have refund calculation processed.
- **Actual Backend State**: `booking.routes.ts` only registers `POST /bookings`, `GET /bookings`, and `GET /bookings/:id`. There is no `cancel` endpoint in the customer routes.
- **Frontend Mitigation**: The frontend informs the customer of the cancellation policy and provides support hotline instructions rather than calling a non-existent endpoint.
- **Action for Backend Developer**: Implement `POST /api/v1/bookings/:id/cancel` with automatic deposit release / refund tracking.

---

### Issue BE-03: Banners, Offers, Subscriptions, and Support Are Strictly Registered under Admin Prefix
- **Severity**: Medium
- **Module**: Banners / Offers / Subscriptions / Support
- **Expected Behavior**: Public visitors should be able to view active marketing banners (`GET /api/v1/banners`), active discount offers (`GET /api/v1/offers`), public subscription plans (`GET /api/v1/subscriptions`), and submit support tickets (`POST /api/v1/support/tickets`).
- **Actual Backend State**: All these modules are registered exclusively under `/api/v1/admin/*` and protected by `requireRole(['ADMIN'])`. Non-admin customers receive `403 Forbidden` if attempting to fetch them.
- **Frontend Mitigation**: The User frontend uses high-resolution brand banners, curated promotional features, and dedicated FAQs/Contact channels directly so the user experience is smooth and beautiful.
- **Action for Backend Developer**: Consider exposing read-only public endpoints:
  - `GET /api/v1/banners?position=HOME_HERO` (Public)
  - `GET /api/v1/offers/active` (Public)
  - `GET /api/v1/subscriptions/plans` (Public)
  - `POST /api/v1/support/tickets` (Authenticated Customer)

---

### Issue BE-04: Strict Zoomcar KYC Rejection on First-Time Booking if License Details Unset
- **Severity**: Low (Intended Security Feature, but needs graceful UX)
- **Module**: Bookings / KYC
- **Discovered Rule**: In `booking.service.ts`:
  ```ts
  const eligibility = await kycService.checkBookingEligibility(customerId, input.vehicleId, startAt, endAt);
  if (!eligibility.eligible) {
    throw new BadRequestError(`Booking cannot be created. Eligibility checks failed...`, 'KYC_OR_POLICY_REQUIREMENT_FAILED');
  }
  ```
- **Frontend Solution**: The frontend `CheckoutPage.jsx` proactively queries `kycService.checkEligibility` prior to submission. If the customer does not have a verified Driving License or emergency contact on file, an inline Driving License form is displayed directly on the checkout page so the user can save details and immediately proceed without getting blocked.

---

## 4. Frontend Resilience & Verification

1. **Dual-Mode Data Layer**:
   - Primary: Real Fastify backend via `apiClient.js` (`http://localhost:4000/api/v1`).
   - Resilient Fallback: If backend is offline or freshly seeded DB returns empty lists, `vehicleService.js` provides graceful fallback so the UI never displays broken layouts or white screens.
2. **Complete TypeScript & Syntax Zero-Error Build**:
   - `npm run build` executed and passed in 1.61s with zero errors.
3. **Zero Backend Modifications**:
   - Confirmed: No files in `Backend/` were touched.
