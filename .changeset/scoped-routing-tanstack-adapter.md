---
'@backstage/plugin-tanstack-router-adapter': patch
---

Added a new package that provides `TanStackPageRouter`, a page router that renders new frontend system pages with TanStack Router. Attach it to a page's `router` input with `PageRouterBlueprint`, or register it as the app-wide default through `pageRouterApiRef`.

The adapter owns its own route tree scoped to the page's path, while browser history stays owned by the app. It receives the page's sub-pages as data and builds a TanStack route for each one, so it can host a tabbed page as well as a page that renders a single content element. A sub-page that picks a different router renders its own content with that library, so a TanStack page can host a React Router sub-page and vice versa.
