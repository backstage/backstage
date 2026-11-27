---
'@backstage/backend-defaults': patch
---

Added a `subjectPattern` option to `jwks` external access entries, which restricts accepted tokens to those whose `sub` claim fully matches one of the given regular expressions. This makes it possible to safely trust shared OIDC issuers such as GitLab.com or GitHub Actions, where `issuer` and `audience` alone do not identify the caller.
