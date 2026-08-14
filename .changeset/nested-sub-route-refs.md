---
'@backstage/frontend-plugin-api': patch
---

Added support for using a `SubRouteRef` as the parent of another `SubRouteRef`. Child paths are combined with ancestor paths at creation, and nested sub-routes inherit parameters from their complete ancestor chain.
