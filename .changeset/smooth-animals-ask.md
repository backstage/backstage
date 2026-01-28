---
'@backstage/plugin-catalog': patch
---

Migrated `CatalogTable` component from Material Table (`@backstage/core-components`) to React Aria Table (`@backstage/ui`). Updated all column definitions from `TableColumn` to `ColumnConfig`, replaced Material UI components (`Typography`, `IconButton`, `Chip`) with Backstage UI equivalents (`Text`, `ButtonIcon`, `TagGroup`/`Tag`), and modernized icons using Remix Icons. All pagination modes (client-side, offset, cursor) are preserved and fully functional.
