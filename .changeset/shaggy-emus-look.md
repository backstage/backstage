---
'@backstage/core-app-api': patch
---

Fixed an issue where valid SAML and GitHub sessions would be considered invalid and not be stored.

Deprecated the `SamlSession` and `GithubSession` types.
