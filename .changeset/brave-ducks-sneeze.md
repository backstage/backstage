---
'@backstage/plugin-catalog': patch
'@backstage/plugin-catalog-react': patch
---

Fixed incorrect entity count displayed in catalog table header when client-side filtering is applied. The count now uses the same calculation hooks as the sidebar (useStarredEntitiesCount, useOwnedEntitiesCount, useAllEntitiesCount) to ensure header and sidebar counts always match. This fixes the issue where entities with the same name in different namespaces caused inaccurate favorite/starred counts.
