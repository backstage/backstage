---
'@backstage/plugin-app': patch
---

Registers the default React Router v6 page router via `pageRouterApiRef` when a page or subpage leaves the `router` input empty. Top-level pages are selected through the navigation controller. App chrome receives a residual root React Router projection from the navigation controller so existing react-router-dom imports keep working under the new history owner. Page headers resolve tab and breadcrumb targets from the page routing contract.
