---
'@backstage/plugin-catalog-backend': patch
---

Fixed the handling of optional locations so that the catalog no longer logs `NotFoundError`s for missing optional locations.
