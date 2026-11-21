---
'@backstage/plugin-catalog-backend-module-openapi': patch
'@backstage/plugin-catalog-backend-module-unprocessed': patch
'@backstage/plugin-proxy-backend': patch
'@backstage/plugin-scaffolder-backend-module-yeoman': patch
---

Declared the peer dependencies that their dependencies require, so these packages work with package managers that don't hoist dependencies, such as pnpm.
