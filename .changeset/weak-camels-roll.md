---
'@backstage/create-app': patch
---

Updated the root `package.json` to use the new `backstage-cli repo clean` command.

To apply this change to an existing project, make the following change to the root `package.json`:

```diff
-    "clean": "backstage-cli clean && lerna run clean",
+    "clean": "backstage-cli repo clean",
```
