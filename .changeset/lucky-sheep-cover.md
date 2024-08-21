---
'@backstage/backend-common': patch
---

The `legacyPlugin` and `makeLegacyPlugin` helpers now provide their own shim implementation of the identity and token manager services, as these services are being removed from the new backend system.
