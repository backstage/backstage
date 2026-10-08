---
'@backstage/plugin-app-tanstack-router': minor
---

Added `TanStackPageRouter` for page-scoped TanStack routing with app-owned history. Use `createTanStackPageRouter` and `TanStackPageContent` to integrate a plugin-owned route tree.

Native TanStack APIs and BUI controls share app-absolute paths, including cross-plugin destinations from route refs. BUI controls also support TanStack-relative navigation inside the adapter. Custom router factories receive `routePaths` to mount their route tree; keep `basepath` at `/` so absolute destinations remain relative to the app root.

Install `@tanstack/react-router@1.131.2` and `@tanstack/history@1.131.2` alongside the adapter. Without a page mount or app history, the adapter renders children unchanged.

See the [TanStack page router guide](https://backstage.io/docs/frontend-system/building-plugins/page-routers#use-tanstack-router) for setup, navigation blockers, and custom history requirements.

The adapter supplies the public contextual navigation contract for any component library, including BUI, without depending on BUI at runtime.
