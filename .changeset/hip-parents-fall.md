---
'@backstage/ui': patch
---

Added support for disabling pagination in `useTable` complete mode by setting `paginationOptions: { type: 'none' }`. This skips data slicing and produces `pagination: { type: 'none' }` in `tableProps`, removing the need for consumers to manually override the pagination prop on `Table`. Also fixed complete mode not reacting to dynamic changes in `paginationOptions.pageSize`.

**Affected components:** `useTable`
