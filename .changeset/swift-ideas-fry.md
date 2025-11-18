---
'@backstage/core-plugin-api': minor
---

All route references are now forwards compatible with the new frontend system, i.e. `@backstage/frontend-plugin-api`. This means they no longer need to be converted with `convertLegacyRouteRef` or `convertLegacyRouteRefs` from `@backstage/core-compat-api`.
