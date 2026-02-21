---
'@backstage/cli-common': patch
---

Added hierarchical caching to `findOwnDir`, avoiding redundant filesystem walks when `findPaths` is called from multiple locations within the same package.
