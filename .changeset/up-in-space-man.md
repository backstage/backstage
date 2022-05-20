---
'@backstage/core-components': patch
---

The `SidebarPinStateContext` and `SidebarContext` have been deprecated and will be removed in a future release. Instead, use `<SidebarPinStateProvider>` + `useSidebarPinState()` and/or `<SidebarOpenStateProvider>` + `useSidebarOpenState()`.

This was done to ensure that sidebar state can be shared successfully across components exported by different packages, regardless of what version of this package is resolved and installed for each individual package.
