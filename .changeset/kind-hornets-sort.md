---
'@backstage/plugin-auth-backend-module-guest-provider': patch
---

This provider will now reject authentication attempts rather than halt backend startup when `dangerouslyAllowOutsideDevelopment` is not set in production.
