# Country Drive --- Admin Panel PRD

## Product

Country Drive is a self-drive vehicle rental marketplace for cars and
two-wheelers. The manager PRD defines pay-as-you-go and subscription
rentals, hourly/KM/package pricing, KYC and facial verification,
booking/rental lifecycle, payments, refunds, commission, owner
settlements, support, notifications and audit logs.

## Admin Panel Scope

The admin panel must manage: - Users and KYC - Vehicle owners - Vehicle
verification and documents - Vehicles and availability - Bookings and
rental states - Pricing and packages - Subscriptions - Payments and
refunds - Commission, earnings and settlements - Support tickets -
Reports - Notifications - Audit logs

## Dashboard

Show total/active customers, pending KYC, total/active owners, pending
vehicle verification, active rentals, upcoming/completed/cancelled
bookings, gross booking revenue, platform commission, owner payable,
refunds and active subscriptions.

## Users & KYC

User management supports search, profile viewing, suspension/blocking
and KYC status. KYC states are `PENDING`, `UNDER_REVIEW`, `VERIFIED`,
`REJECTED`, and `EXPIRED`.

## Owners

Admins can verify owners, manage suspension, review bank/settlement
information and inspect owner vehicles and earnings.

## Vehicles

Vehicle data includes manufacturer, model, variant, registration number,
year, vehicle type, fuel/energy, transmission, seating, odometer,
condition, images, location, service area, documents, commercial
pricing, included KM, extra KM, minimum duration and rules.

Vehicle states: `DRAFT`, `PENDING_VERIFICATION`, `APPROVED`, `ACTIVE`,
`MAINTENANCE`, `SUSPENDED`, `REJECTED`.

## Bookings

Booking states: `PENDING_PAYMENT`, `CONFIRMED`, `UPCOMING`,
`PICKUP_PENDING`, `ACTIVE`, `RETURN_PENDING`, `INSPECTION`, `COMPLETED`,
`CANCELLED`, `DISPUTED`, `EXPIRED`.

Booking detail must expose customer, owner, vehicle, location, dates,
duration, pricing, payment, verification, pickup/return evidence,
inspection, damage, additional charges, refund, commission, owner
payable and audit history.

The backend is the final authority for availability and must prevent
overlapping confirmed bookings transactionally.

## Pricing

Supported models: - Hourly - KM based - Hours + KM package - Extra KM -
Extra time

A confirmed booking must retain a price snapshot containing base rate,
included hours/KM, extra rates, discount, taxes/fees, deposit,
commission, owner share and final payable amount. Pricing calculations
are server-side.

## Subscriptions

Admin can configure plan name, duration, vehicle applicability, included
hours/KM, extra rates, deposit, renewal and cancellation. Usage must
record consumed hours/KM and billable overage.

## Finance

Base commercial model: **20% platform commission / 80% vehicle owner
share**. Example: ₹2,000 booking → ₹400 platform → ₹1,600 owner. The
exact commission base for taxes, discounts, deposits and penalties
remains a business rule to finalize.

Use a transaction/ledger layer for payments, commissions, refunds, owner
payables and settlements.

## Refunds & Charges

Refund states: `REQUESTED`, `PROCESSING`, `COMPLETED`, `FAILED`,
`PARTIALLY_REFUNDED`.

Additional charges can include extra KM, extra duration, late return,
fuel/charging difference, damage and configured penalties.

## Inspection

Pickup and return evidence should include identity checks, vehicle
identity, odometer, fuel/battery, condition photos, damage, timestamps,
late duration, actual KM and additional charges.

## Support & Notifications

Support categories include booking, payment, vehicle, KYC,
damage/accident, technical and other. Notifications may use push, SMS,
email and WhatsApp where supported.

## Reports & Audit

Reports cover operational and financial activity. Sensitive admin
actions such as KYC approval, vehicle approval/rejection, pricing
changes, refunds, settlement changes and suspension must be auditable.

## MVP

The manager PRD lists customer auth/KYC/facial verification, vehicle
discovery/details/availability, pricing, booking/payment, pickup/return,
extra charges, refunds, owner onboarding, verification, earnings, 20/80
commission, settlements, admin panel, notifications, support and audit
logs as MVP must-haves.

**Source:** Manager-provided
`Vehicle Rental Marketplace • Product Requirements & Developer Specification • Version 1.0`.
