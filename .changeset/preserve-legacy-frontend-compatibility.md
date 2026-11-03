---
'@backstage/core-plugin-api': patch
---

Made the legacy icon component and `withApis` compatibility APIs independent of `@backstage/frontend-plugin-api` so that they remain available to legacy frontend apps.

Deprecated `withApis`. Wrap class components in a function component that uses `useApi` instead.
