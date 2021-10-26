---
'@backstage/config': patch
'@backstage/core-app-api': patch
'@backstage/core-plugin-api': patch
'@backstage/plugin-scaffolder-backend': patch
---

Start using the new `@backstage/types` package. Initially, this means using the `Observable` and `Json*` types from there. The types also remain in their old places but deprecated, and will be removed in a future release.
