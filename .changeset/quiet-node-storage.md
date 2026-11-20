---
'@backstage/cli-module-test-jest': patch
---

Fixed a warning about `localStorage` in tests that use the Node.js test environment on Node.js 25 and later. These Node.js versions define a `localStorage` global that only works with the `--localstorage-file` option, and libraries such as msw read it, which prints the warning. The global is now removed unless `--localstorage-file` is set on the command line or in `NODE_OPTIONS`. This works with Jest 29 and Jest 30.4 and later. Jest 30.0 to 30.3 still print the warning.
