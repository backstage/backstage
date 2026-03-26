---
'@backstage/ui': patch
---

Fixed `useCompletePagination` not updating `pageSize` when `defaultPageSize` changes after initial render, which caused tables to be stuck showing 1 row until data loaded.
