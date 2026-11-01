# COUNTRY DRIVE — COMPLETE BACKEND API INVENTORY

**Document Purpose**: Comprehensive, authoritative inventory of all discovered backend endpoints in the unified CountryDrive application.  
**Audited Directory**: `Backend/src/modules/`  
**Backend Framework**: Fastify v5.2.1 + Prisma ORM v6.19.3 + PostgreSQL  
**Base URL**: `http://localhost:4000/api/v1`  
**Classification**: USER-FACING, SHARED, VENDOR-ONLY (Host), ADMIN-ONLY, INTERNAL.

---

## 1. Domain Summary Table

| Domain / Module | Path Prefix | Handlers Count | Classification | Authentication |
|---|---|---|---|---|
| **Health** | `/api/v1/health` | 1 | SHARED | Public |
| **Authentication & Profile** | `/api/v1/auth` | 11 | USER-FACING & SHARED | Mixed (Public + Bearer JWT) |
| **Vehicle Discovery & Host** | `/api/v1/vehicles` | 9 | USER-FACING & VENDOR-ONLY | Mixed (Public + HOST) |
| **Bookings & Extensions** | `/api/v1/bookings` | 8 | USER-FACING & SHARED | Protected (CUSTOMER / HOST / ADMIN) |
| **Payments & Razorpay** | `/api/v1/payments` | 5 | USER-FACING & SHARED | Mixed (Protected + Webhook) |
| **Rentals, Inspections & GPS** | `/api/v1/rentals` | 6 | USER-FACING & SHARED | Protected (CUSTOMER / HOST / ADMIN) |
| **Live Tracking WebSocket** | `ws://.../rentals/:bookingId/track` | 1 | USER-FACING & SHARED | Protected (JWT handshake) |
| **KYC & Verification** | `/api/v1/kyc` | 10 | USER-FACING & SHARED | Protected (CUSTOMER / HOST) |
| **Uploads (S3 / MinIO)** | `/api/v1/uploads` | 2 | SHARED | Protected (CUSTOMER / HOST) |
| **Reviews & Ratings** | `/api/v1/reviews` & `/vehicles/:id/reviews` | 5 | USER-FACING & SHARED | Mixed (Public + Protected) |
| **Notifications** | `/api/v1/notifications` | 4 | USER-FACING & SHARED | Protected (All authenticated) |
| **Support & Disputes** | `/api/v1/support` & `/disputes` | 8 | USER-FACING & SHARED | Protected (CUSTOMER / HOST) |
| **Offers & Coupons** | `/api/v1/offers` & `/coupons` | 3 | USER-FACING | Mixed (Public + Protected) |
| **Subscriptions & Plans** | `/api/v1/subscriptions` | 7 | USER-FACING | Mixed (Public + Protected) |
| **Banners (Promotional)** | `/api/v1/banners` | 2 | USER-FACING | Public |
| **Admin Operations** | `/api/v1/admin/*` | 35+ | ADMIN-ONLY | Protected (ADMIN role only) |

---

## 2. Detailed API Specifications by Domain

### 1. Authentication (`/api/v1/auth`)

#### 1.1 User Registration
- **Endpoint**: `POST /api/v1/auth/register`
- **Controller**: `authController.register`
- **Classification**: USER-FACING
- **Auth**: Public
- **Request Body**:
  ```json
  {
    "phone": "+919876543210", // regex /^\+?[0-9]{10,15}$/
    "password": "Password123!", // Min 8, uppercase, lowercase, number, special char
    "name": "Sudhir Kumar", // Optional, 2-150 chars
    "email": "user@example.com", // Optional, valid email
    "role": "CUSTOMER" // CUSTOMER or HOST (ADMIN strictly forbidden)
  }
  ```
- **Response**: `201 Created` with JWT token, user record (`id`, `phone`, `name`, `email`, `role`, `status`).

#### 1.2 User Login
- **Endpoint**: `POST /api/v1/auth/login`
- **Controller**: `authController.login`
- **Classification**: USER-FACING
- **Auth**: Public (Rate-limited: 5 attempts/15 min)
- **Request Body**:
  ```json
  {
    "phone": "+919876543210",
    "password": "Password123!"
  }
  ```
- **Response**: `200 OK` with JWT token, refreshToken, user profile.

#### 1.3 Google Authentication
- **Endpoint**: `POST /api/v1/auth/google`
- **Controller**: `authController.google`
- **Classification**: USER-FACING
- **Auth**: Public
- **Request Body**:
  ```json
  {
    "idToken": "google_oauth_id_token",
    "role": "CUSTOMER"
  }
  ```
- **Response**: `200 OK` with JWT token and profile.

#### 1.4 Get Current User Profile (`/auth/me`)
- **Endpoint**: `GET /api/v1/auth/me`
- **Controller**: `authController.me`
- **Classification**: USER-FACING
- **Auth**: Bearer JWT (`CUSTOMER`, `HOST`, `ADMIN`)
- **Response**: `200 OK` with full user details, `customerProfile`, `ownerProfile`, and `kycStatus`.

#### 1.5 Update Current User Profile (`/auth/me`)
- **Endpoint**: `PATCH /api/v1/auth/me`
- **Controller**: `authController.updateProfile`
- **Classification**: USER-FACING
- **Auth**: Bearer JWT
- **Request Body**:
  ```json
  {
    "name": "Sudhir Kumar",
    "email": "sudhir@example.com",
    "gender": "MALE",
    "avatarUrl": "https://...",
    "dateOfBirth": "1995-05-15T00:00:00Z",
    "customerProfile": {
      "licenseNumber": "DL-1420110012345",
      "emergencyName": "Ramesh",
      "emergencyPhone": "+919876543211",
      "emergencyRelation": "Brother",
      "preferredLanguage": "English"
    }
  }
  ```
- **Response**: `200 OK` with updated profile.

#### 1.6 Change Password
- **Endpoint**: `POST /api/v1/auth/change-password`
- **Controller**: `authController.changePassword`
- **Classification**: USER-FACING
- **Auth**: Bearer JWT
- **Request Body**:
  ```json
  {
    "currentPassword": "OldPassword123!",
    "newPassword": "NewPassword456!"
  }
  ```
- **Response**: `200 OK`.

#### 1.7 Logout
- **Endpoint**: `POST /api/v1/auth/logout`
- **Controller**: `authController.logout`
- **Classification**: USER-FACING
- **Auth**: Bearer JWT
- **Response**: `200 OK`.

#### 1.8 OTP Endpoints
- **Endpoints**:
  - `POST /api/v1/auth/send-otp` (Body: `{ "phone": "+91..." }`)
  - `POST /api/v1/auth/verify-otp` (Body: `{ "phone": "+91...", "otp": "123456" }`)
  - `POST /api/v1/auth/forgot-password` (Body: `{ "phone": "+91..." }`)
  - `POST /api/v1/auth/reset-password` (Body: `{ "phone": "+91...", "otp": "123456", "newPassword": "..." }`)
- **Classification**: USER-FACING (Public, Rate-limited)

---

### 2. Vehicle Discovery & Listings (`/api/v1/vehicles`)

#### 2.1 Standard Vehicle Search
- **Endpoint**: `GET /api/v1/vehicles`
- **Classification**: USER-FACING
- **Auth**: Public
- **Query Parameters**:
  - `city` (string, case-insensitive)
  - `category` (enum: `HATCHBACK`, `SEDAN`, `SUV`, `SCOOTY`, `MOTORBIKE`, `LUXURY`, `OTHER`)
  - `fuelType` (enum: `PETROL`, `DIESEL`, `EV`, `HYBRID`, `CNG`)
- **Response**: `200 OK` array of vehicles matching criteria with status `AVAILABLE` and media.

#### 2.2 PostGIS Nearby Geolocation Vehicle Search
- **Endpoint**: `GET /api/v1/vehicles/nearby`
- **Classification**: USER-FACING
- **Auth**: Public
- **Query Parameters**:
  - `lat` (number, -90 to 90, required)
  - `lng` (number, -180 to 180, required)
  - `radiusKm` (number, 1 to 50, default 5)
  - `category` (optional enum)
  - `fuelType` (optional enum)
  - `startDate` (ISO datetime)
  - `endDate` (ISO datetime)
  - `page` (number, default 1)
  - `limit` (number, default 20)
  - `sortBy` (`distance`, `price`, `rating`)
- **Response**: `200 OK` array of nearby vehicles with calculated distance in km and host info.

#### 2.3 Vehicle Details by ID
- **Endpoint**: `GET /api/v1/vehicles/:id`
- **Classification**: USER-FACING
- **Auth**: Public
- **URL Param**: `id` (UUID)
- **Response**: `200 OK` with complete vehicle specifications, media gallery, location coordinates, pricing rates, and features.

#### 2.4 Host Vehicle Management (Vendor-Only)
- `GET /api/v1/vehicles/my-listings` (HOST role)
- `POST /api/v1/vehicles` (HOST role)
- `PATCH /api/v1/vehicles/:id` (HOST role)
- `POST /api/v1/vehicles/:id/documents` (HOST role)
- `GET /api/v1/vehicles/:id/documents` (HOST role)
- `DELETE /api/v1/vehicles/:id/documents/:docId` (HOST role)
- `POST /api/v1/vehicles/:id/photos` (HOST role)
- `DELETE /api/v1/vehicles/:id/photos/:photoId` (HOST role)
- **Classification**: VENDOR-ONLY (Not exposed in Customer UI).

---

### 3. Bookings & Extensions (`/api/v1/bookings`)

#### 3.1 Create Booking
- **Endpoint**: `POST /api/v1/bookings`
- **Controller**: `bookingController.create`
- **Classification**: USER-FACING
- **Auth**: Bearer JWT (`CUSTOMER`)
- **Request Body**:
  ```json
  {
    "vehicleId": "uuid-here",
    "startAt": "2026-11-01T10:00:00.000Z",
    "endAt": "2026-11-03T18:00:00.000Z",
    "planType": "PAY_AS_YOU_GO", // or SUBSCRIPTION
    "couponCode": "WELCOME500", // Optional
    "pickupLocationId": "uuid-optional",
    "returnLocationId": "uuid-optional"
  }
  ```
- **Business Validations**:
  - Customer KYC verification status checked (must have verified DL).
  - Vehicle status must be `AVAILABLE`.
  - Vehicle availability calendar validated for collision.
  - Initial booking created in `PAYMENT_PENDING` status.
- **Response**: `201 Created` with booking ID, pricing breakdown, and initial status.

#### 3.2 List Customer Bookings
- **Endpoint**: `GET /api/v1/bookings`
- **Controller**: `bookingController.list`
- **Classification**: USER-FACING
- **Auth**: Bearer JWT
- **Response**: `200 OK` with list of bookings, including associated vehicle, payments, and rental inspection status.

#### 3.3 Get Booking Details
- **Endpoint**: `GET /api/v1/bookings/:id`
- **Controller**: `bookingController.getById`
- **Classification**: USER-FACING
- **Auth**: Bearer JWT
- **Response**: `200 OK` with full details including financial ledger, rental session, extension history, and host contact.

#### 3.4 Get Cancellation Fee & Refund Quote
- **Endpoint**: `GET /api/v1/bookings/:id/cancellation-quote`
- **Controller**: `bookingController.getCancellationQuote`
- **Classification**: USER-FACING
- **Auth**: Bearer JWT
- **Response**:
  ```json
  {
    "bookingId": "uuid",
    "totalPaid": 4500,
    "cancellationFee": 500,
    "refundableAmount": 4000,
    "securityDepositRefund": 3000,
    "hoursBeforeStart": 48,
    "policyTier": "FREE_OR_TIER_1"
  }
  ```

#### 3.5 Confirm Cancellation
- **Endpoint**: `POST /api/v1/bookings/:id/cancel`
- **Controller**: `bookingController.cancel`
- **Classification**: USER-FACING
- **Auth**: Bearer JWT
- **Request Body**:
  ```json
  {
    "reason": "Plans changed",
    "reasonCode": "CUSTOMER_REQUEST"
  }
  ```
- **Response**: `200 OK` with status transitioned to `CANCELLED` and refund processed.

#### 3.6 Request Booking Extension
- **Endpoint**: `POST /api/v1/bookings/:id/request-extension`
- **Controller**: `bookingController.requestExtension`
- **Classification**: USER-FACING
- **Auth**: Bearer JWT (`CUSTOMER`)
- **Request Body**:
  ```json
  {
    "newEndAt": "2026-11-04T12:00:00.000Z"
  }
  ```
- **Response**: `201 Created` with extension ID, extra fare calculated, and Razorpay Order details.

#### 3.7 Verify Extension Payment
- **Endpoint**: `POST /api/v1/bookings/extensions/verify-payment`
- **Controller**: `bookingController.verifyExtensionPayment`
- **Classification**: USER-FACING
- **Auth**: Bearer JWT (`CUSTOMER`)
- **Request Body**:
  ```json
  {
    "extensionId": "uuid",
    "razorpayOrderId": "order_xyz",
    "razorpayPaymentId": "pay_xyz",
    "razorpaySignature": "sig_xyz"
  }
  ```
- **Response**: `200 OK` confirming new return time applied to booking.

#### 3.8 Get Extension Details
- **Endpoint**: `GET /api/v1/bookings/extensions/:extensionId`
- **Controller**: `bookingController.getExtension`
- **Classification**: USER-FACING
- **Auth**: Bearer JWT

---

### 4. Payments (`/api/v1/payments`)

#### 4.1 Create Razorpay Order
- **Endpoint**: `POST /api/v1/payments/create-order`
- **Controller**: `paymentsController.createOrder`
- **Classification**: USER-FACING
- **Auth**: Bearer JWT
- **Request Body**:
  ```json
  {
    "bookingId": "uuid-here"
  }
  ```
- **Response**:
  ```json
  {
    "orderId": "order_xyz123",
    "amount": 545000, // paise
    "currency": "INR",
    "keyId": "rzp_test_xyz"
  }
  ```

#### 4.2 Verify Razorpay Payment
- **Endpoint**: `POST /api/v1/payments/verify`
- **Controller**: `paymentsController.verifyPayment`
- **Classification**: USER-FACING
- **Auth**: Bearer JWT
- **Request Body**:
  ```json
  {
    "bookingId": "uuid-here",
    "razorpayOrderId": "order_xyz123",
    "razorpayPaymentId": "pay_abc456",
    "razorpaySignature": "hex_signature"
  }
  ```
- **Response**: `200 OK` transitions booking from `PAYMENT_PENDING` to `CONFIRMED`.

#### 4.3 Get Booking Payment Status
- **Endpoint**: `GET /api/v1/payments/booking/:bookingId`
- **Controller**: `paymentsController.getByBookingId`
- **Classification**: USER-FACING
- **Auth**: Bearer JWT
- **Response**: `200 OK` with transactions, security deposit status, and refund history.

#### 4.4 Get Payment Details by ID
- **Endpoint**: `GET /api/v1/payments/:id`
- **Controller**: `paymentsController.getById`
- **Classification**: USER-FACING
- **Auth**: Bearer JWT

#### 4.5 Razorpay Webhook
- **Endpoint**: `POST /api/v1/payments/webhook`
- **Classification**: INTERNAL (Gateway callback)

---

### 5. Rentals, Inspections & GPS Tracking (`/api/v1/rentals`)

#### 5.1 Pickup Inspection
- **Endpoint**: `POST /api/v1/rentals/:bookingId/pickup`
- **Controller**: `rentalsController.pickup`
- **Classification**: USER-FACING / SHARED
- **Auth**: Bearer JWT
- **Request Body**:
  ```json
  {
    "odometerReading": 35420,
    "fuelLevel": 90,
    "batteryLevel": 100,
    "photos": [
      { "category": "FRONT", "fileUrl": "https://..." },
      { "category": "REAR", "fileUrl": "https://..." },
      { "category": "LEFT", "fileUrl": "https://..." },
      { "category": "RIGHT", "fileUrl": "https://..." },
      { "category": "INTERIOR_DASHBOARD", "fileUrl": "https://..." },
      { "category": "INTERIOR_SEATS", "fileUrl": "https://..." }
    ],
    "notes": "Vehicle in pristine condition"
  }
  ```
- **Response**: `200 OK` with rental session activated and booking status `ACTIVE`.

#### 5.2 Return Inspection
- **Endpoint**: `POST /api/v1/rentals/:bookingId/return`
- **Controller**: `rentalsController.return`
- **Classification**: USER-FACING / SHARED
- **Auth**: Bearer JWT
- **Request Body**:
  ```json
  {
    "odometerReading": 35780,
    "fuelLevel": 85,
    "photos": [...],
    "damages": [
      {
        "damageType": "SCRATCH",
        "severity": "MINOR",
        "description": "Minor bumper scratch",
        "estimatedCost": 500,
        "photoUrls": ["https://..."]
      }
    ],
    "notes": "Trip ended smoothly"
  }
  ```
- **Response**: `200 OK` with trip finalized, excess km calculated, deposit settlement initiated.

#### 5.3 Get Rental Session Details
- **Endpoint**: `GET /api/v1/rentals/:bookingId`
- **Controller**: `rentalsController.getDetails`
- **Classification**: USER-FACING
- **Auth**: Bearer JWT
- **Response**: Full rental timeline, start & end inspections, damage ledger, and settlement.

#### 5.4 Submit GPS Update
- **Endpoint**: `POST /api/v1/rentals/:bookingId/gps/update`
- **Classification**: USER-FACING / HARDWARE
- **Auth**: Bearer JWT (Rate-limited: 12/min)
- **Request Body**:
  ```json
  {
    "latitude": 12.9716,
    "longitude": 77.5946,
    "speed": 45.2,
    "heading": 180,
    "accuracy": 5.0
  }
  ```

#### 5.5 Get Latest GPS Location
- **Endpoint**: `GET /api/v1/rentals/:bookingId/gps/latest`
- **Classification**: USER-FACING
- **Auth**: Bearer JWT
- **Response**: `{ latitude, longitude, speed, heading, accuracy, recordedAt }`.

#### 5.6 Get GPS Location History
- **Endpoint**: `GET /api/v1/rentals/:bookingId/gps/history`
- **Classification**: USER-FACING
- **Auth**: Bearer JWT
- **Query Params**: `startTime`, `endTime`, `limit`.

#### 5.7 Live WebSocket Tracking
- **Protocol**: `ws://` / `wss://`
- **Path**: `/api/v1/rentals/:bookingId/track`
- **Classification**: USER-FACING
- **Authentication**: First message `{ "type": "AUTH", "token": "<jwt>" }`
- **Events**: Receives `{ "type": "LOCATION_UPDATE", "data": { ... } }` in real-time.

---

### 6. KYC & Identity Verification (`/api/v1/kyc`)

#### 6.1 Check KYC Status & Eligibility
- **Endpoint**: `GET /api/v1/kyc/status`
- **Classification**: USER-FACING
- **Auth**: Bearer JWT
- **Response**: Verification state (`PENDING`, `SUBMITTED`, `UNDER_REVIEW`, `VERIFIED`, `REJECTED`), checklist, and booking eligibility flags.

#### 6.2 All-In-One KYC Submit
- **Endpoint**: `POST /api/v1/kyc/submit`
- **Classification**: USER-FACING
- **Auth**: Bearer JWT

#### 6.3 Upload Document
- **Endpoint**: `POST /api/v1/kyc/documents`
- **Classification**: USER-FACING
- **Auth**: Bearer JWT
- **Request Body**:
  ```json
  {
    "documentType": "DRIVING_LICENSE_FRONT", // or AADHAAR_FRONT, etc.
    "fileUrl": "https://...",
    "storageKey": "kyc/..."
  }
  ```

#### 6.4 List Uploaded Documents
- **Endpoint**: `GET /api/v1/kyc/documents`
- **Classification**: USER-FACING
- **Auth**: Bearer JWT

#### 6.5 Delete Document
- **Endpoint**: `DELETE /api/v1/kyc/documents/:docId`
- **Classification**: USER-FACING
- **Auth**: Bearer JWT

#### 6.6 Save DL & Personal Details
- **Endpoint**: `POST /api/v1/kyc/details`
- **Classification**: USER-FACING
- **Auth**: Bearer JWT

#### 6.7 Get Saved Details
- **Endpoint**: `GET /api/v1/kyc/details`
- **Classification**: USER-FACING
- **Auth**: Bearer JWT

#### 6.8 Upload Live Selfie
- **Endpoint**: `POST /api/v1/kyc/selfie`
- **Classification**: USER-FACING
- **Auth**: Bearer JWT

#### 6.9 Get Live Selfie Status
- **Endpoint**: `GET /api/v1/kyc/selfie`
- **Classification**: USER-FACING
- **Auth**: Bearer JWT

#### 6.10 Check Vehicle Eligibility
- **Endpoint**: `POST /api/v1/kyc/check-eligibility`
- **Classification**: USER-FACING
- **Auth**: Bearer JWT
- **Request Body**:
  ```json
  {
    "vehicleCategory": "SUV"
  }
  ```

---

### 7. Reviews & Ratings (`/api/v1/reviews`)

#### 7.1 Submit Rental Review
- **Endpoint**: `POST /api/v1/rentals/:bookingId/reviews`
- **Controller**: `reviewsController.submit`
- **Classification**: USER-FACING
- **Auth**: Bearer JWT (`CUSTOMER`)
- **Request Body**:
  ```json
  {
    "rating": 5, // 1 to 5 integer
    "title": "Smooth ride!",
    "comment": "Car was super clean and host was punctual."
  }
  ```
- **Response**: `201 Created` review record with status `PUBLISHED`.

#### 7.2 Get Rental Review for Booking
- **Endpoint**: `GET /api/v1/rentals/:bookingId/reviews`
- **Controller**: `reviewsController.getByBooking`
- **Classification**: USER-FACING
- **Auth**: Bearer JWT

#### 7.3 Get Public Vehicle Reviews
- **Endpoint**: `GET /api/v1/vehicles/:vehicleId/reviews`
- **Controller**: `reviewsController.getByVehicle`
- **Classification**: USER-FACING
- **Auth**: Public
- **Query Params**: `page`, `limit`, `rating`
- **Response**: Paginated list of verified customer reviews + aggregate stats (`averageRating`, `totalReviews`, rating breakdown 1-5).

---

### 8. Notifications (`/api/v1/notifications`)

#### 8.1 List User Notifications
- **Endpoint**: `GET /api/v1/notifications`
- **Classification**: USER-FACING
- **Auth**: Bearer JWT
- **Query Params**: `page`, `limit`, `unreadOnly`
- **Response**: Array of notifications with title, message, type, isRead, link, timestamp.

#### 8.2 Get Unread Count
- **Endpoint**: `GET /api/v1/notifications/unread-count`
- **Classification**: USER-FACING
- **Auth**: Bearer JWT
- **Response**: `{ "unreadCount": 3 }`.

#### 8.3 Mark Notification as Read
- **Endpoint**: `PATCH /api/v1/notifications/:id/read`
- **Classification**: USER-FACING
- **Auth**: Bearer JWT

#### 8.4 Mark All Notifications as Read
- **Endpoint**: `PATCH /api/v1/notifications/read-all`
- **Classification**: USER-FACING
- **Auth**: Bearer JWT

---

### 9. Support & Disputes (`/api/v1/support` & `/disputes`)

#### 9.1 Create Support Ticket
- **Endpoint**: `POST /api/v1/support/tickets`
- **Classification**: USER-FACING
- **Auth**: Bearer JWT
- **Request Body**:
  ```json
  {
    "category": "BOOKING",
    "subject": "Delay in vehicle handover",
    "description": "Host was not available at pickup time.",
    "bookingId": "uuid-optional",
    "priority": "MEDIUM"
  }
  ```

#### 9.2 List My Support Tickets
- **Endpoint**: `GET /api/v1/support/tickets`
- **Classification**: USER-FACING
- **Auth**: Bearer JWT
- **Query Params**: `page`, `limit`, `status`

#### 9.3 Get Support Ticket Details
- **Endpoint**: `GET /api/v1/support/tickets/:id`
- **Classification**: USER-FACING
- **Auth**: Bearer JWT
- **Response**: Ticket status, priority, and conversation thread messages.

#### 9.4 Add Message to Support Ticket
- **Endpoint**: `POST /api/v1/support/tickets/:id/messages`
- **Classification**: USER-FACING
- **Auth**: Bearer JWT
- **Request Body**: `{ "message": "Here are additional details..." }`

#### 9.5 Raise Rental Dispute
- **Endpoint**: `POST /api/v1/rentals/:bookingId/disputes`
- **Classification**: USER-FACING
- **Auth**: Bearer JWT
- **Request Body**:
  ```json
  {
    "disputeType": "SECURITY_DEPOSIT_DISPUTE", // or DAMAGE_ASSESSMENT, FUEL_DISCREPANCY, etc.
    "title": "Excess deduction from deposit",
    "description": "Deposit was deducted for existing scratch noted at pickup."
  }
  ```

#### 9.6 List My Disputes
- **Endpoint**: `GET /api/v1/disputes`
- **Classification**: USER-FACING
- **Auth**: Bearer JWT

#### 9.7 Get Dispute Details
- **Endpoint**: `GET /api/v1/disputes/:id`
- **Classification**: USER-FACING
- **Auth**: Bearer JWT

#### 9.8 Add Message to Dispute Mediation
- **Endpoint**: `POST /api/v1/disputes/:id/messages`
- **Classification**: USER-FACING
- **Auth**: Bearer JWT
- **Request Body**: `{ "message": "Photos attached during pickup show this mark." }`

---

### 10. Offers & Coupons (`/api/v1/offers` & `/coupons`)

#### 10.1 Get Active Offers
- **Endpoint**: `GET /api/v1/offers` (and `GET /api/v1/offers/active`)
- **Classification**: USER-FACING
- **Auth**: Public
- **Query Params**: `category`, `limit`
- **Response**: Array of active promo discount offers with banner, discount percentage/flat amount, valid until.

#### 10.2 Validate Coupon
- **Endpoint**: `POST /api/v1/coupons/validate`
- **Classification**: USER-FACING
- **Auth**: Bearer JWT
- **Request Body**:
  ```json
  {
    "code": "DRIVE20",
    "vehicleId": "uuid-here",
    "planType": "PAY_AS_YOU_GO",
    "subtotal": 4500
  }
  ```
- **Response**: `{ "valid": true, "code": "DRIVE20", "discountAmount": 900, "finalTotal": 3600 }`.

---

### 11. Subscriptions & Membership Plans (`/api/v1/subscriptions`)

#### 11.1 Get Active Subscription Plans
- **Endpoint**: `GET /api/v1/subscriptions/plans`
- **Classification**: USER-FACING
- **Auth**: Public
- **Response**: List of membership plans with free hours, zero deposit privilege, discount %, monthly fee.

#### 11.2 Get Plan by ID
- **Endpoint**: `GET /api/v1/subscriptions/plans/:id`
- **Classification**: USER-FACING
- **Auth**: Public

#### 11.3 Get My Active Subscription
- **Endpoint**: `GET /api/v1/subscriptions/my-subscription`
- **Classification**: USER-FACING
- **Auth**: Bearer JWT
- **Response**: Current plan, expiration date, remaining free hours, auto-renew status.

#### 11.4 Create Subscription Payment Order
- **Endpoint**: `POST /api/v1/subscriptions/create-order`
- **Classification**: USER-FACING
- **Auth**: Bearer JWT
- **Request Body**:
  ```json
  {
    "planId": "uuid-here",
    "autoRenew": false
  }
  ```
- **Response**: Razorpay Order ID for subscription payment.

#### 11.5 Verify Subscription Payment
- **Endpoint**: `POST /api/v1/subscriptions/verify-payment`
- **Classification**: USER-FACING
- **Auth**: Bearer JWT
- **Request Body**:
  ```json
  {
    "orderId": "order_xyz",
    "paymentId": "pay_xyz",
    "signature": "sig_xyz"
  }
  ```

#### 11.6 Cancel Subscription
- **Endpoint**: `POST /api/v1/subscriptions/:id/cancel`
- **Classification**: USER-FACING
- **Auth**: Bearer JWT
- **Request Body**: `{ "reason": "Not using frequently" }`

---

### 12. Promotional Banners (`/api/v1/banners`)

#### 12.1 Get Active Banners
- **Endpoint**: `GET /api/v1/banners`
- **Classification**: USER-FACING
- **Auth**: Public
- **Query Params**: `position`, `limit`

#### 12.2 Get Banners by Position
- **Endpoint**: `GET /api/v1/banners/position/:position`
- **Positions**: `HOME_HERO`, `HOME_CAROUSEL`, `SEARCH_PAGE`, `OFFERS_PAGE`, `POPUP`
- **Classification**: USER-FACING
- **Auth**: Public

---

### 13. File Uploads (`/api/v1/uploads`)

#### 13.1 Request Pre-signed S3 / MinIO Upload URL
- **Endpoint**: `POST /api/v1/uploads/presigned-url`
- **Classification**: SHARED
- **Auth**: Bearer JWT
- **Request Body**:
  ```json
  {
    "fileType": "image/jpeg",
    "folder": "kyc" // or inspection, avatar, etc.
  }
  ```
- **Response**: `{ "uploadUrl": "https://...", "fileUrl": "https://...", "storageKey": "kyc/..." }`

#### 13.2 Request Pre-signed View/Download URL
- **Endpoint**: `POST /api/v1/uploads/view-url`
- **Classification**: SHARED
- **Auth**: Bearer JWT
- **Request Body**: `{ "storageKey": "kyc/..." }`
