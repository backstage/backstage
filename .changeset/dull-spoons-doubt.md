---
'@backstage/create-app': patch
---

Removed usage of the deprecated `diff` command in the root `package.json`.

To make this change in an existing app, make the following change in the root `package.json`:

```diff
-    "diff": "lerna run diff --",
```
