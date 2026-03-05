---
'@backstage/plugin-catalog': minor
---

Added support for group alias IDs and configurable content ordering on the entity page. Groups can now declare `aliases` so that content targeting an aliased group is included in the group. A new `defaultContentOrder` option (default `title`) controls how content items within each group are sorted, with support for both a page-level default and per-group overrides.
