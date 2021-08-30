---
'@backstage/plugin-catalog': patch
---

Update the `AboutCard` to properly support non-standard entity types and rework the defaults for the build-in kinds.

This change also uses `useElementFilter(...)` instead of `React.children.count(...)` in `AboutField` to properly recognize whether children are available.
