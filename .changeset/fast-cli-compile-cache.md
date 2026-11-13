---
'@backstage/cli-module-actions': patch
'@backstage/cli-module-auth': patch
'@backstage/cli-module-build': patch
'@backstage/cli-module-catalog': patch
'@backstage/cli-module-config': patch
'@backstage/cli-module-github': patch
'@backstage/cli-module-info': patch
'@backstage/cli-module-lint': patch
'@backstage/cli-module-maintenance': patch
'@backstage/cli-module-migrate': patch
'@backstage/cli-module-new': patch
'@backstage/cli-module-package-manager-yarn': patch
'@backstage/cli-module-scaffolder': patch
'@backstage/cli-module-search': patch
'@backstage/cli-module-test-jest': patch
'@backstage/cli-module-translations': patch
'@backstage/cli': patch
'@backstage/repo-tools': patch
---

Faster startup for the CLI binaries, which now reuse Node.js's on-disk compile cache between runs. Set `NODE_DISABLE_COMPILE_CACHE=1` to turn it off or `NODE_COMPILE_CACHE` to change where it is stored.
