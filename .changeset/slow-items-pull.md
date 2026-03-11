---
'@backstage/create-app': patch
---

Replace deprecated `workspaces.packages` with `workspaces` in `package.json`

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
