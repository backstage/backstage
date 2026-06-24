---
'@backstage/plugin-catalog': patch
---

**BREAKING ALPHA**: Migrated the new frontend system Catalog entity page to the automatic Catalog plugin header and a BUI page header with entity tags, title, metadata, favorite and context-menu actions, and Catalog-composed navigation.

Existing alpha opaque entity header customizations continue to render through a temporary per-entity legacy fallback with the previous MUI tabs and page shell. Migrate those customizations to the new BUI-ready entity header layout extension point to receive composed tabs and the active tab ID. The new extension point wins when both customization types match an entity.

The default BUI navigation does not render entity-content tab icons because the BUI Header tab API does not expose an icon slot. Legacy fallback pages retain their existing tab-icon behavior.

Added the translation keys `entityLabels.systemLabel`, `entityLabels.domainLabel`, and `entityLabels.partOfLabel`. Apps that provide Catalog translations should add translations for these new messages.
