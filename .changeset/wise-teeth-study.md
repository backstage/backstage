---
'@backstage/plugin-catalog-backend-module-azure': minor
---

The `isCloud` function now also checks if hostname is visualstudio.com or ends with .visualstudio.com along with dev.azure.com

```diff
- const isCloud = (host: string) => host === 'dev.azure.com';
+ const isCloud = (host: string) => {
+   if (host === 'dev.azure.com') {
+     return true;
+   }
+
+   if (host === 'visualstudio.com' || host.endsWith('.visualstudio.com')) {
+     return true;
+   }
+
+   return false;
+ };
```
