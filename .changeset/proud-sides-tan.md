---
'@backstage/ui': patch
---

Added support for custom pagination options in `useTable` hook and `Table` component. You can now configure `pageSizeOptions` to customize the page size dropdown, and hook into pagination events via `onPageSizeChange`, `onNextPage`, and `onPreviousPage` callbacks. When `pageSize` doesn't match any option, the first option is used and a warning is logged.

Affected components: Table, TablePagination
