---
'@backstage/plugin-catalog': minor
---

**BREAKING**:

- The `CatalogResultListItem` `result` prop is now of the more narrow and correct type `IndexableDocument`, rather than `any`.
- The individual table column factories (e.g. `createNameColumn`) are now no longer available directly, but only through `CatalogTable.columns`.
