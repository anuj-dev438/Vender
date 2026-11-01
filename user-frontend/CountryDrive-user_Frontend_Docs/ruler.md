# Country Drive — Project Rules for AI Coding Agents

1. Read `features.md`, `PRD.md`, `architecture.md`, `Design.md`, `Task.md`, `coding-standard.md` and `API_INTEGRATION.md` before implementation.
2. This assignment is frontend-only. The backend is being developed by another person.
3. Do not build a new backend, database, payment server or verification server unless explicitly requested.
4. Inspect the existing repository before changing it; preserve its framework and working features.
5. Implement all documented frontend pages and feature states. Do not stop at a landing page or visual prototype.
6. Use the API service layer. Never hardcode endpoint URLs throughout components.
7. If the backend contract is unknown, create a clearly documented adapter/interface and list the exact question for the backend developer. Do not invent production contracts.
8. Development mock data must be isolated, labelled and switchable. Never silently use mock data in production.
9. Never pretend an unavailable API action succeeded.
10. Do not calculate authoritative pricing, availability, permissions, payment status, commission or settlement solely in the browser.
11. Never expose secrets, tokens, private environment variables or sensitive user documents.
12. Build responsive layouts for mobile, tablet and desktop.
13. All buttons, links, forms, tabs, filters and navigation must have meaningful behavior.
14. Include loading, empty, error, success and permission states.
15. Reuse design-system components; maintain consistent glossy button styles without harming accessibility.
16. Do not remove documented features to simplify implementation.
17. Run build/lint/tests available in the project and fix introduced errors.
18. Report what was completed, what is backend-blocked, what was tested and what remains.
19. Do not claim a feature is complete just because its page exists.
20. When documents conflict, follow the main product PRD and explicitly flag unresolved business rules.
