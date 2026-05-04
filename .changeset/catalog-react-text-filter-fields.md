---
'@backstage/plugin-catalog-react': minor
---

Added a new `CatalogColumnBlueprint` for contributing columns to the v2 catalog index page. Each column declares its cell renderer, plus optional catalog field paths used for server-side sort (`orderField`) and full-text search (`searchFields`). The header descriptor and cell renderer are exposed as the new `catalogColumnHeaderDataRef` and `catalogColumnCellDataRef` extension data refs.

Widened `EntityTextFilter`'s constructor to also accept an array of the form `[term, ...fields]` to override which catalog fields are searched server-side. Existing string usage is unchanged.
