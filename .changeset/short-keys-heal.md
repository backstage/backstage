---
'@backstage/plugin-catalog-graph': patch
---

Fixed an issue causing the `CatalogGraphCard` to redraw its content whenever the parent component re-renders, resulting in flickering.
