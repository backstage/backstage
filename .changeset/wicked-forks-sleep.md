---
'@backstage/cli': minor
'@backstage/create-app': minor
---

Upgrading to lerna@4.0.0. This changes the interface for importing, and because we can't run multiple versions of lerna, this is a breaking change.

You'll need to update your root `package.json` like the following:

```diff
-     "lerna": "^3.20.2",
+     "lerna": "^4.0.0",
```
