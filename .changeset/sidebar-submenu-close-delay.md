---
'@backstage/core-components': patch
---

A `SidebarItem` that contains a `SidebarSubmenu` now honors the `closeDelayMs` prop on `Sidebar`. Previously the expanded menu closed immediately when the pointer left the parent item, so moving the pointer diagonally toward one of its entries often dismissed it before it could be clicked. When `closeDelayMs` is set, the expanded menu stays open for the configured delay after the pointer leaves, and the close is cancelled if the pointer returns. The default is unchanged (`0`, close immediately), so existing behavior is preserved unless `closeDelayMs` is set.
