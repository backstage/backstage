---
'@backstage/cli-module-build': minor
---

**BREAKING**: Updated the frontend bundler to Rspack 2. The `LEGACY_WEBPACK_BUILD` fallback is unchanged. Production bundles are smaller, as Rspack 2 removes more unused code by default.

The new Rspack dev server dropped the `path` and `logLevel` options of the `proxy` configuration in `package.json`. Rename `path` to `context`, and remove `logLevel`, which no longer has an effect. Both are still accepted for now and log a warning.

The `EXPERIMENTAL_LAZY_COMPILATION` environment variable now enables lazy compilation in the frontend dev server. With Rspack it had no effect before.
