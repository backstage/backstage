---
'@backstage/plugin-app-tanstack-router': patch
---

Added a new package that provides `TanStackPageRouter`, a page router that renders new frontend system pages with TanStack Router. Attach it to a page's `router` input with `PageRouterBlueprint`, or register it as the app-wide default through `pageRouterApiRef`.

The adapter owns a route tree scoped to the page's path, while browser history stays owned by the app. It renders whatever content the page is showing inside that tree, so it can host a tabbed page as well as a page that renders a single content element. A sub-page that attaches a different router renders its own content with that library, so a TanStack page can host a React Router sub-page and the other way round.

Use `createTanStackPageRouter` to bind a plugin-owned TanStack route tree, and place `TanStackPageContent` in that tree where the page element should render. Nested TanStack routes then work normally while sharing the app-owned browser history.
