---
'@backstage/ui': patch
---

Added `isPending` prop to Alert, Button, ButtonIcon, Table, and TableRoot as a replacement for the `loading` prop, aligning with React Aria naming conventions. The `loading` prop is now deprecated but still supported as an alias. CSS selectors now use `data-ispending` instead of `data-loading` for styling pending states; `data-loading` is still emitted for backward compatibility but will be removed alongside the `loading` prop.

**Affected components:** Alert, Button, ButtonIcon, Table, TableRoot
