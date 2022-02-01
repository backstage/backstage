---
'@backstage/create-app': patch
---

Switched the `app` dependency in the backend to use a file target rather than version.

To apply this change to an existing app, make the following change to `packages/backend/package.json`:

```diff
   "dependencies": {
-    "app": "0.0.0",
+    "app": "file:../app",
```
