# Country Drive — Project Memory / Handoff

## Project
Country Drive is a self-drive vehicle rental marketplace for cars and two-wheelers.

## Current task boundary
The current agent is responsible for the frontend only. Another developer is building the backend. The frontend must be designed so it can be connected later through documented API contracts.

## Core product areas
- Customer website and account
- Vendor/vehicle owner portal
- Admin portal
- Vehicle discovery and availability
- Hourly, per-KM and Hours + KM package pricing
- KYC and facial verification
- Booking, pickup, active rental, return and inspection
- Payments, refunds, 20% platform / 80% owner commercial split
- Vendor earnings and settlements
- Subscriptions
- Notifications, support, reports and audit views

## Design direction
Premium, modern, glossy but readable. If no existing brand tokens are available, use a restrained forest-green/emerald palette with polished buttons, subtle gradients, soft borders, and accessible contrast. Use existing brand assets and project styles when present.

## Integration principles
- Use a centralized API client.
- Base URL is configurable via frontend environment.
- Backend is authoritative for all sensitive business rules and state.
- Do not invent API endpoints; coordinate contracts with backend developer.
- Development fixtures are allowed only behind an explicit development/demo mode.
- Never fake production success.

## Critical business rules
- Prevent overlapping confirmed bookings on the backend.
- Server computes final price and stores a price snapshot.
- Payment must be verified by backend/provider flow.
- Customer eligibility/KYC must be checked before rental.
- Financial ledger, commission, refunds and settlements are server-owned.
- Frontend route protection does not replace backend RBAC.

## Current status
These documents are implementation instructions, not proof that the frontend has already been built. Update this file with actual progress, decisions, API contracts, and remaining blockers as implementation proceeds.
