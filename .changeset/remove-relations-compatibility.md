---
'@backstage/plugin-catalog-backend': major
---

**BREAKING**: Removed the deprecated `catalog.enableRelationsCompatibility` config option and its associated compatibility layer. Entity relations are now always returned in the standard format with only `targetRef`. If you were relying on the `target` field in relations, update your code to use `targetRef` instead.
