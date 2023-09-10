---
'@backstage/backend-app-api': patch
---

The experimental backend feature discovery now only considers default exports from packages. It no longer filters packages to include based on the package role, except that `'cli'` packages are ignored. However, the `"backstage"` field is still required in `package.json`.
