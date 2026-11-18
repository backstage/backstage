---
'@backstage/core-components': patch
---

`SidebarSubmenuItem` now accepts optional `children` on link-style items, and dropdown entries accept optional `secondaryAction`, for a right-side secondary action slot (for example an external link icon), matching `SidebarItem`. `children` is not rendered on items that use `dropdownItems`. Dropdown entry labels now inherit the navigation color on hover, matching other submenu items.
