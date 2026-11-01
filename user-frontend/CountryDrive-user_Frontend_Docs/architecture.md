# Country Drive — Frontend Architecture

## Principle
Build a frontend-only application that can run with a configurable API base URL and later connect to a separately developed backend without rewriting page components.

## Preferred stack
First inspect the existing repository and preserve its stack. If no project exists, use:
- React + Vite
- JavaScript unless TypeScript is already established or requested
- React Router
- Tailwind CSS or one consistent existing styling system
- Axios or centralized Fetch client
- TanStack Query for server state
- React Hook Form for complex forms
- Zod or existing validation library
- Recharts for dashboards if needed
- Lucide React for icons

## Suggested structure
```text
src/
  app/
    App.jsx
    router.jsx
    providers/
  assets/
  components/
    ui/
    layout/
    forms/
    tables/
    charts/
    feedback/
    vehicle/
    booking/
  features/
    auth/
    customer/
    search/
    vehicles/
    booking/
    rental/
    payments/
    subscriptions/
    support/
    vendor/
    admin/
    notifications/
    reports/
  services/
    api/
      client.js
      endpoints.js
      auth.api.js
      vehicles.api.js
      bookings.api.js
      payments.api.js
      vendor.api.js
      admin.api.js
      support.api.js
  hooks/
  context/
  constants/
  utils/
  mocks/
  styles/
```

## Routing
Use nested layouts for public, customer, vendor and admin areas. Use lazy loading where appropriate. Keep route definitions centralized and links generated from route constants where practical.

Suggested route families:
- `/`, `/vehicles`, `/vehicles/:vehicleId`, `/search`
- `/login`, `/verify-otp`, `/kyc`, `/face-verification`
- `/booking/:vehicleId`, `/checkout`, `/booking-confirmation/:bookingId`
- `/account/*`
- `/vendor/*`
- `/admin/*`

The precise route list should match `features.md` and existing code.

## API boundary
- All network requests pass through a single API client.
- Base URL comes from environment configuration such as `VITE_API_BASE_URL`.
- API functions are grouped by domain; page components do not embed raw request URLs.
- Normalize API errors in one place.
- Handle auth/session expiry consistently.
- Do not assume response schemas; document and adapt to the backend's agreed contract.
- Keep a mock adapter behind a development-only switch if the backend is not ready.
- Never silently fall back to mock success in production.

## Server state and UI state
- TanStack Query (or existing equivalent) for API data, caching, mutations and invalidation.
- Local component state for menus, modal visibility, tabs and temporary UI interactions.
- Context only for genuinely global state such as session and app shell.
- Forms use controlled/managed form state and separate validation schemas.
- Do not duplicate server-owned business state in local storage.

## Authentication and permissions
- Use the auth mechanism agreed with the backend developer.
- Never assume the role supplied by the client is sufficient authorization.
- Protected frontend routes improve UX only; server must enforce RBAC.
- Do not store secrets in browser storage.
- Avoid logging tokens, KYC documents or sensitive personal data.

## Integration readiness
Create an API contract checklist for every page:
- endpoint and HTTP method
- request parameters/body
- response schema
- pagination/filtering
- auth requirement
- loading/error behavior
- mutation and cache invalidation
- ownership/role restrictions

If endpoint details are not yet known, use clearly marked adapter interfaces and demo fixtures, not invented production endpoints.
