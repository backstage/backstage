---
'@backstage/frontend-defaults': minor
'@backstage/frontend-app-api': minor
---

**BREAKING**: Restructured some of option fields of `createApp` and `createSpecializedApp`.

- For `createApp`, all option fields _except_ `features` and `bindRoutes` have been moved into a new `advanced` object field.
- For `createSpecializedApp`, all option fields _except_ `features`, `config`, and `bindRoutes` have been moved into a new `advanced` object field.

This helps highlight that some options are meant to rarely be needed or used, and simplifies the usage of those options that are almost always required.

As an example, if you used to supply a custom config loader, you would update your code as follows:

```diff
 createApp({
   features: [...],
-  configLoader: new MyCustomLoader(),
+  advanced: {
+    configLoader: new MyCustomLoader(),
+  },
 })
```
