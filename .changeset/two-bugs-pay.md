---
'@backstage/plugin-catalog-backend': patch
---

Changed `UrlReaderProcessor` to be less optimistic. It now emits a location entity for each found path in calls to `search()` so that entity pre-processors (such as `EntityPolicy.enforce`) have a chance to run on each found entity.
