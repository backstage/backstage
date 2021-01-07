---
'@backstage/create-app': patch
---

Bump `sqlite3` to v5.

To apply this change to an existing app, change the version of `sqlite3` in the `dependencies` of `packages/backend/package.json`:

```diff
     "pg": "^8.3.0",
-    "sqlite3": "^4.2.0",
+    "sqlite3": "^5.0.0",
     "winston": "^3.2.1"
```

Note that the `sqlite3` dependency may not be preset if you chose to use PostgreSQL when creating the app.
