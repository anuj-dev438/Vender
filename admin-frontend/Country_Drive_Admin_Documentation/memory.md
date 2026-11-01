# Country Drive --- Project Memory

## Identity

-   Project: Country Drive / Vehicle Rental Marketplace
-   Module: Admin Panel
-   Frontend choice: React.js
-   Theme: Dark Green
-   Font: Montserrat
-   Source: Manager-provided Vehicle Rental Marketplace PRD v1.0

## Business

-   Self-drive cars and two-wheelers.
-   Pay-as-you-go + subscriptions.
-   Hours, KM or packaged Hours + KM.
-   Platform commission: 20%.
-   Owner share: 80%.
-   KYC + facial verification/liveness.
-   Backend-authoritative availability.

## Roles

Customer, Vehicle Owner, Admin, optional Operations/Support.

## Vehicle States

`DRAFT`, `PENDING_VERIFICATION`, `APPROVED`, `ACTIVE`, `MAINTENANCE`,
`SUSPENDED`, `REJECTED`.

## KYC States

`PENDING`, `UNDER_REVIEW`, `VERIFIED`, `REJECTED`, `EXPIRED`.

## Booking States

`PENDING_PAYMENT`, `CONFIRMED`, `UPCOMING`, `PICKUP_PENDING`, `ACTIVE`,
`RETURN_PENDING`, `INSPECTION`, `COMPLETED`, `CANCELLED`, `DISPUTED`,
`EXPIRED`.

## Refund States

`REQUESTED`, `PROCESSING`, `COMPLETED`, `FAILED`, `PARTIALLY_REFUNDED`.

## Admin Modules

Dashboard, Users, Owners, KYC, Vehicles, Vehicle Verification, Bookings,
Pricing, Subscriptions, Payments, Refunds, Finance, Settlements,
Support, Notifications, Reports, Audit Logs, Settings.

## Technical Direction

Frontend: React.js, Vite, React Router, React Hook Form, TanStack Query,
Recharts, Lucide React and approved styling system.

Manager PRD backend recommendation: Node.js + TypeScript + Fastify,
PostgreSQL, Drizzle ORM, Redis, object storage, payment provider, maps
and notification providers.

## Financial Rule

``` text
Booking Revenue
├── 20% Platform
└── 80% Vehicle Owner
```

The exact commission base for taxes, discounts, deposits and penalties
is a business rule to finalize.

## Design Memory

Dark green/forest green UI, emerald primary actions, near-black
surfaces, subtle borders, light text, amber warnings and red destructive
states.

## Engineering Constraints

-   Backend owns pricing calculations.
-   Backend owns availability.
-   Booking price snapshot is immutable.
-   Booking overlap must be prevented transactionally.
-   Financial data needs a ledger layer.
-   Server-side RBAC is mandatory.
-   Payment success must be verified through provider/webhook data.
-   Sensitive admin/financial actions must be audited.
-   Do not invent undefined business rules.
