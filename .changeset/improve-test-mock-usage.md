---
'@backstage/plugin-scaffolder-react': patch
'@backstage/plugin-scaffolder': patch
'@backstage/plugin-catalog': patch
'@backstage/plugin-catalog-react': patch
'@backstage/plugin-catalog-import': patch
'@backstage/plugin-catalog-graph': patch
'@backstage/plugin-kubernetes-react': patch
'@backstage/plugin-user-settings': patch
'@backstage/core-components': patch
'@backstage/core-plugin-api': patch
'@backstage/frontend-plugin-api': patch
'@backstage/test-utils': patch
---

Refactored tests to use the new `mockApis` utilities from `@backstage/test-utils`. Tests now use `mockApis.alert()`, `mockApis.featureFlags()`, and `mockApis.error()` instead of creating custom mock implementations, improving consistency and maintainability across the codebase.
