---
'@backstage/plugin-kubernetes-backend': minor
---

Remove the deprecated `@backstage/backend-common`.

This resulted in a breaking change to the interface of `createRouter`. Users have to now provide `auth: AuthService` and `httpAuth: HttpAuthService`.
