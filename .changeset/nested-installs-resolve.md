---
'@backstage/cli': patch
'@backstage/cli-module-build': patch
'@backstage/cli-module-config': patch
'@backstage/cli-module-github': patch
'@backstage/cli-module-info': patch
'@backstage/cli-module-lint': patch
'@backstage/cli-module-maintenance': patch
'@backstage/cli-module-migrate': patch
'@backstage/cli-module-new': patch
'@backstage/cli-module-test-jest': patch
'@backstage/cli-module-translations': patch
---

Commands now tell the package manager workspace apart from the Backstage installation inside it, as groundwork for pnpm support. In a Yarn workspace both are the same directory, so nothing changes.
