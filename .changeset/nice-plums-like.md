---
'@backstage/backend-defaults': minor
---

**BREAKING**: `coreServices.urlReader` now validates that redirect chains are subject to the allow list in `reading.allow` of your app config. If you were relying on redirects that pointed to URLs that were not allowlisted, you will now have to add those to your config as well.

Example:

```diff
 backend:
   reading:
     allow:
       - host: example.com
+      - host: storage-api.example.com
```
