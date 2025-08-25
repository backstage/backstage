---
'@backstage/plugin-catalog-backend-module-msgraph': minor
---

**BREAKING**: Encode query filters for requests made to msgraph. If you currently have manually encoded characters in a filter, this is a breaking change and must be updated to avoid requests being double encoded.

```diff
user:
-    filter: department in('MARKETING', 'RESEARCH %26 DEVELOPMENT')
+    filter: department in('MARKETING', 'RESEARCH & DEVELOPMENT')
```
