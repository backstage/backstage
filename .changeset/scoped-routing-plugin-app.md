---
'@backstage/plugin-app': minor
---

Pages and sub-pages now share app-owned navigation and can use different routing libraries. Existing pages retain implicit React Router v6 routing with development warnings, and the app shell keeps its compatibility context.

**BREAKING**: Removed the `router` input from `app/root`. Remove root router extensions, move global providers to `AppRootWrapperBlueprint`, and use page adapters where needed. See the [app migration guide](https://backstage.io/docs/frontend-system/building-apps/migrating#components).

Page tabs and breadcrumbs use app-absolute paths and include deployment prefixes. Backstage UI navigation outside page adapters accepts app-absolute destinations, query/hash targets, and external URLs. Relative destinations require an adapter. Page content stays mounted across shell re-renders and navigation within the same page. Explicit page paths take precedence over colliding sub-page routes and produce a warning.
