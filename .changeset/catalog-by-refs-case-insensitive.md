---
'@backstage/plugin-catalog-backend': patch
---

The `entities/by-refs` endpoint now resolves entity references case-insensitively, matching `entities/by-name` and the documented entity reference contract where receivers treat refs case-insensitively. Previously, a ref whose casing differed from the stored lowercased ref returned `null`. Fixes #36743.
