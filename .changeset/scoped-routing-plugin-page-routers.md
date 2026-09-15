---
'@backstage/plugin-auth': patch
'@backstage/plugin-catalog': patch
'@backstage/plugin-scaffolder': patch
'@backstage/plugin-techdocs': patch
---

Pages with nested React Router routes now declare `ReactRouterV6PageRouter` inside their lazily loaded React components. Their blueprint modules no longer import the adapter, so the routing library loads with the page. Existing page and sub-page route scopes are preserved.
