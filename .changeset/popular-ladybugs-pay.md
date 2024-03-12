---
'@backstage/core-components': patch
'@backstage/plugin-catalog-react': patch
---

- The `SidebarSubmenuItem` component and `SidebarItem` component can now receive an optional prop `reloadDocument` which forces a remount of the page on click, resetting any state for that route
