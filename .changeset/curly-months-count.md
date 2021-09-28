---
'@backstage/plugin-catalog-backend': patch
---

Fixed a bug where internal references within the catalog were broken when new entities where added through entity providers, such as registering a new location or adding one in configuration. These broken references then caused some entities to be incorrectly marked as orphaned and prevented refresh from working properly.
