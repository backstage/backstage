---
'@backstage/frontend-plugin-api': patch
---

Optimized `MakeSortedExtensionsMap` to accept extension tuples directly, avoiding an expensive `UnionToArray` conversion that caused O(n²) type instantiations when `createFrontendPlugin` was called with many inline extensions.
