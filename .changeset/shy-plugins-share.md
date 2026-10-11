---
'@backstage/backend-dynamic-feature-service': patch
---

Dynamic backend plugins can now load the packages they share with the backend when those packages are only installed in the backend package's `node_modules`, as with the pnpm `isolated` node linker. Packages that are available from the root `node_modules` are still loaded from there.
