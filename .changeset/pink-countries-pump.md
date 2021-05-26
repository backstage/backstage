---
'@backstage/plugin-catalog': minor
'@backstage/plugin-catalog-react': minor
---

The default `CatalogPage` has been reworked to be more composable and make
customization easier. This change only affects those who have replaced the
default `CatalogPage` with a custom implementation; others can safely ignore the
rest of this changelog.

If you created a custom `CatalogPage` to **add or remove tabs** from the
catalog, a custom page is no longer necessary. The fixed tabs have been replaced
with a `spec.type` dropdown that shows all available `Component` types in the
catalog.

For other needs, customizing the `CatalogPage` should now be easier. The new
[CatalogPage.tsx](https://github.com/backstage/backstage/blob/9a4baa74509b6452d7dc054d34cf079f9997166d/plugins/catalog/src/components/CatalogPage/CatalogPage.tsx)
shows the default implementation. Overriding this with your own, similar
`CatalogPage` component in your `App.tsx` routing allows you to adjust the
layout, header, and which filters are available.

See the documentation added on [Catalog
Customization](https://backstage.io/docs/features/software-catalog/catalog-customization)
for instructions.
