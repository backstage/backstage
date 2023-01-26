---
'@backstage/plugin-catalog-backend': patch
---

Switched the order of reprocessing statements retroactively in migrations. This only improves the experience for those who at a later time perform a large upgrade of an old Backstage installation.
