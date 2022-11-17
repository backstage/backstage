---
'@backstage/cli': patch
---

Switched the @backstage/cli eslint-factory to use require.resolve for dependencies in the generate ESLint configuration. This enables using eslint-factory with Yarn 3, which does not provide bin symlinks for transitive dependencies.
