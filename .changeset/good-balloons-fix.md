---
'@backstage/frontend-plugin-api': patch
---

Add an `ExtensionBoundary.lazy` function to create properly wrapped lazy-loading enabled elements, suitable for use with `coreExtensionData.reactElement`. The page blueprint now automatically leverages this.
