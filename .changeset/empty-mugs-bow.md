---
'@backstage/core-plugin-api': patch
---

The authentication APIs are no longer `@alpha`. Since the `@backstage/core-plugin-api` has no `/alpha` entrypoint, the only effect of marking the APIs as `@alpha` was to hide them in documentation. They are still expected to be widely used and there will be a migration path if they are changed in the future.
