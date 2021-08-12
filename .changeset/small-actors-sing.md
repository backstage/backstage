---
'@backstage/create-app': patch
---

Switched `@types/react-dom` dependency to of the app package to request `*` rather than a specific version.

To apply this change to an existing app, change the following in `packages/app/package.json`:

```diff
-    "@types/react-dom": "^16.9.8",
+    "@types/react-dom": "*",
```
