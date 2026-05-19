---
'@backstage/plugin-catalog-backend-module-msgraph': minor
'@backstage/plugin-catalog-backend-module-msgraph-incremental': minor
---

**BREAKING**: Disabled user accounts are now filtered out by default. The provider automatically applies an `accountEnabled eq true` filter, combining it with any custom `user.filter` you provide. If you previously included `accountEnabled eq true` in your user filter, it is safe to remove it, but leaving it in will not cause any issues.
