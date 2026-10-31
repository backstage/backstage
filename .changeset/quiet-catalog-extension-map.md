---
'@backstage/frontend-app-api': patch
---

Added `app.extension`, an object keyed by extension ID for overriding extension settings across configuration files without changing extension order. Its settings take precedence over `app.extensions`, which continues to control ordering. A `config` object supplied in `app.extension` replaces the configuration from `app.extensions` rather than merging with it.
