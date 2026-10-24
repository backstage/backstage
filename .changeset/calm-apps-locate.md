---
'@backstage/plugin-app-node': patch
---

Added `resolveAppPackagePath`, which resolves a path in the app package that the backend serves. It also finds the app package when it is only installed in the `node_modules` of the backend package.
