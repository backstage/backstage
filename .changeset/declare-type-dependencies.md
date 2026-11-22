---
'@backstage/core-app-api': patch
'@backstage/integration-react': patch
'@backstage/theme': patch
'@backstage/plugin-api-docs': patch
'@backstage/plugin-catalog': patch
'@backstage/plugin-catalog-graph': patch
'@backstage/plugin-catalog-react': patch
'@backstage/plugin-config-schema': patch
'@backstage/plugin-home-react': patch
'@backstage/plugin-kubernetes': patch
'@backstage/plugin-kubernetes-cluster': patch
'@backstage/plugin-kubernetes-react': patch
'@backstage/plugin-org': patch
'@backstage/plugin-scaffolder-backend-module-cookiecutter': patch
'@backstage/plugin-signals-react': patch
---

Fixed published type declarations that imported packages not declared as dependencies, which could fail to resolve with package managers that don't hoist dependencies, such as pnpm.
