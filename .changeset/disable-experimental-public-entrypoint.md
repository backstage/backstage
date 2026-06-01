---
'@backstage/plugin-app-backend': patch
---

Added a new `app.disablePublicEntryPoint` config option that allows you to opt out of the automatic public sign-in entry point. When set to `true`, the app backend will skip serving the public entry point to unauthenticated users, even if the app was bundled with an `index-public-experimental` entry point.
