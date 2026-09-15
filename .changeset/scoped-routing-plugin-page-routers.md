---
'@backstage/plugin-api-docs': patch
'@backstage/plugin-auth': patch
'@backstage/plugin-catalog': patch
'@backstage/plugin-catalog-graph': patch
'@backstage/plugin-catalog-import': patch
'@backstage/plugin-catalog-react': patch
'@backstage/plugin-catalog-unprocessed-entities': patch
'@backstage/plugin-home': patch
'@backstage/plugin-notifications': patch
'@backstage/plugin-scaffolder': patch
'@backstage/plugin-search': patch
'@backstage/plugin-techdocs': patch
'@backstage/plugin-user-settings': patch
---

New frontend system pages that use React Router now declare `ReactRouterV6PageRouter` in their loaders. Their relative links, route parameters and nested routes continue to use the page's own mount. The old frontend system is unchanged.
