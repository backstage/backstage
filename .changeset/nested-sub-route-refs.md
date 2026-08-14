---
'@backstage/frontend-plugin-api': patch
---

Added support for using a `SubRouteRef` as the parent of another `SubRouteRef`. Nested sub-routes inherit parameters from their complete ancestor chain while keeping each path relative to its immediate parent.
