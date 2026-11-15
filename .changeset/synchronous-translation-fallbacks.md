---
'@backstage/core-app-api': patch
---

Translation snapshots now provide `t` while resources are loading, using available messages and language fallbacks. Check `ready` before rendering to wait for the selected language.
