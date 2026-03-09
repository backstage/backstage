---
'@backstage/plugin-catalog-react': minor
---

Added `EntityDataTable` component for rendering entity data in a BUI Table, and `EntityRelationCard` component for displaying related entities in a card with built-in data fetching. These replace `EntityTable` and `RelatedEntitiesCard` (from `@backstage/plugin-catalog`) respectively, providing a unified BUI-based pattern for entity table cards. Column presets (`componentColumnConfig`, `systemColumnConfig`, etc.) are included for common entity types.
