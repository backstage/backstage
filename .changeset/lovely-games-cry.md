---
'@backstage/plugin-auth-react': patch
---

When using `CookieAuthRefreshProvider` or `useCookieAuthRefresh`, a 404 response from the cookie endpoint will now be treated as if cookie auth is disabled and is not needed.
