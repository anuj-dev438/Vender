# Country Drive — Frontend Coding Standards

## General
- Follow the existing repository conventions first.
- Use focused functional React components and hooks.
- Keep files small enough to understand and reuse.
- Do not rewrite working modules without a reason.
- Use clear names and avoid unexplained abbreviations.
- Prefer existing dependencies over adding overlapping libraries.

## Component organization
- Shared visual components belong in `components/ui`.
- Shared layouts belong in `components/layout`.
- Domain-specific components stay inside their feature folder.
- Keep page composition separate from API service functions.
- Avoid large components containing routing, fetching, forms and business rules together.

## API calls
- Never scatter raw fetch/axios calls across page components.
- Use domain service functions and shared query hooks.
- Normalize errors and use a consistent response model.
- Keep base URL in environment configuration.
- Never put private keys or provider secrets in frontend code.
- Do not fake successful mutations when the backend is unavailable.

## Forms
- Use consistent validation and accessible labels.
- Display field-level errors and server errors.
- Disable duplicate submission while a request is pending.
- Preserve user input on recoverable errors.
- Keep validation rules separate from presentation where practical.

## State
- Server state belongs in TanStack Query or the established data layer.
- Local UI state belongs in component state.
- Use context sparingly for global session and shell state.
- Do not treat local storage as authoritative for booking, payment, role or financial state.

## Styling
- Use shared design tokens and component variants.
- Avoid scattered arbitrary colors and inconsistent radii.
- Ensure responsive behavior and visible focus states.
- Use motion sparingly and support reduced-motion preferences.

## Accessibility
- Use semantic HTML.
- Every form control has a label.
- Icon-only buttons have accessible names.
- Keyboard focus is visible.
- Status is communicated by text/icon as well as color.
- Dialogs and menus support keyboard interaction.

## Error handling
Every API-driven page should handle loading, empty, error, unauthorized, forbidden, not-found and offline/network states where relevant.

## Security
- Frontend route guards are not authorization.
- Do not log tokens or sensitive personal/financial/KYC data.
- Never claim payment success without trusted backend confirmation.
- Avoid rendering untrusted content as HTML.
- Upload validation must be backed by server validation.

## Suggested commit prefixes
`feat:`, `fix:`, `refactor:`, `style:`, `test:`, `docs:`, `chore:`.
