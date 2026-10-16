---
'@backstage/cli-module-test-jest': patch
---

`jest-cli`, `jest-runtime` and the default Node.js test environment are now loaded through the installed `jest` package, so tests also run with strict `node_modules` layouts. An unsupported Jest version, or a missing `jest`, now fails with a clear error instead of a module resolution error.
