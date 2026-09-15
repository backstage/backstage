---
'@backstage/plugin-app-react-router-v6': minor
---

Added `ReactRouterV6PageRouter` for page-scoped React Router v6 routing with app-owned history. Render it inside a lazily loaded page or sub-page component to support relative links, nested routes, and route parameters. React Router v6 is a peer dependency.

The adapter renders children unchanged when no page mount or app history is available, supporting shared components in the old frontend system and standalone tests.

See the [page router guide](https://backstage.io/docs/frontend-system/building-plugins/page-routers#use-react-router-v6) for setup and nesting examples.
