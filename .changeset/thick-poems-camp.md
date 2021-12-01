---
'@backstage/core-app-api': patch
---

Fixed a bug where `useRouteRef` would fail in situations where relative navigation was needed and the app was is mounted on a sub-path. This would typically show up as a failure to navigate to a tab on an entity page.
