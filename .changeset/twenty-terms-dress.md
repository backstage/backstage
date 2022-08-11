---
'@backstage/create-app': patch
---

Updated backend to write stack trace when the backend fails to start up.

To apply this change to your Backstage installation, make the following change to `packages/backend/src/index.ts`

```diff
    cors:
    origin: http://localhost:3000
-    console.error(`Backend failed to start up, ${error}`);
+    console.error('Backend failed to start up', error);
```
