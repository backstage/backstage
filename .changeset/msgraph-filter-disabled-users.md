---
'@backstage/plugin-catalog-backend-module-msgraph': minor
'@backstage/plugin-catalog-backend-module-msgraph-incremental': minor
---

Disabled user accounts are now always filtered out. The provider applies an `accountEnabled eq true` filter automatically and combines it with any custom `user.filter` you provide.
