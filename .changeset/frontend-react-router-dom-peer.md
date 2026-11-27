---
'@backstage/frontend-test-utils': patch
'@backstage/plugin-permission-react': patch
---

Added `react-router-dom` (`^6.30.2`) as a peer dependency. Their dependencies already required it from the app, and declaring it lets package managers that don't hoist dependencies, such as pnpm, pass the app's copy on.
