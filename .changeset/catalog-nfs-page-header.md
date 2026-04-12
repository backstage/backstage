---
'@backstage/plugin-catalog': patch
---

Exported the NFS variant of the catalog index page as `CatalogIndexPage` from the `./alpha` entry point, along with supporting types `CatalogIndexPageProps`, `CatalogTableRow`, and `CatalogTableColumnsFunc`. This allows adopters to use and customize the catalog index page within a `PageBlueprint` in the new frontend system.
