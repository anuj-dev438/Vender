# Country Drive --- Project Rules

1.  The manager PRD is the functional source of truth.
2.  Do not invent business rules when the PRD is silent; mark them
    `TBD`.
3.  Pricing and financial calculations stay server-side.
4.  Backend is the final authority for vehicle availability.
5.  Frontend RBAC is not a security boundary.
6.  All API access goes through the centralized service/query layer.
7.  Reuse shared components before creating duplicates.
8.  Every async operation has loading, success and error feedback.
9.  Every destructive operation requires confirmation.
10. Sensitive admin and financial actions must remain auditable.
11. Use exact backend state values in code and map them to display
    labels centrally.
12. Use shared date, currency and percentage formatters.
13. Large tables should support pagination and appropriate
    filtering/search.
14. Forms must prevent duplicate submission and show server validation
    errors.
15. Do not place large data transformations or business logic inside
    JSX.
16. Do not commit secrets, tokens or private keys.
17. Preserve responsive behavior for desktop, tablet and mobile.
18. Update documentation when requirements or assumptions change.
