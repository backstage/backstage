---
'@backstage/cli': patch
---

Introduced the `--alwaysYarnPack` flag on `backstage-cli build-workspace`, which can be passed in cases where accuracy of workspace contents is more important than the
speed with which the workspace is built. Useful in rare situations where `yarn pack` and `npm pack` produce different results.
