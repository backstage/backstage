---
'@backstage/plugin-auth-backend': patch
---

**DEPRECATION**: The `AuthProviderFactoryOptions` type has been deprecated, as the options are now instead inlined in the `AuthProviderFactory` type. This will make it possible to more easily introduce new options in the future without a possibly breaking change.
