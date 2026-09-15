---
'@backstage/core-compat-api': minor
---

`convertLegacyPageExtension` and `collectLegacyRoutes` now declare `ReactRouterV6PageRouter` from `@backstage/plugin-app-react-router-v6` on the pages they convert, so each converted page receives its own routing-library match. Converted legacy plugins therefore keep working without their authors changing anything.

A legacy page is a React Router v6 page by definition: the old frontend system mounts every page in a real v6 route tree, and `createRoutableExtension` calls `useRouteRef` from `@backstage/core-plugin-api` — which reads `useLocation` — before the page's own component renders. `collectLegacyRoutes` builds its pages out of v6 `<Routes>` directly, and a descendant `<Routes>` matches against the pathname left over by the route context above it, so with none it would match against the whole pathname and the page's own mount would leak into every splat below it.

The adapter is declared at the page and deliberately not in `compatWrapper`, `collectEntityPageContents`, or the entity card and content converters, which produce page _content_. An adapter there would re-scope to the page's own mount and drop the route match of the entity tab the content is rendered under, changing how that content's nested routes resolve.
