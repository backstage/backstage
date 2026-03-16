---
'@backstage/ui': patch
---

Improved the `Table` component loading state to show a skeleton UI with visible headers instead of plain "Loading..." text. The table now renders its full structure during loading, with animated skeleton rows in place of data. The loading state includes proper accessibility support with `aria-busy` on the table and screen reader announcements.

Affected components: Table
