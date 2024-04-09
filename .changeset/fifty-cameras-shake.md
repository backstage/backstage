---
'@backstage/plugin-auth-react': minor
---

**BREAKING**: Removed the path option from `CookieAuthRefreshProvider` and `useCookieAuthRefresh`.

A new `CookieAuthRedirect` component has been added to redirect a public app bundle to the protected one when using the `app-backend` with a separate public entry point.
