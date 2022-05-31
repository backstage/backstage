---
'@backstage/plugin-techdocs': patch
'@backstage/plugin-user-settings': patch
'@techdocs/cli': patch
---

Updated sidebar-related logic to use `<SidebarPinStateProvider>` + `useSidebarPinState()` and/or `<SidebarOpenStateProvider>` + `useSidebarOpenState()` from `@backstage/core-components`.
