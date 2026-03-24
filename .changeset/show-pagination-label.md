---
'@backstage/ui': patch
---

Added `showPaginationLabel` prop to `TablePagination` and `useTable` pagination options. When set to `false`, the pagination label (e.g., "1 - 20 of 150") is hidden while navigation controls remain visible. Defaults to `true`.

**Affected components:** `TablePagination`, `useTable`
