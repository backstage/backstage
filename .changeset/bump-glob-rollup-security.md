---
'@backstage/plugin-catalog-backend': patch
'@backstage/cli-module-auth': patch
'@backstage/cli-module-build': patch
'@backstage/cli-module-test-jest': patch
'@backstage/cli': patch
'@backstage/ui': patch
'@backstage/repo-tools': patch
---

Bumped `glob` dependency from v7/v8/v11 to v13 to address security vulnerabilities in older versions. Bumped `rollup` from v4.27 to v4.59+ to fix a high severity path traversal vulnerability (GHSA-mw96-cpmx-2vgc).
