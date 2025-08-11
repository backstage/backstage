---
'@backstage/plugin-app': patch
---

Added a new module for implementing public sign-in apps, exported as `appModulePublicSignIn` via the `/alpha` sub-path export. This replaces the `createPublicSignInApp` export from `@backstage/frontend-defaults`, which is now deprecated.
