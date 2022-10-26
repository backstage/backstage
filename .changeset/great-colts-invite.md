---
'@backstage/cli': minor
---

Added a new ESLint rule that restricts imports of Link from @material-ui

The rule can be can be overridden in the following way:

```diff
module.exports = require('@backstage/cli/config/eslint-factory')(__dirname, {
+  restrictedImports: [
+    { name: '@material-ui/core', importNames: [] },
+    { name: '@material-ui/core/Link', importNames: [] },
+  ],
});
```
