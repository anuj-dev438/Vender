# Country Drive — Frontend / Backend Integration Contract

## Purpose
This document lets the frontend developer and backend developer agree on integration without the frontend inventing endpoints.

## Before connecting
For each API, confirm:
- Base URL per environment
- HTTP method and route
- Request parameters/body
- Response schema and error format
- Authentication mechanism and refresh behavior
- Required role/permissions
- Pagination, sorting and filtering
- Upload format and storage response
- Status enum values
- Idempotency requirements for payments/bookings
- Rate limits and retry expectations

## Suggested API domains (names are categories, not final endpoint paths)
- Authentication/session
- Customer profile
- KYC and face verification
- Vehicle search/list/detail
- Availability
- Pricing/quote
- Bookings and rental lifecycle
- Pickup/return inspections and evidence
- Payments and payment status
- Cancellation/refunds
- Subscriptions and usage
- Reviews
- Notifications
- Support tickets
- Vendor profile/KYC
- Vendor vehicles/documents/pricing/availability
- Vendor bookings/earnings/settlements
- Admin users/owners/vehicles/bookings
- Admin pricing/subscriptions/payments/refunds/finance
- Reports and audit logs

## API client behavior
- Read base URL from environment configuration.
- Set JSON headers when appropriate.
- Support multipart uploads for files.
- Normalize errors into a consistent shape.
- Handle expired authentication centrally.
- Never log credentials or sensitive response data.
- Use cancellation/abort handling where relevant.
- Do not retry non-idempotent payment or booking mutations blindly.

## Environment
Example frontend variable:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```
Use the actual base URL agreed with the backend developer. Never put secret keys in `VITE_*` variables because these are exposed to the browser.

## Mock/demo mode
- Use fixtures only for frontend development before APIs are available.
- Make mock mode explicit and development-only.
- Keep mock services separate from real services.
- Show a development indicator if necessary.
- Production builds must not silently fall back to mock success.

## Error handling
Map API errors to helpful UI messages while preserving diagnostic details in safe development logs. Support validation errors, unauthorized, forbidden, not-found, conflict/unavailable vehicle, payment pending/failed, network timeout and server errors.

## Critical integrations
- Availability comes from backend.
- Price quote comes from backend.
- Booking creation must be protected against duplicate submissions/conflicts.
- Payment success is confirmed by backend/provider status.
- Refund state comes from backend.
- Commission and owner settlement are read-only frontend displays of server records.
- Admin/vendor mutations require backend authorization.

## Backend handoff checklist
- [ ] API base URL and environments shared.
- [ ] Auth contract and token/session behavior shared.
- [ ] Request/response examples shared.
- [ ] All status enums shared.
- [ ] File upload contract shared.
- [ ] Booking/quote/payment sequence shared.
- [ ] Error schema shared.
- [ ] Pagination/filtering conventions shared.
- [ ] Role and ownership rules shared.
- [ ] Test credentials and safe test data provided.
