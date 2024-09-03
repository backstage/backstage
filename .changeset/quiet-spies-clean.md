---
'@backstage/plugin-catalog-graph': patch
---

Fixed a bug in the `CatalogGraphPage` component where, after clicking on some nodes, clicking the back button would break the navigation. This issue caused the entire navigation to fail and behaved differently across various browsers.
