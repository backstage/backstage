---
'@backstage/cli': patch
---

Internal refactor to split `loadCliConfig` into separate implementations for the build and config CLI modules, removing a cross-module dependency.
