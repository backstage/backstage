---
'@backstage/plugin-catalog-react': patch
---

The `EntityProcessingStatusPicker` now captures a `filter` analytics event for each processing status the user selects, with a `filter` attribute naming the entity filter it sets (`orphan` or `error`).
