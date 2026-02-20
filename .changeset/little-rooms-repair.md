---
'@backstage/backend-defaults': minor
---

Issue the backstage-auth cookie as host to avoid cross-subdomain conflicts. Legacy domain-scoped cookies are cleared when re-issuing/clearing the cookie.
