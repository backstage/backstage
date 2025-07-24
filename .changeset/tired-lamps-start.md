---
'@backstage/create-app': patch
---

Updated the `better-sqlite` dependency from `v9.0.0` to `v13.0.0`. You can apply this change to your instance by applying the following change to your `packages/backend/package.json` and running `yarn install`.

```diff
  "dependencies": {
    "app": "link:../app",
-    "better-sqlite3": "^9.0.0",
+    "better-sqlite3": "^12.0.0",
    "node-gyp": "^10.0.0",
    "pg": "^8.11.3"
  }
```
