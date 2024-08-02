---
'@backstage/core-app-api': patch
---

The request to delete the session cookie when running the app in protected mode is now done with a plain `fetch` rather than `FetchApi`. This fixes a bug where the app would immediately try to sign-in again when removing the cookie during logout.
