---
'@backstage/core-app-api': patch
'@backstage/frontend-app-api': patch
---

The app is now aware of if it is being served from the `app-backend` with a separate public and protected bundles. When in protected mode the app will now continuously refresh the session cookie, as well as clear the cookie if the user signs out.
