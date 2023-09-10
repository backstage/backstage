---
'@backstage/plugin-auth-backend': patch
---

Added `authPlugin` export for the new backend system. The plugin does not include any built-in auth providers, they must instead be added by installing additional modules, for example `authModuleGoogleProvider` from `@backstage/plugin-auth-backend-module-google-provider`.
