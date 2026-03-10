---
'@backstage/integration': patch
---

Fixed Azure integration config schema visibility annotations to use per-field `@visibility secret` instead of `@deepVisibility secret` on parent objects, so that non-secret fields like `clientId`, `tenantId`, `organizations`, and `managedIdentityClientId` are no longer incorrectly marked as secret.
