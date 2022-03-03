---
'@backstage/cli': patch
---

The CLI now bundles both version 16 and 17 of the patched `@hot-loader/react-dom` dependency, and selects the appropriate one based on what version of `react-dom` is installed within the app.
