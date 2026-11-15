---
'@backstage/frontend-adapter-react-router-v6': minor
---

Added `ReactRouterV6PageRouter` for page-scoped React Router v6 routing with app-owned history; React Router v6 is a peer dependency. Render it inside a lazily loaded page or sub-page component to support relative links, nested routes, and route parameters. See the [1.57 migration notes](https://backstage.io/docs/frontend-system/architecture/migrations#157) for detailed migration steps and the [page router guide](https://backstage.io/docs/frontend-system/building-plugins/page-routers#use-react-router-v6) for setup and nesting examples.
