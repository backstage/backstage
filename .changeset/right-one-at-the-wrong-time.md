---
'@backstage/plugin-techdocs': patch
'@backstage/plugin-user-settings': patch
'@techdocs/cli': patch
---

Updated sidebar-related logic to use `<SidebarPinStateContextProvider>` + `useSidebarPinState()` and/or `<SidebarContextProvider>` + `useSidebar()` from `@backstage/core-components`.
