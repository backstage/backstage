---
'@backstage/plugin-catalog-react': patch
---

The `entityRouteRef` is now a well-known route that should be imported directly from `@backstage/plugin-catalog-react`. It is guaranteed to be globally unique across duplicate installations of the `@backstage/plugin-catalog-react`, starting at this version.

Deprecated `entityRoute` in favor of `entityRouteRef`.

Deprecated `rootRoute` and `catalogRouteRef`. If you want to refer to the catalog index page from a public plugin you now need to use an `ExternalRouteRef` instead. For private plugins it is possible to take the shortcut of referring directly to `catalogPlugin.routes.indexPage` instead.
