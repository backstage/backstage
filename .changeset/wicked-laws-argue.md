---
'@backstage/core-components': patch
---

SidebarSubmenuItem: add support for external links

`SidebarSubmenuItemProps` takes an optional `href` prop which add support for external links.

It isn't possible anymore to specify `to` and `dropdownItems` props at the same time.
