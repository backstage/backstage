---
'@backstage/plugin-notifications': patch
---

The new frontend system plugin now provides a `nav-element:notifications` extension with the notifications sidebar item. List it in the `app/nav` config to show it, instead of rendering `NotificationsSidebarItem` in your sidebar by hand. Its config can turn web notifications, the title counter and the snackbar on or off.
