---
'@backstage/core-app-api': patch
---

Translation snapshots now provide a usable `t` function while language resources are loading. It uses the existing translation instance's available messages, installed overrides, and language fallbacks, with the usual formatting support. The `ready` flag still indicates whether the selected language's resources have finished loading.
