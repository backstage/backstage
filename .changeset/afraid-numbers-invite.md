---
'@backstage/repo-tools': minor
---

Updates the OpenAPI client template to support the new format for identifying plugin ID. You should now use `info.title` like so,

```diff
info:
+    title: yourPluginId
-    title: @internal/plugin-*-backend

servers:
  - /
- - yourPluginId
```
