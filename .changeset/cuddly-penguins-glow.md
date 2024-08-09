---
'@backstage/plugin-catalog-backend': patch
---

`ProcessorOutputCollector` returns an error when receiving deferred entities that have an invalid `metadata.annotations` format.

This allows to return an error on an actual validation issue instead of reporting that the location annotations are missing afterwards, which is misleading for the users.
