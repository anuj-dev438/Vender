# Country Drive — Complete Frontend Feature Specification

## Purpose
Build the frontend for Country Drive, a self-drive vehicle rental marketplace for cars and two-wheelers. The backend is being developed separately. Implement all UI, routes, forms, state handling, mock/demo mode where needed, and a clean API integration boundary so the real backend can be connected later.

## Roles and Applications
1. Customer/User website
2. Vendor/Vehicle Owner portal
3. Admin portal

Role-based pages must be separated and protected in the UI. Frontend route protection is for user experience only; backend authorization remains authoritative.

## A. Customer / User Side

### Public pages
- Home: hero search, location, pickup/return date and time, vehicle category, featured/popular listings, how it works, safety, FAQs, footer.
- Search results: vehicle cards, filters, sorting, pagination/load more, active filter chips, empty and error states.
- Categories: cars, bikes, scooters, EVs.
- Vehicle details: image gallery, specifications, fuel/energy, transmission, seats where relevant, pickup location, availability, hourly/KM/package rates, included KM/hours, extra usage rates, deposit, fees, cancellation/fuel policy, rental rules, ratings/reviews, booking CTA.
- How it works, FAQs, terms, privacy, cancellation policy, contact/support pages as documented or needed.

### Authentication and profile
- Mobile number + OTP login/register UI.
- OTP resend cooldown and validation.
- Profile: full name, mobile, email, DOB, address, profile photo.
- KYC status and document submission UI.
- Face-verification entry/status UI, with provider integration abstracted behind a service.
- States: PENDING, UNDER_REVIEW, VERIFIED, REJECTED, EXPIRED.
- Account settings, notification preferences, logout.

### Booking and rental
- Search by pickup location, pickup date/time, return date/time and vehicle category.
- Select hourly, KM-based or Hours + KM package where available.
- Price preview from API/service; never treat frontend calculation as authoritative.
- Checkout with price breakdown, applicable fees/taxes, deposit, discounts if supported, and final payable.
- Payment pending/success/failure UI; provider integration behind a service adapter.
- Booking confirmation and receipt.
- My Bookings tabs: all, upcoming, active, completed, cancelled.
- Booking detail with status, vehicle, dates, pricing, payment/refund status, pickup instructions, evidence, support link.
- Pickup checklist: booking check, identity/face verification as required, vehicle identity, odometer, fuel/battery, exterior/interior photos, existing damage, timestamp.
- Active rental page with schedule, included hours/KM, support, return instructions.
- Return checklist: timestamp, odometer, fuel/battery, condition, photos/video, new damage, late duration, actual KM, final charge status.
- Cancellation request and policy-aware refund estimate/status.
- Additional charges display with reason and calculation returned by backend.
- Reviews after eligible completed bookings.
- Support tickets related to booking/payment/vehicle/KYC/damage/technical/other.

### Subscriptions and optional engagement
- Subscription plan list/details, eligibility, included hours/KM, usage, overage, expiry and renewal status.
- Coupons/referrals, wishlist, loyalty only if included in approved feature scope or API contract. Keep feature flags/configuration so unsupported features can be hidden.
- Notifications: OTP, KYC updates, booking confirmed, pickup/return reminders, payment/refund, subscription, support updates.

## B. Vendor / Vehicle Owner Portal

### Onboarding
- Vendor registration/login UI.
- Owner profile, KYC, verification status.
- Bank/settlement details form and status (never show full sensitive account data unnecessarily).
- Pending/rejected/suspended states with clear messaging.

### Dashboard
- Vehicle count and statuses.
- Upcoming, active, completed and cancelled rentals.
- Gross booking amount, commission, owner share, pending settlements.
- Recent bookings, notifications and quick actions.
- All numbers should come from API; demo values must be clearly isolated to development.

### Vehicle management
- Vehicle list, search, filter, pagination.
- Add/edit vehicle multi-step form:
  1. Identity: manufacturer, model, variant, registration number, year.
  2. Classification: car/two-wheeler, fuel/energy, transmission, seating where applicable.
  3. Condition: odometer, condition, photos.
  4. Location: pickup address/service area.
  5. Documents: RC, insurance, PUC/other applicable documents, expiry dates.
  6. Commercial: pricing, included KM, extra KM, minimum duration and rental rules.
  7. Review and submit.
- Vehicle details, document status, approval/rejection reason.
- Statuses: DRAFT, PENDING_VERIFICATION, APPROVED, ACTIVE, MAINTENANCE, SUSPENDED, REJECTED.
- Availability calendar and maintenance blocks.
- Do not allow client-side status manipulation that bypasses API permissions.

### Vendor operations
- Booking list/detail and rental lifecycle.
- Customer information only as permitted by backend.
- Pickup/return inspection forms and evidence uploads.
- Cancellation request handling according to documented business rules.
- Pricing rules: hourly, per KM, Hours + KM package, extra KM/hour, minimum duration, deposit and fees.
- Earnings/commission breakdown and booking-wise ledger view.
- Settlements: pending/processing/completed history, references and statements if supported.
- Reports, notifications, support tickets, profile and settings.

## C. Admin Portal

- Dashboard: customers, pending KYC, owners, vehicle verification queue, active rentals, booking statuses, gross booking revenue, platform commission, owner payable, refunds, subscriptions.
- Users: search, detail, KYC status, suspend/block.
- Owners: verification, suspension, vehicles and settlement status.
- KYC review: view submitted documents/status, approve/reject with reason where supported.
- Vehicles: list/detail, document review, approve/reject, suspend, maintenance.
- Bookings: filters, details, lifecycle, inspection evidence, disputes, additional charges.
- Pricing and packages configuration UI.
- Subscription plans and eligibility.
- Payments, refunds and transaction status.
- Finance: commission, owner earnings, settlements and ledger records.
- Support tickets: assignment/status/resolution.
- Reports and exports only when supported by API.
- Notifications and audit logs.
- Admin settings and role-aware navigation.

## Business statuses to display
### Booking
PENDING_PAYMENT, CONFIRMED, UPCOMING, PICKUP_PENDING, ACTIVE, RETURN_PENDING, INSPECTION, COMPLETED, CANCELLED, DISPUTED, EXPIRED.

### Refund
REQUESTED, PROCESSING, COMPLETED, FAILED, PARTIALLY_REFUNDED.

### KYC
PENDING, UNDER_REVIEW, VERIFIED, REJECTED, EXPIRED.

### Vehicle
DRAFT, PENDING_VERIFICATION, APPROVED, ACTIVE, MAINTENANCE, SUSPENDED, REJECTED.

Use centralized status maps with human-friendly labels. Do not rely on color alone.

## Cross-cutting requirements
- Responsive design for mobile, tablet and desktop.
- Loading, skeleton, empty, error, success, unauthorized, forbidden, not-found and network-error states.
- Accessible forms, labels, focus states, keyboard support and touch targets.
- Functional buttons and navigation; no dead links or `href="#"`.
- Reusable components and consistent design tokens.
- Centralized API client and typed/consistent response mapping.
- Backend remains authoritative for RBAC, availability, pricing, booking conflicts, payment verification, commission, settlement and status transitions.
