# Country Drive --- React.js Coding Standard

## Components

Use functional React components and keep each component focused.

``` text
VehicleTable.jsx
BookingDetails.jsx
KycStatusBadge.jsx
```

## Hooks

``` text
useBookings.js
useVehicleDetails.js
usePermissions.js
```

## Utilities

``` text
formatCurrency.js
formatDate.js
mapStatus.js
```

## Constants

``` js
const BOOKING_STATUS = {};
const VEHICLE_STATUS = {};
```

## API

Do not place raw API calls throughout page components. Prefer:

``` js
const { data, isLoading } = useBookings(filters);
```

## Forms

Use React Hook Form for complex forms and keep validation separate from
presentation.

## Styling

Use centralized design tokens:

``` css
:root {
  --bg-primary: #04100b;
  --surface: #0a2117;
  --surface-elevated: #0e2b1e;
  --primary: #22c55e;
  --primary-dark: #15803d;
  --text-primary: #f2fff6;
  --text-muted: #789183;
  --border: rgba(255,255,255,0.08);
}
```

## Accessibility

Use semantic controls, labels, keyboard focus and accessible names for
icon-only actions. Never rely only on color to communicate status.

## Git Commits

``` text
feat: add vehicle verification table
fix: correct booking status rendering
refactor: extract shared status badge
style: update dashboard spacing
docs: update admin architecture
chore: update dependencies
```

## PR Checklist

-   Matches PRD.
-   API integration follows approved contract.
-   Loading/error/empty states exist.
-   Responsive behavior verified.
-   No secrets committed.
-   No avoidable console errors.
-   Shared components reused.
