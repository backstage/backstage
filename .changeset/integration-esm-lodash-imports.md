---
'@backstage/integration': patch
---

Fixed a bug that prevented this package from being imported in ESM projects. Importing it no longer fails because it no longer relies on named imports from a CommonJS dependency.
