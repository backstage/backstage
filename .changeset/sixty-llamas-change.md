---
'@backstage/plugin-catalog-backend': patch
'@backstage/plugin-jenkins-backend': patch
'@backstage/plugin-search-backend': patch
---

Fixed issue in `PermissionEvaluator` instance check that would cause unexpected "invalid union" errors.
