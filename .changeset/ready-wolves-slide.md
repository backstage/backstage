---
'@backstage/ui': patch
---

Added `virtualized` prop to `Table` component for virtualized rendering of large datasets. Accepts `true` for default row height, `{ rowHeight: number }` for fixed height, or `{ estimatedRowHeight: number }` for variable height rows.
