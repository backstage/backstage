---
'@backstage/ui': patch
---

Fixed the Table component not filling its container width in Firefox. The `overflow: auto` property was incorrectly set on the `<table>` element — per the CSS spec, Firefox applies this to the anonymous table wrapper box, causing it to shrink-wrap to content width. The property has been removed; horizontal scrolling for resizable tables continues to work correctly via the `ResizableTableContainer` wrapper.
