---
'@backstage/plugin-techdocs-backend': patch
---

A `DefaultTechDocsCollatorFactory`, which works with the new stream-based
search indexing subsystem, is now available. The `DefaultTechDocsCollator` will
continue to be available for those unable to upgrade to the stream-based
`@backstage/search-backend-node` (and related packages), however it is now
marked as deprecated and will be removed in a future version.

To upgrade this plugin and the search indexing subsystem in one go, check
[this changelog](https://github.com/backstage/backstage/blob/master/packages/create-app/CHANGELOG.md)
for necessary changes to your search backend plugin configuration.
