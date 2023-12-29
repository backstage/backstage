---
'@backstage/backend-common': patch
---

Use sha256 instead of md5 for hash key calculation in caches

This can have a side effect of invalidating caches (when cache key was >250 characters)
This improves compliance with FIPS nodejs
