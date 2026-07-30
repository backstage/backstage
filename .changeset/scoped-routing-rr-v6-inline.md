---
'@backstage/plugin-app': patch
---

Moves the default React Router v6 page routing adapter in-tree (`plugins/app/src/routing/reactRouterV6`) instead of depending on `@backstage/plugin-react-router-v6-adapter`. The adapter no longer compiles library-agnostic route descriptor trees — it only injects React Router context for opaque `children` (existing `react-router-dom` `<Routes>` / `<Route>` trees). This is an internal implementation detail and does not change the app plugin's public API.
