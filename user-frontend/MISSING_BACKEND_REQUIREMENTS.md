# COUNTRY DRIVE — MISSING BACKEND REQUIREMENTS REPORT

**Document Purpose**: Formal engineering specification report for the Backend Development Team, documenting features, endpoints, and query parameters needed to optimize the Customer/User frontend experience.  
**Target Audience**: Backend Development Team & Project Architect  
**Backend Constraint Respected**: Zero backend files were modified. All requirements are documented here for upstream backend implementation.

---

## Executive Summary

| Issue ID | Feature / Module | Missing Capability | Priority | Suggested Endpoint |
|---|---|---|---|---|
| **REQ-BE-01** | Vehicle Fare Quote | Dry-run Fare Estimation prior to Booking Creation | **HIGH** | `POST /api/v1/bookings/quote` |
| **REQ-BE-02** | Wishlist / Favorites | Customer Saved Vehicles & Wishlist Management | **MEDIUM** | `GET / POST / DELETE /api/v1/wishlist` |
| **REQ-BE-03** | User Notification Settings | User Preference Toggles (SMS, WhatsApp, Email) | **LOW** | `GET / PATCH /api/v1/notifications/preferences` |
| **REQ-BE-04** | Live Support Chat Stream | Real-time WebSocket or SSE for Support Ticket Thread | **MEDIUM** | `ws://.../support/tickets/:id/chat` |
| **REQ-BE-05** | Batch KYC Upload | Multi-document upload in a single atomic transaction | **MEDIUM** | `POST /api/v1/kyc/documents/batch` |
| **REQ-BE-06** | Dedicated Refund Tracking | Standalone Refund Lifecycle Status for Cancelled Trips | **HIGH** | `GET /api/v1/payments/refunds/my-refunds` |

---

## Detailed Requirement Specifications

### REQ-BE-01: Dry-Run Fare Estimate Endpoint (`POST /api/v1/bookings/quote`)
- **Feature / Module**: Booking & Pricing
- **Priority**: **HIGH**
- **Why Frontend Needs It**:  
  Currently, the only way to obtain the authoritative backend pricing breakdown (rental hours, GST, platform fee, security deposit, coupon discounts) is to execute `POST /api/v1/bookings`. However, this persists a new booking in `PAYMENT_PENDING` status. If the customer is merely browsing dates or comparing vehicles on the detail page, creating a database row pollutes the booking table with abandoned drafts.
- **Expected Endpoint & Method**: `POST /api/v1/bookings/quote`
- **Auth Requirement**: Public or CUSTOMER
- **Required Request Payload**:
  ```json
  {
    "vehicleId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "startAt": "2026-11-01T10:00:00.000Z",
    "endAt": "2026-11-03T18:00:00.000Z",
    "planType": "PAY_AS_YOU_GO",
    "couponCode": "FESTIVE20" // Optional
  }
  ```
- **Expected Response**:
  ```json
  {
    "success": true,
    "data": {
      "totalHours": 56,
      "baseFare": 6720,
      "platformFee": 99,
      "gstAmount": 1227.42,
      "discountAmount": 500,
      "rentalTotal": 7546.42,
      "securityDeposit": 3000,
      "grandTotal": 10546.42,
      "includedKm": 560,
      "extraKmRate": 12,
      "isAvailable": true
    }
  }
  ```
- **Suggested Implementation**: Refactor the pricing calculation logic in `booking.service.ts` into a standalone helper method and expose it via this endpoint.

---

### REQ-BE-02: Customer Wishlist & Favorite Vehicles
- **Feature / Module**: Customer Wishlist
- **Priority**: **MEDIUM**
- **Why Frontend Needs It**:  
  Customers frequently browse cars/bikes and wish to "heart" or save vehicles to compare them later or book on payday. Currently, the User frontend can only store favorites in browser `localStorage`, which does not sync across mobile and desktop devices.
- **Expected Endpoints**:
  - `GET /api/v1/wishlist` — List all saved vehicle objects for authenticated customer.
  - `POST /api/v1/wishlist/:vehicleId` — Add vehicle to wishlist.
  - `DELETE /api/v1/wishlist/:vehicleId` — Remove vehicle from wishlist.
- **Auth Requirement**: Bearer JWT (`CUSTOMER`)
- **Suggested Prisma Model**:
  ```prisma
  model Wishlist {
    id        String   @id @default(uuid())
    userId    String
    vehicleId String
    createdAt DateTime @default(now())

    user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
    vehicle   Vehicle  @relation(fields: [vehicleId], references: [id], onDelete: Cascade)

    @@unique([userId, vehicleId])
  }
  ```

---

### REQ-BE-03: User Notification Channel Preferences
- **Feature / Module**: Notifications & Settings
- **Priority**: **LOW**
- **Why Frontend Needs It**:  
  In `ProfilePage.jsx`, customers expect to customize their communication channels (Email alerts, SMS booking reminders, WhatsApp trip updates, Promotional offers).
- **Expected Endpoints**:
  - `GET /api/v1/notifications/preferences`
  - `PATCH /api/v1/notifications/preferences`
- **Request Body**:
  ```json
  {
    "emailBookingUpdates": true,
    "smsReminders": true,
    "whatsappAlerts": false,
    "promotionalOffers": true
  }
  ```

---

### REQ-BE-04: Standalone Refund Status & Tracking Endpoint
- **Feature / Module**: Financial / Cancellations
- **Priority**: **HIGH**
- **Why Frontend Needs It**:  
  When a customer cancels a booking or completes a rental with security deposit refund, they require a clear view of refund transactions, Arnold/Razorpay ARN references, estimated bank settlement dates, and status (`INITIATED`, `PROCESSED`, `FAILED`). Currently refund info is nested inside booking payments.
- **Expected Endpoint**: `GET /api/v1/payments/refunds/my-refunds`
- **Auth Requirement**: Bearer JWT (`CUSTOMER`)
- **Expected Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "refundId": "rfnd_xyz123",
        "bookingId": "uuid-here",
        "amount": 3000,
        "type": "SECURITY_DEPOSIT",
        "status": "PROCESSED",
        "arn": "123456789012",
        "processedAt": "2026-10-29T14:30:00.000Z",
        "estimatedSettlement": "2026-11-02T18:00:00.000Z"
      }
    ]
  }
  ```

---

### REQ-BE-05: Batch KYC Document Upload
- **Feature / Module**: KYC & Verification
- **Priority**: **MEDIUM**
- **Why Frontend Needs It**:  
  Currently, if a customer selects DL Front, DL Back, and Aadhaar, the frontend must fire 3 separate requests to `POST /api/v1/kyc/documents`. A single atomic batch endpoint reduces network latency and avoids partial submission states.
- **Expected Endpoint**: `POST /api/v1/kyc/documents/batch`
- **Request Body**:
  ```json
  {
    "documents": [
      { "documentType": "DRIVING_LICENSE_FRONT", "fileUrl": "...", "storageKey": "..." },
      { "documentType": "DRIVING_LICENSE_BACK", "fileUrl": "...", "storageKey": "..." },
      { "documentType": "AADHAAR_FRONT", "fileUrl": "...", "storageKey": "..." }
    ]
  }
  ```

---

### REQ-BE-07: Certified Pickup Hubs & Station Directory
- **Feature / Module**: Locations & Stations
- **Priority**: **MEDIUM**
- **Why Frontend Needs It**:  
  Currently in Step 2 of `BookingPage.jsx`, station hubs (e.g., Airport T2, BKC Hub, Metro Quad Hub) are maintained in frontend hub tables. A dynamic endpoint `GET /api/v1/locations/hubs?city=Mumbai` enables the Admin/Vendor team to add, relocate, or temporarily disable specific pickup hubs based on local events, city restrictions, or fleet capacity.
- **Expected Endpoint & Method**: `GET /api/v1/locations/hubs`
- **Query Parameters**: `?city=Mumbai&activeOnly=true`
- **Expected Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "hub-mumbai-1",
        "name": "Chhatrapati Shivaji Airport (T2)",
        "address": "Terminal 2 Commercial Arrivals, Andheri East",
        "city": "Mumbai",
        "latitude": 19.0896,
        "longitude": 72.8656,
        "operatingHours": "24/7",
        "isActive": true
      }
    ]
  }
  ```

