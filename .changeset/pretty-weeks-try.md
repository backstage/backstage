---
'@backstage/plugin-catalog': patch
---

Fixed a crash in the catalog export when an entity list filter is `undefined`, which could occur if optional filters were not set.
