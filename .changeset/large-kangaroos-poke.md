---
'@backstage/create-app': patch
---

Added an explicit `node-gyp` dependency to the root `package.json`. This is to work around a bug in older versions of `node-gyp` that causes Python execution to fail on macOS.

You can add this workaround to your existing project by adding `node-gyp` as a `devDependency` in your root `package.json` file:

```diff
   "devDependencies": {
+    "node-gyp": "^9.0.0"
   },
```
