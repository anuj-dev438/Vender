# Country Drive — Frontend Implementation Tasks

## Phase 0: Repository audit
- [ ] Read `features.md` and every project instruction/document.
- [ ] Inspect current app, routes, components, dependencies and scripts.
- [ ] Identify existing working features and avoid regressions.
- [ ] Create feature → page → API mapping.
- [ ] Record missing API contracts for the backend developer.

## Phase 1: Foundation
- [ ] Configure routing and role-specific layouts.
- [ ] Configure environment variables for API base URL.
- [ ] Create centralized API client and error normalization.
- [ ] Configure query/cache layer if appropriate.
- [ ] Establish design tokens and responsive breakpoints.
- [ ] Build reusable buttons, fields, cards, badges, dialogs, tables and feedback states.

## Phase 2: Customer public experience
- [ ] Home page and search.
- [ ] Search results, filters, sorting and empty states.
- [ ] Vehicle details and pricing presentation.
- [ ] Categories and supporting content pages.
- [ ] Responsive navigation and footer.

## Phase 3: Customer account and booking
- [ ] Login/OTP UI.
- [ ] Profile and KYC UI.
- [ ] Face-verification integration boundary.
- [ ] Booking plan selection and server price preview.
- [ ] Checkout and payment states.
- [ ] Booking confirmation and history.
- [ ] Pickup and return checklists.
- [ ] Cancellation/refund status.
- [ ] Reviews, notifications and support.

## Phase 4: Vendor portal
- [ ] Vendor onboarding and verification status.
- [ ] Dashboard.
- [ ] Vehicle list/details/add/edit.
- [ ] Vehicle photos/documents upload UI.
- [ ] Pricing and availability calendar.
- [ ] Bookings and rental workflow.
- [ ] Pickup/return inspection.
- [ ] Earnings and settlement views.
- [ ] Reports, notifications, support and settings.

## Phase 5: Admin portal
- [ ] Dashboard and KPI states.
- [ ] Users and KYC queue/details.
- [ ] Owners and verification.
- [ ] Vehicles and approval queue.
- [ ] Bookings and disputes.
- [ ] Pricing/subscription management.
- [ ] Payments/refunds/finance/settlements.
- [ ] Support tickets.
- [ ] Reports, notifications, audit logs and settings.

## Phase 6: API integration
- [ ] Confirm API contracts with backend developer.
- [ ] Replace development fixtures through domain service adapters.
- [ ] Connect queries and mutations.
- [ ] Add pagination/search/filter parameters.
- [ ] Handle auth expiry, permission errors and network failures.
- [ ] Invalidate/update relevant cached data after mutations.
- [ ] Verify server-side status and pricing are rendered accurately.

## Phase 7: QA and polish
- [ ] Run production build.
- [ ] Run lint/type checks if configured.
- [ ] Test all routes and cross-page links.
- [ ] Test loading/empty/error/success states.
- [ ] Test forms and duplicate-submit prevention.
- [ ] Test role-aware UI and unauthorized states.
- [ ] Test responsive widths: 360, 390, 768, 1024, 1440.
- [ ] Check console, network requests, broken images and overflow.
- [ ] Test critical customer, vendor and admin workflows.
- [ ] Update documentation and implementation report.

## Definition of done
A task is done only when the UI is implemented, navigable, responsive, validated, integrated through the API layer or clearly marked as backend-blocked, and tested.
