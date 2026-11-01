# Country Drive — Admin Panel Features

## 1. Overview
The Admin Panel is the operational control center for the vehicle-rental marketplace. It covers Users, Owners, KYC, Vehicles, Vehicle Verification, Availability, Bookings, Pricing, Subscriptions, Payments, Refunds, Finance, Commission, Settlements, Support, Notifications, Reports and Audit Logs.

## 2. Authentication & Access
- Admin login/logout
- Protected routes
- Session handling
- Server-side RBAC
- Permission-aware navigation
- Unauthorized/forbidden states

## 3. Dashboard
### KPIs
- Total/active customers
- Pending KYC
- Total/active owners
- Pending vehicle verification
- Active rentals
- Upcoming/completed/cancelled bookings
- Gross booking revenue
- Platform commission
- Owner payable
- Refunds
- Active subscriptions

### Analytics
- Booking/revenue trends
- Revenue by vehicle category
- Booking status distribution
- Vehicle availability/utilization
- Subscription activity
- Commission/owner payable
- Recent bookings/customers
- Pending approvals
- Support summary

## 4. Users
- Search/filter users
- User profile
- Mobile/email/profile information
- KYC status
- Face-verification status
- Booking history
- Account status
- Suspend/block/restore where permitted

## 5. KYC
### States
`PENDING`, `UNDER_REVIEW`, `VERIFIED`, `REJECTED`, `EXPIRED`
### Features
- KYC queue
- Document review
- Approve/reject
- Correction/resubmission where supported
- Facial verification status
- Verification history

## 6. Owners
- Owner list/search/filter
- Owner profile
- Owner KYC
- Owned vehicles
- Rental activity
- Earnings
- Bank/settlement information
- Verify/suspend/block
- Settlement history

## 7. Vehicles
### Vehicle Data
Manufacturer, model, variant, registration number, year, car/two-wheeler type, fuel/energy, transmission, seating, odometer, condition, images, pickup location, service area, RC, insurance, PUC/other documents, commercial pricing, included KM, extra KM, minimum duration and rules.

### States
`DRAFT`, `PENDING_VERIFICATION`, `APPROVED`, `ACTIVE`, `MAINTENANCE`, `SUSPENDED`, `REJECTED`

### Actions
- Add/edit/view
- Approve/reject
- Suspend
- Maintenance
- Documents
- Inspection
- Availability
- Booking history

## 8. Vehicle Verification
- Verification queue
- Document review
- RC/insurance/PUC review
- Images and condition review
- Inspection review
- Approve/reject
- Correction flow where supported

Lifecycle:
`Owner Adds → Documents → Verification → Inspection → Admin Approval → Publishable`

## 9. Availability
- Owner availability
- Maintenance blocks
- Existing bookings
- Vehicle status
- Service area
- Conflict visibility

Backend is the final authority for availability.

## 10. Bookings
### States
`PENDING_PAYMENT`, `CONFIRMED`, `UPCOMING`, `PICKUP_PENDING`, `ACTIVE`, `RETURN_PENDING`, `INSPECTION`, `COMPLETED`, `CANCELLED`, `DISPUTED`, `EXPIRED`

### Features
- Search/filter
- Date/customer/owner/vehicle/location filters
- Booking detail
- Customer/owner/vehicle context
- Pricing/payment
- Verification
- Pickup/return evidence
- Inspection/damage
- Additional charges
- Refund
- Commission
- Owner payable
- Audit history
- Operational state handling
- Dispute handling

## 11. Booking Conflict Prevention
- Detect overlapping confirmed bookings
- Show conflict details
- Backend/database/service layer must enforce the final rule

## 12. Pickup & Return
### Pickup
- Booking verification
- Customer identity/face verification
- Vehicle identity
- Odometer
- Fuel/battery
- Exterior/interior photos
- Existing damage
- Timestamp

### Return
- Timestamp
- Odometer
- Fuel/battery
- Exterior/interior condition
- New damage
- Photo/video evidence
- Late duration
- Actual KM
- Additional charges

## 13. Inspection
- Compare pickup vs return evidence
- Damage review
- Usage review
- Additional charge review
- Inspection history

## 14. Pricing
### Models
- Hourly
- KM based
- Hours + KM package
- Extra KM
- Extra time

### Admin Features
- Create/edit pricing rules
- Packages
- Included hours/KM
- Extra rates
- Minimum duration
- Vehicle/category/location applicability

### Price Snapshot
Base rate, included hours/KM, extra rates, discount, taxes/fees, deposit, commission, owner share and final payable amount.

All pricing calculations are server-side.

## 15. Subscriptions
- Create/edit plans
- Daily/weekly/monthly/custom duration
- Vehicle/category/location applicability
- Included hours/KM
- Extra rates
- Deposit
- Renewal
- Cancellation
- Active subscriptions
- Usage
- Overage
- Expiry/renewal

## 16. Payments
- Transaction dashboard
- Successful/failed/pending payments
- Transaction search/filter
- Payment detail
- Provider reference
- Booking/customer context
- Payment state
- Webhook/provider verification

## 17. Refunds
### States
`REQUESTED`, `PROCESSING`, `COMPLETED`, `FAILED`, `PARTIALLY_REFUNDED`
### Features
- Refund queue
- Original payment review
- Refund amount/reason
- Provider status
- Failed refund handling

## 18. Finance
- Gross revenue
- Platform commission
- Owner payable
- Refunds
- Adjustments
- Earnings
- Settlements
- Financial ledger

### Commercial Split
`20% Platform + 80% Vehicle Owner`

Example: ₹2,000 booking → ₹400 platform + ₹1,600 owner.

The exact commission base for taxes, discounts, deposits and penalties must remain a business rule until finalized.

## 19. Owner Settlements
- Owner payable
- Settlement history
- Settlement status
- Settlement amount
- Related bookings
- Commission
- Refund/adjustment impact
- Bank/settlement information
- Settlement audit history

## 20. Support
### Categories
Booking, Payment, Vehicle, KYC, Damage/Accident, Technical, Other.

### Features
- Ticket list/search/filter
- Ticket detail
- Customer/owner/booking context
- Assignment
- Status
- Internal notes
- Resolution
- History

## 21. Notifications
### Channels
Push, SMS, Email and WhatsApp where legally/operationally supported.

### Events
Registration/OTP, KYC approval/rejection, vehicle approval/rejection, booking confirmation, pickup reminder, rental start/end, return reminder, payment success/failure, refund, subscription expiry/renewal, owner settlement and support updates.

### Admin
- Notification history
- Delivery state where available
- Failed notifications

## 22. Reports & Analytics
### Operational
- Bookings
- Vehicle utilization
- Active rentals
- Completed/cancelled rentals
- Availability
- Customer activity
- Owner activity
- Support activity

### Financial
- Revenue
- Commission
- Owner payable
- Refunds
- Settlements
- Payment success/failure
- Ledger

### Subscription
- Active/expired plans
- Renewals
- Usage
- Overage

## 23. Audit Logs
Track:
- KYC approval/rejection
- Vehicle approval/rejection
- Pricing changes
- Refunds
- Settlement information changes
- User suspension
- Vehicle suspension
- Admin configuration changes

Record actor, role, action, target resource, previous/new value where applicable and timestamp.

## 24. Documents & Evidence
Controlled access to:
- KYC documents
- RC
- Insurance
- PUC/other documents
- Vehicle images
- Inspection photos
- Damage evidence
- Pickup/return evidence

Sensitive files must not be publicly exposed.

## 25. Search & Filters
Global/domain search for:
- Users
- Owners
- Vehicles
- Bookings
- Transactions
- Tickets

Common filters:
- Status
- Date
- Location
- Vehicle category
- Owner
- Customer
- Payment state
- KYC state
- Verification state

## 26. Global UX Features
Every major module should provide:
- Loading
- Empty
- Error
- Permission denied
- Search
- Filters
- Pagination
- Sorting where needed
- Confirmation dialogs
- Success/error feedback
- Detail page/drawer
- Responsive layout

## 27. Sidebar Feature Map
```text
Dashboard
Users
  ├── All Users
  ├── KYC
  └── User Activity
Owners
  ├── All Owners
  ├── Verification
  └── Settlements
Vehicles
  ├── All Vehicles
  ├── Add Vehicle
  ├── Verification
  ├── Documents
  └── Availability
Bookings
  ├── All Bookings
  ├── Pending Payment
  ├── Upcoming
  ├── Active
  ├── Inspection
  ├── Completed
  ├── Cancelled
  └── Disputed
Pricing
  ├── Pricing Rules
  └── Packages
Subscriptions
  ├── Plans
  ├── Active Subscriptions
  └── Usage
Payments
  ├── Transactions
  └── Refunds
Finance
  ├── Revenue
  ├── Commission
  ├── Owner Earnings
  ├── Settlements
  └── Ledger
Support
Notifications
Reports & Analytics
Audit Logs
Settings
```

## 28. Priority
### P0 — MVP
Authentication, Dashboard, Users, KYC, Owners, Vehicles, Verification, Availability, Bookings, Pricing, Payments, Refunds, Commission, Settlements, Pickup/Return inspection visibility, Support, Notifications and Audit Logs.

### P1
Subscription management, advanced reports, financial analytics, advanced filters and approved exports.

### P2 — Phase 2
Advanced subscription auto-renewal, coupons/referrals, corporate accounts, loyalty, advanced fraud detection, telemetry where supported, advanced analytics, dynamic pricing and automated operations workflows.

## 29. End-to-End Admin Scope
```text
Identity
  ↓
Owners
  ↓
Vehicles
  ↓
Verification
  ↓
Availability
  ↓
Booking
  ↓
Pickup
  ↓
Active Rental
  ↓
Return
  ↓
Inspection
  ↓
Payment
  ↓
Refund / Additional Charges
  ↓
Commission
  ↓
Owner Settlement
  ↓
Support
  ↓
Reports
  ↓
Audit
```

This feature document is based on the manager-provided Vehicle Rental Marketplace PRD v1.0 and is intended to be the feature checklist for the React.js Admin Panel.
