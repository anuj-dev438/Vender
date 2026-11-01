# Country Drive — Frontend Product Requirements Document

## Product summary
Country Drive is a self-drive rental marketplace for cars and two-wheelers. This repository covers frontend implementation only. Backend APIs, database, payment-provider webhooks, verification providers and server-side business logic are owned by a separate backend developer.

## Goals
- Deliver complete customer, vendor and admin interfaces.
- Make the entire documented rental journey understandable and usable.
- Keep the frontend independent of undocumented backend assumptions.
- Make backend integration possible through a centralized API layer.
- Provide polished, accessible, responsive UI.
- Avoid fake production behavior and misleading success states.

## Users
- Customer: discovers and books a vehicle, verifies identity, pays, picks up/returns, reviews and requests support.
- Vendor/Owner: onboards, manages vehicles/pricing/availability, handles rentals and tracks earnings.
- Admin: manages verification, platform operations, finance, support and audit views.

## Core user journeys
### Customer
Home/search → results → vehicle details → login/KYC when required → select schedule/plan → server price preview → payment → confirmed booking → pickup verification → active rental → return inspection → final charges → completed booking/review.

### Vendor
Login/onboarding → owner verification → add vehicle and documents → submit for review → approval → set pricing/availability → manage bookings → pickup/return evidence → earnings/settlements.

### Admin
Login → dashboard → review users/owners/vehicles → manage bookings and disputes → inspect payments/refunds/settlements → review support/reports/audit logs.

## MVP requirements
- Authentication screens and profile flows.
- Customer KYC and face-verification UI.
- Vehicle discovery, details and availability.
- Hourly/KM/package price preview.
- Booking, payment state handling and confirmation.
- Pickup/return evidence workflows.
- Extra KM/late charges, cancellation/refund status.
- Vendor onboarding, vehicle management, verification status.
- Vendor earnings and settlement views.
- Admin management interfaces.
- Notifications, support tickets and audit-log views.
- Responsive UI and reliable API error handling.

## Out of scope for frontend ownership
- Building the backend/database from scratch unless explicitly requested.
- Making server-side authorization decisions in the browser.
- Calculating final payable amounts as the source of truth.
- Verifying payment solely from a browser callback.
- Storing secrets or sensitive provider credentials in frontend environment variables.
- Claiming an external provider integration works before credentials/endpoints are available.

## Acceptance criteria
A feature is done when its page, navigation, validation, loading/empty/error states, responsive behavior, API boundary and role-appropriate UI are implemented and tested. Backend-dependent actions must report unavailable integration clearly rather than pretending to succeed.
