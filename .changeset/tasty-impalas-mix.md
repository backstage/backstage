---
'@backstage/plugin-catalog-backend': patch
---

Fixed an issue where internal references in the catalog would stick around for longer than expected, causing entities to not be deleted or orphaned as expected.
