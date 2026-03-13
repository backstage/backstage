---
'@backstage/ui': patch
---

Added a `loading` prop and `data-loading` data attribute to `TableRoot`, allowing consumers to distinguish between stale data and initial loading states. Both `stale` and `loading` set `aria-busy` on the table.

Affected components: TableRoot
