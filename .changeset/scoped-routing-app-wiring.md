---
'@backstage/frontend-app-api': patch
---

Simplifies the framework-owned app history for scoped plugin routing (RFC #33603): the internal navigation controller no longer mints per-page routing contracts, and no longer tracks programmatic back/forward state, namespaced adapter history state, or pre-navigation blockers. It now implements the thinner `AppHistoryApi` (`navigate`, `location$`, `createHref`) from `@backstage/frontend-plugin-api`. App wiring still uses `AppRouteSwitch` and `RouteTable` from `@backstage/frontend-plugin-api`.
