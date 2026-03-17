---
'@backstage/frontend-plugin-api': patch
---

Added support for `if` predicates on `createFrontendPlugin` and `createFrontendModule`, applying shared conditions to every extension in the feature. Plugin and extension overrides can now also replace or remove existing `if` predicates.
