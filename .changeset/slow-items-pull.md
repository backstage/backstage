---
'@backstage/create-app': patch
---

Replace `package.json` deprecated `workspaces.packages` by `workspaces`

This change is **not** required, but you can edit your main `package.json`, to fit the more modern & more common pattern:

```diff
-  "workspaces": {
-    "packages": [
   "workspaces": [
     "packages/*",
     "plugins/*"
-     ]
-   },
  ],
```
