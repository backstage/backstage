---
'@backstage/plugin-catalog-backend-module-azure': patch
---

visualstudio.com domains are now supported along with dev.azure.com

```diff
+ const isCloud = (host: string) => {
+   if (host === 'dev.azure.com') {
+     return true;
+   }
+
+   if (host.endsWith('.visualstudio.com')) {
+     return true;
+   }
+
+   return false;
+ };
```
