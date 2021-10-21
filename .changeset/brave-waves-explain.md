---
'@backstage/create-app': patch
---

Removed the included `jest` configuration from the root `package.json` as the `transformModules` option no longer exists.

To apply this change to an existing app, make the follow change to the root `package.json`:

```diff
-  "jest": {
-    "transformModules": [
-      "@asyncapi/react-component"
-    ]
-  }
```
