---
'@backstage/core-plugin-api': patch
---

Added a new `defaultTarget` option to `createExternalRouteRef`. I lets you specify a default target of the route by name, for example `'catalog.catalogIndex'`, which will be used if the target route is present in the app and there is no explicit route binding.
