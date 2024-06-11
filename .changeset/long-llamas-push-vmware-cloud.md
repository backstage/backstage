---
'@backstage/plugin-auth-backend-module-vmware-cloud-provider': minor
---

**BREAKING**: The `scope` config option have been removed and replaced by the standard `additionalScopes` config. In addition, `openid`, and `offline_access` scopes have been set to required and will always be present.
