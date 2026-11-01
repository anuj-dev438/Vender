# COUNTRY DRIVE — BACKEND HANDOFF REPORT

**Author**: Senior Full-Stack Integration Architect & QA Engineer  
**Recipient**: Backend Development Team / DevOps  
**Date**: October 30, 2026  
**Subject**: Actionable findings, confirmed issues, reproduction steps, and API enhancements for seamless customer frontend integration.

---

## 1. High-Priority Backend Actions

### ISSUE-BE-01: Running Server Process Needs Restart with TypeScript Runner
- **Severity**: **P0 (Critical Blocker for Newly Pulled Features)**
- **Reproduction**:
  - Run `fetch('http://localhost:4000/api/v1/offers')` or `fetch('http://localhost:4000/api/v1/notifications')`.
  - **Actual Response**: `404 Not Found` (`Route GET:/api/v1/offers not found`).
- **Root Cause**:
  - The currently running background process in the environment was started over 12 hours ago with `npx nodemon server.js`.
  - The latest git pull added `notificationRoutes`, `supportRoutes`, `offerRoutes`, `subscriptionRoutes`, and `publicBannersRoutes` in `src/modules/index.ts`.
  - Because `server.js` was targeting an older build or not watching the TypeScript files under `src/`, the running Fastify instance does not have these routes loaded.
- **Suggested Resolution**:
  - Stop the old nodemon process.
  - Run the official dev script specified in `package.json`:
    ```bash
    npm run dev
    # which executes: tsx watch src/server.ts
    ```
  - This immediately activates all 5 route modules in the live server.
- **Frontend Mitigation**:
  - The frontend services already handle 404 responses gracefully using built-in high-quality fallback cards, so the UI remains 100% stable.

---

### ISSUE-BE-02: Route Ordering in `vehicle.routes.ts` (`/nearby` vs `/:id`)
- **Severity**: **P1 (High)**
- **Reproduction**:
  - `GET /api/v1/vehicles/nearby?lat=19.0760&lng=72.8777&radiusKm=25`
  - In older builds where `/:id` preceded `/nearby`, Fastify matched `:id = "nearby"`, causing Prisma to throw `P2023: Invalid identifier format. Expected a valid UUID in parameters.`
- **Expected Behavior**:
  - Execute `vehicleSearchService.searchNearby(params)` and return vehicles within radius.
- **Current Status in Source**:
  - In `src/modules/vehicles/vehicle.routes.ts`, `/vehicles/nearby` is now placed at line 14, ahead of `/vehicles/:id` at line 85.
  - Once the server process is restarted (ISSUE-BE-01), this issue will be permanently resolved.

---

### ISSUE-BE-03: KYC Schema Flexibility for `licenseExpiry` / `licenseExpiryAt`
- **Severity**: **P2 (Medium)**
- **Reproduction**:
  - `POST /api/v1/kyc/details` with `{ licenseNumber, licenseExpiry: '2030-01-01', dateOfBirth: '1995-01-01', licenseCategories: ['LMV'] }`.
  - **Actual Response**: `400 Bad Request: Validation failed` because `customerKycDetailsSchema` in `kyc.schema.ts` strictly checks `licenseExpiryAt` rather than `licenseExpiry`.
- **Expected Behavior**:
  - Accept either `licenseExpiryAt` or alias `licenseExpiry`.
- **Suggested Resolution**:
  - In `src/modules/kyc/kyc.schema.ts`:
    ```typescript
    licenseExpiryAt: dateStringSchema.or(z.undefined()),
    licenseExpiry: dateStringSchema.optional(),
    ```
- **Frontend Action Taken**:
  - Frontend `kycService.js` and `KycPage.jsx` now send `licenseExpiryAt` matching the backend schema.

---

### ISSUE-BE-04: Razorpay Test Key Configuration in `.env`
- **Severity**: **P2 (Medium)**
- **Reproduction**:
  - `POST /api/v1/payments/create-order` with `{ bookingId: "<valid-uuid>" }`.
  - If `RAZORPAY_KEY_ID` or `RAZORPAY_KEY_SECRET` in `backend/.env` is a dummy placeholder, Razorpay's Node SDK throws authentication errors when generating an order.
- **Suggested Resolution**:
  - Ensure `backend/.env` contains valid Razorpay Sandbox credentials:
    ```env
    RAZORPAY_KEY_ID=rzp_test_...
    RAZORPAY_KEY_SECRET=...
    ```
- **Frontend Mitigation**:
  - `CheckoutPage.jsx` catches Razorpay initialization errors gracefully and reserves the booking in `PAYMENT_PENDING` status for cash/hub settlement.

---

## 2. Missing Backend Requirements (Product Feature Backlog)

The following 6 capabilities are currently missing from the backend and are handled client-side:

### REQ-BE-01: Public Fare Quote Dry-Run Endpoint
- **Current State**: Fare quote is computed client-side in `bookingService.calculateFareQuote()`.
- **Requirement**: Add `POST /api/v1/bookings/quote` taking `{ vehicleId, startAt, endAt, couponCode }` and returning the canonical price breakdown before booking creation.

### REQ-BE-02: User Wishlist / Saved Vehicles Persistence
- **Current State**: Frontend persists shortlisted vehicles in browser `localStorage`.
- **Requirement**: Add a `wishlists` table and endpoints:
  - `GET /api/v1/wishlist` — list saved vehicle IDs.
  - `POST /api/v1/wishlist/:vehicleId` — add to saved.
  - `DELETE /api/v1/wishlist/:vehicleId` — remove from saved.

### REQ-BE-03: User Notification Preferences
- **Current State**: No customer notification channels setting.
- **Requirement**: Add `GET / PATCH /api/v1/notifications/preferences` for toggling SMS, Email, and Push notification channels.

### REQ-BE-04: Itemized Refund & Deposit Release Tracking
- **Current State**: Cancelled bookings show status `CANCELLED`, but refund transactions cannot be queried independently.
- **Requirement**: Add `GET /api/v1/payments/booking/:bookingId/refunds` detailing refund status (`INITIATED`, `PROCESSED`), gateway refund ID, and estimated arrival date.

### REQ-BE-05: Direct Multipart / Batch Document Upload
- **Current State**: Uploads require presigned S3 URLs followed by individual registration calls.
- **Requirement**: Provide a direct `multipart/form-data` endpoint `POST /api/v1/kyc/documents/upload` for uploading DL Front, DL Back, and Aadhaar simultaneously.

### REQ-BE-06: Database Seed for Subscription Plans & Banners
- **Current State**: Fresh database instances lack seed records for active subscription plans and promotional banners.
- **Requirement**: Add default seed records in `prisma/seed.ts` for:
  - 3 subscription plans (Silver, Gold, Platinum).
  - 2 banner positions (`HERO_MAIN`, `FOOTER_BOTTOM`).
