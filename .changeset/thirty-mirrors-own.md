---
'@backstage/ui': patch
---

The Table component now wraps the react-aria-components `Table` with a `ResizableTableContainer` only if any column has a width property set. This means that column widths can adapt to the content otherwise (if no width is explicitly set).

Affected components: Table
