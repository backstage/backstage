---
'@backstage/plugin-app-react': patch
---

Kept `AnalyticsImplementationBlueprint` dependencies synchronous when utility APIs
opt in to async loading, preserving synchronous analytics initialization.
