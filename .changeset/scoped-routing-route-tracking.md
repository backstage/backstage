---
'@backstage/core-app-api': patch
---

Backstage UI links and collections now use client-side navigation at their consuming route scope.

Apps with a custom `Router` that provides no React Router context now render without failing at startup. Navigation analytics are skipped while no router is present; apps using the default router are unaffected.

Legacy frontend app roots also preserve routing for separately bundled older Backstage UI components, including client-side navigation and active-route selection.
