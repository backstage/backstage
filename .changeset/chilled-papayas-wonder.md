---
'@backstage/plugin-auth-backend': patch
---

Fixed a bug where providers that tracked the granted scopes through a cookie would not take failed authentication attempts into account.
