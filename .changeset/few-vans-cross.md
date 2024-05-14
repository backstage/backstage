---
'@backstage/backend-common': patch
---

Plugins created through the `legacyPlugin` helper are now able to authenticate requests from plugins that are fully implemented using the new backend system. This fixes the `Key for the ES256 algorithm must be one of type KeyObject or CryptoKey. Received an instance of Uint8Array` error.
