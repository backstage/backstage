---
'@backstage/plugin-catalog-backend': patch
---

Fixes a bug where eagerly deleted entities did not properly trigger re-stitching of entities that they had relations to.
