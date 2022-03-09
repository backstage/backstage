---
'@backstage/create-app': patch
---

Updated template to use package roles. To apply this change to an existing app, check out the [migration guide](https://backstage.io/docs/tutorials/package-role-migration).

Specifically the following scripts in the root `package.json` have also been updated:

```diff
-    "build": "lerna run build",
+    "build": "backstage-cli repo build --all",

...

-    "lint": "lerna run lint --since origin/master --",
-    "lint:all": "lerna run lint --",
+    "lint": "backstage-cli repo lint --since origin/master",
+    "lint:all": "backstage-cli repo lint",
```
