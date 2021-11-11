---
'@backstage/plugin-home': patch
---

Add name option to `createCardExtension` to remove deprecation warnings for extensions without name. Name will be required for extensions in a future release of `core-plugin-api` and therefore also in `createCardExtension`.
