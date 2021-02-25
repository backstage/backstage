---
'@backstage/core-api': patch
'@backstage/core': patch
---

Added support for optional external route references. By setting `optional: true` when creating an `ExternalRouteRef` it is no longer a requirement to bind the route in the app. If the app isn't bound `useRouteRef` will return `undefined`.
