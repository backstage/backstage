---
'@backstage/plugin-app-tanstack-router': patch
---

Use TanStack's native history behavior for page navigation and push or replace blockers while sharing the app's navigation timeline. Custom app histories must expose location updates synchronously after push or replace. Numeric traversal remains asynchronous.
