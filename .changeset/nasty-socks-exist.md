---
'@backstage/create-app': patch
---

Switched the `file:` dependency for a `link:` dependency in the `backend` package. This makes sure that the `app` package is linked in rather than copied.

To apply this update to an existing app, make the following change to `packages/backend/package.json`:

```diff
   "dependencies": {
-    "app": "file:../app",
+    "app": "link:../app",
     "@backstage/backend-common": "^{{version '@backstage/backend-common'}}",
```
