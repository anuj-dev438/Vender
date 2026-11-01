# Country Drive — Frontend Design System

## Design direction
Premium mobility brand: refined, modern, confident and glossy without sacrificing readability. Use existing brand assets if available. Default palette may use deep forest green, emerald, warm off-white and restrained glass surfaces.

## Color tokens
```css
:root {
  --bg-primary: #06120D;
  --bg-secondary: #0A1B13;
  --surface: #0E2419;
  --surface-elevated: #142F22;
  --primary: #22C55E;
  --primary-hover: #16A34A;
  --primary-soft: #16452E;
  --text-primary: #F4FFF7;
  --text-secondary: #B7CBBE;
  --text-muted: #82988A;
  --border: rgba(255,255,255,0.10);
  --success: #22C55E;
  --warning: #F59E0B;
  --danger: #EF4444;
  --info: #38BDF8;
}
```
Adapt to the existing project brand rather than blindly overriding it. Provide readable light surfaces when customer-facing pages require them.

## Typography
Use the existing font if defined. Otherwise use Montserrat for headings and UI with a reliable sans-serif fallback. Avoid too many font weights and sizes.

## Glossy buttons
- Primary: polished emerald gradient or subtle top highlight, clear label, restrained shadow.
- Secondary: elevated dark/light surface with border.
- Outline: transparent surface and clear border.
- Destructive: accessible red styling.
- Include hover, focus-visible, active, loading, disabled and icon states.
- Use motion sparingly (about 150–220ms); respect reduced-motion preferences.
- Do not make every button glow or animate continuously.

## Surfaces
- Cards: 12–20px radius, consistent padding, subtle border/shadow.
- Glass effect only for overlays, hero accents and selected premium surfaces; avoid low-contrast glass for dense text.
- Forms and tables must prioritize contrast and scanability.
- Use consistent status badges, but never communicate status by color alone.

## Layout
- Desktop: full navigation/sidebar as appropriate and content max-width.
- Tablet: adaptive grid and compact navigation.
- Mobile: drawer/bottom navigation where appropriate, stacked forms/cards and no accidental horizontal overflow.
- Keep page headings, primary actions and filters consistently placed.

## Core components
Button, IconButton, Input, Textarea, Select, DateTimePicker, Checkbox, Radio, Card, Badge, Table, Pagination, Tabs, Dropdown, Modal, Drawer, Toast, Alert, Skeleton, EmptyState, ErrorState, ConfirmDialog, FileUpload, VehicleCard, PriceBreakdown, BookingStatusTimeline.

## Images
Use properly licensed/project-provided vehicle images. Preserve aspect ratios, lazy-load non-critical images and provide meaningful alt text. Avoid broken remote image dependencies.

## Responsive checkpoints
Test at widths near 360, 390, 768, 1024 and 1440 CSS pixels. Verify navigation, tables, dialogs, forms, vehicle cards and booking summaries at each width.

## Accessibility
Semantic HTML, associated labels, visible focus, keyboard operability, adequate contrast, reduced motion, descriptive icon-only buttons and accessible status announcements.
