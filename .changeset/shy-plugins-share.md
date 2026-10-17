---
'@backstage/backend-dynamic-feature-service': patch
---

Dynamic backend plugins can now load the packages they share with the backend when those packages are not in the root `node_modules`, as with the pnpm `isolated` node linker. They are found through the backend package and through this package. With the default pnpm hoisting this reaches every package of the backend. With `hoist: false`, only the direct dependencies of the backend package and of this package are found. The root `node_modules` and `NODE_PATH` are still searched first, so a module that was found before is found in the same place, and on Windows the root `node_modules` is now found as on other platforms. The app package that the frontend config schemas of dynamic plugins are read from is also found when it is only installed in the `node_modules` of the backend package.
