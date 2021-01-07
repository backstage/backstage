---
'@backstage/create-app': patch
---

Removed the Circle CI sidebar item, since the target page does not exist.

To apply this change to an existing app, remove `"CircleCI"` sidebar item from `packages/app/src/sidebar.tsx`, and the `BuildIcon` import if it is unused.
