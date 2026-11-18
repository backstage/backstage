---
'@backstage/ui': patch
---

Tables using complete or offset pagination now show First and Last page controls by default. If a page jump fails, the current page remains available so the action can be retried.

**Affected components:** Table, TablePagination, `useTable`
