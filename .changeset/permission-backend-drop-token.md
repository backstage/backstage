---
'@backstage/plugin-permission-backend': patch
---

The permission backend no longer populates the removed `token` and `identity` fields on `PolicyQueryUser`, and no longer calls `auth.getPluginRequestToken()` during policy evaluation. This removes one internal round-trip per authorize request.
