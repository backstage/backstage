---
'@backstage/plugin-auth-node': patch
---

Browsers silently drop cookies that exceed 4KB, which can be problematic for refresh tokens and other large cookies.This update ensures that large cookies, like refresh tokens, are not dropped by browsers, maintaining the integrity of the authentication process. The changes include both the implementation of the cookie splitting logic and corresponding tests to validate the new functionality.
