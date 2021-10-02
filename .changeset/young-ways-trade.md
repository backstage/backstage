---
'@backstage/create-app': patch
---

Switched the default `test` script in the package root to use `backstage-cli test` rather than `lerna run test`. This is thanks to the `@backstage/cli` now supporting running the test command from the project root.

To apply this change to an existing project, apply the following change to your root `package.json`:

```diff
-    "test": "lerna run test --since origin/master -- --coverage",
+    "test": "backstage-cli test",
```
