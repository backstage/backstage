---
'@backstage/core-app-api': patch
'@backstage/frontend-defaults': patch
---

The default config loader no longer requires `process.env.APP_CONFIG` to be set, allowing config to be read from other sources instead.
