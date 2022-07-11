---
'@backstage/plugin-catalog-backend': patch
---

Many symbol declarations have been moved to `@backstage/plugin-catalog-node`. This has no affect on users of this package as they are all re-exported. Modules that build on top of the catalog backend plugin should switch all of their imports to the `@backstage/plugin-catalog-node` package and remove the dependency on `@backstage/plugin-catalog-backend`.
