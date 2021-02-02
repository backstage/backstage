---
'@backstage/plugin-cloudbuild': patch
---

Migrate to new composability API, exporting the plugin instance as `cloudbuildPlugin`, the entity content as `EntityCloudbuildContent`, the entity conditional as `isCloudbuildAvailable`, and entity cards as `EntityLatestCloudbuildRunCard` and `EntityLatestCloudbuildsForBranchCard`.
