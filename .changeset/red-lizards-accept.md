---
'@backstage/plugin-catalog-backend': minor
---

Add API endpoint for requesting a catalog refresh at `/refresh`, which is activated if a `RefreshService` is passed to `createRouter`.

The new method is used to trigger a refresh of an entity in an as localized was as possible, usually by refreshing the parent location.
