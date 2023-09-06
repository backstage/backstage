---
'@backstage/create-app': patch
---

Added the new `repo fix` command to the project too.

To apply this change to an existing app, make the following change to your root `package.json`:

```diff
     "test": "backstage-cli repo test",
     "test:all": "backstage-cli repo test --coverage",
+    "fix": "backstage-cli repo fix",
     "lint": "backstage-cli repo lint --since origin/master",
```
