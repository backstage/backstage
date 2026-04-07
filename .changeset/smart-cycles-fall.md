---
'@backstage/plugin-catalog-react': patch
---

Fixed entity relation cards (e.g., "Has components") only showing one entity at a time by using `paginationOptions: { type: 'none' }` instead of deriving page size from data length.
