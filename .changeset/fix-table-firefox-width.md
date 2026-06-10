---
'@backstage/ui': patch
---

Fixed the Table component not filling its container width in Firefox by moving `overflow: auto` behind a `data-virtualized` attribute so it only applies to virtualized tables.

Affected components: `Table`, `TableRoot`
