---
'@backstage/core-app-api': patch
---

Switched out the `GithubAuth` implementation to use the common `OAuth2` implementation. This relies on the simultaneous change in `@backstage/plugin-auth-backend` that enabled access token storage in cookies rather than the current solution that's based on `LocalStorage`.

> **NOTE:** Make sure you upgrade the `auth-backend` deployment before or at the same time as you deploy this change.
