---
'@backstage/backend-plugin-api': minor
---

Added support for passing a file URL string, such as `import.meta.url`, to `resolvePackagePath` to resolve assets relative to the containing package without specifying its name. The nearest ancestor directory containing `package.json` is used as the package root.
