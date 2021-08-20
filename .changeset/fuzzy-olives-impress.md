---
'@backstage/core-components': patch
'@backstage/plugin-catalog': patch
'@backstage/plugin-shortcuts': patch
'@backstage/plugin-user-settings': patch
---

Add `MobileSidebar` component & use it for smaller screens to improve the UX on mobile devices by switching to a navigation at the bottom of the screen. For customizing the experience you can group `SidebarItems` in a `SidebarGroup` or create a `SidebarGroup` with a link. For an example take a look at the `Root.tsx` or the updated ["Adding a plugin page to the Sidebar"](https://backstage.io/docs/getting-started/configure-app-with-plugins) documentation.
