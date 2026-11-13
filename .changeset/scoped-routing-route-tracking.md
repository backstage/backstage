---
'@backstage/core-app-api': patch
---

Backstage UI links and collections now use client-side navigation at their consuming route scope, and apps with a custom `Router` that provides no React Router context render without failing at startup. See the [1.57 migration notes](https://backstage.io/docs/frontend-system/architecture/migrations#157) for detailed migration steps.
