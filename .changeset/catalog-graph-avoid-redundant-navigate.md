---
'@backstage/plugin-catalog-graph': patch
---

Avoid redundant `navigate` calls in `useCatalogGraphPage` when the URL already matches the current state. This prevents an infinite update loop when used with `TestBrowserRouterProvider` in tests.
