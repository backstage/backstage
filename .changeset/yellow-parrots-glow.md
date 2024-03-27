---
'@backstage/plugin-catalog': patch
---

`CatalogIndexPage` now uses `EntitySearchBar` for text-based filtering of entities, saving the search text in the query parameters and debouncing the server requests.
