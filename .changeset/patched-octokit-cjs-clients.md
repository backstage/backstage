---
'@backstage/backend-defaults': patch
'@backstage/integration': patch
'@backstage/plugin-catalog-backend-module-github': patch
'@backstage/plugin-catalog-import': patch
---

Update the GitHub REST client to a CommonJS-compatible version with patched
pagination and request dependencies. Update GitHub App authentication dependencies
while preserving existing credential configuration and token caching.
