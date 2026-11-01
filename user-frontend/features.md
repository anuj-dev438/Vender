# Vehicle Rental Marketplace — User Side Requirements

> Customer App / Website specification based on the provided Vehicle Rental Marketplace PRD v1.0.

## 1. User Side Overview

The customer side allows users to register, complete verification, discover available cars and two-wheelers, select a rental plan, pay online, complete pickup verification, use the vehicle, return it, settle additional charges, and review the experience.

Core rental journey:

`Register/Login → KYC → Face Verification → Search → Vehicle Details → Select Hours/KM → Price Preview → Payment → Booking Confirmed → Pickup → Active Rental → Return → Inspection → Final Charges → Completed`

---

## 2. Main Navigation

Recommended primary navigation:

- Home
- Explore Vehicles
- Cars
- Bikes / Scooters
- Subscriptions
- My Bookings
- Help & Support
- Notifications
- Profile

Recommended account navigation:

- Dashboard
- My Bookings
  - Upcoming
  - Active
  - Completed
  - Cancelled
- KYC & Verification
- Payments & Refunds
- Subscriptions
- Reviews
- Support Tickets
- Notifications
- Profile & Settings

---

## 3. Authentication

### 3.1 Registration / Login

Primary authentication:

- Mobile number
- OTP generation
- OTP verification
- Unique mobile number
- Session/token management
- Logout
- OTP rate limiting

Optional email verification and social login may be added later.

### 3.2 Customer Profile

Profile fields:

- Full name
- Mobile number
- Email
- Date of birth
- Address
- Profile photo
- KYC status
- Face-verification status
- Booking history

---

## 4. KYC & Identity Verification

A customer must complete the required identity and driving-eligibility verification before renting a vehicle.

### KYC Statuses

| Status | Meaning |
|---|---|
| `PENDING` | Required KYC information has not been submitted |
| `UNDER_REVIEW` | Submitted information is being verified |
| `VERIFIED` | Customer is eligible subject to other booking rules |
| `REJECTED` | Verification failed; correction/resubmission required |
| `EXPIRED` | Previously valid verification is no longer valid |

### Face Verification

Face verification should support liveness detection where configured.

Recommended checkpoints:

1. Initial KYC
2. Vehicle pickup
3. Risk-triggered re-verification

The exact frequency should remain configurable.

---

## 5. Home Page

Recommended home page sections:

### Hero Search

Inputs:

- Pickup location / service area
- Pickup date
- Pickup time
- Return date
- Return time
- Vehicle category

Primary CTA:

`Search Vehicles`

### Discovery Sections

Recommended sections:

- Cars
- Bikes / Scooters
- EVs
- Popular Vehicles
- Available Near Selected Location
- Rental Packages
- Subscription Plans
- How It Works
- Safety / Verification
- FAQs

Some merchandising sections such as “Popular Vehicles” are UI recommendations rather than explicit PRD requirements.

---

## 6. Vehicle Search & Discovery

### Search Inputs

The platform should support:

- Pickup location / service area
- Pickup date and time
- Return date and time
- Vehicle category
- Fuel / energy type
- Price range
- Transmission
- Seating capacity
- Rating
- Features

### Recommended Filters

#### Vehicle Type
- Car
- Bike
- Scooter

#### Fuel / Energy
- Petrol
- Diesel
- Hybrid
- EV

#### Other
- Transmission
- Seating
- Price range
- Rating
- Features

Availability must be determined by the backend using:

- Owner availability
- Maintenance blocks
- Vehicle status
- Existing bookings

The backend is the final authority for availability.

---

## 7. Vehicle Card

Recommended information on a search-result card:

- Vehicle image
- Vehicle name
- Category
- Fuel / energy type
- Transmission
- Seats where applicable
- Rating
- Pickup area
- Starting price / applicable package indication
- Availability
- `View Details` CTA

---

## 8. Vehicle Detail Page

Display:

- Vehicle photo gallery
- Vehicle name
- Rating and review summary
- Fuel / energy type
- Transmission
- Seating
- Key features
- Pickup location
- Availability
- Hourly pricing
- KM pricing where applicable
- Hours + KM packages
- Security deposit
- Fees
- Extra KM rate
- Extra-hour rate
- Cancellation policy
- Fuel / charging policy
- Rental rules

Primary CTA:

`Book Now`

---

## 9. Pricing System

All authoritative pricing calculations must happen on the backend.

Supported pricing models:

### Hourly

Example:

`₹200/hour × 5 hours = ₹1,000`

### KM Based

Example:

`₹10/KM × 50 KM = ₹500`

### Hours + KM Package

Example:

`6 hours + 60 KM = ₹1,500`

### Extra KM

Example:

`25 additional KM × ₹12 = ₹300`

### Extra Time

Configured rate is applied after the allowed duration.

### Price Preview

Before payment, show a clear breakdown containing applicable values such as:

- Base rate
- Included hours
- Included KM
- Extra-hour rate
- Extra-KM rate
- Discount
- Taxes / fees
- Security deposit
- Final payable amount

Platform commission and owner share belong to the financial snapshot but normally do not need to be exposed as customer-facing commercial information.

A confirmed booking must retain an immutable price snapshot.

---

## 10. Booking Flow

Recommended customer flow:

### Step 1 — Search
Select location, pickup/return schedule and vehicle preferences.

### Step 2 — Select Vehicle
Open the vehicle detail page and review rules, availability and pricing.

### Step 3 — Select Rental Plan
Choose the applicable hourly, KM or Hours + KM package.

### Step 4 — Eligibility Check
Validate:

- Authentication
- KYC
- Face verification when required
- Vehicle availability

### Step 5 — Price Preview
Show the backend-calculated price breakdown.

### Step 6 — Payment
Customer completes online payment.

### Step 7 — Confirmation
Booking becomes confirmed only after valid payment confirmation according to server/provider data.

### Step 8 — Pickup
Complete identity and vehicle-condition checks.

### Step 9 — Active Rental
Vehicle is in use.

### Step 10 — Return
Capture actual usage and condition.

### Step 11 — Final Charges
Calculate additional usage/penalties where applicable.

### Step 12 — Completion
Complete financial processing and close the rental.

---

## 11. Booking Statuses

| Status | Description |
|---|---|
| `PENDING_PAYMENT` | Booking initiated; payment not confirmed |
| `CONFIRMED` | Payment confirmed and vehicle reserved |
| `UPCOMING` | Confirmed booking awaiting pickup |
| `PICKUP_PENDING` | Customer is eligible to start pickup |
| `ACTIVE` | Rental has started |
| `RETURN_PENDING` | Rental return is due |
| `INSPECTION` | Return inspection/final calculation underway |
| `COMPLETED` | Rental and financial processing completed |
| `CANCELLED` | Booking cancelled |
| `DISPUTED` | Issue escalated for resolution |
| `EXPIRED` | Booking expired without completion |

The backend must transactionally prevent overlapping confirmed bookings for the same vehicle.

---

## 12. My Bookings

Recommended tabs:

- All
- Upcoming
- Active
- Completed
- Cancelled

### Booking Card

Show:

- Vehicle
- Booking ID
- Pickup date/time
- Return date/time
- Booking status
- Payment status
- Amount
- `View Booking` CTA

### Booking Detail Page

Recommended sections:

#### Booking Information
- Booking ID
- Status
- Rental schedule
- Pickup location

#### Vehicle
- Vehicle image
- Name
- Registration information as appropriate
- Key specifications

#### Pricing
- Base/package price
- Included hours/KM
- Fees
- Deposit
- Additional charges
- Final amount

#### Payment
- Payment status
- Transaction information
- Refund information where applicable

#### Pickup / Return
- Pickup checklist
- Return status
- Inspection information

#### Support
- Raise booking issue
- View related ticket/dispute

---

## 13. Pickup Workflow

Pickup checklist:

- Booking verification
- Customer identity / face verification
- Vehicle identity verification
- Odometer capture
- Fuel level or EV battery percentage
- Exterior condition photos
- Interior/dashboard photos
- Existing damage capture
- Pickup timestamp

Pickup evidence must be linked to the booking and timestamped.

---

## 14. Active Rental

Recommended active-rental screen:

- Vehicle details
- Booking ID
- Rental start
- Scheduled return
- Included hours
- Included KM
- Pickup odometer
- Pickup fuel/battery
- Rental rules
- Emergency/support access
- Return instructions

Real-time continuous vehicle telemetry is a Phase 2 capability if supported by hardware.

---

## 15. Return Workflow

Return checklist:

- Return timestamp
- Odometer
- Fuel/battery level
- Exterior/interior condition
- New damage detection
- Photo/video evidence
- Late duration
- Actual KM
- Additional charge calculation

After submission:

`Return → Inspection → Final Charges → Completed`

---

## 16. Additional Charges

Possible additional charges include:

- Extra KM
- Extra rental duration
- Late return
- Fuel / charging difference
- Damage charges after review
- Other configured penalties

The customer should be able to view the reason and calculation for applicable charges.

---

## 17. Cancellation & Refunds

Cancellation rules should be configurable based on factors such as time remaining before pickup.

Possible outcomes:

- Full refund
- Partial refund
- No refund

Exact percentages must remain business configuration rather than hard-coded frontend rules.

### Refund Statuses

| Status | Meaning |
|---|---|
| `REQUESTED` | Refund initiated |
| `PROCESSING` | Provider processing refund |
| `COMPLETED` | Refund successfully confirmed |
| `FAILED` | Refund failed |
| `PARTIALLY_REFUNDED` | Part of the original amount returned |

---

## 18. Payments

Recommended payment experience:

- Price summary
- Security deposit
- Applicable fees/taxes
- Discount if applicable
- Final payable amount
- Online payment
- Success/failure/pending handling
- Transaction record
- Refund tracking

Payment success must never be trusted only from the client response. Provider/webhook verification must happen server-side.

---

## 19. Subscription System

The platform supports subscriptions in addition to pay-as-you-go rentals.

Plan configuration may include:

- Plan name
- Daily / weekly / monthly / custom duration
- Applicable vehicle/category/fuel/location
- Included hours
- Included KM
- Extra-hour rate
- Extra-KM rate
- Deposit
- Renewal configuration
- Cancellation configuration

### Customer Subscription Screen

Recommended information:

- Active plan
- Start/end date
- Included hours
- Hours consumed
- Included KM
- KM consumed
- Remaining allowance
- Overage charges
- Renewal status
- Subscription bookings

Lifecycle:

`Plan Selected → Payment → Activated → Usage Tracked → Overage → Expiry/Renewal`

Advanced auto-renewal is identified as Phase 2 in the PRD.

---

## 20. Ratings & Reviews

Recommended post-rental flow:

- Rate vehicle
- Write review
- View submitted review

Reviews should be associated with the relevant completed rental/vehicle.

---

## 21. Notifications

Supported channels can include:

- Push
- SMS
- Email
- WhatsApp where legally and operationally supported

Important customer events:

- Registration / OTP
- KYC approved/rejected
- Booking confirmed
- Pickup reminder
- Rental started
- Rental ending
- Return reminder
- Payment success/failure
- Refund update
- Subscription expiry/renewal
- Support ticket update

---

## 22. Help & Support

Support categories defined in the PRD:

- Booking
- Payment
- Vehicle
- KYC
- Damage / Accident
- Technical
- Other

Recommended ticket form:

- Category
- Related booking
- Subject
- Description
- Evidence/attachment
- Submit

Recommended ticket statuses can be defined in the detailed API/database specification; the PRD does not define an exact support-ticket status enum.

---

## 23. Profile & Settings

### Profile

- Full name
- Mobile
- Email
- Date of birth
- Address
- Profile photo

### Verification

- KYC status
- Face-verification status
- Resubmission flow where required

### Settings

Recommended UI controls:

- Notification preferences
- Session/logout controls
- Help & support
- Privacy/legal links

Some settings such as language/theme are optional product additions and are not specified by the PRD.

---

## 24. Recommended Frontend Routes

```text
/

/vehicles
/vehicles/:vehicleId
/search

/categories/cars
/categories/bikes
/categories/scooters

/login
/verify-otp

/kyc
/face-verification

/booking/:vehicleId
/checkout
/booking-confirmation/:bookingId

/account
/account/profile

/account/bookings
/account/bookings/:bookingId
/account/active-rentals

/account/payments
/account/refunds

/account/subscriptions

/account/reviews
/account/notifications

/account/support
/account/support/:ticketId

/account/settings
```

These are recommended frontend routes, not API endpoints defined by the source PRD.

---

## 25. Important Backend Rules Affecting User UI

The frontend must not be treated as the final authority for critical business logic.

Backend must control:

- Authentication and authorization
- KYC eligibility
- Vehicle availability
- Booking conflict prevention
- Pricing calculation
- Price snapshot
- Payment verification
- Refund state
- Actual rental usage
- Additional charges
- Subscription usage
- Booking state transitions

Critical operations should be auditable.

---

## 26. Important Edge Cases

The customer UI must handle:

- Two customers trying to book the same vehicle
- Payment succeeds but app does not receive response
- Payment succeeds but booking creation fails
- Refund provider unavailable
- Vehicle documents expire before a future booking
- Owner blocks a vehicle with future bookings
- Customer exceeds included KM
- Customer returns late
- Disputed vehicle damage
- Subscription expires during active rental
- EV returned below configured battery threshold
- Owner cancels confirmed booking
- Face verification fails at pickup
- Network drops while uploading pickup/return evidence
- Duplicate payment webhooks

---

## 27. Customer-Side MVP

### Must Have

- Registration/login
- Customer KYC
- Facial verification
- Vehicle discovery
- Vehicle details
- Availability
- Hourly + KM/package pricing
- Booking
- Online payment
- Pickup workflow
- Return workflow
- Odometer/fuel/battery capture
- Extra KM/late charges
- Cancellation/refunds
- Notifications
- Support tickets



---

## 28. Core Product Principle

The customer experience should make the rental journey simple while keeping sensitive business decisions server-controlled.

The ideal end-to-end experience is:

**Discover → Verify → Book → Pay → Pickup → Drive → Return → Settle → Review**

All UI, API, database behavior, validation, permissions, error states and relevant financial/notification side effects should be implemented and tested before a feature is considered complete.
