---
'@backstage/plugin-auth-backend-module-gcp-iap-provider': patch
---

Cache Google IAP public verification keys according to the response cache headers to reduce repeated key requests during authentication.
