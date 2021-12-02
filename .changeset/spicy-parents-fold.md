---
'@backstage/create-app': patch
---

Updated the root `package.json` to include files with `.cjs` and `.mjs` extensions in the `"lint-staged"` configuration.

The make this change to an existing app, apply the following changes to the `package.json` file:

```diff
 "lint-staged": {
-    "*.{js,jsx,ts,tsx}": [
+    "*.{js,jsx,ts,tsx,mjs,cjs}": [
```
