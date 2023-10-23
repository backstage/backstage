---
'@backstage/frontend-app-api': minor
---

Added the ability to configure bound routes through `app.routes.bindings`. The routing system used by `createApp` has been replaced by one that only supports route refs of the new format from `@backstage/frontend-plugin-api`. The requirement for route refs to have the same ID as their associated extension has been removed.
