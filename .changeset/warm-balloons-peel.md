---
'@backstage/catalog-model': patch
'@backstage/cli-common': patch
'@backstage/core-components': patch
'@backstage/integration': patch
'@backstage/test-utils-core': patch
'@backstage/plugin-badges': patch
'@backstage/plugin-catalog': patch
'@backstage/plugin-catalog-react': patch
'@backstage/plugin-cost-insights': patch
'@backstage/plugin-home': patch
'@backstage/plugin-ilert': patch
'@backstage/plugin-kubernetes': patch
'@backstage/plugin-search': patch
'@backstage/plugin-shortcuts': patch
'@backstage/plugin-sonarqube': patch
'@backstage/plugin-user-settings': patch
'@backstage/plugin-xcmetrics': patch
---

Avoid usage of `.to*Case()`, preferring `.toLocale*Case('en-US')` instead.
