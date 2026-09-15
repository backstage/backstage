---
'@backstage/plugin-app-tanstack-router': minor
---

Added a new package that provides `TanStackPageRouter`, a page router that renders new frontend system pages with TanStack Router. Render it inside the lazily loaded component of each page or sub-page whose content should get a TanStack context.

The adapter owns a route tree scoped to the mount of whatever declared it, while browser history stays owned by the app. It renders the content it is given inside that tree, and builds no routes for sub-pages, since the framework's own matching decided which sub-page is showing. Declaring it in a sub-page's React component scopes it to that sub-page rather than to the page above. Adapters from different routing libraries nest rather than replace one another, so a TanStack tab sits beside a React Router tab of the same page without either standing down.

Use `createTanStackPageRouter` to bind a plugin-owned TanStack route tree, and place `TanStackPageContent` in that tree where the page element should render. Nested TanStack routes then work normally while sharing the app-owned browser history.

Custom app histories can navigate without private history metadata. Adapter-initiated synchronous traversal retains its action. Without entry metadata, back availability and entry-based restoration are limited; the adapter does not infer a browser stack from visited URLs.
