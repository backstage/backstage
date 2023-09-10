---
'@backstage/create-app': patch
---

Added a `fix` scripts that calls the new `backstage-cli repo fix` command.

To apply this change to an existing app, make the following change to your root `package.json`:

```diff
     "test": "backstage-cli repo test",
     "test:all": "backstage-cli repo test --coverage",
+    "fix": "backstage-cli repo fix",
     "lint": "backstage-cli repo lint --since origin/master",
```
