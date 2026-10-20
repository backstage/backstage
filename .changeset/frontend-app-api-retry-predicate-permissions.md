---
'@backstage/frontend-app-api': patch
---

The permission check for extension `if` predicates during app startup now retries network failures and 5xx responses, for up to about 15 seconds, instead of failing the whole app on the first error. This helps when the frontend comes up before the permission backend, and when a request is dropped during sign-in.
