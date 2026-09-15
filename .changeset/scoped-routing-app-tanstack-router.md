---
'@backstage/plugin-app-tanstack-router': minor
---

Added `TanStackPageRouter` for page-scoped TanStack routing with app-owned history. Use `createTanStackPageRouter` and `TanStackPageContent` to integrate a plugin-owned route tree.

Install `@tanstack/react-router@1.131.2` and `@tanstack/history@1.131.2` alongside the adapter. Without a page mount or app history, the adapter renders children unchanged.

See the [TanStack page router guide](https://backstage.io/docs/frontend-system/building-plugins/page-routers#use-tanstack-router) for setup, navigation blockers, and custom history requirements.
