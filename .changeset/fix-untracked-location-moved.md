---
'@backstage/plugin-catalog-backend': patch
---

Fixed an issue where SCM `location.moved` events would generate new locations in the database for files that were not actively tracked.
