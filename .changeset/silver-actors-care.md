---
'@backstage/plugin-catalog-react': patch
---

Fixed an issue where `<CatalogFilterLayout.Filters />` would re-render its children on page load for smaller screens, potentially leading to unnecessary additional backend requests.
