---
'@backstage/core-components': patch
'@backstage/plugin-catalog-react': patch
---

- The `UserListPicker` now only overrides the user query parameters if the kind filter is either `group` or `user`
- The `SidebarSubmenuItem` component and `SidebarItem` component can now receive an optional prop `reloadDocument` which forces a remount of the page on click, resetting any state for that route
