---
'@backstage/frontend-plugin-api': minor
---

**BREAKING**: All types of route refs are always considered optional by `useRouteRef`, which means the caller must always handle a potential `undefined` return value. Related to this change, the `optional` option from `createExternalRouteRef` has been removed, since it is no longer necessary.

This is released as an immediate breaking change as we expect the usage of the new route refs to be extremely low or zero, since plugins that support the new system will still use route refs and `useRouteRef` from `@backstage/core-plugin-api` in combination with `convertLegacyRouteRef` from `@backstage/core-compat-api`.
