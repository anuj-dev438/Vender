# Country Drive --- Admin Panel Architecture

## Stack

-   React.js
-   Vite
-   React Router
-   JavaScript
-   Tailwind CSS or project-approved CSS system
-   React Hook Form
-   TanStack Query for server state
-   Recharts
-   Lucide React
-   Axios or centralized Fetch wrapper

## Font

``` html
<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');
</style>
```

``` css
font-family: "Montserrat", sans-serif;
```

## Folder Structure

``` text
src/
├── app/
├── assets/
├── components/
│   ├── ui/
│   ├── layout/
│   ├── tables/
│   ├── forms/
│   ├── charts/
│   └── feedback/
├── features/
│   ├── dashboard/
│   ├── users/
│   ├── owners/
│   ├── kyc/
│   ├── vehicles/
│   ├── vehicleVerification/
│   ├── bookings/
│   ├── pricing/
│   ├── subscriptions/
│   ├── payments/
│   ├── finance/
│   ├── refunds/
│   ├── support/
│   ├── reports/
│   ├── notifications/
│   └── auditLogs/
├── services/
│   └── api/
├── hooks/
├── utils/
├── constants/
└── styles/
```

## Routes

``` text
/admin/dashboard
/admin/users
/admin/users/:id
/admin/owners
/admin/owners/:id
/admin/kyc
/admin/kyc/:id
/admin/vehicles
/admin/vehicles/new
/admin/vehicles/:id
/admin/vehicle-verification
/admin/bookings
/admin/bookings/:id
/admin/pricing
/admin/subscriptions
/admin/payments
/admin/refunds
/admin/finance
/admin/settlements
/admin/support
/admin/notifications
/admin/reports
/admin/audit-logs
/admin/settings
```

## Layers

**Presentation:** pages, layout, tables, forms, charts, modals.

**Feature:** domain-specific pages, components, hooks and API functions.

**Service:** centralized API client, auth/session handling and request
normalization.

## API Boundary

Frontend handles UI state, input collection, basic validation and
response presentation. Backend remains authoritative for RBAC,
availability, pricing, booking conflict prevention, payment
verification, commission, settlement, ledger and final status
transitions.

## State

-   `useState` for isolated UI state.
-   React Hook Form for forms.
-   TanStack Query for server state.
-   Context/provider for authentication and small global UI state.

## Security

Protected routes are for UX; actual authorization must be enforced
server-side. Never store secrets in frontend code. Do not log tokens,
payment secrets or sensitive KYC data.

## Error States

Every API screen supports loading, success, empty, error, unauthorized,
forbidden, not-found and network-failure states.

## Performance

Use lazy routes, pagination, debounced search, server-side filtering and
optimized image loading.
