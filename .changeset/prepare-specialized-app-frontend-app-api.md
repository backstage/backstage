---
'@backstage/frontend-app-api': patch
---

Added `prepareSpecializedApp` for two-phase app wiring so apps can render a bootstrap tree before full app finalization. The bootstrap phase now supports deferred `app/root.elements`, predicate-gated APIs, reusable `sessionState`, and warnings for bootstrap-visible predicates or bootstrap code that accessed APIs that only became available after finalization. Utility APIs that are materialized during bootstrap are also frozen for the lifetime of the app instance, causing deferred overrides of those APIs to be ignored and reported as app errors.
