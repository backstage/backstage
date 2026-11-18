---
'@backstage/core-components': patch
---

Added an optional `isActive` prop to `SidebarItem` and `SidebarSubmenuItem` that replaces the default active state matching, making it possible to highlight items based on the query string, hash or any other part of the location.
