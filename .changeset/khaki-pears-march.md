---
'@backstage/plugin-auth-backend': minor
---

**BREAKING**: All sign-in resolvers must now return a `token` in their sign-in result. Returning an `id` is no longer supported.
