---
'@backstage/frontend-test-utils': patch
'@backstage/plugin-app': patch
'@backstage/plugin-app-module-user-settings': patch
'@backstage/plugin-permission-react': patch
'@backstage/plugin-scaffolder': patch
---

Declared missing runtime and peer dependencies, so these packages work with package managers that don't hoist dependencies, such as pnpm.
