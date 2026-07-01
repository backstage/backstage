---
'@backstage/ui': patch
---

Fixed Table not filling container width in Firefox when using `TableRoot` directly inside `ResizableTableContainer`. Changed `overflow: hidden` to `overflow: auto` on the resizable container so it handles scrolling for direct `TableRoot` usages, complementing the scroll container wrapper added in #34539 for the high-level `Table` component.
