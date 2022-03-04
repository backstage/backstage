---
'@backstage/catalog-model': minor
'@backstage/plugin-catalog-backend': minor
---

**BREAKING**: Removed the deprecated `metadata.generation` field entirely. It is no longer present in TS types, nor in the REST API output. Entities that have not yet been re-stitched may still have the field present for some time, but it will get phased out gradually by your catalog instance.
