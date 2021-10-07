---
'@backstage/integration': patch
'@backstage/backend-common': patch
'@backstage/plugin-catalog-backend-module-ldap': patch
'@backstage/plugin-catalog-backend-module-msgraph': patch
'@backstage/plugin-catalog-import': patch
---

Replace slash stripping regexp with trimEnd to remove CodeQL warning
