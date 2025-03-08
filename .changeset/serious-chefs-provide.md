---
'@backstage/core-components': patch
---

Avoid Layout Shift for DismissableBanner when using a storageApi with latency (e.g. user-settings-backend)

Properly handle the `unknown` state of the storageApi. There's a trade-off: this may lead to some Layout Shift if the banner has not been dismissed, but once it has been dismissed, you won't have any.
