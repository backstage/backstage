---
'@backstage/plugin-tanstack-router-adapter': patch
---

Added a new package that provides `TanStackPageRouter`, a page router that renders new frontend system pages with TanStack Router. Attach it to a page's `router` input with `PageRouterBlueprint`, or register it as the app-wide default through `pageRouterApiRef`.

The adapter owns its own route tree scoped to the page's path, while browser history stays owned by the app. It cannot host React Router content, so it only supports pages that render a single content element, not pages built from sub-pages.
