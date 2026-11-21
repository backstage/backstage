---
'@backstage/cli-defaults': patch
'@backstage/cli-module-build': patch
'@backstage/cli-module-maintenance': patch
'@backstage/cli-module-test-jest': patch
---

Declared dependencies and peer dependencies that these packages previously only got through hoisting, so that they also work with package managers that don't hoist dependencies, such as pnpm.
