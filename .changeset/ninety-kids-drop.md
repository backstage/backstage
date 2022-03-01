---
'@backstage/plugin-catalog-react': minor
---

Removed some previously deprecated `routeRefs` as follows:

- **BREAKING**: Removed `entityRoute` in favor of `entityRouteRef`.
- **BREAKING**: Removed the previously deprecated `rootRoute` and `catalogRouteRef`. If you want to refer to the catalog index page from a public plugin you now need to use an `ExternalRouteRef` instead. For private plugins it is possible to take the shortcut of referring directly to `catalogPlugin.routes.indexPage` instead.
