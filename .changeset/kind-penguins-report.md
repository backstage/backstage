---
'@backstage/plugin-auth-backend': patch
---

Allow CookieConfigurer to optionally return the SameSite cookie attribute. Return `SameSite=None` in `defaultCookieConfigurer` for secure contexts to allow cookies to be included in third-party requests.
