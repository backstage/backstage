---
'@backstage/core-plugin-api': patch
---

A new `defaultTarget` option has been added to `createExternalRouteRef`. This allows one to specify a default target of the route by name, for example `'catalog.catalogIndex'`, which will be used if the target route is present in the app and there is no explicit route binding.
