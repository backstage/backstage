---
'@backstage/create-app': patch
---

Updated the root `test` scripts to use `backstage-cli repo test`.

To apply this change to an existing app, make the following change to the root `package.json`:

```diff
-    "test": "backstage-cli test",
-    "test:all": "lerna run test -- --coverage",
+    "test": "backstage-cli repo test",
+    "test:all": "backstage-cli repo test --coverage",
```
