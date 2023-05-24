---
'@backstage/backend-app-api': patch
---

Switched startup strategy to initialize all plugins in parallel, as well as hook into the new startup lifecycle hooks.
