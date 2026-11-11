---
'@backstage/frontend-adapter-tanstack-router': minor
---

Added `TanStackPageRouter` for page-scoped TanStack routing with app-owned history, including `createTanStackPageRouter` and `TanStackPageContent` for plugin-owned route trees; `@tanstack/react-router` and `@tanstack/history` are peer dependencies. See the [1.57 migration notes](https://backstage.io/docs/frontend-system/architecture/migrations#157) for detailed migration steps and the [TanStack page router guide](https://backstage.io/docs/frontend-system/building-plugins/page-routers#use-tanstack-router) for setup, navigation blockers, and custom history requirements.
