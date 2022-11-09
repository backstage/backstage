---
'@backstage/create-app': patch
---

Switched Node.js version to support version 16 & 18, rather than 14 & 16. To switch the Node.js version in your own project, apply the following change to the root `package.json`:

```diff
   "engines": {
-    "node": "14 || 16"
+    "node": "16 || 18"
   },
```

As well as the following change to `packages/app/package.json`:

```diff
-    "@types/node": "^14.14.32",
+    "@types/node": "^16.11.26",
```
