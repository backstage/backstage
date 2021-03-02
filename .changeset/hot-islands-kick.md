---
'@backstage/plugin-proxy-backend': patch
---

Added a verification for well formed URLs when processing proxy targets. Otherwise users gets a cryptic error message thrown from Express which makes it hard to debug.
