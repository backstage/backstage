---
'@backstage/backend-dynamic-feature-service': patch
---

Dynamic backend plugins can now require the packages they share with the backend when those packages are not in the root `node_modules`, as with the pnpm `isolated` node linker. They are found through the backend package and through this package. With the default pnpm hoisting, this includes the packages that pnpm hoists into `node_modules/.pnpm/node_modules`. With `hoist: false`, only the direct dependencies of the backend package and of this package are found. Everything that was searched before is still searched first, so a module that was found before is found in the same place. The exception is plugins inside the Backstage root on Windows, which did not search the root `node_modules` before, other than through `NODE_PATH`. It is now searched in the same order as on other platforms.
