---
'@backstage/create-app': patch
---

Switched required engine from Node.js 12 or 14, to 14 or 16.

To apply these changes to an existing app, switch out the following in the root `package.json`:

```diff
   "engines": {
-    "node": "12 || 14"
+    "node": "14 || 16"
   },
```

Also get rid of the entire `engines` object in `packages/backend/package.json`, as it is redundant:

```diff
-  "engines": {
-    "node": "12 || 14"
-  },
```
