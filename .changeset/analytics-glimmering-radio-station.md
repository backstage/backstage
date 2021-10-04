---
'@backstage/cli': patch
---

The `create-plugin` command now passes the extension name via the `name` key
in `createRoutableExtension()` calls in newly created plugins.
