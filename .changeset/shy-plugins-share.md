---
'@backstage/backend-dynamic-feature-service': patch
---

Dynamic backend plugins can now load the packages they share with the backend when those packages are not in the root `node_modules`, as with the pnpm `isolated` node linker. The root `node_modules` is still searched first, and on Windows it is now found as on other platforms. The app package that the frontend config schemas of dynamic plugins are read from is also found when it is only installed in the `node_modules` of the backend package.
