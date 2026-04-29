---
'@backstage/eslint-plugin': minor
---

Added a new `no-self-package-imports` lint rule, enabled as `error` in the recommended config, that reports when a package imports itself by its own name instead of using a relative path. This pattern causes circular initialization errors in bundled ESM and with `jest.requireActual`.
