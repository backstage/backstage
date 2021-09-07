---
'@backstage/plugin-auth-backend': minor
'@backstage/plugin-config-schema': patch
---

Update `passport-saml` to `3.1.0` to resolve [CVE-2021-39171](https://github.com/advisories/GHSA-5379-r78w-42h2).

BREAKING CHANGE: As part of this change, the `auth.saml.cert` config parameter is now required.
